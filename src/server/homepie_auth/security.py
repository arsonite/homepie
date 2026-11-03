# Copyright (C) 2024-2025 Burak Günaydin
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, version 3 of the License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.

"""
Server side sessions and brute force protection.

The browser only holds a random token. The server keeps the SHA-256 of it, so a leaked sessions.json cannot be
used to log in. Sessions slide: every use pushes the idle expiry back, up to an absolute maximum lifetime.
"""

from __future__ import annotations

import hashlib
import json
import os
import secrets
import tempfile
import threading
import time
from collections import defaultdict, deque
from dataclasses import asdict, dataclass
from pathlib import Path

# Sliding the expiry does not need to hit the disk every time
PERSIST_INTERVAL_SECONDS = 300


@dataclass
class Session:
    created_at: float
    expires_at: float
    last_seen: float
    stamp: str
    username: str


class SessionStore:
    def __init__(self, path: Path, idle_seconds: int, max_seconds: int) -> None:
        self._path = path
        self._idle_seconds = idle_seconds
        self._max_seconds = max_seconds
        self._lock = threading.Lock()
        self._persisted_at = 0.0
        self._sessions: dict[str, Session] = {}
        self._load()

    def create(self, username: str, stamp: str) -> str:
        token = secrets.token_urlsafe(32)
        now = time.time()
        with self._lock:
            self._purge_expired(now)
            self._sessions[self._key(token)] = Session(
                created_at=now,
                expires_at=now + self._idle_seconds,
                last_seen=now,
                stamp=stamp,
                username=username,
            )
            self._persist(now, force=True)
        return token

    def validate(self, token: str) -> Session | None:
        key = self._key(token)
        now = time.time()
        with self._lock:
            session = self._sessions.get(key)
            if session is None:
                return None
            absolute_end = session.created_at + self._max_seconds
            if now >= session.expires_at or now >= absolute_end:
                del self._sessions[key]
                self._persist(now, force=True)
                return None
            session.last_seen = now
            session.expires_at = min(now + self._idle_seconds, absolute_end)
            self._persist(now)
            return session

    def revoke(self, token: str) -> None:
        with self._lock:
            if self._sessions.pop(self._key(token), None) is not None:
                self._persist(time.time(), force=True)

    @staticmethod
    def _key(token: str) -> str:
        return hashlib.sha256(token.encode()).hexdigest()

    def _purge_expired(self, now: float) -> None:
        for key in [key for key, session in self._sessions.items() if now >= session.expires_at]:
            del self._sessions[key]

    def _load(self) -> None:
        try:
            raw = json.loads(self._path.read_text(encoding="utf-8"))
            self._sessions = {key: Session(**value) for key, value in raw.items()}
        except (FileNotFoundError, ValueError, TypeError):
            self._sessions = {}

    def _persist(self, now: float, force: bool = False) -> None:
        if not force and now - self._persisted_at < PERSIST_INTERVAL_SECONDS:
            return
        self._path.parent.mkdir(parents=True, exist_ok=True)
        descriptor, temporary_name = tempfile.mkstemp(dir=self._path.parent, prefix=".sessions-", suffix=".tmp")
        try:
            with os.fdopen(descriptor, "w", encoding="utf-8") as file:
                json.dump({key: asdict(session) for key, session in self._sessions.items()}, file)
            os.chmod(temporary_name, 0o600)
            os.replace(temporary_name, self._path)
            self._persisted_at = now
        except BaseException:
            Path(temporary_name).unlink(missing_ok=True)
            raise


class LoginRateLimiter:
    """
    Counts failed logins per (client, username) and per client within a sliding window. Per username alone would
    let anyone lock the owner out of his own server.
    """

    def __init__(self, max_per_pair: int = 5, max_per_client: int = 20, window_seconds: int = 900) -> None:
        self._lock = threading.Lock()
        self._max_per_client = max_per_client
        self._max_per_pair = max_per_pair
        self._window = window_seconds
        self._failures: dict[tuple[str, str | None], deque[float]] = defaultdict(deque)

    def retry_after(self, client: str, username: str) -> int:
        """Seconds until another attempt is allowed, 0 if one is allowed right now."""
        now = time.time()
        with self._lock:
            waits = [
                self._wait(self._failures.get((client, username)), self._max_per_pair, now),
                self._wait(self._failures.get((client, None)), self._max_per_client, now),
            ]
        return max(waits)

    def failed(self, client: str, username: str) -> None:
        now = time.time()
        with self._lock:
            for key in ((client, username), (client, None)):
                self._failures[key].append(now)
            if len(self._failures) > 10_000:
                self._forget_old(now)

    def succeeded(self, client: str, username: str) -> None:
        with self._lock:
            self._failures.pop((client, username), None)

    def _wait(self, attempts: deque[float] | None, limit: int, now: float) -> int:
        if not attempts:
            return 0
        while attempts and now - attempts[0] >= self._window:
            attempts.popleft()
        if len(attempts) < limit:
            return 0
        return max(1, int(attempts[0] + self._window - now) + 1)

    def _forget_old(self, now: float) -> None:
        for key in [key for key, attempts in self._failures.items() if not attempts or now - attempts[-1] >= self._window]:
            del self._failures[key]


class FailedAttempts:
    """
    Counts consecutive failed logins per username, whether or not the user exists, so that the answer never reveals
    which usernames exist. Persisted, so that a restart or a page reload does not give new attempts. The counter of a
    name is forgotten after `forget_seconds` without a failure.
    """

    def __init__(self, path: Path, forget_seconds: int = 86400, max_entries: int = 1000) -> None:
        self._path = path
        self._forget_seconds = forget_seconds
        self._max_entries = max_entries
        self._lock = threading.Lock()
        self._entries: dict[str, list[float]] = {}
        self._load()

    def failed(self, username: str) -> int:
        """Records a failure and returns the number of consecutive failures."""
        now = time.time()
        with self._lock:
            self._entries = {
                name: entry for name, entry in self._entries.items() if now - entry[1] < self._forget_seconds
            }
            count = int(self._entries.pop(username, [0, now])[0]) + 1
            self._entries[username] = [count, now]
            while len(self._entries) > self._max_entries:
                del self._entries[next(iter(self._entries))]
            self._persist()
            return count

    def clear(self, username: str) -> None:
        with self._lock:
            if self._entries.pop(username, None) is not None:
                self._persist()

    def _load(self) -> None:
        try:
            raw = json.loads(self._path.read_text(encoding="utf-8"))
            self._entries = {name: [int(entry[0]), float(entry[1])] for name, entry in raw.items()}
        except (FileNotFoundError, ValueError, TypeError, IndexError, AttributeError):
            self._entries = {}

    def _persist(self) -> None:
        self._path.parent.mkdir(parents=True, exist_ok=True)
        descriptor, temporary_name = tempfile.mkstemp(dir=self._path.parent, prefix=".failed-", suffix=".tmp")
        try:
            with os.fdopen(descriptor, "w", encoding="utf-8") as file:
                json.dump(self._entries, file)
            os.chmod(temporary_name, 0o600)
            os.replace(temporary_name, self._path)
        except BaseException:
            Path(temporary_name).unlink(missing_ok=True)
            raise

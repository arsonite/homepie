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
The user database: one JSON file in the data directory.

    {
        "version": 1,
        "users": {
            "burak": {"created_at": "2025-01-01T12:00:00+00:00", "password": "<Fernet token of the scrypt hash>"}
        }
    }

The file is replaced atomically, so the running server can read it while `manage-users` writes it. The server
notices changes through the modification time, new users and password changes need no restart.
"""

from __future__ import annotations

import fcntl
import hashlib
import json
import os
import re
import tempfile
import threading
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterator

from .config import PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH
from .crypto import Vault, hash_password

USERNAME_PATTERN = re.compile(r"^[a-z0-9][a-z0-9._-]{0,31}$")
FORMAT_VERSION = 1


class UserError(ValueError):
    """Invalid input for a user operation, the message is safe to show to the operator."""


@dataclass(frozen=True)
class User:
    username: str
    password_hash: str
    # Changes whenever the password changes, sessions created with an older stamp are no longer valid
    stamp: str


def normalize_username(username: str) -> str:
    return username.strip().lower()


def validate_username(username: str) -> str:
    username = normalize_username(username)
    if not USERNAME_PATTERN.match(username):
        raise UserError("Usernames are 1-32 characters of a-z, 0-9, '.', '_' and '-' and start with a letter or digit.")
    return username


def validate_password(password: str) -> str:
    if not PASSWORD_MIN_LENGTH <= len(password) <= PASSWORD_MAX_LENGTH:
        raise UserError(
            f"Passwords need {PASSWORD_MIN_LENGTH}-{PASSWORD_MAX_LENGTH} characters "
            "(the lockscreen cannot take more than that)."
        )
    return password


class UserStore:
    def __init__(self, path: Path, vault: Vault) -> None:
        self._path = path
        self._vault = vault
        self._cache: dict[str, User] = {}
        self._cache_signature: tuple[int, int] | None = None
        self._lock = threading.Lock()

    def get(self, username: str) -> User | None:
        return self._load().get(normalize_username(username))

    def list(self) -> list[tuple[str, str]]:
        raw = self._read_raw()
        return sorted((name, entry.get("created_at", "")) for name, entry in raw["users"].items())

    def add(self, username: str, password: str) -> None:
        username = validate_username(username)
        validate_password(password)
        with self._transaction() as raw:
            if username in raw["users"]:
                raise UserError(f"User '{username}' already exists.")
            raw["users"][username] = self._entry(password, datetime.now(timezone.utc).isoformat())

    def set_password(self, username: str, password: str) -> None:
        username = normalize_username(username)
        validate_password(password)
        with self._transaction() as raw:
            if username not in raw["users"]:
                raise UserError(f"User '{username}' does not exist.")
            raw["users"][username] = self._entry(password, raw["users"][username].get("created_at", ""))

    def delete(self, username: str) -> None:
        username = normalize_username(username)
        with self._transaction() as raw:
            if username not in raw["users"]:
                raise UserError(f"User '{username}' does not exist.")
            del raw["users"][username]

    def _entry(self, password: str, created_at: str) -> dict[str, str]:
        return {"created_at": created_at, "password": self._vault.encrypt(hash_password(password))}

    def _signature(self) -> tuple[int, int] | None:
        try:
            stat = self._path.stat()
        except FileNotFoundError:
            return None
        return stat.st_mtime_ns, stat.st_size

    def _read_raw(self) -> dict:
        try:
            raw = json.loads(self._path.read_text(encoding="utf-8"))
        except FileNotFoundError:
            return {"version": FORMAT_VERSION, "users": {}}
        if raw.get("version") != FORMAT_VERSION or not isinstance(raw.get("users"), dict):
            raise UserError(f"{self._path} has an unsupported format.")
        return raw

    def _load(self) -> dict[str, User]:
        signature = self._signature()
        with self._lock:
            if signature != self._cache_signature:
                raw = self._read_raw()
                self._cache = {
                    name: User(
                        username=name,
                        password_hash=self._vault.decrypt(entry["password"]),
                        stamp=hashlib.sha256(entry["password"].encode()).hexdigest()[:16],
                    )
                    for name, entry in raw["users"].items()
                }
                self._cache_signature = signature
            return self._cache

    @contextmanager
    def _transaction(self) -> Iterator[dict]:
        self._path.parent.mkdir(parents=True, exist_ok=True)
        with open(self._path.with_suffix(".lock"), "a") as lock_file:
            fcntl.flock(lock_file, fcntl.LOCK_EX)
            raw = self._read_raw()
            yield raw
            self._write_atomically(raw)

    def _write_atomically(self, raw: dict) -> None:
        descriptor, temporary_name = tempfile.mkstemp(dir=self._path.parent, prefix=".users-", suffix=".tmp")
        try:
            with os.fdopen(descriptor, "w", encoding="utf-8") as file:
                json.dump(raw, file, indent=4, sort_keys=True)
                file.write("\n")
                file.flush()
                os.fsync(file.fileno())
            os.chmod(temporary_name, 0o600)
            os.replace(temporary_name, self._path)
        except BaseException:
            Path(temporary_name).unlink(missing_ok=True)
            raise

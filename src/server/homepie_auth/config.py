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
Settings, read from the process environment and the repository's .env.

Precedence: process environment > .env > DEFAULT_<KEY> in .env > DEFAULT_<KEY> in .env.template.
The shell scripts export the same values (scripts/load-env), so both ways of starting the server agree.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parents[3]

# Constraints for passwords. The maximum matches the input limit of the lockscreen in the client
# (MAX_LETTERS_PER_LINE * MAX_LINES in LoginPage.tsx), anything longer could not be typed in anyway.
PASSWORD_MIN_LENGTH = 10
PASSWORD_MAX_LENGTH = 36

SESSION_COOKIE_NAME = "homepie_session"


def _parse_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.is_file():
        return values
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        values[key.strip()] = value
    return values


def _load_environment() -> dict[str, str]:
    file_values = {}
    file_values.update(_parse_env_file(REPOSITORY_ROOT / ".env.template"))
    file_values.update(_parse_env_file(REPOSITORY_ROOT / ".env"))

    def lookup(key: str) -> str | None:
        for source in (os.environ, file_values):
            if source.get(key):
                return source[key]
        return os.environ.get(f"DEFAULT_{key}") or file_values.get(f"DEFAULT_{key}")

    keys = {key.removeprefix("DEFAULT_") for key in file_values}
    keys.update(key for key in os.environ if key.startswith("HOMEPIE_"))
    return {key: value for key in keys if (value := lookup(key)) is not None}


def _as_bool(value: str | None, default: bool) -> bool:
    if value is None or value == "":
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class Settings:
    cookie_domain: str | None
    cookie_secure: bool
    domain: str
    host: str
    key_file: Path
    failed_attempts_file: Path
    max_failed_attempts: int
    port: int
    runtime_path: Path
    secrets_path: Path
    session_idle_seconds: int
    session_max_seconds: int
    sessions_file: Path
    users_file: Path
    data_path: Path
    # Development: cookies work on plain http://localhost / http://<lan ip> (no Secure flag, no domain)
    dev: bool = False

    @property
    def allowed_origin_suffix(self) -> str:
        return f".{self.domain}"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    env = _load_environment()

    data_path = Path(env.get("HOMEPIE_DATA_PATH", "/var/lib/homepie"))
    runtime_path = Path(env.get("HOMEPIE_RUNTIME_PATH", str(data_path / "run")))
    secrets_path = Path(env.get("HOMEPIE_SECRETS_PATH", str(data_path / "secrets")))
    dev = _as_bool(env.get("HOMEPIE_AUTH_DEV"), False)

    return Settings(
        cookie_domain=None if dev else env.get("HOMEPIE_AUTH_COOKIE_DOMAIN") or None,
        cookie_secure=not dev,
        data_path=data_path,
        dev=dev,
        domain=env.get("HOMEPIE_DOMAIN", "homepie.net"),
        host=env.get("HOMEPIE_AUTH_HOST", "127.0.0.1"),
        failed_attempts_file=runtime_path / "failed-logins.json",
        key_file=secrets_path / "users.key",
        max_failed_attempts=max(1, int(env.get("HOMEPIE_AUTH_MAX_FAILED_ATTEMPTS", "3"))),
        port=int(env.get("HOMEPIE_AUTH_PORT", "8888")),
        runtime_path=runtime_path,
        secrets_path=secrets_path,
        session_idle_seconds=int(float(env.get("HOMEPIE_AUTH_SESSION_IDLE_HOURS", "72")) * 3600),
        session_max_seconds=int(float(env.get("HOMEPIE_AUTH_SESSION_MAX_DAYS", "30")) * 86400),
        sessions_file=runtime_path / "sessions.json",
        users_file=data_path / "users.json",
    )

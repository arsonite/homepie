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
Password hashing and encryption at rest.

Passwords are never stored, only a scrypt hash is. That hash is additionally encrypted with a Fernet key
(AES-128-CBC + HMAC-SHA256) that lives in the secrets directory, so a copy of users.json alone is useless.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import os
import secrets
from pathlib import Path

from cryptography.fernet import Fernet, InvalidToken

SCRYPT_N = 2**15
SCRYPT_P = 1
SCRYPT_R = 8
SCRYPT_MAXMEM = 128 * 1024 * 1024
SALT_BYTES = 16


class VaultError(RuntimeError):
    """The encryption key is missing or does not match the stored data."""


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(SALT_BYTES)
    digest = _scrypt(password, salt, SCRYPT_N, SCRYPT_R, SCRYPT_P)
    return "$".join(
        [
            "scrypt",
            str(SCRYPT_N),
            str(SCRYPT_R),
            str(SCRYPT_P),
            base64.b64encode(salt).decode(),
            base64.b64encode(digest).decode(),
        ]
    )


def verify_password(password: str, encoded: str) -> bool:
    try:
        scheme, n, r, p, salt, expected = encoded.split("$")
        if scheme != "scrypt":
            return False
        digest = _scrypt(password, base64.b64decode(salt), int(n), int(r), int(p))
        return hmac.compare_digest(digest, base64.b64decode(expected))
    except (ValueError, TypeError):
        return False


def _scrypt(password: str, salt: bytes, n: int, r: int, p: int) -> bytes:
    return hashlib.scrypt(password.encode("utf-8"), salt=salt, n=n, r=r, p=p, maxmem=SCRYPT_MAXMEM, dklen=32)


# Verified against when the username does not exist, so that unknown users cost as much time as known ones
DUMMY_HASH = hash_password(secrets.token_urlsafe(16))


class Vault:
    def __init__(self, key: bytes) -> None:
        self._fernet = Fernet(key)

    @classmethod
    def load(cls, key_file: Path, create: bool = False) -> "Vault":
        """
        Loads the key. A missing key is only created when explicitly asked for, because a freshly generated
        key could never decrypt an already existing users.json and would lock everyone out.
        """
        if not key_file.exists():
            if not create:
                raise VaultError(
                    f"Encryption key {key_file} does not exist. On a fresh install run cli/build-scripts/install-auth-server, "
                    "otherwise restore the key from your backup, users.json cannot be decrypted without it."
                )
            key_file.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
            descriptor = os.open(key_file, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(descriptor, "wb") as file:
                file.write(Fernet.generate_key())

        if key_file.stat().st_mode & 0o077:
            raise VaultError(f"{key_file} must only be accessible by its owner (chmod 600).")

        try:
            return cls(key_file.read_bytes().strip())
        except ValueError as error:
            raise VaultError(f"{key_file} does not contain a valid key.") from error

    def encrypt(self, value: str) -> str:
        return self._fernet.encrypt(value.encode("utf-8")).decode("ascii")

    def decrypt(self, token: str) -> str:
        try:
            return self._fernet.decrypt(token.encode("ascii")).decode("utf-8")
        except InvalidToken as error:
            raise VaultError("users.json cannot be decrypted with the current key.") from error

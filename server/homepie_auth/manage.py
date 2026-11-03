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
User management, normally started through cli/build-scripts/manage-users:

    manage-users init
    manage-users add <username>
    manage-users passwd <username>
    manage-users delete <username>
    manage-users list

Passwords are asked for interactively (never as an argument, those end up in the shell history), or read from
stdin when it is not a terminal, e.g. `printf '%s' "$PASSWORD" | manage-users add burak`.
"""

from __future__ import annotations

import argparse
import getpass
import sys

from .config import PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, get_settings
from .crypto import Vault, VaultError
from .users import UserError, UserStore, validate_username


def read_password() -> str:
    if not sys.stdin.isatty():
        return sys.stdin.readline().rstrip("\r\n")
    print(f"Password policy: {PASSWORD_MIN_LENGTH}-{PASSWORD_MAX_LENGTH} characters.")
    password = getpass.getpass("Password: ")
    if password != getpass.getpass("Repeat password: "):
        raise UserError("The passwords do not match.")
    return password


def open_store(create_key: bool) -> UserStore:
    settings = get_settings()
    # A new key may only be generated while there is no user database that it would have to decrypt
    create_key = create_key and not settings.users_file.exists()
    return UserStore(settings.users_file, Vault.load(settings.key_file, create=create_key))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="manage-users", description="Manage the homepie users.")
    commands = parser.add_subparsers(dest="command", required=True)
    for name, help_text in (
        ("add", "create a user"),
        ("passwd", "change the password of a user and end all of its sessions"),
        ("delete", "delete a user and end all of its sessions"),
    ):
        commands.add_parser(name, help=help_text).add_argument("username")
    commands.add_parser("list", help="list all users")
    commands.add_parser("init", help="create the encryption key (done by cli/build-scripts/install-auth-server)")

    arguments = parser.parse_args(argv)

    try:
        if arguments.command == "init":
            open_store(create_key=True)
            print(f"Encryption key is in place: {get_settings().key_file}")
        elif arguments.command == "add":
            username = validate_username(arguments.username)
            open_store(create_key=True).add(username, read_password())
            print(f"Created user '{username}'.")
        elif arguments.command == "passwd":
            open_store(create_key=False).set_password(arguments.username, read_password())
            print(f"Changed the password of '{arguments.username.strip().lower()}'. All of its sessions are logged out.")
        elif arguments.command == "delete":
            open_store(create_key=False).delete(arguments.username)
            print(f"Deleted user '{arguments.username.strip().lower()}'. All of its sessions are logged out.")
        else:
            users = open_store(create_key=False).list()
            if not users:
                print("No users yet. Create one with: manage-users add <username>")
            for username, created_at in users:
                print(f"{username}\t{created_at}")
    except (UserError, VaultError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    except (KeyboardInterrupt, EOFError):
        print(file=sys.stderr)
        return 130
    return 0


if __name__ == "__main__":
    sys.exit(main())

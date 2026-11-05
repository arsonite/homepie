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

"""Run with: HOMEPIE_VENV/bin/python -m pytest src/server/tests (needs pytest and httpx)."""

import json
from dataclasses import replace

import pytest
from fastapi.testclient import TestClient

from homepie_auth.app import create_app
from homepie_auth.config import SESSION_COOKIE_NAME, Settings
from homepie_auth.crypto import Vault, VaultError
from homepie_auth.users import UserError, UserStore

PASSWORD = "correct-horse-battery"
HEADERS = {"Origin": "https://homepie.net"}


@pytest.fixture
def settings(tmp_path) -> Settings:
    return Settings(
        cookie_domain=".homepie.net",
        cookie_secure=True,
        data_path=tmp_path / "data",
        domain="homepie.net",
        failed_attempts_file=tmp_path / "run" / "failed-logins.json",
        host="127.0.0.1",
        key_file=tmp_path / "secrets" / "users.key",
        max_failed_attempts=3,
        port=8000,
        runtime_path=tmp_path / "run",
        secrets_path=tmp_path / "secrets",
        session_idle_seconds=3600,
        session_max_seconds=7200,
        sessions_file=tmp_path / "run" / "sessions.json",
        users_file=tmp_path / "data" / "users.json",
    )


@pytest.fixture
def store(settings) -> UserStore:
    store = UserStore(settings.users_file, Vault.load(settings.key_file, create=True))
    store.add("burak", PASSWORD)
    return store


@pytest.fixture
def client(settings, store) -> TestClient:
    return TestClient(create_app(settings), base_url="https://homepie.net")


def login(client: TestClient, username: str = "burak", password: str = PASSWORD, **kwargs):
    return client.post("/api/auth/login", json={"username": username, "password": password}, headers=HEADERS, **kwargs)


def test_password_is_hashed_and_encrypted_at_rest(settings, store):
    content = settings.users_file.read_text()
    assert PASSWORD not in content
    assert "scrypt" not in content
    entry = json.loads(content)["users"]["burak"]["password"]
    assert Vault.load(settings.key_file).decrypt(entry).startswith("scrypt$")
    assert oct(settings.users_file.stat().st_mode & 0o777) == "0o600"


def test_users_file_is_useless_with_another_key(settings, store, tmp_path):
    other = Vault.load(tmp_path / "other" / "users.key", create=True)
    with pytest.raises(VaultError):
        UserStore(settings.users_file, other).get("burak")


def test_missing_key_is_not_recreated(settings):
    with pytest.raises(VaultError):
        Vault.load(settings.key_file)


def test_user_policy(store):
    with pytest.raises(UserError):
        store.add("burak", PASSWORD)
    with pytest.raises(UserError):
        store.add("someone", "short")
    with pytest.raises(UserError):
        store.add("Not Valid!", PASSWORD)


def test_login_sets_domain_wide_cookie(client):
    response = login(client)
    assert response.status_code == 200
    assert response.json() == {"username": "burak"}
    cookie = response.headers["set-cookie"]
    assert cookie.startswith(f"{SESSION_COOKIE_NAME}=")
    for attribute in ("HttpOnly", "Secure", "SameSite=lax", "Domain=.homepie.net", "Path=/"):
        assert attribute in cookie


def test_username_is_case_insensitive(client):
    assert login(client, username="  BURAK ").status_code == 200


def test_wrong_credentials_are_indistinguishable(client):
    wrong_password = login(client, password="wrong-password-xx")
    unknown_user = login(client, username="nobody")
    assert wrong_password.status_code == unknown_user.status_code == 401
    assert wrong_password.json() == unknown_user.json()
    assert SESSION_COOKIE_NAME not in wrong_password.headers.get("set-cookie", "")


def test_session_and_verify_need_the_cookie(client):
    assert client.get("/api/auth/session").status_code == 401
    assert client.get("/api/auth/verify").status_code == 401

    login(client)
    assert client.get("/api/auth/session").json() == {"username": "burak"}
    verified = client.get("/api/auth/verify")
    assert verified.status_code == 204
    assert verified.headers["x-auth-user"] == "burak"


def test_forged_cookie_is_rejected(client):
    client.cookies.set(SESSION_COOKIE_NAME, "forged", domain="homepie.net")
    assert client.get("/api/auth/verify").status_code == 401


def test_logout_revokes_the_session(client):
    login(client)
    token = client.cookies[SESSION_COOKIE_NAME]
    assert client.post("/api/auth/logout", headers=HEADERS).status_code == 200

    client.cookies.set(SESSION_COOKIE_NAME, token, domain="homepie.net")
    assert client.get("/api/auth/verify").status_code == 401


def test_changed_password_ends_sessions(client, store):
    login(client)
    store.set_password("burak", "another-long-password")
    assert client.get("/api/auth/verify").status_code == 401
    assert login(client).status_code == 401
    assert login(client, password="another-long-password").status_code == 200


def test_deleted_user_ends_sessions(client, store):
    login(client)
    store.delete("burak")
    assert client.get("/api/auth/verify").status_code == 401


def test_sessions_survive_a_restart(settings, store):
    first = TestClient(create_app(settings), base_url="https://homepie.net")
    login(first)
    token = first.cookies[SESSION_COOKIE_NAME]

    second = TestClient(create_app(settings), base_url="https://homepie.net")
    second.cookies.set(SESSION_COOKIE_NAME, token, domain="homepie.net")
    assert second.get("/api/auth/verify").status_code == 204
    assert token not in settings.sessions_file.read_text()


def test_session_expires(settings, store, monkeypatch):
    app_client = TestClient(create_app(replace(settings, session_idle_seconds=1)), base_url="https://homepie.net")
    login(app_client)
    assert app_client.get("/api/auth/verify").status_code == 204

    import time

    real_time = time.time
    monkeypatch.setattr(time, "time", lambda: real_time() + 5)
    assert app_client.get("/api/auth/verify").status_code == 401


def test_brute_force_is_throttled(client):
    for _ in range(5):
        assert login(client, username="nobody", password="wrong-password-123").status_code == 401
    blocked = login(client, username="nobody", password="wrong-password-123")
    assert blocked.status_code == 429
    assert int(blocked.headers["retry-after"]) > 0


def test_attempts_are_counted_down(client):
    for expected in (2, 1):
        response = login(client, password="wrong-password-123")
        assert response.status_code == 401
        assert response.json()["attempts_left"] == expected
    assert login(client).status_code == 200


def test_user_is_deleted_after_three_failures(client, store):
    left = [login(client, password="wrong-password-123").json()["attempts_left"] for _ in range(3)]
    assert left == [2, 1, 0]
    assert store.get("burak") is None
    assert login(client).status_code == 401


def test_success_resets_the_counter(client, store):
    for _ in range(2):
        login(client, password="wrong-password-123")
    assert login(client).status_code == 200
    for _ in range(2):
        login(client, password="wrong-password-123")
    assert store.get("burak") is not None


def test_failures_survive_a_restart(settings, store):
    first = TestClient(create_app(settings), base_url="https://homepie.net")
    for _ in range(2):
        login(first, password="wrong-password-123")
    second = TestClient(create_app(settings), base_url="https://homepie.net")
    assert login(second, password="wrong-password-123").json()["attempts_left"] == 0
    assert store.get("burak") is None


def test_unknown_user_gets_the_same_countdown(client):
    left = [login(client, username="nobody", password="wrong-password-123").json()["attempts_left"] for _ in range(4)]
    assert left == [2, 1, 0, 2]


def test_foreign_origin_is_rejected(client):
    response = client.post(
        "/api/auth/login",
        json={"username": "burak", "password": PASSWORD},
        headers={"Origin": "https://evil.example"},
    )
    assert response.status_code == 403


def test_subdomain_origin_is_accepted(client):
    response = client.post(
        "/api/auth/login",
        json={"username": "burak", "password": PASSWORD},
        headers={"Origin": "https://lockkliye.homepie.net"},
    )
    assert response.status_code == 200

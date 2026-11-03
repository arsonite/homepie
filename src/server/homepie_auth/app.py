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
HTTP API of the auth server. It listens on 127.0.0.1 only, nginx is the one talking to the internet.

    POST /api/auth/login     {"username", "password"} -> sets the session cookie
    POST /api/auth/logout    -> revokes the session and clears the cookie
    GET  /api/auth/session   -> 200 {"username"} or 401, used by the client
    GET  /api/auth/verify    -> 204 + X-Auth-User or 401, used by nginx `auth_request` for every protected request
    GET  /api/auth/health    -> 200

The session cookie is scoped to the whole domain (".homepie.net"), so one login covers all subdomains.
"""

from __future__ import annotations

import logging
from urllib.parse import urlsplit

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from .config import SESSION_COOKIE_NAME, Settings, get_settings
from .crypto import DUMMY_HASH, Vault, verify_password
from .security import FailedAttempts, LoginRateLimiter, SessionStore
from .users import UserError, UserStore, normalize_username

logger = logging.getLogger("homepie_auth")
if not logger.handlers:
    # uvicorn only configures its own loggers, without this the login messages would be lost
    _handler = logging.StreamHandler()
    _handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s homepie_auth: %(message)s"))
    logger.addHandler(_handler)
    logger.setLevel(logging.INFO)
    logger.propagate = False

NO_STORE = {"Cache-Control": "no-store"}
LOOPBACK_HOSTS = {"127.0.0.1", "::1"}


class LoginRequest(BaseModel):
    # Generous upper bounds, they only protect the hashing from absurd input. The real policy is applied on creation.
    password: str = Field(max_length=256, min_length=1)
    username: str = Field(max_length=64, min_length=1)


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()

    users = UserStore(settings.users_file, Vault.load(settings.key_file))
    sessions = SessionStore(settings.sessions_file, settings.session_idle_seconds, settings.session_max_seconds)
    limiter = LoginRateLimiter()
    failed_attempts = FailedAttempts(settings.failed_attempts_file)

    app = FastAPI(docs_url=None, openapi_url=None, redoc_url=None, title="homepie auth")

    def client_address(request: Request) -> str:
        # X-Real-IP is only trustworthy when it was set by our own reverse proxy
        peer = request.client.host if request.client else "unknown"
        if peer in LOOPBACK_HOSTS:
            return request.headers.get("x-real-ip", peer)
        return peer

    def check_origin(request: Request) -> None:
        """Browsers always send Origin on cross-site POSTs. Allow our own domain and same-origin requests only."""
        origin = request.headers.get("origin")
        if origin is None:
            return
        origin_host = urlsplit(origin).hostname or ""
        own_host = request.headers.get("host", "").split(":")[0]
        if origin_host in (settings.domain, own_host) or origin_host.endswith(settings.allowed_origin_suffix):
            return
        raise HTTPException(status_code=403, detail="Forbidden")

    def current_session(request: Request):
        token = request.cookies.get(SESSION_COOKIE_NAME)
        if not token:
            return None
        session = sessions.validate(token)
        if session is None:
            return None
        user = users.get(session.username)
        # Deleted users and changed passwords end all their sessions
        if user is None or user.stamp != session.stamp:
            sessions.revoke(token)
            return None
        return session

    def clear_cookie(response: Response) -> None:
        response.delete_cookie(
            SESSION_COOKIE_NAME,
            domain=settings.cookie_domain,
            httponly=True,
            path="/",
            samesite="lax",
            secure=settings.cookie_secure,
        )

    @app.post("/api/auth/login")
    def login(body: LoginRequest, request: Request, response: Response):
        check_origin(request)
        client = client_address(request)
        username = normalize_username(body.username)

        wait = limiter.retry_after(client, username)
        if wait:
            raise HTTPException(status_code=429, detail="Too many attempts", headers={"Retry-After": str(wait), **NO_STORE})

        user = users.get(username)
        # Always hash, so that response times do not reveal whether a username exists
        valid = verify_password(body.password, user.password_hash if user else DUMMY_HASH)
        if user is None or not valid:
            limiter.failed(client, username)
            logger.warning("Failed login for %r from %s", username[:64], client)
            failures = failed_attempts.failed(username)
            attempts_left = max(settings.max_failed_attempts - failures, 0)
            if attempts_left == 0:
                # Unknown names run through the same cycle, so the answer is identical for them
                failed_attempts.clear(username)
                if user is not None:
                    try:
                        users.delete(username)
                        logger.warning("Deleted %r after %d failed logins", username, failures)
                    except UserError:
                        pass
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid credentials", "attempts_left": attempts_left},
                headers=NO_STORE,
            )

        limiter.succeeded(client, username)
        failed_attempts.clear(username)
        token = sessions.create(user.username, user.stamp)
        response.set_cookie(
            SESSION_COOKIE_NAME,
            token,
            domain=settings.cookie_domain,
            httponly=True,
            max_age=settings.session_max_seconds,
            path="/",
            samesite="lax",
            secure=settings.cookie_secure,
        )
        response.headers.update(NO_STORE)
        logger.info("Login of %r from %s", user.username, client)
        return {"username": user.username}

    @app.post("/api/auth/logout")
    def logout(request: Request, response: Response):
        check_origin(request)
        token = request.cookies.get(SESSION_COOKIE_NAME)
        if token:
            sessions.revoke(token)
        clear_cookie(response)
        response.headers.update(NO_STORE)
        return {"ok": True}

    @app.get("/api/auth/session")
    def session(request: Request, response: Response):
        current = current_session(request)
        response.headers.update(NO_STORE)
        if current is None:
            raise HTTPException(status_code=401, detail="Not authenticated", headers=NO_STORE)
        return {"username": current.username}

    @app.get("/api/auth/verify")
    def verify(request: Request):
        current = current_session(request)
        if current is None:
            return Response(status_code=401, headers=NO_STORE)
        return Response(status_code=204, headers={"X-Auth-User": current.username, **NO_STORE})

    @app.get("/api/auth/health")
    def health():
        return {"status": "ok"}

    return app

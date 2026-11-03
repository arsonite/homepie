<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/arsonite/homepie">
    <img src="files/homepie-logo.png" alt="homepie icon" width="80" height="80">
  </a>

<h1 align="center">homepie</h3>
  <p align="center">
    This is the platform that powers all of my self-hosted web-apps
    <br />
    ·
    <a href="https://github.com/arsonite/homepie/issues">Report Bug</a>
    ·
    <a href="https://github.com/arsonite/homepie/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<summary>Table of Contents</summary>
<ol>
  <li><a href="#deployment">Deployment</a></li>
  <li><a href="#8-authentication">Authentication</a></li>
  <li><a href="#troubleshooting-homepienet-is-not-reachable">Troubleshooting: homepie.net is not reachable</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#license">License</a></li>
  <li><a href="#contact">Contact</a></li>
</ol>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

-   [![React][React.js]][React-url]
-   [![TypeScript][TypeScript]][TypeScript-url]
-   [![Redis][redis]][redis-url]
-   [![Celery][celery]][celery-url]
-   nginx (reverse proxy), Cloudflare (DNS), Let's Encrypt (TLS)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DEPLOYMENT -->

## Deployment

homepie runs on a single Ubuntu 22.04 home server (`192.168.2.134`). The domain `homepie.net` is registered at
Namecheap, its DNS is managed by Cloudflare.

```
browser ──► homepie.net / *.homepie.net
              │  DNS (Cloudflare)  A records ──► public IP of the home router (kept current by homepie-ddns)
              ▼
          router: TCP 80 + 443 forwarded to 192.168.2.134
              ▼
          nginx on the server (443, wildcard Let's Encrypt certificate)
              │   every request ──► auth_request ──► homepie auth server (FastAPI, 127.0.0.1:8888)
              ├─ homepie.net            static landing page (client/build) + /api/auth ──► auth server
              ├─ lockkliye.homepie.net  ──► 127.0.0.1:8101
              └─ <app>.homepie.net      ──► whatever is registered in nginx/conf.d/00-homepie-apps.conf
```

Everything below is scripted. The scripts live in [`cli/build-scripts`](cli/build-scripts), the files they install
in [`cli/build-files`](cli/build-files) and [`nginx`](nginx).

### 1. Domain: Namecheap → Cloudflare

1. Add `homepie.net` as a site in Cloudflare (Free plan). Cloudflare shows the two nameservers it assigned to the
   account.
2. In Namecheap open **Domain List → Manage → Nameservers**, select **Custom DNS** and enter exactly those two
   nameservers (for this account `luke.ns.cloudflare.com` and `rachel.ns.cloudflare.com`).
   Disable DNSSEC at Namecheap if it is enabled.

![Namecheap custom nameservers](cli/docs/namecheap-cloudflare-nameservers.png)

3. Wait until Cloudflare shows the site as **Active** (usually minutes, up to 24 h). From then on **Namecheap
   does not serve any DNS records for the domain anymore**: Namecheap's URL redirect, parking page and its Dynamic DNS
   feature are all ineffective. Every DNS change is done in Cloudflare.

### 2. Cloudflare API token

One token is used for everything that talks to Cloudflare: updating the A records when the public IP changes and
solving the DNS challenge for the wildcard certificate.

1. Cloudflare dashboard → **My Profile → API Tokens → Create Token**.

![API tokens overview](cli/docs/cloudflare-api-token-1.png)

2. Use the template **Edit zone DNS**.

![API token templates](cli/docs/cloudflare-api-token-2.png)

3. Permissions: `Zone` · `DNS` · `Edit`. Zone resources: `Include` · `Specific zone` · `homepie.net`. Leave the rest
   as is and create the token.

![API token settings](cli/docs/cloudflare-api-token-3.png)

4. Store it on the server (the script verifies it first and writes `/etc/homepie/cloudflare.ini`, mode 600, owned by
   root):

```bash
cli/build-scripts/setup-cloudflare-credentials
```

> The token never belongs into the repository, a `.env` file or the shell history. Revoke it in Cloudflare if it ever
> leaks.

The zone ID and the record IDs are looked up through the API by the scripts. If you ever need them manually: the
**Zone ID** is on the **Overview** page of the domain (right column, "API"), the **record ID** is in
**Manage Account → Audit Log** (the `id` in the "New Value" of a DNS record change).

![Zone ID](cli/docs/cloudflare-zone-id.png)
![Record ID](cli/docs/cloudflare-record-id.png)

### 3. Server network

-   **Static IP**: [`cli/build-files/99_config.yaml`](cli/build-files/99_config.yaml) pins the server to
    `192.168.2.134/24` (`cli/build-scripts/modify-netplan`). The router's port forwarding must target exactly this
    address.
-   **Router port forwarding**: forward **TCP 80 and TCP 443** to `192.168.2.134` (80 only redirects to https).
    Do _not_ forward 22 (SSH) or any app port.
-   **Firewall**: `install-nginx` runs `ufw allow 'Nginx Full'` if `ufw` is active.
-   **fail2ban** (optional): `cli/build-scripts/install-fail2ban`.

### 4. Dynamic IP → Cloudflare DNS

The ISP changes the public IP from time to time, so a systemd timer runs
[`homepie-cloudflare-ddns`](cli/build-files/cloudflare-ddns) every 5 minutes. It keeps the A records `homepie.net` and
`*.homepie.net` on the current public IPv4 address and creates them if they do not exist (additional names via
`HOMEPIE_DDNS_RECORDS`).

```bash
cli/build-scripts/setup-periodic-cloudflare-ddns
sudo journalctl -u homepie-ddns.service -n 20   # check what it did
```

This replaces the former `ddclient` + Namecheap Dynamic DNS setup (`install-ddclient`), which stops working as soon
as the nameservers point to Cloudflare. The script above disables `ddclient`.

Notes on the records:

-   Cloudflare can only _proxy_ (orange cloud) a wildcard record on Enterprise plans, so `*.homepie.net` is DNS-only
    (grey cloud). Because of that every `<app>.homepie.net` resolves directly to the home IP.
-   If you proxy `homepie.net` itself, set **SSL/TLS → Overview** to **Full (strict)**. The origin has a valid
    certificate, so this works. Existing records keep their proxy setting when the IP is updated.

### 5. TLS certificate

One Let's Encrypt **wildcard** certificate (`homepie.net` + `*.homepie.net`) covers the landing page and every app,
so adding an app never requires a new certificate. Wildcards need the DNS-01 challenge, which certbot solves through
the Cloudflare API with the token from step 2 (no inbound port needs to be open for this).

```bash
cli/build-scripts/install-ssl
```

Renewal is automatic (`certbot.timer`); a deploy hook reloads nginx after each renewal.

### 6. nginx reverse proxy

The configuration is in [`nginx/`](nginx):

| File                                                                                | Purpose                                                                                         |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [`conf.d/homepie.conf`](nginx/conf.d/homepie.conf)                                  | http→https redirect, `www`→apex redirect, landing page + `/api`, one server block for all apps |
| [`conf.d/00-homepie-apps.conf`](nginx/conf.d/00-homepie-apps.conf)                  | **App registry**: which subdomain is proxied to which local port                                |
| [`conf.d/00-homepie-auth.conf`](nginx/conf.d/00-homepie-auth.conf)                  | Auth server upstream, login rate limit, session-cookie stripping for apps                       |
| [`snippets/homepie-auth.conf`](nginx/snippets/homepie-auth.conf)                    | `auth_request`: every request is checked with the auth server first (fail closed)               |
| [`snippets/homepie-ssl.conf`](nginx/snippets/homepie-ssl.conf)                      | Certificate and TLS settings                                                                    |
| [`snippets/homepie-proxy.conf`](nginx/snippets/homepie-proxy.conf)                  | Forwarding headers, websocket support, timeouts                                                 |
| [`snippets/homepie-security.conf`](nginx/snippets/homepie-security.conf)            | HSTS and basic security headers                                                                 |

```bash
cli/build-scripts/install-nginx   # once: installs nginx, removes the default site, opens the firewall, deploys the config
```

nginx owns ports 80/443. The dev server (`start-client-dev`) therefore listens on 5173 by default.

#### Adding an app

1. Let the app listen on `127.0.0.1:<port>` only.
2. Add one line to [`nginx/conf.d/00-homepie-apps.conf`](nginx/conf.d/00-homepie-apps.conf), e.g.
   `lockkliye 127.0.0.1:8101;`
3. Add the app to [`client/src/apps/registry.ts`](client/src/apps/registry.ts) to get a tile on the landing page.
4. `cli/build-scripts/deploy` (or `deploy nginx` / `deploy client` individually).

No DNS or certificate change is needed, the wildcard covers `<app>.homepie.net`. Unknown subdomains return `404`.

### 7. Landing page

The client (lockscreen → hub with one tile per app) is built with Vite and served as static files by nginx on
`https://homepie.net` (443). `/api/auth/*` is proxied to the auth server (see [8. Authentication](#8-authentication)).

```bash
cli/build-scripts/install-client      # pnpm install (once, and after dependency changes)
cli/build-scripts/start-client-dev    # development: vite on :5173 + auth server in dev mode, Ctrl+C stops both
cli/build-scripts/start-client-prod   # production: deploy all + health checks against https://homepie.net

cli/build-scripts/deploy              # = deploy all: client + nginx + auth server
cli/build-scripts/deploy client       # only build and publish the client (client/build → /var/www/homepie/client)
cli/build-scripts/deploy nginx        # only install the nginx config (auth upstream from .env), test it and reload
cli/build-scripts/deploy auth         # only update the auth server's dependencies and restart it
```

Nothing is started automatically at boot yet. After a reboot, run `cli/build-scripts/start-auth-server --detach`
(nginx itself is a systemd service and comes back on its own; without the auth server it answers `500`, see below).

### 8. Authentication

Nothing of homepie is reachable without logging in, neither the landing page nor any app on a subdomain.

```
browser ──► nginx ──auth_request──► GET /api/auth/verify (auth server)
                      │ 204 + X-Auth-User   → request is served (apps get the header X-Homepie-User)
                      └ 401                 → homepie.net: 302 to /login,  <app>.homepie.net: 302 to
                                              https://homepie.net/login?app=<app>
```

-   **Server**: [`server/homepie_auth`](server/homepie_auth) (FastAPI), listens on `127.0.0.1:8888` only. nginx and the
    Vite dev server forward `/api/auth` to it, so the browser always talks to the page's own origin.
-   **Login**: the lockscreen asks for the username (the dynamic canvas input), then the password (`Esc` goes back
    to the username). Only after both, one request goes to `POST /api/auth/login`. A wrong username and a wrong
    password are indistinguishable. Five failed attempts per username and client lock it for 15 minutes (`429`).
-   **Session**: a random token in the cookie `homepie_session` (`Domain=.homepie.net; HttpOnly; Secure;
    SameSite=Lax`), so it is valid for `homepie.net` and all subdomains. The server stores only a hash of the
    token (`$HOMEPIE_RUNTIME_PATH/sessions.json`). It expires after 72 hours without use, at the latest after 30 days
    (`HOMEPIE_AUTH_SESSION_IDLE_HOURS`, `HOMEPIE_AUTH_SESSION_MAX_DAYS`). Logout on the hub revokes it.
    Changing or deleting a user's password invalidates all of that user's sessions.
-   **Users**: `$HOMEPIE_DATA_PATH/users.json` is valid JSON, each password is an scrypt hash that is additionally
    encrypted (Fernet) with the key `$HOMEPIE_SECRETS_PATH/users.key` (mode `600`). **Back up that key**, without it
    the users cannot be read and have to be created again.
-   **Apps** (e.g. lockkliye) receive the name of the logged-in user in the request header `X-Homepie-User`
    (nginx overwrites whatever the client sent) and do not get the session cookie. They can trust the header as long
    as they listen on `127.0.0.1` only. An app that is down answers `502`, but only after authentication.
-   **Fail closed**: if the auth server is not running, nginx answers `500` for everything except static files.
    Start it with `start-auth-server --detach`.

```bash
cli/build-scripts/install-auth-server              # once: data dirs, python venv, dependencies, encryption key
cli/build-scripts/manage-users add burak           # asks for the password twice (10 to 36 characters)
cli/build-scripts/manage-users passwd burak
cli/build-scripts/manage-users delete burak
cli/build-scripts/manage-users list
cli/build-scripts/start-auth-server --detach       # background, log: $HOMEPIE_RUNTIME_PATH/auth-server.log
cli/build-scripts/start-auth-server                # foreground
cli/build-scripts/start-auth-server --dev          # auto-reload + cookies that work on plain http
cli/build-scripts/stop-auth-server
```

User changes apply immediately, no restart needed. Tests: `cd server && <venv>/bin/pip install -r requirements/auth-test.txt && <venv>/bin/python -m pytest`.

In development (`start-client-dev`, plain http) the cookie has no `Domain` and no `Secure` flag, so the login only
works on the dev origin and is not shared with subdomains.

### 9. Data directories and `.env`

All runtime, temporary and secret data of my projects lives below `/var/lib/<project>` (`homepie`, `lockkliye`,
`teatype`), never inside the repository:

| Path                           | Content                                                  |
| ------------------------------ | -------------------------------------------------------- |
| `/var/lib/<project>`           | persistent data (for homepie: `users.json`)              |
| `/var/lib/<project>/run`       | pid files, logs, sessions                                |
| `/var/lib/<project>/secrets`   | keys (mode `700`; for homepie: `users.key`)              |
| `/var/lib/<project>/tmp`       | temporary files (mode `700`)                             |

[`.env.template`](.env.template) is the single place that defines these paths and all other settings
(`HOMEPIE_DATA_PATH`, `LOCKKLIYE_DATA_PATH`, `TEATYPE_DATA_PATH`, `*_RUNTIME_PATH`, `*_SECRETS_PATH`, `*_TEMP_PATH`,
`HOMEPIE_AUTH_PORT`, ...). Each key has a `DEFAULT_` twin. The scripts copy it to the git-ignored `.env` on first
use, add keys that are new in the template and never overwrite your values. Precedence: environment variable >
`.env` > `DEFAULT_*`. Scripts and the auth server read it through
[`cli/build-files/load-env`](cli/build-files/load-env) / [`config.py`](server/homepie_auth/config.py), so there is no
second copy of a path anywhere. `cli/build-scripts/setup-data-dirs [homepie|lockkliye|teatype|all]` creates the
directories (with `sudo`, owned by the user running it).

### Order for a fresh server

```bash
cli/build-scripts/modify-netplan                    # static IP (only if not done yet)
cli/build-scripts/setup-cloudflare-credentials      # token → /etc/homepie/cloudflare.ini
cli/build-scripts/setup-periodic-cloudflare-ddns    # DNS records follow the public IP
cli/build-scripts/install-ssl                       # wildcard certificate
cli/build-scripts/install-nginx                     # reverse proxy
cli/build-scripts/install-auth-server               # /var/lib/homepie, venv, encryption key
cli/build-scripts/manage-users add <name>           # at least one user, otherwise nobody can log in
cli/build-scripts/start-client-prod                 # landing page + nginx config + auth server
```

Prerequisites: the nameserver change from step 1 is done and the router forwards TCP 80/443 (step 3).

### Notes on the lockscreen and the apps

-   The lockscreen in [`LoginPage.tsx`](client/src/pages/LoginPage/LoginPage.tsx) authenticates against the auth
    server, the session lives in an `HttpOnly` cookie. `localStorage` is not used for it any more.
-   Icons, images, animations and sounds are loaded at runtime from `client/public/static` (`/static/...`).
    Files below `client/src` only exist in the Vite dev server and are not part of a production build.
-   Apps behind `*.homepie.net` do not need their own login. They read `X-Homepie-User` if they need to know who
    is calling.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TROUBLESHOOTING -->

## Troubleshooting: homepie.net is not reachable

A request has to pass five stages. Check them in this order, the first failing one is the problem.

| # | Stage                 | Check                                                                   | Healthy                                                      |
| - | --------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1 | Nameservers           | `dig +short NS homepie.net @8.8.8.8`                                    | two `*.ns.cloudflare.com`                                    |
| 2 | A record              | `dig +short homepie.net @8.8.8.8` and `curl -s https://api.ipify.org`   | both print the same IP                                       |
| 3 | Router                | forwarding of TCP 80/443 → `192.168.2.134`                              | `curl -I http://<public-ip>` from a mobile network answers  |
| 4 | Server                | `ss -tlnp \| grep -E ':(80\|443)\b'`, `systemctl status nginx`          | nginx listens on 80 and 443                                  |
| 5 | Certificate and nginx | `sudo nginx -t`, `curl -I https://homepie.net`                          | `200`                                                        |

### Findings on 2026-11-03

| # | Result | Evidence                                                                                                                                                                              |
| - | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | ❌     | Nameservers are still `dns1/dns2.registrar-servers.com` (Namecheap). The switch to Cloudflare was never applied (or was reverted), so Cloudflare is not consulted at all.              |
| 2 | ❌     | At Namecheap `homepie.net` points to `192.64.119.69` (Namecheap URL redirect, `HTTP 302 → www.homepie.net`) and `www` is a CNAME to `parkingpage.namecheap.com`. `*.homepie.net` has no record. The public IP is `93.196.242.174`, which no record points to. |
| 2 | ❌     | `ddclient` fails every 5 minutes (`Validation error; invalid password`, earlier `CUSTOM-DNS`), so even Namecheap's Dynamic DNS never updated the record.                              |
| 3 | ❓     | Cannot be checked from the server. See below.                                                                                                                                         |
| 4 | ❌     | `nginx` is stopped and nothing listens on 80 or 443 (`install-ssl` used to even disable it, and `vite` has to be started manually). `ufw` is active, its rules were not readable without sudo. |

### Fix

1. **Nameservers** (step 1 above): set Custom DNS in Namecheap to the two Cloudflare nameservers and wait for the
   site to become active in Cloudflare. This is the reason the domain currently ends on a Namecheap parking page.
2. **DNS records and dynamic IP**: `setup-cloudflare-credentials`, then `setup-periodic-cloudflare-ddns`
   (steps 2 and 4). Remove the old Namecheap redirect/parking records, they are irrelevant after step 1.
3. **Router**: forward TCP 80 and 443 to `192.168.2.134`. The server has a second, DHCP-assigned address
   (`192.168.2.130`); forward to `.134`, not `.130`.
   Make sure the router's own WAN IP equals the public IP (`curl https://api.ipify.org` on the server). If it
   differs (e.g. `100.64.x.x` or a private address), the ISP uses CGNAT/DS-Lite and **port forwarding can never
   work**; use a [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
   (`cloudflared`) instead, which needs no open port. Ask the ISP for a public IPv4 address as the alternative.
4. **Server**: `install-ssl`, `install-nginx`, `deploy client`.
5. **Verify** from outside the home network (mobile data), because many routers do not support NAT loopback and
   `http://<public-ip>` therefore fails from inside the LAN even when everything is correct:

```bash
dig +short homepie.net @1.1.1.1
curl -I https://homepie.net
curl -I https://lockkliye.homepie.net     # 502 means nginx works but the app is not running on 127.0.0.1:8101
```

Common symptoms afterwards:

| Symptom                                  | Cause                                                                       |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| Namecheap parking page / redirect to www | Nameservers still at Namecheap                                              |
| `DNS_PROBE_FINISHED_NXDOMAIN` for a subdomain | No `*` A record (the DDNS script creates it) or DNS not propagated yet |
| Connection timed out                     | Router forwarding / firewall / CGNAT                                        |
| Connection refused                       | nginx not running, or the port is taken by the Vite dev server              |
| Certificate warning                      | Wildcard certificate not issued, or `install-ssl` not run                   |
| Cloudflare error 521/525/526             | Proxied record while nginx is down, or SSL mode is not **Full (strict)**    |
| `502 Bad Gateway` on `<app>.homepie.net` | The app is not running on the port from `00-homepie-apps.conf`              |
| Works on mobile data, not at home        | Router without NAT loopback. Add `192.168.2.134 homepie.net lockkliye.homepie.net` to the hosts file of the PC, or a local DNS override on the router |
| `https://192.168.2.134` closes the connection | Intended: nginx only answers for `homepie.net` and its subdomains (`return 444` for anything else) |
| Certificate warning on `<app>.homepie.net` only | Certificate lacks `*.homepie.net`. Run `install-ssl` again, it replaces a non-wildcard certificate |
| `404` on `<app>.homepie.net`             | The subdomain is missing in `00-homepie-apps.conf` (only shown after logging in) |
| `500` on every page                      | The auth server is not running: `cli/build-scripts/start-auth-server --detach`, log in `/var/lib/homepie/run/auth-server.log` |
| Login always fails                       | No user yet (`manage-users list`), or in dev mode with a production-mode auth server (`Secure` cookie on http) |
| Logged out on every subdomain            | Session cookie without `Domain`: `HOMEPIE_AUTH_COOKIE_DOMAIN` must be `.homepie.net` and the server was not started with `--dev` |
| `429` on login                           | Too many failed attempts, wait 15 minutes (`Retry-After`)                   |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under GPL-3 license. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Project Link: [https://github.com/arsonite/homepie](https://github.com/arsonite/homepie)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: images/screenshot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-20232A?style=for-the-badge&logo=typescript&logoColor=3178C6
[TypeScript-url]: https://www.typescriptlang.org/
[redis]: https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=EEEEEE
[redis-url]: https://redis.io/de/
[Celery]: https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=EEEEEE
[Celery-url]: https://docs.celeryq.dev/en/stable/index.html
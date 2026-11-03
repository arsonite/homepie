A. Outside the server
1. Add the domain to Cloudflare

In Cloudflare, add homepie.net as a site on the Free plan.
Note the two nameservers it gives you (yours were luke.ns.cloudflare.com and rachel.ns.cloudflare.com).

2. Switch the nameservers at Namecheap

Go to Domain List → Manage → Nameservers → Custom DNS and enter those two nameservers.
Turn DNSSEC off if it's on.
Wait until Cloudflare shows the site as Active (minutes to a few hours). Check with dig +short NS homepie.net @8.8.8.8. It should now return the cloudflare.com names.

3. Create the Cloudflare API token

Go to My Profile → API Tokens → Create Token → template Edit zone DNS.
Set permissions to Zone · DNS · Edit, and zone resources to Include · Specific zone · homepie.net.
Keep the token somewhere handy. You'll paste it in step 6.

4. Configure the router

Forward TCP 80 and 443 to 192.168.2.134 (not .130).
Don't forward SSH (22) or any app port.
Check that the router's WAN IP equals 93.196.242.174 (what curl https://api.ipify.org prints on the server). If it doesn't, you're behind CGNAT or DS-Lite and forwarding won't work. In that case stop here and tell me, and we'll switch to a Cloudflare Tunnel.
B. On the server
You can start these as soon as step 2 is done, in this order:

5. Install the new scripts' dependencies

6. Store the token

Paste the token when prompted. The script verifies it and writes /etc/homepie/cloudflare.ini.

7. Set up the DNS records and keep the IP current

This creates homepie.net and *.homepie.net A records pointing at your public IP, disables the broken ddclient, and installs a 5-minute timer. Then check:

8. Issue the wildcard certificate

This needs step 7 to have run, since the DNS challenge uses the Cloudflare token. The final certbot renew --dry-run should succeed.

9. Install nginx and the proxy config

Nothing else may be using port 443. The Vite dev server defaults to 443, so stop it first or run it with VITE_PORT=8443.

10. Publish the landing page

C. Verify, from mobile data and not your home Wi-Fi

Then open https://homepie.net in a browser. You should see the lockscreen, and after login the Lockkliye tile.

Afterwards
Start Lockkliye on 127.0.0.1:8101, or change the port in nginx/conf.d/00-homepie-apps.conf and run scripts/build/deploy nginx.
If anything fails, the README's Troubleshooting section has a symptom table. If a step fails, send me the output.
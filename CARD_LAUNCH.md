# Calling card — remaining launch steps

The card is built, merged and live at <https://joaquingalang.dev/c>. Everything
below is configuration and verification that has to happen outside the codebase.

Do them in this order — step 4 is the gate, and step 6 is irreversible once the
cards are printed.

Background on how any of it works is in the **Calling Card** section of
[`README.md`](./README.md).

---

## Status

| | |
|---|---|
| ✅ | `/c` and `/e` live, functions running in `sin1` (Singapore) |
| ✅ | vCard served with correct `Content-Type` and `Content-Disposition` |
| ✅ | Server-side counter writing to Upstash (`visits:c`, `visits:e`, `saves:c`, `saves:e`) |
| ⬜ | Apex domain still redirects to `www` |
| ⬜ | Vercel Web Analytics not enabled |
| ⬜ | Not yet tested on a real iPhone / Android |
| ⬜ | Counter still contains test hits |

---

## 1. Make the apex domain primary

Right now `joaquingalang.dev` returns a `308` to `www.joaquingalang.dev`. The
card works either way, but every single scan pays an extra round trip, and
encoding the `www` version instead makes the URL four characters longer — a
denser QR at the ~2cm it gets printed at, which is exactly what the one-letter
paths were for.

**Vercel → my-portfolio-website → Settings → Domains.** Set
`www.joaquingalang.dev` to redirect to `joaquingalang.dev`, rather than the
reverse.

Verify — the first line should be `200`, not `308`:

```bash
curl -sI https://joaquingalang.dev/c | head -1
```

## 2. Enable Vercel Web Analytics

Nothing is collected until this is on, and **there is no backfill** — it counts
from the moment you enable it. It is also **production-only**; preview
deployments never appear.

```bash
npx vercel project web-analytics
```

Verify (should be `200`, not `404`):

```bash
curl -sL -o /dev/null -w "%{http_code}\n" https://joaquingalang.dev/_vercel/insights/script.js
```

## 3. Read analytics from the terminal (optional)

Only needed if you want the Vercel numbers outside the dashboard.

1. Create a token at <https://vercel.com/account/tokens>. Copy it immediately —
   it is shown once.
2. Put it in **`.env.local`**, *not* `.env`:

```bash
VERCEL_ANALYTICS_TOKEN=your_token_here
VERCEL_PROJECT_ID=prj_kFylDfcceA6DcqwjlUzeoa2ebcDt
VERCEL_TEAM_ID=team_iz70zua8XzMAeAUXQk3IcD17
```

> `.env.local` matters. `vercel env pull` **overwrites `.env`** — that is how the
> EmailJS values went missing. `npm run stats` reads `.env.local` first, so a
> pull can never clobber the token.

## 4. Test on real phones — the gate

Nothing else can substitute for this. The headers and bytes are verified
correct, but whether iOS actually offers to add the contact is only observable
on a physical device.

Open <https://joaquingalang.dev/c> on **an iPhone (Safari)** and **an Android
(Chrome)**, then tap **Save contact**.

- ✅ The native *Add Contact* sheet opens, showing name, title, photo, number
- ❌ A wall of `BEGIN:VCARD` text means the headers are not reaching the browser

Also check, one-handed and outdoors if you can: the photo loads, the green
button is comfortably tappable, and Email and WhatsApp open the right apps.

**Do not print anything until this passes on both.**

## 5. Clear the test data

The counter currently holds hits from building and verifying the page. Wipe it
so your first real numbers mean something.

**Vercel → Storage → `card-analytics` → Data Browser**, then:

```
DEL visits:c visits:e saves:c saves:e
```

Confirm it is clean:

```bash
npm run stats
```

> Alternatively, ask Claude to namespace the keys by environment so preview and
> local traffic never touch production counts. Worth doing if you expect to keep
> iterating on the page after launch.

## 6. Generate the QR

Only after steps 1 and 4 pass.

Encode exactly:

```
https://joaquingalang.dev/c
```

Not the `www` version, not a preview URL, and **not** a dynamic-QR service — the
whole point of owning `/c` is that the destination stays repointable forever
without the printed card ever going dead.

Use `/e` for event handouts and standees. Same page, separate numbers.

---

## Reading the numbers afterwards

```bash
npm run stats              # last 30 days, both layers
npm run stats -- --days 7
npm run stats -- --fresh   # bypass the 1-hour Vercel API cache
```

**Layer 1** (Upstash) is the trusted count — it runs server-side and cannot be
blocked. It knows how many, when, the referring host, and mobile vs desktop.

**Layer 2** (Vercel) is a browser script, so ad blockers and privacy browsers
drop a share of it. It knows country, browser, OS and device.

When they disagree, **layer 1 is right** — layer 2 reading lower is the expected
behaviour and the entire reason layer 1 exists.

The ratio worth watching is `saves:c ÷ visits:c`. If people are scanning but not
saving, the page has a problem worth fixing.

For ad-hoc queries, the Upstash Data Browser takes raw Redis:

```
ZCARD visits:c                       # total scans ever
ZCOUNT visits:c 1767225600000 +inf   # scans since an epoch-ms timestamp
ZRANGE visits:c -20 -1               # the 20 most recent, raw
```

---

## Unrelated, but outstanding

**The contact form on the main site has never worked.** `VITE_EMAILJS_SERVICE_ID`,
`VITE_EMAILJS_TEMPLATE_ID` and `VITE_EMAILJS_PUBLIC_KEY` are absent from Vercel
entirely — verified against the shipped production bundle, which contains no
service or template IDs. `ContactForm` has been falling back to a mailto link
this whole time.

To fix: get the three values from <https://dashboard.emailjs.com>, then

```bash
npx vercel env add VITE_EMAILJS_SERVICE_ID
npx vercel env add VITE_EMAILJS_TEMPLATE_ID
npx vercel env add VITE_EMAILJS_PUBLIC_KEY
```

Add them to all three environments and redeploy. These are public-by-design keys
that ship in the browser bundle, which is why they carry the `VITE_` prefix —
never give that prefix to anything secret.

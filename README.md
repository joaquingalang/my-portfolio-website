<p align="center">
 <img width="100px" src="https://github.com/user-attachments/assets/668ba69d-0711-4697-83cb-b668398b7699" align="center" alt="GitHub Readme Stats" />
 <h2 align="center">Quin's Portfolio</h2>
 <p align="center">My Official Portfolio Websiter</p>
</p>

<p align="center">
    <a href="https://github.com/joaquingalang/my-portfolio-website/graphs/contributors">
      <img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/joaquingalang/my-portfolio-website?color=0088ff"/>
    </a>
    <a href="https://github.com/joaquingalang/my-portfolio-website/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/joaquingalang/my-portfolio-website?color=0088ff"/>
    </a>
    <a href="https://github.com/joaquingalang/my-portfolio-website/pulls">
      <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/joaquingalang/my-portfolio-website?color=0088ff"/>
    </a>
  </p>

  <p align="center">
    <a href="/">View Demo</a>
    ·
    <a href="https://github.com/joaquingalang/my-portfolio-website/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml">Report Bug</a>
    ·
    <a href="https://github.com/joaquingalang/my-portfolio-website/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.yml">Request Feature</a>
    ·
    <a href="https://github.com/joaquingalang/my-portfolio-website/discussions/1770">FAQ</a>
    ·
    <a href="https://github.com/joaquingalang/my-portfolio-website/discussions/new?category=q-a">Ask Question</a>
  

# About the Project

Welcome! This repository contains the source code for my personal portfolio website.  
It serves as a showcase of my work, technical skills, and involvement in projects and communities I care about.

**Live site:** *https://joaquingalang.vercel.app/*

This portfolio highlights:
- Selected technical projects
- Community and organizational involvement
- Awards and recognitions
- Ways to get in touch or collaborate

The goal of this site is to provide a clear picture of my **competency, experience, and growth** as a developer.

## Tech Stack

This portfolio is built as a **static site** using modern web technologies:

- **React (TypeScript)** – component-based UI development
- **Tailwind CSS** – utility-first styling for rapid iteration
- **Vercel** – deployment and hosting

## Site Sections

### 🔹 About
A short introduction, background, and areas of interest.

### 🔹 Projects
A curated list of projects that demonstrate:
- Technical skills
- Problem-solving ability
- Real-world application

Most projects include:
- 🌍 Live demos
- 📦 Source code repositories  
*(Availability depends on the project)*

### 🔹 Involvement
Community building, organizational roles, and collaborative experiences outside of solo development work.

### 🔹 Awards
Academic, professional, or community recognitions.

### 🔹 Contact
Ways to reach me for opportunities, collaboration, or conversation.

## Running Locally

If you’d like to run the site locally:

```bash
# Install dependencies
npm install

# Configure the contact form (EmailJS)
cp .env.example .env   # then fill in the values

# Start development server
npm run dev

```

## Calling Card (`/c` and `/e`)

> Remaining launch steps — domain, analytics, device testing — are tracked in
> [`CARD_LAUNCH.md`](./CARD_LAUNCH.md).

The short-path landing page the QR code on the printed calling card resolves to.
Its one job is getting contact details saved into the scanner's phone — and,
since the gate was added, learning who the scanner was on the way.

| Path | Purpose |
|---|---|
| `/c` | The calling card. This is the URL that goes on print. |
| `/e` | Event handouts and standees. Same page, separate analytics identity. |
| `/c?v=1`, `/e?v=1` | The contact details, past the gate. Never printed — see below. |
| `/c/contact.vcf`, `/e/contact.vcf` | The vCard, generated per request. |

Paths are kept this short on purpose: a shorter URL means a lower-density QR,
which matters when the code is printed at ~2 cm. For the same reason the surfaces
are separated by path, never by UTM query params — query strings inflate density
and some scanners strip them.

### How it is built

Unlike the rest of the site, these are **not** React routes. The site is a static
SPA with no router and no server, which cannot satisfy two of the requirements:
the page must be readable before JS runs, and a visit must count even with
JavaScript disabled. So `vercel.json` rewrites both paths to Vercel Edge
Functions that return a complete HTML document and record the visit during the
request.

```
vercel.json          rewrites /c, /e and the .vcf paths onto the functions
api/card.ts          renders the page
api/vcard.ts         generates the vCard 3.0 file
api/_lib/profile.ts  name, title, email, phone, links — single source of truth
api/_lib/analytics.ts server-side visit counter
api/_lib/photo.ts    the portrait, base64, for the vCard PHOTO property
```

The palette and type in `api/card.ts` are copied from `.impeccable.md` rather
than imported, so **if the design tokens change, change them there too.**

### The gate

Both surfaces open on a short form — name, where we met, what you're here for,
how to reach you, anything to remember — and the contact details sit behind it.
Only the name is required, and there is a Skip link straight to the card.

That is a deliberate trade. It costs some share of the saves in exchange for
knowing who the scan was, which is why `saves:c ÷ visits:c` is worth watching
either side of a change to it — see [`CARD_LAUNCH.md`](./CARD_LAUNCH.md).

It is **a real `<form method="post">`, not a JavaScript reveal.** That is not a
stylistic preference: the reason this page is a function rather than a React
route is that it has to work before and without JS, and a client-side gate would
throw that away — script blocked would mean no form, or worse, no card. Three
server-rendered states:

```
GET  /c          the gate
POST /c          record the lead, then 303 to the card
GET  /c?v=1      the card
```

`?v=1` is set by the Skip link and by that redirect, **never by the QR code** —
the printed URL stays bare `/c`, which is what keeps the code low-density. It
survives the rewrite because Vercel merges the incoming query string into the
destination's; `scripts/card-dev.mjs` reproduces that so the local preview
behaves the same way.

Two details worth knowing before editing:

- **Only the gate counts as a visit.** Counting the reveal as well would double
  every number in `visits:*` and quietly break the ratio above.
- **The dropdown and checkbox values are validated against
  `api/_lib/profile.ts`** and discarded if they do not match, so those two
  fields can never hold anything a stranger typed. A honeypot field and a
  "faster than a person can type" check drop bot submissions silently — they
  still get the normal redirect, so they cannot tell.

### Local preview

`npm run dev` serves the SPA but knows nothing about `/api`, so the card is
invisible to it. Use:

```bash
npm run card     # http://localhost:4321/c
```

It applies the real rewrites from `vercel.json` and rebuilds on every request.

Checks for the parts that fail silently — vCard formatting, the bot filter, and
the guarantee that a dead analytics store cannot take the page down:

```bash
npm run card:test
```

It cannot cover how a real iPhone or Android handles the `.vcf`; that has to be
done by hand on a preview deployment.

### Analytics

Two layers, answering different questions.

**Layer 1 — server-side counter.** Runs during the request, before any client JS,
so it counts scans that ad blockers and privacy browsers would hide. Stored in
Upstash Redis as a sorted set scored by timestamp (`visits:c`, `visits:e`,
`saves:c`, `saves:e`), so "how many, and on which days" is one query. No cookies,
no IP addresses, no raw user-agents — a counter, not a profile, and deliberately
outside consent-banner territory. Link-preview bots, crawlers, prefetches and
`HEAD` requests are filtered out. **A failed write never affects the page.**

**Layer 2 — Vercel Web Analytics.** Referrers, country, device. Mounted in
`src/main.tsx` for the SPA and loaded directly on the card page, plus a
`save_contact` custom event on the Save contact tap. This layer is blockable, so
treat it as texture rather than volume — and note that the gate makes one
scanner produce two `/c` pageviews here, which is another reason not to read
volume off it.

**Leads — the gate form.** A separate pair of keys, `leads:c` and `leads:e`, and
a different kind of data: a name and a contact address somebody chose to type,
rather than anything observed. Kept under its own keys on purpose — the counters
above are anonymous by construction, and joining the two would quietly turn one
into a profile. Deleting `leads:c` costs you no scan counts. Same failure
contract as layer 1: never blocks the response, and a dead store loses the lead
rather than the page.

Read both back from the terminal:

```bash
npm run stats                # last 30 days
npm run stats -- --days 7
npm run stats -- --fresh     # bypass the 1-hour Vercel API cache
```

### Setup

1. Add the **Upstash Redis** integration to the Vercel project (Marketplace). It
   provisions `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
2. Enable **Web Analytics** on the Vercel project, or layer 2 collects nothing.
3. For local `npm run stats`, copy the variables into `.env` — see
   `.env.example`. The Vercel token is account-scoped and is **not** `VITE_`
   prefixed on purpose: Vite inlines every `VITE_*` variable into the client
   bundle, and this one must never reach a browser.

### Card assets

`public/card/joaquin.webp` (page avatar) and the base64 blob in
`api/_lib/photo.ts` (vCard photo) are both generated from a square headshot:

```bash
python -c "
from PIL import Image
import base64, io, textwrap
src = Image.open('headshot.png').convert('RGB')
src.resize((320, 320), Image.LANCZOS).save('public/card/joaquin.webp', 'WEBP', quality=82, method=6)
buf = io.BytesIO(); src.resize((192, 192), Image.LANCZOS).save(buf, 'JPEG', quality=72, optimize=True)
print(base64.b64encode(buf.getvalue()).decode())
"
```

Keep the vCard photo small — a bloated `.vcf` makes iOS slow to open the Add
Contact sheet, which is the one interaction that must not stall.

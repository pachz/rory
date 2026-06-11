# Rory

Multi-tenant restaurant menu browser powered by Next.js. Each subdomain (e.g. `kaban.rory.ir`) loads a branded mini-site with menu categories, item details, and a browse-only cart.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment

| Variable | Description | Default |
|----------|-------------|---------|
| `MAIN_DOMAIN` | Root domain for subdomain routing | `rory.ir` |
| `CITADEL_API_URL` | GraphQL API endpoint | `https://citadel.menew.ir/api` |
| `CACHE_REVALIDATE_SECONDS` | Per-subdomain cache TTL | `300` |

## Local development

**Option 1 — query param (easiest)**

```
http://localhost:3000/?subdomain=kaban
```

**Option 2 — subdomain localhost**

```
http://kaban.localhost:3000
```

## Vercel deployment

1. Import the repo in [Vercel](https://vercel.com)
2. Set environment variables (`MAIN_DOMAIN`, etc.)
3. Add your domain in Vercel → Domains:
   - `rory.ir` (apex)
   - `*.rory.ir` (wildcard for all subdomains)
4. Point DNS to Vercel as instructed

The middleware rewrites `{subdomain}.{MAIN_DOMAIN}` to the restaurant page and caches API responses per subdomain via `unstable_cache`.

## Features

- Subdomain-based tenant routing
- GraphQL integration with MeNEW Citadel API
- Per-subdomain ISR caching
- Dynamic branding (logo, cover, primary/secondary colors)
- RTL support for Persian restaurants
- Category navigation with scroll spy
- Item detail modal with product options
- Browse-only cart (no checkout)

## API

Data is fetched from three GraphQL operations:

- `getIntro` — restaurant info & branding
- `getEntityItems` — menus, categories, items
- `GetEntityAmenities` — amenities list

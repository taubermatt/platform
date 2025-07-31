# Multi-Tenant Platform

A Next.js application demonstrating both subdomain and custom domain multi-tenancy patterns using Vercel for domain management.

## Features

### Subdomain Multi-Tenancy

- Create subdomains like `tenant.yourdomain.com`
- Automatic routing to `/s/[subdomain]` pages
- Simple emoji-based customization
- Redis-based data storage

### Custom Domain Multi-Tenancy

- Connect custom domains like `customdomain.com`
- Automatic routing to `/d/[domain]` pages
- Vercel SDK integration for domain management
- Domain verification and SSL certificate handling
- Redis-based data storage with verification status

## Architecture

```
app/
├── s/[subdomain]/page.tsx     # Subdomain tenant pages
├── d/[domain]/page.tsx        # Custom domain tenant pages
├── admin/
│   ├── page.tsx               # Main admin dashboard
│   ├── subdomains/
│   │   ├── page.tsx           # Subdomain management page
│   │   └── dashboard.tsx      # Subdomain management component
│   └── domains/
│       ├── page.tsx           # Custom domain management page
│       └── dashboard.tsx      # Custom domain management component
├── actions.ts                 # Server actions for both patterns
├── subdomain-form.tsx         # Subdomain creation form
└── domain-form.tsx            # Custom domain creation form

lib/
├── subdomains.ts              # Subdomain utilities
├── domains.ts                 # Custom domain utilities
├── vercel.ts                  # Vercel SDK integration
└── redis.ts                   # Redis client
```

## Setup

### Environment Variables

```env
# Redis (Upstash)
KV_REST_API_URL=your_redis_url
KV_REST_API_TOKEN=your_redis_token

# Vercel (for custom domains)
VERCEL_TOKEN=your_vercel_token
VERCEL_TEAM_ID=your_team_id
VERCEL_PROJECT_ID=your_project_id

# Root domain
NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com
```

### Installation

```bash
pnpm install
pnpm dev
```

## Usage

### Subdomains

1. Visit the homepage
2. Use the "Subdomain Example" form
3. Create a subdomain like `myapp.yourdomain.com`
4. Access your subdomain at `myapp.yourdomain.com`

### Custom Domains

1. Visit the homepage
2. Use the "Custom Domain Example" form
3. Enter your domain like `myapp.com`
4. The domain will be added to your Vercel project
5. Configure DNS to point to Vercel
6. Verify domain ownership
7. SSL certificate will be automatically generated

## Admin Panels

- `/admin` - Main admin dashboard with navigation
- `/admin/subdomains` - Manage subdomains
- `/admin/domains` - Manage custom domains

## Middleware

The middleware handles routing for both patterns:

- Subdomains: `tenant.yourdomain.com` → `/s/tenant`
- Custom domains: `customdomain.com` → `/d/customdomain.com`

## Data Storage

Both patterns use Redis for data storage:

- Subdomains: `subdomain:tenant` → `{ emoji, createdAt }`
- Custom domains: `domain:customdomain.com` → `{ emoji, createdAt, verified, sslStatus }`

## Vercel Integration

The custom domain implementation uses the Vercel SDK to:

- Add domains to your Vercel project
- Verify domain ownership
- Handle SSL certificate generation
- Remove domains when deleted

## Development vs Production

- **Development**: Uses `localhost:3000` for testing
- **Production**: Uses your configured root domain

## Security

- Admin pages are blocked from subdomain/custom domain access
- Domain validation prevents invalid inputs
- Vercel handles SSL certificate security

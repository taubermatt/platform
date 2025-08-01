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
├── subdomains/
│   ├── page.tsx               # Subdomain management page
│   └── subdomain-list.tsx     # Subdomain list component
├── domains/
│   ├── page.tsx               # Custom domain management page
│   └── domain-list.tsx        # Custom domain list component
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

### 1. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Deploy the project

### 2. Set up Upstash Redis

**Option A: Through Vercel Team Settings (Recommended)**

1. In your Vercel dashboard, go to **Team Settings** → **Storage**
2. Click "Create Database" and select "Upstash Redis"
3. Configure your database settings
4. Go to your project settings → **Environment Variables**
5. The Redis credentials will be automatically added as:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

**Option B: Manual Setup**

1. Go to [upstash.com](https://upstash.com) and create a Redis database
2. Copy the REST API URL and token
3. In your Vercel project → **Settings** → **Environment Variables**, add:
   - `KV_REST_API_URL` = your Redis REST API URL
   - `KV_REST_API_TOKEN` = your Redis REST API token

### 3. Get Vercel API Token

1. In your Vercel dashboard, click your profile picture → **Settings**
2. Go to **Tokens** in the left sidebar
3. Click "Create Token"
4. Give it a name (e.g., "Platform API")
5. Select appropriate scopes (you'll need project access)
6. Copy the generated token

### 4. Add Environment Variables

In your Vercel project → **Settings** → **Environment Variables**, add:

```env
# Redis (Upstash) - Added automatically if using Vercel integration
KV_REST_API_URL=your_redis_url
KV_REST_API_TOKEN=your_redis_token

# Vercel API (for custom domains)
VERCEL_TOKEN=your_vercel_token
VERCEL_TEAM_ID=your_team_id
VERCEL_PROJECT_ID=your_project_id

# Root domain (optional)
NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com
```

**Notes:**

- `VERCEL_PROJECT_ID`: Found in your project settings, or leave as default 'platforms'
- `VERCEL_TEAM_ID`: Only needed if using a team account
- `NEXT_PUBLIC_ROOT_DOMAIN`: Your root domain for production, defaults to 'localhost:3000' for development

### 5. Domain Configuration

**For Subdomains:**

1. Add your apex domain to Vercel: `yourdomain.com`
2. Add wildcard domain to Vercel: `*.yourdomain.com`
3. Configure DNS with wildcard record: `*` → `cname.vercel-dns.com`

**For Custom Domains:**

- Each custom domain is automatically added to Vercel when created
- DNS configuration is handled through the multi-step form
- SSL certificates are automatically generated after verification

### 6. Local Development

```bash
pnpm install
pnpm dev
```

For local development, you'll need to create a `.env.local` file with the same environment variables.

**Local Subdomain Testing:**

- First, create a "test" subdomain using the `/subdomains` UI
- Then visit `http://test.localhost:3000` to test subdomains locally
- The middleware will automatically detect and route subdomains in development

## Development Notes

- **Subdomains**: Work in both local development and production
- **Custom Domains**: Require real domains and DNS configuration
- **Redis**: Mock Redis is used in development if not configured
- **Wildcard DNS**: For subdomains, add `*.yourdomain.com` to Vercel project settings
- **Local Testing**: Use `http://test.localhost:3000` for subdomain testing

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
5. Follow the DNS configuration instructions:
   - Add a CNAME record pointing to `yourdomain.cname.vercel-dns.com`
   - Wait for DNS propagation (up to 24 hours)
6. Click "Verify Domain" to check DNS configuration
7. SSL certificate will be automatically generated once verified

## Management Pages

- `/` - Main navigation hub
- `/subdomains` - Manage subdomains
- `/domains` - Manage custom domains

## Middleware

The middleware handles routing for both patterns:

- Subdomains: `tenant.yourdomain.com` → `/s/tenant`
- Custom domains: `customdomain.com` → `/d/customdomain.com`

## Data Storage

Both patterns use Redis for data storage:

- Subdomains: `subdomain:tenant` → `{ emoji, createdAt }`
- Custom domains: `domain:customdomain.com` → `{ emoji, createdAt, verified }`

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

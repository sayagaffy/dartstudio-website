# Dartstudio Operations Runbook

## Quick reference

| Service | Dashboard | Notes |
|---|---|---|
| Vercel | https://vercel.com/dashboard | Hosting + deploy logs |
| Sanity | https://www.sanity.io/manage | CMS project `4e5l2fq5` |
| Supabase | https://supabase.com/dashboard | Project `ksneidscnqojsjnbscvv` |
| Cloudflare | https://dash.cloudflare.com | DNS + R2 bucket `dartstudio-media` |
| Resend | https://resend.com/dashboard | Email logs |
| Upstash | https://console.upstash.com | Redis rate-limit store |
| BetterStack | https://betterstack.com | Uptime monitoring |
| Google Search Console | https://search.google.com/search-console | Indexing |

---

## Deployments

### Normal deploy

Push to `main` → Vercel deploys automatically.

```
git push origin main
```

Watch build at: https://vercel.com/dashboard → project → Deployments.

### Preview deploy

Any branch/PR gets a preview URL automatically from Vercel.

### Rollback

1. Go to Vercel → project → Deployments
2. Find the last known-good deployment
3. Click ⋯ → **Promote to Production**

Or via CLI:
```bash
vercel rollback [deployment-url]
```

---

## Environment variables

All vars are set in Vercel Dashboard → Project → Settings → Environment Variables.

Required vars (copy from `.env.local` but **never commit** `.env.local`):

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
SANITY_API_READ_TOKEN        # viewer token from Sanity → API → Tokens
SANITY_API_WRITE_TOKEN       # editor token (for Studio)
SANITY_REVALIDATE_SECRET     # random 64-char hex string
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_URL
RESEND_API_KEY
CONTACT_TO_EMAIL
CONTACT_FROM_EMAIL
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
INDEXNOW_KEY
```

---

## Content management

### Publish content
Open https://dartstudio.id/admin → log in with Sanity account.

### Revalidate cache after bulk changes
Sanity webhooks trigger ISR automatically on publish.  
Manual trigger:
```bash
curl -X POST "https://dartstudio.id/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>"
```

### Notify search engines (IndexNow)
After publishing a batch of URLs:
```bash
curl -X POST https://dartstudio.id/api/indexnow \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://dartstudio.id/studio","https://dartstudio.id/journal/post-slug"]}'
```

---

## Database (Supabase)

### Access
Supabase dashboard → project → Table Editor or SQL Editor.

### Backups
Supabase free tier: 7-day PITR is NOT included. Manual backup weekly:

```bash
pg_dump "postgresql://postgres:[service-role-key]@db.ksneidscnqojsjnbscvv.supabase.co:5432/postgres" \
  > backup-$(date +%Y%m%d).sql
```

### Key tables
- `contact_submissions` — form submissions from /collaborate contact form
- RLS policies: `contact_submissions` is insert-only from anon; read requires service role.

### Rollback a bad migration
```sql
-- In Supabase SQL Editor
BEGIN;
-- ... reverse migration SQL ...
COMMIT;
```

---

## Storage (Cloudflare R2)

Bucket: `dartstudio-media`  
Public URL: `https://<account-id>.r2.cloudflarestorage.com`

Files are uploaded via Sanity Studio (asset pipeline) or the `/api/r2/upload` endpoint.

### Delete orphaned files
Use Cloudflare dashboard → R2 → dartstudio-media → Objects, or `aws s3 rm` with R2 credentials:
```bash
AWS_ACCESS_KEY_ID=<R2_ACCESS_KEY_ID> \
AWS_SECRET_ACCESS_KEY=<R2_SECRET_ACCESS_KEY> \
aws s3 rm s3://dartstudio-media/path/to/file \
  --endpoint-url https://3c6495b421df912868633dd2130bfed2.r2.cloudflarestorage.com
```

---

## Email (Resend)

Dashboard: https://resend.com/dashboard → Logs

### Test contact form
```bash
curl -X POST https://dartstudio.id/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"hello"}'
```
Expected: `{"success":true}` + email to `dartstudio.team@gmail.com`.

---

## Rate limiting (Upstash Redis)

Rate limit: 5 requests / 60 seconds per IP on `/api/contact`.

Check usage: Upstash Console → Redis → your database → Data Browser.

### Reset a specific IP
```bash
curl -X DELETE https://special-pony-70267.upstash.io/del/ratelimit:contact:<ip> \
  -H "Authorization: Bearer <UPSTASH_REDIS_REST_TOKEN>"
```

---

## Monitoring

### Uptime alerts
Configure BetterStack (or UptimeRobot) to monitor:
- `https://dartstudio.id/` — every 3 min
- `https://dartstudio.id/api/health` — every 5 min (if implemented)

### Error tracking
Vercel Dashboard → project → **Logs** tab shows real-time function logs.  
Filter by `ERROR` to find issues.

### Core Web Vitals
Vercel Dashboard → project → **Analytics** (powered by `@vercel/analytics`).

---

## DNS (Cloudflare)

Domain managed in Cloudflare. Important settings:
- **Proxy**: must be **gray cloud (DNS only)** for the `dartstudio.id` A record pointed to Vercel.  
  Vercel needs to issue its own TLS certificate — orange cloud breaks this.
- **SSL/TLS**: Full (strict) in Cloudflare settings.

### Add domain to Vercel
1. Vercel → project → Settings → Domains → Add `dartstudio.id`
2. Copy the A record IP Vercel gives
3. In Cloudflare: DNS → Edit A record → set IP, **disable proxy (gray cloud)**
4. Wait for propagation (~5 min typical)

---

## SEO / Indexing

### Submit sitemap
1. Google Search Console → Sitemaps → Submit `https://dartstudio.id/sitemap.xml`
2. Bing Webmaster Tools → Sitemaps → Submit same URL

### IndexNow key verification
File is at: `https://dartstudio.id/bcde9abcc9ad7b6fe8713b959f6ef00b.txt`  
Key value: `bcde9abcc9ad7b6fe8713b959f6ef00b`

---

## Emergency procedures

### Site is down (5xx)
1. Check Vercel deployment status — is there a failed deploy?
2. If yes → rollback (see Deployments section)
3. Check Vercel function logs for error details
4. If Sanity is down: static pages still serve from CDN; only ISR revalidation fails

### Database unreachable
- Supabase free tier may pause after 7 days of inactivity
- Unpause: Supabase dashboard → project → Restore project
- Contact form will return 503 until restored

### Rate-limit false positives
If legit users are hitting the rate limit on the contact form:
1. Check Upstash for the offending IPs
2. Adjust `RATE_LIMIT_REQUESTS` / `RATE_LIMIT_WINDOW_MS` in `lib/rateLimit.ts` if needed
3. Redeploy

---

*Last updated: 2026-05-13*

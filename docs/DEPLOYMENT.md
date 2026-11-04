# AnumatiSetu Production Deployment Guide

This guide covers deployment strategies for **AnumatiSetu** across cloud providers, container clusters, and serverless environments.

---

## 🐳 Option 1: Docker Compose (Single Host / VPS)

Deploy the full stack on any standard Linux VPS (Ubuntu 22.04 LTS / Debian 12):

```bash
# Clone the repository
git clone https://github.com/Virajmahale21/sih2026262.git
cd sih2026262

# Build and start services in detached mode
docker compose up -d --build

# View logs
docker compose logs -f
```

The frontend will be accessible on `http://<server-ip>:3000` and the API server on `http://<server-ip>:5000`.

---

## ⚡ Option 2: Vercel Serverless Deployment

AnumatiSetu includes native Vercel configuration (`vercel.json`) allowing instantaneous zero-server hosting:

1. Connect the GitHub repository `Virajmahale21/sih2026262` to Vercel.
2. The project will automatically execute:
   - Root `npm run prisma:generate`
   - Client build `npm run build` in `client/`
   - Serverless API handler in `api/index.js`
3. Set environment variable `JWT_SECRET` in the Vercel dashboard.

---

## 🛡️ Production Security Checklist

- [ ] Ensure `NODE_ENV=production` is set in the runtime environment.
- [ ] Replace default `JWT_SECRET` with a high-entropy 64-character random string.
- [ ] Configure HTTPS / SSL certificates via Nginx or Cloudflare.
- [ ] Set up daily automated backups for `dev.db` or PostgreSQL cluster.
- [ ] Configure rate-limiting on sensitive endpoints (`/api/auth/login`).

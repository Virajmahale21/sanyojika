# AICTE Sanyojika - Cloud-Native Deployment Runbook

**Environment Target:** Production Cloud (Vercel Edge + Render PaaS)  
**Live Frontend:** `https://sih-264.vercel.app`  
**Live API Gateway:** `https://sih264.onrender.com`  

---

## 1. Production Architecture Overview

```mermaid
graph LR
    User[Officer / Citizen Browser] -->|HTTPS / TLS 1.3| VercelEdge[Vercel Global CDN Edge]
    VercelEdge -->|React 18 SSR / SSG| NextJS[Next.js Application]
    NextJS -->|REST API / JWT| RenderNode[Render Web Service - Node.js Express]
    RenderNode -->|IPC / HTTP| PyEngine[Python AI Intelligence Engine]
    RenderNode -->|Prisma ORM| Postgres[(PostgreSQL Production DB)]
```

---

## 2. Environment Configuration

### 2.1 Frontend (`client/.env.production`)
```env
NEXT_PUBLIC_API_URL=https://sih264.onrender.com/api
NEXT_PUBLIC_APP_NAME="AICTE Sanyojika"
NEXT_PUBLIC_VERSION="2.4.0"
```

### 2.2 Backend (`server/.env.production`)
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://sanyojika_user:*****@dpg-cql.render.com/sanyojika_db
JWT_SECRET=aicte_sanyojika_production_jwt_secret_2026
AI_SERVICE_URL=http://localhost:8000
```

---

## 3. Step-by-Step Deployment Procedure

### 3.1 Backend Deployment (Render)
1. Link GitHub repository `sanyojika-ps262` to Render Web Service.
2. Build Command: `cd server && npm install && npx prisma generate && npm run build`
3. Start Command: `cd server && npm start`
4. Health check endpoint: `/api/complaints`

### 3.2 Frontend Deployment (Vercel)
1. Import repository `sanyojika-ps262` in Vercel dashboard.
2. Root directory: `client`
3. Framework preset: `Next.js`
4. Deploy with automatic SSL provisioning.

---

## 4. Disaster Recovery & Failover
- Automated database snapshots every 6 hours with 30-day point-in-time recovery (PITR).
- Blue/Green zero-downtime deployment rollouts via Vercel immutable deployment hashes.

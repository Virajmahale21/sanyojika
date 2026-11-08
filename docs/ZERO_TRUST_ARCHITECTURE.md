# AICTE Sanyojika - Zero-Trust Network & Security Architecture

**Security Directive:** AICTE-ZTNA-2026-V1  
**Target Infrastructure:** Microservice Fabric (API Gateway, AI Engine, Document Store)

---

## 1. Principles of Zero Trust
1. **Never Trust, Always Verify:** Every intra-cluster RPC call requires mTLS with ephemeral X.509 certificates.
2. **Least Privilege Enforcement:** Investigating scrutiny officers possess read access strictly scoped to assigned caseloads.
3. **Continuous Posture Assessment:** Session tokens expire in 60 minutes and require active biometric or TOTP re-authentication for mutating actions.

---

## 2. Microsegmentation Matrix
- **Zone A (Public Edge):** Vercel CDN -> Next.js Frontend (Strict Content Security Policy).
- **Zone B (Application Gateway):** Express REST Gateway with rate limiting & JWT verification.
- **Zone C (AI Microservices):** Isolated VPC subnet running Python inference nodes with no direct public internet egress.
- **Zone D (Persistence Tier):** PostgreSQL database accessible exclusively via authenticated Prisma connection pool.

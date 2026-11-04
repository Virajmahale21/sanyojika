# Security Policy

## Supported Versions

We take security seriously for **AnumatiSetu**, given its role as an approval and compliance infrastructure portal. The following versions are actively maintained with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

If you discover a security vulnerability within AnumatiSetu, please report it promptly.

### How to Report
Please **DO NOT** report security vulnerabilities through public GitHub issues.

Instead, please send an encrypted or direct email to:
- **Security Contact**: virajmahale147@gmail.com
- **Subject**: `[SECURITY VULNERABILITY] AnumatiSetu - <Component/Module>`

### What to Include
To help us triage and resolve the issue quickly, please provide:
1. Type of vulnerability (e.g. Authentication Bypass, SQL/Prisma Injection, Privilege Escalation, XSS, CSRF).
2. Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
3. Affected components (`client/`, `server/`, `prisma/`, or `api/`).
4. Any potential remediation recommendations.

---

## Response Timeline & SLA
- **Initial Acknowledgement**: Within 24 hours of report receipt.
- **Triage & Assessment**: Within 48 hours.
- **Patch Release & Security Advisory**: Depending on severity, critical vulnerabilities are patched within 3-5 business days.

---

## Security Architecture Highlights
- **Role-Based Access Control (RBAC)**: All sensitive routes guarded by strict JSON Web Token (JWT) verification and role permissions.
- **Immutable Audit Trail**: Key approval actions, status shifts, and document inspections are logged to an append-only audit trail.
- **Sanitized Uploads & Storage**: Document uploads validate MIME types and file extensions to prevent malicious payload execution.

# Contributing to AnumatiSetu

Thank you for your interest in contributing to **AnumatiSetu – Smart Workflow Automation & SLA Monitoring Platform (SIH 2026 PS-262)**.

This guide outlines our development workflow, coding standards, and submission guidelines.

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (v20 LTS recommended)
- **npm**: v9.0.0 or later
- **Git**: v2.30+

### Clone & Install
```bash
git clone https://github.com/Virajmahale21/sih2026262.git
cd sih2026262

# Install dependencies across workspaces
npm install
npm --prefix client install
npm --prefix server install
```

### Database Initialization
```bash
# Generate Prisma Client and push migrations
npm run prisma:generate
npm run prisma:push
```

### Running the Full-Stack Prototype
```bash
# Run both client (Vite on :5173) and server (Express on :5000) concurrently
npm run dev
```

---

## 🏛️ Code Standards & Architecture Guidelines

1. **Strict Type Safety**: All TypeScript files in `client/` and `server/` must pass `tsc` with zero errors.
2. **Component Structure**: Follow Atomic / Modular React component patterns in `client/src/components/`.
3. **Multilingual Consistency**:
   - Any new user-facing strings must be mapped across `client/src/locales/en/common.json`, `client/src/locales/hi/common.json`, and `client/src/locales/mr/common.json`.
   - Use `useTranslation()` from `react-i18next`.
4. **Branding Guidelines**:
   - Always use the centralized `AnumatiSetuLogo` component.
   - Do not crop, modify, or statically hardcode logos.
5. **Security & RBAC**:
   - Every API route must be guarded with `authMiddleware` and role checks using `requireRole(...)`.

---

## 🌿 Branching & Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Formatting, UI style tweaks
- `refactor:` Code refactoring without behavior change
- `perf:` Performance improvements
- `test:` Unit or integration tests
- `ci:` CI/CD workflow updates

### Submitting a Pull Request
1. Fork the repository and create a descriptive branch: `git checkout -b feat/your-feature-name`.
2. Ensure builds pass: `npm --prefix client run build` and `npm --prefix server run build`.
3. Push to your fork and submit a Pull Request targeting `main`.

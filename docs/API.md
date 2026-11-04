# AnumatiSetu REST API Specification

AnumatiSetu exposes a structured RESTful API configured under `/api/*`.

---

## 🔐 1. Authentication (`/api/auth`)

### `POST /api/auth/login`
Authenticates a user and returns a signed JWT token along with user profile and assigned institution.
- **Request Body**:
  ```json
  {
    "email": "officer.central@aicte.gov.in",
    "password": "password123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "usr_cadmin_01",
      "email": "officer.central@aicte.gov.in",
      "fullName": "Dr. Rajeshwar Sharma",
      "role": "CENTRAL_ADMIN"
    }
  }
  ```

### `GET /api/auth/me`
Returns current session payload and profile based on the `Authorization: Bearer <token>` header.

---

## 📑 2. Applications Management (`/api/applications`)

### `GET /api/applications`
Retrieves institutional applications filtered by stage, academic year, status, or search query.
- **Query Params**: `status`, `stage`, `type`, `search`
- **RBAC**: Institution Admins view their own applications; Bureau/Central Admins view regional or national applications.

### `POST /api/applications`
Submits a new institutional approval application (Step 1-3 intake).

### `GET /api/applications/:id`
Retrieves comprehensive application dossier including institution metadata, courses, uploaded documents, inspection reports, risk score, and audit logs.

### `POST /api/applications/:id/advance`
Advances an application stage (e.g., from `STAGE_VALIDATION` to `STAGE_SCRUTINY`).

### `POST /api/applications/:id/deficiency`
Issues an official Deficiency Notice with deadline and required compliance items.

### `POST /api/applications/:id/decision`
Applies formal statutory decision (`APPROVED` or `REJECTED`) with official council remarks.

---

## 📂 3. Document Vault & AI OCR (`/api/documents`)

### `POST /api/documents/upload`
Uploads statutory documents (Fire NOC, Land Deed, Building Blueprint).
- **Multipart Form**: `file`, `applicationId`, `documentType`

### `POST /api/documents/:id/ocr`
Triggers simulated/AI OCR pipeline extracting certificate number, issue date, expiry date, and issuing authority.

---

## 🔍 4. Inspections & EVC Management (`/api/inspections`)

### `GET /api/inspections`
Lists scheduled and conducted Expert Visit Committee (EVC) inspections.

### `POST /api/inspections/schedule`
Schedules an EVC visit and enforces the **APH §2.4 Conflict of Interest Guard** to reject affiliated experts.

---

## ⏱️ 5. Tasks & SLA Escalation (`/api/tasks`)

### `GET /api/tasks`
Lists officer action items, SLA countdowns, and breach risk indicators.

### `POST /api/tasks/escalate`
Triggers the multi-tier automated escalation engine (Level 1 ➔ Scrutiny Officer, Level 2 ➔ Regional Director, Level 3 ➔ Member Secretary HQ).

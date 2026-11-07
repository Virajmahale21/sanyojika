# AICTE Sanyojika - Security, Privacy & RBAC Governance Model

**Security Classification:** AICTE Confidential / Official Use Only  
**Compliance Standard:** Digital Personal Data Protection (DPDP) Act 2023 / CERT-In Guidelines

---

## 1. Role-Based Access Control (RBAC) Matrix

| Bureau Role | Case Viewing Scope | Grievance Intake | Overlap Triage | Mandate Formation | Append Action | System Audit Logs |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AICTE HQ Admin** | Pan-India (All Bureaus) | Full | Full Access | Authoritative | Full Access | Full Visibility |
| **Bureau Head (RB)** | Regional Jurisdiction | View/Filter | View Collisions | Collaborative | Bureau Scope | Scoped Activity |
| **Bureau Head (PGRC)** | Pan-India Grievances | Full | View Collisions | Collaborative | Bureau Scope | Scoped Activity |
| **Scrutiny Officer** | Assigned Caseload | Ingestion Only | Read-Only | Restricted | Note Submissions | Own Logs Only |

---

## 2. Whistleblower & Student Identity Anonymization

To preserve whistleblower protection in sensitive complaints (e.g. capitation fee extortion or sexual harassment):
1. **At Intake:** PII (Aadhaar, Student Roll Number, Mobile Number, Email) is encrypted with AES-256-GCM.
2. **Inter-Bureau Sharing:** The system exposes only the sanitized narrative and anonymized ID (`WHISTLEBLOWER-PGRC-88421`).
3. **Decryption Authorisation:** PII can only be unmasked upon joint concurrence of AICTE Member Secretary and Chief Vigilance Officer (CVO).

---

## 3. Cryptographic Audit Ledger Integrity

Every mutating administrative event generates an audit tuple:
$$L_i = \text{SHA-256}(L_{i-1} \parallel \text{Timestamp} \parallel \text{OfficerID} \parallel \text{Action} \parallel \text{PayloadHash})$$

This creates a forward-secure hash chain that prevents deletion, backdating, or unauthorized tampering by internal or external actors.

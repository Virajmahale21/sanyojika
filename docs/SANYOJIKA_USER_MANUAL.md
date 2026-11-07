# AICTE Sanyojika - System Operating Manual & Feature Catalog

**System Version:** 2.4.0-Production  
**Application URL:** `https://sih-264.vercel.app`  
**Backend API URL:** `https://sih264.onrender.com`  

---

## Module Index

### 1. Authentication & Role Switching
- **Access URL:** `/login`
- **Supported Personas:**
  - `admin@aicte.gov.in`: AICTE HQ Executive (Dr. Rajesh Kumar)
  - `priya.sharma@aicte.gov.in`: Bureau Head - Regional Bureau (Ms. Priya Sharma)
  - `anil.verma@aicte.gov.in`: Bureau Head - PGRC (Mr. Anil Verma)
  - `vikram.singh@aicte.gov.in`: Scrutiny Officer - North Region (Mr. Vikram Singh)
- **Features:** Instant demo credential switcher, session persistence, secure JWT bearer token issuance.

### 2. Integrated Executive Dashboard
- **Access URL:** `/dashboard`
- **Key Metrics Display:**
  - Total Active Grievances (220+ live records)
  - Inter-Bureau Overlaps Identified (68 concurrent collisions)
  - Active Coordination Mandates (4 joint committees)
  - Critical SLA Breaches / Overdue Cases
- **Action Triggers:** Direct navigation pills to filtered queues, quick actions for batch assignment.

### 3. Grievance Registration
- **Access URL:** Modal via `/complaints` -> `Register Grievance`
- **Fields:** Institution Name, AICTE Permanent ID (PID), Grievance Category (Capitation Fees, Faculty Underpayment, Infrastructure Deficits), Description Narrative, Supporting Evidence Attachments.
- **Workflow:** Submits to central registry, creates audit log entry, and immediately triggers AI semantic overlap evaluation.

### 4. Complaints Repository & Multi-Faceted Filtering
- **Access URL:** `/complaints`
- **Filter Parameters:**
  - Status (Pending, Under Scrutiny, Joint Investigation, Closed)
  - Assigned Bureau (PGRC, Regional Bureau, Approval Bureau)
  - Priority (Urgent, High, Medium, Low)
  - Overlap Toggle: Isolate cases with concurrent external investigations
- **Data Export:** Instant CSV export with sanitised metadata.

### 5. Complaint Detail Dossier Inspection
- **Access URL:** `/complaints/:id`
- **Panels:**
  - Complete chronological case timeline
  - Investigating officer notes and internal memo thread
  - AI Overlap Collision Alerts with direct deep-links to colliding cases
  - Evidence document viewer with OCR text extraction

### 6. Institutions Directory
- **Access URL:** `/institutions`
- **Features:** Pan-India college registry with 50+ accredited institutions, permanent AICTE PID search, active grievance counts, compliance rating, and regional bureau mapping.

### 7. AI-Assisted Overlap Collision Detection
- **Access URL:** `/overlaps`
- **Engine Logic:** Real-time semantic analysis comparing new submissions against active bureau investigations. Displays match percentage, highlighted common entities, and benchmark accuracy metrics.

### 8. Side-by-Side Dual-Pane Case Comparison
- **Access URL:** `/compare`
- **Capabilities:** Interactive side-by-side inspection of two concurrent cases from different bureaus (e.g., PGRC Student Complaint vs Regional Bureau Inspection Notice). Highlights identical text paragraphs and evidence hashes.

### 9. Cross-Bureau Case Coordination
- **Access URL:** `/coordination`
- **Workflow:** Joint committee formation, Append Action memorandum, consensus voting on institutional show-cause notices.

### 10. Case Relationship Intelligence Graph
- **Access URL:** `/graph`
- **Visualisation:** Force-directed topological network visualization built on interactive canvas physics.
  - Node filtering: Zoom, pan, bureau color-coding
  - Overlap bridges: Toggle inter-case collision vectors

### 11. Reports & Executive Analytics
- **Access URL:** `/reports`
- **Analytics Visuals:**
  - Monthly grievance intake vs disposal trends
  - Geographic hotspot heatmap by state and region
  - Bureau turnaround efficiency and SLA compliance rates

### 12. Audit History Ledger
- **Access URL:** `/audit-logs`
- **Security:** Immutable audit log tracking every user login, status transition, document view, and action append with timestamps and IP addresses.

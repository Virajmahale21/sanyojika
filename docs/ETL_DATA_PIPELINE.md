# AICTE Sanyojika - Data Ingestion & ETL Pipeline

**Document Reference:** AICTE-ETL-2026-V1  
**Target Architecture:** Batch & Stream Ingestion for Multi-Bureau Grievance Feeds

---

## 1. Pipeline Topology
1. **Intake Ingestion:** Webhook events from state grievance portals and direct AICTE student portal submissions.
2. **Sanitization & Normalization:** Stripping tracking tags, normalizing college name aliases against the Master AICTE PID Directory.
3. **NLP Vector Extraction:** Real-time generation of 128-dimensional TF-IDF keyword weights.
4. **Collision Indexing:** KD-Tree nearest neighbor search against active 90-day case records.
5. **Ledger Commit:** Cryptographic block append with SHA-256 state seal.

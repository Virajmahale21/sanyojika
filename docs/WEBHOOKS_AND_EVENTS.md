# AICTE Sanyojika - Webhook & Event Integration Guide

**Integration Protocol:** HMAC-SHA256 Signed HTTP POST  
**Target Entities:** State Technical Education Directorates & Affiliated Universities

---

## 1. Supported Events
- `grievance.registered`: Fired when a new complaint is filed.
- `overlap.detected`: Fired when AI identifies a collision score >= 0.75.
- `mandate.created`: Fired when HQ issues an Inter-Bureau Inquiry Mandate.
- `audit.sealed`: Fired when hourly cryptographic batch hashing completes.

## 2. Signature Verification
Every outbound webhook carries an `X-Sanyojika-Signature` header:
```text
X-Sanyojika-Signature: sha256=5d41402abc4b2a76b9719d911017c592...
```

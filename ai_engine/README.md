# AnumatiSetu — Python AI & Machine Learning Regulatory Engine

## Overview

The `ai_engine` package provides Python-based machine learning, document OCR analysis, and semantic overlap detection modules supporting the **AnumatiSetu** technical approval portal under the AICTE APH 2026-27 handbook.

---

## Architecture & Submodules

1. **`risk_model.py` (Delay Risk Prediction)**
   - Computes deterministic delay risk scores $\mathcal{R} \in [0, 100]$ based on SLA targets, document verification deficiencies, and validity expirations.
   - Triggers 3-tier escalation tiers: `LOW`, `MEDIUM`, and `HIGH`.

2. **`overlap_detector.py` (Semantic Overlap & Conflict Matching)**
   - Uses TF-IDF vectorization and cosine similarity scoring.
   - Detects duplicate complaints across different Bureaus and identifies cross-cell Permanent ID (PID) institutional linkages.

3. **`ocr_processor.py` (Statutory Document OCR)**
   - Regex-guided heuristic metadata extraction from statutory certificates (Fire NOC, Land Titles, Building Plans).
   - Generates confidence scores and flags certificates requiring manual officer scrutiny.

---

## Usage

### Run Built-in Diagnostics:
```bash
python ai_engine/main.py
```

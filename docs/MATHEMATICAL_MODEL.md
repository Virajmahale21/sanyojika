# AnumatiSetu — Mathematical Formulation of Delay Risk Scoring

## 1. Objective Function

The primary objective of the **Delay Risk Engine** is to map multidimensional institutional compliance parameters, document verification states, and elapsed processing timelines to a bounded risk probability index $\mathcal{R}(A) \in [0, 100]$:

$$\mathcal{R}(A) = \min\left(100, \max\left(0, \sum_{k=1}^{4} \Phi_k(A)\right)\right)$$

Where each component $\Phi_k$ corresponds to a distinct statutory risk dimension defined in the **AICTE Approval Process Handbook (APH 2026-27)**.

---

## 2. Component Penalty Formulations

### 1. Timeline Breach Function ($\Phi_1$)
Evaluates the ratio of elapsed processing duration $t_{\text{elapsed}}$ to statutory stage SLA target $t_{\text{target}}$:

$$\Phi_1(A) = 
\begin{cases} 
35.0 & \text{if } \frac{t_{\text{elapsed}}}{t_{\text{target}}} \ge 1.0 \\
22.75 & \text{if } 0.75 \le \frac{t_{\text{elapsed}}}{t_{\text{target}}} < 1.0 \\
0.0 & \text{otherwise}
\end{cases}$$

### 2. Missing Mandatory Documentation Penalty ($\Phi_2$)
Penalizes unverified or missing statutory exhibits (e.g. Land Title Deeds, Fire Safety NOC, Structural Soundness Certificate):

$$\Phi_2(A) = \min\left(25.0, 10.0 \times |D_{\text{missing}}|\right)$$

Where $|D_{\text{missing}}|$ is the cardinality of the missing mandatory document set.

### 3. Critical Safety Expiration Penalty ($\Phi_3$)
Evaluates validity buffer $\tau_{\text{noc}}$ (in calendar days) of the Fire Safety NOC:

$$\Phi_3(A) = 
\begin{cases} 
20.0 & \text{if } \tau_{\text{noc}} < 0 \quad (\text{Expired}) \\
15.0 & \text{if } 0 \le \tau_{\text{noc}} \le 30 \quad (\text{Expiring Imminently}) \\
0.0 & \text{if } \tau_{\text{noc}} > 30
\end{cases}$$

### 4. Unresolved Scrutiny Clarifications ($\Phi_4$)
Penalizes unanswered queries raised by the Scrutiny Committee during document review:

$$\Phi_4(A) = \min\left(20.0, 8.0 \times Q_{\text{unresolved}}\right)$$

---

## 3. Decision Boundary & Tier Classification

The final score $\mathcal{R}(A)$ triggers automated workflow actions:

$$\text{Tier}(A) = 
\begin{cases} 
\text{HIGH} & \text{if } \mathcal{R}(A) \ge 70 \implies \text{Level 2 Escalation (Regional Director Alert)} \\
\text{MEDIUM} & \text{if } 40 \le \mathcal{R}(A) < 70 \implies \text{Level 1 Escalation (Scrutiny Officer Workload Prioritization)} \\
\text{LOW} & \text{if } \mathcal{R}(A) < 40 \implies \text{Standard Stage Monitoring}
\end{cases}$$

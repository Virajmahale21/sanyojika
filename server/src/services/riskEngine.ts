export interface DelayRiskAssessment {
  score: number; // 0 to 100
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasons: string[];
}

export class DelayRiskEngine {
  /**
   * Calculates explainable delay-risk for an application based on deterministic regulatory rules.
   */
  public static calculateRisk(params: {
    status: string;
    submissionDate: Date | null;
    targetDueDate: Date | null;
    pendingTasksCount: number;
    overdueTasksCount: number;
    missingMandatoryDocsCount: number;
    daysInCurrentStage: number;
    slaDays: number;
  }): DelayRiskAssessment {
    let score = 10; // Baseline
    const reasons: string[] = [];

    // Factor 1: Overall Due Date Breach
    if (params.targetDueDate) {
      const now = new Date();
      const diffDays = Math.ceil((params.targetDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        const daysOver = Math.abs(diffDays);
        score += Math.min(45, daysOver * 7);
        reasons.push(`Target statutory completion deadline breached by ${daysOver} day(s)`);
      } else if (diffDays <= 3) {
        score += 20;
        reasons.push(`Target completion deadline approaching within ${diffDays} day(s)`);
      }
    }

    // Factor 2: Stage SLA Duration
    if (params.daysInCurrentStage > params.slaDays) {
      const stageExcess = params.daysInCurrentStage - params.slaDays;
      score += Math.min(25, stageExcess * 5);
      reasons.push(`Current scrutiny stage duration (${params.daysInCurrentStage} days) exceeded SLA limit (${params.slaDays} days)`);
    }

    // Factor 3: Missing Mandatory Documents
    if (params.missingMandatoryDocsCount > 0) {
      score += params.missingMandatoryDocsCount * 12;
      reasons.push(`${params.missingMandatoryDocsCount} mandatory statutory document(s) pending institutional submission`);
    }

    // Factor 4: Overdue Action Items & Escalations
    if (params.overdueTasksCount > 0) {
      score += params.overdueTasksCount * 15;
      reasons.push(`${params.overdueTasksCount} regulatory scrutiny task(s) currently past deadline`);
    }

    // Cap score at 100
    score = Math.min(100, Math.max(0, score));

    // Determine Risk Level
    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score >= 75) level = 'CRITICAL';
    else if (score >= 50) level = 'HIGH';
    else if (score >= 30) level = 'MEDIUM';

    if (reasons.length === 0) {
      reasons.push('Application progressing normally within configured SLA tolerances');
    }

    return { score, level, reasons };
  }
}

const API_ORIGIN = import.meta.env.VITE_API_URL || '';
const BASE_URL = `${API_ORIGIN}/api/v1`;

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('aicte_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async getProfile() {
    const res = await fetch(`${BASE_URL}/auth/me`, { headers: getAuthHeaders() });
    return res.json();
  },

  async getDemoAccounts() {
    const res = await fetch(`${BASE_URL}/auth/demo-accounts`);
    return res.json();
  },

  async updateLanguage(language: string) {
    const res = await fetch(`${BASE_URL}/auth/language`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ language }),
    });
    return res.json();
  },

  // Dashboard
  async getDashboardMetrics() {
    const res = await fetch(`${BASE_URL}/dashboard/metrics`, { headers: getAuthHeaders() });
    return res.json();
  },

  // Applications
  async getApplications(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/applications?${query}`, { headers: getAuthHeaders() });
    return res.json();
  },

  async getApplicationById(id: string) {
    const res = await fetch(`${BASE_URL}/applications/${id}`, { headers: getAuthHeaders() });
    return res.json();
  },

  async createApplication(payload: any) {
    const res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async submitApplication(id: string) {
    const res = await fetch(`${BASE_URL}/applications/${id}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Workflow
  async advanceStage(id: string, targetStageCode: string, remarks?: string) {
    const res = await fetch(`${BASE_URL}/workflow/applications/${id}/advance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetStageCode, remarks }),
    });
    return res.json();
  },

  async raiseDeficiency(id: string, deficiencyRemarks: string, deadlineDays?: number) {
    const res = await fetch(`${BASE_URL}/workflow/applications/${id}/deficiency`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ deficiencyRemarks, deadlineDays }),
    });
    return res.json();
  },

  async recordDecision(id: string, decision: 'APPROVED' | 'REJECTED', remarks?: string) {
    const res = await fetch(`${BASE_URL}/workflow/applications/${id}/decision`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ decision, remarks }),
    });
    return res.json();
  },

  // Documents
  async getDocuments(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/documents?${query}`, { headers: getAuthHeaders() });
    return res.json();
  },

  async uploadDocument(formData: FormData) {
    const token = localStorage.getItem('aicte_token');
    const res = await fetch(`${BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return res.json();
  },

  async reviewDocument(id: string, status: string, remarks?: string) {
    const res = await fetch(`${BASE_URL}/documents/${id}/review`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, remarks }),
    });
    return res.json();
  },

  async confirmOcr(id: string, data: any) {
    const res = await fetch(`${BASE_URL}/documents/${id}/confirm-ocr`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Inspections
  async getInspections(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/inspections?${query}`, { headers: getAuthHeaders() });
    return res.json();
  },

  async scheduleInspection(payload: any) {
    const res = await fetch(`${BASE_URL}/inspections/schedule`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async submitInspectionReport(id: string, payload: any) {
    const res = await fetch(`${BASE_URL}/inspections/${id}/report`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Compliance
  async getComplianceRequirements() {
    const res = await fetch(`${BASE_URL}/compliance/requirements`, { headers: getAuthHeaders() });
    return res.json();
  },

  async getComplianceSubmissions(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/compliance/submissions?${query}`, { headers: getAuthHeaders() });
    return res.json();
  },

  async submitComplianceEvidence(id: string, payload: any) {
    const res = await fetch(`${BASE_URL}/compliance/submissions/${id}/evidence`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async verifyCompliance(id: string, status: string, remarks?: string) {
    const res = await fetch(`${BASE_URL}/compliance/submissions/${id}/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, remarks }),
    });
    return res.json();
  },

  // Tasks & Escalations
  async getTasks(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/tasks?${query}`, { headers: getAuthHeaders() });
    return res.json();
  },

  async triggerEscalationScan() {
    const res = await fetch(`${BASE_URL}/tasks/escalate-scan`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateTaskStatus(id: string, status: string) {
    const res = await fetch(`${BASE_URL}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${BASE_URL}/notifications`, { headers: getAuthHeaders() });
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${BASE_URL}/notifications/mark-all-read`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Institutions
  async getInstitutions(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/institutions?${query}`, { headers: getAuthHeaders() });
    return res.json();
  },

  async getInstitutionById(id: string) {
    const res = await fetch(`${BASE_URL}/institutions/${id}`, { headers: getAuthHeaders() });
    return res.json();
  },

  // Reports
  async getSummaryReport() {
    const res = await fetch(`${BASE_URL}/reports/summary`, { headers: getAuthHeaders() });
    return res.json();
  },

  // Admin
  async getUsers() {
    const res = await fetch(`${BASE_URL}/admin/users`, { headers: getAuthHeaders() });
    return res.json();
  },

  async getAuditLogs(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/admin/audit-logs?${query}`, { headers: getAuthHeaders() });
    return res.json();
  },

  async resetDemoDb() {
    const res = await fetch(`${BASE_URL}/admin/reset-demo`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // AI Assistant
  async askAi(query: string, language?: string) {
    const res = await fetch(`${BASE_URL}/ai/query`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ query, language }),
    });
    return res.json();
  },
};

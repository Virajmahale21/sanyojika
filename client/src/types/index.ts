export type Role =
  | 'SUPER_ADMIN'
  | 'CENTRAL_ADMIN'
  | 'BUREAU_OFFICER'
  | 'REGIONAL_OFFICER'
  | 'EVC_MEMBER'
  | 'INSTITUTION_ADMIN'
  | 'AUDITOR';

export interface User {
  id: string;
  email: string;
  fullName: string;
  designation?: string;
  phone?: string;
  role: Role;
  preferredLang: string;
  department?: { id: string; name: string; code: string };
  region?: { id: string; name: string; code: string };
  institution?: { id: string; name: string; permanentId: string };
}

export interface Institution {
  id: string;
  permanentId: string;
  name: string;
  nameHi?: string;
  nameMr?: string;
  category: string;
  institutionType: string;
  establishmentYear: number;
  affiliatingUniv: string;
  naacAccreditation?: string;
  nbaAccredited: boolean;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  website?: string;
  officialEmail: string;
  contactNumber: string;
  principalName?: string;
  region?: { id: string; name: string; code: string };
}

export interface ApplicationCourse {
  id: string;
  program: string;
  courseName: string;
  level: string;
  durationYears: number;
  existingIntake: number;
  proposedIntake: number;
  approvedIntake?: number;
  facultyCount: number;
  nbaAccredited: boolean;
}

export interface DocumentOcr {
  id: string;
  extractedDocNumber?: string;
  extractedIssueDate?: string;
  extractedExpiryDate?: string;
  extractedAuthority?: string;
  confidenceScore: number;
  isConfirmed: boolean;
}

export interface DocumentItem {
  id: string;
  applicationId?: string;
  institutionId: string;
  category: string;
  title: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  version: number;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'CLARIFICATION_NEEDED' | 'EXPIRED';
  issueDate?: string;
  expiryDate?: string;
  isMandatory: boolean;
  reviewRemarks?: string;
  uploadedAt: string;
  ocrData?: DocumentOcr;
  institution?: { name: string; permanentId: string };
  application?: { applicationNumber: string };
}

export interface InspectionChecklist {
  id: string;
  sectionName: string;
  itemName: string;
  isCompliant: boolean;
  score: number;
  remarks?: string;
}

export interface Inspection {
  id: string;
  inspectionNumber: string;
  applicationId: string;
  institutionId: string;
  inspectionType: 'PHYSICAL' | 'VIRTUAL' | 'SURPRISE';
  scheduledDate: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  recommendation?: 'RECOMMENDED' | 'NOT_RECOMMENDED' | 'CONDITIONAL';
  summaryReport?: string;
  geotagLat?: number;
  geotagLng?: number;
  institution: { id: string; name: string; permanentId: string; city: string; state: string };
  application: { id: string; applicationNumber: string; applicationType: string };
  committeeMembers: {
    id: string;
    roleInCommittee: string;
    user: { id: string; fullName: string; designation?: string; email: string };
  }[];
  checklists: InspectionChecklist[];
}

export interface ComplianceSubmission {
  id: string;
  institutionId: string;
  requirementId: string;
  academicYear: string;
  status: 'COMPLIANT' | 'PENDING_EVIDENCE' | 'UNDER_REVIEW' | 'NON_COMPLIANT' | 'OVERDUE';
  dueDate: string;
  submittedDate?: string;
  verifiedAt?: string;
  evidenceDocUrl?: string;
  remarks?: string;
  requirement: {
    id: string;
    code: string;
    title: string;
    titleHi?: string;
    titleMr?: string;
    category: string;
    description: string;
    frequency: string;
  };
  institution: { id: string; name: string; permanentId: string; city: string; state: string };
}

export interface TaskItem {
  id: string;
  title: string;
  titleHi?: string;
  titleMr?: string;
  description?: string;
  relatedEntityType: string;
  relatedEntityId: string;
  assignedToUserId?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ESCALATED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate: string;
  escalationLevel: number;
  completedAt?: string;
  applicationId?: string;
  assignedTo?: { id: string; fullName: string; role: string; email: string };
  department?: { id: string; name: string; code: string };
  application?: {
    id: string;
    applicationNumber: string;
    status: string;
    institution: { name: string; permanentId: string };
  };
  escalationEvents?: {
    id: string;
    triggeredLevel: number;
    escalatedToRole: string;
    reason: string;
    createdAt: string;
  }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  titleHi?: string;
  titleMr?: string;
  message: string;
  messageHi?: string;
  messageMr?: string;
  type: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  userRole?: string;
  userEmail?: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  oldState?: string;
  newState?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface Application {
  id: string;
  applicationNumber: string;
  institutionId: string;
  applicationType: string;
  academicYear: string;
  status: string;
  currentStageCode: string;
  assignedOfficerId?: string;
  submissionDate?: string;
  targetDueDate?: string;
  decisionDate?: string;
  overallRemarks?: string;
  delayRiskScore: number;
  delayRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  delayRiskReasons?: string;
  institution: Institution;
  assignedOfficer?: { id: string; fullName: string; email: string; role: string };
  courses?: ApplicationCourse[];
  documents?: DocumentItem[];
  inspections?: Inspection[];
  tasks?: TaskItem[];
  auditLogs?: AuditLogItem[];
  updatedAt: string;
}

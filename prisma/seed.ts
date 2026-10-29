import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AICTE Approval Portal database...');

  // Clear existing records in proper dependency order
  await prisma.escalationEvent.deleteMany();
  await prisma.task.deleteMany();
  await prisma.escalationRule.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.inspectionChecklist.deleteMany();
  await prisma.inspectionMember.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.complianceSubmission.deleteMany();
  await prisma.complianceRequirement.deleteMany();
  await prisma.documentOcrData.deleteMany();
  await prisma.document.deleteMany();
  await prisma.applicationCourse.deleteMany();
  await prisma.application.deleteMany();
  await prisma.workflowStage.deleteMany();
  await prisma.workflowTemplate.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.department.deleteMany();
  await prisma.region.deleteMany();
  await prisma.systemSetting.deleteMany();

  // 1. Departments
  const enggDept = await prisma.department.create({
    data: {
      code: 'ENGG',
      name: 'Engineering & Technology',
      nameHi: 'अभियांत्रिकी एवं प्रौद्योगिकी',
      nameMr: 'अभियांत्रिकी आणि तंत्रज्ञान',
      description: 'Department of Undergraduate and Postgraduate Engineering education',
    },
  });

  const mgmtDept = await prisma.department.create({
    data: {
      code: 'MGMT',
      name: 'Management Studies',
      nameHi: 'प्रबंधन अध्ययन',
      nameMr: 'व्यवस्थापन अभ्यास',
      description: 'Department of MBA, PGDM and Executive Business education',
    },
  });

  const pharmDept = await prisma.department.create({
    data: {
      code: 'PHARM',
      name: 'Pharmacy Education',
      nameHi: 'फार्मेसी शिक्षा',
      nameMr: 'औषधनिर्माणशास्त्र शिक्षण',
      description: 'Department of Pharmaceutical Sciences and Research',
    },
  });

  // 2. Regions
  const wroRegion = await prisma.region.create({
    data: {
      code: 'WRO',
      name: 'Western Regional Office (Mumbai)',
      nameHi: 'पश्चिमी क्षेत्रीय कार्यालय (मुंबई)',
      nameMr: 'पश्चिम प्रादेशिक कार्यालय (मुंबई)',
      statesCovered: 'Maharashtra, Goa',
      officeAddress: 'Industrial Assurance Building, 2nd Floor, VN Road, Churchgate, Mumbai 400020',
    },
  });

  const nroRegion = await prisma.region.create({
    data: {
      code: 'NRO',
      name: 'Northern Regional Office (Kanpur)',
      nameHi: 'उत्तरी क्षेत्रीय कार्यालय (कानपुर)',
      nameMr: 'उत्तर प्रादेशिक कार्यालय (कानपूर)',
      statesCovered: 'Uttar Pradesh, Uttarakhand',
      officeAddress: 'Vikas Nagar, Kanpur, Uttar Pradesh 208002',
    },
  });

  const sroRegion = await prisma.region.create({
    data: {
      code: 'SRO',
      name: 'Southern Regional Office (Chennai)',
      nameHi: 'दक्षिणी क्षेत्रीय कार्यालय (चेन्नई)',
      nameMr: 'दक्षिण प्रादेशिक कार्यालय (चेन्नई)',
      statesCovered: 'Tamil Nadu, Puducherry',
      officeAddress: 'Shastri Bhavan, 26 Haddows Road, Nungambakkam, Chennai 600006',
    },
  });

  // 3. Institutions
  const gcet = await prisma.institution.create({
    data: {
      permanentId: '1-1090123456',
      name: 'Government College of Engineering and Technology (GCET)',
      nameHi: 'शासकीय अभियांत्रिकी एवं प्रौद्योगिकी महाविद्यालय (जीसीईटी)',
      nameMr: 'शासकीय अभियांत्रिकी व तंत्रज्ञान महाविद्यालय (जीसीईटी)',
      category: 'ENGINEERING',
      institutionType: 'GOVT_AIDED',
      establishmentYear: 1887,
      affiliatingUniv: 'University of Mumbai',
      naacAccreditation: 'A++',
      nbaAccredited: true,
      address: 'Bandra Kurla Complex, Institutional Area',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400051',
      regionId: wroRegion.id,
      website: 'https://gcet.edu.in',
      officialEmail: 'principal@gcet.edu.in',
      contactNumber: '+91 22 2419 8101',
      principalName: 'Dr. Faruk Kazi (Director)',
    },
  });

  const coep = await prisma.institution.create({
    data: {
      permanentId: '1-1090654321',
      name: 'COEP Technological University',
      nameHi: 'सीओईपी प्रौद्योगिकी विश्वविद्यालय पुणे',
      nameMr: 'सीओईपी तंत्रज्ञान विद्यापीठ पुणे',
      category: 'ENGINEERING',
      institutionType: 'GOVT',
      establishmentYear: 1854,
      affiliatingUniv: 'Unitary State University',
      naacAccreditation: 'A++',
      nbaAccredited: true,
      address: 'Wellesley Road, Shivajinagar',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411005',
      regionId: wroRegion.id,
      website: 'https://coep.org.in',
      officialEmail: 'director@coep.ac.in',
      contactNumber: '+91 20 2550 7000',
      principalName: 'Dr. B. N. Chaudhari (Vice Chancellor)',
    },
  });

  const jbims = await prisma.institution.create({
    data: {
      permanentId: '1-1090998877',
      name: 'Jamnalal Bajaj Institute of Management Studies (JBIMS)',
      nameHi: 'जमनालाल बजाज प्रबंधन अध्ययन संस्थान',
      nameMr: 'जमनालाल बजाज व्यवस्थापन अभ्यास संस्था',
      category: 'MANAGEMENT',
      institutionType: 'GOVT_AIDED',
      establishmentYear: 1965,
      affiliatingUniv: 'University of Mumbai',
      naacAccreditation: 'A+',
      nbaAccredited: true,
      address: '164 Backbay Reclamation, HT Parekh Marg, Churchgate',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400020',
      regionId: wroRegion.id,
      website: 'https://jbims.edu',
      officialEmail: 'director@jbims.edu',
      contactNumber: '+91 22 2202 4133',
      principalName: 'Dr. Srinivasan R. Iyengar (Director)',
    },
  });

  // Password hash for all demo users: "Password@123"
  const passwordHash = await bcrypt.hash('Password@123', 10);

  // 4. Users (All 7 Roles)
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@aicte.gov.in',
      passwordHash,
      fullName: 'Shri Rajeshwar Rao',
      designation: 'Chief Technology Officer & Super Administrator',
      phone: '+91 11 2958 1001',
      role: 'SUPER_ADMIN',
      preferredLang: 'en',
    },
  });

  const centralAdmin = await prisma.user.create({
    data: {
      email: 'centraladmin@aicte.gov.in',
      passwordHash,
      fullName: 'Prof. T. G. Sitharam (Secretariat)',
      designation: 'Advisor & Central Approval Bureau Head',
      phone: '+91 11 2958 1002',
      role: 'CENTRAL_ADMIN',
      preferredLang: 'hi',
    },
  });

  const bureauOfficer = await prisma.user.create({
    data: {
      email: 'bureau.officer@aicte.gov.in',
      passwordHash,
      fullName: 'Dr. Amit V. Deshmukh',
      designation: 'Senior Scrutiny Officer (Engineering Bureau)',
      phone: '+91 22 2419 8200',
      role: 'BUREAU_OFFICER',
      departmentId: enggDept.id,
      regionId: wroRegion.id,
      preferredLang: 'mr',
    },
  });

  const regionalOfficer = await prisma.user.create({
    data: {
      email: 'regional.wro@aicte.gov.in',
      passwordHash,
      fullName: 'Dr. Sunil K. Sonawane',
      designation: 'Regional Officer & Director (Western Region)',
      phone: '+91 22 2285 1011',
      role: 'REGIONAL_OFFICER',
      regionId: wroRegion.id,
      preferredLang: 'mr',
    },
  });

  const evcMember = await prisma.user.create({
    data: {
      email: 'evc.expert@iitb.ac.in',
      passwordHash,
      fullName: 'Prof. Milind Atrey',
      designation: 'Professor & Dean R&D, IIT Bombay (EVC Committee Chairman)',
      phone: '+91 22 2576 7000',
      role: 'EVC_MEMBER',
      departmentId: enggDept.id,
      preferredLang: 'en',
    },
  });

  const institutionAdmin = await prisma.user.create({
    data: {
      email: 'principal@gcet.edu.in',
      passwordHash,
      fullName: 'Dr. Faruk Kazi (Dean & Nodal Officer)',
      designation: 'Dean of Academic Programmes & AICTE Nodal Officer',
      phone: '+91 22 2419 8105',
      role: 'INSTITUTION_ADMIN',
      institutionId: gcet.id,
      preferredLang: 'en',
    },
  });

  const auditor = await prisma.user.create({
    data: {
      email: 'auditor.vigilance@aicte.gov.in',
      passwordHash,
      fullName: 'Smt. Kavita Sharma (IRS)',
      designation: 'Chief Vigilance & Compliance Auditor',
      phone: '+91 11 2958 1009',
      role: 'AUDITOR',
      preferredLang: 'en',
    },
  });

  // 5. Workflow Template & Stages
  const eoaTemplate = await prisma.workflowTemplate.create({
    data: {
      name: 'AICTE Standard Approval Process (APH 2026-27)',
      code: 'APH_STANDARD_EOA',
      description: 'Standard 6-stage approval workflow including document scrutiny, deficiency resolution, and committee review',
      version: 1,
      isActive: true,
    },
  });

  await prisma.workflowStage.createMany({
    data: [
      {
        templateId: eoaTemplate.id,
        code: 'STAGE_SUBMISSION',
        name: 'Application Submission',
        nameHi: 'आवेदन प्रस्तुति',
        nameMr: 'अर्ज सादरीकरण',
        sequenceOrder: 1,
        slaDays: 5,
        allowedRoles: 'INSTITUTION_ADMIN',
        requiredDocTypes: 'FIRE_NOC,LAND_TITLE,BUILDING_PLAN',
        description: 'Initial entry of institutional details, academic courses, and mandatory uploads',
      },
      {
        templateId: eoaTemplate.id,
        code: 'STAGE_VALIDATION',
        name: 'Initial Scrutiny & Validation',
        nameHi: 'प्रारंभिक संवीक्षा एवं सत्यापन',
        nameMr: 'प्राथमिक छाननी आणि पडताळणी',
        sequenceOrder: 2,
        slaDays: 7,
        allowedRoles: 'BUREAU_OFFICER,CENTRAL_ADMIN',
        requiredDocTypes: 'FIRE_NOC,LAND_TITLE',
        description: 'Automated rules validation and preliminary scrutiny by regional bureau',
      },
      {
        templateId: eoaTemplate.id,
        code: 'STAGE_SCRUTINY',
        name: 'Bureau Detailed Scrutiny',
        nameHi: 'ब्यूरो विस्तृत संवीक्षा',
        nameMr: 'ब्युरो सविस्तर छाननी',
        sequenceOrder: 3,
        slaDays: 10,
        allowedRoles: 'BUREAU_OFFICER,CENTRAL_ADMIN',
        requiredDocTypes: 'FIRE_NOC,AUDITED_FINANCIALS,FACULTY_CADRE',
        description: 'Thorough evaluation of land, built-up area, faculty cadre ratio, and certificates',
      },
      {
        templateId: eoaTemplate.id,
        code: 'STAGE_EVC',
        name: 'EVC Expert Inspection',
        nameHi: 'ईवीसी विशेषज्ञ निरीक्षण',
        nameMr: 'ईव्हीसी तज्ज्ञ तपासणी',
        sequenceOrder: 4,
        slaDays: 14,
        allowedRoles: 'EVC_MEMBER,REGIONAL_OFFICER',
        requiredDocTypes: 'BUILDING_PLAN,FACULTY_CADRE',
        description: 'Physical or virtual verification by appointed Expert Visiting Committee',
      },
      {
        templateId: eoaTemplate.id,
        code: 'STAGE_COMMITTEE',
        name: 'Standing Hearing Committee',
        nameHi: 'स्थायी सुनवाई समिति समीक्षा',
        nameMr: 'स्थायी सुनावणी समिती आढावा',
        sequenceOrder: 5,
        slaDays: 7,
        allowedRoles: 'CENTRAL_ADMIN,SUPER_ADMIN',
        requiredDocTypes: '',
        description: 'Review of EVC recommendations and compliance clarifications',
      },
      {
        templateId: eoaTemplate.id,
        code: 'STAGE_APPROVAL',
        name: 'Final Council Approval & LoA Issuance',
        nameHi: 'अंतिम परिषद स्वीकृति एवं पत्र जारी',
        nameMr: 'अंतिम परिषद मंजुरी आणि पत्र वाटप',
        sequenceOrder: 6,
        slaDays: 5,
        allowedRoles: 'CENTRAL_ADMIN,SUPER_ADMIN',
        requiredDocTypes: '',
        description: 'Final authorization by Council and generation of tamper-evident digital EoA Order',
      },
    ],
  });

  // 6. Applications
  const now = new Date();
  const subDate = new Date(now.getTime() - 12 * 86400000); // 12 days ago
  const dueDate = new Date(now.getTime() + 10 * 86400000); // in 10 days

  const app1 = await prisma.application.create({
    data: {
      applicationNumber: 'AICTE/2026-27/APP-1001',
      institutionId: gcet.id,
      applicationType: 'EOA',
      academicYear: '2026-2027',
      status: 'UNDER_SCRUTINY',
      currentStageCode: 'STAGE_SCRUTINY',
      assignedOfficerId: bureauOfficer.id,
      submissionDate: subDate,
      targetDueDate: dueDate,
      delayRiskScore: 18,
      delayRiskLevel: 'LOW',
      delayRiskReasons: JSON.stringify(['All primary documents submitted within timeframe', 'Minor clarification pending on Fire NOC renewal date']),
      overallRemarks: 'Application submitted on schedule with full documentation for Extension of Approval and increase in AI/Data Science intake.',
    },
  });

  await prisma.applicationCourse.createMany({
    data: [
      {
        applicationId: app1.id,
        program: 'ENGINEERING_AND_TECHNOLOGY',
        courseName: 'Computer Engineering',
        level: 'UG',
        durationYears: 4,
        existingIntake: 120,
        proposedIntake: 120,
        approvedIntake: 120,
        facultyCount: 16,
        nbaAccredited: true,
      },
      {
        applicationId: app1.id,
        program: 'ENGINEERING_AND_TECHNOLOGY',
        courseName: 'Artificial Intelligence & Data Science',
        level: 'UG',
        durationYears: 4,
        existingIntake: 60,
        proposedIntake: 120,
        facultyCount: 8,
        nbaAccredited: false,
      },
      {
        applicationId: app1.id,
        program: 'ENGINEERING_AND_TECHNOLOGY',
        courseName: 'Electronics & Telecommunication',
        level: 'UG',
        durationYears: 4,
        existingIntake: 60,
        proposedIntake: 60,
        approvedIntake: 60,
        facultyCount: 10,
        nbaAccredited: true,
      },
    ],
  });

  const app2 = await prisma.application.create({
    data: {
      applicationNumber: 'AICTE/2026-27/APP-1002',
      institutionId: coep.id,
      applicationType: 'NEW_COURSE',
      academicYear: '2026-2027',
      status: 'INSPECTION_SCHEDULED',
      currentStageCode: 'STAGE_EVC',
      assignedOfficerId: bureauOfficer.id,
      submissionDate: new Date(now.getTime() - 20 * 86400000),
      targetDueDate: new Date(now.getTime() + 5 * 86400000),
      delayRiskScore: 42,
      delayRiskLevel: 'MEDIUM',
      delayRiskReasons: JSON.stringify(['EVC Expert assignment pending confirmation', 'Stage duration currently at 8 days against 14 days SLA']),
      overallRemarks: 'New M.Tech Cyber Security proposal. Bureau scrutiny cleared; physical EVC inspection scheduled.',
    },
  });

  const app3 = await prisma.application.create({
    data: {
      applicationNumber: 'AICTE/2026-27/APP-1003',
      institutionId: jbims.id,
      applicationType: 'EOA',
      academicYear: '2026-2027',
      status: 'APPROVED',
      currentStageCode: 'STAGE_APPROVAL',
      assignedOfficerId: bureauOfficer.id,
      submissionDate: new Date(now.getTime() - 35 * 86400000),
      targetDueDate: new Date(now.getTime() - 5 * 86400000),
      decisionDate: new Date(now.getTime() - 4 * 86400000),
      delayRiskScore: 8,
      delayRiskLevel: 'LOW',
      delayRiskReasons: JSON.stringify(['Process completed with zero defects', 'Approval order AICTE/WRO/2026/JBIMS-01 generated']),
      overallRemarks: 'Extension of Approval for MMS & Executive MBA approved unanimously by Council.',
    },
  });

  const app4 = await prisma.application.create({
    data: {
      applicationNumber: 'AICTE/2026-27/APP-1004',
      institutionId: gcet.id,
      applicationType: 'INTAKE_INCREASE',
      academicYear: '2026-2027',
      status: 'DOCUMENTS_REQUIRED',
      currentStageCode: 'STAGE_SCRUTINY',
      assignedOfficerId: bureauOfficer.id,
      submissionDate: new Date(now.getTime() - 25 * 86400000),
      targetDueDate: new Date(now.getTime() - 6 * 86400000), // Overdue by 6 days!
      delayRiskScore: 78,
      delayRiskLevel: 'HIGH',
      delayRiskReasons: JSON.stringify([
        'Application target due date elapsed by 6 days (SLA breached)',
        'Mandatory Structural Stability Certificate clarification unaddressed by institution',
        'Automatic Level 1 escalation triggered'
      ]),
      overallRemarks: 'Deficiency notice issued on 18th Oct regarding building structural stability certificate validity. Institutional response awaited.',
    },
  });

  // 7. Documents for GCET
  const fireNoc = await prisma.document.create({
    data: {
      applicationId: app1.id,
      institutionId: gcet.id,
      category: 'FIRE_NOC',
      title: 'Municipal Fire Safety No Objection Certificate (NOC)',
      fileName: 'Fire_NOC_Mumbai_Fire_Brigade_2025.pdf',
      filePath: '/uploads/demo/gcet_fire_noc_2025.pdf',
      fileSize: 1450230,
      mimeType: 'application/pdf',
      version: 1,
      status: 'VERIFIED',
      issueDate: new Date('2025-05-10'),
      expiryDate: new Date('2026-05-09'),
      isMandatory: true,
      reviewedById: bureauOfficer.id,
      reviewedAt: new Date(now.getTime() - 5 * 86400000),
      reviewRemarks: 'Validated against Municipal Corporation of Greater Mumbai Fire Directorate database.',
    },
  });

  await prisma.documentOcrData.create({
    data: {
      documentId: fireNoc.id,
      extractedDocNumber: 'MCGM/FB/NOC/2025/8892',
      extractedIssueDate: new Date('2025-05-10'),
      extractedExpiryDate: new Date('2026-05-09'),
      extractedAuthority: 'Chief Fire Officer, Mumbai Fire Brigade',
      confidenceScore: 0.96,
      isConfirmed: true,
      rawExtractedJson: JSON.stringify({
        noc_number: 'MCGM/FB/NOC/2025/8892',
        premises: 'GCET Campus, Mumbai 400051',
        height_meters: '24.5',
        fire_equipment_status: 'Fully Operational',
      }),
    },
  });

  const landTitle = await prisma.document.create({
    data: {
      applicationId: app1.id,
      institutionId: gcet.id,
      category: 'LAND_TITLE',
      title: 'Government Land Allotment & Ownership Registry Deed',
      fileName: 'GCET_Land_Title_Govt_Deed.pdf',
      filePath: '/uploads/demo/gcet_land_title.pdf',
      fileSize: 4520900,
      mimeType: 'application/pdf',
      version: 1,
      status: 'VERIFIED',
      issueDate: new Date('1990-01-15'),
      expiryDate: null, // Perpetual
      isMandatory: true,
      reviewedById: bureauOfficer.id,
      reviewedAt: new Date(now.getTime() - 5 * 86400000),
      reviewRemarks: '16.5 Acres contiguous government allotted institutional land verified.',
    },
  });

  await prisma.documentOcrData.create({
    data: {
      documentId: landTitle.id,
      extractedDocNumber: 'REV-DEED-MUM-1887/1990-44',
      extractedIssueDate: new Date('1990-01-15'),
      extractedExpiryDate: null,
      extractedAuthority: 'Revenue and Forest Department, Govt of Maharashtra',
      confidenceScore: 0.94,
      isConfirmed: true,
    },
  });

  const facultyCadre = await prisma.document.create({
    data: {
      applicationId: app1.id,
      institutionId: gcet.id,
      category: 'FACULTY_CADRE',
      title: 'Cadre-wise Faculty Roster & AICTE 7th CPC Scale Compliance',
      fileName: 'GCET_Faculty_Roster_2026.pdf',
      filePath: '/uploads/demo/gcet_faculty_roster_2026.pdf',
      fileSize: 2120000,
      mimeType: 'application/pdf',
      version: 1,
      status: 'PENDING',
      issueDate: new Date('2026-01-10'),
      expiryDate: new Date('2027-01-09'),
      isMandatory: true,
    },
  });

  // 8. EVC Inspection for COEP
  const inspection1 = await prisma.inspection.create({
    data: {
      inspectionNumber: 'EVC-2026-0042',
      applicationId: app2.id,
      institutionId: coep.id,
      inspectionType: 'PHYSICAL',
      scheduledDate: new Date(now.getTime() + 4 * 86400000), // In 4 days
      status: 'SCHEDULED',
      geotagLat: 18.5293,
      geotagLng: 73.8565,
    },
  });

  await prisma.inspectionMember.create({
    data: {
      inspectionId: inspection1.id,
      userId: evcMember.id,
      roleInCommittee: 'CHAIRMAN',
    },
  });

  await prisma.inspectionChecklist.createMany({
    data: [
      {
        inspectionId: inspection1.id,
        sectionName: 'INFRASTRUCTURE',
        itemName: 'Cyber Security Research Lab adequacy (min 150 sq.m with 60 high-performance workstations)',
        isCompliant: true,
        score: 10,
        remarks: 'Advanced lab setup with dedicated fiber backbone',
      },
      {
        inspectionId: inspection1.id,
        sectionName: 'FACULTY_VERIFICATION',
        itemName: 'Ph.D. qualified Professor and Associate Professor in Information Security / CS',
        isCompliant: true,
        score: 9,
        remarks: '2 Professors, 3 Associate Professors verified with Aadhaar biometric records',
      },
      {
        inspectionId: inspection1.id,
        sectionName: 'SAFETY_AND_BARRIER_FREE',
        itemName: 'Ramp and elevator access for Persons with Disabilities (PwD) as per Harmonized Guidelines',
        isCompliant: true,
        score: 10,
        remarks: 'Full barrier-free access available across academic buildings',
      },
      {
        inspectionId: inspection1.id,
        sectionName: 'LAB_EQUIPMENT',
        itemName: 'Network traffic analyzers, Hardware Security Modules (HSM), and Licensed Forensics Software',
        isCompliant: true,
        score: 9,
        remarks: 'Equipment list verified against invoice and physical installation',
      },
    ],
  });

  // 9. Compliance Requirements & Submissions
  const compRagging = await prisma.complianceRequirement.create({
    data: {
      code: 'COMP_ANTI_RAGGING',
      title: 'Establishment of Anti-Ragging Committee and Squad',
      titleHi: 'एंटी-रैगिंग समिति एवं दस्ते का गठन',
      titleMr: 'रॅगिंग विरोधी समिती व पथकाची स्थापना',
      category: 'STATUTORY',
      description: 'Mandatory constitution of Anti-Ragging Committee under AICTE Regulations 2009 with student and parent representatives.',
      mandatoryFor: 'ALL',
      frequency: 'ANNUAL',
      evidenceRequired: 'Official notification, member list, and Undertaking certificates of all admitted students.',
      penaltyDescription: 'Withdrawal of approval / 50% cut in intake for subsequent academic year.',
      isActive: true,
    },
  });

  const compIcc = await prisma.complianceRequirement.create({
    data: {
      code: 'COMP_ICC',
      title: 'Internal Complaints Committee (ICC) under POSH Act 2013',
      titleHi: 'आंतरिक शिकायत समिति (आईसीसी) गठन',
      titleMr: 'अंतर्गत तक्रार समिती (आयसीसी) स्थापना',
      category: 'STATUTORY',
      description: 'Constitution of ICC headed by a senior woman faculty member for gender sensitization and prevention of sexual harassment.',
      mandatoryFor: 'ALL',
      frequency: 'ANNUAL',
      evidenceRequired: 'Annual ICC report, committee roster, and awareness workshop proofs.',
      penaltyDescription: 'Show-cause notice and regulatory penalty under Section 26 of POSH Act.',
      isActive: true,
    },
  });

  const compGrievance = await prisma.complianceRequirement.create({
    data: {
      code: 'COMP_GRIEVANCE',
      title: 'Online Grievance Redressal Mechanism & Ombudsman Appointment',
      titleHi: 'ऑनलाइन शिकायत निवारण तंत्र एवं लोकपाल नियुक्ति',
      titleMr: 'ऑनलाइन तक्रार निवारण यंत्रणा व लोकपाल नियुक्ती',
      category: 'GOVERNANCE',
      description: 'Establishment of dedicated online portal for student/staff grievance logging and appointment of retired District Judge/Professor as Ombudsman.',
      mandatoryFor: 'ALL',
      frequency: 'ANNUAL',
      evidenceRequired: 'URL of live portal, Ombudsman appointment order, and quarterly resolved cases register.',
      penaltyDescription: 'Notice of non-compliance and withholding of extension grants.',
      isActive: true,
    },
  });

  const compFaculty = await prisma.complianceRequirement.create({
    data: {
      code: 'COMP_FACULTY_RATIO',
      title: 'Faculty to Student Ratio (1:15 in Engineering / 1:20 in Management)',
      titleHi: 'संकाय-छात्र अनुपात रखरखाव (1:15 इंजीनियरिंग / 1:20 प्रबंधन)',
      titleMr: 'प्राध्यापक-विद्यार्थी प्रमाण (अभियांत्रिकी 1:15 / व्यवस्थापन 1:20)',
      category: 'ACADEMIC',
      description: 'Maintaining cadre ratio 1 Professor : 2 Associate Professors : 6 Assistant Professors with AICTE/UGC pay scales.',
      mandatoryFor: 'ALL',
      frequency: 'ANNUAL',
      evidenceRequired: 'Bank disbursement statements, PF/Form 16 records, and joining orders.',
      penaltyDescription: 'Proportionate reduction of approved intake.',
      isActive: true,
    },
  });

  // Compliance Submissions
  await prisma.complianceSubmission.create({
    data: {
      institutionId: gcet.id,
      requirementId: compRagging.id,
      academicYear: '2026-2027',
      status: 'COMPLIANT',
      dueDate: new Date(now.getTime() + 60 * 86400000),
      submittedDate: new Date(now.getTime() - 10 * 86400000),
      verifiedAt: new Date(now.getTime() - 4 * 86400000),
      verifiedById: bureauOfficer.id,
      evidenceDocUrl: '/uploads/compliance/gcet_anti_ragging_2026.pdf',
      remarks: 'Complete 24-member committee order verified with student affidavits.',
    },
  });

  await prisma.complianceSubmission.create({
    data: {
      institutionId: gcet.id,
      requirementId: compIcc.id,
      academicYear: '2026-2027',
      status: 'COMPLIANT',
      dueDate: new Date(now.getTime() + 60 * 86400000),
      submittedDate: new Date(now.getTime() - 8 * 86400000),
      verifiedAt: new Date(now.getTime() - 3 * 86400000),
      verifiedById: bureauOfficer.id,
      evidenceDocUrl: '/uploads/compliance/gcet_icc_2026.pdf',
      remarks: 'ICC committee notified under Dr. Sunita Meshram (Chairperson). Compliant.',
    },
  });

  await prisma.complianceSubmission.create({
    data: {
      institutionId: gcet.id,
      requirementId: compFaculty.id,
      academicYear: '2026-2027',
      status: 'UNDER_REVIEW',
      dueDate: new Date(now.getTime() + 15 * 86400000),
      submittedDate: new Date(now.getTime() - 2 * 86400000),
      evidenceDocUrl: '/uploads/compliance/gcet_faculty_salary_audit.pdf',
      remarks: 'Under scrutiny by Western Regional Finance and Scrutiny Desk.',
    },
  });

  await prisma.complianceSubmission.create({
    data: {
      institutionId: coep.id,
      requirementId: compGrievance.id,
      academicYear: '2026-2027',
      status: 'PENDING_EVIDENCE',
      dueDate: new Date(now.getTime() + 8 * 86400000), // Due in 8 days
      remarks: 'Ombudsman appointment gazette copy pending institutional upload.',
    },
  });

  // 10. Escalation Rules
  await prisma.escalationRule.createMany({
    data: [
      {
        name: 'Level 1: Officer 3-Day SLA Breach',
        triggerDaysOverdue: 3,
        escalationLevel: 1,
        notifyRole: 'BUREAU_OFFICER',
        actionRequired: 'URGENT_STAGE_ACTION_REQUIRED',
        isActive: true,
      },
      {
        name: 'Level 2: Regional Director 7-Day SLA Breach',
        triggerDaysOverdue: 7,
        escalationLevel: 2,
        notifyRole: 'REGIONAL_OFFICER',
        actionRequired: 'DIRECTOR_SCRUTINY_INTERVENTION',
        isActive: true,
      },
      {
        name: 'Level 3: Central AICTE HQ 14-Day Critical Breach',
        triggerDaysOverdue: 14,
        escalationLevel: 3,
        notifyRole: 'CENTRAL_ADMIN',
        actionRequired: 'MEMBER_SECRETARY_EXECUTIVE_CALL',
        isActive: true,
      },
    ],
  });

  // 11. Tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Verify Land Title Deed & Built-up Area calculation for GCET',
      titleHi: 'जीसीईटी के लिए भूमि स्वामित्व विलेख एवं निर्मित क्षेत्र सत्यापन',
      titleMr: 'जीसीईटी करिता जमीन मालकी हक्क दस्तऐवज आणि बांधकाम क्षेत्र पडताळणी',
      description: 'Check municipal registry deed against AICTE Schedule 2 built-up norms for 3,400 enrolled students.',
      relatedEntityType: 'APPLICATION',
      relatedEntityId: app1.id,
      assignedToUserId: bureauOfficer.id,
      departmentId: enggDept.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() + 2 * 86400000),
      escalationLevel: 0,
      applicationId: app1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Scrutinize Fire NOC Validity & Structural Certificate for GCET APP-1004',
      titleHi: 'जीसीईटी आवेदन 1004 हेतु अग्नि एनओसी एवं संरचनात्मक प्रमाण पत्र जांच',
      titleMr: 'जीसीईटी अर्ज १००४ साठी अग्निशमन एनओसी आणि स्ट्रक्चरल प्रमाणपत्र तपासणी',
      description: 'Institutional response to deficiency notice expired. Immediate officer decision required.',
      relatedEntityType: 'APPLICATION',
      relatedEntityId: app4.id,
      assignedToUserId: bureauOfficer.id,
      departmentId: enggDept.id,
      status: 'ESCALATED',
      priority: 'CRITICAL',
      dueDate: new Date(now.getTime() - 4 * 86400000), // Overdue by 4 days
      escalationLevel: 1,
      applicationId: app4.id,
    },
  });

  await prisma.escalationEvent.create({
    data: {
      taskId: task2.id,
      applicationId: app4.id,
      triggeredLevel: 1,
      escalatedToRole: 'BUREAU_OFFICER',
      escalatedToUserId: bureauOfficer.id,
      reason: 'Task overdue by 4 days beyond standard 7-day scrutiny window. Priority escalated to CRITICAL.',
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Confirm EVC Committee Member Roster for COEP Tech University',
      titleHi: 'सीओईपी टेक विश्वविद्यालय हेतु ईवीसी समिति रोस्टर की पुष्टि करें',
      titleMr: 'सीओईपी तंत्रज्ञान विद्यापीठासाठी ईव्हीसी समिती रोस्टर निश्चित करा',
      description: 'Assign 3rd committee expert from outside Western Region to prevent institutional conflict of interest.',
      relatedEntityType: 'INSPECTION',
      relatedEntityId: inspection1.id,
      assignedToUserId: regionalOfficer.id,
      status: 'PENDING',
      priority: 'HIGH',
      dueDate: new Date(now.getTime() + 1 * 86400000),
      escalationLevel: 0,
    },
  });

  // 12. Multilingual Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: bureauOfficer.id,
        title: 'New Application Assigned for Scrutiny',
        titleHi: 'संवीक्षा हेतु नया आवेदन सौंपा गया',
        titleMr: 'छाननीसाठी नवीन अर्ज सोपवला',
        message: 'Application AICTE/2026-27/APP-1001 from GCET Mumbai has been assigned to your scrutiny desk.',
        messageHi: 'जीसीईटी मुंबई का आवेदन AICTE/2026-27/APP-1001 आपकी संवीक्षा डेस्क को सौंपा गया है।',
        messageMr: 'जीसीईटी मुंबईचा अर्ज AICTE/2026-27/APP-1001 आपल्या छाननी कक्षाकडे सोपवला आहे.',
        type: 'APPLICATION_STATUS',
        priority: 'NORMAL',
        isRead: false,
        actionUrl: `/applications/${app1.id}`,
      },
      {
        userId: bureauOfficer.id,
        title: 'ALERT: Task Overdue Escalation Level 1',
        titleHi: 'चेतावनी: कार्य समय-सीमा उल्लंघन स्तर 1',
        titleMr: 'सूचना: कार्य मुदत संपल्यामुळे स्तर १ वाढ',
        message: 'Task for Application AICTE/2026-27/APP-1004 is overdue by 4 days. Please review and take action.',
        messageHi: 'आवेदन AICTE/2026-27/APP-1004 का कार्य 4 दिनों से विलंबित है। कृपया तत्काल समीक्षा करें।',
        messageMr: 'अर्ज AICTE/2026-27/APP-1004 चे कार्य ४ दिवसांनी प्रलंबित आहे. कृपया तात्काळ निर्णय घ्यावा.',
        type: 'ESCALATION_ALERT',
        priority: 'URGENT',
        isRead: false,
        actionUrl: `/tasks`,
      },
      {
        userId: institutionAdmin.id,
        title: 'Application Under Detailed Scrutiny',
        titleHi: 'आवेदन विस्तृत संवीक्षा के अधीन है',
        titleMr: 'अर्ज सविस्तर छाननी प्रक्रियेत आहे',
        message: 'Your Extension of Approval application AICTE/2026-27/APP-1001 is currently under review by Bureau Officer.',
        messageHi: 'आपका विस्तार अनुमोदन आवेदन AICTE/2026-27/APP-1001 वर्तमान में ब्यूरो अधिकारी द्वारा समीक्षाधीन है।',
        messageMr: 'आपला मुदतवाढ मंजुरी अर्ज AICTE/2026-27/APP-1001 सध्या ब्युरो अधिकाऱ्याकडून तपासला जात आहे.',
        type: 'APPLICATION_STATUS',
        priority: 'NORMAL',
        isRead: false,
        actionUrl: `/applications/${app1.id}`,
      },
      {
        userId: evcMember.id,
        title: 'EVC Inspection Committee Assignment',
        titleHi: 'ईवीसी निरीक्षण समिति नियुक्ति',
        titleMr: 'ईव्हीसी तपासणी समिती नियुक्ती',
        message: 'You have been nominated as Chairman for EVC Inspection EVC-2026-0042 at COEP Tech University.',
        messageHi: 'आपको सीओईपी टेक विश्वविद्यालय में ईवीसी निरीक्षण EVC-2026-0042 के लिए अध्यक्ष नियुक्त किया गया है।',
        messageMr: 'आपणास सीओईपी तंत्रज्ञान विद्यापीठातील ईव्हीसी तपासणी EVC-2026-0042 साठी अध्यक्ष म्हणून नियुक्त करण्यात आले आहे.',
        type: 'INSPECTION_SCHEDULED',
        priority: 'HIGH',
        isRead: false,
        actionUrl: `/inspections/${inspection1.id}`,
      },
    ],
  });

  // 13. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: institutionAdmin.id,
        userRole: 'INSTITUTION_ADMIN',
        userEmail: 'principal@gcet.edu.in',
        action: 'SUBMIT',
        entityType: 'APPLICATION',
        entityId: app1.id,
        description: 'Application AICTE/2026-27/APP-1001 submitted electronically by Institution Nodal Officer.',
        oldState: JSON.stringify({ status: 'DRAFT' }),
        newState: JSON.stringify({ status: 'SUBMITTED' }),
        ipAddress: '115.240.88.14',
      },
      {
        userId: bureauOfficer.id,
        userRole: 'BUREAU_OFFICER',
        userEmail: 'bureau.officer@aicte.gov.in',
        action: 'ADVANCE_STAGE',
        entityType: 'APPLICATION',
        entityId: app1.id,
        description: 'Preliminary validation cleared. Application transitioned to Stage 3: Bureau Detailed Scrutiny.',
        oldState: JSON.stringify({ status: 'INITIAL_VALIDATION', currentStageCode: 'STAGE_VALIDATION' }),
        newState: JSON.stringify({ status: 'UNDER_SCRUTINY', currentStageCode: 'STAGE_SCRUTINY' }),
        ipAddress: '10.20.44.102',
      },
      {
        userId: bureauOfficer.id,
        userRole: 'BUREAU_OFFICER',
        userEmail: 'bureau.officer@aicte.gov.in',
        action: 'VERIFY_DOC',
        entityType: 'DOCUMENT',
        entityId: fireNoc.id,
        description: 'Fire Safety NOC verified against Municipal Corporation records. OCR metadata confirmed.',
        oldState: JSON.stringify({ status: 'PENDING' }),
        newState: JSON.stringify({ status: 'VERIFIED' }),
        ipAddress: '10.20.44.102',
      },
      {
        userId: centralAdmin.id,
        userRole: 'CENTRAL_ADMIN',
        userEmail: 'centraladmin@aicte.gov.in',
        action: 'APPROVE',
        entityType: 'APPLICATION',
        entityId: app3.id,
        description: 'Council Extension of Approval granted for JBIMS MMS & Executive programmes for AY 2026-27.',
        oldState: JSON.stringify({ status: 'COMMITTEE_REVIEW' }),
        newState: JSON.stringify({ status: 'APPROVED' }),
        ipAddress: '10.10.12.5',
      },
    ],
  });

  // 14. System Settings
  await prisma.systemSetting.createMany({
    data: [
      { key: 'ACADEMIC_YEAR_CURRENT', value: '2026-2027', description: 'Active academic approval cycle' },
      { key: 'PORTAL_MAINTENANCE_MODE', value: 'false', description: 'Emergency administrative lockdown flag' },
      { key: 'AUTO_ESCALATION_ENABLED', value: 'true', description: 'Flag enabling automatic background SLA escalation checks' },
      { key: 'OCR_AUTO_VERIFY_THRESHOLD', value: '0.95', description: 'OCR confidence score threshold for high-accuracy pre-fill' },
      { key: 'PORTAL_VERSION', value: 'v2.6.2-anumati', description: 'Current release build' },
    ],
  });

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

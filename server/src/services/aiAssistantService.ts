export interface AssistantResponse {
  answer: string;
  citations: string[];
  suggestedActions?: { label: string; url: string }[];
  language: 'en' | 'hi' | 'mr';
}

export class AiAssistantService {
  /**
   * Deterministic, regulatory-grounded governance assistant for AICTE APH 2026-27 guidelines.
   */
  public static async queryAssistant(query: string, language: string = 'en'): Promise<AssistantResponse> {
    const q = query.toLowerCase();
    const lang = (language === 'hi' || language === 'mr' ? language : 'en') as 'en' | 'hi' | 'mr';

    // 1. Fire NOC & Building Safety
    if (q.includes('fire') || q.includes('noc') || q.includes('अग्नि') || q.includes('अग्निशमन') || q.includes('सुरक्षा')) {
      if (lang === 'hi') {
        return {
          answer:
            'एआईसीटीई अनुमोदन प्रक्रिया पुस्तिका (एपीएच) के अध्याय 2 के अनुसार, सभी तकनीकी संस्थानों के लिए सक्षम अग्निशमन प्राधिकरण से वैध अग्नि एनओसी अनिवार्य है। एनओसी आवेदन के समय न्यूनतम 6 महीने के लिए वैध होनी चाहिए। यदि आपकी एनओसी समाप्त हो रही है, तो नवीनीकरण आवेदन रसीद संलग्न करें।',
          citations: ['AICTE Approval Process Handbook (APH) 2026-27: Chapter II, Norms for Land and Built-Up Area', 'National Building Code (NBC) 2016 Part 4'],
          suggestedActions: [{ label: 'दस्तावेज़ प्रबंधन खोलें', url: '/documents' }],
          language: 'hi',
        };
      }
      if (lang === 'mr') {
        return {
          answer:
            'एआयसीटीई मंजुरी प्रक्रिया पुस्तिका (APH) प्रकरण २ नुसार, सक्षम महापालिका किंवा राज्य अग्निशमन विभागाकडून वैध अग्निशामक ना-हरकत प्रमाणपत्र (NOC) सादर करणे बंधनकारक आहे. मुदत संपत असल्यास तत्काळ नूतनीकरण पावती सादर करावी.',
          citations: ['AICTE Approval Process Handbook (APH) 2026-27: Chapter II, Safety Norms', 'Maharashtra Fire Prevention and Life Safety Measures Act'],
          suggestedActions: [{ label: 'दस्तऐवज व्यवस्थापन पहा', url: '/documents' }],
          language: 'mr',
        };
      }
      return {
        answer:
          'Under Chapter II of the AICTE Approval Process Handbook (APH) 2026-27, a valid Fire Safety No Objection Certificate (NOC) issued by the competent Municipal or State Fire Service Directorate is mandatory for all technical education campuses. The certificate must be current and renewed annually. Institutions must upload the renewed certificate in the Document Repository.',
        citations: ['AICTE Approval Process Handbook (APH) 2026-27: Chapter II, Section 2.4 - Safety Provisions', 'National Building Code (NBC) 2016 Part 4'],
        suggestedActions: [{ label: 'View Document Repository', url: '/documents' }],
        language: 'en',
      };
    }

    // 2. Faculty Cadre Ratio & 7th CPC
    if (q.includes('faculty') || q.includes('ratio') || q.includes('teacher') || q.includes('संकाय') || q.includes('प्राध्यापक') || q.includes('शिक्षक')) {
      if (lang === 'hi') {
        return {
          answer:
            'इंजीनियरिंग और प्रौद्योगिकी संस्थानों में संकाय से छात्र का अनुपात (FSR) 1:15 बनाए रखना अनिवार्य है, जबकि प्रबंधन (MBA/MMS) में यह 1:20 है। संकाय कैडर अनुपात 1 प्रोफेसर : 2 एसोसिएट प्रोफेसर : 6 असिस्टेंट प्रोफेसर के अनुसार होना चाहिए और 7वें वेतन आयोग के अनुसार भुगतान होना चाहिए।',
          citations: ['AICTE APH 2026-27: Appendix 7 - Norms for Faculty Requirements', 'AICTE Pay Scales and Qualifications Regulations 2019'],
          suggestedActions: [{ label: 'अनुपालन स्थिति देखें', url: '/compliance' }],
          language: 'hi',
        };
      }
      if (lang === 'mr') {
        return {
          answer:
            'अभियांत्रिकी पदवी अभ्यासक्रमांसाठी प्राध्यापक ते विद्यार्थी प्रमाण (FSR) १:१५ असणे आवश्यक आहे आणि व्यवस्थापन (MBA) साठी १:२० असणे आवश्यक आहे. संवर्ग प्रमाण १ प्राध्यापक : २ सहयोगी प्राध्यापक : ६ सहाय्यक प्राध्यापक असे बंधनकारक आहे.',
          citations: ['AICTE APH 2026-27: Appendix 7 - Norms for Faculty Requirements and Cadre Ratio', 'AICTE 7th CPC Government of Maharashtra Gazette'],
          suggestedActions: [{ label: 'अनुपालन अहवाल तपासा', url: '/compliance' }],
          language: 'mr',
        };
      }
      return {
        answer:
          'Under Appendix 7 of the AICTE Approval Process Handbook (APH) 2026-27, Engineering and Technology institutions must maintain a Faculty-to-Student Ratio (FSR) of 1:15, and Management programmes must maintain 1:20. The cadre ratio must adhere to 1 Professor : 2 Associate Professors : 6 Assistant Professors, with Aadhaar-enabled biometric attendance records and 7th Central Pay Commission scales.',
        citations: ['AICTE APH 2026-27: Appendix 7 - Norms for Faculty Requirements', 'AICTE Pay Scales and Qualifications Regulations 2019'],
        suggestedActions: [{ label: 'Check Compliance Status', url: '/compliance' }],
        language: 'en',
      };
    }

    // 3. EVC Inspection & Committee
    if (q.includes('evc') || q.includes('inspection') || q.includes('visit') || q.includes('निरीक्षण') || q.includes('तपासणी') || q.includes('समिति')) {
      if (lang === 'hi') {
        return {
          answer:
            'विशेषज्ञ निरीक्षण समिति (ईवीसी) में तीन सदस्य होते हैं (अध्यक्ष, सदस्य सचिव और विषय विशेषज्ञ)। निष्पक्षता सुनिश्चित करने हेतु उसी क्षेत्र या संस्थान से विशेषज्ञों की नियुक्ति प्रतिबंधित है। ईवीसी संस्थान के बुनियादी ढांचे, प्रयोगशाला उपकरणों और बायोमेट्रिक उपस्थिति का भौतिक सत्यापन करती है।',
          citations: ['AICTE APH 2026-27: Chapter I, Section 1.8 - Procedure for Expert Visiting Committee (EVC)', 'Standing Complaint Redressal Committee Guidelines'],
          suggestedActions: [{ label: 'निरीक्षण अनुसूची देखें', url: '/inspections' }],
          language: 'hi',
        };
      }
      if (lang === 'mr') {
        return {
          answer:
            'तज्ज्ञ भेट समिती (EVC) मध्ये अध्यक्ष, सदस्य सचिव व विषय तज्ज्ञ असतात. पारदर्शकता राखण्यासाठी स्थानिक हितसंबंध असणाऱ्या व्यक्तींना समितीत समाविष्ट केले जात नाही. समिती पायाभूत सुविधा, प्रयोगशाळा उपकरणे व प्राध्यापक बायोमेट्रिकची जागेवर प्रत्यक्ष तपासणी करते.',
          citations: ['AICTE APH 2026-27: Chapter I, Section 1.8 - Procedure for Expert Visiting Committee (EVC)'],
          suggestedActions: [{ label: 'तपासणी वेळापत्रक उघडा', url: '/inspections' }],
          language: 'mr',
        };
      }
      return {
        answer:
          'The Expert Visiting Committee (EVC) is constituted under Section 1.8 of the AICTE Approval Process Handbook (APH) 2026-27. It comprises three independent senior experts (Chairman, Member Secretary, Subject Expert) nominated from premier institutions (IITs/NITs/Central Universities). Conflict-of-interest checks automatically prevent assigning experts from the same region or parent university.',
        citations: ['AICTE APH 2026-27: Chapter I, Section 1.8 - Procedure for Expert Visiting Committee (EVC)', 'Anti-Conflict Regulatory Protocol 2026'],
        suggestedActions: [{ label: 'View EVC Inspections', url: '/inspections' }],
        language: 'en',
      };
    }

    // 4. Land & Built-up Area Norms
    if (q.includes('land') || q.includes('area') || q.includes('built-up') || q.includes('भूमि') || q.includes('जमीन') || q.includes('क्षेत्रफळ')) {
      if (lang === 'hi') {
        return {
          answer:
            'एपीएच 2026-27 अध्याय 4 के अनुसार, इंजीनियरिंग संस्थान के लिए मेट्रो शहर में न्यूनतम 1.5 एकड़, शहरी क्षेत्र में 2.5 एकड़ और ग्रामीण क्षेत्र में 7.5 एकड़ निरंतर भूमि (Contiguous Land) आवश्यक है। स्वामित्व या 30 वर्ष की सरकारी पंजीकृत लीज अनिवार्य है।',
          citations: ['AICTE APH 2026-27: Chapter IV - Norms for Land and Built-Up Area', 'AICTE Land Title Regulations'],
          suggestedActions: [{ label: 'दस्तावेज़ रिपॉजिटरी', url: '/documents' }],
          language: 'hi',
        };
      }
      if (lang === 'mr') {
        return {
          answer:
            'अभियांत्रिकी महाविद्यालयासाठी महापालिका क्षेत्रात किमान १.५ एकर, शहरी भागात २.५ एकर आणि ग्रामीण भागात ७.५ एकर अखंडित (Contiguous) जमीन असणे अनिवार्य आहे. जमीन संस्था मालकीची किंवा ३० वर्षांच्या नोंदणीकृत भाडेपट्ट्यावर असावी.',
          citations: ['AICTE APH 2026-27: Chapter IV - Land Norms', 'Maharashtra Land Revenue Code Regulation'],
          suggestedActions: [{ label: 'दस्तऐवज व्यवस्थापन पहा', url: '/documents' }],
          language: 'mr',
        };
      }
      return {
        answer:
          'Under Chapter IV of APH 2026-27, Technical Institutions offering UG Engineering require minimum 1.5 acres in Mega/Metro cities, 2.5 acres in Urban areas, and 7.5 acres in Rural areas in a single contiguous piece of land. Land must be freehold or registered lease for minimum 30 years.',
        citations: ['AICTE APH 2026-27: Chapter IV - Norms for Land and Built-Up Area', 'AICTE Contiguous Land Guidelines'],
        suggestedActions: [{ label: 'Check Document Repository', url: '/documents' }],
        language: 'en',
      };
    }

    // 5. Anti-Ragging & POSH Compliance
    if (q.includes('ragging') || q.includes('posh') || q.includes('grievance') || q.includes('रैगिंग') || q.includes('तक्रार')) {
      if (lang === 'hi') {
        return {
          answer:
            'सर्वोच्च न्यायालय और एआईसीटीई विनियमों के अनुसार प्रत्येक तकनीकी संस्थान में एंटी-रैगिंग कमेटी, एंटी-रैगिंग स्क्वाड, आंतरिक शिकायत समिति (POSH ICC), और छात्र शिकायत निवारण लोकपाल (Ombudsman) की स्थापना अनिवार्य है।',
          citations: ['AICTE Anti-Ragging Regulations 2009', 'AICTE Gender Sensitization & POSH Regulations 2016'],
          suggestedActions: [{ label: 'अनुपालन स्थिति देखें', url: '/compliance' }],
          language: 'hi',
        };
      }
      if (lang === 'mr') {
        return {
          answer:
            'सर्वोच्च न्यायालय व एआयसीटीई नियमानुसार रॅगिंग विरोधी समिती (Anti-Ragging), अंतर्गत तक्रार निवारण समिती (POSH ICC), व विद्यार्थी तक्रार निवारण ओम्बड्समनची स्थापना सर्व संस्थांसाठी कायद्याने बंधनकारक आहे.',
          citations: ['AICTE Anti-Ragging Regulations 2009', 'Supreme Court of India Guidelines'],
          suggestedActions: [{ label: 'अनुपालन अहवाल तपासा', url: '/compliance' }],
          language: 'mr',
        };
      }
      return {
        answer:
          'In compliance with Hon’ble Supreme Court directives and AICTE regulations, all institutions must mandatorily constitute an Anti-Ragging Committee, Anti-Ragging Squad, Internal Complaints Committee (POSH ICC), and appoint an independent Student Grievance Redressal Ombudsman.',
        citations: ['AICTE Anti-Ragging Regulations 2009', 'AICTE Gender Sensitization & Internal Complaints Committee Regulations 2016'],
        suggestedActions: [{ label: 'View Statutory Compliance Matrix', url: '/compliance' }],
        language: 'en',
      };
    }

    // Default Fallback
    if (lang === 'hi') {
      return {
        answer:
          'नमस्ते! मैं एआईसीटीई सारथी हूँ। मैं अनुमोदन प्रक्रिया पुस्तिका (APH 2026-27), आवेदन स्थिति, दस्तावेज़ आवश्यकताओं, संकाय अनुपात और निरीक्षण नियमों के बारे में आपकी सहायता कर सकता हूँ। आप क्या जानना चाहते हैं?',
        citations: ['AICTE Approval Process Handbook (APH) 2026-27 Overview', 'Ministry of Education Digital Governance Directive'],
        suggestedActions: [
          { label: 'आवेदन सूची देखें', url: '/applications' },
          { label: 'दस्तावेज़ रिपॉजिटरी', url: '/documents' },
        ],
        language: 'hi',
      };
    }
    if (lang === 'mr') {
      return {
        answer:
          'नमस्कार! मी एआयसीटीई सारथी आहे. मी मंजुरी प्रक्रिया पुस्तिका (APH २०२६-२७), अर्जाची सद्यस्थिती, आवश्यक कागदपत्रे, प्राध्यापक निकष आणि ईव्हीसी तपासणी नियमांबाबत मार्गदर्शन करू शकतो. कृपया आपला प्रश्न विचारा.',
        citations: ['AICTE Approval Process Handbook (APH) 2026-27 Guidelines'],
        suggestedActions: [
          { label: 'अर्जांची यादी पहा', url: '/applications' },
          { label: 'दस्तऐवज तपासा', url: '/documents' },
        ],
        language: 'mr',
      };
    }

    return {
      answer:
        'Greetings! I am AICTE Saarthi, your intelligent administrative guide. I can answer regulatory queries concerning the AICTE Approval Process Handbook (APH 2026-27), document checklist, Land & Built-up norms, Faculty cadre ratios, and EVC inspection guidelines.',
      citations: ['AICTE Approval Process Handbook (APH) 2026-27 General Provisions', 'Ministry of Education Digital Services Framework'],
      suggestedActions: [
        { label: 'Browse Applications', url: '/applications' },
        { label: 'Check Compliance Matrix', url: '/compliance' },
      ],
      language: 'en',
    };
  }
}

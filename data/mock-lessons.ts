export type ContentSection = {
  id: string
  title: string
  subtitle?: string
  type: "text" | "image" | "example"
  content: string
  image?: string
  keyPoints?: string[]
  callout?: string
}

export type Subtopic = {
  id: string
  title: string
}

export type Topic = {
  id: string
  title: string
  description: string
  sections: ContentSection[]
  subtopics?: Subtopic[]
}

export type LessonData = {
  title: string
  description: string
  topics: Topic[]
}

export const mockLessonData: LessonData = {
  title: "Data Protection Compliance Fundamentals",
  description: "Learn essential data protection principles and compliance requirements for modern organizations.",
  topics: [
    {
      id: "topic-1",
      title: "Understanding Data Protection",
      description: "The foundations of data protection and why it matters",
      subtopics: [
        { id: "sub-1-1", title: "What is data protection?" },
        { id: "sub-1-2", title: "Regulatory landscape" },
        { id: "sub-1-3", title: "Business impact" },
      ],
      sections: [
        {
          id: "section-1-1",
          title: "Introduction to Data Protection",
          subtitle: "Why organizations care about data",
          type: "text",
          content:
            "Data protection is the practice of safeguarding important information from corruption, compromise or loss. In today's digital age, organizations collect vast amounts of personal data from customers, employees, and partners. This data is valuable but also requires careful handling to maintain trust and comply with regulations.",
          keyPoints: [
            "Data protection ensures privacy and security of personal information",
            "Regulatory compliance is mandatory in most jurisdictions",
            "Poor data protection can lead to financial penalties and reputational damage",
            "Data protection is a shared responsibility across the organization",
          ],
        },
        {
          id: "section-1-2",
          title: "The Global Regulatory Landscape",
          type: "image",
          content:
            "Different regions have implemented comprehensive data protection laws. GDPR in Europe, CCPA in California, and similar regulations worldwide set standards for how organizations must handle personal data.",
          image: "/global-regulations-map.jpg",
        },
        {
          id: "section-1-3",
          title: "Real-World Scenario",
          type: "example",
          content:
            "Consider a retail company that collects customer email addresses for marketing. Under GDPR, they must: (1) Obtain explicit consent before collecting data, (2) Clearly explain how the data will be used, (3) Allow customers to delete their information, and (4) Report any data breaches within 72 hours. Failure to do so can result in fines up to 4% of annual revenue.",
          callout:
            "Non-compliance with data protection regulations can result in fines up to 20 million EUR or 4% of annual revenue (whichever is higher) under GDPR.",
        },
      ],
    },
    {
      id: "topic-2",
      title: "Personal Data and Classification",
      description: "Identifying and categorizing different types of personal data",
      subtopics: [
        { id: "sub-2-1", title: "Types of personal data" },
        { id: "sub-2-2", title: "Special category data" },
        { id: "sub-2-3", title: "Data classification" },
      ],
      sections: [
        {
          id: "section-2-1",
          title: "What Constitutes Personal Data?",
          type: "text",
          content:
            "Personal data is any information relating to an identified or identifiable natural person. This includes obvious identifiers like names and email addresses, but also less obvious data like IP addresses, cookies, and biometric information. Even anonymized data that can be re-identified is still personal data.",
          keyPoints: [
            "Personal data includes any information that can identify an individual",
            "Location data, behavioral data, and online identifiers all qualify as personal data",
            'Data that is "reasonably likely" to identify someone is personal data',
            "The definition is broad and applies to most customer and employee information",
          ],
        },
        {
          id: "section-2-2",
          title: "Special Category Data",
          type: "image",
          content:
            "Certain types of personal data require extra protection due to their sensitive nature. These include racial or ethnic origin, political opinions, religious beliefs, trade union membership, genetic data, biometric data, health data, and data concerning sex life or sexual orientation.",
          image: "/sensitive-data-categories.jpg",
        },
        {
          id: "section-2-3",
          title: "Data Classification in Practice",
          type: "example",
          content:
            'A healthcare provider must classify patient records as "special category data" due to health information. This means: (1) Extra consent requirements, (2) Limited data sharing, (3) Enhanced security measures, (4) Staff training requirements. Misclassifying this data as standard personal data would be a serious compliance violation.',
          callout:
            "Processing special category data requires explicit consent and has additional safeguards. Unauthorized processing can result in higher penalties.",
        },
      ],
    },
    {
      id: "topic-3",
      title: "Data Processing and Consent",
      description: "Understanding lawful processing and obtaining proper consent",
      subtopics: [
        { id: "sub-3-1", title: "Legal bases for processing" },
        { id: "sub-3-2", title: "Types of consent" },
        { id: "sub-3-3", title: "Consent management" },
      ],
      sections: [
        {
          id: "section-3-1",
          title: "Legal Bases for Processing",
          type: "text",
          content:
            "You cannot process personal data without a legal basis. The main legal bases include: (1) Consent - explicit permission from the individual, (2) Contract - necessary to fulfill an agreement, (3) Legal obligation - required by law, (4) Vital interests - protecting someone's life, (5) Public task - governmental functions, (6) Legitimate interests - your organization's interests balanced against individual rights.",
          keyPoints: [
            "Every data processing activity must have a documented legal basis",
            "Consent is the most common but not the only legal basis",
            "Legitimate interests require balancing your interests against individual rights",
            "You must be able to demonstrate your legal basis if questioned",
          ],
        },
        {
          id: "section-3-2",
          title: "Types of Consent",
          type: "image",
          content:
            "Different types of consent have different validity. Express consent (explicit agreement) is stronger than implied consent. Opt-in (affirmative action) is preferred over opt-out. Pre-ticked boxes do not constitute valid consent.",
          image: "/consent-types-diagram.jpg",
        },
        {
          id: "section-3-3",
          title: "Consent Best Practices",
          type: "example",
          content:
            "When collecting email newsletter subscriptions, best practice is: (1) Use a clearly visible opt-in checkbox (not pre-ticked), (2) Clearly state what the person is consenting to, (3) Make it easy to withdraw consent, (4) Maintain records of consent, (5) Honor withdrawal requests immediately.",
          callout:
            "Consent must be freely given, specific, informed, and unambiguous. Silence or inactivity does not constitute consent under GDPR.",
        },
      ],
    },
    {
      id: "topic-4",
      title: "Data Breaches and Incident Response",
      description: "Managing and reporting data security incidents",
      subtopics: [
        { id: "sub-4-1", title: "Breach identification" },
        { id: "sub-4-2", title: "Response procedures" },
        { id: "sub-4-3", title: "Reporting requirements" },
      ],
      sections: [
        {
          id: "section-4-1",
          title: "What is a Data Breach?",
          type: "text",
          content:
            "A data breach is an unauthorized or accidental disclosure, loss, alteration, or destruction of personal data. This includes data stolen by hackers, data accidentally deleted, data lost in transit, or data disclosed to the wrong recipient. Not all breaches require reporting, but you must assess the risk to individual rights.",
          keyPoints: [
            "A breach must be reported to authorities within 72 hours if there's a risk to rights",
            "Individuals must be notified if the breach creates a high risk of harm",
            "Documentation of all breaches is mandatory",
            "Some low-risk breaches may not require notification but still must be documented",
          ],
        },
        {
          id: "section-4-2",
          title: "Incident Response Timeline",
          type: "image",
          content:
            "Organizations should have documented procedures for responding to breaches, including immediate containment, investigation, notification, and remediation steps. The 72-hour clock starts from when the breach is discovered.",
          image: "/incident-response-timeline.jpg",
        },
        {
          id: "section-4-3",
          title: "Real Breach Scenario",
          type: "example",
          content:
            "A company discovers that 10,000 customer records were exposed due to a misconfigured database. They must: (1) Immediately contain the breach, (2) Notify their data protection officer, (3) Assess the risk level, (4) Notify authorities within 72 hours, (5) Notify affected individuals without undue delay if high-risk, (6) Document everything, (7) Implement corrective measures.",
          callout:
            "Failing to report a breach to authorities within 72 hours without valid justification can result in significant penalties.",
        },
      ],
    },
  ],
}

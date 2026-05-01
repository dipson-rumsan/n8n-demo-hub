import {
  Facebook,
  FileText,
  CheckCircle2,
  Mail,
  CalendarClock,
  ShieldCheck,
  Package,
  MessageSquare,
  MessageCircle,
  Mic,
  Phone,
  Bot,
  Users,
  Brain,
  Zap,
} from "lucide-react";
import { DiscordIcon, TelegramIcon } from "@/components/home/icons";
import { PAGES, URLS } from "@/constants";
import type { Workflow } from "@/components/home/types";

export const workflows: Workflow[] = [
  {
    id: "askbhunte",
    icon: Facebook,
    iconColor: "text-blue-500 border-blue-500/20 bg-blue-500/5",
    badge: "Real-time AI",
    title: "AskBhunte AI Chatbot",
    shortDescription:
      "Your all-in-one Facebook AI assistant for real-time market updates, loans, and news.",
    fullDescription:
      "AskBhunte is a multimodal AI assistant integrated with Facebook Messenger. It delivers real-time updates on Forex, Stocks, Gold/Silver prices, Nepalese bank loan rates, and the latest news from The Kathmandu Post — all in one conversational interface.",
    workflowUrl: PAGES.FACEBOOK_URL,
    dateCreated: new Date("2025-12-15"),
    problems: [
      "Keeping track of gold, silver, stocks, and Forex prices in real-time is tedious.",
      "Manually checking loan rates from multiple Nepali banks is inefficient.",
      "Staying updated with reliable news from The Kathmandu Post requires browsing multiple sources.",
      "Investors and advisors lack a single platform that consolidates market data, bank loans, and news.",
      "Critical financial and political insights are often delayed, impacting timely decisions.",
    ],
    useCases: [
      "Investors and traders get instant updates on gold, silver, stocks, and Forex markets.",
      "Compare loan rates from various Nepali banks to make informed borrowing decisions.",
      "Receive daily verified news updates from The Kathmandu Post in Messenger.",
      "Financial advisors provide real-time guidance to clients using consolidated data.",
      "Students, professionals, and business owners track market trends and political news efficiently.",
    ],
  },
  {
    id: "cv-evaluation",
    icon: FileText,
    iconColor: "text-blue-500 border-blue-500/20 bg-blue-500/5",
    badge: "AI-Powered",
    title: "CV Evaluation & Scoring",
    status: "operational",
    shortDescription:
      "AI-powered resume analysis and intelligent candidate evaluation with instant reports.",
    fullDescription:
      "Automatically evaluate CVs using AI. Extract information, score candidates, and generate detailed reports.",
    workflowUrl: "/cvEvaluation",
    isInternalRoute: true,
    dateCreated: new Date("2025-12-16"),
    steps: [
      {
        icon: CheckCircle2,
        title: "Select Job Position",
        description:
          "Choose the job role and requirements for candidate evaluation.",
      },
      {
        icon: FileText,
        title: "Upload Resumes",
        description: "Securely upload CVs through the portal.",
      },
      {
        icon: Zap,
        title: "AI Evaluation",
        description:
          "Automatically assess skills, experience, and match to job requirements.",
      },
      {
        icon: Mail,
        title: "Generate Reports",
        description: "Create detailed scorecards for each candidate.",
      },
    ],
    problems: [
      "Manual resume screening consumes excessive recruiter time",
      "Inconsistent candidate evaluations across teams",
      "Difficulty comparing large volumes of CVs objectively",
      "Difficulty comparing large volumes of CVs objectively",
      "High risk of human bias in initial candidate shortlisting",
      "Delays in recruitment affecting business timelines",
      "Challenges in documenting candidate scoring consistently",
    ],
    useCases: [
      "HR teams screening hundreds of resumes efficiently",
      "Recruitment agencies ranking candidates for clients",
      "Campus recruitment programs",
      "Startups hiring without a dedicated HR team",
      "Enterprises standardizing evaluation across departments",
      "Pre-interview shortlisting to reduce interviewer workload",
    ],
  },
  {
    id: "employee-leave-management",
    icon: CalendarClock,
    iconColor: "text-purple-500 border-purple-500/20 bg-purple-500/5",
    badge: "HR Automation",
    title: "Employee Leave Management",
    shortDescription:
      "Boost HR productivity and business agility with AI-driven, automated leave management for all employee leave types.",
    fullDescription:
      "Transform your HR operations with a fully automated, AI-powered leave management solution. Effortlessly process and categorize all leave requests (sick, emergency, personal, work-from-home) directly from Gmail. Ensure data accuracy, eliminate manual errors, and gain real-time visibility into workforce availability. The system validates, deduplicates, and syncs structured leave data to Google Sheets, supporting compliance, audit trails, and scalable growth. Empower managers to focus on strategic work, reduce operational costs, and deliver a seamless employee experience.",
    isInternalRoute: true,
    dateCreated: new Date("2026-2-18"),
    problems: [
      "Manual leave processing wastes valuable HR and management time",
      "Operational inefficiencies increase payroll and admin costs",
      "Lack of real-time leave data disrupts resource planning and project delivery",
      "Manual errors and missing information lead to payroll disputes and compliance risks",
      "No standardized process for handling multiple leave types (sick, emergency, personal, WFH)",
      "Difficulty tracking work-from-home deliverables impacts productivity measurement",
      "Duplicate or inconsistent records undermine data integrity and reporting",
      "No audit trail or version history for compliance and dispute resolution",
      "Scalability issues as business and workforce grow",
      "Limited visibility for leadership to make data-driven decisions",
    ],
    useCases: [
      "Save HR and management time by automating leave request processing from Gmail",
      "Reduce payroll and admin costs through error-free, standardized data entry",
      "Gain instant visibility into employee availability for better project and resource planning",
      "Ensure compliance and reduce risk with audit trails and versioned leave records",
      "Support business growth with a scalable, automated leave management system",
      "Empower leadership with real-time dashboards and actionable workforce insights",
      "Track work-from-home deliverables for productivity and accountability",
      "Eliminate duplicate entries and maintain clean, reliable data for payroll and reporting",
      "Deliver a seamless, transparent leave experience for employees and managers",
    ],
  },
  {
    id: "invoice-validation",
    icon: ShieldCheck,
    iconColor: "text-orange-500 border-orange-500/20 bg-orange-500/5",
    badge: "Finance Bot",
    title: "Invoice Validation Portal",
    shortDescription:
      "Automated invoice processing, data extraction, and cross-department validation.",
    fullDescription:
      "Streamline invoice validation with automated extraction, notifications, and archiving.",
    image: "/invoice-validation-workflow.png",
    workflowUrl: "/invoiceValidation",
    isInternalRoute: true,
    dateCreated: new Date("2025-12-18"),
    steps: [
      {
        icon: FileText,
        title: "Upload Invoice",
        description:
          "Upload purchase receipt for warranty verification and product validation.",
      },
      {
        icon: Package,
        title: "Select Products",
        description:
          "Choose affected products and specify support type (warranty claim, troubleshooting, etc.).",
      },
      {
        icon: MessageSquare,
        title: "Describe Issue",
        description:
          "Provide detailed description of the problem and desired resolution.",
      },
      {
        icon: Mail,
        title: "Submit & Notify",
        description:
          "Submit claim and receive email confirmation with tracking details.",
      },
    ],
    problems: [
      "Manual invoice processing is slow and error-prone",
      "Difficulty ensuring cross-department validation",
      "Late approvals can delay payments",
      "High operational cost for finance teams",
    ],
    useCases: [
      "Finance teams automating invoice workflow",
      "Businesses tracking invoice approvals efficiently",
      "Accounting departments reducing manual errors",
      "Companies scaling finance operations without increasing headcount",
    ],
  },
  {
    id: "discord-integration",
    icon: DiscordIcon,
    iconColor: "text-indigo-500 border-indigo-500/20 bg-indigo-500/5",
    badge: "Community Bot",
    title: "Discord Chatbot Integration",
    shortDescription:
      "Intelligent Discord bot for community management and automated responses.",
    fullDescription:
      "Advanced Discord bot integration with AI-powered moderation, automated responses, and community engagement features.",
    workflowUrl: PAGES.DISCORD_URL,
    isInternalRoute: false,
    dateCreated: new Date("2025-12-19"),
    problems: [
      "Keeping track of gold, silver, stocks, and Forex prices in real-time is tedious.",
      "Manually checking loan rates from multiple Nepali banks is inefficient.",
      "Staying updated with reliable news from The Kathmandu Post requires browsing multiple sources.",
      "Investors and advisors lack a single platform that consolidates market data, bank loans, and news.",
      "Critical financial and political insights are often delayed, impacting timely decisions.",
    ],
    useCases: [
      "Investors and traders get instant updates on gold, silver, stocks, and Forex markets.",
      "Compare loan rates from various Nepali banks to make informed borrowing decisions.",
      "Receive daily verified news updates from The Kathmandu Post in Messenger.",
      "Financial advisors provide real-time guidance to clients using consolidated data.",
      "Students, professionals, and business owners track market trends and political news efficiently.",
    ],
  },
  {
    id: "telegram-integration",
    icon: TelegramIcon,
    iconColor: "text-sky-500 border-sky-500/20 bg-sky-500/5",
    badge: "Messaging Bot",
    title: "Telegram Chatbot Integration",
    shortDescription:
      "Smart Telegram bot for instant communication and automated customer support.",
    fullDescription:
      "Advanced Telegram bot integration with AI-powered responses, automated support, and seamless communication features for instant customer engagement.",
    workflowUrl: PAGES.TELEGRAM_URL,
    isInternalRoute: false,
    dateCreated: new Date("2025-12-22"),
    problems: [
      "Keeping track of gold, silver, stocks, and Forex prices in real-time is tedious.",
      "Manually checking loan rates from multiple Nepali banks is inefficient.",
      "Staying updated with reliable news from The Kathmandu Post requires browsing multiple sources.",
      "Investors and advisors lack a single platform that consolidates market data, bank loans, and news.",
      "Critical financial and political insights are often delayed, impacting timely decisions.",
    ],
    useCases: [
      "Investors and traders get instant updates on gold, silver, stocks, and Forex markets.",
      "Compare loan rates from various Nepali banks to make informed borrowing decisions.",
      "Receive daily verified news updates from The Kathmandu Post in Messenger.",
      "Financial advisors provide real-time guidance to clients using consolidated data.",
      "Students, professionals, and business owners track market trends and political news efficiently.",
    ],
  },
  {
    id: "gmail-application",
    icon: Mail,
    iconColor: "text-red-500 border-red-500/20 bg-red-500/5",
    badge: "Email Automation",
    title: "Job Application Email Organizer",
    shortDescription:
      "Automated Gmail filtering for job applications with intelligent categorization and response management. Simply send us an email to get started.",
    fullDescription:
      "Effortless email filtering for your applications. Simply send your emails and our system will automatically filter them based on your specific requirements. The system provides automatic categorization of job applications, intelligent filtering based on subject lines and content analysis, automated responses, and seamless integration with your hiring workflow.",
    isInternalRoute: true,
    dateCreated: new Date("2026-2-2"),
    problems: [
      "Manual sorting of hundreds of job applications consumes excessive HR time",
      "Important applications get buried in crowded inboxes and are missed",
      "Inconsistent response times to applicants create poor candidate experience",
      "Difficulty tracking application status across different email threads",
      "No standardized process for evaluating and categorizing incoming applications",
      "High risk of losing qualified candidates due to delayed email responses",
      "Lack of automated acknowledgment system for applicant inquiries",
    ],
    useCases: [
      "HR teams managing high-volume recruitment campaigns",
      "Companies filtering job applications from multiple job boards and channels",
      "Recruitment agencies handling client applications across various positions",
      "Organizations with career email addresses receiving constant application traffic",
      "Companies needing automated applicant communication and tracking systems",
      "Teams requiring integration between Gmail and applicant tracking systems",
      "Businesses seeking to improve response time and overall candidate experience",
      "Startups managing applications for full-time, part-time, and contract positions",
    ],
  },
  {
    id: "voice-agent",
    icon: Bot,
    iconColor: "text-purple-500 border-purple-500/20 bg-purple-500/5",
    badge: "AI Voice",
    title: "Rumsan AI Voice Agent",
    shortDescription:
      "Advanced AI voice assistant with embedded widget integration and natural conversation flow.",
    fullDescription:
      "Experience next-generation voice interactions with the AI assistant. Features advanced voice processing, contextual understanding, and seamless widget integration.",
    workflowUrl: "/voiceAgent",
    isInternalRoute: true,
    dateCreated: new Date("2025-12-26"),
    isHidden: true,
    steps: [
      {
        icon: Phone,
        title: "Start Voice Call",
        description: "Initiate a voice conversation with the AI agent.",
      },
      {
        icon: Mic,
        title: "Voice Recognition",
        description:
          "AI processes your speech in real-time with high accuracy.",
      },
      {
        icon: MessageCircle,
        title: "Intelligent Response",
        description:
          "Agent provides contextual responses through voice and text.",
      },
      {
        icon: FileText,
        title: "Conversation Transcript",
        description:
          "View complete conversation history with user and agent messages.",
      },
    ],
    problems: [
      "Complex services like AI, blockchain, and Web3 are hard to explain clearly through text alone.",
      "Manual handling of inquiries and scheduling leads to delays and limited availability.",
      "Clients across regions need 24/7 access to service information and support.",
      "Text-based communication creates accessibility and language barriers.",
      "Client conversations are not always recorded for follow-ups and insights.",
    ],
    useCases: [
      "Voice-Based Client Support: Natural conversations to explain Rumsan's services and products.",
      "Consultation & Demo Scheduling: Easy voice booking for consultations and demos of Rahat, eSatya, and Hamro LifeBank.",
      "Simplifying Technology Discussions: Clear voice explanations for AI, blockchain, and Web3 solutions.",
      "24/7 Virtual Org Agent: Always-on support for inquiries, scheduling, and service discovery.",
      "Conversation Records & Insights: Logged interactions for better follow-ups and continuous improvement.",
    ],
  },
  {
    id: "open-source-voice-agent",
    icon: Mic,
    iconColor: "text-green-500 border-green-500/20 bg-green-500/5",
    badge: "Open Source",
    title: "Open Source Voice Agent",
    shortDescription:
      "Free and open-source AI voice agent with full customization and self-hosting capabilities.",
    fullDescription:
      "Deploy your own AI voice agent with complete control. Built on open-source technologies, this solution offers full customization, privacy, and scalability for your voice automation needs.",
    workflowUrl: "/open-source-agent",
    isInternalRoute: true,
    dateCreated: new Date("2026-1-15"),
    problems: [
      "Proprietary voice solutions lock you into expensive vendor contracts",
      "Privacy concerns with third-party voice processing services",
      "Limited customization options in commercial voice platforms",
      "High costs for scaling voice automation across teams",
      "Lack of transparency in how voice data is processed and stored",
    ],
    useCases: [
      "Organizations requiring full data privacy and control",
      "Developers building custom voice experiences",
      "Companies wanting to avoid vendor lock-in",
      "Teams needing to integrate voice AI with existing systems",
      "Enterprises with compliance requirements for voice data handling",
      "Startups seeking cost-effective voice automation solutions",
    ],
  },
  {
    id: "community-tool",
    icon: Users,
    iconColor: "text-blue-500 border-blue-500/20 bg-blue-500/5",
    badge: "ML Pipeline",
    title: "Community Tool",
    shortDescription:
      "A comprehensive ML pipeline for cleaning, normalizing, and classifying data with automated header extraction and fuzzy matching.",
    fullDescription:
      "A comprehensive machine learning pipeline for cleaning, normalizing, and classifying data. It automates header extraction, fuzzy matching, and classification using Celery for asynchronous task management and PostgreSQL for persistent storage, delivering structured, high-confidence results ready for downstream applications.",
    workflowUrl: "/communityTool",
    isInternalRoute: true,
    dateCreated: new Date("2026-3-10"),
    problems: [
      "Manual data cleaning and standardization is time-consuming",
      "Inconsistent headers and duplicate entries across datasets",
      "Slow processing for large datasets without asynchronous handling",
      "Lack of structured outputs for downstream applications",
    ],
    useCases: [
      "Data Cleaning & Normalization: Preprocess messy CSV, JSON, or database inputs",
      "Header Extraction: Automatically detect and standardize column headers",
      "Fuzzy Matching: Match similar entries across datasets efficiently",
      "Classification: Assign categories using ML models with confidence scoring",
      "Asynchronous Task Handling: Process large datasets via Celery + Redis workers",
      "Persistent Storage: Save cleaned data, mappings, and confidence scores in PostgreSQL",
      "Downstream Integration: Export structured results for analytics, reporting, or other applications",
    ],
  },
  {
    id: "ai-quiz",
    icon: Brain,
    iconColor: "text-purple-500 border-purple-500/20 bg-purple-500/5",
    badge: "AI Quiz Platform",
    title: "AI Quiz Challenge",
    shortDescription:
      "Transform documents into interactive quizzes effortlessly. Upload content, generate summaries, and automatically create AI-powered quizzes.",
    fullDescription:
      "A FastAPI-based AI quiz platform with full document management. Upload, delete, or link files/drive URLs, then generate quizzes and questions automatically. Built with Redis, PostgreSQL, Qdrant, and Alembic, it delivers fast, scalable, and reliable operations for AI-driven quiz creation and management. Transform documents into interactive quizzes effortlessly, making learning and assessment seamless and multilingual-ready.",
    workflowUrl: "/ai-quiz",
    isInternalRoute: true,
    dateCreated: new Date("2026-3-15"),
    problems: [
      "Manual quiz creation from documents is slow and error-prone",
      "Managing documents and quiz content separately is inefficient",
      "Retrieving and generating relevant questions quickly at scale can be difficult",
      "Schema changes risk breaking production workflows",
    ],
    useCases: [
      "Document Management: Upload, delete, or link files/drive URLs for quiz content",
      "AI-Powered Quiz & Question Generation: Automatically create quizzes and questions from documents",
      "High-Speed Access: Redis caching for fast retrieval and response times",
      "Persistent Storage: PostgreSQL stores quizzes, questions, and document metadata",
      "Semantic Search & Recommendations: Qdrant enables smart question selection and content understanding",
      "Database Migrations: Alembic ensures smooth schema updates and version control",
      "Content-based quizzes, automated learning assessments, semantic question generation, and multilingual support",
    ],
  },
  {
    id: "vox-flow",
    icon: Phone,
    iconColor: "text-indigo-500 border-indigo-500/20 bg-indigo-500/5",
    badge: "Voice Flow",
    title: "VoxFlow",
    status: "operational",
    shortDescription:
      "Generate, transcribe, and transform audio across languages. Upload your audio and instantly convert it into any language.",
    fullDescription:
      "Voxflow is a modern web app that lets you generate, transcribe, and transform audio across languages. Upload your audio and instantly convert it into any language, creating seamless multilingual audio experiences with a scalable, responsive, and developer-friendly interface.",
    workflowUrl: "/voxFlow",
    isInternalRoute: true,
    dateCreated: new Date("2026-3-25"),
    problems: [
      "Language Barriers: Makes audio understandable across different languages",
      "Manual Transcription & Translation Effort: Automates both processes efficiently",
      "Multiple Tool Dependency: Combines generation, transcription, and translation in one platform",
      "Inconsistent UI Development: Uses reusable components for faster, consistent design",
      "Device Compatibility Issues: Ensures a fully responsive experience across all devices",
    ],
    useCases: [
      "Content Creation: Generate multilingual voiceovers for videos, podcasts, and social media",
      "Global Communication: Translate and adapt audio for international audiences",
      "Meeting & Lecture Transcription: Convert spoken content into text for notes and documentation",
      "Customer Support: Translate and transcribe voice interactions for better service",
      "Accessibility: Provide speech-to-text and multilingual audio for inclusive experiences",
    ],
  },
];

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useChat } from "@/contexts/ChatContext";
import { Send, Loader2, Bot, User } from "lucide-react";

const hindiKeywords = ["नमस्ते", "कैसे", "क्या", "मदद", "विश्वविद्यालय", "पंजीकरण", "परीक्षा", "पुस्तकालय", "कक्षा", "शुल्क", "छात्रावास", "प्लेसमेंट", "परिणाम", "समय"];
const tamilKeywords = ["வணக்கம்", "எப்படி", "என்ன", "உதவி", "பல்கலைக்கழகம்", "பதிவு", "தேர்வு", "நூலகம்", "வகுப்பு", "கட்டணம்", "விடுதி", "வேலை", "முடிவு"];
const teluguKeywords = ["నమస్కారం", "ఎలా", "ఏమి", "సహాయం", "విశ్వవిద్యాలయం", "పరీక్ష", "రిజిస్ట్రేషన్", "ఫీజు", "హాస్టల్", "ప్లేస్‌మెంట్", "ఫలితాలు"];

function detectLanguage(text: string): string {
  if (hindiKeywords.some((kw) => text.includes(kw))) return "hi";
  if (tamilKeywords.some((kw) => text.includes(kw))) return "ta";
  if (teluguKeywords.some((kw) => text.includes(kw))) return "te";
  return "en";
}

interface IntentResponse {
  keywords: string[];
  responses: Record<string, string[]>;
}

const intents: Record<string, IntentResponse> = {
  exam: {
    keywords: ["exam", "examination", "test", "midterm", "final", "paper", "परीक्षा", "तேர்வு", "పరీక్ష"],
    responses: {
      en: [
        "📝 **Examination Schedule:**\n\nMid-semester exams are scheduled for **March 10–15, 2026**. Final exams begin **May 5, 2026**.\n\n• Exam hall tickets are available on the student portal under *Academics > Examinations*\n• Carry your university ID card to every exam\n• Results are typically published within 2 weeks on the portal",
      ],
      hi: ["📝 **परीक्षा अनुसूची:**\n\nमध्य-सत्र परीक्षाएँ **10–15 मार्च, 2026** को निर्धारित हैं। अंतिम परीक्षाएँ **5 मई, 2026** से शुरू होंगी।\n\n• परीक्षा हॉल टिकट छात्र पोर्टल पर 'शिक्षाविद > परीक्षाएँ' में उपलब्ध हैं\n• प्रत्येक परीक्षा में अपना विश्वविद्यालय पहचान पत्र लाएं"],
      ta: ["📝 **தேர்வு அட்டவணை:**\n\nஅரையாண்டு தேர்வுகள் **மார்ச் 10–15, 2026** தேதியில் திட்டமிடப்பட்டுள்ளன. இறுதித் தேர்வுகள் **மே 5, 2026** தொடங்கும்.\n\n• தேர்வு ஹால் டிக்கெட்டுகள் மாணவர் போர்ட்டலில் கிடைக்கும்"],
      te: ["📝 **పరీక్ష షెడ్యూల్:**\n\nమధ్య-సెమిస్టర్ పరీక్షలు **మార్చి 10–15, 2026**కి నిర్ణయించబడ్డాయి. చివరి పరీక్షలు **మే 5, 2026** నుండి ప్రారంభమవుతాయి."],
    },
  },
  timetable: {
    keywords: ["timetable", "schedule", "class", "timing", "lecture", "slot", "समय", "कक्षा", "வகுப்பு", "సమయం"],
    responses: {
      en: [
        "🕐 **Class Timetable:**\n\nYour personalized timetable is available on the student portal under *Academics > Timetable*.\n\n• Morning sessions: **8:30 AM – 12:30 PM**\n• Afternoon sessions: **1:30 PM – 4:30 PM**\n• Lab sessions: **2:00 PM – 5:00 PM** (as per department schedule)\n\nFor timetable conflicts, contact your department coordinator.",
      ],
      hi: ["🕐 **कक्षा समय-सारणी:**\n\nआपकी व्यक्तिगत समय-सारणी छात्र पोर्टल पर 'शिक्षाविद > समय-सारणी' में उपलब्ध है।\n\n• सुबह सत्र: **8:30 AM – 12:30 PM**\n• दोपहर सत्र: **1:30 PM – 4:30 PM**"],
      ta: ["🕐 **வகுப்பு நேர அட்டவணை:**\n\nஉங்கள் தனிப்பயனாக்கப்பட்ட நேர அட்டவணை மாணவர் போர்ட்டலில் கிடைக்கும்.\n\n• காலை: **8:30 AM – 12:30 PM**\n• பிற்பகல்: **1:30 PM – 4:30 PM**"],
      te: ["🕐 **తరగతి టైమ్‌టేబుల్:**\n\nమీ వ్యక్తిగత టైమ్‌టేబుల్ స్టూడెంట్ పోర్టల్‌లో అందుబాటులో ఉంది.\n\n• ఉదయం: **8:30 AM – 12:30 PM**\n• మధ్యాహ్నం: **1:30 PM – 4:30 PM**"],
    },
  },
  fees: {
    keywords: ["fee", "fees", "payment", "tuition", "scholarship", "शुल्क", "भुगतान", "கட்டணம்", "ఫీజు", "pay", "cost"],
    responses: {
      en: [
        "💰 **Fee Information:**\n\n• Tuition fee for the current semester: **₹45,000**\n• Hostel fee: **₹25,000/semester**\n• Library & lab fee: **₹5,000**\n\n**Payment deadline:** March 31, 2026\n\nPay online via the student portal under *Finance > Fee Payment*. For scholarship queries, visit the Financial Aid office (Block A, Room 201) or email scholarships@university.edu",
      ],
      hi: ["💰 **शुल्क जानकारी:**\n\n• इस सेमेस्टर का ट्यूशन शुल्क: **₹45,000**\n• छात्रावास शुल्क: **₹25,000/सेमेस्टर**\n• पुस्तकालय और प्रयोगशाला शुल्क: **₹5,000**\n\n**भुगतान की अंतिम तिथि:** 31 मार्च, 2026"],
      ta: ["💰 **கட்டண தகவல்:**\n\n• தற்போதைய செமஸ்டர் கல்விக் கட்டணம்: **₹45,000**\n• விடுதி கட்டணம்: **₹25,000/செமஸ்டர்**\n\n**செலுத்த வேண்டிய கடைசி தேதி:** மார்ச் 31, 2026"],
      te: ["💰 **ఫీజు సమాచారం:**\n\n• ప్రస్తుత సెమిస్టర్ ట్యూషన్ ఫీజు: **₹45,000**\n• హాస్టల్ ఫీజు: **₹25,000/సెమిస్టర్**\n\n**చెల్లింపు గడువు:** మార్చి 31, 2026"],
    },
  },
  hostel: {
    keywords: ["hostel", "dorm", "room", "accommodation", "mess", "छात्रावास", "कमरा", "விடுதி", "హాస్టల్"],
    responses: {
      en: [
        "🏠 **Hostel Information:**\n\n• Applications for hostel allotment are open until **March 20, 2026**\n• Room types: Single (₹30,000/sem), Double (₹25,000/sem), Triple (₹18,000/sem)\n• Mess timings: Breakfast 7–9 AM, Lunch 12–2 PM, Dinner 7–9 PM\n\nApply through *Student Portal > Hostel > New Application*. For maintenance issues, raise a ticket on the portal or contact the hostel warden.",
      ],
      hi: ["🏠 **छात्रावास जानकारी:**\n\n• छात्रावास आवंटन के लिए आवेदन **20 मार्च, 2026** तक खुले हैं\n• कमरे के प्रकार: सिंगल (₹30,000/सेम), डबल (₹25,000/सेम), ट्रिपल (₹18,000/सेम)\n• भोजनालय समय: नाश्ता 7–9 AM, दोपहर का भोजन 12–2 PM, रात का भोजन 7–9 PM"],
      ta: ["🏠 **விடுதி தகவல்:**\n\n• விடுதி ஒதுக்கீட்டிற்கான விண்ணப்பங்கள் **மார்ச் 20, 2026** வரை திறந்துள்ளன\n• அறை வகைகள்: ஒற்றை (₹30,000/செம்), இரட்டை (₹25,000/செம்)"],
      te: ["🏠 **హాస్టల్ సమాచారం:**\n\n• హాస్టల్ కేటాయింపు కోసం దరఖాస్తులు **మార్చి 20, 2026** వరకు తెరిచి ఉన్నాయి\n• గది రకాలు: సింగిల్ (₹30,000/సెమ్), డబుల్ (₹25,000/సెమ్)"],
    },
  },
  placement: {
    keywords: ["placement", "job", "recruit", "company", "career", "internship", "प्लेसमेंट", "नौकरी", "வேலை", "ప్లేస్‌మెంట్"],
    responses: {
      en: [
        "💼 **Placement & Career Services:**\n\n• Placement season begins **August 2026** for final-year students\n• Companies visiting this year: TCS, Infosys, Wipro, Google, Amazon, and 50+ more\n• Average package (last year): **₹8.5 LPA** | Highest: **₹42 LPA**\n\nRegister on the placement portal and upload your updated resume by **July 15, 2026**. Pre-placement workshops start from June.",
      ],
      hi: ["💼 **प्लेसमेंट और करियर सेवाएं:**\n\n• अंतिम वर्ष के छात्रों के लिए प्लेसमेंट सीज़न **अगस्त 2026** से शुरू होगा\n• इस वर्ष आने वाली कंपनियाँ: TCS, Infosys, Wipro, Google, Amazon और 50+ अन्य\n• औसत पैकेज (पिछले वर्ष): **₹8.5 LPA**"],
      ta: ["💼 **வேலை வாய்ப்பு சேவைகள்:**\n\n• இறுதி ஆண்டு மாணவர்களுக்கு வேலைவாய்ப்பு சீசன் **ஆகஸ்ட் 2026** இல் தொடங்கும்\n• சராசரி பேக்கேஜ்: **₹8.5 LPA**"],
      te: ["💼 **ప్లేస్‌మెంట్ & కెరీర్ సేవలు:**\n\n• ఫైనల్ ఇయర్ విద్యార్థులకు ప్లేస్‌మెంట్ సీజన్ **ఆగస్ట్ 2026** నుండి ప్రారంభమవుతుంది\n• సగటు ప్యాకేజీ: **₹8.5 LPA**"],
    },
  },
  results: {
    keywords: ["result", "grade", "marks", "cgpa", "sgpa", "score", "परिणाम", "अंक", "முடிவு", "ఫలితాలు"],
    responses: {
      en: [
        "📊 **Results & Grades:**\n\n• Mid-semester results are published within **2 weeks** of the exam\n• Check results on *Student Portal > Academics > Results*\n• For re-evaluation requests, apply within **7 days** of result publication\n• Re-evaluation fee: **₹500 per subject**\n\nCurrent CGPA and semester-wise grades are available on your academic transcript page.",
      ],
      hi: ["📊 **परिणाम और ग्रेड:**\n\n• मध्य-सत्र परिणाम परीक्षा के **2 सप्ताह** के भीतर प्रकाशित किए जाते हैं\n• छात्र पोर्टल पर 'शिक्षाविद > परिणाम' में परिणाम देखें\n• पुनर्मूल्यांकन के लिए परिणाम प्रकाशन के **7 दिनों** के भीतर आवेदन करें"],
      ta: ["📊 **முடிவுகள் & மதிப்பெண்கள்:**\n\n• அரையாண்டு முடிவுகள் தேர்வுக்குப் பிறகு **2 வாரங்களுக்குள்** வெளியிடப்படும்\n• மறு மதிப்பீட்டிற்கு முடிவு வெளியான **7 நாட்களுக்குள்** விண்ணப்பிக்கவும்"],
      te: ["📊 **ఫలితాలు & గ్రేడ్‌లు:**\n\n• మధ్య-సెమిస్టర్ ఫలితాలు పరీక్ష తర్వాత **2 వారాల్లో** ప్రచురించబడతాయి\n• రీ-ఎవాల్యుయేషన్ కోసం ఫలితం ప్రచురణ **7 రోజుల్లో** దరఖాస్తు చేయండి"],
    },
  },
  library: {
    keywords: ["library", "book", "borrow", "return", "पुस्तकालय", "किताब", "நூலகம்", "లైబ్రరీ"],
    responses: {
      en: [
        "📚 **Library Services:**\n\n• **Hours:** Mon–Fri 8 AM – 9 PM, Sat 9 AM – 5 PM (Extended during exams: until 11 PM)\n• Max books per student: **5** for 14 days\n• Fine for late return: **₹5/day** per book\n• Digital library access: Available 24/7 via student portal\n\nFor research journals and IEEE papers, use the e-library portal with your student credentials.",
      ],
      hi: ["📚 **पुस्तकालय सेवाएं:**\n\n• **समय:** सोम–शुक्र 8 AM – 9 PM, शनि 9 AM – 5 PM\n• प्रति छात्र अधिकतम पुस्तकें: **5** (14 दिनों के लिए)\n• देर से वापसी के लिए जुर्माना: **₹5/दिन** प्रति पुस्तक"],
      ta: ["📚 **நூலக சேவைகள்:**\n\n• **நேரம்:** திங்கள்–வெள்ளி 8 AM – 9 PM, சனி 9 AM – 5 PM\n• ஒரு மாணவருக்கு அதிகபட்ச புத்தகங்கள்: **5** (14 நாட்கள்)"],
      te: ["📚 **లైబ్రరీ సేవలు:**\n\n• **సమయాలు:** సోమ–శుక్ర 8 AM – 9 PM, శని 9 AM – 5 PM\n• విద్యార్థికి గరిష్ట పుస్తకాలు: **5** (14 రోజులు)"],
    },
  },
  registration: {
    keywords: ["register", "registration", "enroll", "semester", "पंजीकरण", "பதிவு", "రిజిస్ట్రేషన్"],
    responses: {
      en: [
        "📋 **Semester Registration:**\n\n• Registration for the upcoming semester is open until **March 15, 2026**\n• Steps: Login to Student Portal → Academics → Course Registration → Select Courses → Confirm\n• Ensure all prerequisite courses are cleared before registering for advanced courses\n• Contact your academic advisor for course recommendations\n\nLate registration (with penalty): March 16–20, 2026 (₹500 late fee)",
      ],
      hi: ["📋 **सेमेस्टर पंजीकरण:**\n\n• आगामी सेमेस्टर के लिए पंजीकरण **15 मार्च, 2026** तक खुला है\n• कृपया छात्र पोर्टल पर लॉगिन करें → शिक्षाविद → पाठ्यक्रम पंजीकरण\n• देर से पंजीकरण: 16–20 मार्च (₹500 विलंब शुल्क)"],
      ta: ["📋 **செமஸ்டர் பதிவு:**\n\n• வரவிருக்கும் செமஸ்டருக்கான பதிவு **மார்ச் 15, 2026** வரை திறந்துள்ளது\n• தாமதமான பதிவு: மார்ச் 16–20 (₹500 தாமத கட்டணம்)"],
      te: ["📋 **సెమిస్టర్ రిజిస్ట్రేషన్:**\n\n• రాబోయే సెమిస్టర్ కోసం రిజిస్ట్రేషన్ **మార్చి 15, 2026** వరకు తెరిచి ఉంది\n• ఆలస్య రిజిస్ట్రేషన్: మార్చి 16–20 (₹500 ఆలస్య ఫీజు)"],
    },
  },
  greeting: {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "help", "नमस्ते", "வணக்கம்", "నమస్కారం"],
    responses: {
      en: [
        "👋 Hello! I'm your university assistant. I can help you with:\n\n• 📝 **Exams** – schedules, hall tickets, results\n• 🕐 **Timetable** – class timings, lab sessions\n• 💰 **Fees** – payments, scholarships\n• 🏠 **Hostel** – allotment, mess timings\n• 💼 **Placements** – career services, companies\n• 📊 **Results** – grades, re-evaluation\n• 📚 **Library** – hours, borrowing\n• 📋 **Registration** – course enrollment\n\nJust type your question!",
      ],
      hi: ["👋 नमस्ते! मैं आपका विश्वविद्यालय सहायक हूँ। मैं आपकी मदद कर सकता हूँ:\n\n• 📝 **परीक्षा** – अनुसूची, हॉल टिकट, परिणाम\n• 🕐 **समय-सारणी** – कक्षा का समय\n• 💰 **शुल्क** – भुगतान, छात्रवृत्ति\n• 🏠 **छात्रावास** – आवंटन, भोजनालय\n• 💼 **प्लेसमेंट** – करियर सेवाएं\n\nबस अपना प्रश्न पूछें!"],
      ta: ["👋 வணக்கம்! நான் உங்கள் பல்கலைக்கழக உதவியாளர். நான் உதவ முடியும்:\n\n• 📝 **தேர்வுகள்**\n• 🕐 **நேர அட்டவணை**\n• 💰 **கட்டணங்கள்**\n• 🏠 **விடுதி**\n• 💼 **வேலை வாய்ப்புகள்**\n\nஉங்கள் கேள்வியைத் தட்டச்சு செய்யுங்கள்!"],
      te: ["👋 నమస్కారం! నేను మీ యూనివర్సిటీ అసిస్టెంట్. నేను సహాయం చేయగలను:\n\n• 📝 **పరీక్షలు**\n• 🕐 **టైమ్‌టేబుల్**\n• 💰 **ఫీజులు**\n• 🏠 **హాస్టల్**\n• 💼 **ప్లేస్‌మెంట్స్**\n\nమీ ప్రశ్నను టైప్ చేయండి!"],
    },
  },
};

const fallbackResponses: Record<string, string[]> = {
  en: [
    "I appreciate your question. Could you provide more details? I can help with **exams, timetable, fees, hostel, placements, results, library, or registration**.",
    "I'm not sure I understood that completely. Try asking about specific topics like exams, fees, hostel, placements, or registration.",
  ],
  hi: ["कृपया अधिक विवरण दें। मैं **परीक्षा, समय-सारणी, शुल्क, छात्रावास, प्लेसमेंट, परिणाम** के बारे में मदद कर सकता हूँ।"],
  ta: ["தயவுசெய்து மேலும் விவரங்களை வழங்கவும். **தேர்வுகள், கட்டணங்கள், விடுதி, வேலை வாய்ப்புகள்** பற்றி உதவ முடியும்."],
  te: ["దయచేసి మరింత వివరాలు అందించండి. **పరీక్షలు, ఫీజులు, హాస్టల్, ప్లేస్‌మెంట్స్** గురించి సహాయం చేయగలను."],
};

function matchIntent(text: string): { intent: string; lang: string } {
  const lang = detectLanguage(text);
  const lower = text.toLowerCase();
  for (const [intentName, intent] of Object.entries(intents)) {
    if (intent.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return { intent: intentName, lang };
    }
  }
  return { intent: "fallback", lang };
}

function getResponse(intent: string, lang: string): string {
  if (intent === "fallback") {
    const responses = fallbackResponses[lang] || fallbackResponses.en;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  const intentData = intents[intent];
  if (!intentData) {
    const responses = fallbackResponses[lang] || fallbackResponses.en;
    return responses[0];
  }
  const responses = intentData.responses[lang] || intentData.responses.en;
  return responses[Math.floor(Math.random() * responses.length)];
}

const langNames: Record<string, string> = { en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu" };

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const ChatView = () => {
  const { t } = useTranslation();
  const { activeThreadId, createThread, addMessage, getActiveThread } = useChat();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentThread = getActiveThread();

  useEffect(() => {
    if (!activeThreadId) {
      const id = createThread();
      addMessage(id, { text: t("chatWelcome"), sender: "bot", detectedLang: "en" });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentThread?.messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const threadId = activeThreadId || createThread();
    const { intent, lang } = matchIntent(input);
    setDetectedLang(lang);

    addMessage(threadId, { text: input, sender: "user", detectedLang: lang });
    setInput("");
    setIsLoading(true);

    const delay = 2000 + Math.random() * 2000;
    setTimeout(() => {
      const response = getResponse(intent, lang);
      addMessage(threadId, { text: response, sender: "bot", detectedLang: lang });
      setIsLoading(false);
    }, delay);
  };

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-sm">{t("chat")}</h2>
            <p className="text-xs text-muted-foreground">{isLoading ? "Typing..." : "Online"}</p>
          </div>
        </div>
        {detectedLang && (
          <span className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-md font-medium">
            {t("detected")}: {langNames[detectedLang]}
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {currentThread?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div className="max-w-[70%]">
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-accent text-accent-foreground rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
              <p className={`text-[10px] text-muted-foreground mt-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
            {msg.sender === "user" && (
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-accent text-accent-foreground rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {currentThread && currentThread.messages.length <= 1 && (
        <div className="px-6 pb-2 flex flex-wrap gap-2">
          {["Exam schedule", "Fee details", "Hostel info", "Placements"].map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              className="text-xs border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border bg-background p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("typeMessage")}
            className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center justify-center rounded-full bg-primary w-10 h-10 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

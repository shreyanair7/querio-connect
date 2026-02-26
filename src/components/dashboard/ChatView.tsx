import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useChat } from "@/contexts/ChatContext";
import { Send, Loader2 } from "lucide-react";

const hindiKeywords = ["नमस्ते", "कैसे", "क्या", "मदद", "विश्वविद्यालय", "पंजीकरण", "परीक्षा", "पुस्तकालय", "कक्षा", "शुल्क"];
const tamilKeywords = ["வணக்கம்", "எப்படி", "என்ன", "உதவி", "பல்கலைக்கழகம்", "பதிவு", "தேர்வு", "நூலகம்", "வகுப்பு"];
const teluguKeywords = ["నమస్కారం", "ఎలా", "ఏమి", "సహాయం", "విశ్వవిద్యాలయం", "పరీక్ష", "రిజిస్ట్రేషన్"];

const botResponses: Record<string, string[]> = {
  en: [
    "Thank you for your question. The semester registration deadline is March 15, 2026. Please visit the student portal to register.",
    "The university library is open from 8 AM to 9 PM on weekdays. Extended hours are available during exam season.",
    "You can find the exam schedule on the university portal under 'Academics > Examinations'. Results are typically published within 2 weeks.",
    "For fee-related queries, please contact the accounts department at accounts@university.edu or visit Block B, Room 102.",
    "Campus Wi-Fi credentials are the same as your student portal login. If you're having trouble connecting, contact IT support.",
  ],
  hi: [
    "आपके प्रश्न के लिए धन्यवाद। सेमेस्टर पंजीकरण की अंतिम तिथि 15 मार्च, 2026 है। कृपया छात्र पोर्टल पर जाएं।",
    "विश्वविद्यालय पुस्तकालय सप्ताह के दिनों में सुबह 8 बजे से रात 9 बजे तक खुला रहता है।",
    "परीक्षा अनुसूची छात्र पोर्टल पर 'शिक्षाविद > परीक्षाएँ' के अंतर्गत उपलब्ध है।",
    "शुल्क संबंधी प्रश्नों के लिए, कृपया लेखा विभाग से संपर्क करें।",
  ],
  ta: [
    "உங்கள் கேள்விக்கு நன்றி. செமஸ்டர் பதிவு காலக்கெடு மார்ச் 15, 2026 ஆகும்.",
    "பல்கலைக்கழக நூலகம் வாரநாட்களில் காலை 8 மணி முதல் இரவு 9 மணி வரை திறந்திருக்கும்.",
    "தேர்வு அட்டவணையை மாணவர் போர்ட்டலில் காணலாம்.",
  ],
  te: [
    "మీ ప్రశ్నకు ధన్యవాదాలు. సెమిస్టర్ రిజిస్ట్రేషన్ గడువు మార్చి 15, 2026.",
    "విశ్వవిద్యాలయ లైబ్రరీ వారంలో ఉదయం 8 నుండి రాత్రి 9 వరకు తెరిచి ఉంటుంది.",
  ],
};

function detectLanguage(text: string): string {
  if (hindiKeywords.some((kw) => text.includes(kw))) return "hi";
  if (tamilKeywords.some((kw) => text.includes(kw))) return "ta";
  if (teluguKeywords.some((kw) => text.includes(kw))) return "te";
  return "en";
}

const langNames: Record<string, string> = { en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu" };

export const ChatView = () => {
  const { t } = useTranslation();
  const { threads, activeThreadId, createThread, addMessage, getActiveThread } = useChat();
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
    const lang = detectLanguage(input);
    setDetectedLang(lang);

    addMessage(threadId, { text: input, sender: "user", detectedLang: lang });
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const responses = botResponses[lang] || botResponses.en;
      const response = responses[Math.floor(Math.random() * responses.length)];
      addMessage(threadId, { text: response, sender: "bot", detectedLang: lang });
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">{t("chat")}</h2>
        {detectedLang && (
          <span className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-md font-medium">
            {t("detected")}: {langNames[detectedLang]}
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {currentThread?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-accent text-accent-foreground rounded-lg px-4 py-2.5">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("typeMessage")}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

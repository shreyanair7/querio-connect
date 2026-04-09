import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react";

export const FAQView = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const faqs = [
    { qKey: "faq1Q", aKey: "faq1A", category: "Account" },
    { qKey: "faq2Q", aKey: "faq2A", category: "Chat" },
    { qKey: "faq3Q", aKey: "faq3A", category: "Notices" },
    { qKey: "faq4Q", aKey: "faq4A", category: "Feedback" },
    { qKey: "faq5Q", aKey: "faq5A", category: "Chat" },
    { qKey: "faq6Q", aKey: "faq6A", category: "Exams" },
    { qKey: "faq7Q", aKey: "faq7A", category: "Fees" },
    { qKey: "faq8Q", aKey: "faq8A", category: "Hostel" },
  ];

  const filtered = faqs.filter((faq) => {
    if (!search) return true;
    const q = t(faq.qKey).toLowerCase();
    const a = t(faq.aKey).toLowerCase();
    return q.includes(search.toLowerCase()) || a.includes(search.toLowerCase());
  });

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-semibold text-foreground">{t("faqTitle")}</h2>
        <LanguageSelector />
      </div>
      <p className="text-sm text-muted-foreground mb-6">Find answers to common university queries</p>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No matching questions found.</p>
        )}
        {filtered.map((faq) => (
          <div
            key={faq.qKey}
            className="rounded-lg border border-border bg-card overflow-hidden hover:border-primary/20 transition-colors"
          >
            <button
              onClick={() => setExpanded(expanded === faq.qKey ? null : faq.qKey)}
              className="w-full flex items-center justify-between p-4 text-left gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-foreground block">{t(faq.qKey)}</span>
                  <span className="text-[10px] text-muted-foreground">{faq.category}</span>
                </div>
              </div>
              {expanded === faq.qKey ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>
            {expanded === faq.qKey && (
              <div className="px-4 pb-4 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed pt-3 pl-7">{t(faq.aKey)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ChevronDown, ChevronUp } from "lucide-react";

export const FAQView = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);

  const faqs = [
    { qKey: "faq1Q", aKey: "faq1A" },
    { qKey: "faq2Q", aKey: "faq2A" },
    { qKey: "faq3Q", aKey: "faq3A" },
    { qKey: "faq4Q", aKey: "faq4A" },
    { qKey: "faq5Q", aKey: "faq5A" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">{t("faqTitle")}</h2>
        <LanguageSelector />
      </div>
      <div className="space-y-2">
        {faqs.map((faq) => (
          <div
            key={faq.qKey}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === faq.qKey ? null : faq.qKey)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-medium text-sm text-foreground pr-4">{t(faq.qKey)}</span>
              {expanded === faq.qKey ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>
            {expanded === faq.qKey && (
              <div className="px-4 pb-4 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed pt-3">{t(faq.aKey)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

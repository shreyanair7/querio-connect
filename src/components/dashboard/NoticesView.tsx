import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ChevronDown, ChevronUp } from "lucide-react";

const noticeDates = ["March 1, 2026", "February 28, 2026", "February 25, 2026", "February 20, 2026"];

export const NoticesView = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);

  const notices = [
    { titleKey: "notice1Title", descKey: "notice1Desc", detailKey: "notice1Detail", date: noticeDates[0] },
    { titleKey: "notice2Title", descKey: "notice2Desc", detailKey: "notice2Detail", date: noticeDates[1] },
    { titleKey: "notice3Title", descKey: "notice3Desc", detailKey: "notice3Detail", date: noticeDates[2] },
    { titleKey: "notice4Title", descKey: "notice4Desc", detailKey: "notice4Detail", date: noticeDates[3] },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">{t("noticesTitle")}</h2>
        <LanguageSelector />
      </div>
      <div className="space-y-3">
        {notices.map((notice) => (
          <div
            key={notice.titleKey}
            className="rounded-lg border border-border bg-card shadow-card overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === notice.titleKey ? null : notice.titleKey)}
              className="w-full flex items-start justify-between p-4 text-left"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">{t(notice.titleKey)}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t(notice.descKey)}</p>
                <p className="text-xs text-muted-foreground mt-2">{notice.date}</p>
              </div>
              {expanded === notice.titleKey ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              )}
            </button>
            {expanded === notice.titleKey && (
              <div className="px-4 pb-4 pt-0 border-t border-border">
                <p className="text-sm text-foreground leading-relaxed pt-3">{t(notice.detailKey)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

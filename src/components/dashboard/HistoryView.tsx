import { useTranslation } from "@/hooks/useTranslation";
import { useChat } from "@/contexts/ChatContext";
import { MessageSquare } from "lucide-react";

export const HistoryView = ({ onOpenChat }: { onOpenChat: () => void }) => {
  const { t } = useTranslation();
  const { threads, setActiveThread } = useChat();

  const handleOpenThread = (id: string) => {
    setActiveThread(id);
    onOpenChat();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">{t("chatHistory")}</h2>
      {threads.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("noHistory")}</p>
      ) : (
        <div className="space-y-2">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => handleOpenThread(thread.id)}
              className="w-full flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left hover:shadow-card-hover transition-shadow"
            >
              <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{thread.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {thread.messages.length} messages · {thread.createdAt.toLocaleDateString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

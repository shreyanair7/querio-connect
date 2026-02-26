import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Clock, Bell, HelpCircle, Star, LogOut } from "lucide-react";
import { ChatView } from "@/components/dashboard/ChatView";
import { HistoryView } from "@/components/dashboard/HistoryView";
import { NoticesView } from "@/components/dashboard/NoticesView";
import { FAQView } from "@/components/dashboard/FAQView";
import { FeedbackView } from "@/components/dashboard/FeedbackView";
import { WelcomeView } from "@/components/dashboard/WelcomeView";
import { LanguageSelector } from "@/components/LanguageSelector";

type DashboardView = "welcome" | "chat" | "history" | "notices" | "faq" | "feedback";

const Dashboard = () => {
  const { t } = useTranslation();
  const { logout, userEmail } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<DashboardView>("welcome");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems: { key: DashboardView; icon: typeof MessageSquare; labelKey: string }[] = [
    { key: "chat", icon: MessageSquare, labelKey: "chat" },
    { key: "history", icon: Clock, labelKey: "history" },
    { key: "notices", icon: Bell, labelKey: "notices" },
    { key: "faq", icon: HelpCircle, labelKey: "faq" },
    { key: "feedback", icon: Star, labelKey: "feedback" },
  ];

  const viewMap: Record<DashboardView, React.ReactNode> = {
    welcome: <WelcomeView onStartChat={() => setActiveView("chat")} />,
    chat: <ChatView />,
    history: <HistoryView onOpenChat={() => setActiveView("chat")} />,
    notices: <NoticesView />,
    faq: <FAQView />,
    feedback: <FeedbackView />,
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-60 bg-primary text-primary-foreground flex flex-col shrink-0">
        <div className="p-5 border-b border-primary-foreground/10">
          <h1 className="text-lg font-bold">Querio</h1>
          <p className="text-xs opacity-60 mt-1 truncate">{userEmail}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveView(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeView === item.key
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-primary-foreground/70 hover:bg-sidebar-accent/50 hover:text-primary-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {t(item.labelKey)}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-primary-foreground/10 space-y-2">
          <LanguageSelector className="w-full bg-sidebar-accent border-sidebar-border text-primary-foreground" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-primary-foreground/70 hover:bg-sidebar-accent/50 hover:text-primary-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t("logout")}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="animate-fade-in h-full">
          {viewMap[activeView]}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

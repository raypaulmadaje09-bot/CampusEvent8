import React, { useState, useMemo, useEffect } from "react";
import Navbar from "./components/Navbar";
import Filters from "./components/Filters";
import EventCard from "./components/EventCard";
import EventModal from "./components/EventModal";
import CalendarView from "./components/CalendarView";
import AdminDashboard from "./components/AdminDashboard";
import FeedbackModal from "./components/FeedbackModal";
import StudentSupport from "./components/StudentSupport";
import EventRequestModal from "./components/EventRequestModal";
import Footer from "./components/Footer";
import { mockEvents as initialMockEvents } from "./data/mockEvents";
import { CampusEvent, FeedbackMessage, User, AuditLog } from "./types";
import { Sparkles, TrendingUp, Clock, LayoutGrid, Calendar as CalendarIcon, MessageSquare } from "lucide-react";
import { cn } from "./utils/cn";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginModal from "./components/LoginModal";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "/api";

/* ================= CAMPUS APP ================= */

const CampusApp: React.FC = () => {
  const { user, isAdmin, logout, refreshUser } = useAuth();

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("calendar");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isEventRequestModalOpen, setIsEventRequestModalOpen] = useState(false);
  const [isStudentSupportOpen, setIsStudentSupportOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("cp_categories");
    return saved
      ? JSON.parse(saved)
      : ["Academic", "Social", "Sports", "Workshops", "Career", "Arts", "Tech"];
  });

  const [events, setEvents] = useState<CampusEvent[]>(() => {
    const saved = localStorage.getItem("cp_events");
    return saved ? JSON.parse(saved) : initialMockEvents;
  });

  const [messages, setMessages] = useState<FeedbackMessage[]>(() => {
    const saved = localStorage.getItem("cp_messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [usersList, setUsersList] = useState<User[]>(() => {
    const saved = localStorage.getItem("authorized_nodes");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "u1",
            name: "Master Admin",
            email: "master@campus.edu",
            password: "master",
            role: "MasterAdmin",
            avatar: "https://i.pravatar.cc/150?u=master",
          },
        ];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [homeConfig, setHomeConfig] = useState(() => {
    const saved = localStorage.getItem("cp_config");
    return saved || {
      heroHeadline: "Your Campus. All in One Place.",
      heroSubheadline:
        "Discover workshops, events, and campus activities easily.",
      heroImage:
        "https://images.unsplash.com/photo-1541339907198-e08756ebafe3",
      campusName: "CampusPulse",
    };
  });

  /* ================= SAVE LOCAL STORAGE ================= */

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("cp_events", JSON.stringify(events));
    localStorage.setItem("cp_messages", JSON.stringify(messages));
    localStorage.setItem("cp_categories", JSON.stringify(categories));
    localStorage.setItem("cp_config", JSON.stringify(homeConfig));
    localStorage.setItem("authorized_nodes", JSON.stringify(usersList));
  }, [events, messages, categories, homeConfig, usersList, isLoaded]);

  /* ================= INIT ================= */

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  /* ================= FILTER ================= */

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const visible = isAdmin || e.status === "Approved";
      const match =
        selectedCategory === "All" || e.category === selectedCategory;
      return visible && match;
    });
  }, [events, selectedCategory, isAdmin]);

  const popularEvents = useMemo(() => {
    return events.filter((e) => e.isPopular).slice(0, 3);
  }, [events]);

  /* ================= HANDLERS ================= */

  const handleAddEvent = (event: any) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      status: isAdmin ? "Approved" : "Pending",
    };

    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  /* ================= UI ================= */

  if (!isLoaded) return null;

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        theme === "dark" ? "bg-gray-950 text-white" : "bg-gray-50 text-black"
      )}
    >
      <Navbar
        onLoginClick={() => setIsLoginModalOpen(true)}
        onOpenDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenSupport={() => setIsStudentSupportOpen(true)}
        homeConfig={homeConfig}
        theme={theme}
        toggleTheme={() =>
          setTheme((t) => (t === "light" ? "dark" : "light"))
        }
      />

      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6">Campus Events</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularEvents.map((e) => (
            <div key={e.id} className="p-4 bg-white rounded shadow">
              <h3 className="font-bold">{e.title}</h3>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredEvents.map((e) => (
            <EventCard key={e.id} event={e} onClick={setSelectedEvent} />
          ))}
        </div>
      </main>

      <Footer homeConfig={homeConfig} theme={theme} />

      {/* MODALS */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          usersList={usersList}
        />
      )}

      {isFeedbackModalOpen && (
        <FeedbackModal
          onClose={() => setIsFeedbackModalOpen(false)}
          admins={usersList}
          onSubmit={() => {}}
        />
      )}

      {isEventRequestModalOpen && (
        <EventRequestModal
          onClose={() => setIsEventRequestModalOpen(false)}
          onSubmit={handleAddEvent}
          categories={categories}
          theme={theme}
        />
      )}

      {isStudentSupportOpen && (
        <StudentSupport
          messages={messages}
          userEmail={user?.email || ""}
          onClose={() => setIsStudentSupportOpen(false)}
          onSendReply={() => {}}
        />
      )}
    </div>
  );
};

/* ================= EXPORT FIX (THIS IS CRITICAL) ================= */

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CampusApp />
    </AuthProvider>
  );
};

export default App;

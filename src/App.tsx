import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Filters from './components/Filters';
import EventCard from './components/EventCard';
import EventModal from './components/EventModal';
import CalendarView from './components/CalendarView';
import AdminDashboard from './components/AdminDashboard';
import FeedbackModal from './components/FeedbackModal';
import StudentSupport from './components/StudentSupport';
import EventRequestModal from './components/EventRequestModal';
import Footer from './components/Footer';
import { mockEvents as initialMockEvents } from './data/mockEvents';
import { CampusEvent, FeedbackMessage, User, AuditLog } from './types';
import { Sparkles, TrendingUp, Clock, LayoutGrid, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';
import { cn } from './utils/cn';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';

const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api';

const CampusApp: React.FC = () => {
  const { user, isAdmin, logout, refreshUser } = useAuth();

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('calendar');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isEventRequestModalOpen, setIsEventRequestModalOpen] = useState(false);
  const [isStudentSupportOpen, setIsStudentSupportOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // ---------- SAFE LOCAL STORAGE INIT ----------
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('cp_categories');
    return saved ? JSON.parse(saved) : ['Academic', 'Social', 'Sports', 'Workshops', 'Career', 'Arts', 'Tech'];
  });

  const [messages, setMessages] = useState<FeedbackMessage[]>(() => {
    const saved = localStorage.getItem('cp_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [usersList, setUsersList] = useState<User[]>(() => {
    const saved = localStorage.getItem('authorized_nodes');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'u1',
            name: 'Master Admin',
            email: 'master@campus.edu',
            password: 'master',
            role: 'MasterAdmin',
            avatar: 'https://i.pravatar.cc/150?u=master',
          },
          {
            id: 'u2',
            name: 'Alex Johnson',
            email: 'alex@student.edu',
            password: 'student',
            role: 'Student',
            avatar: 'https://i.pravatar.cc/150?u=alex',
          },
          {
            id: 'u3',
            name: 'Staff Admin',
            email: 'admin@campus.edu',
            password: 'admin',
            role: 'Admin',
            avatar: 'https://i.pravatar.cc/150?u=admin',
          },
        ];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('cp_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<CampusEvent[]>(() => {
    const saved = localStorage.getItem('cp_events');
    return saved ? JSON.parse(saved) : initialMockEvents;
  });

  const [homeConfig, setHomeConfig] = useState<any>(() => {
    const saved = localStorage.getItem('cp_config');
    return saved
      ? JSON.parse(saved)
      : {
          heroHeadline: 'Your Campus. All in One Place.',
          heroSubheadline: 'Discover workshops, games, performances...',
          heroImage:
            'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000',
        };
  });

  // ---------- FIX: SAVE ONLY WHEN LOADED ----------
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem('cp_events', JSON.stringify(events));
    localStorage.setItem('authorized_nodes', JSON.stringify(usersList));
    localStorage.setItem('cp_messages', JSON.stringify(messages));
    localStorage.setItem('cp_logs', JSON.stringify(auditLogs));
    localStorage.setItem('cp_config', JSON.stringify(homeConfig));
    localStorage.setItem('cp_categories', JSON.stringify(categories));
  }, [events, usersList, messages, auditLogs, homeConfig, categories, isLoaded]);

  // ---------- FIXED FETCH (NO OVERWRITE BUG) ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const safeFetch = async (endpoint: string) => {
          try {
            const r = await fetch(`${API_URL}/${endpoint}`);
            if (!r.ok) return null;
            return await r.json();
          } catch {
            return null;
          }
        };

        const [ev, users, msg, logs, config] = await Promise.all([
          safeFetch('events'),
          safeFetch('users'),
          safeFetch('feedback'),
          safeFetch('audit'),
          safeFetch('config'),
        ]);

        // EVENTS (FIXED SAFE MERGE)
        if (Array.isArray(ev) && ev.length > 0) {
          setEvents(ev);
        }

        if (Array.isArray(users) && users.length > 0) {
          setUsersList(users);
        }

        if (msg) setMessages(msg);
        if (logs) setAuditLogs(logs);
        if (config && Object.keys(config).length > 0) setHomeConfig(config);
      } catch (err) {
        console.warn('API offline - using local data');
      }

      setIsLoaded(true);
    };

    fetchData();
  }, []);

  // ---------- LOG FUNCTION ----------
  const addLog = async (type: AuditLog['type'], action: string, details: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      type,
      action,
      actor: user?.name || 'Unknown',
      details,
    };

    setAuditLogs((prev) => [newLog, ...prev]);

    try {
      await fetch(`${API_URL}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
      });
    } catch {}
  };

  const toggleTheme = () => setTheme((p) => (p === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    setIsAdminDashboardOpen(isAdmin);
  }, [isAdmin]);

  const allCategories = ['All', ...categories];

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (!isAdmin && e.status !== 'Approved') return false;
      return selectedCategory === 'All' || e.category === selectedCategory;
    });
  }, [events, isAdmin, selectedCategory]);

  const popularEvents = useMemo(
    () => events.filter((e) => e.isPopular && e.status === 'Approved').slice(0, 3),
    [events]
  );

  const handleAddEvent = (newEvent: any) => {
    const eventWithStatus = {
      ...newEvent,
      id: newEvent.id || Math.random().toString(36).substr(2, 9),
      status: isAdmin ? 'Approved' : 'Pending',
    };

    setEvents((prev) => [eventWithStatus, ...prev]);
    addLog('EVNT', 'Event Added', newEvent.title);
  };

  const handleApproveEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Approved' } : e))
    );
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  if (!isLoaded) return null;

  return (
    <div className={theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-black'}>
      <Navbar
        onLoginClick={() => setIsLoginModalOpen(true)}
        onOpenDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenSupport={() => setIsStudentSupportOpen(true)}
        homeConfig={homeConfig}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* HERO */}
      <section>
        <h1>{homeConfig.heroHeadline}</h1>
      </section>

      {/* EVENTS */}
      <section>
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} onClick={setSelectedEvent} />
        ))}
      </section>

      <Footer homeConfig={homeConfig} theme={theme} />

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CampusApp />
    </AuthProvider>
  );
};

export default App;

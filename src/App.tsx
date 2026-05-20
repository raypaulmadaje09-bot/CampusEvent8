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

const API_URL = window.location.hostname === 'localhost' 
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

  // Persistence State
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
    return saved ? JSON.parse(saved) : [
      { id: 'u1', name: 'Master Admin', email: 'master@campus.edu', password: 'master', role: 'MasterAdmin', avatar: 'https://i.pravatar.cc/150?u=master' },
      { id: 'u2', name: 'Alex Johnson', email: 'alex@student.edu', password: 'student', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=alex' },
      { id: 'u3', name: 'Staff Admin', email: 'admin@campus.edu', password: 'admin', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
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
  const [homeConfig, setHomeConfig] = useState(() => {
    const saved = localStorage.getItem('cp_config');
    return saved ? JSON.parse(saved) : {
      heroHeadline: 'Your Campus. All in One Place.',
      heroSubheadline: 'Discover workshops, games, performances, and everything in between. Never miss a beat of campus life.',
      heroImage: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000',
      footerText: 'The central hub for everything happening on campus. Discover, plan, and connect with your community.',
      campusName: 'CampusPulse',
      primaryColor: '#4f46e5',
      logoImage: '',
      socialLinks: [
        { platform: 'Twitter', handle: '@campus_pulse_twitter', visible: true },
        { platform: 'Instagram', handle: '@campus_pulse_instagram', visible: true },
        { platform: 'Github', handle: '@campus_pulse_github', visible: true }
      ],
      exploreTitle: 'Explore',
      exploreLinks: [
        { label: 'All Events', url: '#' },
        { label: 'Student Clubs', url: '#' },
        { label: 'Campus Map', url: '#' },
        { label: 'Resources', url: '#' }
      ],
      supportTitle: 'Support',
      supportLinks: [
        { label: 'Help Center', url: '#' },
        { label: 'Safety Guide', url: '#' },
        { label: 'Report Issue', url: '#' },
        { label: 'Feedback', url: '#' }
      ]
    };
  });

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cp_events', JSON.stringify(events));
      localStorage.setItem('authorized_nodes', JSON.stringify(usersList));
      localStorage.setItem('cp_messages', JSON.stringify(messages));
      localStorage.setItem('cp_logs', JSON.stringify(auditLogs));
      localStorage.setItem('cp_config', JSON.stringify(homeConfig));
      localStorage.setItem('cp_categories', JSON.stringify(categories));
    }
  }, [events, usersList, messages, auditLogs, homeConfig, categories, isLoaded]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const safeFetch = async (endpoint: string) => {
          try {
            const r = await fetch(`${API_URL}/${endpoint}`);
            if (!r.ok) return null;
            return await r.json();
          } catch (e) { return null; }
        };

        const [ev, users, msg, logs, config] = await Promise.all([
          safeFetch('events'),
          safeFetch('users'),
          safeFetch('feedback'),
          safeFetch('audit'),
          safeFetch('config')
        ]);
        
        // Database is the primary source
        if (ev && ev.length > 0) {
          setEvents(ev);
        } else {
          // If database is empty, seed with initial mock events (for demo)
          setEvents(initialMockEvents);
        }

        if (users && users.length > 0) {
          setUsersList(users);
        } else {
          setUsersList([
            { id: 'u1', name: 'Master Admin', email: 'master@campus.edu', password: 'master', role: 'MasterAdmin', avatar: 'https://i.pravatar.cc/150?u=master' },
            { id: 'u2', name: 'Alex Johnson', email: 'alex@student.edu', password: 'student', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=alex' },
            { id: 'u3', name: 'Staff Admin', email: 'admin@campus.edu', password: 'admin', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
          ]);
        }

        if (msg) setMessages(msg);
        if (logs) setAuditLogs(logs);
        if (config && Object.keys(config).length) setHomeConfig(config);
      } catch (err) {
        console.warn('DATABASE OFFLINE: Using internal protocols.');
        setEvents(initialMockEvents);
        setUsersList([
          { id: 'u1', name: 'Master Admin', email: 'master@campus.edu', password: 'master', role: 'MasterAdmin', avatar: 'https://i.pravatar.cc/150?u=master' },
          { id: 'u2', name: 'Alex Johnson', email: 'alex@student.edu', password: 'student', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=alex' },
          { id: 'u3', name: 'Staff Admin', email: 'admin@campus.edu', password: 'admin', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
        ]);
      }
      setIsLoaded(true);
    };
    fetchData();
  }, []);

  const addLog = async (type: AuditLog['type'], action: string, details: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      type,
      action,
      actor: user?.name || 'Unknown',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
    try {
      await fetch(`${API_URL}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
    } catch (err) { console.error('Log Error:', err); }
  };



  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    if (isAdmin) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminDashboardOpen(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const allCategories = ['All', ...categories];

  const filteredEvents = useMemo(() => {
    return events.filter((event: CampusEvent) => {
      const isVisible = isAdmin || event.status === 'Approved';
      if (!isVisible) return false;
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      return matchesCategory;
    });
  }, [selectedCategory, events, isAdmin]);

  const popularEvents = useMemo(() => {
    return events.filter((e: CampusEvent) => e.isPopular && e.status === 'Approved').slice(0, 3);
  }, [events]);

  const handleAddEvent = async (newEvent: any) => {
    const eventWithStatus = {
      ...newEvent,
      status: isAdmin ? 'Approved' : 'Pending'
    };
    // Always update local state first for immediate UI response in demo
    setEvents(prev => [eventWithStatus, ...prev]);
    addLog('EVNT', 'New Event Added', `Title: ${newEvent.title}`);
    
    try {
      await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventWithStatus)
      });
    } catch (err) { console.warn('Database offline, running in local-only protocol.'); }
  };

  const handleApproveEvent = async (id: string) => {
    const event = events.find(e => e.id === id);
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'Approved' } : e));
    if (event) addLog('EVNT', 'Event Approved', `ID: ${id}, Title: ${event.title}`);
    
    try {
      await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
    } catch (err) { console.warn('Database offline.'); }
  };

  const handleDeleteEvent = async (id: string) => {
    const event = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    if (selectedEvent?.id === id) setSelectedEvent(null);
    if (event) addLog('EVNT', 'Event Deleted', `Title: ${event.title}`);
    
    try {
      await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
    } catch (err) { console.warn('Database offline.'); }
  };

  const handleSendFeedback = async (data: { subject: string; message: string; recipientId: string }) => {
    const newMessage: FeedbackMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderName: user?.name || 'Guest',
      senderEmail: user?.email || 'guest@campus.edu',
      recipientId: data.recipientId,
      subject: data.subject,
      message: data.message,
      timestamp: new Date().toISOString(),
      status: 'new',
      replies: []
    };
    setMessages(prev => [newMessage, ...prev]);
    addLog('USER', 'Feedback Received', `From: ${newMessage.senderName}`);
    
    try {
      await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
    } catch (err) { console.warn('Database offline.'); }
  };

  const handleAdminReply = async (messageId: string, text: string) => {
    const reply = {
      sender: (isAdmin ? 'Admin' : 'Student') as 'Admin' | 'Student',
      senderName: user?.name || 'System',
      text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const updatedMsg: FeedbackMessage = {
          ...m,
          status: (isAdmin ? 'replied' : m.status),
          replies: [...m.replies, reply]
        };
        return updatedMsg;
      }
      return m;
    }));
    addLog('USER', 'Feedback Replied', `Message ID: ${messageId}`);

    try {
      await fetch(`${API_URL}/feedback/${messageId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reply)
      });
    } catch (err) { console.warn('Database offline.'); }
  };

  const handleAddUser = async (newUser: User) => {
    setUsersList(prev => [...prev, newUser]);
    addLog('USER', 'New User Authorized', `Email: ${newUser.email}, Role: ${newUser.role}`);
    
    try {
      await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
    } catch (err) { console.warn('Database offline.'); }
  };

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = usersList.find(u => u.id === userId);
    if (userToDelete?.role === 'MasterAdmin' && usersList.filter(u => u.role === 'MasterAdmin').length <= 1) {
      alert('CRITICAL ERROR: System must have at least one active Master Admin node.');
      return;
    }
    
    setUsersList(prev => prev.filter(u => u.id !== userId));
    addLog('USER', 'Node Deauthorized', `Name: ${userToDelete?.name}, ID: ${userId}`);
    if (user?.id === userId) logout();

    try {
      await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' });
    } catch (err) { console.warn('Database offline.'); }
  };

  const handleEditUser = async (updatedUser: User) => {
    setUsersList(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user?.id === updatedUser.id) refreshUser(updatedUser);
    
    addLog('USER', 'Node Protocols Modified', `Name: ${updatedUser.name}, ID: ${updatedUser.id}`);
    
    try {
      await fetch(`${API_URL}/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
    } catch (err) { console.error('User Update Error:', err); }
  };

  const handleUpdateEvent = async (updatedEvent: CampusEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    addLog('EVNT', 'Event Protocol Modified', `Title: ${updatedEvent.title}`);
    
    try {
      await fetch(`${API_URL}/events/${updatedEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent)
      });
    } catch (err) { console.warn('Database offline.'); }
  };

  const handleCMSUpdate = async (newConfig: any) => {
    setHomeConfig(newConfig);
    addLog('CMS', 'Global protocols Updated', 'Site branding/identity modified');
    try {
      await fetch(`${API_URL}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
    } catch (err) { console.error('CMS Update Error:', err); }
  };

  if (!isLoaded) return null;

  if (isAdmin && isAdminDashboardOpen) {
    return (
      <AdminDashboard 
        events={events}
        onApprove={handleApproveEvent}
        onDelete={handleDeleteEvent}
        onAdd={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onClose={() => setIsAdminDashboardOpen(false)}
        onEdit={(event) => {
          setSelectedEvent(event);
        }}
        homeConfig={homeConfig}
        setHomeConfig={handleCMSUpdate}
        categories={categories as any}
        onAddCategory={(cat) => setCategories(prev => [...prev, cat])}
        messages={messages}
        onReply={handleAdminReply}
        usersList={usersList}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleEditUser}
        theme={theme}
        toggleTheme={toggleTheme}
        auditLogs={auditLogs}
      />
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 flex flex-col",
      theme === 'dark' ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
    )}>
      <Navbar 
        onLoginClick={() => setIsLoginModalOpen(true)}
        onOpenDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenSupport={() => {
          if (!user) setIsLoginModalOpen(true);
          else setIsStudentSupportOpen(true);
        }}
        homeConfig={homeConfig}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-grow">
        <section className="relative bg-indigo-900 text-white py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={homeConfig.heroImage} 
              alt="Campus" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-indigo-900/60 mix-blend-multiply"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>What's happening today</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
                {homeConfig.heroHeadline}
              </h1>
              <p className="text-lg sm:text-xl text-indigo-100/80 mb-10 max-w-2xl">
                {homeConfig.heroSubheadline}
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Explore Events
                </button>
                {!isAdmin && user?.canRequestEvents && (
                  <button 
                    onClick={() => setIsEventRequestModalOpen(true)}
                    className="px-8 py-3 bg-indigo-700/50 text-white font-bold rounded-xl hover:bg-indigo-700/70 border border-indigo-500/30 transition-colors backdrop-blur-sm"
                  >
                    Request Event
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularEvents.map(event => (
              <div 
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={cn(
                  "rounded-2xl p-5 shadow-xl border flex items-center gap-4 cursor-pointer hover:translate-y-[-4px] transition-all duration-300",
                  theme === 'dark' ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
                )}
              >
                <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={event.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </div>
                  <h4 className={cn("font-bold line-clamp-1", theme === 'dark' ? "text-white" : "text-gray-900")}>{event.title}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {event.startTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section id="events-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <h2 className={cn("text-3xl font-bold", theme === 'dark' ? "text-white" : "text-gray-900")}>Event Schedule</h2>
              <p className="text-gray-500 mt-1">Showing {filteredEvents.length} events happening soon</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Filters 
              categories={allCategories as any}
              selectedCategory={selectedCategory as any}
              setSelectedCategory={setSelectedCategory as any}
            />
            
            <div className={cn(
              "border p-1 rounded-xl flex items-center shadow-sm h-fit self-start sm:self-center",
              theme === 'dark' ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
            )}>
              <button 
                onClick={() => setViewMode('grid')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  viewMode === 'grid' ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-gray-500 hover:text-indigo-600"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  viewMode === 'calendar' ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-gray-500 hover:text-indigo-600"
                )}
              >
                <CalendarIcon className="w-4 h-4" />
                Calendar
              </button>
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredEvents.map(event => (
                  <EventCard 
                    key={event.id}
                    event={event}
                    onClick={setSelectedEvent}
                  />
                ))}
              </div>
            ) : (
              <CalendarView 
                events={filteredEvents} 
                onEventClick={setSelectedEvent} 
              />
            )
          ) : (
            <div className="py-24 text-center">
              <h3 className="text-xl font-bold text-gray-400">No events found in this protocols.</h3>
            </div>
          )}
        </section>
      </main>

      <Footer homeConfig={homeConfig} theme={theme} />

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} usersList={usersList} />
      )}

      {isFeedbackModalOpen && (
        <FeedbackModal 
          onClose={() => setIsFeedbackModalOpen(false)} 
          admins={usersList.filter(u => u.role !== 'Student')}
          onSubmit={(data) => {
            handleSendFeedback(data);
            alert('Reporting success. Admin will review your message.');
          }} 
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

      {isStudentSupportOpen && user && (
        <>
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[65]" onClick={() => setIsStudentSupportOpen(false)} />
          <StudentSupport 
            messages={messages}
            userEmail={user.email}
            onClose={() => setIsStudentSupportOpen(false)}
            onSendReply={(messageId, text) => {
              setMessages(prev => prev.map(m => {
                if (m.id === messageId) {
                  const updatedMsg: FeedbackMessage = {
                    ...m,
                    replies: [...m.replies, { 
                      sender: 'Student', 
                      senderName: user.name,
                      text, 
                      timestamp: new Date().toISOString() 
                    }]
                  };
                  return updatedMsg;
                }
                return m;
              }));
            }}
          />
        </>
      )}

      {!isAdmin && (
        <button 
          onClick={() => {
            if (!user) setIsLoginModalOpen(true);
            else setIsFeedbackModalOpen(true);
          }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all z-50 group"
        >
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
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

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

      // 🔴 THIS IS THE PART YOU MUST EDIT
      if (ev && ev.length > 0) {
        setEvents(ev);
      } else {
        setEvents(initialMockEvents);
      }

      if (users && users.length > 0) {
        setUsersList(users);
      }

      if (msg) setMessages(msg);
      if (logs) setAuditLogs(logs);
      if (config && Object.keys(config).length) setHomeConfig(config);

    } catch (err) {
      console.warn('DATABASE OFFLINE');
    }

    setIsLoaded(true);
  };

  fetchData();
}, []);

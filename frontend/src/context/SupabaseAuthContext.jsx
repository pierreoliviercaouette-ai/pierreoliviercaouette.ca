import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const SupabaseAuthContext = createContext(null);

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const initialFetchDone = useRef(false);

  const getAuthHeaders = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const fetchUser = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setUser(null);
        setToken(null);
        return;
      }

      setToken(session.access_token);
      
      // Fetch user profile from custom 'users' or 'profiles' table if you have one
      const { data: profile, error } = await supabase
        .from('profiles') // Adjust table name to your schema
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        setUser({ ...session.user, ...profile });
      } else {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchUser();
    }

    // Set up real-time listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setToken(session?.access_token);
          fetchUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setToken(null);
          setNotifications([]);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Real-time notifications listener
      const notifSubscription = supabase
        .channel('public:notifications')
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            fetchNotifications();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(notifSubscription);
      };
    }
  }, [user, fetchNotifications]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await fetchUser();
    return data.user;
  };

  const register = async (userData) => {
    const { email, password, first_name, last_name, phone } = userData;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          phone
        }
      }
    });
    if (error) throw error;
    
    // If not using email confirmations or if user inserts into profiles automatically via trigger:
    await fetchUser();
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
    setNotifications([]);
  };

  const markNotificationRead = async (notificationId) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllNotificationsRead = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
        
      if (error) throw error;
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const value = {
    user,
    token, // Provided for components that might still need to construct HTTP headers
    loading,
    notifications,
    unreadCount,
    login,
    register,
    logout,
    getAuthHeaders, // Kept for legacy compatibility
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    refreshUser: fetchUser
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

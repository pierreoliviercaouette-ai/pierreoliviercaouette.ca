import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const SupabaseAuthContext = createContext(null);

/** Profil + session → même forme que l’ancien AuthContext (Mongo / API). */
function mapSessionToAppUser(sessionUser, profile) {
  const meta = sessionUser?.user_metadata || {};
  const firstName = profile?.first_name || meta.first_name || '';
  const lastName = profile?.last_name || meta.last_name || '';
  const created =
    profile?.created_at ||
    sessionUser?.created_at ||
    new Date().toISOString();
  const createdStr = typeof created === 'string' ? created : new Date(created).toISOString();

  return {
    id: sessionUser.id,
    // Keep `email` key for legacy UI; fallback to phone for phone-based auth.
    email: sessionUser.email || profile?.email || sessionUser.phone || profile?.phone || '',
    first_name: firstName || '—',
    last_name: lastName || '—',
    phone: profile?.phone ?? meta.phone ?? null,
    is_admin: profile?.is_admin ?? false,
    referral_code: profile?.referral_code ?? '',
    created_at: createdStr,
  };
}

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
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      setUser(mapSessionToAppUser(session.user, profile));
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

  const login = async (identifier, password) => {
    const value = (identifier || '').trim();
    const isEmail = value.includes('@');
    const credentials = isEmail ? { email: value, password } : { phone: value, password };
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    await fetchUser();
    return data.user;
  };

  const register = async (userData) => {
    const { email, phone, password, first_name, last_name } = userData;
    const normalizedEmail = (email || '').trim();
    const normalizedPhone = (phone || '').trim();

    const signUpPayload = normalizedPhone
      ? {
          phone: normalizedPhone,
          password,
          options: {
            emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
            data: {
              first_name,
              last_name,
              phone: normalizedPhone
            }
          }
        }
      : {
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
            data: {
              first_name,
              last_name,
              phone: null
            }
          }
        };

    const { data, error } = await supabase.auth.signUp(signUpPayload);
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

/** Alias pour les composants qui importent encore depuis AuthContext. */
export const useAuth = useSupabaseAuth;

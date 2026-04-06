import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { setAnalyticsUser, trackPageView } from '../../lib/analytics';

export const AnalyticsTracker = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const path = `${location.pathname}${location.search || ''}`;
    trackPageView(path, document?.title || '');
  }, [location.pathname, location.search]);

  useEffect(() => {
    setAnalyticsUser(user);
  }, [user]);

  return null;
};

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

// Generate or get visitor ID from localStorage
const getVisitorId = (): string => {
  const key = 'wh_visitor_id';
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
};

// Generate or get session ID (expires after 30 minutes of inactivity)
const getSessionId = (): string => {
  const key = 'wh_session_id';
  const timestampKey = 'wh_session_timestamp';
  const sessionTimeout = 30 * 60 * 1000; // 30 minutes
  
  const now = Date.now();
  const lastTimestamp = parseInt(localStorage.getItem(timestampKey) || '0', 10);
  let sessionId = localStorage.getItem(key);
  
  // If session expired or doesn't exist, create a new one
  if (!sessionId || (now - lastTimestamp) > sessionTimeout) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
  }
  
  // Update timestamp
  localStorage.setItem(timestampKey, now.toString());
  
  return sessionId;
};

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin pages
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    const trackPageView = async () => {
      try {
        const visitorId = getVisitorId();
        const sessionId = getSessionId();

        await supabase.from('wh_page_views').insert({
          page_path: location.pathname,
          visitor_id: visitorId,
          session_id: sessionId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });
      } catch (error) {
        // Silently fail - don't impact user experience
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);
}

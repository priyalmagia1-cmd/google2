import { GA4Event } from '../types';

let ga4EventLog: GA4Event[] = [];
let listeners: ((event: GA4Event) => void)[] = [];

export function trackGA4Event(event_name: string, params: Record<string, any> = {}) {
  const event: GA4Event = {
    id: 'evt_' + Math.random().toString(36).substring(2, 9),
    event_name,
    params: {
      ...params,
      utm_campaign: params.utm_campaign || 'google_gear_drop',
      utm_source: params.utm_source || 'store_app',
      page_location: window.location.href,
    },
    timestamp: new Date().toISOString(),
  };

  ga4EventLog = [event, ...ga4EventLog.slice(0, 49)]; // Keep last 50 events

  // Notify listeners
  listeners.forEach((listener) => listener(event));

  // Also post to backend server endpoint silently
  fetch('/api/ga4/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).catch(() => {
    // Ignore network failures for telemetry tracking
  });

  console.log(`📊 [GA4 Event] ${event_name}`, event.params);
  return event;
}

export function subscribeGA4(listener: (event: GA4Event) => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getGA4Log(): GA4Event[] {
  return ga4EventLog;
}

export function clearGA4Log() {
  ga4EventLog = [];
}

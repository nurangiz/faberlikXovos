// Real-time Cloud Synchronization Bus for Faberlic Academy
// Allows users registering on any browser/device to appear instantly on Admin Panel and Leaderboard

const SYNC_URL = 'https://ntfy.sh/fl_academy_uz_2026_sync';

export async function broadcastEvent(eventData) {
  try {
    await fetch(SYNC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
  } catch (err) {
    console.warn("[CloudSync] Broadcast error:", err.message);
  }
}

export async function fetchCloudEvents() {
  try {
    const res = await fetch(`${SYNC_URL}/json?poll=1&since=all`, {
      headers: { 'Accept': 'application/x-ndjson' }
    });
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text.trim().split('\n').filter(Boolean);
    const events = [];

    for (const line of lines) {
      try {
        const item = JSON.parse(line);
        if (item.event === 'message' && item.message) {
          const parsed = JSON.parse(item.message);
          events.push(parsed);
        }
      } catch (e) {}
    }
    return events;
  } catch (err) {
    console.warn("[CloudSync] Fetch error:", err.message);
    return [];
  }
}

export function subscribeToCloudEvents(onEvent) {
  if (typeof window === 'undefined' || !window.EventSource) return () => {};

  let eventSource = null;
  try {
    eventSource = new EventSource(`${SYNC_URL}/sse`);
    eventSource.onmessage = (e) => {
      try {
        const item = JSON.parse(e.data);
        if (item.message) {
          const event = JSON.parse(item.message);
          onEvent(event);
        }
      } catch (err) {}
    };
  } catch (e) {
    console.warn("[CloudSync] SSE connection failed:", e.message);
  }

  // Fallback poll every 15s to guarantee 100% reliability
  const intervalId = setInterval(async () => {
    try {
      const events = await fetchCloudEvents();
      events.forEach(ev => onEvent(ev));
    } catch(e) {}
  }, 15000);

  return () => {
    if (eventSource) eventSource.close();
    clearInterval(intervalId);
  };
}

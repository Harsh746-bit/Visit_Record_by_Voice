import { useEffect, useRef } from 'react';

interface RealtimeEvent {
  event: 'visit.submitted' | 'high_risk.alert' | 'record.reviewed' | 'record.returned';
  data: any;
}

export function useRealtimeSync(
  circleId: string = 'khed_shivapur_circle',
  onEvent?: (event: RealtimeEvent) => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    function connect() {
      const wsUrl = `ws://localhost:8000/ws/anm/${encodeURIComponent(circleId)}`;
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log(`[WebSocket] Connected to live circle: ${circleId}`);
        };

        ws.onmessage = (messageEvent) => {
          try {
            const parsed: RealtimeEvent = JSON.parse(messageEvent.data);
            console.log('[WebSocket] Real-time event received:', parsed);
            if (onEvent && isMounted) {
              onEvent(parsed);
            }
          } catch (err) {
            console.warn('[WebSocket] Message parsing error:', err);
          }
        };

        ws.onerror = () => {
          // Silent fallback on connection error
        };

        ws.onclose = () => {
          if (isMounted) {
            reconnectTimeoutRef.current = setTimeout(connect, 5000);
          }
        };
      } catch {
        if (isMounted) {
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        }
      }
    }

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [circleId, onEvent]);
}

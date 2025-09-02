// hooks/useWebSocket.ts
import { useEffect } from 'react';

export interface TradeMessage {
  type: 'ASK' | 'BID';
  symbol: string;
  price: number;
  originalPrice: number;
  quantity: number;
  time: number;
}

// keep a shared connection outside the hook
let ws: WebSocket | null = null;
let listeners: ((msg: TradeMessage) => void)[] = [];

export function useWebSocket(onMessage: (msg: TradeMessage) => void) {
  useEffect(() => {
    // create socket only once
    if (!ws) {
      ws = new WebSocket('ws://localhost:8080');

      ws.onmessage = (event) => {
        try {
          const data: TradeMessage = JSON.parse(event.data);
          // notify all subscribers
          listeners.forEach((cb) => cb(data));
        } catch (err) {
          console.error('WS parse error', err);
        }
      };

      ws.onclose = () => {
        ws = null;
        listeners = [];
      };
    }

    // register listener for this hook call
    listeners.push(onMessage);

    // cleanup when component unmounts
    return () => {
      listeners = listeners.filter((cb) => cb !== onMessage);

      // if no more listeners, close connection
      if (listeners.length === 0 && ws) {
        ws.close();
        ws = null;
      }
    };
  }, [onMessage]);
}

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

export function useWebSocket(onMessage: (msg: TradeMessage) => void) {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      try {
        const data: TradeMessage = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error('WS parse error', err);
      }
    };

    return () => {
      ws.close();
    };
  }, [onMessage]);
}

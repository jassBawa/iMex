import { useMutation } from '@tanstack/react-query';

export type OrderPayload = {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
};

const BE_URL = 'http://localhost:4000/api/v1';

export async function createOrder(payload: OrderPayload) {
  const res = await fetch(`${BE_URL}/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to place order');
  }

  return res.json();
}

export function useCreateOrder() {
  return useMutation({
    mutationKey: ['createOrder'],
    mutationFn: (payload: OrderPayload) => createOrder(payload),
  });
}

// hooks/usePlaceOrder.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface OrderPayload {
  symbol: string;
  side: 'BUY' | 'SELL';
  margin: number;
  leverage: number;
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: OrderPayload) => {
      const { data } = await axios.post('/api/orders', order);
      return data;
    },
    onSuccess: () => {
      // Invalidate cache if needed
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Failed to place order', error);
    },
  });
}

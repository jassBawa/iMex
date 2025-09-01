import { useQuery } from '@tanstack/react-query';

const fetchCandles = async ({ queryKey }: any) => {
  const [_key, symbol, interval] = queryKey;
  const res = await fetch(
    `http://localhost:4000/api/v1/candles?symbol=${symbol}&interval=${interval}`
  );
  if (!res.ok) throw new Error('Failed to fetch candles');

  const data = await res.json();
  return data.rows.map((candle: any) => ({
    time: Math.floor(new Date(candle.bucket).getTime() / 1000),
    open: parseFloat(candle.open),
    high: parseFloat(candle.high),
    low: parseFloat(candle.low),
    close: parseFloat(candle.close),
  }));
};

export function useCandles(symbol: string, interval: string) {
  return useQuery({
    queryKey: ['candles', symbol, interval],
    queryFn: fetchCandles,
    refetchInterval: 5000, // auto-refetch every 5s
    staleTime: 10_000,
  });
}

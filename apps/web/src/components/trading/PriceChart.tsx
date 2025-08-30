'use client';
import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  IChartApi,
  Time,
  CandlestickData,
  CandlestickSeries,
} from 'lightweight-charts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PriceChartProps {
  symbol?: string;
  askPrice?: number;
  bidPrice?: number;
}

type CandleData = CandlestickData<Time>;

interface ApiCandleData {
   bucket: number;
  open: string;
  high: string;
  low: string;
  close: string;
}

export default function PriceChart({ symbol = 'btcusdt' }: PriceChartProps) {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [interval, setInterval] = useState<string>('1m'); // default
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandles = async (symbol: string, interval: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:4000/api/candles?symbol=${symbol}&interval=${interval}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch candles: ${response.statusText}`);
      }

      const apiData: ApiCandleData[] = await response.json();

      const formattedData: CandleData[] = apiData.map((candle) => {
        const bucketTime = new Date(candle.bucket);

        return {
          time: Math.floor(bucketTime.getTime() / 1000) as Time,
          open: parseFloat(candle.open),
          high: parseFloat(candle.high),
          low: parseFloat(candle.low),
          close: parseFloat(candle.close),
        };
      });

      formattedData.sort((a, b) => (a.time as number) - (b.time as number));


      setCandleData(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching candles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandles(symbol, interval);
  }, [symbol, interval]);

  useEffect(() => {
    if (!chartRef.current || candleData.length === 0) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.15)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.15)' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: 'rgba(59, 130, 246, 0.4)', width: 2 },
        horzLine: { color: 'rgba(59, 130, 246, 0.4)', width: 2 },
      },
      rightPriceScale: { borderColor: 'rgba(148, 163, 184, 0.3)' },
      timeScale: {
        borderColor: 'rgba(148, 163, 184, 0.3)',
        timeVisible: true,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#059669',
      downColor: '#dc2626',
      borderVisible: false,
      wickUpColor: '#059669',
      wickDownColor: '#dc2626',
    });

    candlestickSeries.setData(candleData);

    chartInstanceRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartRef.current.clientWidth,
        });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candleData]);

  const formatPrice = (price: number) => price.toFixed(4);

  return (
    <Card className="border-slate-200/60 bg-white/70 backdrop-blur-sm shadow-lg">
      <div className="p-6 border-b border-slate-200/60 flex items-center justify-between bg-gradient-to-r from-slate-50/80 to-blue-50/40">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
          <h3 className="font-bold text-lg text-slate-800">Live Chart</h3>
          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-500 font-medium">Loading...</span>
            </div>
          )}
          {error && <span className="text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded">{error}</span>}
        </div>
        <div className="flex items-center gap-3">
          <Select value={interval} onValueChange={setInterval}>
            <SelectTrigger>
              <SelectValue placeholder="Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1m</SelectItem>
              <SelectItem value="5m">5m</SelectItem>
              <SelectItem value="10m">10m</SelectItem>
              <SelectItem value="30m">30m</SelectItem>
              <SelectItem value="1d">1d</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200">
            {symbol.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div
          ref={chartRef}
          className="w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-50/80 via-blue-50/30 to-indigo-50/40 relative border border-slate-200/60 shadow-inner"
        />
      </div>

      {/* Chart Info */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50/50 p-3 rounded-lg border border-slate-200/40">
          <div className="flex items-center gap-4">
            <span className="font-semibold">O: <span className="text-slate-700">${formatPrice(candleData.at(-1)?.open || 0)}</span></span>
            <span className="font-semibold">H: <span className="text-emerald-600">${formatPrice(candleData.at(-1)?.high || 0)}</span></span>
            <span className="font-semibold">L: <span className="text-rose-600">${formatPrice(candleData.at(-1)?.low || 0)}</span></span>
            <span className="font-semibold">C: <span className="text-slate-700">${formatPrice(candleData.at(-1)?.close || 0)}</span></span>
          </div>
          <div className="text-blue-600 font-semibold flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Live Market Data
          </div>
        </div>
      </div>
    </Card>
  );
}

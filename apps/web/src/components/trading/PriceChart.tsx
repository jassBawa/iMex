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
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(156, 163, 175, 0.1)' },
        horzLines: { color: 'rgba(156, 163, 175, 0.1)' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: 'rgba(59, 130, 246, 0.3)', width: 1 },
        horzLine: { color: 'rgba(59, 130, 246, 0.3)', width: 1 },
      },
      rightPriceScale: { borderColor: 'rgba(156, 163, 175, 0.2)' },
      timeScale: {
        borderColor: 'rgba(156, 163, 175, 0.2)',
        timeVisible: true,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
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
    <Card className="border-card-border bg-card/50 backdrop-blur-sm">
      <div className="p-4 border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Price Chart</h3>
          {loading && (
            <span className="text-xs text-muted-foreground">Loading...</span>
          )}
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
        <div className="flex items-center gap-2">
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
          <Badge variant="outline" className="text-xs">
            {symbol}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div
          ref={chartRef}
          className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-b from-muted/5 to-muted/20 relative border border-card-border"
        />
      </div>

      {/* Chart Info */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>O: {formatPrice(candleData.at(-1)?.open || 0)}</span>
            <span>H: {formatPrice(candleData.at(-1)?.high || 0)}</span>
            <span>L: {formatPrice(candleData.at(-1)?.low || 0)}</span>
            <span>C: {formatPrice(candleData.at(-1)?.close || 0)}</span>
          </div>
          <div className="text-primary">Live Market Data</div>
        </div>
      </div>
    </Card>
  );
}

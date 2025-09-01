'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TradeMessage, useWebSocket } from '@/hooks/useWebsocket';
import { useTrading } from '@/providers/trading-context';
import { useRef } from 'react';

const assets = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'SOLUSDT', name: 'Solana' },
];
const formatPrice = (price: number) =>
  price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 4 : 2,
  });

const Assets = () => {
  // Mock assets data
  const bidRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const askRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { setSymbol } = useTrading();

  useWebSocket((data: TradeMessage) => {
    const { symbol, type, price } = data;

    if (type === 'BID' && bidRefs.current[symbol]) {
      bidRefs.current[symbol]!.textContent = formatPrice(price);
    } else if (type === 'ASK' && askRefs.current[symbol]) {
      askRefs.current[symbol]!.textContent = formatPrice(price);
    }
  });

  // useEffect(() => {
  //   const ws = new WebSocket('ws://localhost:8080');

  //   ws.onmessage = (event) => {
  //     try {
  //       const data: TradeMessage = JSON.parse(event.data);
  //       console.log(data);
  //       const { symbol, type, price, originalPrice } = data;

  //       if (type === 'BID' && bidRefs.current[symbol]) {
  //         bidRefs.current[symbol]!.textContent = formatPrice(price);
  //         console.log(bidRefs.current[symbol].textContent);
  //       } else if (type === 'ASK' && askRefs.current[symbol]) {
  //         askRefs.current[symbol]!.textContent = formatPrice(price);
  //       }
  //     } catch (err) {
  //       console.error('WS parse error', err);
  //     }
  //   };

  //   return () => ws.close();
  // }, []);
  return (
    <Card className="trading-card h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-title">Assets Chart</CardTitle>
        <div className="grid grid-cols-3 mt-4 gap-2 text-xs text-muted-foreground font-medium">
          <span className="text-center">Asset</span>
          <span className="text-center">Bid</span>
          <span className="text-center">Ask</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {assets.map((asset) => (
            <div
              onClick={() => setSymbol(asset.symbol)}
              key={asset.symbol}
              className="w-full grid grid-cols-3 gap-2 items-center py-3 px-3 rounded-lg hover:bg-accent/30 cursor-pointer transition-all duration-200 border border-transparent hover:border-accent/50"
            >
              {/* Asset Info */}
              <div className="space-y-1">
                <div className="font-semibold text-sm">{asset.symbol}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {asset.name}
                </div>
              </div>

              {/* Bid */}
              <div className="text-right">
                <div
                  ref={(el) => {
                    bidRefs.current[asset.symbol] = el;
                  }}
                  className="text-price text-sm font-semibold text-success"
                >
                  -
                </div>
              </div>

              {/* Ask */}
              <div className="text-right">
                <div
                  ref={(el) => {
                    askRefs.current[asset.symbol] = el;
                  }}
                  className="text-price text-sm font-semibold text-danger"
                >
                  -
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Assets;

'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';

interface AssetData {
  symbol: string;
  bid: number;
  ask: number;
}

function AsksBids() {
  const [assets, setAssets] = useState<Record<string, AssetData>>({});

  useEffect(() => {
    // Example: subscribe to BTCUSDT & ETHUSDT order book (best bid/ask)
    const symbols = ['btcusdt', 'ethusdt', 'bnbusdt'];
    const streams = symbols.map((s) => `${s}@bookTicker`).join('/');

    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg?.data?.s && msg?.data?.b && msg?.data?.a) {
        const symbol = msg.data.s;
        const bid = parseFloat(msg.data.b);
        const ask = parseFloat(msg.data.a);

        setAssets((prev) => ({
          ...prev,
          [symbol]: { symbol, bid, ask },
        }));
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <Card className="h-full border-card-border bg-card/50 backdrop-blur-sm">
      <div className="p-4 border-b border-card-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Assets Book</h3>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {Object.values(assets).length === 0 ? (
          <p className="text-xs text-muted-foreground">Connecting to market...</p>
        ) : (
          Object.values(assets).map((asset) => (
            <div
              key={asset.symbol}
              className="flex items-center justify-between text-sm border-b border-card-border py-1"
            >
              <span className="font-medium">{asset.symbol}</span>
              <div className="flex gap-4">
                <span className="text-green-500">Bid: {asset.bid.toFixed(2)}</span>
                <span className="text-red-500">Ask: {asset.ask.toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export default AsksBids;

// context/trading-context.tsx
'use client';
import { createContext, useContext, useState, ReactNode, useRef } from 'react';

type TradingContextType = {
  symbol: string;
  setSymbol: (s: string) => void;
  interval: string;
  setInterval: (i: string) => void;
};

const TradingContext = createContext<TradingContextType | null>(null);

export const TradingProvider = ({ children }: { children: ReactNode }) => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1m');

  return (
    <TradingContext.Provider
      value={{ symbol, setSymbol, interval, setInterval }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const ctx = useContext(TradingContext);
  if (!ctx) throw new Error('useTrading must be used inside TradingProvider');
  return ctx;
};

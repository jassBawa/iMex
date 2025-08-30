"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

type TradeMessage = {
  order: {
    type: "bid" | "ask";
    symbol: string;
    price: number;
    quantity: number;
    time: number;
  };
  currentPrice: {
    symbol: string;
    price: number;
    time: number;
  };
};

// 🔒 Static asset list
const staticAssets = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

export default function AssetsTable() {
  // refs for each asset cell
  const bidRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
  const askRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
  const signalRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      try {
        const data: TradeMessage = JSON.parse(event.data);
        if (data?.order?.symbol) {
          const { symbol, type, price } = data.order;

          const formatted = `$${price.toLocaleString()}`;

          if (type === "bid" && bidRefs.current[symbol]) {
            bidRefs.current[symbol]!.textContent = formatted;
            bidRefs.current[symbol]!.className =
              "text-right font-mono text-sm text-emerald-600 font-bold bg-emerald-50/50 px-2 py-1 rounded";
            if (signalRefs.current[symbol]) {
              signalRefs.current[symbol]!.innerHTML =
                `<div class="flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full">
                   <svg class="text-emerald-600 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 10l7-7 7 7"/></svg>
                 </div>`;
            }
          } else if (type === "ask" && askRefs.current[symbol]) {
            askRefs.current[symbol]!.textContent = formatted;
            askRefs.current[symbol]!.className =
              "text-right font-mono text-sm text-rose-600 font-bold bg-rose-50/50 px-2 py-1 rounded";
            if (signalRefs.current[symbol]) {
              signalRefs.current[symbol]!.innerHTML =
                `<div class="flex items-center justify-center w-6 h-6 bg-rose-100 rounded-full">
                   <svg class="text-rose-600 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 14l-7 7-7-7"/></svg>
                 </div>`;
            }
          }
        }
      } catch (err) {
        console.error("WS parse error", err);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardContent className="p-6">
        <Table>
          <TableCaption className="text-slate-500 font-medium mb-2">
            Live Market Data
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px] text-slate-700 font-semibold">
                Asset
              </TableHead>
              <TableHead className="text-slate-700 font-semibold">Signal</TableHead>
              <TableHead className="text-right text-slate-700 font-semibold">
                Bid
              </TableHead>
              <TableHead className="text-right text-slate-700 font-semibold">
                Ask
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staticAssets.map((symbol) => (
              <TableRow
                key={symbol}
                className="hover:bg-blue-50/60 hover:scale-[1.01] transition-all duration-200 border-slate-100 group animate-fade-in"
              >
                <TableCell className="flex items-center gap-3 font-semibold text-slate-800">
                  <Image
                    src={`/images/icons/${symbol
                      .toLowerCase()
                      .replace("usdt", "")}.png`}
                    alt={symbol}
                    width={18}
                    height={18}
                    className="rounded-full ring-2 ring-white shadow-sm group-hover:ring-blue-200 transition-all duration-200"
                  />
                  {symbol.replace("USDT", "")}
                </TableCell>
                <TableCell>
                  <div
                    ref={(el) => (signalRefs.current[symbol] = el)}
                    className="flex items-center justify-center w-6 h-6 bg-slate-100 rounded-full"
                  >
                    <span className="text-slate-400 text-xs">—</span>
                  </div>
                </TableCell>
                <TableCell
                  ref={(el) => (bidRefs.current[symbol] = el)}
                  className="text-right font-mono text-sm text-slate-400"
                >
                  —
                </TableCell>
                <TableCell
                  ref={(el) => (askRefs.current[symbol] = el)}
                  className="text-right font-mono text-sm text-slate-400"
                >
                  —
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

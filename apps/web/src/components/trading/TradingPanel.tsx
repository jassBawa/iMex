'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { useWebSocket } from '@/hooks/useWebsocket';
import { useTrading } from '@/providers/trading-context';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import z from 'zod';

const orderSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.number().min(0.00000001, 'Quantity must be > 0'),
  leverage: z.number().min(1, 'Leverage must be > 0'),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
});

type TradeMsg = {
  type: 'ASK' | 'BID';
  symbol: string;
  price: number;
  time: number;
};

type OrderInput = z.infer<typeof orderSchema>;

const DEC_PLACES_QTY = 8; // BTC precision

const isValidDecimal = (s: string, decimals = DEC_PLACES_QTY) => {
  if (s === '') return true;
  const v = s.replace(',', '.');
  const re = new RegExp(`^\\d*(?:\\.\\d{0,${decimals}})?$`);
  return re.test(v);
};
const toNumber = (s: string) => {
  if (!s) return 0;
  const v = s.replace(',', '.');
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const fmtUSD = (n: number) =>
  n
    ? `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '-';

export default function TradingPanel() {
  const { symbol } = useTrading();

  // live price
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  // shared inputs
  const [buyQty, setBuyQty] = useState<string>('');
  const [sellQty, setSellQty] = useState<string>('');
  const [leverage, setLeverage] = useState<number>(1);
  const orderMutation = useCreateOrder();
  const [error, setError] = useState<string | null>(null);

  // WebSocket: update price
  useWebSocket((msg: TradeMsg) => {
    if (msg.symbol !== symbol) return;
    setCurrentPrice(msg.price);
  });

  // margin = price × qty
  const buyMargin = useMemo(() => {
    const qty = toNumber(buyQty);
    return currentPrice && qty ? currentPrice * qty : 0;
  }, [buyQty, currentPrice]);

  const sellMargin = useMemo(() => {
    const qty = toNumber(sellQty);
    return currentPrice && qty ? currentPrice * qty : 0;
  }, [sellQty, currentPrice]);

  // position size = margin × leverage
  const buyPositionSize = useMemo(
    () => buyMargin * leverage,
    [buyMargin, leverage]
  );
  const sellPositionSize = useMemo(
    () => sellMargin * leverage,
    [sellMargin, leverage]
  );

  async function handlePlaceOrder(side: 'BUY' | 'SELL') {
    setError(null);

    try {
      const qty = side === 'BUY' ? toNumber(buyQty) : toNumber(sellQty);

      const input: OrderInput = {
        symbol,
        side,
        quantity: qty,
        leverage,
      };

      const parsed = orderSchema.parse(input);

      await orderMutation.mutateAsync(parsed);
    } catch (err: any) {
      setError(err.message || 'Validation failed');
    }
  }
  return (
    <Card className="trading-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-title">Trade {symbol}</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="buy" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="buy"
              className="flex items-center space-x-2 data-[state=active]:bg-success/10 data-[state=active]:text-success"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Buy</span>
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className="flex items-center space-x-2 data-[state=active]:bg-danger/10 data-[state=active]:text-danger"
            >
              <TrendingDown className="h-4 w-4" />
              <span>Sell</span>
            </TabsTrigger>
          </TabsList>

          {/* BUY */}
          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-4">
              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="buy-quantity" className="text-sm font-medium">
                  Quantity (BTC)
                </Label>
                <Input
                  id="buy-quantity"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.001"
                  className="text-price"
                  value={buyQty}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    if (isValidDecimal(v, DEC_PLACES_QTY)) setBuyQty(v);
                  }}
                  onBlur={(e) => {
                    let v = e.target.value.replace(',', '.');
                    if (v.endsWith('.')) v = v.slice(0, -1);
                    if (isValidDecimal(v)) setBuyQty(v);
                  }}
                />
              </div>

              {/* Leverage */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Leverage</Label>
                <div className="flex flex-col items-center gap-2 ">
                  {[1, 5, 10, 20].map((lev) => (
                    <Button
                      key={lev}
                      variant={lev === leverage ? 'default' : 'outline'}
                      size="lg"
                      className="w-full h-8"
                      onClick={() => setLeverage(lev)}
                    >
                      {lev}x
                    </Button>
                  ))}
                </div>
              </div>

              {/* Margin + Position size */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Margin</span>
                <span className="text-price font-semibold">
                  {fmtUSD(buyMargin)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Position Size</span>
                <span className="text-price font-semibold">
                  {fmtUSD(buyPositionSize)}
                </span>
              </div>

              <Button
                onClick={() => handlePlaceOrder('BUY')}
                className="w-full bg-success hover:bg-success/90 text-success-foreground"
              >
                Place Buy Order
              </Button>
            </div>
          </TabsContent>

          {/* SELL */}
          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-4">
              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="sell-quantity" className="text-sm font-medium">
                  Quantity (BTC)
                </Label>
                <Input
                  id="sell-quantity"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.001"
                  className="text-price"
                  value={sellQty}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    if (isValidDecimal(v, DEC_PLACES_QTY)) setSellQty(v);
                  }}
                  onBlur={(e) => {
                    let v = e.target.value.replace(',', '.');
                    if (v.endsWith('.')) v = v.slice(0, -1);
                    if (isValidDecimal(v)) setSellQty(v);
                  }}
                />
              </div>

              {/* Leverage */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Leverage</Label>
                <div className="flex flex-col gap-2">
                  {[1, 5, 10, 20].map((lev) => (
                    <Button
                      key={lev}
                      variant={lev === leverage ? 'default' : 'outline'}
                      size="lg"
                      className="w-full h-8"
                      onClick={() => setLeverage(lev)}
                    >
                      {lev}x
                    </Button>
                  ))}
                </div>
              </div>

              {/* Margin + Position size */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Margin</span>
                <span className="text-price font-semibold">
                  {fmtUSD(sellMargin)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Position Size</span>
                <span className="text-price font-semibold">
                  {fmtUSD(sellPositionSize)}
                </span>
              </div>

              <Button
                onClick={() => handlePlaceOrder('SELL')}
                className="w-full bg-danger hover:bg-danger/90 text-danger-foreground"
              >
                Place Sell Order
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TradingPanel = () => {
  return (
    <Card className="trading-card h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-title">Trade BTC/USD</CardTitle>
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

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buy-price" className="text-sm font-medium">
                  Price (USD)
                </Label>
                <Input
                  id="buy-price"
                  placeholder="45,207.88"
                  className="text-price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buy-quantity" className="text-sm font-medium">
                  Quantity (BTC)
                </Label>
                <Input
                  id="buy-quantity"
                  placeholder="0.001"
                  className="text-price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leverage" className="text-sm font-medium">
                  Leverage
                </Label>
                <div className="flex space-x-2">
                  {['1x', '5x', '10x', '20x'].map((leverage) => (
                    <Button
                      key={leverage}
                      variant={leverage === '1x' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 h-8"
                    >
                      {leverage}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-price font-semibold">~$45.21</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available</span>
                  <span className="text-price">$2,450.88</span>
                </div>
              </div>

              <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">
                Place Buy Order
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sell-price" className="text-sm font-medium">
                  Price (USD)
                </Label>
                <Input
                  id="sell-price"
                  placeholder="45,207.88"
                  className="text-price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sell-quantity" className="text-sm font-medium">
                  Quantity (BTC)
                </Label>
                <Input
                  id="sell-quantity"
                  placeholder="0.001"
                  className="text-price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leverage-sell" className="text-sm font-medium">
                  Leverage
                </Label>
                <div className="flex space-x-2">
                  {['1x', '5x', '10x', '20x'].map((leverage) => (
                    <Button
                      key={leverage}
                      variant={leverage === '1x' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 h-8"
                    >
                      {leverage}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-price font-semibold">~$45.21</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available</span>
                  <span className="text-price">0.0542 BTC</span>
                </div>
              </div>

              <Button className="w-full bg-danger hover:bg-danger/90 text-danger-foreground">
                Place Sell Order
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradingPanel;

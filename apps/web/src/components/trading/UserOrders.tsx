'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Clock, CheckCircle } from 'lucide-react';

// Mock data structure for orders
interface Order {
  id: string;
  asset: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  leverage: string;
  status: 'open' | 'closed';
  timestamp: string;
  total: number;
}

const mockOpenOrders: Order[] = [
  {
    id: '1',
    asset: 'BTC',
    type: 'buy',
    quantity: 0.001,
    price: 45207.88,
    leverage: '5x',
    status: 'open',
    timestamp: '14:32:01',
    total: 45.21,
  },
  {
    id: '2',
    asset: 'ETH',
    type: 'sell',
    quantity: 0.05,
    price: 2450.3,
    leverage: '2x',
    status: 'open',
    timestamp: '14:28:15',
    total: 122.52,
  },
];

const mockClosedOrders: Order[] = [
  {
    id: '3',
    asset: 'BTC',
    type: 'buy',
    quantity: 0.002,
    price: 44890.5,
    leverage: '1x',
    status: 'closed',
    timestamp: '13:45:22',
    total: 89.78,
  },
];

const Orders = () => {
  return (
    <Card className="trading-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-title">Orders</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="open" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="open"
              className="flex items-center space-x-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Clock className="h-4 w-4" />
              <span>Open Orders</span>
            </TabsTrigger>
            <TabsTrigger
              value="closed"
              className="flex items-center space-x-2 data-[state=active]:bg-success/10 data-[state=active]:text-success"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Closed Orders</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="space-y-3">
            {mockOpenOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No open orders
              </div>
            ) : (
              <div className="space-y-2">
                {mockOpenOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={order.type === 'buy' ? 'default' : 'secondary'}
                        className={
                          order.type === 'buy'
                            ? 'bg-success/10 text-success'
                            : 'bg-danger/10 text-danger'
                        }
                      >
                        {order.type.toUpperCase()}
                      </Badge>
                      <div>
                        <div className="font-semibold">{order.asset}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.quantity} @ ${order.price.toLocaleString()} (
                          {order.leverage})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-price">
                          ${order.total}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.timestamp}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="closed" className="space-y-3">
            {mockClosedOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No closed orders
              </div>
            ) : (
              <div className="space-y-2">
                {mockClosedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="opacity-70">
                        {order.type.toUpperCase()}
                      </Badge>
                      <div>
                        <div className="font-semibold">{order.asset}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.quantity} @ ${order.price.toLocaleString()} (
                          {order.leverage})
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold text-price">
                        ${order.total}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Orders;

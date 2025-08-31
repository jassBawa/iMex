interface Balance {
  currency: string,
  amount: number;
}

export interface User {
  createdAt: Date;
  email: string;
  password: string;
  name: string;
  id: string;

  balance: Balance
  positions: string[] // list of orderids
}

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  margin: number;
  leverage: number;
  
  openPrice: number;
  closePrice?: number;
  status: "OPEN" | "CLOSED"

  stopLoss?: number;
  takeProfit?:number;

  createdAt: Date;
  closedAt?: Date;

  pnl?: number;

}

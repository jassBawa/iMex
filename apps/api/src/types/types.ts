interface Balance {
  amount: number;
}

export interface User {
  createdAt: Date;
  email: string;
  password: string;
  name: string;
  id: string;

  balance: Balance
  order: string[] // list of orderids
}

export interface Order {
  createdAt: Date;
  id: string;
  openPrice: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  symbol: string;
  userId: string;
}

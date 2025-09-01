import type { Message } from '../lib/redisClient';
import { orderMap, userMap } from '../memoryDb';
import type { Order, User } from '../types/types';

export async function checkLiquidity(data: Message) {
  const orders = Array.from(orderMap.values());

  const filteredOrders = orders.filter(
    (order) => data.symbol.toLowerCase() === order.symbol.toLowerCase()
  );

  filteredOrders.forEach((order) => {
    let pnl = 0;
    if (order.side === 'BUY') {
      pnl = (data.price - order.openPrice) * order.quantity;
    } else {
      pnl = (order.openPrice - data.price) * order.quantity;
    }

    // stoploss
    if (order.stopLoss && pnl < 0 && Math.abs(pnl) >= order.stopLoss) {
      liquidate(order, data.price, pnl);
      return;
    }

    // profit
    if (order.takeProfit && pnl > 0 && pnl >= order.takeProfit) {
      liquidate(order, data.price, pnl);
      return;
    }

    // margin
    if (pnl < 0 && Math.abs(pnl) >= order.margin) {
      liquidate(order, data.price, pnl);
      return;
    }
  });
}

function liquidate(order: Order, closePrice: number, pnl: number) {
  const users = Array.from(userMap.values());
  const user = users.find((user) => user.positions.includes(order.id));

  if (!user) {
    console.error('No user found for this user id');
    return;
  }

  const updateOrder: Order = {
    ...order,
    closedAt: new Date(),
    closePrice: closePrice,
    status: 'CLOSED',
    pnl,
  };

  orderMap.set(order.id, updateOrder);

  const updateUser: User = {
    ...user,
    balance: {
      ...user.balance,
      amount: user.balance.amount + (order.margin + pnl),
    },
  };

  userMap.set(user.id, updateUser);
  console.log('liquidity hit');
}

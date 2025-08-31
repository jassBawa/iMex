import {randomUUID} from 'crypto'
import type { Request, Response } from 'express';
import { getCurrentPrice } from '../lib/redisClient';
import { orderMap, userMap } from '../memoryDb';
import type { Order } from '../types/types';

export async function createOrder(req: Request, res: Response) {
  try {
    const { symbol, side, quantity, leverage, stopLoss, takeProfit } = req.body;
    const user = userMap.get(req.userId);

    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }
    const price = getCurrentPrice();

    if (!price) {
      return res.status(500).json({ error: 'Price feed not available' });
    }

    const orderSide = side.toUpperCase() as 'BUY' | 'SELL';
    const marginRequired = (quantity * price) / leverage;

    if (user.balance.amount < marginRequired) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // decrease balance
    user.balance.amount -= marginRequired;

    const newOrder: Order = {
      createdAt: new Date(),
      id: randomUUID(),
      margin: marginRequired,
      leverage,

      stopLoss,
      takeProfit,
      status: 'OPEN',
      userId: user.id,
      openPrice: price,
      quantity: quantity,
      side: orderSide,
      symbol,
    };

    orderMap.set(newOrder.id, newOrder);
    user.positions.push(newOrder.id);

    return res.status(201).json({
      message: 'Order created successfully',
      order: newOrder,
      balance: user.balance,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
}

export async function getPositions(req: Request, res: Response) {
  try {
    const user = userMap.get(req.userId);

    if (!user) {
      res.status(400).json({ error: 'No user found' });
      return;
    }

    const positions = user.positions;

    res.status(200).json({
      positions,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch positions' });
  }
}

export async function closeOrder(req: Request, res: Response) {
  try {
    const user = userMap.get(req.userId);
    const { orderId } = req.body;
    console.log(req.body, user)
    if (!user) {
      res.status(400).json({ error: 'No user found' });
      return;
    }

    if (!orderMap.has(orderId)) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const order = orderMap.get(orderId);
    if (!order) {
      return;
    }
    if (order?.status === 'CLOSED') {
      res.status(400).json({ error: 'Order already closed' });
      return;
    }

    const exitPrice = getCurrentPrice();

    if (!exitPrice) {
      res.status(500).json({ error: 'Current price fetching failed' });
      return;
    }
    let pnl = 0;
    if (order?.side === 'BUY') {
      pnl = (exitPrice - order.openPrice) * order.quantity;
    } else {
      pnl = (order?.openPrice - exitPrice) * order.quantity;
    }

    order.status = 'CLOSED';
    order.closePrice = exitPrice;
    order.pnl = pnl;

    user.balance.amount += order.margin + pnl;

    res.status(200).json({
      message: 'Order closed',
      order,
      newBalance: user?.balance,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch positions' });
  }
}

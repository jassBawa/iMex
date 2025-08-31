import type { Request, Response } from 'express';
import { orderMap, userMap } from '../memoryDb';
import { randomUUIDv7 } from 'bun';
import { currentPrice } from '../lib/redisClient';
import type { Order, User } from '../types/types';
import { parse, symbol } from 'zod';

interface OrderDto {
  asset: string;
  type: 'buy' | 'sell';
  margin: number;
  leverage: number;
}

export async function createOrder(req: Request, res: Response) {
  try {
    const { asset, type, margin, leverage } = req.body as OrderDto;

    const order: OrderDto = {
      asset,
      type,
      margin: Number(margin), //
      leverage: Number(leverage),
    };


    if(currentPrice){
        // todo: check this approach
        return;
    }

    const user = userMap.values().find((user) => user.id === req.userId)

    if(!user){
        res.status(400).json({error: "User not found"})
        return;
    }


     let result;
    if (order.type === "buy") {
      result = await handleBuy(order, user);
    } else if (order.type === "sell") {
      result = await handleSell(order, user);
    }
    return res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
}

async function handleBuy(order: OrderDto, user: User) {
    // order
    const quantity = order.margin * order.leverage;
    
    const parsedOrder: Order  = {
        createdAt: new Date(),
        id: randomUUIDv7(),
        openPrice: currentPrice,        
        quantity: quantity,
        side: "BUY" as "BUY",
        symbol: order.asset,
        userId: user.id   
    }
    orderMap.set(parsedOrder.id, parsedOrder)
    console.log(parsedOrder)

  return {
    orderId: parsedOrder.id,
    symbol: order.asset,
    quantity,
    openPrice: parsedOrder.openPrice
  }

}


async function handleSell(order: OrderDto, user: User) {


  return {
    ...order,
    status: "open",
    executedPrice: 100.5, // get live price from candles service
  };
}
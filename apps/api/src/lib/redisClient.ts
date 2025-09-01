import Redis from 'ioredis';
import { checkLiquidity } from '../liquidation';

const subscriber = new Redis();

let currentPrice: number | null = null;

subscriber.subscribe('bidsAsks', (err, count) => {
  if (err) {
    console.error('Failed to subscribe:', err);
    return;
  }
  console.log(
    `Subscribed successfully! This client is currently subscribed to ${count} channels.`
  );
});

export interface Message {
  type: string;
  symbol: string;
  price: number;
  quantity: number;
  time: number;
  originalPrice: number;
}

subscriber.on('message', (channel, message) => {
  try {
    const parsedData = JSON.parse(message) as Message;
    if (parsedData?.price !== undefined) {
      currentPrice = parsedData.price;
      checkLiquidity(parsedData);
    }
  } catch (err) {
    console.error('Invalid JSON from Redis:', err);
  }
});

export function getCurrentPrice(): number | null {
  return currentPrice;
}

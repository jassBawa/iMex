import Redis from 'ioredis';
import { parse } from 'zod';

const subscriber = new Redis();

await subscriber.subscribe('bidsAsks');

let currentPrice: number;

subscriber.on('message', (channel, message) => {
  const parsedData = JSON.parse(message);
  console.log(parsedData);
  currentPrice = parsedData.price;
});

export { currentPrice };

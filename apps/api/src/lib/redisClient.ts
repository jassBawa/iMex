import Redis from 'ioredis';

const subscriber = new Redis();

let currentPrice: number | null = null;

subscriber.subscribe('bidsAsks', (err, count) => {
  if (err) {
    console.error("Failed to subscribe:", err);
    return;
  }
  console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
});

subscriber.on('message', (channel, message) => {
  try {
    const parsedData = JSON.parse(message);
    if (parsedData?.order.price !== undefined) {
      currentPrice = parsedData.order.price;
    }
  } catch (err) {
    console.error("Invalid JSON from Redis:", err);
  }
});

export function getCurrentPrice(): number | null {
  return currentPrice;
}

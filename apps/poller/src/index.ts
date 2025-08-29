import WebSocket from 'ws';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const publisher = new Redis();

const tradeQueue = new Queue('binance-trade', {
  connection: { host: '127.0.0.1', port: 6379 },
});

async function main() {
  try {
    // await publisher.connect();
    const binanceWs = new WebSocket(
      'wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade'
    );

    binanceWs.on('message', async (raw) => {
      const msg = JSON.parse(raw.toString());
      const trade = msg.data as BinanceTrade;

      //queue
      tradeQueue.add('binance-trade', trade, {
        removeOnComplete: true,
        removeOnFail: true,
      });

      // pub
      const side = trade.m ? 'ask' : 'bid';
      const order = {
        type: side,
        symbol: trade.s,
        price: parseFloat(trade.p),
        quantity: parseFloat(trade.q),
        time: trade.T,
      };

      // price * 1.001 -> ask 
      // price * 0.099 -> bid
      const currentPrice = {
        symbol: trade.s,
        price: parseFloat(trade.p),
        time: trade.T,
      };

      // Publish to Redis
      await publisher.publish(
        'bidsAsks',
        JSON.stringify({
          order,
          currentPrice,
        })
      );
    });

    binanceWs.on('error', (err) => {
      console.error('Error:', err);
    });
  } catch (err) {
    console.log(err);
  }
}
main();

interface BinanceTrade {
  e: 'trade'; // event type
  E: number; // event time (ms)
  s: string; // symbol (BTCUSDT, ETHUSDT etc.)
  t: number; // trade id
  p: string; // price
  q: string; // quantity
  T: number; // trade time
  m: boolean; // is buyer maker
  M: boolean; // ignore
}

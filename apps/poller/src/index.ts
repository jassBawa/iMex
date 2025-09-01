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
      'wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/solusdt@trade'
    );

    binanceWs.on('message', async (raw) => {
      const msg = JSON.parse(raw.toString());
      const trade = msg.data as BinanceTrade;

      //queue
      tradeQueue.add('binance-trade', trade, {
        removeOnComplete: true,
        removeOnFail: true,
      });

      // constants
      const ASKCONSTANT = 1.01;
      const BIDCONSTANT = 0.99;
      const basePrice = parseFloat(trade.p);

      const side = trade.m ? 'ASK' : 'BID';
      const adjustedPrice =
        side === 'ASK' ? basePrice * ASKCONSTANT : basePrice * BIDCONSTANT;

      // todo: add decimals here
      const order = {
        type: side,
        symbol: trade.s,
        side: side,
        originalPrice: basePrice,
        price: adjustedPrice,
        quantity: parseFloat(trade.q),
        time: trade.T,
      };

      await publisher.publish('bidsAsks', JSON.stringify(order));
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
  M: boolean;
}

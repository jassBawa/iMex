import WebSocket from 'ws';
import { getDbClient } from '@repo/db';

const dbClient = getDbClient();
let batch: BinanceTrade[] = [];

async function main() {
  try {
    const ws = new WebSocket(
      'wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade'
    );

    ws.on('message', (raw) => {
      console.log(JSON.parse(raw.toString()));
      const msg = JSON.parse(raw.toString());

      // Binance multi-stream sends { stream, data }
      const trade = msg.data as BinanceTrade;

      batch.push(trade);
    });

    setInterval(async () => {
      if (batch.length > 0) {
        const toInsert = batch.splice(0, batch.length); // take all trades
        await insertBatch(toInsert);
      }
    }, 5000);

    ws.on('error', (err) => {
      console.error('Error:', err);
    });
  } catch (err) {
    console.log(err);
  } finally {
  }
}
main();

interface BinanceTrade {
  E: number;      // event time
  s: string;      // symbol
  p: string;      // price
  q: string;      // quantity
  t: number;      // trade ID
  m: boolean;     // is buyer maker
}

async function insertBatch(trades: BinanceTrade[]) {
  const values: any[] = [];
  const placeholders = trades
    .map((t, i) => {
      // todo: check how its done
      const base = i * 6; // 6 columns now
      values.push(
        new Date(t.E),
        t.s,
        parseFloat(t.p),
        parseFloat(t.q),
        t.t,
        t.m ? "sell" : "buy" // side
      );
      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`;
    })
    .join(',');

 const query = `
    INSERT INTO trades (time, symbol, price, volume, trade_id, side)
    VALUES ${placeholders};
  `;

  await dbClient.query(query, values);
}

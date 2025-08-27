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
      const msg = JSON.parse(raw.toString());

      // Binance multi-stream sends { stream, data }
      const trade = msg.data as BinanceTrade;

      //db
      batch.push(trade);

      //pub
      // publiser.set("channle:trade", trade)
    });

    setInterval(async () => {
      if (batch.length > 0) {
        const toInsert = batch.splice(0, batch.length);
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
  try{

  console.log('Inserted batch values')
  const values: any[] = [];
  const placeholders = trades
    .map((t, i) => {
      const base = i * 4; // mapping variables - $1 $2
      values.push(
        new Date(t.E),
        t.s,
        parseFloat(t.p),
        parseFloat(t.q),
      );
      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
    })
    .join(',');

 const query = `
    INSERT INTO trades (time, symbol, price, volume)
    VALUES ${placeholders};
  `;

  await dbClient.query(query, values);
  }
catch(err){
  console.log(err)
}
}

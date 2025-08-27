import WebSocket from 'ws';
import { Queue } from "bullmq";

const tradeQueue = new Queue("binance-trade", {
  connection: { host: "127.0.0.1", port: 6379 },
});


async function main() {
  try {
    const ws = new WebSocket(
      'wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade'
    );

    ws.on('message', (raw) => {
      const msg = JSON.parse(raw.toString());  
      const trade = msg.data;

      //queue
       tradeQueue.add("binance-trade", trade, {
        removeOnComplete: true,
        removeOnFail: true,
      });

    });


    ws.on('error', (err) => {
      console.error('Error:', err);
    });
  } catch (err) {
    console.log(err);
  } 
}
main();
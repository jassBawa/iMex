import { getDbClient } from "@repo/db";
import { Worker } from "bullmq";

const dbClient = getDbClient();

interface BinanceTrade {
  E: number; // event time (ms)
  s: string; // symbol
  p: string; // price
  q: string; // quantity
  t: number; // trade id
}

const BATCH_SIZE = 50;
const FLUSH_INTERVAL = 2000;

let buffer: BinanceTrade[] = [];
let flushTimer: NodeJS.Timeout | null = null;

async function flushBuffer() {
  if (!buffer.length) return;

  const trades = buffer.splice(0, buffer.length);
  const values: any[] = [];
  const placeholders = trades.map((t, i) => {
    const idx = i * 4;
    values.push(t.E, t.s, parseFloat(t.p), parseFloat(t.q));
    return `(to_timestamp($${idx + 1} / 1000.0), $${idx + 2}, $${idx + 3}, $${idx + 4})`;
  });

  try {
    await dbClient.query(
      `INSERT INTO trades (time, symbol, price, volume) VALUES ${placeholders.join(",")}`,
      values
    );
    console.log(`✅ Inserted ${trades.length} trades`);
  } catch (err) {
    console.error("❌ DB insert failed", err);

  }
}

new Worker(
  "binance-trade",
  async (job) => {
    buffer.push(job.data as BinanceTrade);

    if (buffer.length >= BATCH_SIZE) {
      await flushBuffer();
    }

    if (!flushTimer) {
      flushTimer = setTimeout(async () => {
        await flushBuffer();
        flushTimer = null;
      }, FLUSH_INTERVAL);
    }
  },
  { connection: { host: "127.0.0.1", port: 6379 } }
)
  .on("ready", () => console.log("👷 Worker ready..."))
  .on("completed", (job) => console.log(`⚡ Job ${job.id} buffered`))
  .on("failed", (job, err) => console.error(`❌ Job ${job?.id} failed:`, err));

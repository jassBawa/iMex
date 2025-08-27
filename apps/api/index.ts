import express from 'express';
import { getDbClient } from '@repo/db';

const dbClient = getDbClient();

const app = express();

const VIEWS: Record<string, string> = {
  '1m': 'trades_candlestick_1m',
  '5m': 'trades_candlestick_5m',
  '10m': 'trades_candlestick_10m',
  '30m': 'trades_candlestick_30m',
  '1d': 'trades_candlestick_1d',
};

app.get('/candles', async (req, res) => {
  try {
    const { symbol, view } = req.query as {
      symbol: string;
      view: string;
    };

    if (!symbol && !view) 
        {
      console.log('symbol view missing');
      return;
    }

    const tableName = VIEWS[view]; // e.g., "trades_candlestick_5m"

    if (!tableName) {
      return res.status(400).json({ error: 'Invalid interval/view' });
    }

    const query = `
    SELECT bucket, open, high, low, close, volume
    FROM ${tableName}
    WHERE symbol = $1
    ORDER BY bucket DESC
    LIMIT 500;
    `;

    const { rows } = await dbClient.query(query, [symbol]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

app.listen(4000, () => {
  console.log('server started');
});

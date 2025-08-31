import { getDbClient } from "@repo/db";
import type { Request, Response } from "express";

const dbClient = getDbClient();

const VIEWS: Record<string, string> = {
  '1m': 'trades_candlestick_1m',
  '5m': 'trades_candlestick_5m',
  '10m': 'trades_candlestick_10m',
  '30m': 'trades_candlestick_30m',
  '1d': 'trades_candlestick_1d',
};


export async function candlesHandler(req: Request, res: Response) {
  const { symbol, interval } = req.query as { symbol: string; interval: string };
    const tableName = VIEWS[interval];
  if (!tableName) {
    throw res.status(400).json({error: "Invalid Interval"});
  }

  const query = `
    SELECT bucket, open, high, low, close, volume
    FROM ${tableName}
    WHERE symbol = $1
    ORDER BY bucket DESC
    LIMIT 500;
  `;

  const { rows } = await dbClient.query(query, [symbol.toUpperCase()]);
  return rows;
  res.json(rows);
}

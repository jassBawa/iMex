export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  max?: number; // max number of clients in pool
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}
// dbClient.ts
import { Client } from "pg";

let dbClient: Client | null = null;

export function getDbClient() {
  if (!dbClient) {
    dbClient = new Client("postgres://postgres:password@localhost/postgres");
    dbClient.connect()
      .then(() => console.log("Connected to PostgreSQL"))
      .catch(err => console.error("PostgreSQL connection error", err));
  }
  return dbClient;
}

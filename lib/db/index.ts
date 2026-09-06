import { neon } from "@neondatabase/serverless";
import { type NeonHttpDatabase, drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

type Database = NeonHttpDatabase<typeof schema>;

let instance: Database | null = null;

function connect(): Database {
  if (instance) {
    return instance;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add your Neon connection string to .env");
  }

  instance = drizzle({ client: neon(connectionString), schema });

  return instance;
}

export const db = new Proxy({} as Database, {
  get(_target, property, receiver) {
    const real = connect();
    const value = Reflect.get(real, property, receiver);

    return typeof value === "function" ? value.bind(real) : value;
  },
});

export * from "./schema";

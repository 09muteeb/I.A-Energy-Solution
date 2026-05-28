import { getDb } from "../api/queries/connection";
import { sql } from "drizzle-orm";

async function dropTables() {
  const db = getDb();
  console.log("Dropping all tables...");
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`);
  await db.execute(sql`DROP TABLE IF EXISTS cart_items, contacts, order_items, orders, products, reservation_requests, users, __drizzle_migrations;`);
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);
  console.log("Tables dropped.");
  process.exit(0);
}

dropTables();

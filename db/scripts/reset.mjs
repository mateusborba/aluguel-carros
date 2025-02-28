import { db } from "../drizzle";

await db.execute(`
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
`);

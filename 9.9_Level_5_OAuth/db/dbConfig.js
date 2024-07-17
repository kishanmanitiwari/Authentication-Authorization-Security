import pg from "pg";

const db = new pg.Client({
  user: process.env.PG_USER,
  host: "localhost",
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: 5432,
});

db.connect();

export default db;

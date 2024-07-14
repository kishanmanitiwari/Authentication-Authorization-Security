import pg from 'pg';

export const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "basicAuth",
    password: "kkmani2001",
    port: 5432,
  });
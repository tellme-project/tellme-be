import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './types';

const dialect = new PostgresDialect({
  pool: async () =>
    new Pool({
      connectionString: process.env.DATABASE_URL as string,
    }),
});

const db = new Kysely<Database>({
  dialect,
});

export default db;
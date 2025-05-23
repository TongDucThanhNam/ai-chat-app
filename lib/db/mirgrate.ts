// import { drizzle } from 'drizzle-orm/postgres-js';
import {drizzle} from "drizzle-orm/neon-http"
import {migrate} from 'drizzle-orm/neon-http/migrator';
import {neon} from "@neondatabase/serverless"

// import postgres from 'postgres';
//env
import dotenv from 'dotenv';

dotenv.config();

const runMigrate = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const connection = neon(process.env.DATABASE_URL, {});
    const db = drizzle(connection);

    console.log('⏳ Running migrations...');

    const start = Date.now();
    await migrate(db, {migrationsFolder: './lib/db/migrations'});
    const end = Date.now();

    console.log('✅ Migrations completed in', end - start, 'ms');
    process.exit(0);
};

runMigrate().catch((err) => {
    console.error('❌ Migration failed');
    console.error(err);
    process.exit(1);
});

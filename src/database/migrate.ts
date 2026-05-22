import fs from 'fs/promises';
import path from 'path';
import pool from '../config/database.ts';

async function runSqlFile(filePath: string) {
  const sql = await fs.readFile(filePath, 'utf8');
  if (!sql.trim()) return;
  await pool.query(sql);
}

async function run() {
  try {
    const migrationsDir = path.resolve('src/database/migrations');
    const seedsDir = path.resolve('src/database/seeds');

    console.log('Reading migrations from', migrationsDir);
    const migrationFiles = await fs.readdir(migrationsDir);
    migrationFiles.sort();
    for (const file of migrationFiles) {
      if (!file.endsWith('.sql')) continue;
      const full = path.join(migrationsDir, file);
      console.log('Applying migration', file);
      await runSqlFile(full);
    }

    console.log('Reading seeds from', seedsDir);
    const seedFiles = await fs.readdir(seedsDir);
    seedFiles.sort();
    for (const file of seedFiles) {
      if (!file.endsWith('.sql')) continue;
      const full = path.join(seedsDir, file);
      console.log('Running seed', file);
      await runSqlFile(full);
    }

    console.log('Migrations and seeds applied successfully.');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    try { await pool.end(); } catch (e) {}
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('migrate.ts')) {
  run();
}

export default run;

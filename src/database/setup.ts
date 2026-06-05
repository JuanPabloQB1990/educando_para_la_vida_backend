import pool from '../config/database.ts';

async function setupDatabase() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS tipo_documento (
      id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
      nombre VARCHAR(100) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS grado_educacion (
      id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
      nombre VARCHAR(150) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS tipo_estudio (
      id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
      nombre VARCHAR(150) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS tiempo_validacion (
      id VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
      tiempo INT NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log('Database setup complete.');
}

export default setupDatabase;

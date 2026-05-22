import pool from '../config/database.ts';

async function setupDatabase() {
  // Create tables
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS tipo_documento (
      id_tipo_documento VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
      nombre VARCHAR(100) NOT NULL UNIQUE
    ) ENGINE=InnoDB;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS grado_educacion (
      id_grado_educacion VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
      nombre VARCHAR(150) NOT NULL UNIQUE
    ) ENGINE=InnoDB;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS tipo_estudio (
      id_tipo_estudio VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
      nombre VARCHAR(150) NOT NULL UNIQUE
    ) ENGINE=InnoDB;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS tiempo_validacion (
      id_tiempo_validacion VARCHAR(100) PRIMARY KEY DEFAULT (UUID()),
      tiempo INT NOT NULL UNIQUE
    ) ENGINE=InnoDB;
  `);

  // Seed data (use INSERT IGNORE pattern)
  const tipoDocumentos = ['C.C', 'D.E', 'T.I.'];
  for (const nombre of tipoDocumentos) {
    await pool.execute('INSERT IGNORE INTO tipo_documento (nombre) VALUES (?)', [nombre]);
  }

  const grados = [
    'Maternal','Prejardin','Jardín','Transición','Primero','Segundo','Tercero','Cuarto','Quinto','Sexto','Séptimo','Octavo','Noveno','Décimo','Once'
  ];
  for (const nombre of grados) {
    await pool.execute('INSERT IGNORE INTO grado_educacion (nombre) VALUES (?)', [nombre]);
  }

  const tiposEstudio = ['Educacion formal','Validacion de grados','Media Tecnica','Curso Preicfes'];
  for (const nombre of tiposEstudio) {
    await pool.execute('INSERT IGNORE INTO tipo_estudio (nombre) VALUES (?)', [nombre]);
  }

  const tiempos = [6,12,18,24];
  for (const tiempo of tiempos) {
    await pool.execute('INSERT IGNORE INTO tiempo_validacion (tiempo) VALUES (?)', [tiempo]);
  }

  console.log('Database setup complete (tables created and seeded).');
}

export default setupDatabase;

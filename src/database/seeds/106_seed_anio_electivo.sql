-- Seed: 106_seed_anio_electivo.sql
-- Insert current and previous year as example
INSERT IGNORE INTO anio_electivo (anio, estado) VALUES
  (YEAR(CURDATE()), 'activo'),
  (YEAR(CURDATE())-1, 'cerrado');

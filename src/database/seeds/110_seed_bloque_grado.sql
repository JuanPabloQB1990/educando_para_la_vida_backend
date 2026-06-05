-- Seed: 110_seed_bloque_grado.sql
-- bloque 1: Sexto, Séptimo | bloque 2: Octavo, Noveno | bloque 3: Décimo, Once
INSERT INTO bloque_grado (id_bloque, id_grado_educacion)
SELECT b.id, g.id
FROM bloque b
JOIN grado_educacion g ON (
  (b.nombre = 'bloque 1' AND g.nombre IN ('Sexto', 'Séptimo'))
  OR (b.nombre = 'bloque 2' AND g.nombre IN ('Octavo', 'Noveno'))
  OR (b.nombre = 'bloque 3' AND g.nombre IN ('Décimo', 'Once'))
)
WHERE NOT EXISTS (
  SELECT 1 FROM bloque_grado bg
  WHERE bg.id_bloque = b.id
    AND bg.id_grado_educacion = g.id
);

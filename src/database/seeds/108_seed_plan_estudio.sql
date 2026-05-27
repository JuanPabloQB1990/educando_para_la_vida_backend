-- Seed: 108_seed_plan_estudio.sql
-- Primero–Once (12 materias base) + Décimo y Once (Bachiller Comercial adicional)
-- Maternal, Prejardin, Jardín, Transición (10 materias preescolar)
INSERT INTO plan_estudio (id_grado_educacion, id_materia)
SELECT g.id_grado_educacion, m.id_materia
FROM grado_educacion g
JOIN materia m ON (
  (
    g.nombre IN ('Primero','Segundo','Tercero','Cuarto','Quinto','Sexto','Séptimo','Octavo','Noveno','Décimo','Once')
    AND m.nombre_materia IN (
      'Ciencias Naturales/Ed.Ambiental Y Biología',
      'Convivencia',
      'Ciencias Sociales',
      'Ed. Artística',
      'Etica Y Valores',
      'Ed. Física/ Recreación Y Deporte',
      'Religión',
      'Lengua Castellana',
      'Idioma Extrajero (Inglés)',
      'Matemáticas',
      'Tecnologia E Informatica',
      'Emprendimiento'
    )
  )
  OR (
    g.nombre IN ('Maternal','Prejardin','Jardín','Transición')
    AND m.nombre_materia IN (
      'Dimension Corporal',
      'Emprendimiento',
      'Convivencia',
      'Tecnologia E Informatica',
      'Idioma Extrajero (Inglés)',
      'Ed. Física/ Recreación Y Deporte',
      'Dimension Estetica',
      'Dimension Etica Y Valores',
      'Dimension Cognitiva',
      'Dimension Comunicativa'
    )
  )
  OR (
    g.nombre IN ('Décimo','Once')
    AND m.nombre_materia = 'Bachiller Comercial con enfasis en emprendimiento'
  )
)
WHERE NOT EXISTS (
  SELECT 1 FROM plan_estudio pe
  WHERE pe.id_grado_educacion = g.id_grado_educacion
    AND pe.id_materia = m.id_materia
);

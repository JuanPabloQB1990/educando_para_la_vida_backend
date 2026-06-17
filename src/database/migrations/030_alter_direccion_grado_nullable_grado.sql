-- Migration: 030_alter_direccion_grado_nullable_grado.sql
-- Hace id_grado_educacion nullable en direccion_grado
ALTER TABLE direccion_grado
  DROP FOREIGN KEY fk_dg_grado,
  MODIFY COLUMN id_grado_educacion VARCHAR(100) NULL,
  ADD CONSTRAINT fk_dg_grado FOREIGN KEY (id_grado_educacion) REFERENCES grado_educacion(id) ON DELETE SET NULL;

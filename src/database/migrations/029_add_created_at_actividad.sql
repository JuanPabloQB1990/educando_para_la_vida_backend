-- Migration: 029_add_created_at_actividad.sql
ALTER TABLE actividad
  ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

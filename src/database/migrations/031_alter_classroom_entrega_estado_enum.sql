-- Migration: 031_alter_classroom_entrega_estado_enum.sql
-- Corrige el ENUM de estado en classroom_entrega para que coincida con los valores del sistema
ALTER TABLE classroom_entrega
  MODIFY COLUMN estado ENUM('pendiente','aprovado','corregido') NOT NULL DEFAULT 'pendiente';

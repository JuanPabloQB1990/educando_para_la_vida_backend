import { v4 as uuidv4 } from 'uuid';

/** PK legible: ISO-8601 + UUID v4 (requiere columna VARCHAR en MySQL). */
export function generatePrimaryKey(): string {
  const dt = new Date();
  return `${dt.toISOString()}_${uuidv4()}`;
}

import Database from 'better-sqlite3';

export interface DbPoint {
  id: number;
  type: 'RC' | 'ZW';
  city: string;
  name: string;
  address: string;
  materials: string[];
}

const db = new Database('recycle.db');

export function getPoints(city: string, type: 'RC' | 'ZW', offset = 0, limit = 20): DbPoint[] {
  const stmt = db.prepare('SELECT * FROM points WHERE city = ? AND type = ? LIMIT ? OFFSET ?');
  const rows = stmt.all(city, type, limit, offset) as unknown[];
  return rows.map((r: any) => ({ ...r, materials: JSON.parse(r.materials) }));
}

export function countPoints(city: string, type: 'RC' | 'ZW'): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM points WHERE city = ? AND type = ?');
  const row = stmt.get(city, type) as { count: number };
  return row.count;
}

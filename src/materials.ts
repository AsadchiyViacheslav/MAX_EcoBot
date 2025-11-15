export const materialDict: Record<string, string> = {
  PLASTIK: 'Пластик',
  BUMAGA: 'Бумага',
  INOE: 'Разное',
  BATAREJKI: 'Батарейки',
  KRYSHECHKI: 'Крышечки',
  LAMPOCHKI: 'Лампочки',
  OPASNYE_OTHODY: 'Опасные отходы',
  ODEZHDA: 'Одежда',
  STEKLO: 'Стекло',
  METALL: 'Металл',
  TETRA_PAK: 'Tetra Pak',
  BYTOVAJA_TEHNIKA: 'Бытовая техника',
  SHINY: 'Шины',
  DRINK: 'Напитки',
  WATER: 'Вода',
  CHEM: 'Химия',
  BOOK: 'Книги',
  GROCERY: 'Продукты',
  FOOD: 'Еда',
  SHOP: 'Магазины',
  VARIED: 'Разное',
  MILK: 'Молоко'
};

export function translateMaterials(materials: string[]): string[] {
  return materials.map(m => materialDict[m] || m);
}

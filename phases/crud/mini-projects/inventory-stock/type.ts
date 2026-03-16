export interface InventoryItem {
  sku: string;
  name: string;
  stock: number;
  reservedStock: number;
  reorderThreshold: number;
  lastRestockedAt: Date;
}

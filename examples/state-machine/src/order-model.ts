// هر حالت، دقیقاً با داده‌های تضمین‌شده‌اش — فصل ۳۶
export interface Address {
  city: string;
  street: string;
  postalCode: string;
}

export interface LineItem {
  sku: string;
  qty: number;
  unitPrice: number;
}

export type Order =
  | { status: "draft"; items: LineItem[] }
  | { status: "placed"; items: readonly LineItem[]; address: Address; placedAt: Date }
  | {
      status: "paid";
      items: readonly LineItem[];
      address: Address;
      placedAt: Date;
      paidAt: Date;
      txId: string;
    }
  | {
      status: "shipped";
      items: readonly LineItem[];
      address: Address;
      placedAt: Date;
      paidAt: Date;
      txId: string;
      trackingCode: string;
    }
  | { status: "canceled"; reason: string; canceledAt: Date };

export type OrderStatus = Order["status"];

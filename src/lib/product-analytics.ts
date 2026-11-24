import { specRows } from "@/lib/spec-labels";

// 後台品項分析：以「付款成功」的訂單為準，依付款月份（台北時間）彙總。營收不含運費。

export type AnalyticsOrder = {
  paid_at: string | null;
  total: number;
  snapshot: {
    items?: { product_name: string; product_slug: string; quantity: number; specifications: Record<string, string> }[];
    quote?: { subtotal?: number | null; shipping_fee?: number | null };
  };
};

export type SpecStat = { spec: string; orders: number; quantity: number; revenue: number };
export type ProductStat = { product: string; orders: number; quantity: number; revenue: number; specs: SpecStat[] };
export type MonthStat = { month: string; orders: number; quantity: number; revenue: number; products: ProductStat[] };

// 自由填寫的文字欄位每筆都不同，放進規格組合只會讓每筆各自成一組，所以排除。
const FREE_TEXT_KEYS = new Set(["foilContent", "projectName", "mode"]);

const monthFormat = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei", year: "numeric", month: "2-digit" });
export const monthKey = (iso: string) => monthFormat.format(new Date(iso)).slice(0, 7);

export function specLabel(slug: string, specifications: Record<string, string>) {
  const kept = Object.fromEntries(Object.entries(specifications ?? {}).filter(([key]) => !FREE_TEXT_KEYS.has(key)));
  const rows = specRows(slug, kept);
  return rows.length ? rows.map(([label, value]) => `${label}：${value}`).join("／") : "（無規格）";
}

const productRevenue = (order: AnalyticsOrder) => {
  const subtotal = order.snapshot.quote?.subtotal;
  return typeof subtotal === "number" ? subtotal : Math.max(0, order.total - (order.snapshot.quote?.shipping_fee ?? 0));
};

export function buildMonthlyStats(orders: AnalyticsOrder[]): MonthStat[] {
  const months = new Map<string, { orders: number; products: Map<string, { orders: number; quantity: number; revenue: number; specs: Map<string, SpecStat> }> }>();

  for (const order of orders) {
    if (!order.paid_at) continue;
    const items = order.snapshot.items ?? [];
    if (!items.length) continue;
    const key = monthKey(order.paid_at);
    const month = months.get(key) ?? { orders: 0, products: new Map() };
    months.set(key, month);
    month.orders += 1;

    // 一筆訂單有多個品項時，商品金額依數量比例分攤到各品項。
    const revenue = productRevenue(order);
    const totalQty = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) || items.length;
    const seenProducts = new Set<string>();
    items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const share = Math.round(revenue * ((qty || 1) / totalQty));
      const product = month.products.get(item.product_name) ?? { orders: 0, quantity: 0, revenue: 0, specs: new Map() };
      month.products.set(item.product_name, product);
      if (!seenProducts.has(item.product_name)) { product.orders += 1; seenProducts.add(item.product_name); }
      product.quantity += qty;
      product.revenue += share;
      const spec = specLabel(item.product_slug, item.specifications);
      const specStat = product.specs.get(spec) ?? { spec, orders: 0, quantity: 0, revenue: 0 };
      product.specs.set(spec, specStat);
      specStat.orders += 1; specStat.quantity += qty; specStat.revenue += share;
    });
  }

  return [...months.entries()].sort(([a], [b]) => b.localeCompare(a)).map(([month, data]) => {
    const products = [...data.products.entries()].map(([product, stat]) => ({
      product, orders: stat.orders, quantity: stat.quantity, revenue: stat.revenue,
      specs: [...stat.specs.values()].sort((a, b) => b.revenue - a.revenue),
    })).sort((a, b) => b.revenue - a.revenue);
    return {
      month, orders: data.orders, products,
      quantity: products.reduce((sum, p) => sum + p.quantity, 0),
      revenue: products.reduce((sum, p) => sum + p.revenue, 0),
    };
  });
}

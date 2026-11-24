type NavigationItem = {
  label: string;
  href: string;
  emphasis?: boolean;
  /** 有子項目時，桌面版顯示為下拉選單，手機版列在主項目下方 */
  children?: readonly { label: string; href: string }[];
};

export const navigation: readonly NavigationItem[] = [
  { label: "首頁", href: "/" },
  { label: "服務與產品", href: "/services", children: [{ label: "產品總覽", href: "/services" }, { label: "精裝皮革樣品", href: "/services/samples" }] },
  { label: "企業合作", href: "/business" },
  { label: "快速查價", href: "/quote" },
  { label: "常見問題", href: "/faq" },
  { label: "聯絡我們", href: "/contact" },
  { label: "線上下單", href: "/order", emphasis: true },
] as const;

export { activeProducts as featuredProducts } from "@/data/catalog";

export type CatalogTone = "teal" | "brown";

export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string | null;
  displayOrder: number;
  isActive: boolean;
  isPlaceholder: boolean;
};

export type ProductImage = {
  id: string;
  src: string | null;
  alt: string;
  label: string;
  tone: CatalogTone;
  displayOrder: number;
  isPlaceholder: boolean;
};

export type ProductSpecGroup = { label: string; items: readonly string[] };

export type ProductDetailSections = {
  /** 左欄規格清單，例如「適用」「材質」「規格」「交期」 */
  specs: readonly ProductSpecGroup[];
  /** 右欄產品介紹，每段一到兩句，建議 2～3 段 */
  story: readonly string[];
  notes: readonly string[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  categoryIds: readonly string[];
  cardImage: string | null;
  gallery: readonly ProductImage[];
  basicInfo: readonly { label: string; value: string }[];
  details: ProductDetailSections;
  tone: CatalogTone;
  displayOrder: number;
  isActive: boolean;
  isPlaceholder: boolean;
  sourceCategory?: string;
  priceSourceRefs?: readonly string[];
  quoteMode?: "manual";
};

export const catalogFilter = {
  id: "all",
  name: "全部產品",
  icon: "全",
  description: "顯示目前所有啟用的產品方向",
} as const;

export const productCategories: readonly ProductCategory[] = [
  { id: "cat-books", slug: "books", name: "論文／書冊", description: "論文、作品集與各式書冊製作", icon: "冊", image: null, displayOrder: 10, isActive: true, isPlaceholder: false },
  { id: "cat-business", slug: "business", name: "工程／企業", description: "工程文件、企業文宣與商務製作", icon: "企", image: null, displayOrder: 20, isActive: true, isPlaceholder: false },
  { id: "cat-creative", slug: "creative", name: "創作／生活", description: "個人創作、展示與生活應用", icon: "創", image: null, displayOrder: 30, isActive: true, isPlaceholder: false },
  { id: "cat-finishing", slug: "finishing", name: "加工服務", description: "裝訂、打孔與文件加工服務", icon: "製", image: null, displayOrder: 40, isActive: true, isPlaceholder: false },
] as const;

const placeholderDetails = (productName: string): ProductDetailSections => ({
  specs: [
    { label: "適用", items: ["【暫存內容】適用對象待鴻萊確認"] },
    { label: "材質", items: ["封面｜待確認", "內頁｜待確認"] },
    { label: "規格", items: ["尺寸｜A4（21 × 29.7 cm）", "頁數｜待確認"] },
    { label: "交期", items: ["待確認"] },
  ],
  story: [
    `【暫存內容】${productName}的正式產品介紹尚待鴻萊確認。`,
    "這裡會放 2～3 段短介紹，每段一到兩句，說明這種做法的特色與適合的作品。",
  ],
  notes: ["本頁不顯示未確認價格，也不構成正式報價或訂單。", "正式價格、規格與交期須經鴻萊人工審核，並由客戶確認後才安排製作。"],
});

/** 每個產品固定 4 個拍攝角度；01～03 必要，04 可省略（把該筆移除即可）。檔名：/images/products/{slug}-0N.webp */
const galleryShots = [
  { key: "01", label: "正面全貌" },
  { key: "02", label: "書背／裝訂細節" },
  { key: "03", label: "翻開內頁" },
  { key: "04", label: "材質特寫" },
] as const;

/** 已放進 public/images/products 的正式照片張數（依 01、02、03… 順序）。新增照片後在這裡登記即可。 */
const productPhotoCount: Record<string, number> = {
  "thesis-binding": 3,
  "certificate-folder": 3,
  "construction-book": 3,
};

const photoPath = (slug: string, key: string) => `/images/products/${slug}-${key}.webp`;

const cardImageFor = (slug: string) => (productPhotoCount[slug] ? photoPath(slug, "01") : null);

const gallery = (slug: string, title: string, tone: CatalogTone): readonly ProductImage[] => {
  const photoCount = productPhotoCount[slug] ?? 0;
  const shots = photoCount > 0 ? galleryShots.slice(0, photoCount) : galleryShots;
  return shots.map((shot, index) => ({
    id: `${slug}-${shot.key}`, src: photoCount > 0 ? photoPath(slug, shot.key) : null, alt: `${title}｜${shot.label}`, label: shot.label,
    tone: index % 2 === 0 ? tone : tone === "teal" ? "brown" : "teal", displayOrder: (index + 1) * 10, isPlaceholder: photoCount === 0,
  }));
};

export const products: readonly Product[] = [
  {
    id: "prd-thesis-binding", slug: "thesis-binding", title: "論文",
    description: "【暫存內容】論文精裝、彩色精裝與平裝等製作，依學校規範確認封面與燙印。",
    categoryIds: ["cat-books"], cardImage: cardImageFor("thesis-binding"), gallery: gallery("thesis-binding", "論文", "teal"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價格與交期", value: "提交需求後由專人確認" }],
    details: placeholderDetails("論文"), tone: "teal", displayOrder: 10, isActive: true, isPlaceholder: true, quoteMode: "manual",
  },
  {
    id: "prd-certificate-folder", slug: "certificate-folder", title: "證書夾",
    description: "【暫存內容】依證書尺寸與使用情境確認材質及加工方式。",
    categoryIds: ["cat-business", "cat-creative"], cardImage: cardImageFor("certificate-folder"), gallery: gallery("certificate-folder", "證書夾", "brown"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價格與交期", value: "提交需求後由專人確認" }],
    details: placeholderDetails("證書夾"), tone: "brown", displayOrder: 20, isActive: true, isPlaceholder: true, quoteMode: "manual",
  },
  {
    id: "prd-construction-book", slug: "construction-book", title: "工程施工本",
    description: "【暫存內容】施工圖裱冊製作，可依圖面尺寸與封面材質選擇。",
    categoryIds: ["cat-business"], cardImage: cardImageFor("construction-book"), gallery: gallery("construction-book", "工程施工本", "teal"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價格與交期", value: "提交需求後由專人確認" }],
    details: placeholderDetails("工程施工本"), tone: "teal", displayOrder: 30, isActive: true, isPlaceholder: true, quoteMode: "manual",
  },
  {
    id: "prd-engineering-contract", slug: "engineering-contract", title: "工程合約書",
    description: "【暫存內容】工程合約書平裝、精裝及封面加工，可依文件需求選擇製作方式。",
    categoryIds: ["cat-business"], cardImage: cardImageFor("engineering-contract"), gallery: gallery("engineering-contract", "工程合約書", "brown"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價目表來源", value: "5-2" }],
    details: placeholderDetails("工程合約書"), tone: "brown", displayOrder: 40, isActive: true, isPlaceholder: true,
    sourceCategory: "工程合約書", priceSourceRefs: ["5-2"], quoteMode: "manual",
  },
  {
    id: "prd-perfect-binding", slug: "perfect-binding", title: "膠裝",
    description: "【暫存內容】適合企劃書、作品集與各式書冊，提供不同封面及紙材選擇。",
    categoryIds: ["cat-books", "cat-creative"], cardImage: cardImageFor("perfect-binding"), gallery: gallery("perfect-binding", "膠裝", "teal"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價目表來源", value: "7-1、7-2" }],
    details: placeholderDetails("膠裝"), tone: "teal", displayOrder: 50, isActive: true, isPlaceholder: true,
    sourceCategory: "彩色膠裝", priceSourceRefs: ["7-1", "7-2"], quoteMode: "manual",
  },
  {
    id: "prd-hardcover", slug: "hardcover", title: "精裝",
    description: "【暫存內容】硬殼封面書冊製作，適合正式文件、紀念冊與作品集。",
    categoryIds: ["cat-books", "cat-creative"], cardImage: cardImageFor("hardcover"), gallery: gallery("hardcover", "精裝", "brown"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價格與交期", value: "提交需求後由專人確認" }],
    details: placeholderDetails("精裝"), tone: "brown", displayOrder: 60, isActive: true, isPlaceholder: true, quoteMode: "manual",
  },
  {
    id: "prd-sewn-softcover", slug: "sewn-softcover", title: "線平裝",
    description: "【暫存內容】內頁縫線後上軟封面，翻閱耐用、可攤平度佳。",
    categoryIds: ["cat-books", "cat-creative", "cat-finishing"], cardImage: cardImageFor("sewn-softcover"), gallery: gallery("sewn-softcover", "線平裝", "teal"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價格與交期", value: "提交需求後由專人確認" }],
    details: placeholderDetails("線平裝"), tone: "teal", displayOrder: 70, isActive: true, isPlaceholder: true, quoteMode: "manual",
  },
  {
    id: "prd-sewn-hardcover", slug: "sewn-hardcover", title: "線精裝",
    description: "【暫存內容】內頁縫線搭配硬殼封面，兼顧耐用與質感。",
    categoryIds: ["cat-books", "cat-creative", "cat-finishing"], cardImage: cardImageFor("sewn-hardcover"), gallery: gallery("sewn-hardcover", "線精裝", "brown"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價格與交期", value: "提交需求後由專人確認" }],
    details: placeholderDetails("線精裝"), tone: "brown", displayOrder: 80, isActive: true, isPlaceholder: true, quoteMode: "manual",
  },
  {
    id: "prd-exposed-spine-sewn", slug: "exposed-spine-sewn", title: "裸背線裝",
    description: "【暫存內容】書背不包封、露出縫線結構，可完全攤平，適合作品集與手作書。",
    categoryIds: ["cat-books", "cat-creative", "cat-finishing"], cardImage: cardImageFor("exposed-spine-sewn"), gallery: gallery("exposed-spine-sewn", "裸背線裝", "teal"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價格與交期", value: "提交需求後由專人確認" }],
    details: placeholderDetails("裸背線裝"), tone: "teal", displayOrder: 90, isActive: true, isPlaceholder: true, quoteMode: "manual",
  },
  {
    id: "prd-machine-sewn-binding", slug: "machine-sewn-binding", title: "車線平裝",
    description: "【暫存內容】以車線方式固定書冊，適合薄本文件與特殊裝訂形式。",
    categoryIds: ["cat-books", "cat-creative", "cat-finishing"], cardImage: cardImageFor("machine-sewn-binding"), gallery: gallery("machine-sewn-binding", "車線平裝", "brown"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價目表來源", value: "9-2" }],
    details: placeholderDetails("車線平裝"), tone: "brown", displayOrder: 100, isActive: true, isPlaceholder: true,
    sourceCategory: "車線裝", priceSourceRefs: ["9-2"], quoteMode: "manual",
  },
  {
    id: "prd-traditional-thread-binding", slug: "traditional-thread-binding", title: "古書線裝",
    description: "【暫存內容】傳統穿線裝訂，適合族譜、詩集與具古典風格的書冊。",
    categoryIds: ["cat-books", "cat-creative", "cat-finishing"], cardImage: cardImageFor("traditional-thread-binding"), gallery: gallery("traditional-thread-binding", "古書線裝", "teal"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價格與交期", value: "提交需求後由專人確認" }],
    details: placeholderDetails("古書線裝"), tone: "teal", displayOrder: 110, isActive: true, isPlaceholder: true, quoteMode: "manual",
  },
  {
    id: "prd-saddle-stitch", slug: "saddle-stitch", title: "騎馬裝",
    description: "【暫存內容】對摺後於書脊打釘，適合薄本型錄、手冊與活動刊物。",
    categoryIds: ["cat-business", "cat-creative", "cat-finishing"], cardImage: cardImageFor("saddle-stitch"), gallery: gallery("saddle-stitch", "騎馬裝", "brown"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價格與交期", value: "提交需求後由專人確認" }],
    details: placeholderDetails("騎馬裝"), tone: "brown", displayOrder: 120, isActive: true, isPlaceholder: true, quoteMode: "manual",
  },
  {
    id: "prd-ring-binding", slug: "ring-binding", title: "線圈環裝",
    description: "【暫存內容】雙線圈與環裝裝訂，可平攤翻頁，依尺寸及線圈規格選擇。",
    categoryIds: ["cat-books", "cat-business", "cat-finishing"], cardImage: cardImageFor("ring-binding"), gallery: gallery("ring-binding", "線圈環裝", "teal"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價目表來源", value: "P13" }],
    details: placeholderDetails("線圈環裝"), tone: "teal", displayOrder: 130, isActive: true, isPlaceholder: true,
    sourceCategory: "線圈／環裝", priceSourceRefs: ["P13"], quoteMode: "manual",
  },
  {
    id: "prd-butterfly-book", slug: "butterfly-book", title: "蝴蝶平、精裝",
    description: "【暫存內容】蝶頁式平裝或精裝，跨頁圖面可完整展開，適合圖文作品與展示型書冊。",
    categoryIds: ["cat-books", "cat-creative"], cardImage: cardImageFor("butterfly-book"), gallery: gallery("butterfly-book", "蝴蝶平、精裝", "brown"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價目表來源", value: "10-1、10-2、10-x" }],
    details: placeholderDetails("蝴蝶平、精裝"), tone: "brown", displayOrder: 140, isActive: true, isPlaceholder: true,
    sourceCategory: "蝶冊", priceSourceRefs: ["10-1", "10-2", "10-x"], quoteMode: "manual",
  },
  {
    id: "prd-menu-production", slug: "menu-production", title: "菜單螺絲裝",
    description: "【暫存內容】螺絲固定式菜單，可拆換內頁，方便日後更新品項。",
    categoryIds: ["cat-business", "cat-creative"], cardImage: cardImageFor("menu-production"), gallery: gallery("menu-production", "菜單螺絲裝", "teal"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價格與交期", value: "提交需求後由專人確認" }],
    details: placeholderDetails("菜單螺絲裝"), tone: "teal", displayOrder: 150, isActive: true, isPlaceholder: true, quoteMode: "manual",
  },
  {
    id: "prd-q-rod-hardcover", slug: "q-rod-hardcover", title: "Q桿精裝",
    description: "【暫存內容】以Q桿固定內頁的精裝形式，可增減內頁，適合需要持續更新的文件。",
    categoryIds: ["cat-business", "cat-finishing"], cardImage: cardImageFor("q-rod-hardcover"), gallery: gallery("q-rod-hardcover", "Q桿精裝", "brown"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價格與交期", value: "提交需求後由專人確認" }],
    details: placeholderDetails("Q桿精裝"), tone: "brown", displayOrder: 160, isActive: true, isPlaceholder: true, quoteMode: "manual",
  },
  {
    id: "prd-screw-contract", slug: "screw-contract", title: "鎖螺絲合約書",
    description: "【暫存內容】以螺絲鎖合固定的合約書，結構穩固，適合正式合約與重要文件。",
    categoryIds: ["cat-business", "cat-finishing"], cardImage: cardImageFor("screw-contract"), gallery: gallery("screw-contract", "鎖螺絲合約書", "teal"),
    basicInfo: [{ label: "估價方式", value: "需人工詢價" }, { label: "價目表來源", value: "11-1、11-2、附表11" }],
    details: placeholderDetails("鎖螺絲合約書"), tone: "teal", displayOrder: 170, isActive: true, isPlaceholder: true,
    sourceCategory: "螺絲裝", priceSourceRefs: ["11-1", "11-2", "附表11"], quoteMode: "manual",
  },
] as const;

/** 封面可選精裝皮革的產品，詳細頁會顯示「查看精裝皮革樣品」連結 */
export const leatherCoverSlugs: ReadonlySet<string> = new Set([
  "thesis-binding", "certificate-folder", "construction-book", "engineering-contract", "hardcover", "sewn-hardcover",
  "butterfly-book", "menu-production", "q-rod-hardcover", "screw-contract",
]);

export const activeCategories =productCategories.filter((category) => category.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
export const activeProducts = products.filter((product) => product.isActive).sort((a, b) => a.displayOrder - b.displayOrder);

export function getProductBySlug(slug: string) {
  return activeProducts.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3) {
  const sharedCategory = activeProducts.filter((candidate) => candidate.id !== product.id && candidate.categoryIds.some((id) => product.categoryIds.includes(id)));
  const remaining = activeProducts.filter((candidate) => candidate.id !== product.id && !sharedCategory.some((item) => item.id === candidate.id));
  return [...sharedCategory, ...remaining].slice(0, limit);
}

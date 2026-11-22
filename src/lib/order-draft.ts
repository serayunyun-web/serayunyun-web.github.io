export const DRAFT_KEY = "honglai-order-draft-v2";

export type Draft = {
  productSlug: string;
  values: Record<string, string>;
  contact: Record<string, string>;
  samples: Record<string, string>;
  privacyConsent: boolean;
  idempotencyKey: string;
  /** 從查價頁帶入的欄位 id，下單頁標示「已帶入」；換產品時清空。 */
  quoteKeys?: string[];
  /** 剛從查價頁帶入、提示視窗還沒關掉。 */
  quoteNotice?: boolean;
};

export const blankDraft = (): Draft => ({ productSlug: "", values: { quantity: "1" }, contact: {}, samples: {}, privacyConsent: false, idempotencyKey: "" });

export function readDraft(): Draft {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) return { ...blankDraft(), ...JSON.parse(saved) } as Draft;
  } catch {
    localStorage.removeItem(DRAFT_KEY);
  }
  return blankDraft();
}

export function writeDraft(draft: Draft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

/** 查價頁按「用這個規格下單」：把產品、規格、數量與配送方式帶入下單頁，保留已填的聯絡資料。 */
export function handOffQuote(input: { productSlug: string; values: Record<string, string>; quantity: string; shippingId: string; district: string }) {
  const current = readDraft();
  writeDraft({
    ...current,
    productSlug: input.productSlug,
    values: { ...input.values, quantity: input.quantity },
    quoteKeys: [...Object.keys(input.values).filter((key) => input.values[key]), "quantity"],
    quoteNotice: true,
    contact: { ...current.contact, shippingId: input.shippingId, district: input.district },
    samples: current.productSlug === input.productSlug ? current.samples : {},
    idempotencyKey: crypto.randomUUID(),
  });
}

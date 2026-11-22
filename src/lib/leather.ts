import { leatherCoverSlugs } from "@/data/catalog";
import { materialSamples, type MaterialSample } from "@/data/material-samples";
import { leatherChoice } from "../../supabase/functions/_shared/leather-rules.ts";

export * from "../../supabase/functions/_shared/leather-rules.ts";

/** 沒有「封面材質」欄位的皮面產品，下拉選單最後多一個選項給布面、紙面或自備材料。 */
export const OTHER_COVER = "其他（布面、紙面或自備材料，請在下方說明）";

const hardcoverLeathers = materialSamples.filter((sample) => sample.kind === "cover" && sample.enabled && sample.appliesTo.includes("所有精裝產品"));
const constructionLeathers = materialSamples.filter((sample) => sample.kind === "cover" && sample.enabled && sample.appliesTo.includes("工程施工本"));

/** 有封面材質欄位的產品：欄位 id → 選到哪個值才是皮面（以及要用哪一組皮）。 */
const coverRules: Record<string, { field: string; leather: Record<string, readonly MaterialSample[]> }> = {
  hardcover: { field: "coverMaterial", leather: { 皮面: hardcoverLeathers } },
  "sewn-hardcover": { field: "coverMaterial", leather: { 皮面: hardcoverLeathers } },
  "engineering-contract": { field: "contractCover", leather: { 皮面精裝: hardcoverLeathers } },
  "q-rod-hardcover": { field: "qRodCover", leather: { A4皮面: hardcoverLeathers } },
  "butterfly-book": { field: "butterflyBinding", leather: { 精裝: hardcoverLeathers } },
  "construction-book": { field: "drawingCover", leather: { 專用皮: constructionLeathers, 皮面精裝: hardcoverLeathers } },
};

export type LeatherPicker = { samples: readonly MaterialSample[]; allowOther: boolean };

/** 這個產品、這組規格要不要顯示皮革下拉選單；null 代表封面不是皮面，維持文字欄位。 */
export function leatherPickerFor(slug: string, values: Record<string, string | undefined>): LeatherPicker | null {
  if (!leatherCoverSlugs.has(slug)) return null;
  const rule = coverRules[slug];
  if (!rule) return { samples: hardcoverLeathers, allowOther: true };
  const samples = rule.leather[values[rule.field] ?? ""];
  return samples ? { samples, allowOther: false } : null;
}

export const sampleChoice = (sample: MaterialSample) => leatherChoice(sample.name, sample.code);

/** 草稿裡的選擇不在目前可選清單（例如換了封面材質）時視為未選。 */
export function validLeatherChoice(picker: LeatherPicker | null, choice: string | undefined) {
  if (!picker || !choice) return "";
  if (picker.allowOther && choice === OTHER_COVER) return choice;
  return picker.samples.some((sample) => sampleChoice(sample) === choice) ? choice : "";
}

// 皮革與燙金方式的共用規則：前台下單頁與 Edge Function 後端驗證共用。
// 只有皮紋系列（色號 C／D 開頭）可以數位燙金；其他系列與施工本專用皮只能傳統燙金。
// 色號清單見 src/data/material-samples.ts。

type Values = Record<string, string | undefined>;

/** 皮革選擇的儲存格式為「系列名（色號）」，例如「皮紋系列（C10）」。 */
export const leatherChoice = (name: string, code: string) => `${name}（${code}）`;

/** 取出色號；不是皮革色號（例如「其他（布面…）」）時回傳空字串。 */
export function leatherCode(choice: string) {
  const code = /（([^）]+)）$/.exec(choice)?.[1] ?? "";
  return /^[A-Z]\d+$/.test(code) || code === "施工本專用皮" ? code : "";
}

export function isDigitalFoilLeather(choice: string) {
  return /^[CD]\d+$/.test(leatherCode(choice));
}

/** 規格中有任何燙金欄位選了數位燙金。 */
export function wantsDigitalFoil(values: Values) {
  return Object.entries(values).some(([key, value]) => /foil/i.test(key) && Boolean(value?.includes("數位燙金")));
}

/** 選了數位燙金，卻挑了只能傳統燙金的皮革。 */
export function leatherFoilConflict(values: Values, choice: string | undefined) {
  return Boolean(choice && leatherCode(choice) && wantsDigitalFoil(values) && !isDigitalFoilLeather(choice));
}

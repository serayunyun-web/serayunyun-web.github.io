/**
 * 問法 → FAQ 題目對照。中文沒有空白斷詞，整句比對容易找不到，
 * 這裡把常見問法直接指到對應題目；後端檢索與前台備援共用。
 * 題目文字必須與正式 FAQ 完全相同（faq-assistant.test.ts 會檢查）。
 */
export type FaqIntent = { question: string; matches: (message: string) => boolean };

const certificate = /證書(夾|冊)/u;
const otherBinding = /平裝|膠裝|騎馬|線圈|古書|論文/u;
const hardcover = /精裝/u;
const coverDrawing = /封面|製圖|畫圖|尺寸|多大|大小|出血|護貝|書背|檔案|設計|排版/u;
const coverSize = /尺寸|多大|大小|出血|書背|書寬|書高|書溝|滿版|計算|怎麼算|製圖|怎麼做|怎麼設計|設定/u;
const coverMaterial = /材質|什麼紙|哪種紙|紙張|紙材|磅數|上膜|冷裱|背膠/u;
const coverFormatIssue = /(沒有?|未|不|無法)(有)?(依|照|按).{0,6}(格式|尺寸)|格式.{0,4}(錯|不對|不符)|包到|背側|裁小|被裁|較小/u;

const isHardcoverCover = (message: string) =>
  !certificate.test(message) && !otherBinding.test(message) && hardcover.test(message);

export const faqIntents: readonly FaqIntent[] = [
  {
    question: "A4 證書冊／證書夾的封面要怎麼製圖？",
    matches: (message) => certificate.test(message) && coverDrawing.test(message),
  },
  {
    question: "精裝彩色封面沒有依格式製作會怎麼樣？",
    matches: (message) => isHardcoverCover(message) && coverFormatIssue.test(message),
  },
  {
    question: "精裝彩色封面建議使用什麼材質？",
    matches: (message) => isHardcoverCover(message) && /封面/u.test(message) && coverMaterial.test(message),
  },
  {
    question: "精裝彩色封面的尺寸要怎麼計算？",
    matches: (message) =>
      !certificate.test(message) && !otherBinding.test(message) && (
        /書溝/u.test(message) ||
        (hardcover.test(message) && coverSize.test(message) && !coverFormatIssue.test(message))
      ),
  },
  // 沒說是哪種封面時，兩種規格都帶出來，避免只答一般出血
  ...["精裝彩色封面的尺寸要怎麼計算？", "A4 證書冊／證書夾的封面要怎麼製圖？"].map((question) => ({
    question,
    matches: (message: string) =>
      /封面/u.test(message) && /出血|尺寸|製圖/u.test(message) &&
      !hardcover.test(message) && !certificate.test(message) && !otherBinding.test(message),
  })),
];

export function faqIntentQuestions(message: string) {
  const normalized = message.normalize("NFKC").toLocaleLowerCase("zh-Hant");
  return [...new Set(faqIntents.filter((intent) => intent.matches(normalized)).map((intent) => intent.question))];
}

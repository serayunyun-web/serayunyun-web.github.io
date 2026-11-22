"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { orderableProducts } from "@/data/catalog";
import { commonFields } from "@/data/order-options";
import { validateEmail, validatePhone } from "@/lib/form-validation";
import { ATTACHMENT_ACCEPT, MAX_ATTACHMENTS, attachmentProblem, formatBytes } from "@/lib/attachments";
import { PHOTOCOPY_SLUG, calculateEstimate, invalidPricingFields, isAutoPriced, shippingChoices, visiblePricingFields } from "@/lib/pricing";
import { blankDraft, readDraft, writeDraft, DRAFT_KEY, type Draft } from "@/lib/order-draft";
import { saveCheckout } from "@/lib/checkout";
import { SubmissionError, callPublicFunction, supabaseBrowser } from "@/lib/supabase-public-api";
import { ProductPicker } from "@/components/product-picker";
import { LeatherSelect } from "@/components/leather-select";
import { OTHER_COVER, isDigitalFoilLeather, leatherCode, leatherFoilConflict, leatherPickerFor, validLeatherChoice, wantsDigitalFoil } from "@/lib/leather";
import { CommonInput, ModeSwitch, PriceBreakdown, ShippingPicker, SpecFields, specSummary, visibleManualFields, type DisabledOptions, type FieldMarks } from "@/components/spec-fields";

type PickedFile = { file: File; status: "ready" | "uploading" | "done" | "failed"; error?: string };
type SubmitResult = { referenceNo: string; emailSent: boolean; priced: boolean };
/** 已選的規格裡有燙金，就需要填燙金內容。 */
const needsFoilContent = (values: Record<string, string>) => Object.entries(values).some(([key, value]) => /foil|coverFinish/i.test(key) && value.includes("燙金") && !value.startsWith("不需要"));
const contactLabels: Record<string, string> = { customerType: "客戶類型", contactName: "聯絡人姓名", phone: "聯絡電話", email: "Email", organization: "公司／學校名稱", line: "LINE ID", address: "配送地址" };

export function OrderRequestForm() {
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const specRef = useRef<HTMLElement>(null);
  const noticeRef = useRef<HTMLDialogElement>(null);
  const filePickerRef = useRef<HTMLDivElement>(null);
  const [filesPulse, setFilesPulse] = useState<"off" | "waiting" | "on">("off");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let restored = readDraft();
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("product") ?? "";
      if (requested && requested !== restored.productSlug && orderableProducts.some((item) => item.slug === requested)) restored = { ...restored, productSlug: requested, values: { quantity: "1" }, samples: {} };
      if (!orderableProducts.some((item) => item.slug === restored.productSlug)) restored = { ...restored, productSlug: "", values: { quantity: "1" } };
      if (!restored.idempotencyKey) restored.idempotencyKey = crypto.randomUUID();
      restored.contact = { shippingId: "pickup", ...restored.contact };
      if (!restored.productSlug) restored.quoteNotice = false;
      setDraft(restored); setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => { if (ready && !result) writeDraft(draft); }, [draft, ready, result]);
  // 從查價頁帶入：先跳出提示視窗，關掉之前不會消失（重新整理也會再出現）。
  const showNotice = ready && !result && Boolean(draft.quoteNotice);
  useEffect(() => {
    const dialog = noticeRef.current;
    if (showNotice && dialog && !dialog.open) dialog.showModal();
  }, [showNotice]);
  // 檔案區第一次捲進畫面時閃一下，提醒客人上傳檔案。
  useEffect(() => {
    const target = filePickerRef.current;
    if (filesPulse !== "waiting" || !target) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setFilesPulse("on"); observer.disconnect(); } }, { threshold: 0.6 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [filesPulse]);
  const closeNotice = () => {
    noticeRef.current?.close();
    setDraft((current) => ({ ...current, quoteNotice: false }));
    setFilesPulse("waiting");
    // 等視窗關閉、頁面排版完成後再捲到規格區，讓客人從規格開始往下確認。
    // 用 scrollTo 而不是 scrollIntoView：在頁面頂端時 scrollIntoView 實測不會捲動。
    window.setTimeout(() => {
      const target = specRef.current;
      if (!target) return;
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - margin, behavior: "smooth" });
    }, 120);
  };

  const product = orderableProducts.find((item) => item.slug === draft.productSlug);
  const quantity = Number(draft.values.quantity);
  const estimate = product ? calculateEstimate({ productSlug: product.slug, quantity, values: draft.values, shippingId: draft.contact.shippingId, district: draft.contact.district }) : null;
  const shipping = shippingChoices.find((choice) => choice.id === draft.contact.shippingId);
  const summary = product ? specSummary(product.slug, draft.values) : [];
  const setValue = (id: string, value: string) => setDraft((current) => ({ ...current, values: { ...current.values, [id]: value } }));
  const filesRequired = product?.slug === PHOTOCOPY_SLUG;
  const unit = filesRequired ? "份" : "本";
  // 一般影印沒有封面、燙金與皮面，數量改稱「影印份數」。
  // 皮面產品：「封面顏色／樣品編號」改成皮革下拉選單；選「其他」或封面不是皮面時維持文字欄位。
  const leatherPicker = product ? leatherPickerFor(product.slug, draft.values) : null;
  const leatherValue = validLeatherChoice(leatherPicker, draft.samples.coverSample);
  const leatherNeeded = Boolean(leatherPicker) && !leatherValue;
  const coverColorAsText = !leatherPicker || leatherValue === OTHER_COVER;
  const traditionalOnly = Boolean(leatherCode(leatherValue)) && !isDigitalFoilLeather(leatherValue);
  const disabledOptions: DisabledOptions = {};
  if (product && traditionalOnly) for (const field of visiblePricingFields(product.slug, draft.values)) {
    if (/foil/i.test(field.id) && field.kind === "select") disabledOptions[field.id] = { options: field.options.filter((option) => option.includes("數位燙金")), reason: `所選皮革 ${leatherCode(leatherValue)} 只能傳統燙金，不能選數位燙金。` };
  }
  const chooseLeather = (value: string) => setDraft((current) => ({ ...current, samples: { ...current.samples, coverSample: value } }));
  const shownCommonFields = filesRequired ? commonFields.filter((field) => !["coverColor", "foilContent"].includes(field.id)).map((field) => field.id === "quantity" ? { ...field, label: "影印份數" } : field) : commonFields;
  const carried = new Set(draft.quoteKeys ?? []);
  const foilNeeded = needsFoilContent(draft.values);
  const marks: FieldMarks = {};
  for (const key of carried) marks[key] = "carried";
  if (carried.size) for (const field of shownCommonFields) if (!carried.has(field.id) && !draft.values[field.id]?.trim() && (field.id !== "coverColor" || coverColorAsText)) marks[field.id] = "check";
  if (foilNeeded && !draft.values.foilContent?.trim()) marks.foilContent = "attention";
  const toConfirm = [
    ...(foilNeeded && !draft.values.foilContent?.trim() ? ["燙金內容（文字、Logo 或校徽）"] : []),
    ...(leatherNeeded ? ["封面皮革色號"] : []),
    ...shownCommonFields.filter((field) => marks[field.id] === "check").map((field) => field.label.replace("（選填）", "")),
  ];
  const setContact = (id: string, value: string) => setDraft((current) => ({ ...current, contact: { ...current.contact, [id]: value } }));

  const chooseProduct = (slug: string) => {
    if (slug === draft.productSlug) return;
    setDraft((current) => ({ ...current, productSlug: slug, values: { quantity: current.values.quantity || "1", ...(current.values.mode ? { mode: current.values.mode } : {}) }, samples: {}, quoteKeys: [], quoteNotice: false, idempotencyKey: crypto.randomUUID() }));
    setMessage("");
    window.setTimeout(() => specRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = [...files];
    const problems: string[] = [];
    for (const file of Array.from(list)) {
      if (picked.length >= MAX_ATTACHMENTS) { problems.push(`最多只能上傳 ${MAX_ATTACHMENTS} 個檔案。`); break; }
      const problem = attachmentProblem(file);
      if (problem) problems.push(`${file.name}：${problem}`); else picked.push({ file, status: "ready" });
    }
    setFiles(picked);
    setMessage(problems.join(" "));
  };

  const validate = () => {
    if (!product) return { id: "product-options", error: "請先選擇製作項目。" };
    if (isAutoPriced(product.slug)) {
      const missing = invalidPricingFields(product.slug, draft.values)[0];
      if (missing) return { id: `order-${missing}`, error: "請完成所有規格選項。" };
    } else {
      const missing = visibleManualFields(product.slug, draft.values).find((field) => field.required && !draft.values[field.id]?.trim());
      if (missing) return { id: `order-${missing.id}`, error: `請填寫「${missing.label}」。` };
    }
    if (!Number.isSafeInteger(quantity) || quantity < 1) return { id: "order-quantity", error: "製作數量必須是大於 0 的整數。" };
    if (leatherFoilConflict(draft.values, leatherValue)) return { id: "order-leather", error: `皮革 ${leatherCode(leatherValue)} 只能傳統燙金，請改選皮紋系列，或把燙金改成傳統燙金。` };
    if (filesRequired && !files.length) return { id: "order-files", error: "一般影印請上傳要影印的檔案。" };
    for (const id of ["customerType", "contactName", "phone", "email"]) if (!draft.contact[id]?.trim()) return { id: `contact-${id}`, error: `請填寫「${contactLabels[id]}」。` };
    if (!validatePhone(draft.contact.phone)) return { id: "contact-phone", error: "請輸入有效的聯絡電話。" };
    if (!validateEmail(draft.contact.email)) return { id: "contact-email", error: "請輸入有效的 Email，報價單會寄到這個信箱。" };
    if (draft.contact.customerType !== "個人" && !draft.contact.organization?.trim()) return { id: "contact-organization", error: "公司或學校客戶請填寫名稱。" };
    if (!shipping) return { id: "order-shipping", error: "請選擇配送方式。" };
    if (shipping.needsDistrict && !draft.contact.district) return { id: "order-district", error: "請選擇機車配送區域。" };
    if (shipping.needsAddress && !draft.contact.address?.trim()) return { id: "contact-address", error: "請填寫配送地址。" };
    if (!draft.privacyConsent) return { id: "order-privacy", error: "請先同意個人資料僅供本次製作聯繫使用。" };
    return null;
  };

  const submit = async () => {
    if (submitting || result) return;
    const problem = validate();
    if (problem) { setMessage(problem.error); document.getElementById(problem.id)?.focus(); document.getElementById(problem.id)?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    setSubmitting(true); setMessage("正在送出，請勿關閉頁面……");
    try {
      let attachments: { path: string; name: string; size: number; type: string }[] = [];
      if (files.length) {
        const prepared = await callPublicFunction<{ uploads: { path: string; token: string }[] }>("submit-manual-inquiry", {
          action: "prepare-uploads", idempotencyKey: draft.idempotencyKey, email: draft.contact.email,
          files: files.map(({ file }) => ({ name: file.name, size: file.size, type: file.type })),
        });
        const storage = supabaseBrowser().storage.from("inquiry-files");
        const uploaded = await Promise.all(files.map(async (item, index) => {
          if (item.status === "done") return true;
          setFiles((current) => current.map((entry, i) => i === index ? { ...entry, status: "uploading" } : entry));
          const { error } = await storage.uploadToSignedUrl(prepared.uploads[index].path, prepared.uploads[index].token, item.file, { contentType: item.file.type || "application/octet-stream" });
          setFiles((current) => current.map((entry, i) => i === index ? { ...entry, status: error ? "failed" : "done", error: error ? "上傳失敗" : undefined } : entry));
          return !error;
        }));
        if (uploaded.includes(false)) throw new SubmissionError("upload_failed");
        attachments = files.map(({ file }, index) => ({ path: prepared.uploads[index].path, name: file.name, size: file.size, type: file.type }));
      }
      const { wantedDate, notes } = draft.values;
      const specifications = Object.fromEntries(Object.entries(draft.values).filter(([key, value]) => value && !["quantity", "wantedDate", "notes"].includes(key)));
      const response = await callPublicFunction<{ referenceNo: string; emailSent: boolean; estimate: { status: string; total: number | null }; paymentToken: string | null }>("submit-manual-inquiry", {
        idempotencyKey: draft.idempotencyKey, productSlug: draft.productSlug, quantity,
        specifications: { ...specifications, ...(leatherValue ? { coverSampleChoice: leatherValue } : {}) },
        customerType: draft.contact.customerType, contactName: draft.contact.contactName, phone: draft.contact.phone, email: draft.contact.email,
        organization: draft.contact.organization, lineId: draft.contact.line, preferredContact: "Email",
        shippingId: draft.contact.shippingId, shippingDistrict: draft.contact.district, deliveryAddress: draft.contact.address,
        expectedDate: wantedDate, customerNotes: notes, privacyConsent: draft.privacyConsent, attachments,
      });
      const priced = response.estimate?.status === "priced" && typeof response.estimate.total === "number" && Boolean(response.paymentToken);
      if (priced) saveCheckout({ referenceNo: response.referenceNo, total: response.estimate.total!, productTitle: product!.title, quantity, token: response.paymentToken! });
      setResult({ referenceNo: response.referenceNo, emailSent: response.emailSent, priced });
      localStorage.removeItem(DRAFT_KEY);
      setMessage("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const code = error instanceof SubmissionError ? error.code : "submission_failed";
      setMessage(code === "not_configured" ? "網站尚未完成系統設定，資料沒有送出。" : code === "rate_limited" ? "短時間內送出次數過多，請稍後再試。" : code === "upload_failed" ? "有檔案上傳失敗，需求尚未送出。請確認網路後再按一次送出。" : code.startsWith("invalid:") ? "資料未通過檢查，需求尚未送出。請檢查欄位後再試。" : "送出失敗，需求尚未送出。內容仍保留在這台裝置，請稍後再試。");
    } finally { setSubmitting(false); }
  };

  const startOver = () => { const next = { ...blankDraft(), contact: draft.contact, idempotencyKey: crypto.randomUUID() }; setDraft({ ...next, contact: { ...next.contact } }); setFiles([]); setResult(null); setMessage(""); };

  if (result) {
    return <div className="order-shell"><section className="order-panel summary-panel order-success" aria-live="polite">
      <div className="summary-banner"><span aria-hidden="true">✓</span><div><strong>訂單已送出</strong><small>訂單編號：{result.referenceNo}</small></div></div>
      <p>我們已收到你的訂單。{result.priced ? `請按下方按鈕前往結帳，付款完成後會把訂單明細寄到 ${draft.contact.email}。` : "專人確認規格與金額後會以 Email 與你聯繫。"}交期由專人確認後通知。</p>
      <p className="order-disclaimer"><strong>提醒</strong><span>本站為示範網站，結帳使用模擬 LINE Pay 頁面，不會實際扣款。</span></p>
      <div className="order-actions">{result.priced && <Link className="button button-primary" href={`/checkout/linepay/?ref=${encodeURIComponent(result.referenceNo)}`}>前往結帳（LINE Pay 示範）</Link>}<button className={`button ${result.priced ? "button-secondary" : "button-primary"}`} onClick={startOver} type="button">再填一筆訂單</button><Link className="button button-secondary" href="/">回首頁</Link></div>
    </section></div>;
  }

  return <div className="order-shell">
    <section className="order-panel product-panel" id="product-options" tabIndex={-1}>
      <div className="order-heading"><p>STEP 01 ／ PRODUCT</p><h2>選擇製作項目</h2></div>
      <ProductPicker onChoose={chooseProduct} products={orderableProducts} selectedSlug={draft.productSlug} />
    </section>

    {product && <>
      <section className="order-panel" id="specifications" ref={specRef}>
        <div className="order-heading"><p>STEP 02 ／ SPECIFICATION</p><h2>{product.title}製作規格</h2><span>{product.description.replace("【暫存內容】", "")}</span></div>
        <ModeSwitch onChange={(mode) => setValue("mode", mode)} values={draft.values} />
        <div className="form-sheet"><div className="quote-field-grid">
          <SpecFields disabledOptions={disabledOptions} idPrefix="order" marks={marks} onChange={setValue} slug={product.slug} values={draft.values} />
          {shownCommonFields.map((field) => {
            const input = (label?: string) => <CommonInput field={label ? { ...field, label } : field} idPrefix="order" key={field.id} mark={marks[field.id]} onChange={(value) => setValue(field.id, field.id === "quantity" ? value.replace(/[^\d]/g, "") : value)} value={draft.values[field.id] ?? ""} />;
            if (field.id !== "coverColor" || !leatherPicker) return input();
            return <Fragment key={field.id}>
              <LeatherSelect attention={leatherNeeded} digitalOnly={wantsDigitalFoil(draft.values)} id="order-leather" onChange={chooseLeather} onOpenSamples={() => writeDraft(draft)} picker={leatherPicker} samplesHref={`/services/samples?select=cover&return=/order?product=${product.slug}`} value={leatherValue} />
              {coverColorAsText && input("封面材質說明")}
            </Fragment>;
          })}
          <div className={`quote-field quote-field-wide file-picker file-reminder${files.length ? "" : " is-empty"}${filesPulse === "on" ? " is-pulsing" : ""}`} onAnimationEnd={() => setFilesPulse("off")} ref={filePickerRef}>
            {filesRequired ? <>
              <label htmlFor="order-files"><span aria-hidden="true" className="file-reminder-icon">📎</span>上傳要影印的檔案<span className="quote-required">必填</span></label>
              <p className="file-reminder-lead">一般影印需要先上傳檔案，系統才能送出訂單。</p>
            </> : <>
              <label htmlFor="order-files"><span aria-hidden="true" className="file-reminder-icon">📎</span>有製作檔案嗎？記得在這裡上傳</label>
              <p className="file-reminder-lead">需要印刷的內容（論文內文、封面、燙金 Logo 或校徽）請在這裡上傳。已經印好、只需裝訂可以略過；之後才有檔案，也可以用 Email 或 LINE 提供。</p>
            </>}
            <p>PDF、JPG、PNG、AI、ZIP，每個 50MB 以內，最多 {MAX_ATTACHMENTS} 個。檔案只會提供給鴻萊專人查看。</p>
            <input accept={ATTACHMENT_ACCEPT} disabled={submitting} id="order-files" multiple onChange={(event) => { addFiles(event.target.files); event.target.value = ""; }} type="file" />
            {files.length > 0 && <ul>{files.map((item, index) => <li key={`${item.file.name}-${index}`}><span>{item.file.name}</span><small>{formatBytes(item.file.size)}・{{ ready: "待送出", uploading: "上傳中…", done: "已上傳", failed: "上傳失敗" }[item.status]}</small>{!submitting && item.status !== "done" && <button className="text-button" onClick={() => setFiles((current) => current.filter((_, i) => i !== index))} type="button">移除</button>}</li>)}</ul>}
          </div>
        </div></div>
      </section>

      <section className="order-panel" id="contact-details">
        <div className="order-heading"><p>STEP 03 ／ CONTACT</p><h2>聯絡與配送</h2><span>報價單會寄到你填寫的 Email。</span></div>
        <div className="form-sheet"><div className="quote-field-grid">
          <fieldset className="quote-field quote-field-wide"><legend>客戶類型<span className="quote-required">必填</span></legend><div className="quote-choice-row">{["個人", "公司行號", "學校或行政單位"].map((option) => <label className="quote-choice" key={option}><input checked={draft.contact.customerType === option} id={option === "個人" ? "contact-customerType" : undefined} name="contact-customerType" onChange={() => setContact("customerType", option)} type="radio" /><span>{option}</span></label>)}</div></fieldset>
          {[["contactName", "聯絡人姓名", "text", "name"], ["phone", "手機或聯絡電話", "tel", "tel"], ["email", "Email", "email", "email"]].map(([id, label, type, auto]) => <div className="quote-field" key={id}><label htmlFor={`contact-${id}`}>{label}<span className="quote-required">必填</span></label><input autoComplete={auto} id={`contact-${id}`} onChange={(event) => setContact(id, event.target.value)} type={type} value={draft.contact[id] ?? ""} /></div>)}
          {draft.contact.customerType && draft.contact.customerType !== "個人" && <div className="quote-field"><label htmlFor="contact-organization">公司／學校名稱<span className="quote-required">必填</span></label><input autoComplete="organization" id="contact-organization" onChange={(event) => setContact("organization", event.target.value)} value={draft.contact.organization ?? ""} /></div>}
          <div className="quote-field"><label htmlFor="contact-line">LINE ID（選填）</label><input id="contact-line" onChange={(event) => setContact("line", event.target.value)} value={draft.contact.line ?? ""} /></div>
        </div>
        <div id="order-shipping" tabIndex={-1}><ShippingPicker district={draft.contact.district ?? ""} idPrefix="order" onChange={(next) => setDraft((current) => ({ ...current, contact: { ...current.contact, ...(next.shippingId !== undefined ? { shippingId: next.shippingId } : {}), ...(next.district !== undefined ? { district: next.district } : {}) } }))} shippingId={draft.contact.shippingId ?? ""} /></div>
        {shipping?.needsAddress && <div className="quote-field-grid"><div className="quote-field quote-field-wide"><label htmlFor="contact-address">配送地址<span className="quote-required">必填</span></label><input autoComplete="street-address" id="contact-address" onChange={(event) => setContact("address", event.target.value)} value={draft.contact.address ?? ""} /></div></div>}
        </div>
      </section>

      <section className="order-panel summary-panel" id="order-summary">
        <div className="order-heading"><p>STEP 04 ／ SUBMIT</p><h2>確認並送出</h2><span>送出後前往結帳，付款完成會寄出訂單明細。</span></div>
        <dl className="order-summary"><div><dt>產品</dt><dd>{product.title}</dd></div><div><dt>數量</dt><dd>{draft.values.quantity || "—"} {unit}</dd></div>{summary.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}{files.length > 0 && <div><dt>附件</dt><dd>{files.length} 個檔案</dd></div>}</dl>
        {files.length === 0 && <p className="order-file-note"><span aria-hidden="true">📎</span>{filesRequired ? <>一般影印需要檔案，請回到<a href="#order-files">上傳檔案</a>。</> : <>本次沒有附上製作檔案。需要印刷的話，請回到<a href="#order-files">上傳檔案</a>，或送出後用 Email／LINE 提供。</>}</p>}
        <div className="order-estimate"><PriceBreakdown compact estimate={estimate} /></div>
        <label className="choice-pill order-consent" htmlFor="order-privacy"><input checked={draft.privacyConsent} id="order-privacy" onChange={(event) => setDraft({ ...draft, privacyConsent: event.target.checked })} type="checkbox" /><span>我同意以上個人資料僅供鴻萊處理本次製作與聯繫使用。</span></label>
        <div className="order-actions"><button className="button button-primary" disabled={submitting} onClick={submit} type="button">{submitting ? "正在送出……" : "送出訂單"}</button></div>
        <p aria-live="polite" className="form-message">{message}</p>
      </section>
    </>}

    <dialog aria-labelledby="quote-notice-title" className="quote-notice" onCancel={(event) => { event.preventDefault(); closeNotice(); }} ref={noticeRef}>
      <p className="eyebrow">FROM QUOTE</p>
      <h2 id="quote-notice-title">已帶入你在估價頁選的規格</h2>
      <p>估價頁只有計價需要的欄位，送出前請往下確認：</p>
      <ul>
        {toConfirm.map((item) => <li key={item}>{item}</li>)}
        <li><strong>製作檔案</strong>：{filesRequired ? "一般影印一定要上傳要印的檔案。" : "有需要印刷的內容，記得在規格區下方上傳。"}</li>
      </ul>
      <button autoFocus className="button button-primary" onClick={closeNotice} type="button">我知道了，開始確認</button>
    </dialog>
  </div>;
}

"use client";

import { useEffect, useRef } from "react";

/**
 * 選單滑塊跟隨（Sliding Highlight）：給一組可點選的按鈕／選項用。
 * 滑鼠移到某個選項時，一顆滑塊從原本位置平滑滑過去並貼合該選項的大小與圓角，文字切成反差色；
 * 滑鼠離開整組時滑塊回到目前選中的那一個（aria-pressed="true" 或內含已勾選的 radio）。
 * 樣式在 globals.css 的「選單滑塊跟隨」段落；動畫曲線與頁首導覽相同。
 *
 * @param itemSelector 群組內「一個選項」的選擇器（以群組為範圍），例如 ":scope > button"
 */
export function useSlidingHighlight<T extends HTMLElement>(itemSelector: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const group = ref.current;
    if (!group) return;

    const slider = document.createElement("span");
    slider.className = "slide-pill";
    slider.setAttribute("aria-hidden", "true");
    group.classList.add("slide-group");
    group.prepend(slider);

    let hovered: HTMLElement | null = null;
    let frame = 0;

    const items = () => [...group.querySelectorAll<HTMLElement>(itemSelector)];
    const isActive = (item: HTMLElement) => item.getAttribute("aria-pressed") === "true" || Boolean(item.querySelector("input:checked"));
    const isDisabled = (item: HTMLElement) => item.matches(":disabled, .is-disabled") || Boolean(item.querySelector("input:disabled"));

    const place = () => {
      const list = items();
      const target = (hovered && list.includes(hovered) ? hovered : null) ?? list.find(isActive) ?? null;
      for (const item of list) { item.classList.add("slide-item"); item.classList.toggle("on-slider", item === target); }
      if (!target) { slider.classList.remove("visible"); return; }
      // radio 選項（label > input + span）實際看得到的外框是 span
      const box = target.matches("label") ? target.querySelector<HTMLElement>(":scope > span") ?? target : target;
      const outer = group.getBoundingClientRect();
      const inner = box.getBoundingClientRect();
      const x = inner.left - outer.left - group.clientLeft + group.scrollLeft;
      const y = inner.top - outer.top - group.clientTop + group.scrollTop;
      slider.style.transform = `translate(${x}px, ${y}px)`;
      slider.style.width = `${inner.width}px`;
      slider.style.height = `${inner.height}px`;
      slider.style.borderRadius = getComputedStyle(box).borderRadius;
      slider.classList.add("visible");
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(place); };

    const itemFrom = (node: EventTarget | null) => node instanceof Node ? items().find((item) => item.contains(node)) ?? null : null;
    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const item = itemFrom(event.target);
      if (item && !isDisabled(item) && item !== hovered) { hovered = item; schedule(); }
    };
    const onLeave = () => { hovered = null; schedule(); };
    const onFocusIn = (event: FocusEvent) => { const item = itemFrom(event.target); if (item && item.matches(":focus-visible, :has(:focus-visible)")) { hovered = item; schedule(); } };
    const onFocusOut = (event: FocusEvent) => { if (!group.contains(event.relatedTarget as Node | null)) onLeave(); };

    group.addEventListener("pointerover", onOver);
    group.addEventListener("pointerleave", onLeave);
    group.addEventListener("focusin", onFocusIn);
    group.addEventListener("focusout", onFocusOut);
    group.addEventListener("change", schedule);
    group.addEventListener("click", schedule);

    // 選項文字、選中狀態或版面改變時重新對位（React 重新渲染、換行、字型載入完成）
    const mutations = new MutationObserver(schedule);
    mutations.observe(group, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-pressed", "class", "disabled"] });
    const resize = new ResizeObserver(schedule);
    resize.observe(group);
    document.fonts?.ready.then(schedule);

    // 第一次定位不做動畫，之後才開啟過渡
    place();
    const enable = requestAnimationFrame(() => group.classList.add("slide-ready"));

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(enable);
      mutations.disconnect();
      resize.disconnect();
      group.removeEventListener("pointerover", onOver);
      group.removeEventListener("pointerleave", onLeave);
      group.removeEventListener("focusin", onFocusIn);
      group.removeEventListener("focusout", onFocusOut);
      group.removeEventListener("change", schedule);
      group.removeEventListener("click", schedule);
      group.classList.remove("slide-group", "slide-ready");
      for (const item of items()) item.classList.remove("slide-item", "on-slider");
      slider.remove();
    };
  }, [itemSelector]);

  return ref;
}

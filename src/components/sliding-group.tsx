"use client";

import type { HTMLAttributes } from "react";
import { useSlidingHighlight } from "@/lib/use-sliding-highlight";

type SlidingGroupProps = HTMLAttributes<HTMLDivElement> & {
  /** 群組內「一個選項」的選擇器，預設是直接子層的按鈕 */
  items?: string;
};

/** 一組可點選的按鈕／選項，加上「選單滑塊跟隨」效果。用法跟一般 <div> 一樣。 */
export function SlidingGroup({ items = ":scope > button", ...props }: SlidingGroupProps) {
  const ref = useSlidingHighlight<HTMLDivElement>(items);
  return <div ref={ref} {...props} />;
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { leatherSeries, type MaterialSample } from "@/data/material-samples";
import { OTHER_COVER, sampleChoice, type LeatherPicker } from "@/lib/leather";

type Option = { value: string; sample?: MaterialSample; disabled: boolean };

/**
 * 皮革色號下拉選單（自訂元件，原生 select 不能放縮圖）。
 * 依系列分組；選了數位燙金時，只能傳統燙金的皮革會停用。
 */
export function LeatherSelect({ id, picker, value, onChange, digitalOnly, attention, samplesHref, onOpenSamples }: {
  id: string;
  picker: LeatherPicker;
  value: string;
  onChange: (value: string) => void;
  digitalOnly: boolean;
  attention: boolean;
  samplesHref: string;
  onOpenSamples: () => void;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const options: Option[] = [
    ...picker.samples.map((sample) => ({ value: sampleChoice(sample), sample, disabled: digitalOnly && !sample.digitalFoil })),
    ...(picker.allowOther ? [{ value: OTHER_COVER, disabled: false }] : []),
  ];
  const selected = options.find((option) => option.value === value);
  const optionId = (index: number) => `${listId}-option-${index}`;

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  useEffect(() => {
    if (open && active >= 0) document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
  });

  const openList = () => {
    const current = options.findIndex((option) => option.value === value);
    setActive(current >= 0 ? current : options.findIndex((option) => !option.disabled));
    setOpen(true);
    window.setTimeout(() => listRef.current?.focus(), 0);
  };
  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setOpen(false);
    document.getElementById(id)?.focus();
  };
  const move = (step: number) => {
    let next = active;
    for (let i = 0; i < options.length; i++) {
      next = (next + step + options.length) % options.length;
      if (!options[next].disabled) break;
    }
    setActive(next);
  };
  const onListKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") { event.preventDefault(); move(1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); move(-1); }
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(active); }
    else if (event.key === "Escape") { event.preventDefault(); setOpen(false); document.getElementById(id)?.focus(); }
    else if (event.key === "Tab") setOpen(false);
  };

  const groups = leatherSeries.map((series) => ({ series, indexes: options.flatMap((option, index) => option.sample?.series === series.id ? [index] : []) })).filter((group) => group.indexes.length);
  const otherIndex = options.findIndex((option) => option.value === OTHER_COVER);
  const renderOption = (index: number) => {
    const option = options[index];
    return <li aria-disabled={option.disabled || undefined} aria-selected={option.value === value} className={`leather-option${index === active ? " is-active" : ""}`} id={optionId(index)} key={option.value}
      onClick={() => choose(index)} onMouseEnter={() => !option.disabled && setActive(index)} role="option">
      {option.sample ? <Image alt="" className="leather-thumb" height={40} src={option.sample.image} width={40} /> : <span aria-hidden="true" className="leather-thumb leather-thumb-other">其他</span>}
      <span className="leather-option-text"><strong>{option.sample?.code ?? "其他材質"}</strong><small>{option.sample ? option.sample.name : "布面、紙面或自備材料"}</small></span>
      {option.sample && (option.disabled ? <span className="foil-badge leather-disabled-note">不可數位燙金</span> : <span className={`foil-badge${option.sample.digitalFoil ? " foil-badge-digital" : ""}`}>{option.sample.digitalFoil ? "可數位燙金" : "傳統燙金"}</span>)}
    </li>;
  };

  return <div className={`quote-field quote-field-wide leather-select${attention ? " field-attention" : ""}`} ref={rootRef}>
    <label htmlFor={id} id={`${id}-label`}>封面皮革色號{attention && <span className="field-mark field-mark-attention">請選擇</span>}</label>
    <p>{digitalOnly ? "已選數位燙金，只能選皮紋系列（可數位燙金）。" : "每個色號都有標示可不可以數位燙金。"}</p>
    <div className="leather-anchor">
    <button aria-controls={listId} aria-expanded={open} aria-haspopup="listbox" aria-labelledby={`${id}-label ${id}`} className="leather-trigger" id={id}
      onClick={() => (open ? setOpen(false) : openList())} onKeyDown={(event) => { if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) { event.preventDefault(); openList(); } }} type="button">
      {selected ? <>
        {selected.sample ? <Image alt="" className="leather-thumb" height={40} src={selected.sample.image} width={40} /> : <span aria-hidden="true" className="leather-thumb leather-thumb-other">其他</span>}
        <span className="leather-option-text"><strong>{selected.sample?.code ?? "其他材質"}</strong><small>{selected.sample?.name ?? "布面、紙面或自備材料"}</small></span>
      </> : <span className="leather-placeholder">請選擇皮革色號</span>}
      <span aria-hidden="true" className="leather-caret">▾</span>
    </button>
    {open && <ul aria-activedescendant={active >= 0 ? optionId(active) : undefined} aria-labelledby={`${id}-label`} className="leather-list" id={listId} onKeyDown={onListKey} ref={listRef} role="listbox" tabIndex={-1}>
      {groups.map(({ series, indexes }) => <li key={series.id} role="presentation">
        <div aria-hidden="true" className="leather-group-title">{series.name}<small>{series.id === "grain" ? "可數位燙金、傳統燙金" : "僅傳統燙金"}</small></div>
        <ul role="group" aria-label={series.name}>{indexes.map(renderOption)}</ul>
      </li>)}
      {otherIndex >= 0 && <li role="presentation"><ul role="group" aria-label="其他材質">{renderOption(otherIndex)}</ul></li>}
    </ul>}
    </div>
    <p className="leather-samples-link">想看大圖？<Link href={samplesHref} onClick={onOpenSamples}>打開樣品冊挑選</Link></p>
  </div>;
}

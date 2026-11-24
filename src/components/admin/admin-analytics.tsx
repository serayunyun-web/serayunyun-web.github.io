"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-public-api";
import { money } from "@/lib/admin-labels";
import { buildMonthlyStats, type AnalyticsOrder } from "@/lib/product-analytics";

export function AdminAnalytics() {
  const [orders, setOrders] = useState<AnalyticsOrder[] | null>(null);
  const [error, setError] = useState("");
  const [month, setMonth] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    supabaseBrowser().from("orders").select("paid_at, total, snapshot").not("paid_at", "is", null).order("paid_at", { ascending: false }).limit(2000)
      .then(({ data, error: err }) => { if (err) setError("讀取訂單失敗。"); setOrders((data ?? []) as AnalyticsOrder[]); });
  }, []);

  const months = useMemo(() => buildMonthlyStats(orders ?? []), [orders]);
  const current = months.find((m) => m.month === month) ?? months[0];
  const previous = current ? months[months.indexOf(current) + 1] : undefined;
  const maxRevenue = Math.max(1, ...(current?.products.map((p) => p.revenue) ?? [0]));

  if (orders === null) return <p className="admin-empty">載入中…</p>;

  const delta = (now: number, before?: number) => before === undefined || before === 0 ? null
    : <small className={now >= before ? "is-up" : "is-down"}>{now >= before ? "▲" : "▼"} {Math.abs(Math.round(((now - before) / before) * 100))}% vs 上月</small>;

  return <>
    <div className="admin-heading"><h1>品項分析</h1></div>
    <p className="admin-muted">只計入付款成功的訂單，依付款月份統計；營收為商品金額，不含運費。一筆訂單有多個品項時，金額依數量比例分攤。</p>
    {error && <p className="form-message">{error}</p>}
    {!current ? <p className="admin-empty">目前還沒有付款成功的訂單。</p> : <>
      <div className="admin-toolbar">
        <select aria-label="月份" onChange={(event) => { setMonth(event.target.value); setOpen(null); }} value={current.month}>
          {months.map((m) => <option key={m.month} value={m.month}>{m.month.replace("-", " 年 ")} 月</option>)}
        </select>
      </div>

      <div className="admin-stats admin-analytics-stats">
        <div className="admin-stat is-static"><span>付款訂單</span><strong>{current.orders} 筆</strong>{delta(current.orders, previous?.orders)}</div>
        <div className="admin-stat is-static"><span>商品營收</span><strong>{money(current.revenue)}</strong>{delta(current.revenue, previous?.revenue)}</div>
        <div className="admin-stat is-static"><span>總數量</span><strong>{current.quantity.toLocaleString("zh-TW")}</strong>{delta(current.quantity, previous?.quantity)}</div>
        <div className="admin-stat is-static"><span>平均客單價</span><strong>{money(Math.round(current.revenue / current.orders))}</strong></div>
      </div>

      <section className="admin-card"><h2>品項排行（點品項看規格明細）</h2>
        <div className="admin-table-wrap"><table className="admin-table admin-analytics-table"><thead><tr><th>品項／規格</th><th>訂單數</th><th>數量</th><th>營收</th><th>占比</th></tr></thead><tbody>
          {current.products.map((p) => <Fragment key={p.product}>
            <tr className="is-product">
              <td><button aria-expanded={open === p.product} className="text-button" onClick={() => setOpen(open === p.product ? null : p.product)} type="button">{open === p.product ? "▾" : "▸"} {p.product}</button><small>{p.specs.length} 種規格</small></td>
              <td>{p.orders}</td><td>{p.quantity.toLocaleString("zh-TW")}</td><td>{money(p.revenue)}</td>
              <td><span className="admin-bar"><i style={{ width: `${(p.revenue / maxRevenue) * 100}%` }} /></span>{current.revenue ? Math.round((p.revenue / current.revenue) * 100) : 0}%</td>
            </tr>
            {open === p.product && p.specs.map((s) => <tr className="is-spec" key={s.spec}>
              <td>{s.spec}</td><td>{s.orders}</td><td>{s.quantity.toLocaleString("zh-TW")}</td><td>{money(s.revenue)}</td>
              <td>{p.revenue ? Math.round((s.revenue / p.revenue) * 100) : 0}%（品項內）</td>
            </tr>)}
          </Fragment>)}
        </tbody></table></div>
      </section>

      <section className="admin-card"><h2>各月份總覽</h2>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>月份</th><th>付款訂單</th><th>總數量</th><th>商品營收</th><th>最熱賣品項</th></tr></thead><tbody>
          {months.map((m) => <tr key={m.month}><td>{m.month}</td><td>{m.orders}</td><td>{m.quantity.toLocaleString("zh-TW")}</td><td>{money(m.revenue)}</td><td>{m.products[0]?.product ?? "—"}</td></tr>)}
        </tbody></table></div>
      </section>
    </>}
  </>;
}

import type { CSSProperties } from "react";
import { withBase } from "@/lib/base-path";

/**
 * 首頁開場：金線描出商標 → 整片金箔 → 光掃回原色 → 飛到導覽列商標位置。
 * 圖案由 honglai-logo.png 重描（座標同原圖左側 396×262），拿到商標原檔時可直接替換 parts。
 * 播放時機由下方行內 script 在畫面出現前決定：直接開啟首頁、7 天內沒播過、未要求減少動態才播；
 * 站內換頁回首頁不會執行 script，因此不會播。動畫時間寫在 globals.css 的 .home-intro。
 */
const parts = [
  { id: "ring", tone: "ring", start: 0, length: 0.5, d: "M227.05 65.4A96.5 96.35 0 1 0 240 183.7" }, // 圓環
  { id: "waveL", tone: "teal", start: 0.08, length: 0.38, d: "M68.9 128.35C84 123.2 101.4 124.5 114.5 137.5C125.05 124 143.5 121 159.65 138C152.85 151.7 149 161.8 153.75 171.6C128.65 164.3 102.2 168.2 94.85 196.8C76.45 179 66.4 152 68.9 128.35Z" }, // 左浪花
  { id: "waveR", tone: "teal", start: 0.15, length: 0.42, d: "M157.65 177.15C124.8 164.5 103.7 174.3 97.85 200.85C115.45 213 137.35 222 147.7 222.35C184.35 225 213.25 209 233.55 181.5C211.5 175.9 190.2 160.05 185.95 127.6C167.5 129.4 151.85 148.65 157.65 177.15Z" }, // 右浪花
  { id: "head", tone: "brown", start: 0.2, length: 0.34, d: "M135 110.5C148 84 183 72 220 76.5C203.25 85 189.1 99.2 183.05 118.05C174.7 109.3 156.95 110.3 135 110.5Z" }, // 頭
  { id: "body", tone: "brown", start: 0.25, length: 0.46, d: "M388.3 97.2C353.45 78.25 318.7 63.9 273 63.5C229.35 63 182.1 99.85 182.5 138.55C186.7 163.85 209.7 182.95 247.3 185C256 185.6 264.5 184.6 268 182.2C269.5 181.2 270.2 179.8 270.9 178C291 125.5 325.85 94.9 388.3 97.2Z" }, // 身
  { id: "dorsal", tone: "brown", start: 0.38, length: 0.3, d: "M275 21.5C251 25.75 228.95 47 227.6 71.4C234.9 65 250.9 61.95 271 59.4C261.75 51.2 262.65 38.6 275 21.5Z" }, // 背鰭
  { id: "pelvic", tone: "brown", start: 0.42, length: 0.28, d: "M278.85 163C289.95 172.6 296.3 189.95 281.5 206.2C271 211.6 257.5 209 249.8 204C264.1 197.15 274.8 184.9 278.85 163Z" }, // 腹鰭
] as const;

const EYE = { cx: 178.8, cy: 91.6, r: 6.3 };
const RING_WIDTH = 3.8;
const COLORS = { ring: "#46bebd", teal: "#46bebd", brown: "#7e7264", eye: "#f1ab77" };
const GOLD = "url(#home-intro-gold)";
const VIEW_BOX = "0 0 952 262";
const filledParts = parts.filter((part) => part.tone !== "ring");

const introScript = `(function(){
var intro=document.getElementById("home-intro"),logo=document.querySelector(".site-header .brand-logo");
if(!intro||!logo)return;
var KEY="honglai-intro-at",forced=/[?&]intro(=|&|$)/.test(location.search);
try{
if(!forced){
if(document.hidden||location.hash||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
if(Date.now()-Number(localStorage.getItem(KEY)||0)<6048e5)return;
}
localStorage.setItem(KEY,String(Date.now()));
}catch(e){if(!forced)return}
var mark=intro.querySelector(".home-intro-mark"),timers=[],events=["pointerdown","keydown","wheel","touchmove"];
function aim(){
var a=mark.getBoundingClientRect(),b=logo.getBoundingClientRect();
if(!a.width||!b.width)return;
intro.style.setProperty("--fly-x",b.left-a.left+"px");
intro.style.setProperty("--fly-y",b.top-a.top+"px");
intro.style.setProperty("--fly-s",String(b.width/a.width));
}
function close(){
intro.hidden=true;
timers.forEach(clearTimeout);
events.forEach(function(name){removeEventListener(name,skip,true)});
}
function skip(){intro.removeAttribute("data-play");close()}
intro.hidden=false;
aim();
intro.setAttribute("data-play","");
timers.push(setTimeout(aim,1450),setTimeout(close,2120));
events.forEach(function(name){addEventListener(name,skip,{capture:true,passive:true})});
})()`;

function Shapes({ paint }: { paint: (tone: keyof typeof COLORS) => string }) {
  return parts.map((part) =>
    part.tone === "ring" ? (
      <path d={part.d} fill="none" key={part.id} stroke={paint("ring")} strokeWidth={RING_WIDTH} />
    ) : (
      <path d={part.d} fill={paint(part.tone)} key={part.id} />
    ),
  );
}

const timing = (start: number, length: number) => ({ "--line-start": `${start}s`, "--line-length": `${length}s` }) as CSSProperties;

export function HomeIntro() {
  return (
    <>
      <div aria-hidden="true" className="home-intro" hidden id="home-intro" suppressHydrationWarning>
        <div className="home-intro-paper" />
        <div className="home-intro-stage">
          <div className="home-intro-mark">
            <svg className="home-intro-foil" viewBox={VIEW_BOX}>
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="home-intro-gold" x1="60" x2="390" y1="40" y2="230">
                  <stop offset="0" stopColor="#b8892a" />
                  <stop offset=".22" stopColor="#f0d98a" />
                  <stop offset=".42" stopColor="#d4af37" />
                  <stop offset=".6" stopColor="#f7e8b0" />
                  <stop offset=".8" stopColor="#c79a2e" />
                  <stop offset="1" stopColor="#e6c766" />
                </linearGradient>
                <linearGradient id="home-intro-shine">
                  <stop offset="0" stopColor="#fff6d8" stopOpacity="0" />
                  <stop offset=".5" stopColor="#fffbe9" />
                  <stop offset="1" stopColor="#fff6d8" stopOpacity="0" />
                </linearGradient>
                <clipPath id="home-intro-clip">
                  {filledParts.map((part) => <path d={part.d} key={part.id} />)}
                </clipPath>
              </defs>
              <Shapes paint={() => GOLD} />
              {/* 同為金色時，鳥身邊緣留一道底色，才不會和浪花黏成一塊 */}
              {parts.filter((part) => part.id === "body").map((part) => (
                <path d={part.d} fill={GOLD} key={part.id} stroke="#faf8f1" strokeWidth="2" />
              ))}
              <circle {...EYE} fill="#faf8f1" />
            </svg>
            <svg className="home-intro-color" viewBox={VIEW_BOX}>
              <Shapes paint={(tone) => COLORS[tone]} />
              <circle {...EYE} fill={COLORS.eye} />
            </svg>
            <svg className="home-intro-lines" viewBox={VIEW_BOX}>
              {parts.map((part) => <path d={part.d} key={part.id} pathLength={1} style={timing(part.start, part.length)} />)}
              <circle {...EYE} pathLength={1} style={timing(0.45, 0.2)} />
            </svg>
            <svg className="home-intro-shine" viewBox={VIEW_BOX}>
              <g clipPath="url(#home-intro-clip)"><rect fill="url(#home-intro-shine)" height="262" width="120" /></g>
            </svg>
            {/* eslint-disable-next-line @next/next/no-img-element -- 與導覽列同一張商標，不需要圖片最佳化 */}
            <img alt="" className="home-intro-name" height={262} src={withBase("/honglai-logo.png")} width={952} />
          </div>
          <p className="home-intro-tagline">用印刷，裝訂每一個重要時刻。</p>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
    </>
  );
}

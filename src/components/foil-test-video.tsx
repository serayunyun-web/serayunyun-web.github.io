"use client";

import { useEffect, useRef, useState } from "react";
import { digitalFoil } from "@/data/digital-foil";
import { withBase } from "@/lib/base-path";

/** 耐刮測試影片：捲到才播、離開就停；使用者手動暫停或系統減少動態時不自動播放。 */
export function FoilTestVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
      else if (!pausedByUser.current) video.play().catch(() => { /* 瀏覽器擋自動播放時保留封面與播放鈕 */ });
    }, { threshold: 0.35 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    pausedByUser.current = !video.paused;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div className="foil-feature-video">
      <video aria-label="數位燙金耐刮測試影片" loop muted onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} playsInline poster={withBase(digitalFoil.video.poster)} preload="none" ref={ref}>
        <source src={withBase(digitalFoil.video.src)} type="video/mp4" />
      </video>
      <span className="foil-feature-video-label">實際耐刮測試</span>
      <button aria-label={playing ? "暫停影片" : "播放影片"} onClick={toggle} type="button">
        <svg aria-hidden="true" viewBox="0 0 24 24">{playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5v14l11-7z" />}</svg>
      </button>
    </div>
  );
}

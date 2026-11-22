"use client";
import { useEffect, useRef } from "react";

/** Record readers play one clip at a time. Leaving the viewport pauses it. */
export function LoopVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const pause = () => {
      if (document.hidden) el.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) el.pause();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", pause);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", pause);
    };
  }, []);
  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      controls
      playsInline
      preload="none"
      aria-label={label}
      onPlay={() =>
        document.querySelectorAll("video").forEach((el) => {
          if (el !== ref.current) el.pause();
        })
      }
    />
  );
}

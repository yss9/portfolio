import type { DemoClip } from "@/content/types";
import { LoopVideo } from "./LoopVideo";

/** Grid of short demo loops shown above the still screenshots. */
export function DemoClips({ name, clips }: { name: string; clips: DemoClip[] }) {
  if (clips.length === 0) return null;
  const phone = clips.every((clip) => clip.device === "phone");

  return (
    <section id="demo" className="screens demo-clips" aria-label={`${name} 시연 화면`}>
      <div className="site-container">
        <div className="screens-head">
          <span>시연 화면</span>
          <span>실제 프론트엔드에 시연용 목 데이터를 넣어 재현했습니다</span>
        </div>
        <div className={phone ? "clips-grid is-phone" : "clips-grid"}>
          {clips.map((clip, index) => (
            <figure key={clip.id} className="clip-figure">
              <div className="clip-frame">
                <LoopVideo
                  src={clip.src}
                  poster={clip.poster}
                  label={`${clip.title} 시연`}
                />
              </div>
              <figcaption>
                <strong>
                  {String(index + 1).padStart(2, "0")} · {clip.title}
                </strong>
                {clip.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

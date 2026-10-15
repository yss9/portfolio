import type { CSSProperties } from "react";

/** Left-to-right step diagram; steps marked `guard` are where the server checks state. */
export function FlowDiagram({
  title,
  steps,
  guards,
  caption,
}: {
  title?: string;
  steps: { label: string; detail?: string; guard?: boolean }[];
  guards?: string[];
  caption?: string;
}) {
  return (
    <figure className="flow">
      {title && <p className="sub-title flow-title">{title}</p>}
      <ol
        className="flow-steps"
        style={{ "--n": steps.length } as CSSProperties}
      >
        {steps.map((step, index) => (
          <li
            key={step.label}
            className="flow-step"
            data-guard={step.guard ? "" : undefined}
          >
            <span className="flow-step-no">
              {String(index + 1).padStart(2, "0")}
              {step.guard ? " · 서버 검증" : ""}
            </span>
            <strong>{step.label}</strong>
            {step.detail && <p>{step.detail}</p>}
          </li>
        ))}
      </ol>
      {guards && guards.length > 0 && (
        <ul className="flow-guards">
          {guards.map((guard) => (
            <li key={guard}>{guard}</li>
          ))}
        </ul>
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

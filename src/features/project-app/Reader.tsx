"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

export function Reader({
  label,
  titles,
  selected,
  onSelect,
  children,
}: {
  label: string;
  titles: string[];
  selected: number;
  onSelect: (index: number) => void;
  children: ReactNode;
}) {
  const body = useRef<HTMLElement>(null);
  const previous = useRef(selected);
  useEffect(() => {
    if (previous.current !== selected) {
      previous.current = selected;
      const el = body.current;
      const scroller = el?.closest(".window-scroll");
      const top = (scroller?.getBoundingClientRect().top ?? 0) + 48;
      if (el && el.getBoundingClientRect().top < top) {
        const offset = el.getBoundingClientRect().top - top - 8;
        if (scroller) scroller.scrollTop += offset;
        else window.scrollBy(0, offset);
      }
    }
  }, [selected]);
  return (
    <div className="split-reader">
      <nav className="reader-index" aria-label={label}>
        <h3>
          {label} <small>{titles.length}</small>
        </h3>
        {titles.map((title, n) => (
          <button
            key={title}
            aria-current={n === selected}
            onClick={() => onSelect(n)}
          >
            {title}
          </button>
        ))}
      </nav>
      <label className="reader-picker">
        {label}
        <select
          value={selected}
          onChange={(e) => onSelect(Number(e.target.value))}
        >
          {titles.map((title, n) => (
            <option key={title} value={n}>
              {title}
            </option>
          ))}
        </select>
      </label>
      <article ref={body} key={selected}>
        {children}
      </article>
    </div>
  );
}

export function SourceCode({ name, code }: { name: string; code: string }) {
  const [message, setMessage] = useState("");
  const block = useRef<HTMLElement>(null);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setMessage("복사됨");
    } catch {
      if (block.current) {
        const range = document.createRange();
        range.selectNodeContents(block.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setMessage("코드를 선택했습니다. 복사 단축키를 사용하세요.");
    }
  }
  return (
    <details className="code-evidence">
      <summary>{name}</summary>
      <div className="code-tools">
        <button onClick={copy}>
          <Copy size={14} />
          코드 복사
        </button>
        <small role="status">
          {message && <Check size={13} />} {message}
        </small>
      </div>
      <pre>
        <code ref={block}>{code}</code>
      </pre>
    </details>
  );
}

import type { ReactNode } from "react";
import "./Folder.css";

// React Bits Folder (55f3b4106b12), controlled by the enclosing desktop link.
// The middle sheet provides the measured origin for the window animation.
export function Folder({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <span aria-hidden="true" className="rb-folder" data-open={open}>
      <span className="folder__back">
        <span className="folder__paper" />
        <span className="folder__paper" />
        <span className="folder__paper" data-window-sheet="" />
        <span className="folder__front" />
        <span className="folder__front right">{children}</span>
      </span>
    </span>
  );
}

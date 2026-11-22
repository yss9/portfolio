export function ordinaryClick(e: React.MouseEvent<HTMLAnchorElement>) {
  return (
    !e.defaultPrevented &&
    !e.metaKey &&
    !e.ctrlKey &&
    !e.altKey &&
    !e.shiftKey &&
    e.button === 0
  );
}

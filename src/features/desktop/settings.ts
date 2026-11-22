export function readSetting(key: string, session = false) {
  try {
    return (session ? sessionStorage : localStorage).getItem(
      "portfolio:v1:" + key,
    );
  } catch {
    return null;
  }
}
export function saveSetting(key: string, value: string, session = false) {
  try {
    (session ? sessionStorage : localStorage).setItem(
      "portfolio:v1:" + key,
      value,
    );
  } catch {
    /* Storage can be disabled. */
  }
  if (key === "reduce") dispatchEvent(new Event("portfolio-preferences"));
}
export function resetEntry(replay = false) {
  saveSetting("desktop", "", true);
  saveSetting("booted", replay ? "" : "1", true);
}

export function keepLockInHistory() {
  history.replaceState({ ...history.state, sysReturnToLock: true }, "");
}

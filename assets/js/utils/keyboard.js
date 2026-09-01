export function registerGlobalShortcuts(handlers = {}) {
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    if (e.code === "Space" && handlers.onSpace) {
      e.preventDefault();
      handlers.onSpace();
    }

    if (e.code === "KeyR" && handlers.onReset) {
      e.preventDefault();
      handlers.onReset();
    }

    if (e.code === "KeyM" && handlers.onModeChange) {
      e.preventDefault();
      handlers.onModeChange();
    }
  });
}

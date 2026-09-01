import { $ } from "../utils/dom.js";

export class ModalManager {
  constructor(modalId) {
    this.modal = $(`#${modalId}`);
  }

  open() {
    if (this.modal) {
      this.modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  bindEvents(openBtnId, closeBtnId) {
    const openBtn = $(`#${openBtnId}`);
    const closeBtn = $(`#${closeBtnId}`);

    if (openBtn) openBtn.addEventListener("click", () => this.open());
    if (closeBtn) closeBtn.addEventListener("click", () => this.close());

    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.close();
      });
    }
  }
}

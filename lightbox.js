/* 古画 · lightbox
 *
 * 全局委派：点击作品页的 .gallery__item 图或 .yfj-panel__leaf-img
 * → 在当前页面浮现大图覆盖层，ESC 或外部点击关闭。
 * 不开新页面。
 */
(function () {
  "use strict";

  if (window.__guhuaLightbox) return;
  window.__guhuaLightbox = true;

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "图片预览");

  const img = document.createElement("img");
  img.className = "lightbox__img";
  img.alt = "";
  overlay.appendChild(img);

  const closeBtn = document.createElement("button");
  closeBtn.className = "lightbox__close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "关闭");
  closeBtn.textContent = "×";
  overlay.appendChild(closeBtn);

  const caption = document.createElement("div");
  caption.className = "lightbox__caption";
  overlay.appendChild(caption);

  document.body.appendChild(overlay);

  let scrollY = 0;

  function open(src, alt) {
    img.src = src;
    img.alt = alt || "";
    caption.textContent = alt || "";
    overlay.classList.add("lightbox--open");
    scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("lightbox--open");
    document.body.style.overflow = "";
    /* 延迟清 src 避免关闭动画看到空框 */
    setTimeout(() => { img.src = ""; }, 300);
  }

  /* 全局委派点击 */
  document.addEventListener("click", (e) => {
    /* 1. gallery__item 里的 <a> 包着 img */
    const galleryA = e.target.closest(".gallery__item a");
    if (galleryA) {
      e.preventDefault();
      const innerImg = galleryA.querySelector("img");
      if (innerImg) open(innerImg.src, innerImg.alt);
      return;
    }
    /* 2. 卷轴面板里的真迹缩略图 */
    const leafImg = e.target.closest(".yfj-panel__leaf-img");
    if (leafImg) {
      e.preventDefault();
      e.stopPropagation();
      open(leafImg.src, leafImg.alt);
      return;
    }
  }, true);

  /* 关闭：点击 overlay 背景或关闭按钮 */
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest(".lightbox__close")) {
      close();
    }
  });

  /* ESC 关闭 */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("lightbox--open")) {
      close();
    }
  });
})();

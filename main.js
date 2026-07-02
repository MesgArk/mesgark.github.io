/* MesgArk — interacciones mínimas en JavaScript vanilla (sin jQuery). */
(function () {
  "use strict";

  /* --- Menú móvil --------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest(".nav__link")) {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --- Slider (Arquitectura y paisajismo) --------------------------------- */
  document.querySelectorAll(".slider").forEach(function (slider) {
    var track = slider.querySelector(".slider__track");
    if (!track) return;

    var slides = track.querySelectorAll(".slider__slide");
    var index = 0;

    function go(i) {
      // desplazamiento determinista: cada slide ocupa exactamente el ancho del track
      index = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
    }

    var prev = slider.querySelector(".slider__btn--prev");
    var next = slider.querySelector(".slider__btn--next");
    if (prev) prev.addEventListener("click", function () { go(index - 1); });
    if (next) next.addEventListener("click", function () { go(index + 1); });

    // mantener el índice sincronizado si el usuario arrastra/desliza manualmente
    var raf;
    track.addEventListener("scroll", function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        index = Math.round(track.scrollLeft / track.clientWidth);
        raf = null;
      });
    });
  });

  /* --- Lightbox de galería ------------------------------------------------ */
  var gallery = document.querySelector(".gallery");
  if (gallery) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Cerrar">&times;</button><img alt="">';
    document.body.appendChild(box);

    var boxImg = box.querySelector("img");
    var closeBtn = box.querySelector(".lightbox__close");

    function open(src, alt) {
      boxImg.src = src;
      boxImg.alt = alt || "";
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function close() {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    gallery.addEventListener("click", function (e) {
      var img = e.target.closest(".gallery__item img");
      if (img) open(img.src, img.alt);
    });

    closeBtn.addEventListener("click", close);
    box.addEventListener("click", function (e) {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }
})();

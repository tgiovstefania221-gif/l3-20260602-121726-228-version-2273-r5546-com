(function () {
  const menuButton = document.querySelector(".mobile-menu-button");
  const mobilePanel = document.querySelector(".mobile-panel");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      mobilePanel.hidden = expanded;
    });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  let activeSlide = 0;
  let timer = null;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      const active = slideIndex === activeSlide;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === activeSlide);
    });
  }

  function startCarousel() {
    if (slides.length <= 1) {
      return;
    }

    window.clearInterval(timer);
    timer = window.setInterval(function () {
      setSlide(activeSlide + 1);
    }, 5600);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      setSlide(index);
      startCarousel();
    });
  });

  setSlide(0);
  startCarousel();

  const searchInput = document.querySelector(".site-search-input");
  const selects = Array.from(document.querySelectorAll(".filter-select"));
  const cards = Array.from(document.querySelectorAll(".movie-card, .ranking-item"));
  const noResult = document.querySelector(".no-result");

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const typeSelect = selects.find(function (select) {
      return select.dataset.filter === "type";
    });
    const yearSelect = selects.find(function (select) {
      return select.dataset.filter === "year";
    });
    const typeValue = typeSelect ? typeSelect.value : "";
    const yearValue = yearSelect ? yearSelect.value : "";
    let visible = 0;

    cards.forEach(function (card) {
      const text = card.dataset.search || "";
      const typeMatches = !typeValue || card.dataset.type === typeValue;
      const yearMatches = !yearValue || card.dataset.year === yearValue;
      const queryMatches = !query || text.indexOf(query) !== -1;
      const show = typeMatches && yearMatches && queryMatches;
      card.style.display = show ? "" : "none";

      if (show) {
        visible += 1;
      }
    });

    if (noResult) {
      noResult.classList.toggle("is-visible", visible === 0);
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  selects.forEach(function (select) {
    select.addEventListener("change", applyFilters);
  });

  const backTop = document.querySelector(".back-to-top");
  if (backTop) {
    window.addEventListener("scroll", function () {
      backTop.classList.toggle("is-visible", window.scrollY > 520);
    });
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();

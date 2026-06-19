(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function bindMobileMenu() {
    var button = document.querySelector('[data-menu-button]');
    var menu = document.querySelector('[data-mobile-nav]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  function bindHero() {
    var carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', carousel);
    var dots = selectAll('[data-hero-dot]', carousel);
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function play() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        play();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        play();
      });
    }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', play);
    show(0);
    play();
  }

  function bindCatalog() {
    var grid = document.querySelector('[data-movie-grid]');
    if (!grid) {
      return;
    }
    var cards = selectAll('[data-movie-card]', grid);
    var search = document.querySelector('[data-search-input]');
    var buttons = selectAll('[data-filter]');
    var sort = document.querySelector('[data-sort-select]');
    var active = 'all';

    function apply() {
      var keyword = search ? search.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var matchCategory = active === 'all' || card.getAttribute('data-category') === active;
        var matchKeyword = !keyword || (card.getAttribute('data-search') || '').indexOf(keyword) !== -1;
        card.classList.toggle('is-hidden', !(matchCategory && matchKeyword));
      });
    }

    function applySort() {
      if (!sort) {
        return;
      }
      var value = sort.value;
      var sorted = cards.slice();
      if (value === 'year-desc') {
        sorted.sort(function (a, b) {
          return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
        });
      }
      if (value === 'year-asc') {
        sorted.sort(function (a, b) {
          return Number(a.getAttribute('data-year') || 0) - Number(b.getAttribute('data-year') || 0);
        });
      }
      if (value === 'default') {
        sorted.sort(function (a, b) {
          return cards.indexOf(a) - cards.indexOf(b);
        });
      }
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        active = button.getAttribute('data-filter') || 'all';
        buttons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        apply();
      });
    });

    if (search) {
      search.addEventListener('input', apply);
    }

    if (sort) {
      sort.addEventListener('change', function () {
        applySort();
        apply();
      });
    }

    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindMobileMenu();
    bindHero();
    bindCatalog();
  });
})();

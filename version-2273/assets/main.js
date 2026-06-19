(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length > 0) {
    var active = 0;
    var showSlide = function (index) {
      active = index % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });
    showSlide(0);
    window.setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  var heroForm = document.querySelector('[data-hero-search]');
  if (heroForm) {
    heroForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = heroForm.querySelector('input');
      var keyword = input ? input.value.trim() : '';
      window.location.href = './search.html?q=' + encodeURIComponent(keyword);
    });
  }

  var filterRoots = Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]'));
  filterRoots.forEach(function (root) {
    var input = root.querySelector('[data-filter-keyword]');
    var year = root.querySelector('[data-filter-year]');
    var type = root.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-movie-card]'));
    var empty = root.querySelector('[data-no-results]');

    var apply = function () {
      var q = input ? input.value.trim().toLowerCase() : '';
      var y = year ? year.value : '';
      var t = type ? type.value : '';
      var shown = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var ok = true;
        if (q && text.indexOf(q) === -1) {
          ok = false;
        }
        if (y && cardYear !== y) {
          ok = false;
        }
        if (t && cardType !== t) {
          ok = false;
        }
        card.classList.toggle('hidden-card', !ok);
        if (ok) {
          shown += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', shown === 0);
      }
    };

    [input, year, type].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
    apply();
  });

  var searchRoot = document.querySelector('[data-search-page]');
  if (searchRoot && window.SEARCH_MOVIES) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var input = searchRoot.querySelector('[data-search-input]');
    var category = searchRoot.querySelector('[data-search-category]');
    var results = searchRoot.querySelector('[data-search-results]');
    var empty = searchRoot.querySelector('[data-search-empty]');
    if (input) {
      input.value = q;
    }

    var render = function () {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var cat = category ? category.value : '';
      var data = window.SEARCH_MOVIES.filter(function (movie) {
        var text = [movie.title, movie.category, movie.genre, movie.region, movie.type, movie.year].join(' ').toLowerCase();
        if (keyword && text.indexOf(keyword) === -1) {
          return false;
        }
        if (cat && movie.category !== cat) {
          return false;
        }
        return true;
      }).slice(0, 240);

      if (results) {
        results.innerHTML = data.map(function (movie) {
          return [
            '<a class="movie-card" href="' + movie.url + '">',
            '<div class="poster">',
            '<img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="badge">' + escapeHtml(movie.category) + '</span>',
            '<span class="duration">' + escapeHtml(movie.year) + '</span>',
            '</div>',
            '<div class="card-body">',
            '<h3 class="card-title">' + escapeHtml(movie.title) + '</h3>',
            '<p class="card-desc">' + escapeHtml(movie.genre) + ' · ' + escapeHtml(movie.region) + '</p>',
            '<div class="card-meta"><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
            '</div>',
            '</a>'
          ].join('');
        }).join('');
      }
      if (empty) {
        empty.classList.toggle('is-visible', data.length === 0);
      }
    };

    var escapeHtml = function (text) {
      return String(text).replace(/[&<>"]/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;'
        }[char];
      });
    };

    [input, category].forEach(function (control) {
      if (control) {
        control.addEventListener('input', render);
        control.addEventListener('change', render);
      }
    });
    render();
  }
})();

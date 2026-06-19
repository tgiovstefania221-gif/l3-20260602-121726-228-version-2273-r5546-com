(function () {
  var navButton = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var index = Number(dot.getAttribute('data-slide'));
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  Array.prototype.slice.call(document.querySelectorAll('.filter-input')).forEach(function (input) {
    var scope = input.closest('section') || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-filter]'));

    input.addEventListener('input', function () {
      var value = input.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-filter') || card.textContent || '').toLowerCase();
        card.classList.toggle('is-filter-hidden', value && text.indexOf(value) === -1);
      });
    });
  });
})();

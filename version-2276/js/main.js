(function() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");

    if (header && toggle) {
        toggle.addEventListener("click", function() {
            var open = header.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    document.querySelectorAll("[data-hero]").forEach(function(hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                if (dotIndex === current) {
                    dot.setAttribute("aria-current", "true");
                } else {
                    dot.removeAttribute("aria-current");
                }
            });
        }

        dots.forEach(function(dot, dotIndex) {
            dot.addEventListener("click", function() {
                show(dotIndex);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function() {
                show(current + 1);
            }, 5200);
        }
    });

    document.querySelectorAll(".movie-list-scope").forEach(function(scope) {
        var searchInput = scope.querySelector(".js-card-search");
        var categorySelect = scope.querySelector(".js-category-filter");
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .rank-row"));

        function filterCards() {
            var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
            var category = categorySelect ? categorySelect.value : "";

            cards.forEach(function(card) {
                var text = (card.getAttribute("data-search") || "").toLowerCase();
                var cardCategory = card.getAttribute("data-category") || "";
                var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
                var categoryMatch = !category || cardCategory === category;
                card.classList.toggle("is-filter-hidden", !(keywordMatch && categoryMatch));
            });
        }

        if (searchInput) {
            searchInput.addEventListener("input", filterCards);
        }
        if (categorySelect) {
            categorySelect.addEventListener("change", filterCards);
        }
    });
})();

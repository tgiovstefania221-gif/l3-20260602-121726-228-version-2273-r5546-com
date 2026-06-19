(function () {
    "use strict";

    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function initMobileMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function initHero() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
        var prev = slider.querySelector("[data-hero-prev]");
        var next = slider.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle("hero-slide-active", itemIndex === index);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle("active", itemIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot, itemIndex) {
            dot.addEventListener("click", function () {
                show(itemIndex);
                start();
            });
        });
        slider.addEventListener("mouseenter", stop);
        slider.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function initSearchForms() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("[data-search-form]"));
        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var value = input ? input.value.trim() : "";
                var target = "./search.html";
                if (value) {
                    target += "?q=" + encodeURIComponent(value);
                }
                window.location.href = target;
            });
        });
    }

    function initFilters() {
        var panel = document.querySelector("[data-filter-panel]");
        if (!panel) {
            return;
        }
        var keyword = panel.querySelector("[data-filter-keyword]");
        var year = panel.querySelector("[data-filter-year]");
        var type = panel.querySelector("[data-filter-type]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-filter-card]"));
        var empty = document.querySelector("[data-empty-state]");
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";

        if (keyword && query) {
            keyword.value = query;
        }

        function run() {
            var keywordValue = keyword ? keyword.value.trim().toLowerCase() : "";
            var yearValue = year ? year.value : "";
            var typeValue = type ? type.value : "";
            var shown = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute("data-filter-text") || "").toLowerCase();
                var cardYear = card.getAttribute("data-year") || "";
                var cardType = card.getAttribute("data-type") || "";
                var matched = true;

                if (keywordValue && text.indexOf(keywordValue) === -1) {
                    matched = false;
                }
                if (yearValue && cardYear !== yearValue) {
                    matched = false;
                }
                if (typeValue && cardType !== typeValue) {
                    matched = false;
                }

                card.style.display = matched ? "" : "none";
                if (matched) {
                    shown += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", shown === 0);
            }
        }

        [keyword, year, type].forEach(function (control) {
            if (control) {
                control.addEventListener("input", run);
                control.addEventListener("change", run);
            }
        });
        run();
    }

    window.setupMoviePlayer = function (source) {
        ready(function () {
            var video = document.querySelector("[data-player-video]");
            var trigger = document.querySelector("[data-player-trigger]");
            var loaded = false;
            var hls = null;

            if (!video || !trigger || !source) {
                return;
            }

            function attach() {
                if (loaded) {
                    return;
                }
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls();
                    hls.loadSource(source);
                    hls.attachMedia(video);
                } else {
                    video.src = source;
                }
                loaded = true;
            }

            function start() {
                attach();
                trigger.classList.add("is-hidden");
                var result = video.play();
                if (result && typeof result.catch === "function") {
                    result.catch(function () {});
                }
            }

            trigger.addEventListener("click", start);
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
            video.addEventListener("play", function () {
                trigger.classList.add("is-hidden");
            });
            window.addEventListener("beforeunload", function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    };

    ready(function () {
        initMobileMenu();
        initHero();
        initSearchForms();
        initFilters();
    });
})();

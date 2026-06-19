
import { H as Hls } from './hls-vendor-dru42stk.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function initMenu() {
  const button = $('[data-menu-button]');
  const nav = $('[data-mobile-nav]');
  if (!button || !nav) {
    return;
  }
  button.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

function initBackTop() {
  const button = $('[data-back-top]');
  if (!button) {
    return;
  }
  const toggle = () => {
    button.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', toggle, { passive: true });
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  toggle();
}

function initHero() {
  const slider = $('[data-hero-slider]');
  if (!slider) {
    return;
  }
  const slides = $$('[data-hero-slide]', slider);
  const dots = $$('[data-hero-dot]', slider);
  const prev = $('[data-hero-prev]', slider);
  const next = $('[data-hero-next]', slider);
  let current = 0;
  let timer = null;

  const activate = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => slide.classList.toggle('active', idx === current));
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === current));
  };

  const start = () => {
    stop();
    timer = window.setInterval(() => activate(current + 1), 5200);
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      activate(idx);
      start();
    });
  });

  if (prev) {
    prev.addEventListener('click', () => {
      activate(current - 1);
      start();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      activate(current + 1);
      start();
    });
  }

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  activate(0);
  start();
}

function cardMatches(card, query, type, region) {
  const text = (card.dataset.searchText || '').toLowerCase();
  const cardType = card.dataset.type || '';
  const cardRegion = card.dataset.region || '';
  const queryOk = !query || text.includes(query);
  const typeOk = !type || cardType.includes(type);
  const regionOk = !region || cardRegion.includes(region) || text.includes(region.toLowerCase());
  return queryOk && typeOk && regionOk;
}

function renderSearchResults(query, type, region, target) {
  if (!target || !window.MOVIE_INDEX) {
    return;
  }
  if (!query && !type && !region) {
    target.innerHTML = '';
    return;
  }
  const filtered = window.MOVIE_INDEX.filter((movie) => {
    const text = movie.search.toLowerCase();
    const queryOk = !query || text.includes(query);
    const typeOk = !type || movie.type.includes(type);
    const regionOk = !region || movie.region.includes(region) || text.includes(region.toLowerCase());
    return queryOk && typeOk && regionOk;
  }).slice(0, 12);

  target.innerHTML = filtered.map((movie) => `
    <a class="search-result-card" href="./${escapeHtml(movie.url)}">
      <img src="${escapeHtml(movie.cover)}" alt="${escapeHtml(movie.title)}" loading="lazy">
      <span>
        <strong>${escapeHtml(movie.title)}</strong>
        <span>${escapeHtml(movie.year)} · ${escapeHtml(movie.region)} · ${escapeHtml(movie.type)}</span>
      </span>
    </a>
  `).join('');
}

function initSearch() {
  const input = $('[data-search-input]');
  const typeFilter = $('[data-type-filter]');
  const regionFilter = $('[data-region-filter]');
  const resultBox = $('[data-search-results]');
  const cards = $$('[data-movie-card]');
  if (!input && !typeFilter && !regionFilter) {
    return;
  }

  const update = () => {
    const query = (input?.value || '').trim().toLowerCase();
    const type = typeFilter?.value || '';
    const region = regionFilter?.value || '';
    cards.forEach((card) => {
      card.classList.toggle('hidden-by-filter', !cardMatches(card, query, type, region));
    });
    renderSearchResults(query, type, region, resultBox);
  };

  [input, typeFilter, regionFilter].forEach((control) => {
    if (control) {
      control.addEventListener('input', update);
      control.addEventListener('change', update);
    }
  });
}

function initPlayers() {
  $$('[data-hls-player]').forEach((box) => {
    const video = $('video', box);
    const trigger = $('[data-play-trigger]', box);
    if (!video) {
      return;
    }
    const streamUrl = video.dataset.stream;
    let loaded = false;
    let hls = null;

    const load = () => {
      if (loaded || !streamUrl) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (Hls && Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
      loaded = true;
    };

    const play = async () => {
      load();
      box.classList.add('is-playing');
      video.controls = true;
      try {
        await video.play();
      } catch (error) {
        video.controls = true;
      }
    };

    if (trigger) {
      trigger.addEventListener('click', play);
    }

    video.addEventListener('click', () => {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', () => box.classList.add('is-playing'));
    video.addEventListener('emptied', () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      loaded = false;
      box.classList.remove('is-playing');
    });
  });
}

initMenu();
initBackTop();
initHero();
initSearch();
initPlayers();

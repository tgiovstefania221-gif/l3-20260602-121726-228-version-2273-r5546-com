function initMoviePlayer(videoId, overlayId, source) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  var loaded = false;

  function attachSource() {
    if (loaded || !video || !source) {
      return;
    }

    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  }

  function start() {
    attachSource();

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    var playTask = video.play();

    if (playTask && typeof playTask.catch === 'function') {
      playTask.catch(function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
    }
  }

  if (overlay) {
    overlay.addEventListener('click', start);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
  }
}

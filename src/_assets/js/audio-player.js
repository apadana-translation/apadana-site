function formatTime(seconds) {
  const sec = parseInt(seconds, 10);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = n => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

class PoemAudio extends HTMLElement {
  connectedCallback() {
    const audioEl = document.getElementById('html5-audio');
    if (!audioEl) return;

    const timeline = document.getElementById('audio-timeline');
    const playhead = document.getElementById('audio-playhead');

    const setPlayState = (playing) => {
      document.querySelectorAll('.audio-control').forEach(btn => {
        btn.classList.toggle('is-playing', playing);
        btn.classList.toggle('is-paused', !playing);
      });
    };

    document.querySelectorAll('.audio-control').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!audioEl.paused) {
          audioEl.pause();
          setPlayState(false);
        } else {
          audioEl.play();
          setPlayState(true);
        }
      });
    });

    document.querySelectorAll('.audio-rewind').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        audioEl.currentTime = Math.max(0, audioEl.currentTime - 10);
      });
    });

    const durationEl = document.getElementById('audio-duration');
    const writeDuration = () => {
      if (durationEl && !isNaN(audioEl.duration)) {
        durationEl.textContent = formatTime(audioEl.duration);
      }
    };
    audioEl.addEventListener('loadedmetadata', writeDuration);
    writeDuration();

    audioEl.addEventListener('ended', () => {
      setPlayState(false);
      audioEl.currentTime = 0;
    });

    if (timeline && playhead) {
      timeline.addEventListener('click', (e) => {
        const timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
        const percent = Math.max(0, Math.min(1,
          (e.clientX - timeline.getBoundingClientRect().left) / timelineWidth
        ));
        playhead.style.marginLeft = (percent * timelineWidth) + 'px';
        audioEl.currentTime = audioEl.duration * percent;
      });
    }

    audioEl.addEventListener('timeupdate', () => {
      const percent = Math.max(0, Math.min(1, audioEl.currentTime / audioEl.duration));

      const circle = document.querySelector('#audio-progress .animated-circle');
      if (circle) circle.style.strokeDashoffset = 126 * (1 - percent);

      if (playhead) playhead.style.marginLeft = (percent * 100) + '%';
    });
  }
}

customElements.define('poem-audio', PoemAudio);

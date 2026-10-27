// Safety net for all native video, including manually started detail players.
document.querySelectorAll<HTMLVideoElement>('video').forEach(video => {
  let visible = false;
  let resume = video.autoplay;
  const sync = () => {
    if (!visible || document.hidden) {
      resume ||= !video.paused;
      video.pause();
    } else if (resume && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resume = false;
      video.play().catch(() => {});
    }
  };
  video.addEventListener('play', () => { if (!visible || document.hidden) sync(); });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio > 0;
    sync();
  }).observe(video);
  document.addEventListener('visibilitychange', sync);
});

// CSS marquees otherwise keep compositing long after they leave the screen.
document.querySelectorAll<HTMLElement>('.marquee-track, .ticker-track').forEach(track => {
  let visible = false;
  const sync = () => { track.style.animationPlayState = visible && !document.hidden ? 'running' : 'paused'; };
  sync();
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(track.parentElement!);
  document.addEventListener('visibilitychange', sync);
});

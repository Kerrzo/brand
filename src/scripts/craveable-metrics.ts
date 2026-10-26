// Deliberately scoped to the Craveable story so this experiment is easy to revert.
const story = document.querySelector('.craveable-story');
if (story) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const specs = [
    { selector: '.craveable-scale__numbers p:first-child > span:first-child', value: 580, prefix: '~' },
    { selector: '.craveable-scale__numbers p:nth-child(2) > span:first-child', value: 1000000, steps: true },
    { selector: '.craveable-fraud__number', value: 2.6, decimals: 1, suffix: '%' },
    { selector: '.craveable-delivery-result__six', value: 6 },
    { selector: '.craveable-conversion__figure:nth-child(1)', value: 3, suffix: '%' },
    { selector: '.craveable-conversion__figure:nth-child(3)', value: 4.5, decimals: 1, suffix: '%' },
    { selector: '.craveable-conversion__figure:nth-child(5)', value: 50, prefix: '+', suffix: '%' },
  ];
  const finishes: (() => void)[] = [];
  specs.forEach((spec) => {
    const element = story.querySelector<HTMLElement>(spec.selector);
    if (!element) return;
    const final = element.textContent!;
    element.setAttribute('aria-label', final);
    // Keep the final width reserved while the visible number changes.
    const reserve = document.createElement('span');
    reserve.textContent = final;
    reserve.style.visibility = 'hidden';
    reserve.setAttribute('aria-hidden', 'true');
    const output = document.createElement('span');
    output.textContent = final;
    output.setAttribute('aria-hidden', 'true');
    output.style.cssText = 'position:absolute;inset:0;font:inherit;color:inherit';
    reserve.style.cssText += ';font:inherit;color:inherit';
    element.style.position = 'relative';
    element.style.display = 'inline-block';
    element.style.fontVariantNumeric = 'tabular-nums';
    element.replaceChildren(reserve, output);
    let raf = 0, elapsed = 0, last = 0;
    let visible = false, finished = false;
    const finish = () => { cancelAnimationFrame(raf); raf = 0; finished = true; output.textContent = final; };
    finishes.push(finish);
    const tick = (now: number) => {
      elapsed += now - last;
      last = now;
      const t = Math.min(1, elapsed / 2200);
      const eased = t * t * (3 - 2 * t);
      output.textContent = spec.steps
        ? (eased < .25 ? '0' : eased < .5 ? '250k' : eased < 1 ? '500k' : final)
        : (spec.prefix || '') + (spec.value * eased).toFixed(spec.decimals || 0) + (spec.suffix || '');
      if (t < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    const sync = () => {
      cancelAnimationFrame(raf); raf = 0;
      if (reduced.matches) finish();
      else if (visible && !document.hidden && !finished) {
        last = performance.now(); raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', sync);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .25;
      sync();
    }, { threshold: [0, .25] });
    observer.observe(element);
  });
  reduced.addEventListener('change', () => { if (reduced.matches) finishes.forEach(finish => finish()); });
}

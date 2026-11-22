// ============ Сайт-визитка: плавные анимации ============

document.addEventListener("DOMContentLoaded", () => {

  // --- 1. Появление элементов при скролле (IntersectionObserver) ---
  const reveals = document.querySelectorAll(".reveal");

  // Небольшая каскадная задержка для соседних элементов
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 90, 450)}ms`;
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  // --- 2. Шапка становится «стеклянной» при прокрутке ---
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- 3. Анимированные счётчики в блоке «Обо мне» ---
  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600; // мс
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic — плавное замедление в конце
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // --- 4. Лёгкий параллакс декоративных пятен за мышью ---
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) {
    const blobs = document.querySelectorAll(".blob");
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    (function parallaxLoop() {
      // Плавное следование с интерполяцией
      curX += (mouseX - curX) * 0.04;
      curY += (mouseY - curY) * 0.04;
      blobs.forEach((blob, i) => {
        const depth = (i + 1) * 12;
        blob.style.marginLeft = `${curX * depth}px`;
        blob.style.marginTop = `${curY * depth}px`;
      });
      requestAnimationFrame(parallaxLoop);
    })();
  }
});

// --- 5. Обработка формы (демо, без сервера) ---
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const success = document.getElementById("formSuccess");
  success.hidden = false;
  form.reset();
  setTimeout(() => (success.hidden = true), 4000);
}

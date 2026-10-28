gsap.registerPlugin(ScrollTrigger);
history.scrollRestoration = "manual";
window.scrollTo(0, 0);

const RESPONSIVE_RELOAD_KEY = "jw-responsive-reload";
let pageLenis;

// Reload immediately whenever the responsive viewport changes by at least 1px.
// Section text and action reveal sequence ------------------------------ //
function sectionAosSequence__init() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
    groups = [];
  const definitions = [
    [
      "#jw-rd",
      [
        [".rnd-section__intro h2 > span", 0, "up"],
        [".rnd-card", 180, "fade"],
      ],
    ],
    [
      "#jw-research-fields",
      [
        [".pipeline-section__intro h2 > span", 0, "up"],
        [".pipeline-metrics", 140, "up"],
        [".pipeline-all", 230, "fade"],
        [".pipeline-card", 180, "fade"],
      ],
    ],
    [
      "#jw-investment",
      [
        [".investment-section__intro h2", 0, "up"],
        [".investment-grid", 160, "fade"],
      ],
    ],
    [
      "#jw-products",
      [
        [".products-nav", 0, "right"],
        [".products-panel__header", 100, "up"],
        [".products-card", 180, "fade"],
        [".products-scrollbar", 260, "fade"],
      ],
    ],
    [
      "#jw-newsroom",
      [
        [".newsroom-eyebrow", 0, "up"],
        [".newsroom-intro h2 > span", 80, "up"],
        [".newsroom-all", 220, "fade"],
        [".news-card", 180, "fade"],
      ],
    ],
    [
      "#jw-contact",
      [
        [".contact-card", 0, "fade"],
        [".contact-copy > *", 100, "up"],
        [".contact-center > *", 160, "up"],
      ],
    ],
    [
      "#jw-footer",
      [
        [".site-footer__top", 0, "up"],
        [".site-footer__middle", 100, "up"],
        [".site-footer__bottom", 180, "up"],
      ],
    ],
  ];
  function animate(group, targets, show) {
    const generation = group.generation;
    group.section.dataset.revealState = show ? "entering" : "leaving";
    Promise.all(
      targets.map((element) => {
        const old = element.__jwRevealAnimation,
          style = getComputedStyle(element);
        const opacity = Number(style.opacity),
          translated = style.translate === "none" ? "0 0" : style.translate;
        old?.cancel();
        element.__jwRevealAnimation = null;
        if (reduced.matches) {
          element.classList.add("is-revealed");
          return Promise.resolve();
        }
        const direction =
          element.matches(".products-nav") &&
          group.section.classList.contains("is-stacked")
            ? "fade"
            : element.dataset.jwReveal;
        const offset =
          direction === "right"
            ? "-64px 0"
            : direction === "up"
              ? "0 34px"
              : "0 0";
        const fromTranslate = old
          ? translated
          : show && opacity < 0.01
            ? offset
            : "0 0";
        const animation = element.animate(
          [
            { opacity, translate: fromTranslate },
            {
              opacity: show ? 1 : 0,
              translate: !show && direction === "right" ? "-64px 0" : "0 0",
            },
          ],
          {
            duration: show ? 800 : 450,
            delay: show ? Number(element.dataset.revealDelay) : 0,
            easing: "cubic-bezier(.22,1,.36,1)",
            fill: "both",
          },
        );
        element.__jwRevealAnimation = animation;
        return animation.finished
          .then(() => {
            if (element.__jwRevealAnimation !== animation) return;
            element.classList.toggle("is-revealed", show);
            animation.cancel();
            element.__jwRevealAnimation = null;
          })
          .catch(() => {});
      }),
    ).then(() => {
      if (generation === group.generation)
        group.section.dataset.revealState = show ? "visible" : "idle";
    });
  }
  function register(group) {
    const added = [];
    group.rules.forEach(([selector, delay, direction]) =>
      group.section.querySelectorAll(selector).forEach((element, index) => {
        if (element.hasAttribute("data-jw-reveal")) return;
        element.dataset.jwReveal =
          element.matches(".products-nav") &&
          group.section.classList.contains("is-stacked")
            ? "fade"
            : direction;
        element.dataset.revealDelay = String(
          delay + Math.min(index, 8) * (direction === "up" ? 90 : 55),
        );
        group.targets.add(element);
        added.push(element);
        if (reduced.matches) element.classList.add("is-revealed");
      }),
    );
    for (const element of group.targets)
      if (!element.isConnected) group.targets.delete(element);
    if (group.active && added.length) animate(group, added, true);
  }
  function observe(group) {
    group.observer?.disconnect();
    const height = group.section.getBoundingClientRect().height;
    const threshold =
      (0.4 * Math.min(height, innerHeight)) / Math.max(1, height);
    group.observer = new IntersectionObserver(
      ([entry]) => {
        const coverage =
          entry.intersectionRect.height /
          Math.max(
            1,
            Math.min(
              entry.boundingClientRect.height,
              entry.rootBounds?.height || innerHeight,
            ),
          );
        group.section.dataset.revealCoverage = coverage.toFixed(4);
        const entered = coverage >= 0.4 - 0.0001;
        if (entered === group.active) return;
        group.active = entered;
        group.generation++;
        animate(group, [...group.targets], entered);
      },
      { threshold: [0, threshold] },
    );
    group.observer.observe(group.section);
  }
  definitions.forEach(([selector, rules]) => {
    const section = document.querySelector(selector);
    if (!section) return;
    const group = {
      section,
      rules,
      targets: new Set(),
      active: false,
      generation: 0,
    };
    section.style.setProperty(
      "--jw-section-width",
      `${innerWidth < 375 ? 375 : document.documentElement.clientWidth}px`,
    );
    groups.push(group);
    register(group);
    observe(group);
    new ResizeObserver(() => observe(group)).observe(section);
    if (selector === "#jw-products")
      new MutationObserver(() => register(group)).observe(
        section.querySelector(".swiper-wrapper"),
        { childList: true },
      );
  });
  addEventListener(
    "resize",
    () =>
      groups.forEach((group) => {
        group.section.style.setProperty(
          "--jw-section-width",
          `${innerWidth < 375 ? 375 : document.documentElement.clientWidth}px`,
        );
        observe(group);
      }),
    { passive: true },
  );
  reduced.addEventListener("change", () =>
    groups.forEach((group) => {
      group.generation++;
      group.targets.forEach((element) => {
        element.__jwRevealAnimation?.cancel();
        element.__jwRevealAnimation = null;
        element.classList.toggle(
          "is-revealed",
          reduced.matches || group.active,
        );
      });
    }),
  );
  AOS.init({ easing: "ease-out-cubic", once: true });
}

// The video surface controls the light/dark glass as it crosses the fixed header.
function headerSurface__init(header) {
  header.classList.add("header-surface");
  const logo = header.querySelector(".hd-logo-mark");
  logo.classList.add("header-tone-logo");
  const labels = [
    ...header.querySelectorAll(
      ".menu-box > ul > li > a, .translate-box-1 > a > span",
    ),
  ];
  labels.forEach((label) => label.classList.add("header-tone-label"));
  const icons = [
    ...header.querySelectorAll(
      ".header-icon-button > img, .translate-box-1 > a > img",
    ),
  ];
  icons.forEach((icon) => {
    icon.parentElement.classList.add("header-tone-icon");
    icon.parentElement.style.setProperty(
      "--header-icon-mask",
      `url(${JSON.stringify(icon.getAttribute("src"))})`,
    );
  });
  let videoTop = Infinity;
  let videoBottom = -Infinity;
  function measure() {
    const headerRect = header.getBoundingClientRect();
    [logo, ...labels].forEach((ink) =>
      ink.style.setProperty(
        "--header-tone-y",
        `${ink.getBoundingClientRect().top - headerRect.top}px`,
      ),
    );
    icons.forEach((icon) => {
      const rect = icon.getBoundingClientRect(),
        parent = icon.parentElement,
        parentRect = parent.getBoundingClientRect();
      parent.style.setProperty(
        "--header-tone-y",
        `${rect.top - headerRect.top}px`,
      );
      parent.style.setProperty(
        "--header-icon-x",
        `${rect.left - parentRect.left}px`,
      );
      parent.style.setProperty(
        "--header-icon-y",
        `${rect.top - parentRect.top}px`,
      );
      parent.style.setProperty("--header-icon-width", `${rect.width}px`);
      parent.style.setProperty("--header-icon-height", `${rect.height}px`);
    });
  }
  function paint() {
    const height = header.offsetHeight;
    const headerTop = header.getBoundingClientRect().top;
    let surfaceTop = videoTop,
      surfaceBottom = videoBottom,
      overContact = false;
    const contact = document.querySelector("#jw-contact"),
      contactStage = contact?.querySelector(".contact-stage");
    if (contactStage) {
      const rect = contactStage.getBoundingClientRect(),
        p = Number(contact.dataset.expandProgress || 0);
      const inset = rect.height * 0.29 * (1 - p);
      const top = rect.top + inset,
        bottom = Math.min(
          rect.bottom - inset,
          document.querySelector("#jw-footer").getBoundingClientRect().top,
        );
      if (bottom > headerTop && top < headerTop + height) {
        surfaceTop = top;
        surfaceBottom = bottom;
        overContact = true;
      }
    }
    header.classList.toggle("over-contact", overContact);
    const videoStart = Math.max(0, Math.min(height, surfaceTop - headerTop));
    const videoEnd = Math.max(
      videoStart,
      Math.min(height, surfaceBottom - headerTop),
    );
    const start = videoStart,
      end = videoEnd;
    header.dataset.transparentRatio = (
      height ? Math.max(0, end - start) / height : 0
    ).toFixed(6);
    header.style.setProperty("--header-dark-start", `${start}px`);
    header.style.setProperty("--header-dark-end", `${end}px`);
    header.style.setProperty(
      "--header-dark-clip",
      `inset(${start}px 0 ${height - end}px 0)`,
    );
    header.style.setProperty(
      "--header-light-clip",
      `polygon(0 0,100% 0,100% ${start}px,0 ${start}px,0 ${end}px,100% ${end}px,100% 100%,0 100%)`,
    );
    header.classList.toggle("over-hero", videoEnd - videoStart > 0.5);
    header.classList.toggle("on-sec-dark", end - start > 0.5);
    header.classList.toggle("on-sec-w", end - start <= 0.5);
    header.classList.toggle(
      "header-overlap",
      end - start > 0.5 && end - start < height - 0.5,
    );
  }
  function update(top, bottom) {
    videoTop = top;
    videoBottom = bottom;
    paint();
  }
  header.addEventListener("jw:menu-toggle", paint);
  header.addEventListener("jw:contact-surface", paint);
  return { measure, update };
}

// Black logo -> a full-height wave sweeps right to left -> the settled headline.
function loadingPage__init() {
  const loader = document.querySelector(".loading-page");
  const journey = document.querySelector(".intro-journey");
  const stage = journey.querySelector(".intro-stage");
  const hero = journey.querySelector(".intro-hero");
  const heading = journey.querySelector(".intro-heading");
  const contrastLayer = document.createElement("div");
  contrastLayer.className = "intro-heading-contrast";
  contrastLayer.setAttribute("aria-hidden", "true");
  const whiteHeading = heading.cloneNode(true);
  whiteHeading.classList.add("intro-heading--white");
  whiteHeading.querySelector(".hero-video-progress")?.remove();
  const duplicateTitle = whiteHeading.querySelector("h1");
  const whiteType = document.createElement("div");
  whiteType.className = "intro-heading__type";
  whiteType.innerHTML = duplicateTitle.innerHTML;
  duplicateTitle.replaceWith(whiteType);
  contrastLayer.appendChild(whiteHeading);
  stage.appendChild(contrastLayer);
  const secondRows = [heading, whiteHeading].map((item) =>
    item.querySelector(".intro-heading__line--second"),
  );
  const firstRows = [heading, whiteHeading].map((item) =>
    item.querySelector(".intro-heading__line"),
  );
  const progressTrack = heading.querySelector(".hero-video-progress");
  const header = document.querySelector("header");
  const headerSurface = headerSurface__init(header);
  const body = document.body;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const responsiveReload =
    sessionStorage.getItem(RESPONSIVE_RELOAD_KEY) === "true";
  sessionStorage.removeItem(RESPONSIVE_RELOAD_KEY);
  document.documentElement.classList.remove("is-responsive-reload");
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  const heroStartRatio = 0.8904;
  const heroInsetRatio = 0.187;
  const finalHeadingScale = 0.6;
  const clamp = (value) => Math.min(1, Math.max(0, value));
  let ready = false;
  let frame = 0;
  let geometry;
  let lastScrollY = 0;
  let lastProgress = -1;
  let passedResearch = false;
  const researchSection = document.querySelector("#jw-rd");

  const preventScroll = (event) => event.preventDefault();
  const preventKeys = (event) => {
    if (
      [
        " ",
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
      ].includes(event.key)
    )
      event.preventDefault();
  };
  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });
  document.addEventListener("keydown", preventKeys);
  pageLenis?.stop();
  body.dataset.heroCopyReady = "true";
  gsap.set(header, { autoAlpha: 0 });
  header.style.transition = "none";

  function measure() {
    const height = stage.clientHeight;
    const width = stage.clientWidth;
    // Measure unscaled typography once; scroll updates only use these dimensions.
    gsap.set([heading, whiteHeading], { x: 0, y: 0, scale: 1 });
    gsap.set(secondRows, { x: 0, y: 0 });
    gsap.set(firstRows, { x: 0, y: 0 });
    let headingRect = heading.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const secondRow = heading.querySelector(".intro-heading__line--second");
    const secondStyle = getComputedStyle(secondRow);
    const contentWidth =
      [...secondRow.children].reduce(
        (sum, child) => sum + child.getBoundingClientRect().width,
        0,
      ) + (parseFloat(secondStyle.columnGap) || 0);
    heading.style.setProperty("--hero-progress-width", `${contentWidth}px`);
    const firstRow = heading.querySelector("h1 .intro-heading__line");
    const firstStyle = getComputedStyle(firstRow);
    const firstWidth =
      [...firstRow.children].reduce(
        (sum, child) => sum + child.getBoundingClientRect().width,
        0,
      ) + (parseFloat(firstStyle.columnGap) || 0);
    const headingInkTop =
      Math.min(
        ...[...firstRow.children].map(
          (child) => child.getBoundingClientRect().top,
        ),
      ) - headingRect.top;
    const headingInkBottom =
      Math.max(
        ...[...secondRow.children].map(
          (child) => child.getBoundingClientRect().bottom,
        ),
      ) - headingRect.top;
    const balancedTop =
      (header.offsetHeight +
        height * heroStartRatio -
        (headingInkBottom - headingInkTop)) /
        2 -
      headingInkTop;
    gsap.set([heading, whiteHeading], { top: balancedTop, autoRound: false });
    headingRect = heading.getBoundingClientRect();
    const headingHeight = heading.offsetHeight;
    const rowGap =
      parseFloat(getComputedStyle(heading.querySelector("h1")).rowGap) || 0;
    const progressGap = progressTrack
      ? Math.max(
          0,
          parseFloat(getComputedStyle(progressTrack).top) - headingHeight,
        )
      : 0;
    const headingX = headingRect.left - stageRect.left;
    const headingY = headingRect.top - stageRect.top;
    headerSurface.measure();
    geometry = {
      width,
      height,
      scrollStart: stageRect.top + window.scrollY,
      distance: Math.max(1, journey.offsetHeight - 2 * height),
      heroStartY: height * heroStartRatio,
      headingX,
      headingY,
      headingHeight,
      rowGap,
      progressGap,
      headingInkTop,
      headingInkBottom,
      firstIndent: Math.max(0, firstRow.clientWidth - firstWidth),
      secondIndent: Math.max(0, secondRow.clientWidth - contentWidth),
      finalHeadingY:
        height -
        Math.max(32, height * 0.12) -
        headingHeight * finalHeadingScale,
      radius: Math.min(42, Math.max(22, width * 0.021)),
    };
    // The journey may have scrolled past its sticky stage when fonts or resize fire.
    geometry.scrollStart = journey.getBoundingClientRect().top + window.scrollY;
    lastProgress = -1;
    update();
  }

  function update() {
    frame = 0;
    if (!geometry) return;
    const scrollY = window.scrollY;
    const progress = clamp(
      (scrollY - geometry.scrollStart) / geometry.distance,
    );
    if (progress === lastProgress && scrollY === lastScrollY) return;
    const heroTop = geometry.heroStartY * (1 - progress);
    const heroInset = geometry.width * heroInsetRatio * (1 - progress);
    const radius = geometry.radius * (1 - progress);
    gsap.set(hero, {
      autoRound: false,
      top: heroTop,
      left: heroInset,
      width: geometry.width - 2 * heroInset,
      borderRadius: radius,
      "--hero-film-alpha": progress,
    });
    // The journey reserves one extra viewport so sticky stays fixed during the cover.
    const cover = clamp(
      (scrollY - geometry.scrollStart - geometry.distance) / geometry.height,
    );
    gsap.set(stage, {
      filter: cover > 0 ? `blur(${(cover * 32 * 0.33).toFixed(3)}px)` : "none",
    });
    body.dataset.heroCover = cover.toFixed(4);
    const travel = progress * progress * (3 - 2 * progress);
    const scale = 1 - (1 - finalHeadingScale) * travel;
    gsap.set([heading, whiteHeading], {
      x: (geometry.width * 0.065 - geometry.headingX) * travel,
      y: (geometry.finalHeadingY - geometry.headingY) * travel,
      scale,
      transformOrigin: "0 0",
    });
    gsap.set(firstRows, {
      y: -(2 * geometry.progressGap - geometry.rowGap * 0.33) * travel,
    });
    gsap.set(secondRows, {
      x: geometry.secondIndent * (1 - travel),
      y: -2 * geometry.progressGap * travel,
    });
    // A second, accessible-hidden text layer is clipped to the exact video frame.
    // This changes only the overlapping ink to white, including rounded corners.
    contrastLayer.style.clipPath = `inset(${heroTop}px ${heroInset}px 0 ${heroInset}px round ${radius}px)`;
    body.dataset.heroProgress = progress.toFixed(4);
    body.dataset.openingStage = progress > 0 ? "hero" : "headline";
    body.classList.toggle("intro-scrolled", progress > 0);
    const wasComplete = body.classList.contains("intro-complete");
    body.classList.toggle("intro-complete", progress >= 1);
    const stageTop = stage.getBoundingClientRect().top;
    const openingEnd = geometry.scrollStart + geometry.distance;
    if (ready) {
      header.classList.add("intro-tracking");
      header.classList.remove("peek");
      header.style.transform = "translate3d(0,0,0)";
    }
    headerSurface.update(
      stageTop + heroTop,
      Math.min(
        stageTop + heroTop + geometry.height,
        geometry.height * (1 - cover),
      ),
    );
    lastScrollY = scrollY;
    lastProgress = progress;
    if (!wasComplete && progress >= 1)
      window.dispatchEvent(new Event("jw:hero-expanded"));
  }
  function requestUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  function finish() {
    loader.hidden = true;
    loader.setAttribute("aria-hidden", "true");
    body.classList.remove("intro-loading");
    body.classList.add("intro-ready");
    gsap.set(header, { autoAlpha: 1, y: 0 });
    gsap.set(stage, { backgroundColor: "#fff" });
    gsap.set([heading, whiteHeading], { autoAlpha: 1 });
    heading.style.setProperty("--intro-ink", "#0b0c10");
    heading.style.setProperty("--intro-tomorrow-ink", "var(--primary-color)");
    gsap.set([scanInk, colorInk, scanBackground], { opacity: 0 });
    header.style.removeProperty("transition");
    window.scrollTo(0, 0);
    pageLenis?.scrollTo(0, { immediate: true, force: true });
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
    document.removeEventListener("keydown", preventKeys);
    AOS.refreshHard();
    ScrollTrigger.refresh();
    ready = true;
    body.dataset.introState = "ready";
    pageLenis?.start();
    measure();
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", measure);
  measure();

  const loaderLogo = loader.querySelector(".loader-logo");
  const scanInk = document.createElement("div");
  scanInk.className = "intro-heading__type intro-scan-ink";
  scanInk.setAttribute("aria-hidden", "true");
  scanInk.innerHTML = heading.querySelector("h1").innerHTML;
  heading.appendChild(scanInk);
  firstRows.push(scanInk.querySelector(".intro-heading__line"));
  secondRows.push(scanInk.querySelector(".intro-heading__line--second"));
  const colorInk = document.createElement("div");
  colorInk.className = "intro-heading__type intro-color-ink";
  colorInk.setAttribute("aria-hidden", "true");
  colorInk.innerHTML = heading.querySelector("h1").innerHTML;
  heading.insertBefore(colorInk, scanInk);
  firstRows.push(colorInk.querySelector(".intro-heading__line"));
  secondRows.push(colorInk.querySelector(".intro-heading__line--second"));
  const scanBackground = document.createElement("div");
  scanBackground.className = "intro-scan-background";
  stage.prepend(scanBackground);
  const scan = { progress: 0 };
  function renderScan() {
    const x = -20 + scan.progress * 150;
    scanInk.style.clipPath = `polygon(${x}% 0,${x + 8}% 0,${x - 12}% 100%,${x - 20}% 100%)`;
    const reveal = `polygon(0 0,${x}% 0,${x - 20}% 100%,0 100%)`;
    colorInk.style.clipPath = reveal;
    scanBackground.style.clipPath = reveal;
  }
  renderScan();
  const phase = (value) => {
    body.dataset.introState = value;
  };
  const logoSpeed = 1.5,
    logoStart = 0.2 / logoSpeed,
    logoRevealDuration = 1.4 / logoSpeed;
  const logoEnd = logoStart + logoRevealDuration,
    logoFadeDuration = 0.55,
    englishFadeDuration = 0.75;
  const logoOut = logoEnd + 0.35,
    englishAt = logoOut + logoFadeDuration;
  const handoffAt = englishAt + englishFadeDuration - 0.15;
  const timeline = gsap.timeline({
    paused: true,
    id: "jw-intro-loader",
    onComplete: finish,
  });
  gsap.set(loaderLogo, { autoAlpha: 0, "--logo-reveal": "0%" });
  gsap.set([heading, whiteHeading], { autoAlpha: 0 });
  gsap.set(header, { autoAlpha: 0, y: -header.offsetHeight });
  timeline
    .call(() => phase("logo"), [], 0)
    .set(stage, { backgroundColor: "#000" }, 0)
    .set(loaderLogo, { visibility: "visible" }, logoStart)
    .to(
      loaderLogo,
      {
        opacity: 1,
        "--logo-reveal": "115%",
        duration: logoRevealDuration,
        ease: "power1.inOut",
      },
      logoStart,
    )
    .set(loader, { backgroundColor: "transparent" }, logoOut)
    .to(
      loaderLogo,
      { autoAlpha: 0, duration: logoFadeDuration, ease: "none" },
      logoOut,
    )
    .call(
      () => {
        phase("english");
        const centerOffset =
          geometry.height * 0.5 +
          Math.min(24, geometry.height * 0.035) -
          (geometry.headingInkTop + geometry.headingInkBottom) / 2 -
          geometry.headingY;
        gsap.set(heading, {
          autoAlpha: 0,
          y: centerOffset,
          "--intro-ink": "#fff",
          "--intro-tomorrow-ink": "#fff",
        });
        const drift = Math.min(14, geometry.width * 0.012);
        gsap.set(firstRows, { x: geometry.firstIndent * 0.5 - drift, y: 0 });
        gsap.set(secondRows, { x: geometry.secondIndent * 0.5 + drift, y: 0 });
      },
      [],
      englishAt,
    )
    .set(loader, { autoAlpha: 0 }, englishAt)
    .to(
      heading,
      { autoAlpha: 1, duration: englishFadeDuration, ease: "power1.inOut" },
      englishAt,
    )
    .to(
      firstRows,
      {
        x: () => geometry.firstIndent * 0.5,
        duration: englishFadeDuration,
        ease: "power1.out",
      },
      englishAt,
    )
    .to(
      secondRows,
      {
        x: () => geometry.secondIndent * 0.5,
        duration: englishFadeDuration,
        ease: "power1.out",
      },
      englishAt,
    )
    .set(scanInk, { opacity: 1 }, handoffAt + 0.15)
    .to(
      scan,
      {
        progress: 1,
        duration: 0.9,
        ease: "power1.inOut",
        onUpdate: renderScan,
      },
      handoffAt + 0.15,
    )
    .call(() => phase("scan"), [], handoffAt + 0.15)
    .to(
      heading,
      { y: 0, duration: 0.95, ease: "power3.inOut" },
      handoffAt + 0.4,
    )
    .to(
      firstRows,
      { x: 0, duration: 0.95, ease: "power3.inOut" },
      handoffAt + 0.4,
    )
    .to(
      secondRows,
      { x: () => geometry.secondIndent, duration: 0.95, ease: "power3.inOut" },
      handoffAt + 0.4,
    )
    .to(scanInk, { opacity: 0, duration: 0.18 }, handoffAt + 1.05)
    .call(() => phase("hero"), [], handoffAt + 1.15)
    .to(
      hero,
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      handoffAt + 1.15,
    )
    .call(
      () => {
        phase("header");
        body.classList.remove("intro-loading");
        body.classList.add("intro-ready");
      },
      [],
      handoffAt + 1.25,
    )
    .to(
      header,
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
      handoffAt + 1.25,
    );

  timeline.timeScale(0.5);

  // Resolve both typefaces behind the black screen so the revealed type never shifts.
  Promise.allSettled([
    document.fonts.load('900 32px "JW Display"'),
    document.fonts.load('400 32px "JW Display"'),
    document.fonts.load('400 32px "JW Editorial"'),
    loader
      .querySelector(".loader-logo img")
      .decode()
      .catch(() => {}),
  ])
    .then(() => document.fonts.ready)
    .then(() => {
      measure();
      if (responsiveReload || reducedMotion) {
        gsap.set(hero, { opacity: 1, y: 0 });
        finish();
      } else timeline.play(0);
    });
}

// Full-width dropdown background, directly under the header. -------------- //
function menuboxDropdown__init() {
  const header = document.querySelector("header");
  const menu = header.querySelector(".menu-box");
  const background = header.querySelector(".header-menu-background");
  const panel = menu.querySelector(".menu-item-container");
  const reduced = matchMedia("(prefers-reduced-motion:reduce)");
  const desktop = matchMedia("(min-width:1280px)");
  const motion = { progress: 0 },
    surface = { progress: 0 };
  let requested = false,
    height = 0,
    sequence,
    stagedSession = false;
  const transparent = () => Number(header.dataset.transparentRatio || 0) > 0;
  const primaryItems = [...menu.querySelectorAll(":scope > ul > li")];
  const columns = [...panel.children].filter((element) =>
    element.matches("ul"),
  );
  function highlight(index) {
    primaryItems.forEach((item, i) =>
      item.classList.toggle("is-menu-active", i === index),
    );
    columns.forEach((column, i) =>
      column.classList.toggle("is-menu-active", i === index),
    );
  }
  [primaryItems, columns].forEach((items) =>
    items.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {
        if (desktop.matches) highlight(index);
      });
      item.addEventListener("focusin", () => {
        if (desktop.matches) highlight(index);
      });
    }),
  );

  function measure() {
    height = Math.max(
      panel.scrollHeight,
      parseFloat(getComputedStyle(document.documentElement).fontSize) * 42,
    );
  }
  function paint() {
    const visible = height * motion.progress;
    background.style.height = `${visible}px`;
    panel.style.clipPath = `inset(0 0 ${Math.max(0, panel.offsetHeight - visible)}px 0)`;
    header.dataset.menuProgress = motion.progress.toFixed(5);
    header.dataset.menuSurface = surface.progress.toFixed(5);
    header.style.setProperty("--header-menu-alpha", surface.progress);
    header.dispatchEvent(new Event("jw:menu-toggle"));
  }
  function finishClosed() {
    background.style.display = "none";
    header.classList.remove("menu-open");
    highlight(-1);
    panel
      .querySelectorAll("ul")
      .forEach((list) => list.classList.remove("fade"));
    panel.inert = true;
    header.dataset.menuState = "closed";
    stagedSession = false;
    paint();
  }
  function show(open, immediate = false) {
    if (open && !desktop.matches) return;
    if (requested === open && !immediate) return;
    requested = open;
    sequence?.kill();
    stagedSession = stagedSession || transparent();
    header.dataset.menuPattern = stagedSession ? "staged" : "standard";
    const noMotion = immediate || reduced.matches;
    const panelDuration = noMotion
      ? 0
      : 0.32 * Math.abs((open ? 1 : 0) - motion.progress);
    const surfaceDuration =
      noMotion || !stagedSession
        ? 0
        : 0.15 * (open ? 1 - surface.progress : surface.progress);
    sequence = gsap.timeline({
      onUpdate: paint,
      onComplete() {
        if (requested) header.dataset.menuState = "open";
        else finishClosed();
      },
    });
    if (open) {
      header.classList.add("menu-open");
      header.classList.remove("peek");
      panel.inert = false;
      panel
        .querySelectorAll("ul")
        .forEach((list) => list.classList.add("fade"));
      measure();
      background.style.display = "block";
      header.dataset.menuState = surfaceDuration
        ? "surface-opening"
        : "opening";
      if (!surfaceDuration) surface.progress = 1;
      paint();
      // Both stages occupy adjoining positions on one timeline: no dwell or callback-created gap.
      sequence.to(
        surface,
        { progress: 1, duration: surfaceDuration, ease: "none" },
        0,
      );
      sequence.to(
        motion,
        {
          progress: 1,
          duration: panelDuration,
          ease: stagedSession ? "power2.out" : "power2.inOut",
          onStart() {
            header.dataset.menuState = "opening";
          },
        },
        surfaceDuration,
      );
    } else {
      header.dataset.menuState = motion.progress
        ? "closing"
        : "surface-closing";
      sequence.to(
        motion,
        {
          progress: 0,
          duration: panelDuration,
          ease: stagedSession ? "power2.in" : "power2.inOut",
        },
        0,
      );
      sequence.to(
        surface,
        {
          progress: 0,
          duration: surfaceDuration,
          ease: "none",
          onStart() {
            panel.inert = true;
            header.dataset.menuState = "surface-closing";
          },
        },
        panelDuration,
      );
    }
  }
  menu.addEventListener("mouseenter", () => show(true));
  menu.addEventListener("mouseleave", () => {
    highlight(-1);
    show(false);
  });
  menu.addEventListener("focusin", () => show(true));
  menu.addEventListener("focusout", (event) => {
    if (!menu.contains(event.relatedTarget)) show(false);
  });
  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") show(false);
  });
  desktop.addEventListener("change", (event) => {
    if (!event.matches) show(false, true);
  });
  addEventListener(
    "resize",
    () => {
      if (requested && desktop.matches) {
        measure();
        paint();
      }
    },
    { passive: true },
  );
  panel.inert = true;
  header.dataset.menuState = "closed";
  header.dataset.menuSurface = "0";
  header.style.setProperty("--header-menu-alpha", 0);
}

// translateboxDropdown ------------------------------ //
function translateboxDropdown__init() {
  $(
    "header > .hd-container > .side-box > .language-box > .translate-box-1",
  ).click(function () {
    $(this).parent().find("> .translate-box-2").toggleClass("drop");
    $(this).find("> a > img").toggleClass("rotate");
  });

  $(
    "header > .hd-container > .side-box > .language-box > .translate-box-2 > a > .languages-wrapper > span",
  ).mouseenter(function () {
    $(this).addClass("hover");
  });

  $(
    "header > .hd-container > .side-box > .language-box > .translate-box-2 > a > .languages-wrapper > span",
  ).mouseleave(function () {
    $(this).removeClass("hover");
  });

  $(
    "header > .hd-container > .side-box > .language-box > .translate-box-2",
  ).click(function () {
    $(this).removeClass("drop");
    $(this).parent().find("> .translate-box-1 > a > img").toggleClass("rotate");
  });

  $(document).click(function (e) {
    const $dropdown = $(
      "header > .hd-container > .side-box > .language-box > .translate-box-2",
    );
    const $button = $(
      "header > .hd-container > .side-box > .language-box > .translate-box-1",
    );

    if (
      !$button.is(e.target) &&
      $button.has(e.target).length === 0 &&
      !$dropdown.is(e.target) &&
      $dropdown.has(e.target).length === 0
    ) {
      $dropdown.removeClass("drop");
      $button.find("> a > img").removeClass("rotate");
    }
  });
}
// tabAsideContainer ------------------------------ //
function navigationDrawer__init() {
  const drawer = document.querySelector("#jw-drawer"),
    backdrop = document.querySelector(".drawer-backdrop"),
    opener = document.querySelector("header .tab-box button");
  if (!drawer || !opener) return;
  const header = document.querySelector("header"),
    main = document.querySelector("main"),
    footer = document.querySelector("footer"),
    close = drawer.querySelector(".drawer-close");
  const reduced = matchMedia("(prefers-reduced-motion:reduce)");
  let opened = false,
    closing = false,
    cleanupTimer = 0,
    wasStopped = true;
  function expand(button, show) {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    const from = panel.hidden ? 0 : panel.getBoundingClientRect().height;
    panel.getAnimations().forEach((animation) => animation.cancel());
    button.setAttribute("aria-expanded", String(show));
    panel.hidden = false;
    if (reduced.matches) {
      panel.hidden = !show;
      return;
    }
    const animation = panel.animate(
      [
        { height: `${from}px`, opacity: show ? 0 : 1 },
        {
          height: show ? `${panel.scrollHeight}px` : "0px",
          opacity: show ? 1 : 0,
        },
      ],
      { duration: 300, easing: "cubic-bezier(.22,1,.36,1)" },
    );
    animation.onfinish = () => {
      panel.hidden = !show;
    };
  }
  function finishClose() {
    if (!closing) return;
    closing = false;
    clearTimeout(cleanupTimer);
    drawer.hidden = true;
    drawer.inert = true;
    backdrop.hidden = true;
    document.body.classList.remove("nav-open", "nav-closing");
    main.inert = false;
    footer.inert = false;
    header.inert = false;
    if (!wasStopped) pageLenis?.start();
    drawer.querySelectorAll(".drawer-toggle").forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      document.getElementById(button.getAttribute("aria-controls")).hidden =
        true;
    });
    opener.focus({ preventScroll: true });
  }
  function hide() {
    if (!opened) return;
    opened = false;
    closing = true;
    opener.setAttribute("aria-expanded", "false");
    drawer.classList.add("close");
    document.body.classList.add("nav-closing");
    cleanupTimer = setTimeout(finishClose, reduced.matches ? 0 : 500);
  }
  function show() {
    if (
      opened ||
      closing ||
      getComputedStyle(header.querySelector(".menu-box")).display !== "none"
    )
      return;
    opened = true;
    wasStopped = pageLenis?.isStopped ?? true;
    pageLenis?.stop();
    drawer.hidden = false;
    drawer.inert = false;
    backdrop.hidden = false;
    main.inert = true;
    footer.inert = true;
    header.inert = true;
    header.classList.remove("menu-open");
    header.dispatchEvent(new Event("jw:menu-toggle"));
    opener.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
    requestAnimationFrame(() => {
      drawer.classList.remove("close");
      close.focus({ preventScroll: true });
    });
  }
  opener.setAttribute("aria-controls", "jw-drawer");
  opener.setAttribute("aria-expanded", "false");
  opener.setAttribute("aria-haspopup", "dialog");
  opener.addEventListener("click", show);
  close.addEventListener("click", hide);
  backdrop.addEventListener("click", hide);
  function desktopState() {
    const desktop =
      getComputedStyle(header.querySelector(".menu-box")).display !== "none";
    opener.setAttribute("aria-disabled", String(desktop));
    if (desktop && (opened || closing)) {
      hide();
      finishClose();
    }
  }
  addEventListener("resize", desktopState, { passive: true });
  desktopState();
  drawer.addEventListener("transitionend", (event) => {
    if (event.target === drawer && event.propertyName === "transform")
      finishClose();
  });
  drawer.querySelectorAll(".drawer-toggle").forEach((button) =>
    button.addEventListener("click", () => {
      const show = button.getAttribute("aria-expanded") !== "true";
      drawer
        .querySelectorAll('.drawer-toggle[aria-expanded="true"]')
        .forEach((other) => {
          if (other !== button) expand(other, false);
        });
      expand(button, show);
    }),
  );
  document.addEventListener("keydown", (event) => {
    if (!opened && !closing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      hide();
      return;
    }
    if (event.key !== "Tab") return;
    const items = [...drawer.querySelectorAll('button,[tabindex="0"]')].filter(
      (item) => !item.closest("[hidden]") && !item.disabled,
    );
    const first = items[0],
      last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

// Play each complete clip once, then cut straight to the next clip. -------- //
function swiperCustom__init() {
  const slider = document.querySelector(".mySwiper");
  if (!slider) return;
  const videos = [...slider.querySelectorAll("video")];
  if (!videos.length) return;
  const fill = document.querySelector(".hero-video-progress__fill");
  const swiper = new Swiper(slider, {
    loop: false,
    rewind: true,
    speed: 0,
    allowTouchMove: false,
    simulateTouch: false,
    autoplay: false,
  });
  let activeIndex = 0;
  let started = false;
  let progressFrame = 0;
  function normalizeDuration(video) {
    if (Number.isFinite(video.duration) && video.duration > 0)
      video.playbackRate = video.duration / 4;
  }
  function paintProgress() {
    if (!fill) return;
    const video = videos[activeIndex];
    const duration =
      Number.isFinite(video.duration) && video.duration > 0
        ? video.duration
        : 4;
    const progress = Math.min(1, Math.max(0, video.currentTime / duration));
    fill.style.transform = `scaleX(${progress})`;
  }
  function trackProgress() {
    cancelAnimationFrame(progressFrame);
    function tick() {
      paintProgress();
      if (started && !videos[activeIndex].paused && !document.hidden)
        progressFrame = requestAnimationFrame(tick);
    }
    tick();
  }
  videos.forEach((video, index) => {
    video.muted = true;
    video.loop = false;
    video.pause();
    normalizeDuration(video);
    video.addEventListener("loadedmetadata", () => normalizeDuration(video));
    video.addEventListener("playing", () => {
      if (index === activeIndex) trackProgress();
    });
    video.addEventListener("timeupdate", () => {
      if (index === activeIndex) paintProgress();
    });
    video.addEventListener("ended", () => {
      if (started && index === activeIndex)
        playClip((index + 1) % videos.length);
    });
  });
  function playClip(index) {
    cancelAnimationFrame(progressFrame);
    videos[activeIndex].pause();
    activeIndex = index;
    const video = videos[index];
    video.currentTime = 0;
    normalizeDuration(video);
    swiper.slideTo(index, 0, false);
    paintProgress();
    video.play().catch(() => {});
  }
  function startWhenVisible() {
    if (
      started ||
      !["hero", "header", "ready"].includes(document.body.dataset.introState)
    )
      return;
    started = true;
    observer.disconnect();
    playClip(0);
  }
  const observer = new MutationObserver(startWhenVisible);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-intro-state"],
  });
  startWhenVisible();
  document.addEventListener("visibilitychange", () => {
    if (!started) return;
    if (document.hidden) {
      cancelAnimationFrame(progressFrame);
      videos[activeIndex].pause();
    } else videos[activeIndex].play().catch(() => {});
  });
}

// bottomSelectboxDropUp ------------------------------ //
function bottomSelectboxDropUp__init() {
  $("footer > .btn-wrap > .btn").click(function () {
    $(this).find("> ul").toggleClass("bottomDropUp");
    $(this).find("> .title > a").toggleClass("rotateReverse");
  });
}
// Unified Sec-2 -> Sec-3 transition and following panel sequence ------------ //
function scrollTrigger__init() {
  // Later content is ordinary document flow; no slogan pin or flip sequence.
  ScrollTrigger.refresh();
}

// smooth scroll and parallax ------------------------------ //
function scrollLeins__init() {
  const lenis = (pageLenis = new Lenis({
    lerp: 0.055,
    easing: (t) => t,
    smooth: true,
    smoothTouch: false,
  }));

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  gsap.registerPlugin(ScrollTrigger);
  lenis.on("scroll", ScrollTrigger.update);

  gsap.utils.toArray("[data-speed]").forEach((el) => {
    gsap.to(el, {
      y: () => -((el.dataset.speed * window.innerHeight) / 5),
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        scrub: true,
      },
    });
  });
}

// Lenis before the hero; one gesture per screen after its one-time hold. ---- //
function postHeroScroll__init() {
  const journey = document.querySelector(".intro-journey");
  const stage = journey?.querySelector(".intro-stage");
  if (!journey || !stage || !pageLenis) return;

  // CELLIXX reference: 1000ms, CSS `ease`, 15% touch travel, 200ms wheel reset.
  const duration = 1;
  const quietTime = 200;
  const body = document.body;
  let mode = "intro";
  let heroEnd = 0;
  let stops = [];
  const ending = document.querySelector("#jw-contact");
  const family = document.querySelector(".site-family");
  let endingStart = Infinity;
  let endingLastY = 0;
  let pinUsed = false;
  let holdUntil = 0;
  let holdTimer = 0;
  let moving = false;
  let motion;
  let lastWheelAt = -Infinity;
  let lastInputAt = -Infinity;
  let gestureUsed = false;
  let wheelSamples = [];
  let touchStart;
  let touchUsed = false;
  let returningToIntro = false;

  // Cubic-bezier(.25, .1, .25, 1): the browser's standard CSS `ease` curve.
  function referenceEase(progress) {
    let low = 0;
    let high = 1;
    let t = progress;
    for (let index = 0; index < 14; index++) {
      t = (low + high) / 2;
      const x =
        0.75 * (1 - t) * (1 - t) * t + 0.75 * (1 - t) * t * t + t * t * t;
      if (x < progress) low = t;
      else high = t;
    }
    return 0.3 * (1 - t) * (1 - t) * t + 3 * (1 - t) * t * t + t * t * t;
  }

  function setMode(next) {
    mode = next;
    body.dataset.scrollMode = next;
  }

  function measureStops() {
    const pageY = window.scrollY;
    const viewport = stage.clientHeight;
    const maximum = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    heroEnd =
      journey.getBoundingClientRect().top +
      pageY +
      journey.offsetHeight -
      2 * viewport;
    const points = [heroEnd];
    endingStart = ending
      ? ending.getBoundingClientRect().top + pageY
      : Infinity;
    const sections = document.querySelectorAll(
      "main > .sec-responsive, main > .rnd-section, main > .sec-3, main > .investment-section, main > .product-placeholder, main > .newsroom-section, main > .sec-5, main > .sec-6, main > .sec-7, main > .banner, main > .sec-8, footer",
    );
    sections.forEach((section) => {
      if (
        !section.getClientRects().length ||
        getComputedStyle(section).display === "none"
      )
        return;
      const rect = section.getBoundingClientRect();
      const start = rect.top + pageY;
      points.push(start);
      // Preserve access to every part of sections that are taller than a screen.
      const last =
        start +
        Math.max(0, Math.max(rect.height, section.scrollHeight) - viewport);
      if (last - start > 2) {
        for (
          let position = start + viewport;
          position < last - 2;
          position += viewport
        )
          points.push(position);
        points.push(last);
      }
    });
    stops = points
      .map((value) => Math.max(heroEnd, Math.min(maximum, value)))
      .sort((a, b) => a - b)
      .filter(
        (value, index, array) => index === 0 || value - array[index - 1] > 2,
      );
  }

  function ready() {
    return body.dataset.introState === "ready";
  }

  function finishHold() {
    clearTimeout(holdTimer);
    const wait =
      Math.max(holdUntil, lastInputAt + quietTime) - performance.now();
    if (wait > 0) {
      holdTimer = setTimeout(finishHold, wait + 5);
      return;
    }
    if (body.dataset.heroCopyReady !== "true") {
      holdTimer = setTimeout(finishHold, 50);
      return;
    }
    setMode("snap");
  }

  function arriveAtHero() {
    if (mode !== "intro" || !ready()) return;
    const firstArrival = !pinUsed;
    pinUsed = true;
    body.dataset.heroPin = "used";
    gestureUsed = true;
    setMode(firstArrival ? "hero-hold" : "snap");
    pageLenis.stop();
    window.scrollTo(0, heroEnd);
    ScrollTrigger.update();
    if (firstArrival) {
      holdUntil = performance.now() + duration * 1000;
      finishHold();
    }
  }

  function enterEnding() {
    setMode("footer");
    endingLastY = window.scrollY;
    pageLenis.scrollTo(window.scrollY, { immediate: true, force: true });
    pageLenis.stop();
  }
  function watchArrival() {
    if (mode === "returning-top") return;
    const currentY = window.scrollY;
    if (mode === "footer") {
      const upward = currentY < endingLastY;
      endingLastY = currentY;
      if (upward && currentY < endingStart - 6) {
        if (family) family.open = false;
        pageLenis.stop();
        setMode("snap");
        measureStops();
        const previous = [...stops]
          .reverse()
          .find((value) => value < endingStart - 2);
        if (previous !== undefined) moveTo(previous);
      }
      return;
    }
    if (mode === "snap" && !moving && currentY >= endingStart - 2) {
      enterEnding();
      return;
    }
    if (returningToIntro) {
      if (window.scrollY < heroEnd - 2) returningToIntro = false;
      else return;
    }
    if (
      mode === "intro" &&
      ready() &&
      body.classList.contains("intro-complete") &&
      window.scrollY >= heroEnd - 0.5
    )
      arriveAtHero();
  }

  function resumeIntro(distance = 160) {
    clearTimeout(holdTimer);
    motion?.kill();
    moving = false;
    body.dataset.snapMoving = "false";
    returningToIntro = true;
    setMode("intro");
    pageLenis.start();
    pageLenis.scrollTo(Math.max(0, heroEnd - distance), { lerp: 0.055 });
  }

  function returnToTop() {
    motion?.kill();
    clearTimeout(holdTimer);
    returningToIntro = true;
    moving = true;
    gestureUsed = true;
    body.dataset.snapMoving = "true";
    setMode("returning-top");
    pageLenis.stop();
    const position = { y: window.scrollY };
    motion = gsap.to(position, {
      y: 0,
      duration: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 1.05,
      ease: referenceEase,
      onUpdate() {
        window.scrollTo(0, position.y);
        ScrollTrigger.update();
      },
      onComplete() {
        window.scrollTo(0, 0);
        pageLenis.scrollTo(0, { immediate: true, force: true });
        pageLenis.start();
        moving = false;
        returningToIntro = false;
        gestureUsed = false;
        body.dataset.snapMoving = "false";
        setMode("intro");
        ScrollTrigger.update();
      },
    });
  }

  document.addEventListener("jw:return-top", () => {
    if (ready()) returnToTop();
  });

  function moveTo(target) {
    if (moving) return;
    const limit = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    target = Math.max(0, Math.min(limit, target));
    if (Math.abs(target - window.scrollY) < 1) return;
    moving = true;
    gestureUsed = true;
    body.dataset.snapMoving = "true";
    body.dataset.snapTarget = String(target);
    const position = { y: window.scrollY };
    motion = gsap.to(position, {
      y: target,
      duration,
      ease: referenceEase,
      onUpdate() {
        window.scrollTo(0, position.y);
        ScrollTrigger.update();
      },
      onComplete() {
        window.scrollTo(0, target);
        moving = false;
        body.dataset.snapMoving = "false";
        ScrollTrigger.update();
        if (target >= endingStart - 2) enterEnding();
      },
    });
  }

  function step(direction, inputDistance = 160) {
    if (moving || mode === "hero-hold") return;
    measureStops();
    const current = window.scrollY;
    if (direction > 0 && current >= endingStart - 2) {
      moveTo(
        Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
      );
      return;
    }
    if (direction < 0 && current > endingStart + 2) {
      moveTo(endingStart);
      return;
    }
    if (direction < 0 && current <= heroEnd + 2) {
      resumeIntro(inputDistance);
      return;
    }
    const target =
      direction > 0
        ? stops.find((value) => value > current + 2)
        : [...stops].reverse().find((value) => value < current - 2);
    if (
      target !== undefined &&
      direction < 0 &&
      Math.abs(current - endingStart) <= 2
    ) {
      moving = true;
      body.dataset.snapMoving = "true";
      setMode("contact-shrink");
      ending.dispatchEvent(
        new CustomEvent("jw:contact-leave", {
          detail: {
            resume() {
              moving = false;
              body.dataset.snapMoving = "false";
              setMode("snap");
              moveTo(target);
            },
          },
        }),
      );
      return;
    }
    if (target !== undefined) moveTo(target);
  }

  function excluded(target) {
    return (
      body.classList.contains("nav-open") ||
      (target instanceof Element &&
        target.closest(
          "header, .tab-aside:not(.close), input, textarea, select, [contenteditable='true'], [data-native-scroll], .site-family summary",
        ))
    );
  }

  window.addEventListener(
    "wheel",
    (event) => {
      if (
        !ready() ||
        event.ctrlKey ||
        excluded(event.target) ||
        Math.abs(event.deltaX) >= Math.abs(event.deltaY)
      )
        return;
      const now = performance.now();
      const gap = now - lastWheelAt;
      lastWheelAt = lastInputAt = now;
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1);
      if (mode === "intro") return;
      event.preventDefault();
      if (gap > quietTime) {
        wheelSamples = [];
        if (!moving && mode !== "hero-hold") gestureUsed = false;
      }
      wheelSamples.push(Math.abs(delta));
      if (wheelSamples.length > 150) wheelSamples.shift();
      if (mode === "hero-hold") {
        finishHold();
        return;
      }
      if (moving || gestureUsed || delta === 0) return;
      const mean = (count) => {
        const values = wheelSamples.slice(-count);
        return values.reduce((sum, value) => sum + value, 0) / values.length;
      };
      if (mean(10) >= mean(70)) {
        gestureUsed = true;
        step(Math.sign(delta), Math.max(120, Math.abs(delta)));
      }
    },
    { passive: false, capture: true },
  );

  window.addEventListener(
    "keydown",
    (event) => {
      if (
        !ready() ||
        mode === "intro" ||
        excluded(event.target) ||
        (event.target instanceof Element &&
          event.target.closest(
            ".products-tabs, .ir-tabs, .top-btn, button, [role=button]",
          )) ||
        event.altKey ||
        event.metaKey ||
        event.ctrlKey
      )
        return;
      if (event.key === "Home") {
        event.preventDefault();
        returnToTop();
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        measureStops();
        if (!moving && mode !== "hero-hold") moveTo(stops.at(-1));
        return;
      }
      const direction = ["ArrowDown", "PageDown", " "].includes(event.key)
        ? 1
        : ["ArrowUp", "PageUp"].includes(event.key)
          ? -1
          : 0;
      if (!direction) return;
      event.preventDefault();
      lastInputAt = performance.now();
      step(event.key === " " && event.shiftKey ? -1 : direction);
    },
    true,
  );

  window.addEventListener(
    "touchstart",
    (event) => {
      if (excluded(event.target) || event.touches.length !== 1) return;
      touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      touchUsed = false;
    },
    { passive: true, capture: true },
  );
  window.addEventListener(
    "touchmove",
    (event) => {
      if (
        !ready() ||
        mode === "intro" ||
        !touchStart ||
        excluded(event.target) ||
        event.touches.length !== 1
      )
        return;
      const deltaY = touchStart.y - event.touches[0].clientY;
      const deltaX = touchStart.x - event.touches[0].clientX;
      if (
        event.target instanceof Element &&
        event.target.closest(
          ".products-carousel, .products-tabs, .investment-grid, .newsroom-grid",
        ) &&
        Math.abs(deltaX) > Math.abs(deltaY)
      )
        return;
      event.preventDefault();
      lastInputAt = performance.now();
      if (moving || touchUsed || mode === "hero-hold") return;
      if (
        Math.abs(deltaY) > window.innerHeight * 0.15 &&
        Math.abs(deltaY) > Math.abs(deltaX)
      ) {
        touchUsed = true;
        step(Math.sign(deltaY), Math.abs(deltaY));
      }
    },
    { passive: false, capture: true },
  );
  window.addEventListener(
    "touchend",
    () => {
      touchStart = null;
    },
    { passive: true },
  );

  // TOP and the header logo use the single jw:return-top route.

  ScrollTrigger.addEventListener("refresh", measureStops);
  pageLenis.on("scroll", watchArrival);
  window.addEventListener("scroll", watchArrival, { passive: true });
  window.addEventListener("jw:hero-expanded", watchArrival);
  window.addEventListener("load", measureStops);
  measureStops();
  setMode("intro");
}

// marqueeSlide ------------------------------ //
function marqueeSlide__init() {
  let tl;

  function initMarquee() {
    const box = document.querySelector(".marquee-box");
    const wrapper = document.querySelector(".marquee-wrapper");

    if (!box || !wrapper) return;

    if (tl) tl.kill();

    const items = [...box.children];
    items.forEach((item) => {
      if (item.dataset.clone === "true") item.remove();
    });

    const originalItems = [...box.children];

    let totalWidth = 0;
    originalItems.forEach((item) => {
      totalWidth += item.offsetWidth;
    });
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.dataset.clone = "true";
      box.appendChild(clone);
    });

    tl = gsap.fromTo(
      box,
      { x: 0 },
      {
        x: -totalWidth,
        duration: 32,
        ease: "none",
        repeat: -1,
      },
    );

    wrapper.onmouseenter = () => tl.pause();
    wrapper.onmouseleave = () => tl.play();
  }

  window.addEventListener("load", initMarquee);

  window.addEventListener("resize", () => {
    clearTimeout(window.__marqueeTimer);
    window.__marqueeTimer = setTimeout(initMarquee, 200);
  });
}
// searchBoxOptions ------------------------------ //
function searchBoxOptions__init() {
  (function () {
    const input = document.getElementById("search");
    if (!input) return;
    const defaultText = "검색어를 입력해주세요.";

    if (!input.placeholder) input.value = defaultText;

    input.addEventListener("focus", () => {
      if (input.value === defaultText) input.value = "";
    });

    input.addEventListener("blur", () => {
      if (input.value.trim() === "" && !input.placeholder)
        input.value = defaultText;
    });

    document.getElementById("btnSearch").addEventListener("click", () => {
      const q = input.value.trim();
      if (!q) {
        alert("검색어를 입력해주세요.");
        input.focus();
        return;
      }

      console.log("검색 실행:", q);
      alert(`검색어: ${q}`);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") document.getElementById("btnSearch").click();
    });
  })();
}

// Product search filters ------------------------------ //
function productFilters__init() {
  document.querySelectorAll(".filter-options").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      group.querySelectorAll("button").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
    });
  });
}

// A visit starts on card one. Selection then belongs to this page instance.
function researchCards__init() {
  const section = document.querySelector("#jw-rd");
  const group = section?.querySelector(".rnd-cards");
  if (!group) return;
  const cards = [...group.querySelectorAll(".rnd-card")];
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const compact = window.matchMedia("(max-width: 900px)");
  const probe = document.createElement("div");
  probe.className = "rnd-layout-probe";
  probe.setAttribute("aria-hidden", "true");
  cards.forEach((card) => {
    const summary = card.querySelector(".rnd-card__summary").cloneNode(true);
    summary.removeAttribute("id");
    probe.append(summary);
  });
  group.append(probe);
  let activeCard = null,
    measureFrame = 0;
  const setSize = (name, size) => {
    const value = `${Math.ceil(size)}px`;
    if (group.style.getPropertyValue(name) !== value)
      group.style.setProperty(name, value);
  };
  function measure() {
    const wrap = [...probe.querySelectorAll(".rnd-card__summary")].some(
      (summary) =>
        summary.firstElementChild.offsetHeight >
        parseFloat(getComputedStyle(summary).lineHeight) * 2.15,
    );
    section.classList.toggle("is-rnd-stacked", compact.matches || wrap);
    const active = cards.find((card) => card.classList.contains("is-active"));
    if (!active) return;
    const pad =
      parseFloat(
        getComputedStyle(active.querySelector(".rnd-card__content")).left,
      ) || 18;
    const bottom =
      parseFloat(
        getComputedStyle(group).getPropertyValue("--rnd-list-bottom"),
      ) || 52;
    const header = Math.max(
      ...cards.map(
        (card) => card.querySelector(".rnd-card__heading").offsetHeight,
      ),
    );
    const topicHeights = cards.map(
      (card) =>
        card.querySelector(".rnd-card__topics").getBoundingClientRect().height,
    );
    cards.forEach((card, index) => {
      const value = `${topicHeights[index]}px`;
      if (card.style.getPropertyValue("--rnd-card-list-height") !== value)
        card.style.setProperty("--rnd-card-list-height", value);
    });
    const topics = Math.max(...topicHeights);
    const summary = Math.max(
      ...cards.map(
        (card) => card.querySelector(".rnd-card__summary > span").offsetHeight,
      ),
    );
    setSize("--rnd-list-height", topics);
    setSize("--rnd-summary-height", summary);
    setSize("--rnd-expanded-min-height", pad + header + 24 + topics + bottom);
    setSize(
      "--rnd-idle-min-height",
      Math.max(190, pad + header + 24 + summary + bottom),
    );
  }
  function scheduleMeasure() {
    cancelAnimationFrame(measureFrame);
    measureFrame = requestAnimationFrame(measure);
  }
  const activate = (card) => {
    if (!card || !cards.includes(card) || card === activeCard) return;
    activeCard = card;
    cards.forEach((item) => {
      const selected = item === activeCard;
      item.classList.toggle("is-active", selected);
      item.setAttribute(
        "aria-describedby",
        item.querySelector(
          selected ? ".rnd-card__topics" : ".rnd-card__summary",
        ).id,
      );
    });
    scheduleMeasure();
  };
  activate(cards[0]);
  const resize = new ResizeObserver(scheduleMeasure);
  resize.observe(group);
  [...probe.children].forEach((summary) =>
    resize.observe(summary.firstElementChild),
  );
  cards.forEach((card) => {
    resize.observe(card.querySelector(".rnd-card__topics"));
    resize.observe(card.querySelector(".rnd-card__heading"));
    resize.observe(card.querySelector(".rnd-card__summary > span"));
  });
  compact.addEventListener("change", scheduleMeasure);
  document.fonts.ready.then(scheduleMeasure);
  group.addEventListener("pointermove", (event) => {
    if (!canHover.matches || event.pointerType === "touch") return;
    const card =
      event.target instanceof Element
        ? event.target.closest(".rnd-card")
        : null;
    if (card) activate(card);
  });
  cards.forEach((card) => {
    card.addEventListener("focus", () => activate(card));
    card.addEventListener("click", (event) => {
      if (
        section.classList.contains("is-rnd-stacked") &&
        !event.target.closest(".rnd-card__more")
      ) {
        event.preventDefault();
        activate(card);
      }
    });
  });
  group.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    const index = cards.findIndex((card) =>
      card.contains(document.activeElement),
    );
    if (index < 0) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    cards[(index + direction + cards.length) % cards.length].focus({
      preventScroll: true,
    });
  });
}

function investmentCarousel__init() {
  const grid = document.querySelector(".investment-grid");
  if (!grid) return;
  const section = grid.closest(".investment-section");
  const cards = [...grid.querySelectorAll(".ig-card")];
  const slots = [...grid.querySelectorAll(".ig-slot")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let order = [0, 1, 2],
    moving = false,
    visible = false,
    timer = 0,
    pointer = null,
    suppressClickUntil = 0,
    keyboardMode = false,
    activeTimeline = null,
    manualMotion = false,
    queuedPromotion = null;
  const motion = cards.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));
  let parallaxFrame = 0;
  function stopAuto() {
    clearTimeout(timer);
    timer = 0;
    grid.dataset.autoplay = "false";
  }
  function schedule() {
    stopAuto();
    const reason = !visible
      ? "outside"
      : document.hidden
        ? "hidden"
        : reduced.matches
          ? "reduced-motion"
          : pointer
            ? "dragging"
            : cards.some((card) => card.matches(":hover"))
              ? "hover"
              : keyboardMode && grid.contains(document.activeElement)
                ? "keyboard"
                : "";
    grid.dataset.pauseReason = reason;
    if (reason) return;
    grid.dataset.autoplay = "true";
    timer = setTimeout(() => rotate(1), 5000);
  }
  function bounds() {
    const origin = grid.getBoundingClientRect();
    return slots.map((slot) => {
      const r = slot.getBoundingClientRect();
      return {
        left: r.left - origin.left,
        top: r.top - origin.top,
        width: r.width,
        height: r.height,
      };
    });
  }
  function roles() {
    order.forEach((id, slot) => {
      const card = cards[id],
        main = slot === 0;
      card.classList.toggle("is-feature", main);
      if (!main) Object.assign(motion[id], { x: 0, y: 0, tx: 0, ty: 0 });
      card.dataset.slot = ["main", "top", "bottom"][slot];
      card.querySelector(".ig-full").inert = !main;
      card.querySelector(".ig-full").setAttribute("aria-hidden", String(!main));
      card
        .querySelector(".ig-preview")
        .setAttribute("aria-hidden", String(main));
      card.setAttribute("role", main ? "article" : "button");
      card.tabIndex = main ? -1 : 0;
      card.setAttribute(
        "aria-label",
        card.querySelector(".ig-subtitle").textContent.trim() +
          (main ? "" : " 크게 보기"),
      );
      const button = card.querySelector(".ig-promote");
      button.disabled = main || moving;
      button.tabIndex = -1;
      button.setAttribute("aria-hidden", "true");
    });
    grid.dataset.order = order
      .map((id) => cards[id].dataset.category)
      .join(",");
    grid.dataset.feature = cards[order[0]].dataset.category;
    requestPaint();
  }
  function layout() {
    section.style.setProperty(
      "--ig-viewport",
      `${innerWidth < 375 ? 375 : document.documentElement.clientWidth}px`,
    );
    const box = bounds();
    order.forEach((id, slot) =>
      gsap.set(cards[id], { ...box[slot], autoRound: false }),
    );
  }
  function rotate(steps = 1, fromUser = false, manual = false) {
    if (moving) {
      if (manual) {
        manualMotion = true;
        activeTimeline?.resume();
      }
      return;
    }
    manualMotion = manual;
    stopAuto();
    moving = true;
    grid.dataset.moving = "true";
    grid.setAttribute("aria-busy", "true");
    const previous = order[0];
    order =
      steps > 0
        ? [order[1], order[2], order[0]]
        : [order[2], order[0], order[1]];
    const box = bounds();
    cards.forEach((card, id) => {
      card.style.zIndex = id === order[0] ? "4" : id === previous ? "2" : "1";
      card.querySelector(".ig-promote").disabled = true;
    });
    const duration = reduced.matches ? 0 : 0.95;
    const timeline = (activeTimeline = gsap.timeline({
      onComplete() {
        moving = false;
        activeTimeline = null;
        manualMotion = false;
        grid.dataset.moving = "false";
        grid.setAttribute("aria-busy", "false");
        roles();
        const queued = queuedPromotion;
        queuedPromotion = null;
        if (queued && order[0] !== queued.id) {
          promote(queued.id, queued.keyboard);
          return;
        }
        if (fromUser || queued?.keyboard)
          cards[order[0]]
            .querySelector(".ig-more")
            .focus({ preventScroll: true });
        schedule();
      },
    }));
    timeline.to(
      cards.map((card) => card.querySelector(".ig-card__body")),
      { opacity: 0, duration: reduced.matches ? 0 : 0.14 },
      0,
    );
    timeline.call(roles, [], reduced.matches ? 0 : 0.15);
    order.forEach((id, slot) =>
      timeline.to(
        cards[id],
        { ...box[slot], autoRound: false, duration, ease: "power3.inOut" },
        0,
      ),
    );
    timeline.to(
      cards.map((card) => card.querySelector(".ig-card__body")),
      { opacity: 1, duration: reduced.matches ? 0 : 0.42 },
      reduced.matches ? 0 : 0.38,
    );
  }
  function promote(id, keyboard) {
    if (moving) {
      queuedPromotion = { id, keyboard };
      manualMotion = true;
      activeTimeline?.resume();
      return;
    }
    const slot = order.indexOf(id);
    if (slot > 0) rotate(slot === 1 ? 1 : -1, keyboard, true);
  }
  cards.forEach((card, id) => {
    card.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest(".ig-more"))
        return;
      promote(id, event.detail === 0);
    });
    card.addEventListener("keydown", (event) => {
      if (event.target !== card || !["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      keyboardMode = true;
      promote(id, true);
    });
  });
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Tab") {
        keyboardMode = true;
        if (grid.contains(document.activeElement)) stopAuto();
      }
    },
    true,
  );
  grid.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    keyboardMode = true;
    event.preventDefault();
    event.stopPropagation();
    rotate(event.key === "ArrowRight" ? 1 : -1, true, true);
  });
  grid.addEventListener("focusin", () =>
    keyboardMode ? stopAuto() : schedule(),
  );
  grid.addEventListener("focusout", () => requestAnimationFrame(schedule));
  grid.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    keyboardMode = false;
    stopAuto();
    pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      axis: null,
    };
  });
  grid.addEventListener("pointermove", (event) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x,
      dy = event.clientY - pointer.y;
    if (!pointer.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8)
      pointer.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (pointer.axis === "x") {
      manualMotion = true;
      activeTimeline?.resume();
      event.preventDefault();
      grid.classList.add("is-grabbing");
      if (!grid.hasPointerCapture(event.pointerId))
        grid.setPointerCapture(event.pointerId);
    }
  });
  function release(event, cancel = false) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x,
      swipe = !cancel && pointer.axis === "x" && Math.abs(dx) > 55;
    pointer = null;
    grid.classList.remove("is-grabbing");
    if (grid.hasPointerCapture(event.pointerId))
      grid.releasePointerCapture(event.pointerId);
    if (swipe) {
      suppressClickUntil = performance.now() + 400;
      rotate(dx < 0 ? 1 : -1, false, true);
    } else schedule();
  }
  window.addEventListener("pointerup", (event) => release(event));
  window.addEventListener("pointercancel", (event) => release(event, true));
  grid.addEventListener(
    "click",
    (event) => {
      if (performance.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true,
  );
  grid.addEventListener("dragstart", (event) => event.preventDefault());
  function paint() {
    parallaxFrame = 0;
    let active = false;
    motion.forEach((point, id) => {
      if (!cards[id].classList.contains("is-feature"))
        point.x = point.y = point.tx = point.ty = 0;
      point.x += (point.tx - point.x) * 0.12;
      point.y += (point.ty - point.y) * 0.12;
      cards[id].querySelector(".ig-card__image").style.transform =
        `translate3d(${point.x.toFixed(3)}px,${point.y.toFixed(3)}px,0) scale(1.075)`;
      if (Math.abs(point.tx - point.x) + Math.abs(point.ty - point.y) > 0.06)
        active = true;
    });
    if (active) parallaxFrame = requestAnimationFrame(paint);
  }
  function requestPaint() {
    if (!parallaxFrame) parallaxFrame = requestAnimationFrame(paint);
  }
  cards.forEach((card, id) => {
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse") return;
      stopAuto();
      grid.dataset.pauseReason = "hover";
      if (!manualMotion) activeTimeline?.pause();
    });
    card.addEventListener("pointermove", (event) => {
      if (
        !card.classList.contains("is-feature") ||
        reduced.matches ||
        event.pointerType !== "mouse" ||
        pointer ||
        moving
      )
        return;
      const r = card.getBoundingClientRect();
      motion[id].tx =
        ((event.clientX - r.left) / r.width - 0.5) *
        Math.min(28, r.width * 0.06);
      motion[id].ty =
        ((event.clientY - r.top) / r.height - 0.5) *
        Math.min(22, r.height * 0.06);
      requestPaint();
    });
    card.addEventListener("pointerleave", () => {
      motion[id].tx = motion[id].ty = 0;
      requestPaint();
      requestAnimationFrame(() => {
        if (!cards.some((item) => item.matches(":hover"))) {
          activeTimeline?.resume();
          if (!moving) schedule();
        }
      });
    });
  });
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].intersectionRatio >= 0.45;
      if (visible) layout();
      else {
        activeTimeline?.resume();
        motion.forEach((point) => {
          point.tx = point.ty = 0;
        });
        requestPaint();
      }
      schedule();
    },
    { threshold: [0, 0.45] },
  ).observe(section);
  new ResizeObserver(() => {
    if (!moving) layout();
  }).observe(grid);
  document.addEventListener("visibilitychange", schedule);
  reduced.addEventListener("change", () => {
    motion.forEach((point) => {
      point.tx = point.ty = 0;
    });
    requestPaint();
    schedule();
  });
  roles();
  layout();
  grid.dataset.moving = "false";
}

function pipelineCards__init() {
  const grid = document.querySelector(".pipeline-grid");
  if (!grid) return;
  const cards = [...grid.querySelectorAll(".pipeline-card")];
  let selected = cards[0];
  const activate = (card) => {
    if (!card || !cards.includes(card)) return;
    selected = card;
    cards.forEach((item) =>
      item.classList.toggle("is-active", item === selected),
    );
  };
  activate(selected);
  // Selection survives section exits. Only actual input changes it.
  grid.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const card =
      event.target instanceof Element
        ? event.target.closest(".pipeline-card")
        : null;
    if (card) activate(card);
  });
  cards.forEach((card) => card.addEventListener("focus", () => activate(card)));
}

function pipelineCta__init() {
  document.querySelectorAll(".pipeline-all").forEach((button) => {
    const arrow = button?.querySelector(".pipeline-all__arrow");
    const label = button?.querySelector(".pipeline-all__label");
    if (!arrow || !label) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const engaged = () => button.matches(":hover, :focus-visible");
    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      button.classList.remove("is-filled");
    }
    function crossing() {
      frame = 0;
      if (!engaged()) {
        reset();
        return;
      }
      const style = getComputedStyle(button);

      const inset = parseFloat(style.getPropertyValue("--cta-inset")) || 6;
      const travel = Math.max(
        1,
        button.clientWidth - arrow.offsetWidth - 2 * inset,
      );
      const progress = (arrow.offsetLeft - inset) / travel;
      if (reduced.matches || progress >= 0.33) {
        button.classList.add("is-filled");
        return;
      }
      frame = requestAnimationFrame(crossing);
    }
    function start() {
      if (!frame && !button.classList.contains("is-filled"))
        frame = requestAnimationFrame(crossing);
    }
    button.addEventListener("pointerenter", start);
    button.addEventListener("focus", start);
    button.addEventListener("keydown", start);
    arrow.addEventListener("transitionrun", (event) => {
      if (event.propertyName === "left" && engaged()) start();
    });
    button.addEventListener("pointerleave", () => {
      if (!engaged()) reset();
    });
    button.addEventListener("blur", () => {
      if (!engaged()) reset();
    });
  });
}

function pipelineCounters__init() {
  const metrics = document.querySelector(".pipeline-metrics");
  if (!metrics) return;
  const numbers = [...metrics.querySelectorAll("[data-count]")];
  const targets = numbers.map((number) => Number(number.dataset.count));
  const duration = matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : 1400;
  let frame = 0;
  let visible = false;
  function reset() {
    cancelAnimationFrame(frame);
    numbers.forEach((number) => {
      number.textContent = "0";
    });
    metrics.dataset.countState = "idle";
  }
  function start() {
    cancelAnimationFrame(frame);
    const started = performance.now();
    metrics.dataset.countState = "running";
    function tick(now) {
      const t = duration ? Math.min(1, (now - started) / duration) : 1;
      const eased = t;
      numbers.forEach((number, index) => {
        // The last integer is reserved for the same final frame for every count.
        number.textContent = String(
          t >= 1
            ? targets[index]
            : Math.min(targets[index] - 1, Math.floor(targets[index] * eased)),
        );
      });
      if (t < 1) frame = requestAnimationFrame(tick);
      else metrics.dataset.countState = "complete";
    }
    numbers.forEach((number) => {
      number.textContent = "0";
    });
    frame = requestAnimationFrame(tick);
  }
  reset();
  const observer = new IntersectionObserver(
    (entries) => {
      const entering = entries[0].isIntersecting;
      if (entering && !visible) start();
      if (!entering && visible) reset();
      visible = entering;
    },
    { threshold: 0 },
  );
  observer.observe(metrics);
}

// Functions Operate Key ------------------------------ //

sectionAosSequence__init();
menuboxDropdown__init();
translateboxDropdown__init();
navigationDrawer__init();

swiperCustom__init();
bottomSelectboxDropUp__init();
scrollTrigger__init();
scrollLeins__init();
loadingPage__init();
postHeroScroll__init();
marqueeSlide__init();
searchBoxOptions__init();
productFilters__init();
researchCards__init();
pipelineCards__init();
investmentCarousel__init();
pipelineCta__init();
pipelineCounters__init();
// Recalculating Global Triggers Load ----------------------------- //
window.addEventListener("load", () => {
  AOS.refreshHard();
  ScrollTrigger.refresh();
});

window.addEventListener("resize", () => {
  clearTimeout(window.__stTimer);
  window.__stTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);
});

// The reference uses a 12px dot with difference blending, not an alpha mask.
function brandCursor__init() {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const cursor = document.createElement("div");
  cursor.className = "brand-cursor";
  cursor.setAttribute("aria-hidden", "true");
  const dot = document.createElement("span");
  dot.className = "brand-cursor__dot";
  cursor.append(dot);
  document.body.append(cursor);
  document.documentElement.classList.add("has-brand-cursor");
  const tokens = getComputedStyle(document.documentElement);
  const complement = (value) => {
    const hex = value.trim().replace("#", "");
    return (
      "#" +
      [0, 2, 4]
        .map((i) =>
          (255 - parseInt(hex.slice(i, i + 2), 16))
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")
    );
  };
  dot.style.background = `linear-gradient(135deg,${complement(tokens.getPropertyValue("--primary-color"))},${complement(tokens.getPropertyValue("--secondary-color"))})`;
  const selector =
    'a[href],button,summary,[role="button"],input[type="submit"],input[type="button"],.products-card,.ig-card';
  let x = 0,
    y = 0,
    targetX = 0,
    targetY = 0,
    frame = 0,
    visible = false,
    dirty = true,
    candidates = [];
  function intersectsAction() {
    if (dirty) {
      candidates = [...document.querySelectorAll(selector)];
      dirty = false;
    }
    const direct = document.elementFromPoint(targetX, targetY);
    if (direct?.closest(selector)) return true;
    const radius = cursor.classList.contains("is-action") ? 15 : 6;
    for (const element of candidates) {
      const r = element.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const px = Math.max(r.left + 0.01, Math.min(targetX, r.right - 0.01)),
        py = Math.max(r.top + 0.01, Math.min(targetY, r.bottom - 0.01));
      if ((targetX - px) ** 2 + (targetY - py) ** 2 >= radius ** 2) continue;
      const hit = document.elementFromPoint(
        Math.max(0, Math.min(document.documentElement.clientWidth - 1, px)),
        Math.max(0, Math.min(innerHeight - 1, py)),
      );
      if (hit && (element === hit || element.contains(hit))) return true;
    }
    return false;
  }
  function paint() {
    frame = 0;
    if (!visible) return;
    x += (targetX - x) * 0.28;
    y += (targetY - y) * 0.28;
    cursor.style.transform = `translate3d(${x - 6}px,${y - 6}px,0)`;
    cursor.classList.toggle("is-action", intersectsAction());
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.05)
      frame = requestAnimationFrame(paint);
  }
  const request = () => {
    if (visible && !frame) frame = requestAnimationFrame(paint);
  };
  const hide = () => {
    visible = false;
    cursor.classList.remove("is-visible");
  };
  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        x = targetX;
        y = targetY;
        visible = true;
      }
      cursor.classList.add("is-visible");
      request();
    },
    { passive: true },
  );
  document.addEventListener("pointerover", request, { passive: true });
  document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) hide();
  });
  addEventListener("scroll", request, { passive: true });
  addEventListener(
    "resize",
    () => {
      dirty = true;
      request();
    },
    { passive: true },
  );
  new MutationObserver(() => {
    dirty = true;
    request();
  }).observe(document.querySelector("main"), {
    childList: true,
    subtree: true,
  });
  addEventListener("blur", hide);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hide();
  });
}

brandCursor__init();

function footerReveal__init() {
  const footer = document.querySelector("#jw-footer"),
    contact = document.querySelector("#jw-contact");
  const stage = contact?.querySelector(".contact-stage"),
    card = contact?.querySelector(".contact-card");
  if (!footer || !stage || !card) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
    motion = { expand: 0 };
  let frame = 0,
    expanded = false,
    footerHeight = 0,
    exiting = false,
    exitGeneration = 0;
  const clamp = (n) => Math.min(1, Math.max(0, n));
  function draw() {
    const p = motion.expand;
    const width = stage.clientWidth,
      height = stage.clientHeight;
    const insetX = width * (width <= 760 ? 0.08 : 0.1875) * (1 - p);
    const insetY = height * 0.29 * (1 - p);
    const radius = Math.min((height - 2 * insetY) / 2, 220) * (1 - p);
    card.style.clipPath = `inset(${insetY}px ${insetX}px round ${radius}px)`;
    card.style.setProperty(
      "--contact-content-opacity",
      String(clamp((p - 0.55) / 0.45)),
    );
    contact.dataset.expandProgress = p.toFixed(4);
    document
      .querySelector("header")
      .dispatchEvent(new Event("jw:contact-surface"));
  }
  function paint() {
    frame = 0;
    const rect = contact.getBoundingClientRect();
    if (exiting && rect.top > innerHeight * 0.2) exiting = false;
    const shouldExpand = !exiting && rect.top <= innerHeight * 0.2;
    if (shouldExpand !== expanded) {
      expanded = shouldExpand;
      gsap.to(motion, {
        expand: expanded ? 1 : 0,
        duration: reduced.matches ? 0 : 1,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: draw,
      });
    }
    const footerRect = footer.getBoundingClientRect(),
      cover = clamp((innerHeight - footerRect.top) / innerHeight);
    stage.style.filter = reduced.matches
      ? "none"
      : `blur(${(cover * 12).toFixed(2)}px)`;
    contact.dataset.footerCover = cover.toFixed(4);
    document.body.classList.toggle("ending-active", rect.top <= 2);
  }
  function measure() {
    const next = footer.offsetHeight;
    if (next !== footerHeight) {
      footerHeight = next;
      contact.style.setProperty("--contact-footer-height", `${next}px`);
      footer.style.marginTop = `-${next}px`;
    }
    draw();
    requestPaint();
  }
  function requestPaint() {
    if (!frame) frame = requestAnimationFrame(paint);
  }
  addEventListener("scroll", requestPaint, { passive: true });
  addEventListener("resize", measure, { passive: true });
  addEventListener("load", measure);
  new ResizeObserver(measure).observe(footer);
  new ResizeObserver(() => {
    draw();
    requestPaint();
  }).observe(stage);
  document
    .querySelector(".site-family")
    ?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") event.currentTarget.open = false;
    });
  document.addEventListener("pointerdown", (event) => {
    const family = document.querySelector(".site-family");
    if (family?.open && !family.contains(event.target)) family.open = false;
  });
  contact.addEventListener("jw:contact-leave", (event) => {
    const generation = ++exitGeneration;
    exiting = true;
    expanded = false;
    contact.dataset.exitState = "shrinking";
    let resumed = false;
    function resume() {
      if (resumed || generation !== exitGeneration) return;
      resumed = true;
      contact.dataset.exitState = "leaving";
      event.detail.resume();
    }
    gsap.to(motion, {
      expand: 0,
      duration: reduced.matches ? 0 : 1.15,
      ease: "power2.inOut",
      overwrite: true,
      onUpdate() {
        draw();
        if (motion.expand <= 0.2) resume();
      },
      onComplete() {
        draw();
        resume();
      },
    });
  });
  document.addEventListener("jw:return-top", () => {
    exitGeneration++;
    exiting = false;
    expanded = false;
    gsap.killTweensOf(motion);
    motion.expand = 0;
    draw();
  });
  measure();
  paint();
}
footerReveal__init();

const JW_PRODUCT_CATALOG = [
  {
    name: "전문의약품",
    english: "SPECIALTY PHARMACEUTICALS",
    count: 230,
    url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_search.jsp?schProductDiv1=140504174457611G2ZWB",
    products: [
      {
        name: "뉴글리아시럽",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=191108164523897RSWLK",
        image: "Image_file/main-images/sec-5/menu_1_imgs/image_1.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=250604092127023Z2NLL",
      },
      {
        name: "라베그론서방정50mg",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=220607153504969Z5NTL",
        image: "Image_file/main-images/sec-5/menu_1_imgs/image_2.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=250609142653318Y5R9Q",
      },
      {
        name: "제이다트정0.5밀리그램",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=190103103627348U3XKC",
        image: "Image_file/main-images/sec-5/menu_1_imgs/image_3.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=2507071501321650D4QF",
      },
      {
        name: "올멕포스에이치정 5/40/12.5mg",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=200604102632791AC0A6",
        image: "Image_file/main-images/sec-5/menu_1_imgs/image_4.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=250707102033183XY3E8",
      },
    ],
  },
  {
    name: "일반의약품",
    english: "OVER-THE-COUNTER MEDICINES",
    count: 50,
    url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_search.jsp?schProductDiv1=140521100638440XRDEY",
    products: [
      {
        name: "프렌즈아이드롭쿨하이",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=180710233005736I6EAT",
        image: "Image_file/main-images/sec-5/menu_2_imgs/image_1.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=221021160137311IGM81",
      },
      {
        name: "볼두민캡슐",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=140618170737417J5WKI",
        image: "Image_file/main-images/sec-5/menu_2_imgs/image_2.png",
        width: 750,
        height: 750,
        background: "#feffff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=180117225721027QPKP8",
      },
      {
        name: "마이드롭점안액",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=210914104835980VCY4A",
        image: "Image_file/main-images/sec-5/menu_2_imgs/image_3.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=210914104808680VQ9AG",
      },
      {
        name: "노펜피록시캄겔",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=1808311144094807JQ4C",
        image: "Image_file/main-images/sec-5/menu_2_imgs/image_4.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=231013141050977BQ6ML",
      },
    ],
  },
  {
    name: "의약외품",
    english: "QUASI-DRUGS",
    count: 21,
    url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_search.jsp?schProductDiv1=1405211028474077ELYG",
    products: [
      {
        name: "3M 필터 O2 코마스크",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=1907151520519576SRGR",
        image: "Image_file/main-images/sec-5/menu_3_imgs/image_1.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=19071515065842521VXD",
      },
      {
        name: "하이맘밴드 액티브케어",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=221017115614220M6AL3",
        image: "Image_file/main-images/sec-5/menu_3_imgs/image_2.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=221017115330914MAZJX",
      },
      {
        name: "쿨링덴트정",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=150326100615742IFMYW",
        image: "Image_file/main-images/sec-5/menu_3_imgs/image_3.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=210216090703304GASKF",
      },
      {
        name: "듀프렌즈셀라인솔루션",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=160405100608925356ER",
        image: "Image_file/main-images/sec-5/menu_3_imgs/image_4.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=2107131353591237KF71",
      },
    ],
  },
  {
    name: "건강기능식품",
    english: "HEALTH SUPPLEMENTS",
    count: 106,
    url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_search.jsp?schProductDiv1=140521102855893M72N1",
    products: [
      {
        name: "루피움 밸런스 뉴트리션 멀티팩",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=231221112549955HV2Z9",
        image: "Image_file/main-images/sec-5/menu_4_imgs/image_1.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=2312211123129630V7PJ",
      },
      {
        name: "관절엔 MSM 청춘솔루션",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=210226133751728B1FRL",
        image: "Image_file/main-images/sec-5/menu_4_imgs/image_2.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=221014110017934IYMIX",
      },
      {
        name: "옵티머스 비건 마그네슘F",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=231221115528930ANCQA",
        image: "Image_file/main-images/sec-5/menu_4_imgs/image_3.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=231221115305060N92AM",
      },
      {
        name: "프리미엄 올인원 이뮨 샷 마시는 액상 멀티 종합비타민 & 미네랄",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=2312221556553941P9KP",
        image: "Image_file/main-images/sec-5/menu_4_imgs/image_4.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=2312221554452105BE7I",
      },
    ],
  },
  {
    name: "의료기기",
    english: "MEDICAL DEVICES",
    count: 12,
    url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_search.jsp?schProductDiv1=1405211029051919JIDM",
    products: [
      {
        name: "리제스킨",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=161229155302289H7TV0",
        image: "Image_file/main-images/sec-5/menu_5_imgs/image_1.png",
        width: 750,
        height: 726,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=1612291605142892KRCP",
      },
      {
        name: "티슈필 (TissueFill)",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=160425161856207YZ4OE",
        image: "Image_file/main-images/sec-5/menu_5_imgs/image_2.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=180420152344179UFDYM",
      },
      {
        name: "체오미 플러스",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=200211155926847AHFXG",
        image: "Image_file/main-images/sec-5/menu_5_imgs/image_3.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=200211160021775PNMS4",
      },
      {
        name: "하이맘밴드리퀴드폼",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=190711173813915KPWMH",
        image: "Image_file/main-images/sec-5/menu_5_imgs/image_4.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=1907111737577534N8LH",
      },
    ],
  },
  {
    name: "수술관련기기",
    english: "SURGICAL EQUIPMENT",
    count: 43,
    url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_search.jsp?schProductDiv1=1606281121233081WE7S",
    products: [
      {
        name: "TS7000",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=180914175055020TKQCM",
        image: "Image_file/main-images/sec-5/menu_6_imgs/image_1.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=221228232716532NIQ0T",
      },
      {
        name: "Ultrafins Stirrups",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=221229092224537MYZIC",
        image: "Image_file/main-images/sec-5/menu_6_imgs/image_2.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=221229092145511GVE65",
      },
      {
        name: "VISIANO 10",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=221229104444934PKGVY",
        image: "Image_file/main-images/sec-5/menu_6_imgs/image_3.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=221229104410279TSDI8",
      },
      {
        name: "Basic Carpa Table",
        url: "https://www.jw-pharma.co.kr/pharma/ko/product/product_view.jsp?productCd=2212291025489504F5YT",
        image: "Image_file/main-images/sec-5/menu_6_imgs/image_4.png",
        width: 750,
        height: 750,
        background: "#fff",
        sourceImage:
          "https://www.jw-pharma.co.kr/cmm/FileDown.jsp?fileId=22122910252108585SSJ",
      },
    ],
  },
];
function productsSection__init() {
  const section = document.querySelector(".products-section");
  if (!section || typeof Swiper === "undefined") return;
  const catalog = JW_PRODUCT_CATALOG;
  const panel = section.querySelector(".products-panel");
  const carousel = section.querySelector(".products-carousel");
  const wrapper = carousel.querySelector(".swiper-wrapper");
  const rail = section.querySelector(".products-scrollbar");
  const tabs = [...section.querySelectorAll("[data-product-category]")];
  const escape = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  function markup(category) {
    return (
      category.products
        .map(
          (product, index) =>
            `<article class="swiper-slide products-card"><span class="products-card__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><div class="products-card__photo" style="--product-image-bg:${product.background}"><img src="${product.image}" alt="${escape(product.name)}" width="${product.width}" height="${product.height}" loading="lazy" draggable="false"></div><div class="products-card__body"><h4 title="${escape(product.name)}">${escape(product.name)}</h4></div></article>`,
        )
        .join("") +
      `<article class="swiper-slide products-card products-card--more"><a class="products-more" role="button" tabindex="0" rel="noopener noreferrer" aria-label="${category.name} 더 많은 제품 보기 (새 창)"><span class="products-more__plus" aria-hidden="true"></span><h4 class="products-more__title">더 많은 제품</h4><p class="products-more__description">다양한 ${category.name}을<br>확인해보세요.</p></a></article>`
    );
  }
  wrapper.innerHTML = markup(catalog[0]);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const swiper = new Swiper(carousel, {
    slidesPerView: "auto",
    spaceBetween: 36,
    speed: reduced.matches ? 0 : 600,
    grabCursor: true,
    watchOverflow: true,
    preventClicks: true,
    preventClicksPropagation: true,
    navigation: {
      prevEl: section.querySelector(".products-prev"),
      nextEl: section.querySelector(".products-next"),
    },
    scrollbar: {
      el: rail,
      draggable: true,
      hide: false,
      snapOnRelease: true,
      dragSize: Math.max(40, rail.clientWidth * 0.22),
    },
    a11y: {
      prevSlideMessage: "이전 제품",
      nextSlideMessage: "다음 제품",
      slideLabelMessage: "{{index}} / {{slidesLength}}",
    },
    on: {
      resize(instance) {
        instance.params.scrollbar.dragSize = Math.max(
          40,
          rail.clientWidth * 0.22,
        );
        instance.scrollbar.updateSize();
      },
    },
  });
  function select(index, focus = false) {
    const category = catalog[index];
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tabs[index].id);
    section.querySelector(".products-panel__eyebrow").textContent =
      category.english;
    section.querySelector("#products-category-title").textContent =
      category.name;
    section.querySelector(".products-total strong").textContent =
      category.count;
    section
      .querySelectorAll(".products-panel__eyebrow,#products-category-title")
      .forEach((heading, index) => {
        heading.getAnimations().forEach((animation) => animation.cancel());
        if (!reduced.matches)
          heading.animate(
            [
              { opacity: 0, translate: "0 22px" },
              { opacity: 1, translate: "0 0" },
            ],
            {
              duration: 650,
              delay: index * 60,
              easing: "cubic-bezier(.22,1,.36,1)",
              fill: "backwards",
            },
          );
      });
    wrapper.innerHTML = markup(category);
    swiper.update();
    swiper.slideTo(0, 0);
    swiper.navigation.update();
    swiper.scrollbar.updateSize();
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (["ArrowDown", "ArrowRight"].includes(event.key))
        next = (index + 1) % tabs.length;
      else if (["ArrowUp", "ArrowLeft"].includes(event.key))
        next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      event.stopPropagation();
      select(next, true);
    });
  });
  const nav = section.querySelector(".products-nav"),
    tablist = nav.querySelector(".products-tabs");
  let layoutFrame = 0;
  function orientation() {
    layoutFrame = 0;
    const width = section.clientWidth;
    // Switch before the longest label or sidebar title can wrap.
    const font = Math.max(17, Math.min(28, width * 0.0145));
    const tabPadding = Math.max(14, Math.min(36, width * 0.018)) * 2;
    const needed = Math.max(
      font * 6 + tabPadding + 32 + 48,
      Math.max(26, Math.min(47, width * 0.0245)) * 7 + 60,
    );
    const stacked = width <= 760 || width * 0.21875 < needed;
    section.classList.toggle("is-stacked", stacked);
    if (nav.hasAttribute("data-jw-reveal"))
      nav.dataset.jwReveal = stacked ? "fade" : "right";
    tablist.setAttribute(
      "aria-orientation",
      stacked ? "horizontal" : "vertical",
    );
    if (stacked) {
      const positions = [...tablist.children].map((item) => item.offsetTop);
      const rows = new Set(positions).size;
      section.dataset.categoryRows = String(rows);
      section.style.setProperty(
        "--products-tab-extra",
        `${Math.max(0, rows - 1) * 42}px`,
      );
    } else {
      section.dataset.categoryRows = "1";
      section.style.setProperty("--products-tab-extra", "0px");
    }
    swiper.update();
    swiper.scrollbar.updateSize();
  }
  function requestLayout() {
    if (!layoutFrame) layoutFrame = requestAnimationFrame(orientation);
  }
  addEventListener("resize", requestLayout, { passive: true });
  new ResizeObserver(requestLayout).observe(nav);
  document.fonts.ready.then(requestLayout);
  orientation();
}
productsSection__init();

function newsroomCarousel__init() {
  document
    .querySelectorAll(".news-card")
    .forEach((card) => card.classList.remove("swiper-slide"));
}
newsroomCarousel__init();

function productImageCenter__init(centers) {
  const wrapper = document.querySelector("#jw-products .swiper-wrapper");
  if (!wrapper) return;
  const observed = new WeakSet();
  const observer = new ResizeObserver((entries) =>
    entries.forEach(({ target: img }) => {
      const center = centers[img.getAttribute("src")];
      if (!center) return;
      const width = img.clientWidth,
        height = img.clientHeight,
        scale = Math.min(width / center.width, height / center.height);
      const x = (center.width / 2 - center.x) * scale,
        y = (center.height / 2 - center.y) * scale;
      img.style.translate = `${x}px ${y}px`;
      img.style.transformOrigin = `${width / 2 - x}px ${height / 2 - y}px`;
    }),
  );
  function images(node) {
    return node.nodeType === 1
      ? [
          ...(node.matches("img") ? [node] : []),
          ...node.querySelectorAll("img"),
        ]
      : [];
  }
  function attach(node) {
    images(node).forEach((img) => {
      if (!observed.has(img)) {
        observed.add(img);
        observer.observe(img);
      }
    });
  }
  attach(wrapper);
  new MutationObserver((records) =>
    records.forEach((record) => {
      record.removedNodes.forEach((node) =>
        images(node).forEach((img) => observer.unobserve(img)),
      );
      record.addedNodes.forEach(attach);
    }),
  ).observe(wrapper, { childList: true });
}

productImageCenter__init({
  "Image_file/main-images/sec-5/menu_1_imgs/image_1.png": {
    x: 393.5,
    y: 377.0,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_1_imgs/image_2.png": {
    x: 387.0,
    y: 376.0,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_1_imgs/image_3.png": {
    x: 390.0,
    y: 376.0,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_1_imgs/image_4.png": {
    x: 390.5,
    y: 376.5,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_2_imgs/image_1.png": {
    x: 377.0,
    y: 386.0,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_2_imgs/image_2.png": {
    x: 372.0,
    y: 391.5,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_2_imgs/image_3.png": {
    x: 377.0,
    y: 403.5,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_2_imgs/image_4.png": {
    x: 375.5,
    y: 380.0,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_3_imgs/image_1.png": {
    x: 356.5,
    y: 391.0,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_3_imgs/image_2.png": {
    x: 367.5,
    y: 372.5,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_3_imgs/image_3.png": {
    x: 378.0,
    y: 381.0,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_3_imgs/image_4.png": {
    x: 364.0,
    y: 404.5,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_4_imgs/image_1.png": {
    x: 391.0,
    y: 424.0,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_4_imgs/image_2.png": {
    x: 375.0,
    y: 378.0,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_4_imgs/image_3.png": {
    x: 377.5,
    y: 430.5,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_4_imgs/image_4.png": {
    x: 374.5,
    y: 386.0,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_5_imgs/image_1.png": {
    x: 392.5,
    y: 353.0,
    width: 750,
    height: 726,
  },
  "Image_file/main-images/sec-5/menu_5_imgs/image_2.png": {
    x: 371.0,
    y: 390.5,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_5_imgs/image_3.png": {
    x: 381.0,
    y: 386.5,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_5_imgs/image_4.png": {
    x: 370.0,
    y: 388.5,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_6_imgs/image_1.png": {
    x: 377.5,
    y: 375.5,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_6_imgs/image_2.png": {
    x: 377.0,
    y: 378.5,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_6_imgs/image_3.png": {
    x: 372.5,
    y: 396.0,
    width: 750,
    height: 750,
  },
  "Image_file/main-images/sec-5/menu_6_imgs/image_4.png": {
    x: 374.0,
    y: 363.5,
    width: 750,
    height: 750,
  },
});

// This presentation intentionally has no outbound or content navigation.
function prototypeInteractions__init() {
  const allowed =
    ".top-btn,header .hd-logo-box a,[data-product-category],header .tab-box button,.drawer-close,.drawer-toggle,.drawer-backdrop,.investment-grid .ig-card";
  function neutralize(root) {
    const links = [
      ...(root.matches?.("a") ? [root] : []),
      ...root.querySelectorAll("a"),
    ];
    links.forEach((link) => {
      link.removeAttribute("href");
      link.removeAttribute("target");
      link.removeAttribute("download");
      link.setAttribute("role", "button");
      link.setAttribute("tabindex", "0");
      const label = link.getAttribute("aria-label");
      if (label)
        link.setAttribute("aria-label", label.replace(/\s*\(새 창\)/g, ""));
    });
  }
  neutralize(document);
  new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "attributes") neutralize(record.target);
      else
        record.addedNodes.forEach((node) => {
          if (node.nodeType === 1) neutralize(node);
        });
    });
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["href", "target", "download"],
  });
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const top = target.closest(".top-btn,header .hd-logo-box a");
      if (top) {
        event.preventDefault();
        event.stopImmediatePropagation();
        document.dispatchEvent(new Event("jw:return-top"));
        return;
      }
      if (target.closest(allowed)) return;
      if (
        target.closest('a,button,summary,[role="button"],.rnd-card,.ig-card')
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );
  document.addEventListener(
    "auxclick",
    (event) => {
      if (
        event.target instanceof Element &&
        event.target.closest('a,button,[role="button"]')
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );
  document.addEventListener("submit", (event) => event.preventDefault(), true);
  document.addEventListener(
    "keydown",
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (
        !target ||
        !["Enter", " "].includes(event.key) ||
        !target.matches('a[role="button"]')
      )
        return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (target.closest("header .hd-logo-box"))
        document.dispatchEvent(new Event("jw:return-top"));
    },
    true,
  );
  const family = document.querySelector(".site-family");
  let familyCloseTimer = 0;
  const openFamily = () => {
    clearTimeout(familyCloseTimer);
    family.open = true;
  };
  const closeFamily = () => {
    clearTimeout(familyCloseTimer);
    familyCloseTimer = setTimeout(() => {
      if (!family.matches(":hover") && !family.contains(document.activeElement))
        family.open = false;
    }, 240);
  };
  family?.addEventListener("pointerenter", openFamily);
  family?.addEventListener("pointerleave", closeFamily);
  family?.querySelector("ul")?.addEventListener("pointerenter", openFamily);
  family?.addEventListener("focusin", openFamily);
  family?.addEventListener("focusout", () =>
    requestAnimationFrame(() => {
      if (!family.contains(document.activeElement) && !family.matches(":hover"))
        closeFamily();
    }),
  );
}
prototypeInteractions__init();

// Pixel-based SVG contours keep the concave corner and arrow aligned at every size.
function responsiveFolds__init() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("fold-definitions");
  const defs = document.createElementNS(ns, "defs");
  svg.append(defs);
  document.body.append(svg);
  document.querySelectorAll(".rnd-card,.news-card").forEach((card, index) => {
    const rnd = card.classList.contains("rnd-card");
    const surface = card.querySelector(
      rnd ? ".rnd-card__surface" : ".news-card__image",
    );
    const arrow = card.querySelector(
      rnd ? ".rnd-card__arrow" : ".news-card__arrow",
    );
    if (!surface || !arrow) return;
    const clip = document.createElementNS(ns, "clipPath"),
      path = document.createElementNS(ns, "path"),
      id = `jw-fold-${index}`;
    clip.id = id;
    clip.setAttribute("clipPathUnits", "userSpaceOnUse");
    clip.append(path);
    defs.append(clip);
    surface.classList.add("has-fold-contour");
    surface.style.clipPath = `url(#${id})`;
    const state = { fold: 0 };
    let active = false;
    function draw() {
      const w = surface.clientWidth,
        h = surface.clientHeight;
      if (!w || !h) return;
      const r = Math.min(22, w * 0.06, h * 0.06),
        cut = Math.min(w * 0.4, arrow.offsetWidth + 14) * state.fold;
      if (cut < 0.1) {
        path.setAttribute(
          "d",
          `M ${r} 0 H ${w - r} Q ${w} 0 ${w} ${r} V ${h - r} Q ${w} ${h} ${w - r} ${h} H ${r} Q 0 ${h} 0 ${h - r} V ${r} Q 0 0 ${r} 0 Z`,
        );
        return;
      }
      const c = Math.min(cut, w - r * 2, h - r * 2),
        bend = Math.min(r, c * 0.24);
      path.setAttribute(
        "d",
        `M ${r} 0 H ${w - r} Q ${w} 0 ${w} ${r} V ${h - c - bend} Q ${w} ${h - c} ${w - bend} ${h - c} Q ${w - c} ${h - c} ${w - c} ${h - bend} Q ${w - c} ${h} ${w - c - bend} ${h} H ${r} Q 0 ${h} 0 ${h - r} V ${r} Q 0 0 ${r} 0 Z`,
      );
    }
    function update() {
      const next = rnd
        ? card.classList.contains("is-active")
        : card.matches(":hover,:focus-visible");
      if (next !== active) {
        active = next;
        gsap.to(state, {
          fold: active ? 1 : 0,
          duration: 0.45,
          ease: "power2.inOut",
          overwrite: true,
          onUpdate: draw,
        });
      }
      draw();
    }
    new ResizeObserver(draw).observe(surface);
    if (rnd)
      new MutationObserver(update).observe(card, {
        attributes: true,
        attributeFilter: ["class"],
      });
    else
      ["pointerenter", "pointerleave", "focus", "blur"].forEach((event) =>
        card.addEventListener(event, update),
      );
    update();
  });
}
responsiveFolds__init();

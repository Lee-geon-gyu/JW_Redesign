gsap.registerPlugin(ScrollTrigger);

const RESPONSIVE_RELOAD_KEY = "jw-responsive-reload";

// Reload immediately whenever the responsive viewport changes by at least 1px.
function responsiveReload__init() {
  const initialWidth = window.innerWidth;
  const initialHeight = window.innerHeight;
  let reloading = false;

  window.addEventListener("resize", () => {
    if (
      reloading ||
      (window.innerWidth === initialWidth &&
        window.innerHeight === initialHeight)
    ) {
      return;
    }

    reloading = true;
    sessionStorage.setItem(RESPONSIVE_RELOAD_KEY, "true");
    window.location.reload();
  });
}

// Section text and action reveal sequence ------------------------------ //
function sectionAosSequence__init() {
  const setupForwardAosReplay = (section, elements) => {
    if (!section || !elements.length) return;

    let forwardReplayReady = true;
    let replayTicking = false;

    const setAnimated = (isAnimated) => {
      elements.forEach((element) =>
        element.classList.toggle("aos-animate", isAnimated),
      );
    };

    const replayForward = () => {
      setAnimated(false);
      window.requestAnimationFrame(() => {
        setAnimated(false);
        window.requestAnimationFrame(() => setAnimated(true));
      });
    };

    const updateForwardReplay = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
      );
      const visibleRatio =
        visibleHeight / Math.min(rect.height, viewportHeight);

      if (rect.top >= viewportHeight * 0.8) {
        forwardReplayReady = true;
        setAnimated(false);
      } else if (visibleRatio >= 0.4 && forwardReplayReady) {
        forwardReplayReady = false;
        replayForward();
      }

      replayTicking = false;
    };

    const requestForwardReplay = () => {
      if (replayTicking) return;
      replayTicking = true;
      window.requestAnimationFrame(updateForwardReplay);
    };

    window.addEventListener("scroll", requestForwardReplay, { passive: true });
    window.addEventListener("load", requestForwardReplay);
    requestForwardReplay();
  };

  const sec2TriggerOffset = Math.round(window.innerHeight * 0.4);
  const sec2TextElements = [
    ".sec-2 > .left-box > span:nth-child(1)",
    ".sec-2 > .left-box > h2",
    ".sec-2 > .left-box > span:nth-child(3)",
    ".sec-2 > .left-box > span:nth-child(4)",
  ].flatMap((selector) => [...document.querySelectorAll(selector)]);

  sec2TextElements.forEach((element, index) => {
    element.dataset.aos = "fade-right";
    element.dataset.aosDelay = String(index * 150);
    element.dataset.aosDuration = "650";
    element.dataset.aosAnchor = ".sec-2";
    element.dataset.aosAnchorPlacement = "top-bottom";
    element.dataset.aosOffset = String(sec2TriggerOffset);
    element.dataset.aosOnce = "true";
  });

  const sec2CardWrapper = document.querySelector(".sec-2 > .right-box");

  if (sec2CardWrapper) {
    sec2CardWrapper.dataset.aos = "fade-up";
    sec2CardWrapper.dataset.aosDelay = "600";
    sec2CardWrapper.dataset.aosDuration = "650";
    sec2CardWrapper.dataset.aosAnchor = ".sec-2";
    sec2CardWrapper.dataset.aosAnchorPlacement = "top-bottom";
    sec2CardWrapper.dataset.aosOffset = String(sec2TriggerOffset);
    sec2CardWrapper.dataset.aosOnce = "true";
  }

  const sec2Section = document.querySelector(".sec-2");
  const sec2AnimatedElements = [
    ...sec2TextElements,
    ...(sec2CardWrapper ? [sec2CardWrapper] : []),
  ];

  if (sec2Section && sec2AnimatedElements.length) {
    let forwardReplayReady = true;
    let replayTicking = false;

    const setSec2Animated = (isAnimated) => {
      sec2AnimatedElements.forEach((element) =>
        element.classList.toggle("aos-animate", isAnimated),
      );
    };

    const replaySec2Forward = () => {
      setSec2Animated(false);
      window.requestAnimationFrame(() => {
        setSec2Animated(false);
        window.requestAnimationFrame(() => setSec2Animated(true));
      });
    };

    const updateSec2ForwardReplay = () => {
      const rect = sec2Section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
      );
      const visibleRatio =
        visibleHeight / Math.min(rect.height, viewportHeight);

      // Reset only while sec-2 is below the viewport, toward sec-1.
      if (rect.top >= viewportHeight * 0.8) {
        forwardReplayReady = true;
        setSec2Animated(false);
      } else if (visibleRatio >= 0.4 && forwardReplayReady) {
        forwardReplayReady = false;
        replaySec2Forward();
      }

      replayTicking = false;
    };

    const requestSec2ForwardReplay = () => {
      if (replayTicking) return;
      replayTicking = true;
      window.requestAnimationFrame(updateSec2ForwardReplay);
    };

    window.addEventListener("scroll", requestSec2ForwardReplay, {
      passive: true,
    });
    window.addEventListener("load", requestSec2ForwardReplay);
    requestSec2ForwardReplay();
  }

  const sec3TriggerOffset = Math.round(window.innerHeight * 0.4);
  const sec3TextElements = [
    ".sec-3 > .top-box > span:nth-child(1)",
    ".sec-3 > .top-box > h4",
    ".sec-3 > .top-box > span:nth-child(3)",
  ].flatMap((selector) => [...document.querySelectorAll(selector)]);

  sec3TextElements.forEach((element, index) => {
    element.dataset.aos = "fade-up";
    element.dataset.aosDelay = String(index * 150);
    element.dataset.aosDuration = "650";
    element.dataset.aosAnchor = ".sec-3";
    element.dataset.aosAnchorPlacement = "top-bottom";
    element.dataset.aosOffset = String(sec3TriggerOffset);
    element.dataset.aosOnce = "true";
  });

  const sec3CardWrapper = document.querySelector(".sec-3 > .bottom-box");

  if (sec3CardWrapper) {
    sec3CardWrapper.dataset.aos = "fade-up";
    sec3CardWrapper.dataset.aosDelay = "450";
    sec3CardWrapper.dataset.aosDuration = "900";
    sec3CardWrapper.dataset.aosAnchor = ".sec-3";
    sec3CardWrapper.dataset.aosAnchorPlacement = "top-bottom";
    sec3CardWrapper.dataset.aosOffset = String(sec3TriggerOffset);
    sec3CardWrapper.dataset.aosOnce = "true";
  }

  const sec3Section = document.querySelector(".sec-3");
  const sec3AnimatedElements = [
    ...sec3TextElements,
    ...(sec3CardWrapper ? [sec3CardWrapper] : []),
  ];

  if (sec3Section && sec3AnimatedElements.length) {
    let forwardReplayReady = true;
    let replayTicking = false;

    const setSec3Animated = (isAnimated) => {
      sec3AnimatedElements.forEach((element) =>
        element.classList.toggle("aos-animate", isAnimated),
      );
    };

    const replaySec3Forward = () => {
      setSec3Animated(false);
      window.requestAnimationFrame(() => {
        setSec3Animated(false);
        window.requestAnimationFrame(() => setSec3Animated(true));
      });
    };

    const updateSec3ForwardReplay = () => {
      const rect = sec3Section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
      );
      const visibleRatio =
        visibleHeight / Math.min(rect.height, viewportHeight);

      // Reset only while sec-3 is below the viewport, toward sec-2.
      if (rect.top >= viewportHeight * 0.8) {
        forwardReplayReady = true;
        setSec3Animated(false);
      } else if (visibleRatio >= 0.4 && forwardReplayReady) {
        forwardReplayReady = false;
        replaySec3Forward();
      }

      replayTicking = false;
    };

    const requestSec3ForwardReplay = () => {
      if (replayTicking) return;
      replayTicking = true;
      window.requestAnimationFrame(updateSec3ForwardReplay);
    };

    window.addEventListener("scroll", requestSec3ForwardReplay, {
      passive: true,
    });
    window.addEventListener("load", requestSec3ForwardReplay);
    requestSec3ForwardReplay();
  }

  const sec6TextElements = [
    ".sec-6 > .top-box > span",
    ".sec-6 > .top-box > h4",
    ".sec-6 > .top-box > p",
  ].flatMap((selector) => [...document.querySelectorAll(selector)]);

  sec6TextElements.forEach((element, index) => {
    element.dataset.aos = "fade-up";
    element.dataset.aosDelay = String(index * 150);
    element.dataset.aosDuration = "650";
    element.dataset.aosOffset = "160";
    element.dataset.aosOnce = "true";
  });

  const sec6FilterPanel = document.querySelector(
    ".sec-6 > .product-filter-panel",
  );

  if (sec6FilterPanel) {
    sec6FilterPanel.dataset.aos = "fade-up";
    sec6FilterPanel.dataset.aosDelay = "450";
    sec6FilterPanel.dataset.aosDuration = "650";
    sec6FilterPanel.dataset.aosOffset = "160";
    sec6FilterPanel.dataset.aosOnce = "true";
  }

  const sec6ProductResults = document.querySelector(
    ".sec-6 > .product-results",
  );

  if (sec6ProductResults) {
    sec6ProductResults.dataset.aos = "fade-up";
    sec6ProductResults.dataset.aosDelay = "600";
    sec6ProductResults.dataset.aosDuration = "700";
    sec6ProductResults.dataset.aosOffset = "160";
    sec6ProductResults.dataset.aosOnce = "true";
  }

  const sec8TriggerOffset = Math.round(window.innerHeight * 0.4);
  const sec8TextElements = [
    ".sec-8 > .text-container > span:nth-child(1)",
    ".sec-8 > .text-container > h2",
    ".sec-8 > .text-container > span:nth-child(3)",
    ".sec-8 > .text-container > .contact-cta",
  ].flatMap((selector) => [...document.querySelectorAll(selector)]);

  sec8TextElements.forEach((element, index) => {
    element.dataset.aos = "fade-up";
    element.dataset.aosDelay = String(index * 150);
    element.dataset.aosDuration = "650";
    element.dataset.aosAnchor = ".sec-8";
    element.dataset.aosAnchorPlacement = "top-bottom";
    element.dataset.aosOffset = String(sec8TriggerOffset);
    element.dataset.aosOnce = "true";
  });

  const sec7Elements = [
    ".sec-7 > .top-box > span:nth-child(1)",
    ".sec-7 > .top-box > h4",
    ".sec-7 > .top-box > span:nth-child(3)",
    ".sec-7 > .top-box > span:nth-child(4)",
    ".sec-7 > .marquee-wrapper .news-pages",
  ].flatMap((selector) => [...document.querySelectorAll(selector)]);

  sec7Elements.forEach((element, index) => {
    element.dataset.aos = "fade-up";
    element.dataset.aosDelay = String(Math.min(index * 45, 225));
    element.dataset.aosDuration = "480";
    element.dataset.aosOffset = "160";
    element.dataset.aosOnce = "true";
  });

  setupForwardAosReplay(document.querySelector(".sec-6"), [
    ...sec6TextElements,
    ...(sec6FilterPanel ? [sec6FilterPanel] : []),
    ...(sec6ProductResults ? [sec6ProductResults] : []),
  ]);

  setupForwardAosReplay(document.querySelector(".sec-7"), [
    ...document.querySelectorAll(".sec-7 [data-aos]"),
  ]);

  setupForwardAosReplay(document.querySelector(".sec-8"), sec8TextElements);

  AOS.init({
    easing: "ease-out-cubic",
    once: true,
  });
}

// loadingPage ------------------------------ //
function loadingPage__init() {
  const isResponsiveReload =
    sessionStorage.getItem(RESPONSIVE_RELOAD_KEY) === "true";

  if (isResponsiveReload) {
    sessionStorage.removeItem(RESPONSIVE_RELOAD_KEY);
    history.scrollRestoration = "manual";
    $(".loading-page").hide();
    $("html, body").css({ overflow: "", height: "" });

    const moveToFirstSection = () => window.scrollTo(0, 0);
    moveToFirstSection();
    window.requestAnimationFrame(moveToFirstSection);
    window.addEventListener("load", moveToFirstSection, { once: true });
    return;
  }

  $("html, body").css({
    overflow: "hidden",
    height: "100%",
  });

  function preventScroll(e) {
    e.preventDefault();
  }

  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });

  function preventKey(e) {
    const keys = [32, 37, 38, 39, 40];
    if (keys.includes(e.keyCode)) {
      e.preventDefault();
    }
  }
  document.addEventListener("keydown", preventKey);

  setTimeout(() => {
    $(".loading-page").fadeOut(1500, function () {
      $("html, body").css({
        overflow: "",
        height: "",
      });

      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("keydown", preventKey);

      // The loading lock changes the document height, so below-the-fold AOS
      // positions must be measured again after the page is released.
      AOS.refreshHard();
      ScrollTrigger.refresh();
    });
  }, 1000);
}
// menuboxDropdown ------------------------------ //
function menuboxDropdown__init() {
  $("header > .hd-container > .menu-box").mouseenter(function () {
    $(this)
      .find(
        "> ul > .bg-container-wrapper > .bg-container-wrapper > .bg-container",
      )
      .stop(true, true)
      .slideDown(300);
  });
  $("header > .hd-container > .menu-box").mouseleave(function () {
    $(this)
      .find(
        "> ul > .bg-container-wrapper > .bg-container-wrapper > .bg-container",
      )
      .stop(true, true)
      .slideUp(300);
  });
  $("header > .hd-container > .menu-box").mouseenter(function () {
    $(this)
      .find("> ul > .bg-container-wrapper")
      .stop(true, true)
      .slideDown(300);
  });
  $("header > .hd-container > .menu-box").mouseleave(function () {
    $(this).find("> ul > .bg-container-wrapper").stop(true, true).slideUp(300);
  });
}
// menuitemDropdown ------------------------------ //
function menuitemDropdown__init() {
  $("header > .hd-container > .menu-box").mouseenter(function () {
    var self = $(this);
    setTimeout(function () {
      self.find(".menu-item-container > ul").addClass("fade");
    }, 150);
  });
  $("header > .hd-container > .menu-box").mouseleave(function () {
    var self = $(this);
    setTimeout(function () {
      self.find(".menu-item-container > ul").removeClass("fade");
    }, 150);
  });
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
function tabAsideContainer__init() {
  const $items = $(".tab-aside > .aside-menu-box > ul > .menu-item-initial");

  $items.on("click", function () {
    const $current = $(this);

    $items.not($current).find("> ul").stop(true, true).slideUp(500);

    $current.find("> ul").stop(true, true).slideToggle(500);
  });

  $(".tab-aside > .close-btn-container > .close-btn").on("click", function () {
    $(this)
      .closest(".tab-aside")
      .find(".menu-item-initial > ul")
      .stop(true, true)
      .slideUp(500);
  });
}
// tabAsideContainerOpen ------------------------------ //
function tabAsideContainerOpen__init() {
  $("header > .hd-container > .side-box > .tab-box").click(function () {
    $(this)
      .parent()
      .parent()
      .parent()
      .siblings()
      .find("> .tab-aside")
      .removeClass("close");
  });
}
// tabAsideContainerClose ------------------------------ //
function tabAsideContainerClose__init() {
  $(".tab-aside > .close-btn-container > .close-btn").click(function () {
    $(this).parent().parent().addClass("close");
  });
}
// swiperCustom ------------------------------ //
function swiperCustom__init() {
  const responsiveSwipeEnabled = window.matchMedia(
    "(max-width: 1280px)",
  ).matches;

  const mySwiper = new Swiper(".mySwiper", {
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    speed: 1000,
    allowTouchMove: responsiveSwipeEnabled,
    simulateTouch: responsiveSwipeEnabled,
    grabCursor: responsiveSwipeEnabled,
    threshold: 8,
    touchRatio: 1,
    touchStartPreventDefault: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  });

  const total = document.querySelector(".custom-pagination .total");
  const current = document.querySelector(".custom-pagination .current");
  const progress = document.querySelector(".custom-pagination .progress");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  const totalSlides = mySwiper.slides.length;
  total.textContent = String(totalSlides).padStart(2, "0");

  function updatePagination() {
    const index = mySwiper.realIndex + 1;

    current.textContent = String(index).padStart(2, "0");

    progress.classList.remove("is-running");
    void progress.offsetWidth;
    progress.classList.add("is-running");
  }

  updatePagination();

  mySwiper.on("realIndexChange", () => {
    updatePagination();
  });

  function resetAutoplay() {
    mySwiper.autoplay.stop();
    mySwiper.autoplay.start();
  }

  prevBtn.addEventListener("click", () => {
    mySwiper.slidePrev();
    resetAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    mySwiper.slideNext();
    resetAutoplay();
  });

  mySwiper.on("touchEnd", () => {
    resetAutoplay();
  });
}
// headerChangeOnSection ------------------------------ //
function headerChangeOnSection__init() {
  const header = document.querySelector("header");
  const removeDarkHeader = () => {
    if (header.dataset.sec5Open !== "true") {
      header.classList.remove("on-sec-w");
    }
  };

  ScrollTrigger.matchMedia({
    "(min-width: 1281px)": function () {
      const targets = document.querySelectorAll(
        ".sec-6, .sec-7, .banner, .sec-8",
      );

      targets.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom top",
          onEnter: () => header.classList.add("on-sec-w"),
          onLeave: removeDarkHeader,
          onEnterBack: () => header.classList.add("on-sec-w"),
          onLeaveBack: removeDarkHeader,
        });
      });
    },

    "(max-width: 1280px)": function () {
      const targets = document.querySelectorAll(
        ".sec-6, .sec-7, .banner, .sec-8",
      );

      targets.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom top",
          onEnter: () => header.classList.add("on-sec-w"),
          onLeave: removeDarkHeader,
          onEnterBack: () => header.classList.add("on-sec-w"),
          onLeaveBack: removeDarkHeader,
        });
      });
    },
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
  const header = document.querySelector("header");
  const sloganSection = document.querySelector("main > .sec-4");
  const sloganBackground = sloganSection?.querySelector(".sec-2-4-bg");
  const sec5Section = document.querySelector("main > .sec-5");
  const sloganTexts = sloganSection
    ? [...sloganSection.querySelectorAll(".sec2-text")]
    : [];

  let flipStage = sloganSection?.querySelector(".sec-4-flip-stage");
  let sec5Layer = sloganSection?.querySelector(".sec-5-transition-layer");
  if (sloganSection && sloganBackground && sec5Section && !flipStage) {
    flipStage = document.createElement("div");
    flipStage.className = "sec-4-flip-stage";

    const flipFront = document.createElement("div");
    flipFront.className = "sec-4-flip-face sec-4-flip-front";

    const flipBack = document.createElement("div");
    flipBack.className = "sec-4-flip-face sec-4-flip-back";

    const flipImage = document.createElement("div");
    flipImage.className = "sec-5-flip-image";
    flipImage.appendChild(
      sec5Section.querySelector(".bg-container > img").cloneNode(true),
    );

    sec5Layer = document.createElement("div");
    sec5Layer.className = "sec-5-transition-layer";
    sec5Layer.appendChild(sec5Section);

    flipFront.appendChild(sloganBackground);
    flipBack.appendChild(flipImage);
    flipStage.append(flipFront, flipBack);
    sloganSection.prepend(sec5Layer);
    sloganSection.prepend(flipStage);
  }

  const sec5PreviewBackground = sec5Layer?.querySelector(
    ".sec-5 > .bg-container",
  );
  const sec5Content = sec5Layer?.querySelector(".sec-5 > .text-container");
  const sec5RevealElements = sec5Content
    ? [
        sec5Content.querySelector(".top-box > span:nth-child(1)"),
        sec5Content.querySelector(".top-box > h4"),
        sec5Content.querySelector(".top-box > span:nth-child(3)"),
        sec5Content.querySelector(".bottom-box"),
      ].filter(Boolean)
    : [];

  if (sloganSection && sloganTexts.length) {
    ScrollTrigger.matchMedia({
      "(prefers-reduced-motion: no-preference)": function () {
        gsap.set(sloganTexts, { autoAlpha: 0, y: 48 });
        gsap.set(sec5Layer, { autoAlpha: 1, pointerEvents: "none" });
        gsap.set(sec5Section, { backgroundColor: "rgba(255,255,255,0)" });
        gsap.set(sec5PreviewBackground, { autoAlpha: 0 });
        gsap.set(sec5Content, { autoAlpha: 1, y: 0 });
        gsap.set(sec5RevealElements, { autoAlpha: 0, y: 32 });
        gsap.set(sloganBackground, {
          top: 0,
          bottom: "auto",
          left: 0,
          width: "100%",
          height: "100%",
          minHeight: 0,
          xPercent: 0,
          yPercent: 0,
          borderRadius: 0,
        });
        gsap.set(flipStage, {
          top: "25dvh",
          bottom: "auto",
          left: "50%",
          width: "50%",
          height: "50dvh",
          minHeight: 0,
          xPercent: -50,
          yPercent: 0,
          borderRadius: "1.6rem",
          rotationY: 0,
        });

        const sloganTimeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "sec4-slogan-pin",
            trigger: sloganSection,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 8.5)}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const imageArrivalTime =
                sloganTimeline.labels["sec5-image-arrived"];
              const imageHasArrived =
                Number.isFinite(imageArrivalTime) &&
                self.progress >= imageArrivalTime / sloganTimeline.duration();
              const sec5IsOpen = self.progress >= 0.985;
              if (header) {
                header.dataset.sec5Open = String(imageHasArrived);
              }

              header?.classList.toggle("on-sec-w", imageHasArrived);

              if (sec5Layer) {
                sec5Layer.style.pointerEvents = sec5IsOpen ? "auto" : "none";
                sec5Layer.style.zIndex = sec5IsOpen ? "20" : "0";
              }
            },
          },
        });

        sloganTimeline.to(flipStage, {
          top: 0,
          width: "100%",
          height: "100dvh",
          borderRadius: 0,
          duration: 1,
        });

        sloganTexts.forEach((text, index) => {
          sloganTimeline
            .to(text, {
              autoAlpha: 1,
              y: 0,
              duration: 0.32,
              ease: "power2.out",
            })
            .to({}, { duration: 0.64 });

          if (index < sloganTexts.length - 1) {
            sloganTimeline.to(text, { autoAlpha: 0, duration: 0.18 });
          }
        });

        sloganTimeline
          .to(sloganTexts.at(-1), { autoAlpha: 0, duration: 0.18 })
          .to(flipStage, {
            top: "25dvh",
            bottom: "auto",
            width: "50%",
            height: "50dvh",
            yPercent: 0,
            borderRadius: "1.6rem",
            duration: 0.85,
            ease: "power2.inOut",
          })
          .to(flipStage, {
            rotationY: 180,
            duration: 1,
            ease: "power2.inOut",
          })
          .to(flipStage, {
            top: () => sec5PreviewBackground.getBoundingClientRect().top,
            left: () => sec5PreviewBackground.getBoundingClientRect().left,
            width: () => sec5PreviewBackground.getBoundingClientRect().width,
            height: () => sec5PreviewBackground.getBoundingClientRect().height,
            xPercent: 0,
            borderRadius: "1.4rem",
            duration: 1.15,
            ease: "power2.inOut",
          })
          .to(
            sec5Section,
            { backgroundColor: "#fff", duration: 1.15, ease: "power1.inOut" },
            "<",
          )
          .addLabel("sec5-image-arrived")
          .to(sec5PreviewBackground, { autoAlpha: 1, duration: 0.15 }, ">")
          .set(flipStage, { autoAlpha: 0 })
          .to(sec5RevealElements, {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.18,
            ease: "power2.out",
          })
          .set(sec5Layer, { zIndex: 20, pointerEvents: "auto" });

        return () => {
          sloganTimeline.scrollTrigger?.kill();
          sloganTimeline.kill();
        };
      },
      "(prefers-reduced-motion: reduce)": function () {
        gsap.set(sec5Layer, { autoAlpha: 0 });
        gsap.set(flipStage, {
          top: 0,
          bottom: "auto",
          left: 0,
          width: "100%",
          height: "100%",
          minHeight: 0,
          xPercent: 0,
          yPercent: 0,
          borderRadius: 0,
          rotationY: 0,
        });
        gsap.set(sloganTexts, { autoAlpha: 0, y: 0 });
        gsap.set(sloganTexts.at(-1), { autoAlpha: 1, y: 0 });
      },
    });
  }

  // Sections 2–5 now live in the normal document flow. Keep the header
  // observer, but do not build the former pinned, overlapping master timeline.
  headerChangeOnSection__init();
  ScrollTrigger.refresh();
}

// smooth scroll and parallax ------------------------------ //
function scrollLeins__init() {
  const lenis = new Lenis({
    lerp: 0.055,
    easing: (t) => t,
    smooth: true,
    smoothTouch: false,
  });

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

// header scroll progress ------------------------------ //
function headerProgress__init() {
  const progressBar = document.querySelector(
    "header > .header-progress > .header-progress-bar",
  );
  const header = document.querySelector("header");
  const sec6 = document.querySelector(".sec-6");
  if (!progressBar) return;

  let ticking = false;
  let lastScrollY = window.scrollY || window.pageYOffset;

  function updateProgress() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      scrollableHeight > 0
        ? Math.min(Math.max(scrollTop / scrollableHeight, 0), 1)
        : 0;

    progressBar.style.transform = `scaleX(${progress})`;

    if (header && sec6) {
      const sec6Reached =
        sec6.getBoundingClientRect().top <=
        header.getBoundingClientRect().bottom;
      progressBar.classList.toggle("is-blue", sec6Reached);
    }

    if (header) {
      const scrollDelta = scrollTop - lastScrollY;

      if (scrollTop <= 0) {
        header.classList.remove("peek");
      } else if (scrollDelta > 3) {
        header.classList.add("peek");
      } else if (scrollDelta < -3) {
        header.classList.remove("peek");
      }
    }

    lastScrollY = scrollTop;
    ticking = false;
  }

  function requestProgressUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  }

  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", requestProgressUpdate);
  window.addEventListener("load", requestProgressUpdate);
  requestProgressUpdate();
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

// Functions Operate Key ------------------------------ //
responsiveReload__init();
sectionAosSequence__init();
loadingPage__init();
menuboxDropdown__init();
menuitemDropdown__init();
translateboxDropdown__init();
tabAsideContainer__init();
tabAsideContainerOpen__init();
tabAsideContainerClose__init();
swiperCustom__init();
bottomSelectboxDropUp__init();
scrollTrigger__init();
scrollLeins__init();
headerProgress__init();
marqueeSlide__init();
searchBoxOptions__init();
productFilters__init();
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

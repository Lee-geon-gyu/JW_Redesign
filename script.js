console.clear();

gsap.registerPlugin(ScrollTrigger);

// Section text and action reveal sequence ------------------------------ //
function sectionAosSequence__init() {
  const sectionGroups = [
    [
      ".sec-3 > .left-box > span:nth-child(1)",
      ".sec-3 > .left-box > h2",
      ".sec-3 > .left-box > span:nth-child(3)",
      ".sec-3 > .left-box > span:nth-child(4)",
      ".sec-3 > .right-box > .produce-box",
    ],
    [
      ".sec-4 > .top-box > span:nth-child(1)",
      ".sec-4 > .top-box > h4",
      ".sec-4 > .top-box > span:nth-child(3)",
      ".sec-4 > .top-box > span:nth-child(4)",
      ".sec-4 > .bottom-box > .circles",
    ],
    [
      ".sec-5 > .text-container > .top-box > span:nth-child(1)",
      ".sec-5 > .text-container > .top-box > h4",
      ".sec-5 > .text-container > .top-box > span:nth-child(3)",
      ".sec-5 > .text-container > .bottom-box > .value-wrap",
    ],
    [
      ".sec-6 > .top-box > span",
      ".sec-6 > .top-box > h4",
      ".sec-6 > .top-box > .word-search-tag",
      ".sec-6 > .top-box > .category-search-tag",
      ".sec-6 > .top-box > .search-wrap",
      ".sec-6 > .goods-slider",
    ],
    [
      ".sec-7 > .top-box > span:nth-child(1)",
      ".sec-7 > .top-box > h4",
      ".sec-7 > .top-box > span:nth-child(3)",
      ".sec-7 > .top-box > span:nth-child(4)",
      ".sec-7 > .marquee-wrapper .news-pages",
    ],
    [
      ".sec-8 > .text-container > span:nth-child(1)",
      ".sec-8 > .text-container > h2",
      ".sec-8 > .text-container > span:nth-child(3)",
      ".sec-8 > .text-container > .contact-box",
    ],
  ];

  sectionGroups.forEach((selectors, groupIndex) => {
    // sec-5는 고정 스크롤 타임라인에서 별도로 연출한다.
    if (groupIndex === 2) return;

    const elements = selectors.flatMap((selector) => [
      ...document.querySelectorAll(selector),
    ]);

    elements.forEach((element, index) => {
      element.dataset.aos = "fade-right";
      element.dataset.aosDelay = String(Math.min(index * 45, 225));
      element.dataset.aosDuration = "480";
      element.dataset.aosOffset = "160";
      element.dataset.aosOnce = "true";

      // Lower content in sec-4 and sec-5 should start with its section,
      // instead of waiting until each individual item reaches the viewport.
      if (groupIndex === 1 || groupIndex === 2) {
        element.dataset.aosAnchor = groupIndex === 1 ? ".sec-4" : ".sec-5";
        element.dataset.aosAnchorPlacement = "top-bottom";
        element.dataset.aosDelay = String(Math.min(index * 35, 175));
      }
    });
  });

  AOS.init({
    easing: "ease-out-cubic",
    once: true,
  });
}

// loadingPage ------------------------------ //
function loadingPage__init() {
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
  const mySwiper = new Swiper(".mySwiper", {
    loop: true,
    speed: 600,
    autoplay: {
      delay: 3500,
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

    const percent = (index / totalSlides) * 100;
    progress.style.width = percent + "%";
  }

  updatePagination();

  mySwiper.on("slideChangeTransitionStart", () => {
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
          onLeave: () => header.classList.remove("on-sec-w"),
          onEnterBack: () => header.classList.add("on-sec-w"),
          onLeaveBack: () => header.classList.remove("on-sec-w"),
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
          onLeave: () => header.classList.remove("on-sec-w"),
          onEnterBack: () => header.classList.add("on-sec-w"),
          onLeaveBack: () => header.classList.remove("on-sec-w"),
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
// GSAP scrollTrigger ------------------------------ //
function scrollTrigger__init() {
  ScrollTrigger.getAll().forEach((st) => st.kill());

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".sec-2 > .content-wrap",
      start: "top top",
      end: "+=960%",
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  tl.fromTo(
    ".sec-2 .bg-container",
    {
      width: "90%",
      height: "70%",
      borderRadius: "9999px",
    },
    {
      width: "100%",
      height: "100%",
      borderRadius: "0px",
      duration: 2,
      ease: "none",
    },
  )
    .fromTo(
      ".sec-2 .bg-container > img",
      { filter: "brightness(1)" },
      { filter: "brightness(0.3)", duration: 2, ease: "none" },
      "<",
    )
    .fromTo(".t1", { opacity: 0 }, { opacity: 1, duration: 3 })
    .to(".t1", { opacity: 0, duration: 0 })
    .fromTo(".t2", { opacity: 0 }, { opacity: 1, duration: 3 }, "<")
    .to(".t2", { opacity: 0, duration: 0 })
    .fromTo(".t3", { opacity: 0 }, { opacity: 1, duration: 3 }, "<")
    .to(".t3", { opacity: 0, duration: 0 })
    .fromTo(".t4", { opacity: 0 }, { opacity: 1, duration: 3 }, "<")
    .to(".t4", { opacity: 0, duration: 0 })
    .fromTo(".t5", { opacity: 0 }, { opacity: 1, duration: 3 }, "<");

  ScrollTrigger.matchMedia({
    "(min-width: 1281px) and (prefers-reduced-motion: no-preference)":
      function () {
        const horizontalTrack = document.querySelector(".sec-3-4-horizontal");

        if (!horizontalTrack) return;

        const sec3Panel = horizontalTrack.querySelector(".sec-3");
        const sec4Panel = horizontalTrack.querySelector(".sec-4");
        const sec5Panel = horizontalTrack.querySelector(".sec-5");
        const sec3Text = sec3Panel?.querySelector(":scope > .left-box");
        const sec3Cards = sec3Panel?.querySelector(":scope > .right-box");
        const sec4Text = sec4Panel?.querySelector(":scope > .top-box");
        const sec4Cards = sec4Panel?.querySelector(":scope > .bottom-box");
        const sec4Circles = sec4Cards?.querySelectorAll(":scope > .circles");
        const sec5TextContainer = sec5Panel?.querySelector(
          ":scope > .text-container",
        );
        const sec5Top = sec5TextContainer?.querySelector(":scope > .top-box");
        const sec5Bottom = sec5TextContainer?.querySelector(
          ":scope > .bottom-box",
        );
        const sec5Items = sec5Bottom?.querySelectorAll(":scope > .value-wrap");
        const sec5Background = sec5Panel?.querySelector(
          ":scope > .bg-container > img",
        );

        if (
          !sec3Panel ||
          !sec4Panel ||
          !sec5Panel ||
          !sec3Text ||
          !sec3Cards ||
          !sec4Text ||
          !sec4Cards ||
          !sec4Circles?.length ||
          !sec5TextContainer ||
          !sec5Top ||
          !sec5Bottom ||
          !sec5Items?.length ||
          !sec5Background
        )
          return;

        const horizontalTimeline = gsap.timeline({
          scrollTrigger: {
            id: "sec3-sec4-horizontal",
            trigger: horizontalTrack,
            start: "top top",
            end: () => `+=${window.innerWidth + window.innerHeight * 2.7}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.set(sec4Panel, { xPercent: -100, pointerEvents: "none" });
        gsap.set(sec4Text, { opacity: 0 });
        gsap.set(sec4Cards, { xPercent: 100 });
        gsap.set(sec4Circles, { opacity: 0 });
        gsap.set(sec5Panel, { yPercent: 100 });
        gsap.set(sec5Background, { filter: "brightness(0.7)" });
        gsap.set(sec5Top, {
          y: () =>
            (sec5Bottom.offsetHeight +
              (parseFloat(getComputedStyle(sec5TextContainer).gap) || 0)) /
            2,
        });
        gsap.set(sec5Items, { opacity: 0 });
        gsap.set(sec5Bottom, { pointerEvents: "none" });

        horizontalTimeline
          .to(sec4Cards, { xPercent: 0, duration: 1, ease: "none" }, 0)
          .to(sec3Cards, { opacity: 0, duration: 0.2, ease: "none" }, 0.34)
          .to(
            sec4Circles,
            {
              opacity: 1,
              duration: 0.55,
              stagger: 0.15,
              ease: "none",
            },
            0.15,
          )
          .to(sec3Text, { opacity: 0, duration: 0.18, ease: "none" }, 0.72)
          .to(sec4Text, { opacity: 1, duration: 0.18, ease: "none" }, 0.82)
          .set(sec4Panel, { pointerEvents: "auto" })
          .to({}, { duration: 0.28 })
          .set(sec4Panel, { pointerEvents: "none" })
          .to(sec5Panel, { yPercent: 0, duration: 1, ease: "none" })
          .to(
            [sec3Panel, sec4Panel],
            { filter: "blur(10px)", duration: 0.82, ease: "none" },
            "<",
          )
          .to(
            [sec3Panel, sec4Panel],
            { opacity: 0, duration: 0.38, ease: "none" },
            "<0.42",
          )
          .to({}, { duration: 0.18 })
          .to(sec5Background, {
            filter: "brightness(0.3)",
            duration: 0.9,
            ease: "none",
          })
          .to(sec5Top, { y: 0, duration: 0.9, ease: "none" }, "<")
          .set(sec5Bottom, { pointerEvents: "auto" })
          .to(
            sec5Items,
            { opacity: 1, duration: 0.55, stagger: 0.12, ease: "none" },
            "<0.2",
          )
          .to({}, { duration: 0.35 });
      },
    "(max-width: 1280px) and (prefers-reduced-motion: no-preference)":
      function () {
        const responsiveTrack = document.querySelector(".sec-3-4-horizontal");

        if (!responsiveTrack) return;

        const sec3Panel = responsiveTrack.querySelector(".sec-3");
        const sec4Panel = responsiveTrack.querySelector(".sec-4");
        const sec5Panel = responsiveTrack.querySelector(".sec-5");
        const sec3Text = sec3Panel?.querySelector(":scope > .left-box");
        const sec3Cards = sec3Panel?.querySelector(":scope > .right-box");
        const sec4Text = sec4Panel?.querySelector(":scope > .top-box");
        const sec4Circles = sec4Panel?.querySelectorAll(
          ":scope > .bottom-box > .circles",
        );
        const sec5TextContainer = sec5Panel?.querySelector(
          ":scope > .text-container",
        );
        const sec5Top = sec5TextContainer?.querySelector(":scope > .top-box");
        const sec5Bottom = sec5TextContainer?.querySelector(
          ":scope > .bottom-box",
        );
        const sec5Items = sec5Bottom?.querySelectorAll(":scope > .value-wrap");
        const sec5Background = sec5Panel?.querySelector(
          ":scope > .bg-container > img",
        );

        if (
          !sec3Panel ||
          !sec4Panel ||
          !sec5Panel ||
          !sec3Text ||
          !sec3Cards ||
          !sec4Text ||
          !sec4Circles?.length ||
          !sec5TextContainer ||
          !sec5Top ||
          !sec5Bottom ||
          !sec5Items?.length ||
          !sec5Background
        )
          return;

        gsap.set(sec4Panel, { pointerEvents: "none" });
        gsap.set(sec4Text, { opacity: 0 });
        gsap.set(sec4Circles, { opacity: 0, xPercent: 70 });
        gsap.set(sec5Panel, { yPercent: 100 });
        gsap.set(sec5Background, { filter: "brightness(0.7)" });
        gsap.set(sec5Top, {
          y: () =>
            (sec5Bottom.offsetHeight +
              (parseFloat(getComputedStyle(sec5TextContainer).gap) || 0)) /
            2,
        });
        gsap.set(sec5Items, { opacity: 0 });
        gsap.set(sec5Bottom, { pointerEvents: "none" });

        const responsiveTimeline = gsap.timeline({
          scrollTrigger: {
            id: "sec3-sec4-responsive",
            trigger: responsiveTrack,
            start: "top top",
            end: () => `+=${window.innerHeight * 3.7}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        responsiveTimeline
          .to(sec3Cards, { opacity: 0, duration: 0.28, ease: "none" }, 0.2)
          .to(
            sec4Circles,
            {
              opacity: 1,
              xPercent: 0,
              duration: 0.5,
              stagger: 0.12,
              ease: "none",
            },
            0.28,
          )
          .to(sec3Text, { opacity: 0, duration: 0.18, ease: "none" }, 0.7)
          .to(sec4Text, { opacity: 1, duration: 0.18, ease: "none" }, 0.8)
          .set(sec4Panel, { pointerEvents: "auto" })
          .to({}, { duration: 0.28 })
          .set(sec4Panel, { pointerEvents: "none" })
          .to(sec5Panel, { yPercent: 0, duration: 1, ease: "none" })
          .to(
            [sec3Panel, sec4Panel],
            { filter: "blur(10px)", duration: 0.82, ease: "none" },
            "<",
          )
          .to(
            [sec3Panel, sec4Panel],
            { opacity: 0, duration: 0.38, ease: "none" },
            "<0.42",
          )
          .to({}, { duration: 0.18 })
          .to(sec5Background, {
            filter: "brightness(0.3)",
            duration: 0.9,
            ease: "none",
          })
          .to(sec5Top, { y: 0, duration: 0.9, ease: "none" }, "<")
          .set(sec5Bottom, { pointerEvents: "auto" })
          .to(
            sec5Items,
            { opacity: 1, duration: 0.55, stagger: 0.12, ease: "none" },
            "<0.2",
          )
          .to({}, { duration: 0.35 });
      },
  });

  headerChangeOnSection__init();

  ScrollTrigger.refresh();
}
// GSAP scrollLeins ------------------------------ //
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
// headerHide ------------------------------ //
function headerHide__init() {
  (function () {
    const header = document.querySelector("header");
    if (!header) return;

    let lastY = window.scrollY || window.pageYOffset;
    let ticking = false;

    function onScroll() {
      const currentY = window.scrollY || window.pageYOffset;

      if (currentY > lastY) {
        header.classList.add("hide");
        header.classList.remove("show");
      } else if (currentY < lastY) {
        header.classList.add("show");
        header.classList.remove("hide");
      }
      lastY = currentY;
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true },
    );

    window.addEventListener("load", function () {
      lastY = window.scrollY || window.pageYOffset;
      header.classList.add(lastY === 0 ? "show" : "hide");
    });
  })();
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
// itemsSwiper ------------------------------ //
function itemsSwiper__Init() {
  const goodsSwiper = new Swiper(".goods-slider", {
    loop: true,
    centeredSlides: true,
    watchOverflow: false,
    speed: 600,

    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },

    breakpoints: {
      0: {
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 60,
      },
      450: {
        slidesPerView: 2,
        centeredSlides: true,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 60,
      },
      1024: {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 10,
      },
    },
  });

  const swiperEl = document.querySelector(".goods-slider");

  swiperEl.addEventListener("mouseenter", () => {
    goodsSwiper.autoplay.stop();
  });

  swiperEl.addEventListener("mouseleave", () => {
    goodsSwiper.autoplay.start();
  });

  // goodsSwiper.on("click", (swiper) => {
  //   if (swiper.clickedIndex == null) return;

  //   if (swiper.clickedIndex === swiper.activeIndex) return;

  //   swiper.slideToLoop(swiper.clickedIndex, 600);
  // });
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

[...document.querySelectorAll("*")].filter(
  (el) => el.scrollWidth > document.documentElement.clientWidth,
);
// Functions Operate Key ------------------------------ //
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
headerHide__init();
marqueeSlide__init();
itemsSwiper__Init();
searchBoxOptions__init();
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

console.clear();

AOS.init();
gsap.registerPlugin(ScrollTrigger);

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
    });
  }, 1000);
}
// menuboxDropdown ------------------------------ //
function menuboxDropdown__init() {
  $("header > .hd-container > .menu-box").mouseenter(function () {
    $(this)
      .find(
        "> ul > .bg-container-wrapper > .bg-container-wrapper > .bg-container"
      )
      .stop(true, true)
      .slideDown(300);
  });
  $("header > .hd-container > .menu-box").mouseleave(function () {
    $(this)
      .find(
        "> ul > .bg-container-wrapper > .bg-container-wrapper > .bg-container"
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
    "header > .hd-container > .side-box > .language-box > .translate-box-1"
  ).click(function () {
    $(this).parent().find("> .translate-box-2").toggleClass("drop");
    $(this).find("> a > img").toggleClass("rotate");
  });

  $(
    "header > .hd-container > .side-box > .language-box > .translate-box-2 > a > .languages-wrapper > span"
  ).mouseenter(function () {
    $(this).addClass("hover");
  });

  $(
    "header > .hd-container > .side-box > .language-box > .translate-box-2 > a > .languages-wrapper > span"
  ).mouseleave(function () {
    $(this).removeClass("hover");
  });

  $(
    "header > .hd-container > .side-box > .language-box > .translate-box-2"
  ).click(function () {
    $(this).removeClass("drop");
    $(this).parent().find("> .translate-box-1 > a > img").toggleClass("rotate");
  });

  $(document).click(function (e) {
    const $dropdown = $(
      "header > .hd-container > .side-box > .language-box > .translate-box-2"
    );
    const $button = $(
      "header > .hd-container > .side-box > .language-box > .translate-box-1"
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
  const target = document.querySelectorAll(
    `.sec-2, .sec-6, .sec-7, .sec-8, .banner`
  );
  console.log(target);

  target.forEach((el) => {
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
      end: "+=850%",
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  tl.fromTo(".t1", { opacity: 0 }, { opacity: 1, duration: 3 })
    .to(".t1", { opacity: 0, duration: 0 })
    .fromTo(".t2", { opacity: 0 }, { opacity: 1, duration: 3 }, "<")
    .to(".t2", { opacity: 0, duration: 0 })
    .fromTo(".t3", { opacity: 0 }, { opacity: 1, duration: 3 }, "<")
    .to(".t3", { opacity: 0, duration: 0 })
    .fromTo(".t4", { opacity: 0 }, { opacity: 1, duration: 3 }, "<")
    .to(".t4", { opacity: 0, duration: 0 })
    .fromTo(".t5", { opacity: 0 }, { opacity: 1, duration: 3 }, "<")
    .to(".sec-2 .bg-container", { opacity: 0, duration: 3 }, "<");

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
      { passive: true }
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
      }
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
  (el) => el.scrollWidth > document.documentElement.clientWidth
);
// Functions Operate Key ------------------------------ //
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
  ScrollTrigger.refresh();
});

window.addEventListener("resize", () => {
  clearTimeout(window.__stTimer);
  window.__stTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);
});

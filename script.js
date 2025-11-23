console.clear();

AOS.init();
gsap.registerPlugin(ScrollTrigger);

// menuboxDropdown ------------------------------ //
function menuboxDropdown__init() {
  $("header > .hd-container > .menu-box").mouseenter(function () {
    $(this).find("> ul > .bg-container").stop(true, true).slideDown(300);
  });
  $("header > .hd-container > .menu-box").mouseleave(function () {
    $(this).find("> ul > .bg-container").stop(true, true).slideUp(300);
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
  $("header > .hd-container > .side-box > .language-box > .translate-box-1").click(function () {
    $(this).parent().find("> .translate-box-2").toggleClass("drop");
    $(this).find("> a > img").toggleClass("rotate");
  });

  $("header > .hd-container > .side-box > .language-box > .translate-box-2 > a > .languages-wrapper > span").mouseenter(function () {
    $(this).addClass("hover");
  });

  $("header > .hd-container > .side-box > .language-box > .translate-box-2 > a > .languages-wrapper > span").mouseleave(function () {
    $(this).removeClass("hover");
  });

  $("header > .hd-container > .side-box > .language-box > .translate-box-2").click(function () {
    $(this).removeClass("drop");
    $(this).parent().find("> .translate-box-1 > a > img").toggleClass("rotate");
  });

  $(document).click(function (e) {
    const $dropdown = $("header > .hd-container > .side-box > .language-box > .translate-box-2");
    const $button = $("header > .hd-container > .side-box > .language-box > .translate-box-1");

    if (!$button.is(e.target) && $button.has(e.target).length === 0 && !$dropdown.is(e.target) && $dropdown.has(e.target).length === 0) {
      $dropdown.removeClass("drop");
      $button.find("> a > img").removeClass("rotate");
    }
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
  const target = document.querySelectorAll(`.sec-2, .sec-6, .sec-7, .sec-8`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          header.classList.add("on-sec-w");
        } else {
          header.classList.remove("on-sec-w");
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  target.forEach((el) => {
    observer.observe(el);
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
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".sec-2",
      start: "top top",
      end: "+=1250%",
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  tl.fromTo(".t1", { opacity: 0, y: 0 }, { opacity: 1, y: 0, duration: 3 })

    .to(".t1", { opacity: 0, y: 0, duration: 0 })
    .fromTo(".t2", { opacity: 0, y: 0 }, { opacity: 1, y: 0, duration: 3 }, "<")

    .to(".t2", { opacity: 0, y: 0, duration: 0 })
    .fromTo(".t3", { opacity: 0, y: 0 }, { opacity: 1, y: 0, duration: 3 }, "<")

    .to(".t3", { opacity: 0, y: 0, duration: 0 })
    .fromTo(".t4", { opacity: 0, y: 0 }, { opacity: 1, y: 0, duration: 3 }, "<")

    .to(".t4", { opacity: 0, y: 0, duration: 0 })
    .fromTo(".t5", { opacity: 0, y: 0 }, { opacity: 1, y: 0, duration: 3 }, "<")
    .to(".sec-2 > .bg-container", { opacity: 0, duration: 3 }, "<");
}
// GSAP scrollLeins ------------------------------ //
function scrollLeins__init() {
  const lenis = new Lenis({
    lerp: 0.055,
    easing: t => t,
    smooth: true,
    smoothTouch: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  gsap.registerPlugin(ScrollTrigger);

  lenis.on('scroll', ScrollTrigger.update);

  gsap.utils.toArray("[data-speed]").forEach(el => {
    gsap.to(el, {
      y: () => -(el.dataset.speed * window.innerHeight / 5),
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        scrub: true
      }
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
window.addEventListener("load", () => {
  const box = document.querySelector(".marquee-box");
  const clone = box.cloneNode(true);
  box.parentNode.appendChild(clone);

  const tl = gsap.timeline({
    repeat: -1,
    ease: "none"
  });

  const totalWidth = box.scrollWidth;

  tl.fromTo(
    ".marquee-box",
    { x: 0 },
    {
      x: -totalWidth,
      duration: 30,
      ease: "none",
    }
  );

  document.querySelector(".marquee-wrapper").addEventListener("mouseenter", () => {
    tl.pause();
  });

  document.querySelector(".marquee-wrapper").addEventListener("mouseleave", () => {
    tl.play();
  });
});
}
// slickSlider ------------------------------ //
function slickSlider__init() {
  $(document).ready(function() {
  $('.goods-slider').slick({
  centerMode: true,
  centerPadding: '6rem',
  slidesToShow: 2,
  autoplay: true,
  autoplaySpeed: 2000,
  speed: 600,
  arrows: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '4rem',
        slidesToShow: 3,
        autoplay: true
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '4rem',
        slidesToShow: 1,
        autoplay: true
      }
    }
  ]
});
});
}
// Functions Operate Key ------------------------------ //
menuboxDropdown__init();
menuitemDropdown__init();
translateboxDropdown__init();
swiperCustom__init();
headerChangeOnSection__init();
bottomSelectboxDropUp__init();
scrollTrigger__init();
scrollLeins__init();
headerHide__init();
marqueeSlide__init();
slickSlider__init();

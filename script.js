console.clear();
// menuboxDropdown ------------------------------ //
function menuboxDropdown__init() {
  $("header > .hd-container > .menu-box").mouseenter(function () {
    $(this).find("> ul > .bg-container").stop(true, true).slideDown(300);
  });
  $("header > .hd-container > .menu-box").mouseleave(function () {
    $(this).find("> ul > .bg-container").stop(true, true).slideUp(300);
  });
};
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
};
// translateboxDropdown ------------------------------ //
function translateboxDropdown__init() {
  $("header > .hd-container > .side-box > .language-box > .translate-box-1").click(function() {
    $(this).parent().find("> .translate-box-2").toggleClass("drop");
    $(this).find("> a > img").toggleClass("rotate");
  });

  $("header > .hd-container > .side-box > .language-box > .translate-box-2 > a > .languages-wrapper > span").mouseenter(function() {
    $(this).addClass("hover");
  });

  $("header > .hd-container > .side-box > .language-box > .translate-box-2 > a > .languages-wrapper > span").mouseleave(function() {
    $(this).removeClass("hover");
  });

  $("header > .hd-container > .side-box > .language-box > .translate-box-2").click(function() {
    $(this).removeClass("drop")
    $(this).parent().find("> .translate-box-1 > a > img").toggleClass("rotate");
  });

  $(document).click(function(e) {
  const $dropdown = $("header > .hd-container > .side-box > .language-box > .translate-box-2");
  const $button = $("header > .hd-container > .side-box > .language-box > .translate-box-1");

  if (!$button.is(e.target) && $button.has(e.target).length === 0 &&
      !$dropdown.is(e.target) && $dropdown.has(e.target).length === 0) {
    $dropdown.removeClass("drop");
    $button.find("> a > img").removeClass("rotate");
  }
});
};
// swiperCustom ------------------------------ //
function swiperCustom__init() {
const mySwiper = new Swiper(".mySwiper", {
  loop: true,
  speed: 600,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false
  }
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
})
};
// headerChangeOnSection ------------------------------ //
function headerChangeOnSection__init() {
  const header = document.querySelector("header");
  const section5 = document.querySelector(".sec-5");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        header.classList.add("on-sec-5");
      } else {
        header.classList.remove("on-sec-5");
      }
    });
  }, {
    threshold: 0.3
  });
  observer.observe(section5);
};
// headerChangeOnSection ------------------------------ //
function bottomSelectboxDropUp__init() {
  $("footer > .btn-wrap > .btn").click(function() {
    $(this).find("> ul").toggleClass("bottomDropUp");
    $(this).find("> .title > a").toggleClass("rotateReverse");
  });
};

// Functions Operate Key ------------------------------ //
menuboxDropdown__init();
menuitemDropdown__init();
translateboxDropdown__init();
swiperCustom__init();
headerChangeOnSection__init();
bottomSelectboxDropUp__init();

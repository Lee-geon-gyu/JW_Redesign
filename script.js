console.clear();

function menuboxDropdown__init() {
  $("header > .hd-container > .menu-box").mouseenter(function () {
    $(this).find("> ul > .bg-container").stop(true, true).slideDown(300);
  });
  $("header > .hd-container > .menu-box").mouseleave(function () {
    $(this).find("> ul > .bg-container").stop(true, true).slideUp(300);
  });
}

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

// let section4offset = $(".sec-4").offset().top;
// function headerColor() {
//   let scrollPosition = $(window).scrollTop();
//   if (scrollPosition >= section4offset) {
//     $("header").addClass("invert-color");
//   } else {
//     $("header").removeClass("invert-color");
//   }
// }
// let lastScrollPosition = 0;
// function headerVisibility() {
//   let currentScrollPosition = $(window).scrollTop();
//   if (currentScrollPosition >= lastScrollPosition) {
//     $("header").slideUp(300);
//   } else {
//     $("header").slideDown(300);
//   }
//   lastScrollPosition = currentScrollPosition;
// }
// $(window).scroll(headerColor);
// $(window).scroll(headerVisibility);

// let resizeTimer;
// $(window).resize(function () {
//   clearTimeout(resizeTimer);
//   resizeTimer = setTimeout(function () {
//     section4offset = $(".sec-4").offset().top;
//     headerColor();
//   }, 200);
// });

var swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

menuboxDropdown__init();
menuitemDropdown__init();

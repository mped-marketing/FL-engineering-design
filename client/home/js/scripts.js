(function ($) {
  const $window = $(window);

    // Preloader

setTimeout(function(){     $('.loader').fadeOut();
    $('.loader-mask').fadeOut('slow');

    $window.trigger('resize'); }, 2000);


  // Init
  // initMasonry();
  initSlickSlider();
  navigator.serviceWorker.getRegistrations().then(

    function(registrations) {

        for(let registration of registrations) {  
            registration.unregister();

        }

});

  $window.resize(() => {
    stickyNavRemove();
    hideSidenav();
  });


  /* Detect Browser Size
  -------------------------------------------------------*/
  let minWidth;
  if (Modernizr.mq('(min-width: 0px)')) {
    // Browsers that support media queries
    minWidth = function (width) {
      return Modernizr.mq(`(min-width: ${width}px)`);
    };
  } else {
    // Fallback for browsers that does not support media queries
    minWidth = function (width) {
      return $window.width() >= width;
    };
  }

  /* Mobile Detect
  -------------------------------------------------------*/
  if (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent || navigator.vendor || window.opera)) {
    $('html').addClass('mobile');
  } else {
    $('html').removeClass('mobile');
  }

  /* IE Detect
  -------------------------------------------------------*/
  if (Function('/*@cc_on return document.documentMode===10@*/')()) { $('html').addClass('ie'); }


  /* Sticky Navigation
  -------------------------------------------------------*/
  $window.scroll(() => {
    scrollToTop();

    const $navSticky = $('.nav--sticky');

    if ($window.scrollTop() > 150 & minWidth(992)) {
      $navSticky.addClass('sticky');
    } else {
      $navSticky.removeClass('sticky');
    }

    if ($window.scrollTop() > 160 & minWidth(992)) {
      $navSticky.addClass('offset');
    } else {
      $navSticky.removeClass('offset');
    }

    if ($window.scrollTop() > 200 & minWidth(992)) {
      $navSticky.addClass('scrolling');
    } else {
      $navSticky.removeClass('scrolling');
    }
  });


  function stickyNavRemove() {
    if (!minWidth(992)) {
      $('.nav--sticky').removeClass('sticky offset scrolling');
    }

    if (minWidth(992)) {
      $('.nav__dropdown-menu').css('display', '');
    }
  }


  /* Mobile Navigation
  -------------------------------------------------------*/
  const $navDropdown = $('.nav__dropdown');

  $('.nav__dropdown-trigger').on('click', function () {
    const $this = $(this);
    $this.next($('.nav__dropdown-menu')).slideToggle();
    $this.attr('aria-expanded', (index, attr) => (attr == 'true' ? 'false' : 'true'));
  });

  if ($('html').hasClass('mobile')) {
    $('body').on('click', () => {
      $('.nav__dropdown-menu').addClass('hide-dropdown');
    });

    $navDropdown.on('click', '> a', (e) => {
      e.preventDefault();
    });

    $navDropdown.on('click', (e) => {
      e.stopPropagation();
      $('.nav__dropdown-menu').removeClass('hide-dropdown');
    });
  }


  /* Sidenav Navigation
  -------------------------------------------------------*/
  const $sidenav = $('#sidenav');
  const $navIconToggle = $('.nav-icon-toggle');
  const $contentOverlay = $('.content-overlay');
  const $sidenavCloseButton = $('#sidenav__close-button');

  $navIconToggle.on('click', function (e) {
    e.stopPropagation();
    $(this).toggleClass('nav-icon-toggle--is-open');
    $sidenav.toggleClass('sidenav--is-open');
    $contentOverlay.toggleClass('content-overlay--is-visible');
  });

  function resetNav() {
    $navIconToggle.removeClass('nav-icon-toggle--is-open');
    $sidenav.removeClass('sidenav--is-open');
    $contentOverlay.removeClass('content-overlay--is-visible');
  }

  function hideSidenav() {
    if (minWidth(992)) {
      resetNav();
    }
  }

  $contentOverlay.on('click', () => {
    resetNav();
  });

  $sidenavCloseButton.on('click', () => {
    resetNav();
  });


  /* Nav Search
  -------------------------------------------------------*/
  (function () {
    const $navSearchForm = $('.nav__search-form');
    const $navSearchTrigger = $('#nav__search-trigger');
    const $navSearchInput = $('#nav__search-input');
    const $navSearchClose = $('#nav__search-close');

    $navSearchTrigger.on('click', (e) => {
      e.preventDefault();
      $navSearchForm.animate({ opacity: 'toggle' }, 500);
      $navSearchInput.focus();
    });

    $navSearchClose.on('click', (e) => {
      e.preventDefault();
      $navSearchForm.animate({ opacity: 'toggle' }, 500);
    });

    function closeSearch() {
      $navSearchForm.fadeOut(200);
    }

    $(document.body).on('click', (e) => {
      closeSearch();
    });

    $navSearchInput.add($navSearchTrigger).on('click', (e) => {
      e.stopPropagation();
    });
  }());


  /* Masonry
  -------------------------------------------------------*/

  /* Material Inputs
  -------------------------------------------------------*/
  (function () {
    const $input = $('.material__input');
    $input.on('blur', function () {
      if ($(this).val()) {
        $(this).parent('.material__form-group').addClass('material__form-group--active');
      } else {
        $(this).parent('.material__form-group').removeClass('material__form-group--active');
      }
    });
  }());


  /* Slick Slider
  -------------------------------------------------------*/
  function initSlickSlider() {
    // Testimonials

    // Single Project
    $('.slick-single-image').slick({
      slidesToShow: 1,
      dots: true,
    });

    // Team
  }


  /* Accordion
  -------------------------------------------------------*/
  const $accordion = $('.accordion');
  function toggleChevron(e) {
    $(e.target)
      .prev('.accordion__heading')
      .find('a')
      .toggleClass('accordion--is-open accordion--is-closed');
  }
  $accordion.on('hide.bs.collapse', toggleChevron);
  $accordion.on('show.bs.collapse', toggleChevron);


  /* Tabs
  -------------------------------------------------------*/
  $('.tabs__trigger').on('click', function (e) {
    const currentAttrValue = $(this).attr('href');
    $(`.tabs__content-trigger ${currentAttrValue}`).stop().fadeIn(1000).siblings()
      .hide();
    $(this).parent('li').addClass('tabs__item--active').siblings()
      .removeClass('tabs__item--active');
    e.preventDefault();
  });


  /* Sticky Socials
  -------------------------------------------------------*/
  (function () {
    const $stickyCol = $('.sticky-col');
    if ($stickyCol) {
      $stickyCol.stick_in_parent({
        offset_top: 100,
      });
    }
  }());


  /* Scroll to Top
  -------------------------------------------------------*/
  function scrollToTop() {
    const scroll = $window.scrollTop();
    const $backToTop = $('#back-to-top');
    if (scroll >= 50) {
      $backToTop.addClass('show');
    } else {
      $backToTop.removeClass('show');
    }
  }

  $('a[href="#top"]').on('click', () => {
    $('html, body').animate({ scrollTop: 0 }, 1350, 'easeInOutQuint');
    return false;
  });
}(jQuery));

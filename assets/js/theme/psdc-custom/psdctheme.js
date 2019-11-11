/*eslint-disable*/
import superfish from 'superfish/src/js/superfish';
import Instafeed from 'instafeed.js/instafeed.min';
import treeviewjs from 'treemenu.js/treemenu.js';
import Cookies from 'js-cookie/src/js.cookie';
import '@fancyapps/fancybox/dist/jquery.fancybox.min';
import '@fancyapps/fancybox/dist/jquery.fancybox.min.css';
$.fancybox.defaults.hash = false;


export default function () {

  function responsiveView() {
    if ($(window).width() < 1024 && !$('body').hasClass('lt-1024')) {
      $('body').removeClass('gt-1024');
      $('body').addClass('lt-1024');
      $('.header').removeClass('stuck');
      $('.body').removeClass('body-stuck').css('margin-top', '0px');
    } else if ($(window).width() > 1023 && !$('body').hasClass('gt-1024')) {
      $('body').removeClass('lt-1024');
      $('body').addClass('gt-1024');
    } else {
    }

    if (jQuery(window).width() <= 767 && !jQuery("body").hasClass('lt-767')) {
      jQuery("body").addClass('lt-767');
      jQuery("body").removeClass('gt-767');
      $('.footer-toggle-content').hide();
      $('.footer-navigation-block .footer-toggle-title').removeClass('active');
    } else if (jQuery(window).width() > 767 && !jQuery("body").hasClass('gt-767')) {
      jQuery("body").addClass('gt-767');
      jQuery("body").removeClass('lt-767');
      $('.footer-toggle-content').show();
      $('.footer-navigation-block .footer-toggle-title').removeClass('active');
    }
  }

  function maketreeview() {
    /* treeview accordion toggle menu */
    jQuery('.navList-treeview').not('.navList-treeview.treeview').treeview({
      collapsed: true,
      animated: "medium"
    });
  }

  (function () {
    var send = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function () {
      this.addEventListener('load', function () {
        maketreeview();
        product_view();
      });
      return send.apply(this, arguments)
    }
  })();



  /* PRODUCT VIEW ON LOAD START */
  function product_view() {
    let view_val = Cookies.get('product-view');
    if (view_val !== undefined) {
      if (view_val === 'product-grid-view') {
        jQuery('.product-view-btn.list-view').removeClass('active');
        jQuery('.product-view-btn.grid-view').addClass('active');
        jQuery('.product-view-mode .productGrid').removeClass('product-list-view');
        jQuery('.product-view-mode .productGrid').addClass('product-grid-view product-grid-view');
      } else {
        jQuery('.product-view-btn.grid-view').removeClass('active');
        jQuery('.product-view-btn.list-view').addClass('active');
        jQuery('.product-view-mode .productGrid').removeClass('product-grid-view');
        jQuery('.product-view-mode .productGrid').addClass('product-list-view product-list-style');
      }
    } else {

      jQuery('.product-view-btn.list-view').removeClass('active');
      jQuery('.product-view-btn.grid-view').addClass('active');
      jQuery('.product-view-mode .productGrid').removeClass('product-list-view');
      jQuery('.product-view-mode .productGrid').addClass('product-grid-view product-grid-view');
    }
  }

  function mobilecurrancy() {
    if ($(window).width() <= 1365) {
      if(!$('.mobile-currancy').hasClass('header-currancy')){
        $('.mobile-currancy').append($('.header-main .header-currancy'))
      }
      $('.mobile-currancy .header-currancy .navUser-section').removeClass('sf-menu sf-js-enabled sf-arrows');
    } else {

      if(!$('.header-main').hasClass('header-currancy')){
        $('.header-main').prepend($('.mobile-currancy .header-currancy'));
        $('.header-main .header-currancy .navUser-section').addClass('sf-menu sf-js-enabled sf-arrows');
      }

      $('.mobile-currancy .header-currancy').detach().prependTo('.header-main');
    }
  }

  // READY Start
  jQuery(document).ready(function () {

    mobilecurrancy();

    //submit search form
    $(document).on('click', '.quickSearchResults .view-all-btn a', function () {
      $(this).parent().parent().parent().find('form').submit();
    });

    // Sidebar toggle
    jQuery(".sidebarBlock .sidebarBlock-heading").click(function () {
      jQuery(this).parent().find(".navList").slideToggle();
      jQuery(this).toggleClass("active");
    });

    // Treeview Script Start
    maketreeview();
    // Treeview Script End
    $(".navUser-action--quickSearch").click(function () {
      $(this).toggleClass('search-open');
      $("body").toggleClass('search-box');
    });

    $('html,body').click(function (e) {
      if (!$(e.target).parents('.dropdown--quickSearch').length) {
        if ($("body.search-box").length) {
          $(".navUser-action--quickSearch").click();
          $('.dropdown--quickSearch.is-open').removeClass('is-open');
        }
      }
    });

    /* ============ FOOTER TOGGLE SCRIPT ============ */
    jQuery(document).on('click', '.footer-info-col .footer-toggle-title', function () {
      if (jQuery(window).width() <= 767) {
        jQuery(this).parent().find('.footer-toggle-content').slideToggle();
        jQuery(this).toggleClass('active');
      }
    });

    // Superfish Script Start
    let speed = 0;
    jQuery('.sf-menu').each(function () {
      if ($(this).attr('data-speed') != undefined && $(this).attr('data-speed') != '') {
        speed = parseFloat($(this).attr('data-speed'));
      }
      jQuery(this).superfish({
        delay: speed
      });
    });
    // Superfish Script End
    
    /* ============== sticky menu =============== */
    let headerHeight = $('header').height();
    let scrollElement = false;
    let hHeader = $('.header').innerHeight();
    let hInner = hHeader - 10;
    $(window).scroll(function () {
      if ($('[sticky="true"]').length && $(window).width() > 1023) {
        if (hHeader < $(window).scrollTop() && !scrollElement) {
          if ($('.header').length) {
            $('.header').addClass('stuck');
            $('.body').addClass('body-stuck').css('margin-top', headerHeight + 'px');
          }
          scrollElement = true;
        } else if (hInner > $(window).scrollTop() && scrollElement) {
          $('.header').removeClass('stuck');
          $('.body').removeClass('body-stuck').css('margin-top', '0px');
          scrollElement = false;
        }
      }
    });

    /*  Fancybox  */

    //Don't enable Cloud Zoom (product image zoom) on touch device
    //Mouseenter/Mouseover events are not ideal for touch devices
    //for more info search for this code in /script/main.js
    if (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)) {
      $('body').addClass('touch-device');
    }

    $(document).on('click', '.fancythumb-img', function (e) {
      e.preventDefault();
    });

    $('.productView-thumbnail-link').hover(function () {
      const imgurl = $(this).data('link');
      //console.log(imgurl.lastIndexOf('/'));
      $('.fancybox-hidden-img').removeClass('currentGalleryImage');
      $('.fancybox-hidden-img').each(function () {
        if ($(this).attr('href') == imgurl) {
          $(this).addClass('currentGalleryImage');
        }
      });
    });

    $('.productView-image-main').click(function() {
        $('.currentGalleryImage').trigger('click');
    });

    /*if(document.querySelectorAll('.fancythumb,.fancythumb img').length){
        document.querySelector('.fancythumb,.fancythumb img').addEventListener('touchstart', function (e) {
          e.preventDefault()
          $('ul.productView-thumbnails li a.is-active').attr('data-fancybox', 'gallery');
          $('ul.productView-thumbnails li a.is-active').attr('href', $('ul.productView-thumbnails li a.is-active').attr('data-fancybox-href'));
          $('ul.productView-thumbnails li a.is-active').trigger('click');
        });
      }
    
        $(document).on('click','.fancythumb,.fancythumb img,.easyzoom-flyout img',function (e) {
          e.preventDefault();
          $('ul.productView-thumbnails li a.is-active').attr('data-fancybox', 'gallery');
          $('ul.productView-thumbnails li a.is-active').attr('href', $('ul.productView-thumbnails li a.is-active').attr('data-fancybox-href'));
          $('ul.productView-thumbnails li a.is-active').trigger('click');
        });
    
        $('ul.productView-thumbnails li a').mouseenter(function () {
          $(this).removeAttr('data-fancybox');
          $(this).attr("href", "javascript:void(0)");
        });
        $('ul.productView-thumbnails li a').mouseleave(function () {
          $(this).attr('data-fancybox', 'gallery');
          $(this).attr("href", $(this).attr('data-fancybox-href'));
        }); */

    /* LIST AND GRID VIEW SCRIPT */
    $(document).on('click', '.product-view-button a', (e) => {
      $('.product-view-button a').removeClass('active');
      let currentTarget = $(e.currentTarget).data('view-val');
      $(e.currentTarget).addClass('active');
      switch (currentTarget) {
        case 'product-grid-view':
          $('.product-view-mode .productGrid').removeClass('product-list-style');
          $('.product-view-mode .productGrid').addClass(currentTarget);
          Cookies.set('product-view', currentTarget);
          break;
        case 'product-list-style':
          $('.product-view-mode .productGrid').removeClass('product-grid-view');
          $('.product-view-mode .productGrid').addClass(currentTarget);
          Cookies.set('product-view', currentTarget);
          break;
        default:
      }
    });
    product_view();
    /* LIST AND GRID VIEW SCRIPT ENd*/

    // mobile menu Script Start
    $('#headerSidebar .close-icon').click(function (e) {
      if ($('.headerSidebarOn').length) {
        $('#headerSidebar').removeClass('headerSidebarOn');
        $('body').removeClass('header-sidebar-open');
      }
    });

    $('html,body').click(function (e) {
      if (!$(e.target).hasClass("headerSidebarOn") && ($(e.target).hasClass("headerSidebarOn") || !$(e.target).parents('.headerSidebarOn').length)) {
        if ($('.headerSidebarOn').length) {
          $('#headerSidebar').removeClass('headerSidebarOn');
        }
      }

    });
    $('.control-otherlinks').click(function (event) {
      event.preventDefault();
      setTimeout(function () {
        if ($('.headerSidebarOn').length) {
          $('#headerSidebar').removeClass('headerSidebarOn');
        } else {
          $('#headerSidebar').addClass('headerSidebarOn');
          $('body').addClass('header-sidebar-open');
        }
      }, 5);
    });

    // mobile menu Script End


    // Instafeed Script Start

    var feed = new Instafeed({
      get: 'user',
      limit: '6',
      userId: jQuery("#instafeed").attr("data-id"),
      accessToken: jQuery("#instafeed").attr("data-key"),
      resolution: "low_resolution",
      template: '<li class="insta-item-wrap {{orientation}}"><div class="insta-item"><a class="animation" href="{{link}}" target="_blank"><img src="{{image}}" /></a></div></li>',
      after: function () {
        jQuery('#instafeed').slick({
          dots: false,
          infinite: true,
          slidesToShow: 6,
          arrows: false,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 4000,
          responsive: [
            {
              breakpoint: 1901,
              settings: {
                slidesToShow: 6,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 1651,
              settings: {
                slidesToShow: 6,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 1441,
              settings: {
                slidesToShow: 6,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 1025,
              settings: {
                slidesToShow: 5,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 769,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                centerMode: true,
                centerPadding: '80px'
              }
            },
            {
              breakpoint: 569,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                centerMode: true,
                centerPadding: '80px'
              }
            },
            {
              breakpoint: 481,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true,
                variableWidth: true
              }
            },
            {
              breakpoint: 321,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true,
                variableWidth: true
              }
            }
          ]
        });
      }
    });
    if (jQuery("#instafeed").length && jQuery("#instafeed").attr("data-id") != "" && jQuery("#instafeed").attr("data-key") != "") {
      feed.run();
    }
    // Instafeed Script End

    // disable 0 value in qty input field
    $(document).on('keyup', '.productView .form-input--incrementTotal', function () {
      if (parseInt($(this).val()) < 1 || $(this).val() == '') {
        if ($(this).attr('data-quantity-min') != '0') {
          $(this).val($(this).attr('data-quantity-min'));
        } else {
          $(this).val(1);
        }
      }
    });

  });
  // READY End

  let windowWidth = $(window).width();

  jQuery(window).resize(function () {
    if ($(window).width() != windowWidth) {
      // Update the window width for next time
      windowWidth = $(window).width();
      responsiveView();
    }

    mobilecurrancy();

  });

  //ajaxComplete start
  $(document).ajaxStop(function () {

    product_view();
  });
  //ajaxComplete END

}
/*eslint-enable*/

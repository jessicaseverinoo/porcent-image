function setupStickyHeader() {

  const targetSelector = '.js-header-sticky-target';
  const target = $(targetSelector);

  if (!target.length) {

    console.error(
        `Adicione a classe ${ targetSelector } para ativar o hide menu`);
    return;
  }

  let lastScrollOffset = 0;
  let scrollCurrentPosition = 0;
  let isScrollPositionBeforeTarget = true;
  let isScrollPositionAfterTarget = false;
  let isStickyMenu = false;
  let isScrollingUp = false;
  let isScrollingDown = false;
  const $header = $('.header');
  const targetTopOffset = target
      .offset().top;
  const stickyMenuClass = 'header-sticky';

  function showHeader() {

    $header.fadeIn({ duration: 350 });
  }

  function hideHeader() {

    $header.fadeOut({ duration: 350 });
  }

  function setStaticHeader() {

    $header.removeClass(stickyMenuClass);
    $header.css('display', '');
  }

  function updateLastCurrentPosition(scrollPosition) {

    lastScrollOffset = scrollPosition;
  }

  function headerToggle(scrollOffset) {

    updateLastCurrentPosition(scrollOffset);

    if (!isScrollPositionAfterTarget) {

      setStaticHeader();
    }

    if (isScrollPositionAfterTarget && !isStickyMenu) {

      $header.addClass(stickyMenuClass);

      if (isScrollingUp) {

        showHeader();
      }
      return;
    }

    if (isStickyMenu && isScrollingUp) {

      showHeader();
      return;
    }

    if (isStickyMenu && isScrollingDown) {

      hideHeader();
    }
  }

  function stickyHeaderManager() {

    scrollCurrentPosition = $(this)
        .scrollTop();

    isScrollPositionBeforeTarget = scrollCurrentPosition < targetTopOffset;
    isScrollPositionAfterTarget = scrollCurrentPosition > targetTopOffset;
    isStickyMenu = $header.hasClass(stickyMenuClass);
    isScrollingUp = scrollCurrentPosition < lastScrollOffset;
    isScrollingDown = scrollCurrentPosition > lastScrollOffset;

    if (isScrollPositionBeforeTarget && $header.hasClass(stickyMenuClass)) {

      setStaticHeader();
    }
  }

  window.addEventListener('scroll', stickyHeaderManager);

  window.addEventListener('scroll', throttle(function () {

    if (isScrollPositionBeforeTarget) {

      setStaticHeader();
      updateLastCurrentPosition(scrollCurrentPosition);
      return;
    }

    headerToggle(scrollCurrentPosition);
  }, 300));
}

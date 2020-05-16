function setupServiceWorker() {

  if (!('serviceWorker' in navigator)) {

    return;
  }

  window.addEventListener('load', function () {

    if (navigator.onLine) {

      return;
    }

    $('<style type=\'text/css\'>' +
        ' .is-online { display: none } ' +
        ' .is-offline { display: block } ' +
        '</style>')
        .appendTo('head');
  });

  if (navigator.serviceWorker.controller) {

    console.log(
        '[PWA Builder] active service worker found, no need to register');
    return;
  }

  // Register the ServiceWorker
  navigator.serviceWorker
           .register('/sw.js')
           .then(function (reg) {
             console.log('Service worker has been registered for scope: ' + reg.scope);
           })
           .catch(function (err) {
             console.log('ServiceWorker registration failed: ', err);
           });
}

function preventInvalidFormSubmit() {

  var forms = document.getElementsByClassName('needs-validation');
  var validation = Array.prototype.filter.call(forms, function (form) {
    form.addEventListener('submit', function (event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  $('.is-invalid')
      .each(function () {
        $(this)[0].setCustomValidity('needs validate');
      })
      .on('focusout', function () {
        $(this)
            .removeClass('is-invalid');
        $(this)[0].setCustomValidity('');
      });
}

function verifyUserAgent() {

  var OSNome = "";
  if (window.navigator.userAgent.indexOf("Windows NT 10.0")!== -1) OSNome="Windows 10";
  if (window.navigator.userAgent.indexOf("Windows NT 6.2") !== -1) OSNome="Windows 8";
  if (window.navigator.userAgent.indexOf("Windows NT 6.1") !== -1) OSNome="Windows 7";
  if (window.navigator.userAgent.indexOf("Windows NT 6.0") !== -1) OSNome="Windows Vista";
  if (window.navigator.userAgent.indexOf("Windows NT 5.1") !== -1) OSNome="Windows XP";
  if (window.navigator.userAgent.indexOf("Windows NT 5.0") !== -1) OSNome="Windows 2000";
  if (window.navigator.userAgent.indexOf("Mac")            !== -1) OSNome="Mac/iOS";
  if (window.navigator.userAgent.indexOf("X11")            !== -1) OSNome="UNIX";
  if (window.navigator.userAgent.indexOf("Linux")          !== -1) OSNome="Linux";

  if (OSNome !== "Mac/iOS") {
    let body = document.querySelector('body');
    body.classList.add("style-scroll");
  }
}

function setupSmoothScroll() {

  // Smooth page scroll
  $('a.js-scroll-top')
      .on('click', function (event) {

        // e.g. <a href="#text">
        // 'this' is the element -> a
        // 'hash' is the text (element) after # symbol from href -> #text

        // Prevent default anchor click behavior
        event.preventDefault();

        var additionalOffset = this.getAttribute('data-scroll-offset') || 0;

        $('html, body')
            .animate({
              scrollTop: $(this.hash)
                  .offset().top + Number(additionalOffset),
            }, 1000);
      });
}

function onChangeSelectLink() {

  // Switch page action when links are in a select
  // e.g. to do in html
  // <select class="form-control js-onchange">
  //   <option value=""
  //     selected>Link
  //   </option>
  //   <option class="" value="/html/index">Home</option>
  //   <option class="" value="/html/faq">FAQ</option>
  //</select>

  $('.js-onchange')
      .change(function () {

        window.location = $(this)
            .val();
      });
}

function setupLazyMap() {

  // lazy load do mapa
  // Chame o iframe do mapa com src vazio e o valor do src em data-lazy-map
  // ex. <iframe src="" data-lazy-map="https://www.google.com/maps..."...
  if ($('iframe[data-lazy-map]').length) {
    $(window)
        .scroll(function () {
          var windowElement = $(window);
          var mapElement = $('iframe[data-lazy-map]');
          // console.log($(window).height());
          // console.log($(window).scrollTop());
          // console.log($('iframe.lazy-map').offset().top);

          //somando o local que estamos com a altura da tela e verifica se chegamos no local do mapa
          if ((windowElement.height() + windowElement.scrollTop()) >= mapElement.offset().top) {
            if (mapElement.attr('src') === '') {
              mapElement.attr('src', mapElement.attr('data-lazy-map'));
            }
          }
        })
        .trigger('scroll');
  }
}

function setupSelect2() {

  $('select.js-select2')
      .select2({
        theme: 'bootstrap',
        language: 'pt-BR',
      });
}

function setupInputMasks() {

  if ($.mask) {
    $('.mask-phone')
        .focusout(function () {

          var phone, element;

          element = $(this);
          element.unmask();
          phone = element.val()
                         .replace(/\D/g, '');
          if (phone.length > 10) {

            element.mask('(99) 99999-999?9');
          } else {

            element.mask('(99) 9999-9999?9');
          }
        })
        .trigger('focusout');

    //http://alexjunioralves.blogspot.com.br/2013/08/mascara-cpfcnpj-para-o-mesmo-campo.html
    $('.mask-cpfcnpj')
        .on('keyup', function () {

          var element = $(this);
          var cpfcnpj = element.val()
                               .replace(/\D/g, '');

          if ((cpfcnpj.length === 11) || (cpfcnpj.length === 0)) {

            element.mask('999.999.999-99?99999');
          }

          if (cpfcnpj.length >= 14) {

            element.mask('99.999.999/9999-99');
          }
        })
        .trigger('keyup');

    $('.mask-date')
        .mask('99/99/9999');
    $('.mask-zipcode')
        .mask('99999-999');
    $('.mask-cpf')
        .mask('999.999.999-99');
    $('.mask-cnpj')
        .mask('99.999.999/9999-99');
    $('.mask-hour')
        .mask('99:99');
    $('.mask-plate')
        .mask('aaa-9999');
  }

  $('.mask-money')
      .maskMoney({
        prefix: 'R$ ',
        allowNegative: false,
        decimal: ',',
        thousands: '.',
        affixesStay: false,
      });

  $('.mask-size')
      .maskMoney({
        prefix: '',
        decimal: '',
        thousands: '.',
        affixesStay: false,
        precision: 0,
      });

  $('.mask-integer')
      .maskMoney({
        prefix: '',
        decimal: '',
        thousands: '',
        affixesStay: false,
        precision: 0,
      });

  $('.mask-float')
      .maskMoney({
        prefix: '',
        decimal: ',',
        thousands: '',
        affixesStay: false,
        precision: 2,
      });
}

function setupCepSearch() {

  $('#zipcode')
      .on('blur', function () {

        var $this = $(this);
        var cep = $this.val()
                       .replace('-', '');

        if (cep.length === 8) {
          $.getJSON('https://api.mixd.com.br/cep/' + cep, {},
              function (result) {

                if (!result) {

                  console.log(result.message || 'Houve um erro desconhecido');
                  return;
                }

                var stateInput = $('#state');
                var cityInput = $('#city');

                $('#neighborhood')
                    .val(result.bairro);
                $('#address')
                    .val(result.logradouro);

                // se for input
                if (stateInput.is('input')) {

                  stateInput.val(result.uf_nome);
                }

                if (cityInput.is('input')) {

                  cityInput.val(result.cidade);
                }
              },
          );
        }
      });
}

function setupPopover() {

  $('[data-toggle="popover"]')
      .popover();
}

function setupTooltip() {

  $('[data-toggle="tooltip"]')
      .tooltip();
}

function setupAnchorReloadPrevention() {

  $('a[href="#"]')
      .click(function (e) {

        e.preventDefault();
      });
}

function setupInfiniteScroll() {

  $(window)
      .cleverInfiniteScroll({
        contentsWrapperSelector: '.infinite-scroll',
        contentSelector: '.infinite-scroll-content',
        nextSelector: 'a[rel~="next"]',
        loadImage: '/images/loading.gif',
      });
}

function setupShareWindow() {

  $('.share')
      .click(function (e) {
        e.preventDefault();
        window.open(
            $(this)
                .attr('href'),
            'shareWindow', 'height=450, width=550, top=' + ($(window)
            .height() / 2 - 275) + ', left=' + ($(window)
            .width() / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0',
        );
        return false;
      });
}

function setupCustomFileInput() {

  $('.custom-file-input')
      .on('change', function () {
        var fileName = $(this)
            .val();
        $(this)
            .next('.custom-file-label')
            .addClass('selected')
            .html(fileName.replace(/^.*[\\\/]/, ''));
      });
}

$(function () {

  setupServiceWorker();

  preventInvalidFormSubmit();

  verifyUserAgent();

  // setupSmoothScroll();

  // onChangeSelectLink();

  // setupLazyMap();

  // setupSelect2();

  // setupInputMasks();

  // setupCepSearch();

  // setupPopover();

  // setupTooltip();

  // setupAnchorReloadPrevention();

  // setupInfiniteScroll();

  // setupShareWindow();

  // setupCustomFileInput();

  // setupCustomFormFieldsVisibility();
});

window.addEventListener('load', function () {

  /**
   * We need the starting function here because vh/vw are calculated after all
   * resources loaded, which is different from DOM ready event
   * */
  setupStickyHeader();
});

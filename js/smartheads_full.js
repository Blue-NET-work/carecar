var timeout;
var animate1 = new Array();
var animate2 = new Array();
var carousel_global;

$(document).ready(function() {
    var wh = $(window).height();
    var gh = $(document).outerHeight();

    if (gh > wh) {
        $('#BACKGROUND').css({ height: gh - 205 });
    }

    var inpt = $("input:text, textarea");
    inpt.each(function() {
        if (this.value == '')
            this.value = this.title;
    }).focus(function() {
        if (this.value == this.title)
            this.value = '';
    }).blur(function() {
        if (this.value == '')
            this.value = this.title;
    });

    $('#fade').cycle({
        fx: 'fade',
        speed: 2500,
        timeout: 1000
    });

    $(document).on("click", "#CONTAINER .box_aktualnosci .plus_small", function() {
        $('#CONTAINER .box_aktualnosci .akt_el_more_txt').slideUp('slow');
        $(this).parent().prev().slideDown('slow');
        $('#CONTAINER .box_aktualnosci .minus_small').addClass('plus_small').removeClass('minus_small');
        $(this).addClass('minus_small').removeClass('plus_small');
    });

    $(document).on("click", "#CONTAINER .box_aktualnosci .minus_small", function() {
        $('#CONTAINER .box_aktualnosci .akt_el_more_txt').slideUp('slow');
        $(this).addClass('plus_small').removeClass('minus_small');
    });

    function isFloat(n) {
        return ((typeof n === 'number') && (n % 1 !== 0));
    }

    function smartheads_initPadding() {
        var calc = ($('#SLIDER').width() - 960) / 2;
        var pl = 0;
        if (isFloat(calc)) {
            pl = Math.ceil(calc);
        } else {
            pl = calc;
        }
        var mr = 1394 - 960 - pl - pl;

        $('.sl_txt .stxt').css({
            'padding-left': pl + 'px',
            'padding-right': pl + 'px',
            'margin-right': mr + 'px'
        });

        $('.slider_push').css({
            'padding-left': pl + 'px'
        });
    }

    function smartheads_initResize() {
        var width = $(window).width();
        if (width >= 960) {
            $('body').removeClass('small');

            if (width < 1394) {
                $('#SLIDER').css({
                    'width': width + 'px'
                });
            } else {
                $('#SLIDER').css({
                    'width': '1394px'
                });
            }
        } else {
            $('body').addClass('small');
            $('#SLIDER').css({
                'width': '960px'
            });
        }

        smartheads_initPadding();
    }

    function smartheads_initAutoPlay() {
        clearTimeout(timeout);

        timeout = setTimeout(function() {
            var items = $('.jcarousel-container-horizontal li').size();
            var current = $('#nav-shadow li a.active').parent().attr('jcarouselindex');
            if (current == carousel_global.last) {
                carousel_global.next();
            }

            var previous = current;

            current++;
            if (current > items) {
                current = 1;
            }

            smartheads_initSlide(current, previous, 'auto');
        }, 8000);
    }

    function smartheads_moveBlocks(current, previous, event) {
        var items = $('.jcarousel-container-horizontal li').size();
        var width = 0;
        var speed = 500;
        var type = 'ltr';

        $('#nav-shadow li a.active').removeClass('active');
        $('#nav-shadow li.jcarousel-item-' + current + ' a').addClass('active');

        if (current > previous) {
            type = 'ltr';
        } else {
            type = 'rtl';
        }
        if (previous == 1 && current == items) {
            type = 'rtl';
        }
        if (previous == items && current == 1) {
            type = 'ltr';
        }
        if (event == 'click' && (previous == 1 && current == items)) {
            type = 'ltr';
        }
        if (event == 'click' && (previous == items && current == 1)) {
            type = 'rtl';
        }

        if (type == 'ltr') {
            width = '-1394';
            $('#SLIDER .sl_bg .s' + current).insertAfter('#SLIDER .sl_bg .s' + previous);
            $('#SLIDER .sl_bg .s' + current).css({'display': 'block'});
            $('#SLIDER .sl_txt .stxt.s' + current).insertAfter('#SLIDER .sl_txt .stxt.s' + previous);
            $('#SLIDER .sl_txt .stxt.s' + current).css({'display': 'block'});
        } else {
            width = 1394;
            width2 = '-1394';
            $('#SLIDER .sl_bg .s' + current).css({'display': 'block', 'margin-left': width2 + 'px'});
            $('#SLIDER .sl_bg .s' + current).insertBefore('#SLIDER .sl_bg .s' + previous);
            $('#SLIDER .sl_txt .stxt.s' + current).insertBefore('#SLIDER .sl_txt .stxt.s' + previous);
            $('#SLIDER .sl_txt .stxt.s' + current).css({'display': 'block', 'margin-left': width2 + 'px'});
        }

        animate1[previous] = $('#SLIDER .sl_bg .s' + previous).animate({
            'margin-left': width
        }, speed, function() {
            $(this).css({
                'display': 'none',
                'margin-left': 0
            })
        });

        animate2[previous] = $('#SLIDER .sl_txt .stxt.s' + previous).animate({
            'margin-left': width
        }, speed, function() {
            $(this).css({
                'display': 'none',
                'margin-left': 0
            })
        });

        if (type == 'rtl') {
            $('#SLIDER .sl_bg .s' + current).animate({
                'margin-left': 0
            }, (speed - 100));

            $('#SLIDER .sl_txt .stxt.s' + current).animate({
                'margin-left': 0
            }, (speed - 100));
        }

        smartheads_initAutoPlay();
    }

    function smartheads_initSlide(current, previous, event) {
        clearTimeout(timeout);

        if ($('#SLIDER .sl_bg .s' + current).css('margin-left') != 0) {
            if (animate1) {
                if (animate1[current]) {
                    animate1[current].stop();
                }
            }
            if (animate2) {
                if (animate2[current]) {
                    animate2[current].stop();
                }
            }
            $('#SLIDER .sl_bg .s' + current).css({'display': 'none', 'margin-left': 0});
            $('#SLIDER .sl_txt .stxt.s' + current).css({'display': 'none', 'margin-left': 0});

            smartheads_moveBlocks(current, previous, event);
        } else {
            smartheads_moveBlocks(current, previous, event);
        }
    }

    function smartheads_initCallback(carousel) {
        carousel_global = carousel;
        var items = $('.jcarousel-container-horizontal li').size();

        smartheads_initPadding();

        $('.jcarousel-container-horizontal').append('<div class="jcarousel-next-horizontal"></div><div class="jcarousel-prev-horizontal"></div>');
        var a = $('.jcarousel-container-horizontal li').first().find('a');
        var cls = a.attr('class');
        a.addClass('active');

        $('.sl_bg .' + cls).css({
            'display': 'block'
        });
        $('.sl_txt .stxt.' + cls).css({
            'display': 'block'
        });

        $('.jcarousel-next-horizontal').bind('click', function() {
            var current = $('#nav-shadow li a.active').parent().attr('jcarouselindex');
            if (current == carousel.last) {
                carousel.next();
            }

            var previous = current;

            current++;
            if (current > items) {
                current = 1;
            }

            smartheads_initSlide(current, previous, 'carousel');

            return false;
        });

        $('.jcarousel-prev-horizontal').bind('click', function() {
            var current = $('#nav-shadow li a.active').parent().attr('jcarouselindex');
            if (current == carousel.first) {
                carousel.prev();
            }

            var previous = current;

            current--;
            if (current == 0) {
                current = items;
            }

            smartheads_initSlide(current, previous, 'carousel');

            return false;
        });
    }

    var carousel = $('#nav-shadow').jcarousel({
        scroll: 1,
        wrap: 'both',
        buttonNextHTML: null,
        buttonPrevHTML: null,
        initCallback: smartheads_initCallback
    });

    /*
    $(window).on('resize.body', function() {
        smartheads_initResize();
    });
    */

    $('.slider_push a').on('click', function() {
        var previous = $('#nav-shadow li a.active').parent().attr('jcarouselindex');
        var current = $(this).parent().attr('jcarouselindex');

        if (previous != current) {
            smartheads_initSlide(current, previous, 'click');
        }

        return false;
    });

    //smartheads_initResize();
    smartheads_initAutoPlay();
});

function submitForm() {
    var data = '';
    var error = 0;

    $('#smartForm input, #smartForm textarea').removeClass('error');
    $('#errored').hide();
    $('#required').show();

    $('#smartForm input').each(function(i) {
        if ($(this).val() != $(this).attr('title') && $(this).attr('type') != 'submit') {
            data += ((i == 0) ? '' : '&') + $(this).attr('name') + '=' + $(this).val();
        } else {
            if ($(this).attr('req') == 1) {
                $(this).addClass('error');
                error++;
            }
        }
    });

    $('#smartForm textarea').each(function(i) {
        if ($(this).val() != $(this).attr('title')) {
            data += '&' + $(this).attr('name') + '=' + $(this).val();
        } else {
            if ($(this).attr('req') == 1) {
                $(this).addClass('error');
                error++;
            }
        }
    });

    if (error > 0) {
        $('#errored').show();
        $('#required').hide();
        $('#cboxLoadedContent').css({'overflow': 'hidden'});
    } else {
        $.post('elements/validateContact.php', data, function(data) {
            var d = $.parseJSON(data);

            if (d[0] == 'error') {
                $.each(d, function(index, value) {
                    $('#smartForm input[name="' + value + '"], #smartForm textarea[name="' + value + '"]').addClass('error');
                });

                $('#errored').show();
                $('#required').hide();
                $('#cboxLoadedContent').css({'overflow': 'hidden'});
            }

            if (d[0] == 'exception') {
                alert('NARUSZENIE ZASAD BEZPIECZEŃSTWA SERWISU!');
            }

            if (d[0] == 'ok') {
                $.colorbox({href: "elements/contact_1.php"});
            }
        });
    }

    return false;
}
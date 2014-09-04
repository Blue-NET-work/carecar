(function($) {

    var methods = {
        init: function(options) {

            var opt = $.extend({
                'bgcolor': '#000000',
                'opacity': 0.9,
                'zindex': 10000,
                'width': 200,
                'height': 150,
                'theight': false,
                'count': 0,
                'pager': 'none', // none, slide, self
                'loader': '/img/ajax-loader.gif',
                'url': '',
                'appendTo': 'body',
                'ids': 0
            }, options);

            var id = -1;
            var param = {}
            var operation;
            var wait = 0;

            var tcont;
            var tl;
            var tc;
            var tr;
            var mcont;
            var ml;
            var mr;
            var bcont;
            var bl;
            var bc;
            var br;

            function createCorners() {
                tl = $('<div>').addClass('shTopLeft');
                tc = $('<div>').addClass('shTopCenter').css({backgroundColor: opt.bgcolor});
                tr = $('<div>').addClass('shTopRight');

                tcont = $('<div>').addClass('shTopCont').append(tl).append(tc).append(tr);

                ml = $('<div>').addClass('shMidLeft').css({backgroundColor: opt.bgcolor});
                mr = $('<div>').addClass('shMidRight').css({backgroundColor: opt.bgcolor});

                bl = $('<div>').addClass('shBtmLeft');
                bc = $('<div>').addClass('shBtmCenter').css({backgroundColor: opt.bgcolor});
                br = $('<div>').addClass('shBtmRight');

                bcont = $('<div>').addClass('shBtmCont').append(bl).append(bc).append(br);
            }

            function animateDimensions(width, height, data, p) {
                $('#' + p + ' .shMidCenter').html('');

                var wheight = $(window).height();

                var cwidth = $('#' + p + ' .shTopLeft').width();
                var cheight = $('#' + p + ' .shTopLeft').height();

                $('#' + p).css({width: width + cwidth + cwidth, height: height + cheight + cheight + cheight});

                $('#' + p + ' .shMidCenter').stop().animate({width: width, height: height});

                $('#' + p + ' .shTopCenter').stop().animate({width: width});
                $('#' + p + ' .shBtmCenter').stop().animate({width: width});

                $('#' + p + ' .shMidLeft').stop().animate({height: height});
                $('#' + p + ' .shMidRight').stop().animate({height: height});

                $('#' + p).stop().animate({top: Math.floor((wheight / 2) - ((height + cheight + cheight + cheight) / 2)), marginLeft: -Math.floor((width + cwidth + cwidth) / 2)}, function() {
                    var inLeft = Math.ceil($('#' + p).offset().left);
                    var inTop = Math.ceil($('#' + p).offset().top);
                    var wTop = Math.ceil($(window).scrollTop());
                    
                    var a = $('<a>').addClass('shClose').attr('href', '#').css({position: 'fixed', left: inLeft + width + cwidth + cwidth + 10, top: inTop - wTop}).click(function() { closeOverlay(); });
                    $('.shOverlay').append(a);

                    $('#' + p + ' .shMidCenter').html($('<div>').addClass('shMidCenterText').html(data));
                    $('#' + p + ' .shMidCenterText').fadeIn(function() {
                        $('.shOverlayTemp').remove();

                        if (operation == 'slide-left' || operation == 'slide-right') {
                            var left = (operation == 'slide-left') ? '150%' : '-100%';

                            $('#' + param[1]).stop().animate({left: '50%'});
                            $('#' + param[0]).stop().animate({left: left}, function() {
                                var tp = {};
                                tp[0] = param[0];
                                tp[1] = param[1];

                                param = {};
                                param[0] = tp[1];

                                $('#' + tp[0]).remove();

                                wait = 0;
                            });
                        }

                        operation = null;
                    });
                });
            }

            function setDimensions(width, height, param) {
                var cwidth = $('#' + param + ' .shTopLeft').width();
                var cheight = $('#' + param + ' .shTopLeft').height();

                $('#' + param + ' .shMidCenter').css({width: width - cwidth - cwidth, height: height - cheight - cheight});

                $('#' + param + ' .shTopCenter').css({width: width - cwidth - cwidth});
                $('#' + param + ' .shBtmCenter').css({width: width - cwidth - cwidth});

                $('#' + param + ' .shMidLeft').css({height: height - cheight - cheight});
                $('#' + param + ' .shMidRight').css({height: height - cheight - cheight});
            }

            function getContent(param, i) {
                var temp = $('<div>').addClass('shOverlayTemp').append($('<div>').addClass('shOverlayHtml').css({overflow: 'hidden'}));

                $(opt.appendTo).append(temp);

                var params;

                if (i == -1) { id = opt.count - 1; }
                if (i >= opt.count) { id = 0; }
                if (i > -1 && i < opt.count) { id = i; }
                if (id > -1) { params = 'id=' + opt.ids[id]; }

                $.post(opt.url, params, function(data) {
                    var data = data;

                    $('.shOverlayTemp .shOverlayHtml').html(data);
                    $(document).ready(function() {
                        var nwidth = $('.shOverlayHtml').width();
                        var nheight = $('.shOverlayHtml').height();

                        animateDimensions(nwidth, (opt.theight) ? opt.theight : nheight, data, param);
                    });
                });
            }

            function showLoader(param) {
                var lImg = $('<img>').attr('src', opt.loader);
                var lCont = $('<div>').addClass('shLoader').css({overflow: 'hidden'}).append(lImg);

                $('#' + param + ' .shMidCenter').html(lCont);
                $('#' + param + ' .shLoader').css({marginLeft: 'auto', marginRight: 'auto', marginTop: ($('#' + param + ' .shMidCenter').height() / 2) - ($('#' + param + ' .shLoader').height() / 2)});
            }

            function controlArrows() {
                var wwidth = $(window).outerWidth();
                var wheight = $(window).height();

                var arrowLeft = $('<a>').addClass('shArrowLeft').attr('href', '#');
                var arrowRight = $('<a>').addClass('shArrowRight').attr('href', '#');

                var control = $('<div>').addClass('shOverlayControl').css({position: 'fixed', width: wwidth, zIndex: opt.zindex + 1}).append(arrowLeft).append(arrowRight);

                $(opt.appendTo).append(control);

                $('.shOverlayControl').css({top: Math.floor((wheight / 2) - ($('.shArrowLeft').height() / 2))});
            }

            function slideLeft(appendTo, wheight) {
                wait = 1;

                param[1] = 'shOverlayIn' + (Math.round(Math.random() * 1000));

                var over_in = $('<div>').attr('id', param[1]).addClass('shOverlayIn').css({position: 'fixed', zIndex: opt.zindex + 2, top: Math.floor((wheight / 2) - (opt.height / 2)), left: '-100%', marginLeft: -Math.floor(opt.width / 2), width: opt.width, height: opt.height, display: 'block'});
                var over_in_text = $('<div>').addClass('shMidCenter').css({backgroundColor: opt.bgcolor});
                
                createCorners();

                mcont = $('<div>').addClass('shMidCont').append(ml).append(over_in_text).append(mr);

                over_in.append(tcont).append(mcont).append(bcont);

                $(appendTo).append(over_in);

                setDimensions(opt.width, opt.height, param[1]);

                showLoader(param[1]);
                getContent(param[1], parseInt(id) - 1);

                $('.shOverlayControl').animate({top: Math.floor((wheight / 2) - ($('.shArrowLeft').height() / 2))});

                operation = 'slide-left';
            }

            function slideRight(appendTo, wheight) {
                wait = 1;

                param[1] = 'shOverlayIn' + (Math.round(Math.random() * 1000));

                var over_in = $('<div>').attr('id', param[1]).addClass('shOverlayIn').css({position: 'fixed', zIndex: opt.zindex + 2, top: Math.floor((wheight / 2) - (opt.height / 2)), left: '150%', marginLeft: -Math.floor(opt.width / 2), width: opt.width, height: opt.height, display: 'block'});
                var over_in_text = $('<div>').addClass('shMidCenter').css({backgroundColor: opt.bgcolor});
                
                createCorners();

                mcont = $('<div>').addClass('shMidCont').append(ml).append(over_in_text).append(mr);

                over_in.append(tcont).append(mcont).append(bcont);

                $(appendTo).append(over_in);

                setDimensions(opt.width, opt.height, param[1]);

                showLoader(param[1]);
                getContent(param[1], parseInt(id) + 1);

                $('.shOverlayControl').animate({top: Math.floor((wheight / 2) - ($('.shArrowLeft').height() / 2))});

                operation = 'slide-right';
            }

            function enablePagerSlide() {
                var appendTo = opt.appendTo;
                var wheight = $(window).height();
                var i;

                $('.shArrowLeft').click(function(e) {
                    wheight = $(window).height();
                    clearInterval(i);

                    if (wait == 0) {
                        slideLeft(appendTo, wheight);
                    } else {
                        i = setInterval(function() {
                            if (wait == 0) {
                                slideLeft(appendTo, wheight);
                                clearInterval(i);
                            }
                        }, 100);
                    }
                    
                    e.preventDefault();
                });

                $('.shArrowRight').click(function(e) {
                    wheight = $(window).height();
                    clearInterval(i);

                    if (wait == 0) {
                        slideRight(appendTo, wheight);
                    } else {
                        i = setInterval(function() {
                            if (wait == 0) {
                                slideRight(appendTo, wheight);
                                clearInterval(i);
                            }
                        }, 100);
                    }
                    
                    e.preventDefault();
                });
            }

            function enablePagerSelf() {
                $('.shArrowLeft').click(function() {
                    showLoader(param[0]);
                    getContent(param[0], parseInt(id) - 1);
                    operation = 'self-left';
                });

                $('.shArrowRight').click(function() {
                    showLoader(param[0]);
                    getContent(param[0], parseInt(id) + 1);
                    operation = 'self-right';
                });
            }

            function closeOverlay() {
                $('.shOverlayTemp').remove();
                $('.shOverlay').fadeOut(function() {
                    $('.shOverlay').remove();
                });
                $('.shOverlayIn').fadeOut(function() {
                    $('.shOverlayIn').remove();
                });
                $('.shOverlayControl').fadeOut(function() {
                    $('.shOverlayControl').remove();
                });

                $(document).unbind('keyup');
            }

            function showOverlay() {
                var appendTo = opt.appendTo;
                var width = $(document).outerWidth();
                var height = $(document).outerHeight();
                var wheight = $(window).height();

                param = {};
                param[0] = 'shOverlayIn' + (Math.round(Math.random() * 1000));

                var overlay = $('<div>').addClass('shOverlay');
                var over_in = $('<div>').attr('id', param[0]).addClass('shOverlayIn').css({position: 'fixed', zIndex: opt.zindex + 2, top: Math.floor((wheight / 2) - (opt.height / 2)), left: '50%', marginLeft: -Math.floor(opt.width / 2), width: opt.width, height: opt.height});
                var over_in_text = $('<div>').addClass('shMidCenter').css({backgroundColor: opt.bgcolor});

                overlay.css({
                    width: width,
                    height: height,
                    opacity: opt.opacity,
                    zIndex: opt.zindex
                });

                createCorners();

                mcont = $('<div>').addClass('shMidCont').append(ml).append(over_in_text).append(mr);

                over_in.append(tcont).append(mcont).append(bcont);

                $(appendTo).append(over_in);

                setDimensions(opt.width, opt.height, param[0]);

                $(appendTo).append(overlay);

                showLoader(param[0]);

                if (opt.pager != 'none') {
                    controlArrows();

                    switch (opt.pager) {
                        case 'slide':
                            {
                                enablePagerSlide();
                            }
                            break;
                        case 'self':
                            {
                                enablePagerSelf();
                            }
                            break;
                    }
                }

                $('.shOverlay').fadeIn(500);
                $('.shOverlayIn').fadeIn(1000, function() {
                    getContent(param[0], id);
                });
            }

            function hideOverlay() {
                $('#popupOverlay').stop().fadeOut(function() {
                    $('#popupOverlay').remove();
                });
            }

            $(this).live('click', function(e) {
                showOverlay();

                id = $(this).attr('rel');

                $(document).bind('keyup', function(e) {
                    if (e.keyCode == 27) {
                        closeOverlay();
                    }
                });

                $('.shOverlay').live('click', function() {
                    closeOverlay();
                });

                e.preventDefault();
            });
        }
    };

    $.fn.shpopup = function(method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.shpopup');
        }
    }

})(jQuery);
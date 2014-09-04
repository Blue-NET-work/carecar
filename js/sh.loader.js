(function( $ ) {

    var methods = {
        init : function( options ) { 
            
            var opt = $.extend({
                'images': false,
                'container': false,
                't2f': false,
                'tdir': 'images/',
                'bdir': 'images/',
                'host': '',
                'inner': false,
                'type': 'percent', // percent | circle
                'circle': '/img/ajax-loader.gif' // circle image
            }, options);
            
            var count = 0;
            var finished = 0;
            
            var imagesin = new Array();
            var imagescont = new Array();
            
            function prepareImagesFContainer() {
                var img = $(opt.container).find('img');
                
                var images = new Array();
                
                var z = 0;
                img.each(function(k) {
                    var src = $(this).attr('src');
                    
                    if ($.inArray(src, images) == -1) {
                        images[z] = src;
                        z++;
                    }
                });
                
                count += (opt.t2f) ? images.length * 2 : images.length;
                
                imagescont = images;
            }
            
            function prepareImages() {
                var images = opt.images;
                count += images.length;
                imagesin = images;
            }
            
            function showOverlay() {
                var overlay = $('<div>').attr('id', 'preloaderOverlay');
                var overlay_in = $('<div>').attr('class', 'in');
                var overlay_in_text = $('<div>').attr('class', 'in_text');
                
                var width = 0;
                var height = 0;
                var wheight = 0;
                var top = 0;
                var left = 0;
                var appendTo = '';
                
                if (opt.inner) {
                    width = $(opt.inner).outerWidth();
                    height = $(opt.inner).outerHeight();
                    wheight = $(opt.inner).outerHeight();
                    top = $(opt.inner).offset().top;
                    left = $(opt.inner).offset().left;
                    appendTo = 'body';
                } else {
                    width = $(document).outerWidth();
                    height = $(document).outerHeight();
                    wheight = $(window).outerHeight();
                    appendTo = 'body';
                }
                
                overlay.css({ position: 'absolute', top: top, left: left, width: width, height: height, opacity: 1, backgroundColor: '#000000', zIndex: 10000 })
                overlay_in.css( { position: 'absolute', width: 0, height: 32, top: Math.ceil(wheight / 2) - 16, color: '#ffffff', borderBottom: '2px solid #ffffff', overflow: 'hidden' } );
                
                if (opt.type == 'percent') {
                    overlay_in_text.html('0%').css( { 'float': 'right', width: 50, paddingRight: 20 } );
                    overlay_in.append(overlay_in_text);
                }
                
                if (opt.type == 'circle') {
                    overlay.css( { opacity: 0.9 } );
                    overlay_in.css( { width: '100%', borderBottom: 0 } );
                    overlay_in_text.html('<img src="' + opt.circle + '" />').css( { textAlign: 'center', width: '100%', height: 32 } );
                    overlay_in.append(overlay_in_text);
                }
                
                overlay.append(overlay_in);
                
                $(appendTo).append(overlay);
            }
            
            function stageOverlay() {
                var percent = Math.ceil((100 / count) * finished);
                
                if (opt.type == 'percent') {
                    $('#preloaderOverlay .in_text').html(percent + '%');
                    $('#preloaderOverlay .in').stop().animate({ width: percent + '%' });
                }
                
                hideOverlay();
            }
            
            function hideOverlay() {
                if (finished == count) {
                    $('#preloaderOverlay').stop().fadeOut(function() {
                        $('#preloaderOverlay').remove();
                    });
                }
            }
            
            function preload() {
                var img;
                
                showOverlay();
                
                if (opt.images) { 
                    $.each(imagesin, function(k, v) {
                      img = $('<img/>').load(function() {
                          finished++;
                          stageOverlay();
                      }).attr('src', v);
                    });
                }
                
                if (opt.container) {
                    $.each(imagescont, function(k, v) {
                        if (v != undefined) {
                            img = $('<img/>').load(function() {
                                finished++;
                                stageOverlay();
                            }).attr('src', v);

                            if (opt.t2f) {
                                img = $('<img/>').load(function() {
                                    finished++;
                                    stageOverlay();
                                }).attr('src', opt.bdir + v.replace('http://' + opt.host + '/', '').replace(opt.tdir, ''));
                            }
                        }
                    });
                }
            }
            
            if (opt.images) { prepareImages(); }
            if (opt.container) { prepareImagesFContainer(); }
            
            setTimeout(function() { preload(); }, 10);
        }
    };
    
    $.fn.shloader = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.shloader' );
        }  
    }

})( jQuery );
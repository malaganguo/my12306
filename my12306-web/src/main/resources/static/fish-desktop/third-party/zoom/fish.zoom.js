/**
 * 第三方组件，图片局部放大插件
 * @class fish.desktop.widget.Zoom
 * @extends fish.desktop.widget
 * <pre>
 *  $(element).zoom(option);
 * </pre>
 */
! function() {
    'use strict';

    $.widget("ui.zoom", {
        options: {
            /**
             * 设置预览区域宽度，默认值是200
             * @cfg {Number} xzoom=200
             */
            xzoom: 200,
            /**
             * 设置预览区域高度，默认值是200
             * @cfg {Number} yzoom=200
             */
            yzoom: 200,
            /**
             * 设置预览区域和图片之间的间距，默认值是10
             * @cfg {Number} offset=10
             */
            offset: 10,
            /**
             * 设置预览区域的位置，可以设置左侧或者右侧，默认是右边
             * @cfg {String} position=right
             */
            position: 'right'
        },

        _create: function() {
            var that = this;
            this.element.addClass('zoom');
            this._on({
                'mouseenter': function() {
                    that._buildImg();
                },
                'mouseleave': function() {
                    that._removeImg();
                }
            });
        },
        _buildImg: function(e) {
            var imageLeft = this.element.offset().left;
            var imageTop = this.element.offset().top;
            var imageWidth = this.element.children('img').get(0).offsetWidth;
            var imageHeight = this.element.children('img').get(0).offsetHeight;
            var settings = this.options;
            var leftpos;

            var bigimage = this.element.children("img").attr("src");

            if ($(".zoomdiv").get().length == 0) {
                this.element.append("<div class='zoomdiv'><img class='bigimg' src='" + bigimage + "'/></div>");
                this.element.append("<div class='zoompup'></div>");
            }


            if (settings.position == "right") {
                if (imageLeft + imageWidth + settings.offset + settings.xzoom > screen.width) {
                    leftpos = imageLeft - settings.offset - settings.xzoom;
                } else {
                    leftpos = imageWidth + settings.offset;
                }
            } else {
                leftpos = -(settings.xzoom + settings.offset);
            }
            $(".zoomdiv").css("left", leftpos);
            $(".zoomdiv").width(settings.xzoom);
            $(".zoomdiv").height(settings.yzoom);
            $(".bigimg").css({
                width: 2 * settings.xzoom,
                height: 2 * settings.yzoom
            });
            $(".zoomdiv").show();
            $(document.body).mousemove(function(e) {
                var bigwidth = $(".bigimg").get(0).offsetWidth;
                var bigheight = $(".bigimg").get(0).offsetHeight;
                var scaley = 'x';
                var scalex = 'y';
                if (isNaN(scalex) | isNaN(scaley)) {
                    var scalex = (bigwidth / imageWidth);
                    var scaley = (bigheight / imageHeight);
                    $(".zoompup").width((settings.xzoom) / (scalex * 1));
                    $(".zoompup").height((settings.yzoom) / (scaley * 1));
                    $(".zoompup").css('visibility', 'visible');
                }
                var xpos = e.pageX - $(".zoompup").width() / 2 - imageLeft;
                var ypos = e.pageY - $(".zoompup").height() / 2 - imageTop;

                xpos = (xpos < 0) ? 0 : (e.pageX + $(".zoompup").width() / 2 > imageWidth + imageLeft) ? (imageWidth - $(".zoompup").width() - 2) : xpos;
                ypos = (ypos < 0) ? 0 : (e.pageY + $(".zoompup").height() / 2 > imageHeight + imageTop) ? (imageHeight - $(".zoompup").height() - 2) : ypos;

                $(".zoompup").css({
                    top: ypos,
                    left: xpos
                });
                var scrolly = ypos;
                $(".zoomdiv").get(0).scrollTop = scrolly * scaley;
                var scrollx = xpos;
                $(".zoomdiv").get(0).scrollLeft = (scrollx) * scalex;

            });

        },
        _removeImg: function() {
            $(document.body).off("mousemove");
            $(".zoompup").remove();
            $(".zoomdiv").remove();
        },
        _destroy: function() {
            this.element.removeClass('zoom');
        }

    });

}();

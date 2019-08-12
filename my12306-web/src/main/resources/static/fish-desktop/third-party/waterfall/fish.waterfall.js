/**
 * 第三方组件，瀑布流布局插件
 * @class fish.desktop.widget.Waterfall
 * @extends fish.desktop.widget
 * <pre>
 *  $(element).waterfall(option);
 * </pre>
 */
!function(){
	'use strict';
	var array;

	$.widget("ui.waterfall", {
		options:{
			/**
             * @cfg {String} [selector=""] 子元素选择器，可以是id或者class，默认是null
             */
			selector: "",
			/**
             * @cfg {Number} [columnWidth=0] 列宽，默认是0
             */
			columnWidth: 0,
			/**
             * @cfg {Number} [columnCount=0] 列数，默认是0
             */
			columnCount: 0,
			/**
             * @cfg {Boolean} [isResizable=false] 自适应浏览器宽度，默认是false
             */
			isResizable: false,
			/**
             * @cfg {Function} 调用结束时的回调函数。
             */
			end: null
		},

		_init:function(){
			var that = this,
			b = that._measure();

			array = array ? array : new Array(b[1]);

			$.each(array, function(index, value){
				if( value === undefined ) array[index] = 0;
			});

			that._selector().each(function(){
				var _this = $(this),
					index = $.inArray(Math.min.apply(Math, array), array);

				_this.css({
					left: index * b[0],
					top: array[index]
				}).addClass('waterfall');

				array[index] += _this.outerHeight(true);
			});

			that.element.css("height", Math.max.apply(Math, array));

			that._trigger("end",null);
		},
		_measure:function(c,_v){
			var that = this,
			s0 = $(that._selector()[0]),

			isResizable = that.options.isResizable,

			col_count = that.options.columnCount,
			col_width = that.options.columnWidth,

			ele_width = s0.outerWidth(true),
			win_width = !isResizable ? that.element.width() : ($(window).width() - 20); // 减去滚动条宽度

			col_width = col_width || ele_width; // 子元素宽度
			col_count = col_count || parseInt(win_width/col_width); // 子元素列数

			that.element.css("position","relative");

			if( isResizable ){
				that.element.css({
					"width": col_width * col_count,
					"margin-left": "auto",
					"margin-right": "auto"
				});
			}

			return [col_width, col_count];
		},
		_selector:function(){
			var a = this.options.selector,
				b = this.element;
			return !a ? b.children().not('.waterfall') : b.filter(a).not('.waterfall').add(b.find(a));
		},
		_destroy:function(){
			var that = this;
			that.element.removeAttr('style');
            array = undefined;
			that.element.find(".waterfall").each(function(){
				var _this = $(this);
				_this.removeClass('waterfall');
			});
		}

	});

}();

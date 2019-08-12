/**
 * @class fish.desktop.widget.Timeline
 * 第三方组件，timeline 时间轴组件
 * <pre>
 *   $('#timeline').timeline();
 * </pre>
 */

!function() {
    'use strict';

    $.widget("ui.timeline", {
        options: {
            /**
             * 数据源
             * @cfg {Array} params: ["date": "", "children": [{
             *       "title": "",
             *       "time": "",
             *       "content": [{"text":""}] / ""
             *   }]
             *}]
             */
            params: [{
                "date": "",
                "children": [{
                    "title": "",
                    "time": "",
                    "content": [{"text":""}]
                }]
            }],
            /**
             * orientation显示方向
             * @cfg {String} orientation = 'vertical' || 'horizontal'
             */
            orientation: 'vertical',
            /**
             * customClass 替换class,定制样式
             * @cfg {Object} customClass: {
             *  date   : "tldate",
             *  time   : "tl-time",
             *  circ   : "tl-circ",
             *  panel  : "timeline-panel",
             *  header : "tl-heading",
             *  body   : "tl-body",
             * }
             */
            customClass: {
                date   : "tldate",
                time   : "tl-time",
                circ   : "tl-circ",
                panel  : "timeline-panel",
                header : "tl-heading",
                body   : "tl-body",
            },
            /**
             * customBody handbar语法，替换content内容，可根据params.children.content定制多数据源
             * @cfg {String} customBody: "<p>{{text}}</p>"
             */
            customBody: "<p>{{text}}</p>",
            /**
             * @cfg {Function} circClickfn 时间节点点击事件
             * @param {Object} target jquery对象
             * @param {Object} data 节点数据
             *        点击返回参数，通过arguments获取
             */
            circClickfn: $.noop
        },
        _create: function() {
            var template =
                "{{#ifCond orientation '===' 'horizontal'}}" +
                "<ul class='timeline horizontal'>" +
                "{{/ifCond}}" +
                "{{#ifCond orientation '===' 'vertical'}}" +
                "<ul class='timeline'>" +
                "{{/ifCond}}" +
                "{{#each params}}" +
                "<li>" +
                "<div class='" + this.options.customClass.date + "'>{{date}}</div>" +
                "</li>" +
                "{{#each children}}" +
                "<li class='timeline'>" +
                "<div class='" + this.options.customClass.time + "'>{{time}}</div>" +
                "<div class='" + this.options.customClass.circ + "' data-date='{{../date}}'></div>" +
                "<div class='" + this.options.customClass.panel + "'>" +
                "<div class='" + this.options.customClass.header + "'>" +
                "<h4>{{title}}</h4>" +
                "</div>" +
                "<div class='" + this.options.customClass.body + "'>" +
                "{{#isArray content}}" +
                "{{#each content}}" +
                this.options.customBody +
                "{{/each}}" +
                "{{else}}" +
                "<p>{{content}}</p>" +
                "{{/isArray}}" +
                "</div>" +
                "</div>" +
                "</li>" +
                "{{/each}}" +
                "{{/each}}" +
                "</ul>";
            if (this.options.orientation !== 'vertical' && this.options.orientation !== 'horizontal') {
                throw new Error('orientation is incorrect');
            }
            this.element.append(fish.compile(template)(this.options));
            this.$circ = this.element.find("." + this.options.customClass.circ);
            this.$circ.on('click',this.$circ,$.proxy(this.circClickfn,this));
        },

        circClickfn: function(event) {
            var $target = $(event.currentTarget);
            var date = $target.attr("data-date");
            var data = fish.find(this.options.params,function(obj){
                return obj.date == date;
            });
            this.options.circClickfn($target,data);
        },

        _delegateEvent: function() {

        },

        _destroy: function() {
            this.element.children().remove();
        }
    })

}();

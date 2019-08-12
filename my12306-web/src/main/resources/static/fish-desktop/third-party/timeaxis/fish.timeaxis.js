/**
 * @class fish.desktop.widget.Timeaxis
 * @since v3.10.0
 * 第三方组件，timeaxis 时间轴组件
 * <pre>
 *   $('#timeaxis').timeaxis();
 * </pre>
 */

!function() {
    'use strict';

    $.widget("ui.timeaxis", {
        options: {
            /**
             * 数据源
             * @cfg {Array} dataSource: [{
             *       "title": "",  另一侧标题
             *       "label": "",  一侧标签
             *       "labelSm": "",  一侧小标签
             *       "className": "",  每个点的自定义类，可用于版本状态区分，绿色表示已发布，蓝色表示草稿，默认表示待发布
             *       "content": ""  另一侧右侧内容
             *}]
             */
            dataSource: [{
                "title": "",
                "label": "",
                "labelSm": "",
                "className": "",
                "content": ""
            }],
            /**
             * orientation显示方向
             * @cfg {String} orientation = 'vertical' || 'horizontal'
             */
            orientation: 'vertical',
            /**
             * 左侧label的宽度
             * @cfg {Number} labelWidth = null
             */
            labelWidth: null,
            /**
             * customClass 替换class,定制样式
             * @cfg {Object} customClass: {
             *  head       : "timeaxis-head",  一侧部分
             *  label      : "timeaxis-label",  一侧标签
             *  labelSm    : "timeaxis-label-sm", 一侧小标签
             *  circle     : "timeaxis-circle", 中间圆圈
             *  body       : "timeaxis-body", 另一侧部分
             *  bodyHead   : "timeaxis-body-head", 另一侧标题
             *  bodyContent: "timeaxis-body-content", 另一侧内容
             * }
             */
            customClass: {
                head       : "timeaxis-head",
                label      : "timeaxis-label",
                labelSm    : "timeaxis-label-sm",
                circle     : "timeaxis-circle",
                body       : "timeaxis-body",
                bodyHead   : "timeaxis-body-head",
                bodyContent: "timeaxis-body-content"
            }
        },
        _create: function() {
            var template =
                "<ul class='timeaxis {{#ifCond orientation '===' 'horizontal'}}horizontal{{/ifCond}}'>" +
                "{{#each dataSource}}" +
                "<li config='{{@index.length}}' class='timeaxis-item {{className}}' {{#if ../labelWidth}}{{#ifCond ../../orientation '===' 'horizontal'}}style='width: " + this.options.labelWidth + "px'{{/ifCond}}{{/if}}>" +
                "<div class='timeaxis-line'" +
                "{{#if ../labelWidth}}{{#ifCond ../../orientation '===' 'horizontal'}}" +
                "{{else}}style='left: " + (39 + this.options.labelWidth) + "px'{{/ifCond}}{{/if}}" +
                "></div>" +
                "<div class='" + this.options.customClass.head + "' {{#if ../labelWidth}}{{#ifCond ../../orientation '===' 'vertical'}}style='width: " + this.options.labelWidth + "px'{{/ifCond}}{{/if}}>" +
                "<div class='" + this.options.customClass.label + "'>{{label}}</div>" +
                "<div class='" + this.options.customClass.labelSm + "'>{{labelSm}}</div>" +
                "</div>" +
                "<div class='" + this.options.customClass.circle + "' {{#if ../labelWidth}}{{#ifCond ../../orientation '===' 'vertical'}}style='left: " + (31 + this.options.labelWidth) + "px'{{/ifCond}}{{/if}}></div>" +
                "<div class='" + this.options.customClass.body + "'>" +
                "<div class='" + this.options.customClass.bodyHead + "'>" +
                "{{{title}}}" +
                "</div>" +
                "<div class='" + this.options.customClass.bodyContent + "'>" +
                "{{{content}}}" +
                "</div>" +
                "</div>" +
                "</li>" +
                "{{/each}}" +
                "</ul>";

            this.element.append(fish.compile(template)(this.options));
        },

        _destroy: function() {
            this.element.children().remove();
        }
    })

}();

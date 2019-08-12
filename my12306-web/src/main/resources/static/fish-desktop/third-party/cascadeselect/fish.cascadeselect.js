/**
 * @class fish.desktop.widget.CasecadeSelect
 * @extends fish.desktop.widget
 * 第三方组件，级联选择，支持多层次级联
 * <pre>
 //初始化控件
 $(element).cascadeselect(option);
 //调用控件上的方法
 $(element).cascadeselect(method);
 * </pre>
 */
!function () {
  $.widget('ui.cascadeselect', $.ui.formfield, {
    baseClass: 'ui-cascadeselect',
    formIgnoreClass: '_formIngoreValue',
    options: {
      /**
       * @cfg {Selector} select元素的选择器，可以是选择器，也可以是jQuery对象
       */
      selectors: [],
      /**
       * @cfg {String|Object|Array} 级联数据源，例如
       *
       * <pre>
       *  1. 'http://xxx/city.json'
       *  2.  [{},{},{}]
       *  3. {city:[...]}
       * </pre>
       */
      dataSource: null,

      /**
       * @cfg {String} nodata='hidden' 没有数据时，select的状态
       * 'none':不显示,不占空间位置
       * 'hidden':隐藏，占空间位置
       */
      nodata: 'hidden',

      /**
       * @cfg {Boolean} required=false 是否添加第一个可选则的项
       */
      required: false,
      /**
       * @cfg {String}  firstTitle='---Please Select---' 第一个选择名称
       */
      firstTitle: fish.getResource('common.PLZ_SELECT'),

      /**
       * @cfg {Any} firstValue=-1 第一个选项的值
       */
      firstValue: -1,
      /**
       * @cfg  {String} jsonSpace='' 数据命名空间
       */
      jsonSpace: '',

      /**
       * @cfg {String} jsonName='name' 数据标题字段名称
       */
      jsonName: 'name',
      /**
       * @cfg {String} jsonValue='id' 数据值字段名称
       */
      jsonValue: 'id',
      /**
       * @cfg {String} jsonSub='children' 子集数据字段名称
       */
      jsonSub: 'children'
    },

    _create: function () {
      var self = this;
      // validate options
      if (!$.isArray(this.options.selectors) || !this.options.selectors.length) {
        return;
      }

      if (!this.options.dataSource) {
        return;
      }

      this.$selectors = [];
      for (var i = 0, l = this.options.selectors.length; i < l; i++) {
        var selector = this.options.selectors[i];
        if (!(selector instanceof $)) {
          selector = this.element.find('select' + selector);
        }
        selector.addClass(this.baseClass + ' '); //不通过form组件赋值
        this.$selectors.push(selector);
      }

      this._bindEvent();

      switch (typeof this.options.dataSource) {
        case 'string':
          $.getJSON(this.options.dataSource, function (json) {
            self._start(json);
          });
          break;

        case 'object':
          this._start(this.options.dataSource);
          break;
      }

      this._super();
    },

    _init: $.noop,

    _bindEvent: function () {
      var self = this;
      this.element.on('change', 'select', function () {
        self._selectChange($(this).attr('name'));
      });
    },

    _start: function (data) {
      var self = this;
      var _jsonSpace = this.options.jsonSpace;

      self.dataJson = undefined;

      if (data && typeof data === 'object') {
        self.dataJson = data;

        if (typeof _jsonSpace === 'string' && _jsonSpace.length) {
          var _space = _jsonSpace.split('.');
          // 多层次结构
          for (var i = 0, l = _space.length; i < l; i++) {
            self.dataJson = self.dataJson[_space[i]];
          }
        }
      }

      self._buildOptionData(0);
    },

    _buildOptionData: function (index, opt) {
      var self = this;

      if (typeof index !== 'number' || isNaN(index) || index < 0 || index >= this.$selectors.length) {
        return;
      }

      var _indexPrev = index - 1;
      var _select = self.$selectors[index]; //当前的selector
      var _selectIndex;
      var _selectData;
      var _valueIndex;
      var _query = {};
      var _jsonSpace = typeof _select.data('jsonSpace') === 'undefined' ? this.options.jsonSpace : _select.data('jsonSpace');

      var i, l;
      // 清空后面的 select
      for (i = 0, l = this.$selectors.length; i < l; i++) {
        if (i >= index) {
          self.$selectors[i].empty().prop('disabled', true);
          switch (this.options.nodata) {
            case 'none':
              self.$selectors[i].css('display', 'none');
              break;
            case 'hidden':
              self.$selectors[i].css('visibility', 'hidden');
              break;
          }
        }
      }//end for

      //支持自定义的数据流
      if (typeof _select.data('url') === 'string' && _select.data('url').length) {
        if (_indexPrev >= 0) {
          if (!self.$selectors[_indexPrev].val().length) {
            return;
          }
          _query[self.$selectors[_indexPrev].attr('name')] = self.$selectors[_indexPrev].val();
        }

        $.getJSON(_select.data('url'), _query, function (json) {
          _selectData = json;

          if (typeof _jsonSpace === 'string' && _jsonSpace.length) {
            var _space = _jsonSpace.split('.');

            for (var i = 0, l = _space.length; i < l; i++) {
              _selectData = _selectData[_space[i]];
            }
          }

          self._buildOption(_select, _selectData);
        });

      } else if (self.dataJson && typeof self.dataJson === 'object') {
        _selectData = self.dataJson;

        for (i = 0, l = self.$selectors.length; i < l; i++) {
          if (i < index) {
            _valueIndex = self._getIndex(self.$selectors[i][0].selectedIndex);

            if (typeof _selectData[_valueIndex] === 'object' && $.isArray(_selectData[_valueIndex][this.options.jsonSub]) && _selectData[_valueIndex][this.options.jsonSub].length) {
              _selectIndex = i;
              _selectData = _selectData[_valueIndex][this.options.jsonSub];
            }
          }
        }

        if (_indexPrev < 0 || _indexPrev === _selectIndex) {
          self._buildOption(_select, _selectData);
        }
      }
    },

    _buildOption: function (select, data) {

      var self = this;
      var _firstTitle = typeof select.data('firstTitle') === 'undefined' ? self.options.firstTitle : select.data('firstTitle');
      var _firstValue = typeof select.data('firstValue') === 'undefined' ? self.options.firstValue : select.data('firstValue');
      var _jsonName = typeof select.data('jsonName') === 'undefined' ? self.options.jsonName : select.data('jsonName');
      var _jsonValue = typeof select.data('jsonValue') === 'undefined' ? self.options.jsonValue : select.data('jsonValue');
      var i, l;

      if (!$.isArray(data)) {
        return;
      }

      var _html = !self.options.required ? '<option value="' + _firstValue + '">' + _firstTitle + '</option>' : '';

      // 区分标题或值的数据
      if (_jsonName.length) {
        // 无值字段时使用标题作为值
        if (!_jsonValue.length) {
          _jsonValue = _jsonName;
        }

        for (i = 0, l = data.length; i < l; i++) {
          _html += '<option value="' + data[i][_jsonValue] + '">' + data[i][_jsonName] + '</option>';
        }

        // 数组即为值的数据
      } else {
        for (i = 0, l = data.length; i < l; i++) {
          _html += '<option value="' + data[i] + '">' + data[i] + '</option>';
        }
      }

      select.html(_html).prop('disabled', false).css({'display': '', 'visibility': ''});

      // 初次加载设置默认值
      if (typeof select.data('value') !== 'undefined') {
        select.val(select.data('value')).removeData('value').removeAttr('data-value');
      }

      //this._trigger('change');
    },

    //选择改变事件
    _selectChange: function (name) {
      if (typeof name !== 'string' || !name.length) {
        return;
      }

      var _index;

      // 获取当前 select 位置
      for (var i = 0, l = this.$selectors.length; i < l; i++) {
        var $selector = this.$selectors[i];
        if ($selector.attr('name') === name) {
          _index = i;
          break;
        }
      }

      if (typeof _index === 'number') {
        _index += 1;
        this._buildOptionData(_index);
      }
    },

    _getIndex: function (n) {
      return (this.options.required) ? n : n - 1;
    },

    value: function (values) {
      //get value
      if (values === undefined) {
        var ret = [];
        for (var i = 0, j = this.$selectors.length; i < j; i++) {
          var $sel = this.$selectors[i];
          ret.push($sel.val());
        }
        return ret;
      }

      //set value
      this._setValue(values);
    },


    _setValue: function (values) {
      if ($.type(values) !== 'array') {
        return;
      }

      for (var i = 0; i < values.length; i++) {
        var $select = this.$selectors[i];
        $select.data('value', values[i]);
        this._buildOptionData(i);
      }
    },

    //form event
    _onFormReset: function () {
      this._buildOptionData(0);
    },

    _onFormClear: function () {
      this._buildOptionData(0);
    },

    _formSetValue: function (value) {
      //xx
    },

    _afterFormSetValue: function (event, data) {
      var formData = data.formData;

      for (var i = 0; i < this.$selectors.length; i++) {
        var $select = this.$selectors[i];
        var name = $select.attr('name');
        var value = formData[name];

        if (value) {
          $select.data('value', value);
          this._buildOptionData(i);
        } else {
          //如果不在值，则不可以继续赋值
          break;
        }
      }
    },

    _destory: function () {
      this.element.off();
      for (var i = 0; i < this.$selectors.length; i++) {
        var $selector = this.$selectors;
        $selector.removeClass(this.baseClass + ' ' + this.formIgnoreClass);
      }
    }
  });


}();
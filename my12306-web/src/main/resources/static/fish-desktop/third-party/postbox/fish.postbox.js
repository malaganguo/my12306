!function() {
    var MESSAGE = 'message';

    function resolveOrigin(url) {
        const a = document.createElement('a');
        a.href = url;
        return a.origin || (a.protocol + '//' + a.hostname);
    }

    function resolveValue(model, property) {
        const unwrappedContext = typeof model[property] === 'function'
            ? model[property]() : model[property];
        const defer = $.Deferred();
        defer.resolve(unwrappedContext);
        return defer.promise();
    }

    function distrust(e, origin) {
        if (e.origin !== origin) return false;
        if (typeof e.data === 'object') return false;
        if (!('type' in e.data)) return false;
    }

    function ParentAPI(info) {
        var self = this;

        this.parent = info.parent;
        this.child = info.child;
        this.childOrigin = info.childOrigin;
        this.frame = info.frame;

        this.events = {};
        this.listener = function(e) {
            e = e.originalEvent;

            if (distrust(e, self.childOrigin)) return;

            if (e.data.type === 'emit') {
                var name = e.data.value.name,
                    data = e.data.value.data;
                if (name in self.events) {
                    self.events[name].call(self, data);
                }
            }
        }

        $(this.parent).on(MESSAGE, this.listener)
    }

    /**
     * iframe握手成功返回访问子窗口接口
     * @class fish.desktop.util.Postbox.ParentAPI
     */
    ParentAPI.prototype = {
        /**
         * 获取iframe模型数据属性值
         * @param {string} property 属性名
         * @return {Promise} 返回Deferred's Promise对象
         */
        get: function(property) {
            var defer = $.Deferred(),
                self = this;

            var uid = fish.uniqueId('postbox');
            var transact = function(e) {
                e = e.originalEvent;

                if (e.data.type === 'reply' && e.data.uid === uid) {
                    $(self.parent).off(MESSAGE, transact)
                    defer.resolve(e.data.value);
                }
            };
            $(this.parent).on(MESSAGE, transact);

            this.child.postMessage({
                type: 'request',
                property: property,
                uid: uid
            }, this.childOrigin);

            return defer.promise();
        },

        /**
         * 调用iframe模型方法
         * @param {string} property 方法名
         * @param data 方法参数
         */
        call: function(property, data) {
            this.child.postMessage({
                type: 'call',
                property: property,
                data: data
            }, this.childOrigin)
        },

        /**
         * 添加iframe事件监听处理
         * @param {string} name 事件名
         * @param {Function} callback 事件处理
         */
        on: function(name, callback) {
            this.events[name] = callback
        },

        /**
         * 销毁iframe
         */
        destroy: function() {
            $(this.parent).off(MESSAGE, this.listener)
            this.frame.parentNode.removeChild(this.frame)
        }
    }

    /**
     * iframe握手成功返回访问父窗口接口
     * @class fish.desktop.util.Postbox.ChildAPI
     */
    function ChildAPI(info) {
        this.parent = info.parent;
        this.parentOrigin = info.parentOrigin;
        this.child = info.child;
        this.model = info.model;

        var self = this;
        $(this.child).on(MESSAGE, function(e) {
            e = e.originalEvent;

            if (distrust(e, this.parentOrigin)) return;

            var type = e.data.type,
                property = e.data.property,
                uid = e.data.uid,
                data = e.data.data;

            if (type === 'call') {
                if (property in self.model && typeof self.model[property] === 'function') {
                    self.model[property].call(self, data);
                }
            } else if (type === 'request') {
                resolveValue(self.model, property).then(function(value) {
                    e.source.postMessage({
                        type: 'reply',
                        value: value,
                        uid: uid
                    }, e.origin);
                })
            }
        })
    }

    ChildAPI.prototype = {
        /**
         * iframe派发事件
         * @member fish.desktop.util.Postbox.ChildAPI
         * @param {string} name 事件名
         * @param {string} data 数据
         */
        emit: function(name, data) {
            this.parent.postMessage({
                type: 'emit',
                value: {name: name, data: data}
            }, this.parentOrigin)
        }
    }

    /**
     * 第三方组件，iframe交互通信组件，父页面定义，建立iframe握手连接
     * <pre>
     *     new fish.Postbox({
     *       container: document.getElementById('someDiv'),
     *       url: 'child.com/page.html', // iframe url
     *     }).then(function(child) {
     *       // 握手成功，child为访问iframe接口对象
     *       child.get('field').then(...);
     *     });
     * </pre>
     * @since V3.4.0
     * @class fish.desktop.util.Postbox
     * @param {Object} options 参数
     * @param {Element} [options.container] iframe要添加到的元素，默认是body
     * @param {string} options.url iframe地址
     * @param {Object} [options.model] 传递给iframe模型数据
     * @return {Promise} 返回Deferred's Promise对象
     */
    var Postbox = function(options) {
        this.parent = window;
        this.frame = document.createElement('iframe');
        (options.container || document.body).appendChild(this.frame);
        this.child = this.frame.contentWindow || this.frame.contentDocument.parentWindow
        this.model = options.model || {}

        return this.sendHandshake(options.url)
    }

    /**
     * @private
     * @method sendHandshake 发送握手连接
     * @param url iframe地址
     * @return {Promise} 返回Deferred's Promise对象
     */
    Postbox.prototype.sendHandshake = function(url) {
        var childOrigin = resolveOrigin(url);
        var defer = $.Deferred(),
            self = this;

        var reply = function(e) {
            e = e.originalEvent;

            // receive handshake reply from iframe
            if (e.data.type === 'handshake-reply') {
                $(self.parent).off(MESSAGE, reply);
                self.childOrigin = e.origin;

                defer.resolve(new ParentAPI(self));
            } else {
                defer.reject('Handshake failed');
            }
        }

        $(this.parent).on(MESSAGE, reply);

        // send handshake to iframe
        var loaded = function(e) {
            self.child.postMessage({
                type: 'handshake',
                model: self.model
            }, childOrigin)
        }

        this.frame.onload = loaded;
        this.frame.src = url;

        return defer.promise();
    }

    /**
     * iframe交互通信组件，子页面定义，建立iframe握手连接
     * <pre>
     *     new fish.Postbox.Client().then(function(parent) {
     *       // 握手成功，parent为iframe父窗口接口对象
     *       parent.emit('some-event', data);
     *     });
     * </pre>
     * @since V3.4.0
     * @class fish.desktop.util.Postbox.Client
     * @param {Object} model 数据对象可供父窗口获取
     * @return {Promise} 返回Deferred's Promise对象 {@link fish.desktop.util.Postbox.ParentAPI}
     */
    Postbox.Client = function(model) {
        this.child = window;
        this.parent = this.child.parent;
        this.model = model;
        return this.sendHandshakeReply();
    }

    /**
     * @private
     * @method sendHandshake 发送握手返回连接
     * @return {Promise} 返回Deferred's Promise对象 {@link fish.desktop.util.Postbox.ChildAPI}
     */
    Postbox.Client.prototype.sendHandshakeReply = function() {
        var defer = $.Deferred(),
            self = this;

        var shake = function(e) {
            e = e.originalEvent;

            if (e.data.type === 'handshake') {
                $(self.child).off(MESSAGE, shake);
                self.parentOrigin = e.origin;

                e.source.postMessage({
                    type: 'handshake-reply',
                }, e.origin);

                fish.extend(self.model, e.data.model);

                defer.resolve(new ChildAPI(self));
            } else {
                defer.reject('Handshake reply failed.');
            }
        }

        $(this.child).on(MESSAGE, shake);

        return defer.promise();
    }

    fish.Postbox = Postbox;
}();
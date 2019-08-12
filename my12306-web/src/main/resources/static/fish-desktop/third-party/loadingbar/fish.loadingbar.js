/**
 * 第三方组件，加载进度条
 * @class fish.desktop.widget.LoadingBar
 * <pre>
 *     fish.LoadingBar.start();
 *     fish.LoadingBar.finish();
 * </pre>
 */

!function (factory) {
    "use strict";

    var loadingBarContainer = $('<div id="loading-bar" class="loadingbar"><div class="bar"><div class="peg"></div></div></div>'),
        loadingBar = loadingBarContainer.find('.bar'),
        started = false,
        status = 0,
        $body = $('body'),
        incTimeout, completeTimeout;

    fish.LoadingBar = {
        /**
         * @method start 进度条加载开始
         */
        start: function () {
            clearTimeout(completeTimeout);

            if (started) {
                return;
            }

            started = true;

            $body.append(loadingBarContainer);

            this.progress(status);
        },

        progress: function (value) {
            if (!started) {
                return;
            }
            var pct = (value * 100) + '%';
            loadingBar.css('width', pct);
            status = value;

            clearTimeout(incTimeout);
            incTimeout = setTimeout($.proxy(this.increment, this), 250);
        },

        increment: function () {
            if (status >= 1) {
                return;
            }

            var rnd = 0,
                stat = status;

            if (stat >= 0 && stat < 0.25) {
                // Start out between 3 - 6% increments
                rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
            } else if (stat >= 0.25 && stat < 0.65) {
                // increment between 0 - 3%
                rnd = (Math.random() * 3) / 100;
            } else if (stat >= 0.65 && stat < 0.9) {
                // increment between 0 - 2%
                rnd = (Math.random() * 2) / 100;
            } else if (stat >= 0.9 && stat < 0.99) {
                // finally, increment it .5 %
                rnd = 0.005;
            } else {
                // after 99%, don't increment:
                rnd = 0;
            }

            var pct = status + rnd;
            this.progress(pct);
        },

        /**
         * @method finish 进度条加载结束
         */
        finish: function () {
            this.progress(1);

            clearTimeout(completeTimeout);

            completeTimeout = setTimeout(function() {
                loadingBarContainer.remove();

                status = 0;
                started = false;
            }, 500);
        }
    };
}();
/**
 * 第三方组件，网页展示pdf组件
 * @class fish.desktop.widget.pdfjs
 * @extends fish.desktop.widget
 * @author miaocunzhi
 * @since V3.11.1
 * <pre>
 *   $(element).pdfjs(option);
 * </pre>
 *
 * 1. 直接 `script` 标签引入，需要引入 `path/fish-desktop/third-party/pdfjs/build/pdf.js` 和 `path/fish-desktop/third-party/pdfjs/fish.pdf.js`
 * 2. `AMD` 异步模块方式引入，先定义在 `requirejs` 的 `config` 配置里定义下 `paths` 信息，然后定义依赖引入 `path/fish-desktop/third-party/pdfjs/fish.pdf`
 *
 * ```js
 * requirejs.config({
 *     paths: {
 *         'pdfjs-dist': 'path/fish-desktop/third-party/pdfjs'
 *     }
 * })
 * require(['path/fish-desktop/third-party/pdfjs/fish.pdf'], function () {
 *     $("#the-canvas").pdfjs({
 *         ...
 *     });
 * })
 * ```
 */

/**
 * @event success
 * pdf加载成功后触发
 *
 * <pre>
 * $(element).pdfjs({
 *     url: './hello3.pdf',
 *     scale: 1.3,
 *     success:function(e,page) {
 *         //do something
 *     }
 * });
 * </pre>
 */
/**
 * @event printLoad
 * pdf加载成功后触发
 *
 * <pre>
 * $(element).pdfjs({
 *     url: './hello3.pdf',
 *     scale: 1.3,
 *     printLoad:function(e,loadPages) {
 *         //do something
 *     }
 * });
 * </pre>
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['pdfjs-dist/build/pdf'], factory);
    } else {
        if (window.PDFJS) {
            factory(window.PDFJS);
        } else {
            console.error('Please import pdf.js file')
        }
    }
})(function (PDFJS) {

    $.widget('ui.pdfjs', {
        options: {
            /**
             * 文件地址
             * @cfg {String} url 需要展示的文件地址
             */
            url: '',
            /**
             * 文件展示大小倍数
             * @cfg {Number} scale 默认1倍
             */
            scale:1,
            /**
             * 当前页数
             * @cfg {Number} pageNum 默认为1
             */
            pageNum:1,
            /**
             * 页码总数
             * @cfg {Number} countPages 由pdf页码决定（不可传）
             */
            countPages:''
        },


        _create: function () {
            this.pageRendering = false,
                this.pageNumPending = null,
                this.PRINT_RESOLUTION = 150;
            this.PRINT_UNITS = this.PRINT_RESOLUTION / 72.0;
            this.CSS_UNITS = 96.0 / 72.0;
            this.pdfDoc = null,
                this.pdfCanvas = document.createElement('canvas');
            this.pdfCtx = this.pdfCanvas.getContext('2d');
            this.element.append(this.pdfCanvas);
            this.initPdf();
        },

        initPdf:function(){
            var that = this;
            PDFJS.getDocument(this.options.url).then(function(pdfDoc_) {
                that.pdfDoc = pdfDoc_;
                that.options.countPages = pdfDoc_.numPages;
                that.renderPage(that.options.pageNum);
            }).then(function(){
                that._trigger("success", null, {nowPage:that.options.pageNum,countPages:that.options.countPages});
            });
        },

        renderPage:function(num){
            var that = this;
            this.pageRendering = true;
            // Using promise to fetch the page
            this.pdfDoc.getPage(num).then(function(page) {
                var viewport = page.getViewport(that.options.scale);
                that.pdfCanvas.height = viewport.height;
                that.pdfCanvas.width = viewport.width;
                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: that.pdfCtx,
                    viewport: viewport,
                    intent: 'print'
                };
                var renderTask = page.render(renderContext);

                // Wait for rendering to finish
                renderTask.promise.then(function() {
                    that.pageRendering = false;
                    if (that.pageNumPending !== null) {
                        // New page rendering is pending
                        that.renderPage(that.pageNumPending);
                        that.pageNumPending = null;
                    }
                });
            });
        },

        /**
         * @method goPage 跳转页面
         * @param {String} num 页面跳转，如果为“next”，下一页。如果为“prev”,上一页。如果为数字，跳转指定页
         */
        goPage:function(num){
            if(num == "next"){
                if (this.options.pageNum >= this.pdfDoc.numPages) {
                    return;
                }
                this.options.pageNum++;
            }else if(num == "prev"){
                if (this.options.pageNum <= 1) {
                    return;
                }
                this.options.pageNum--;
            }else if(!isNaN(Number(num))){
                if (Number(num) < 1 || Number(num) > this.pdfDoc.numPages) {
                    return;
                }
                this.options.pageNum = Number(num);
            }
            if (this.pageRendering) {
                this.pageNumPending = this.options.pageNum;
            } else {
                this.renderPage(this.options.pageNum);
            }
        },

        /**
         * @method printPages 打印（支持chrome和IE10以上）
         */
        printPages:function(){
            var that = this;
            var printDoc = null;
            var printContainer = document.createElement('div');
            printContainer.id = 'printContainer';
            document.body.appendChild(printContainer);
            var nowPage = 0;
            PDFJS.getDocument(this.options.url).then(function(pdfDoc_) {
                printDoc = pdfDoc_;
                var printCanvas = document.createElement('canvas');
                printCanvas.style.display = 'none';
                var printCtx = printCanvas.getContext('2d');
                that.renderImg(1, printDoc, printDoc.numPages, printCanvas, printCtx);
            });
        },
        renderImg: function(n, printDoc, numPages, printCanvas, printCtx) {
            var that = this;
            printDoc.getPage(n).then(function(page) {
                var viewport = page.getViewport(1);
                printCanvas.width = Math.floor(viewport.width * that.PRINT_UNITS);
                printCanvas.height = Math.floor(viewport.height * that.PRINT_UNITS);
                document.body.appendChild(printCanvas);
                // The physical size of the img as specified by the PDF document.
                var width = Math.floor(viewport.width * that.CSS_UNITS) + 'px';
                var height = Math.floor(viewport.height * that.CSS_UNITS) + 'px';

                var ctx = printCanvas.getContext('2d');
                ctx.save();
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(0, 0, printCanvas.width, printCanvas.height);
                ctx.restore();
                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: printCtx,
                    transform: [that.PRINT_UNITS, 0, 0, that.PRINT_UNITS, 0, 0],
                    viewport: viewport,
                    intent: 'print'
                };
                var renderTask = page.render(renderContext);

                // Wait for rendering to finish
                renderTask.then(function() {
                    var img = document.createElement('img');
                    img.style.width = width;
                    img.style.height = height;

                    if (('toBlob' in printCanvas) && !PDFJS.disableCreateObjectURL) {
                        printCanvas.toBlob(function(blob) {
                            img.src = URL.createObjectURL(blob);
                        });
                    } else {
                        img.src = printCanvas.toDataURL();
                    }
                    img.onload = function() {
                        var wrapper = document.createElement('div');
                        wrapper.setAttribute('dateImg', printContainer.children.length);
                        wrapper.appendChild(img);
                        printContainer.appendChild(wrapper);
                        that._trigger("printLoad", null, printContainer.children.length);
                        if (printContainer.children.length == numPages) {
                            printCanvas.parentNode.removeChild(printCanvas);
                            window.print();
                            printContainer.parentNode.removeChild(printContainer);
                        } else {
                            that.renderImg(printContainer.children.length + 1, printDoc, numPages, printCanvas, printCtx);
                        }
                    }

                });
            });
        }
    })
})
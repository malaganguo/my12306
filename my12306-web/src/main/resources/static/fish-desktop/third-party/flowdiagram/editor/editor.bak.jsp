<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <title></title>
  <%
    String basePath = request.getContextPath();
  %>
  <script type="text/javascript">
    window['g_GlobalInfo'] = window['g_GlobalInfo'] || {
              WebRoot : '${webRoot}' || '<%=basePath %>/'
            }
  </script>

  <link rel="Stylesheet" media="screen" href="${webRoot}css/editor.css" type="text/css"/>
  <script src="${basePath}lib/jquery.min.js"></script>
  <script src="${basePath}lib/jquery.min.map"></script>
  <script src="${basePath}lib/jquery-ui-1.10.3.custom.min.js"></script>
  <script src="${basePath}lib/jquery.autogrow-textarea.js"></script>
  <script src="${basePath}lib/prototype-1.5.1.js"></script>
  <script src="${basePath}lib/path_parser.js"></script>
  <script src="${basePath}i18n/translation_en_us.js"></script>
  <script src="${basePath}oryx.debug.js"></script>
  <script src="${basePath}zest.js"></script>
</head>
<body style="padding: 0;margin: 0;border: 0;width: 100%;height: 100%">
  <div id="bpmEditorContainer" style="padding: 0;margin: 0;border: 0;width: 100%;height: 100%;overflow: scroll;"></div>
</body>
  <script>
    jQuery(function(){
        if(window.parent){

            var editorDiv = "#bpmEditorContainer";

            //调用父类的初始方法
            var body = jQuery(document.body);

            var jqEditor = jQuery(editorDiv);
            jqEditor.width(body.width());
            jqEditor.height(body.height());

            //把zest的接口接入到父容器
            if(window.parent && window.parent['jQuery']){
              window.parent['jQuery'].zest = jQuery.zest;
            }

            jQuery.zest.callBackConatiner = window.parent;

            //调用编辑器初始化回调函数
            if(window.parent.loadEditorCallback && typeof  window.parent.loadEditorCallback == 'function'){
              window.parent.loadEditorCallback();
            }

            //窗口变大，缩小时
            jQuery(window).resize(function(){
              var self = jQuery(document.body);
              jqEditor.width(self.width());
              jqEditor.height(self.height());

              var ediProyx = jQuery.zest.getProxyInst(editorDiv);
              if(ediProyx){
                ediProyx.resize(self.width(),self.height());
              }
            })

        }

    });
  </script>
</html>

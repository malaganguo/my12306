var DataUtil = {
    /**
     * 根据标识父子关系的KEY以及父节点对应的value，把一个数组形成一棵树
     * 
     * @param srcData
     * @param selfField
     * @param parentField
     * @param topFlag
     * @returns {Array}
     */
    getTree : function(srcData, selfField, parentField, topFlag) {
        var tree = new Array();
        var dict = new Array();
        // add rood node
        var n = srcData.length;
        for ( var i = 0; i < n; i++) {
            var item = srcData[i];
            dict[item[selfField]] = item;
            if (item[parentField] == topFlag || item[parentField] == "" ) {
                tree[tree.length] = (item);// 添加根节点
            }
        }

        // 由下至上，构造树
        for ( var j = 0; j < n; j++) {
            var child = srcData[j];
            if (child[parentField] == topFlag || child[parentField] == "" ) {
                continue;
            }
            var parent = dict[child[parentField]];
            if (parent) {
                child.parent = parent;
                if (!parent.children) {
                    parent.children = new Array();
                }
                (parent.children)[parent.children.length] = (child);

            }
        }
        return tree;
    },

    /**
     * Determines whether or not the provided object is an array
     * 
     * @method isArray
     * @param {any}
     *            obj The object being testing
     * @return Boolean
     */
    isArray : function(obj) { // frames lose type, so test constructor string
        if (obj && obj.constructor
                && obj.constructor.toString().indexOf('Array') > -1) {
            return true;
        } else {
            return obj && DataUtil.isObject(obj)
                    && obj.constructor == Array;
        }
    },

    /**
     * Determines whether or not the provided object is a boolean
     * 
     * @method isBoolean
     * @param {any}
     *            obj The object being testing
     * @return Boolean
     */
    isBoolean : function(obj) {
        return typeof obj == 'boolean';
    },

    /**
     * Determines whether or not the provided object is a function
     * 
     * @method isFunction
     * @param {any}
     *            obj The object being testing
     * @return Boolean
     */
    isFunction : function(obj) {
        return typeof obj == 'function';
    },

    /**
     * Determines whether or not the provided object is null
     * 
     * @method isNull
     * @param {any}
     *            obj The object being testing
     * @return Boolean
     */
    isNull : function(obj) {
        return obj == null;
    },

    /**
     * Determines whether or not the provided object is a legal number
     * 
     * @method isNumber
     * @param {any}
     *            obj The object being testing
     * @return Boolean
     */
    isNumber : function(obj) {
        return typeof obj == 'number' && isFinite(obj);
    },

    /**
     * Determines whether or not the provided object is of type object or
     * function
     * 
     * @method isObject
     * @param {any}
     *            obj The object being testing
     * @return Boolean
     */
    isObject : function(obj) {
        return typeof obj == 'object' || DataUtil.isFunction(obj);
    },

    /**
     * Determines whether or not the provided object is a string
     * 
     * @method isString
     * @param {any}
     *            obj The object being testing
     * @return Boolean
     */
    isString : function(obj) {
        return typeof obj == 'string';
    },

    /**
     * Determines whether or not the provided object is undefined
     * 
     * @method isUndefined
     * @param {any}
     *            obj The object being testing
     * @return Boolean
     */
    isUndefined : function(obj) {
        return typeof obj == 'undefined';
    },

    /**
     * Determines whether or not the provided object is undefined
     * 
     * @method isDate
     * @param {any}
     *            obj The object being testing
     * @return Boolean
     */
    isDate : function(obj) {
        if (obj.constructor && obj.constructor.toString().indexOf('Date') > -1) {
            return true;
        } else {
            return DataUtil.isObject(obj) && obj.constructor == Date;
        }
    }
};
function getDomainName() {
    var url = document.URL;
    var index = url.indexOf("//");
    index = url.indexOf("/", index + 2);

    return url.substring(0, index);
};

var g_baseAppName = "callservice.do";
var webroot = document.location.href;
webroot = webroot.substring(webroot.indexOf('//') + 2, webroot.length);
webroot = webroot.substring(webroot.indexOf('/') + 1, webroot.length);
webroot = webroot.substring(0, webroot.indexOf('/'));
var g_GlobalInfo = "/"+webroot+"/";
var g_baseUrlDomain = g_GlobalInfo + g_baseAppName;
var g_urlMap = g_baseUrlDomain;
var xmlHttpResp;
var reCallFunc;
var isAsyQuery = false;

var Protocol = {
    Version: "R13",
    XML_HEAD: "version=\"1.0\" encoding=\"UTF-8\"",
    XML_ROOT: "zsmart",
    XML_SERVICE_NAME: "ServiceName",
    XML_DATA_ROOT: "Data",
    XML_ERROR_ROOT: "Error",
    XML_ARRAY_ITEM: "I",
    XML_DYN_QUERY_RESULT: "DR",
    XML_TAG_ARRAYLIST: "AL"
};

function addParam(fieldName, fieldValue, inputParams) {
    if (inputParams == null) {
        inputParams = new Array();
    }
    inputParams[inputParams.length] = {};
    inputParams[inputParams.length - 1][fieldName] = fieldValue;
};

var DataSetFilter = {
    addOrderField: function(fieldName, dataSetFilter) {
        if (dataSetFilter.OrderFields == null) {
            dataSetFilter.OrderFields = new Array();
        }
        dataSetFilter.OrderFields[dataSetFilter.OrderFields.length] = fieldName;
    },

    addShowField: function(fieldName, dataSetFilter) {
        if (dataSetFilter.ShowFields == null) {
            dataSetFilter.ShowFields = new Array();
        }
        dataSetFilter.ShowFields[dataSetFilter.ShowFields.length] = fieldName;
    }

};

function Packager(version) {
    this.version = version;
};

Packager.prototype.getObjectType = function(obj) {
    if (DataUtil.isNull(obj))
        return 'n';

    if (DataUtil.isArray(obj)) {
        return 'a';
    } else if (DataUtil.isFunction(obj)) {
        return 'm';
    } else if (DataUtil.isObject(obj)) {
        return 'o';
    } else {
        return 's';
    }
};

var _packager = new Packager('R11');
_packager.packageObject = function(elm, type, arg) {
    if (type == 'm' || type == 'n')
        return;

    switch (type) {
        case 'o':
            for (var key in arg) {
                var child = arg[key];
                var subtype = this.getObjectType(child);
                if (subtype == 'm' || subtype == 'n')
                    continue;

                var childElm = elm.ownerDocument.createElement(subtype + key);
                elm.appendChild(childElm);
                this.packageObject(childElm, subtype, child);
            }
            break;
        case 's':
            elm.appendChild(elm.ownerDocument.createTextNode(arg.toString()));
            break;
        case 'a':
            for (var i = 0; i < arg.length; i++) {
                var child = arg[i];
                var subtype = this.getObjectType(child);
                if (subtype == 'm' || subtype == 'n')
                    continue;

                var childElm = elm.ownerDocument.createElement(subtype + Protocol.XML_ARRAY_ITEM);
                elm.appendChild(childElm);
                this.packageObject(childElm, subtype, child);
            }
            break;
    }
};

_packager.getObjectFromXml = function(elm, type) {
    var obj = {};
    var nodes = elm.children();
    var len = nodes.length;
    if (len == 0) { // 如果此节点没有子节点了，说明节点到头了，则一定要返回一个text值了
        return elm.text();
    } else { // 有子节点则遍历此字节点
        nodes.each(function() {
            var key = this.tagName; // 取得节点的key
            if (key == Protocol.XML_TAG_ARRAYLIST && (type == null || type == "2" || type == 2)) { // 特殊情况的时候（节点为AL的时候）
                var childNodes = jQuery(this).children(); // childNodes为AL下面的子元素集合
                childNodes.each(function() { // 遍历AL下面的每个子元素
                    var childKey = this.tagName; // this代表每个DR，childKey表示DR
                    var childValue = _packager.getObjectFromXml(jQuery(this),
                        type);
                    if (obj[childKey]) {
                        if (DataUtil.isArray(obj[childKey])) {
                            obj[childKey].push(childValue);
                        } else {
                            var arr = [];
                            arr.push(obj[key]);
                            arr.push(childValue);
                            obj[childKey] = arr;
                        }
                    } else {
                        var arr = [];
                        arr.push(childValue);
                        obj[childKey] = arr;
                    }
                });
            } else {
                var value = _packager.getObjectFromXml(jQuery(this), type);
                if (obj[key]) {
                    if (DataUtil.isArray(obj[key])) {
                        obj[key].push(value);
                    } else {
                        var arr = [];
                        arr.push(obj[key]);
                        arr.push(value);
                        obj[key] = arr;
                    }
                } else {
                    obj[key] = value;
                }
            }
        });
    }
    return obj;
};

_packager.unpackageException = function(xmlNode) {
    var ex = {};
    ex.ID = jQuery("ID", xmlNode).text();
    ex.Time = jQuery("Time", xmlNode).text();
    ex.Type = jQuery("Type", xmlNode).text();
    ex.Code = jQuery("Code", xmlNode).text();
    ex.Desc = jQuery("Desc", xmlNode).text();
    ex.Trace = jQuery("Trace", xmlNode).text();
    return ex;
};

_packager.QueryResultToObject = function(result) {
    if (!result)
        return null;

    var arrTable = result[Protocol.XML_DYN_QUERY_RESULT];
    if (arrTable != null && DataUtil.isArray(arrTable)) {
        return arrTable;
    } else {
        var arr = [];
        if (arrTable) {
            arr[0] = arrTable;
        }
        return arr;
    }
};

function onReadyState(obj) {
    Remote.handleStateChange(obj);
};

function xmlDomToXmlString(xmlDom) {
    var xmlStr = xmlDom.xml;
    if (!xmlStr) {
        xmlStr = (new XMLSerializer()).serializeToString(xmlDom);
    }
    return xmlStr;
};

Remote = {
    sendXml: function(url, strXml) {
        var returnValue = null;
        jQuery.ajax({
            processData: false,
            async: false,
            type: "POST",
            contentType: "text/xml",
            url: url,
            data: strXml,
            dataType: "xml",
            success: function(msg) {
                returnValue = msg;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status != 200) {
                    throw "Network issue or remote server issue";
                } else {
                    throw "Exception";
                }
            }
        });
        return returnValue;
    },

    callRemoteFunction: function(serviceName, data, filter) {
        if (filter != null) {
            data.zsmart_query_page = new Object();
            data.zsmart_query_page.page_index = filter.PageIndex;
            data.zsmart_query_page.page_size = filter.PageLen;
            if (filter.OrderFields != null) {
                data.zsmart_query_page.order = filter.OrderFields;
            }
            if (filter.ShowFields != null) {
                data.zsmart_query_page.fields = filter.ShowFields;
            }
        }

        if (data == null) {
            data = new Object();
            data.zsmart_referer_url = window.location.href;
        } else {
            data.zsmart_referer_url = window.location.href;
        }

        var url = g_baseUrlDomain + "?service=" + serviceName;
        var xmlDoc = jQuery.parseXML("<xml></xml>");
        var docElm = xmlDoc.createElement(Protocol.XML_ROOT);
        var serviceNameElm = xmlDoc.createElement(Protocol.XML_SERVICE_NAME);
        serviceNameElm.appendChild(xmlDoc.createTextNode(serviceName));
        docElm.appendChild(serviceNameElm);
        var dataElm = xmlDoc.createElement(Protocol.XML_DATA_ROOT);
        var type = _packager.getObjectType(data);
        if (type == 'a' && arg.length == 0) {
            dataElm.setAttribute("t", 'o');
            _packager.packageObject(dataElm, 'o', null);
        } else {
            _packager.packageObject(dataElm, type, data);
        }
        docElm.appendChild(dataElm);
        var retValDoc = this.sendXml(url, ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + xmlDomToXmlString(docElm) + "\r\n"));

        var $retValJDOM = jQuery(retValDoc);
        var $rtNode = jQuery("zsmart Return", $retValJDOM).first();
        var retCode = $rtNode.attr("Code");
        switch (retCode) {
            case "0":
                { // Code属性值为0表示返回成功
                    var $dataNode = jQuery("zsmart Data", $retValJDOM).first();
                    var type = jQuery("zsmart Type", $retValJDOM).first().text();
                    if (jQuery.trim(type) == "")
                        type = null;
                    var obj = _packager.getObjectFromXml($dataNode, type);
                    return obj;
                }
            case "-1": // Code属性为-1表示返回不成功
                var ex = _packager.unpackageException($rtNode);
                if (ex != null && ex.Code) {
                    if (ex.Code == "S-SYS-00027" || ex.Code == "S-LOGIN-00001") {
                        window.location.href = g_GlobalInfo.WebRoot + "Error.jsp?Timeout=1";
                    } else if (ex.Code == "S-LOGIN-00002") {
                        window.location.href = g_GlobalInfo.WebRoot + "Error.jsp?Timeout=3";
                    } else {
                        throw ex;
                    }
                    break;
                } else {
                    throw ex;
                }
            default: // 返回一个错误
                throw "Remote server returns invalid xml";
        }
    },
    callRemoteAddLogFunction: function(partyCode, eventType, eventSrc,
        eventCode, comments) {
        if (g_GlobalInfo.AuditLog != "TRUE") {
            return;
        }
        var strEventType = "";
        switch (eventType) {
            case "A":
                strEventType = "Add";
                break;
            case "M":
                strEventType = "Modify";
                break;
            case "D":
                strEventType = "Delete";
                break;
            default:
                strEventType = eventType;
        }

        var objEventSrcMap = null;
        try {
            objEventSrcMap = g_EventSrcMap_en_US;

            var strEventSrc = objEventSrcMap[eventSrc];
            var obj = {};
            obj.PARTY_CODE = partyCode;
            obj.PARTY_TYPE = "A"; // 前台
            obj.EVENT_TYPE = strEventType;
            obj.EVENT_SRC = strEventSrc;
            obj.EVENT_CODE = eventCode;
            if (comments == null || comments == "")
                obj.COMMENTS = g_GlobalInfo.LogExtComments || "";
            else
                obj.COMMENTS = comments + "|" + (g_GlobalInfo.LogExtComments || "");
            obj.SRC_IP = REMOTE_IP;
            obj.DEST_IP = HOST_IP;
            var retObj = this.callRemoteFunction("AddLog", obj);
            return retObj;
        } catch (e) {
            return null;
        }
    },
    callRemoteQueryFunction: function(queryName, argObj, filter) {
        var data = {};
        var len = 0;

        if (Object.prototype.toString.apply(argObj) === '[object Object]') { //object
            $.extend(true, data, argObj);
        } else if (Object.prototype.toString.apply(argObj) === '[object Array]') { //array
            if (argObj != null)
                len = argObj.length;
            for (var i = 0; i < len; i++) {
                $.extend(data, argObj[i]);
            }
        }


        if (filter != null) {
            data.zsmart_query_page = new Object();
            data.zsmart_query_page.page_index = filter.PageIndex;
            data.zsmart_query_page.page_size = filter.PageLen;
            if (filter.OrderFields != null) {
                data.zsmart_query_page.order = filter.OrderFields;
            }
            if (filter.ShowFields != null) {
                data.zsmart_query_page.fields = filter.ShowFields;
            }
        }
        var retObj = this.callRemoteFunction(queryName, data);
        return _packager.QueryResultToObject(retObj);
    },
    callRemoteQueryCountFunction: function(queryName, argObj) {
        var data = {};
        var len = 0;
        if (argObj != null)
            len = argObj.length;

        for (var i = 0; i < len; i++) {
            $.extend(data, argObj[i]);
        }
        data.zsmart_query_page = new Object();
        data.zsmart_query_page.count = true;
        var retObj = this.callRemoteFunction(queryName, data);
        var ret = _packager.QueryResultToObject(retObj);
        if (ret != null && ret[0] != null) {
            return ret[0].CNT;
        } else {
            return 0;
        }
    },
    sendXmlAsync: function(url, strXml, successCallBack, hasMask) {
        jQuery.ajax({
            processData: false,
            async: true,
            type: "POST",
            contentType: "text/xml",
            url: url,
            data: strXml,
            dataType: "xml",
            success: successCallBack,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status != 200) {
                    if (hasMask) {
                        $.unblockUI();
                    }
                    throw "Network issue or remote server issue";
                } else {
                    if (hasMask) {
                        $.unblockUI();
                    }
                    throw "Exception";
                }
            }
        });
    },
    callRemoteFunctionAsync: function(serviceName, data, successCallBack, errorCallBack, hasMask, filter) {
        if (filter != null) {
            data.zsmart_query_page = new Object();
            data.zsmart_query_page.page_index = filter.PageIndex;
            data.zsmart_query_page.page_size = filter.PageLen;
            if (filter.OrderFields != null) {
                data.zsmart_query_page.order = filter.OrderFields;
            }
            if (filter.ShowFields != null) {
                data.zsmart_query_page.fields = filter.ShowFields;
            }
        }

        if (data == null) {
            data = new Object();
            data.zsmart_referer_url = window.location.href;
        } else {
            data.zsmart_referer_url = window.location.href;
        }

        var url = g_baseUrlDomain + "?service=" + serviceName;
        var xmlDoc = jQuery.parseXML("<xml></xml>");
        var docElm = xmlDoc.createElement(Protocol.XML_ROOT);
        var serviceNameElm = xmlDoc.createElement(Protocol.XML_SERVICE_NAME);
        serviceNameElm.appendChild(xmlDoc.createTextNode(serviceName));
        docElm.appendChild(serviceNameElm);
        var dataElm = xmlDoc.createElement(Protocol.XML_DATA_ROOT);
        var type = _packager.getObjectType(data);
        if (type == 'a' && arg.length == 0) {
            dataElm.setAttribute("t", 'o');
            _packager.packageObject(dataElm, 'o', null);
        } else {
            _packager.packageObject(dataElm, type, data);
        }
        docElm.appendChild(dataElm);

        if (hasMask) {
            $.blockUI({
                message: '<img src="webtechfrm/img/loading.gif" style="width:100px;height:20px;border-style: none;"/>'
            });
        }
        this.sendXmlAsync(url, ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + xmlDomToXmlString(docElm) + "\r\n"), function(data) {
            var retValDoc = data;
            var $retValJDOM = jQuery(retValDoc);
            var $rtNode = jQuery("zsmart Return", $retValJDOM).first();
            var retCode = $rtNode.attr("Code");
            switch (retCode) {
                case "0":
                    { // Code属性值为0表示返回成功
                        var $dataNode = jQuery("zsmart Data", $retValJDOM).first();
                        var type = jQuery("zsmart Type", $retValJDOM).first().text();
                        if (jQuery.trim(type) == "")
                            type = null;
                        var obj = _packager.getObjectFromXml($dataNode, type);
                        if (successCallBack && DataUtil.isFunction(successCallBack)) {
                            successCallBack(obj);
                        }
                        if (hasMask) {
                            $.unblockUI();
                        }
                        break;
                    }
                case "-1": // Code属性为-1表示返回不成功
                    if (hasMask) {
                        $.unblockUI();
                    }
                    var ex = _packager.unpackageException($rtNode);
                    if (ex !== null && ex.Code) {
                        if (ex.Code == "S-SYS-00027" || ex.Code == "S-LOGIN-00001") {
                            window.location.href = g_GlobalInfo.WebRoot + "Error.jsp?Timeout=1";
                        } else if (ex.Code == "S-LOGIN-00002") {
                            window.location.href = g_GlobalInfo.WebRoot + "Error.jsp?Timeout=3";
                        } else {
                            if (errorCallBack && DataUtil.isFunction(errorCallBack)) {
                                errorCallBack(ex);
                            }
                            //                          throw ex;
                        }
                        break;
                    } else {
                        if (errorCallBack && DataUtil.isFunction(errorCallBack)) {
                            errorCallBack(ex);
                        }
                    }
                default: // 返回一个错误
                    if (hasMask) {
                        $.unblockUI();
                    }
                    throw "Remote server returns invalid xml";
            }
        }, hasMask);
    },
    callRemoteQueryFunctionAsync: function(queryName, argObj, successCallBack, errorCallBack, hasMask, filter) {
        var data = {};
        var len = 0;
        if (argObj !== null)
            len = argObj.length;

        for (var i = 0; i < len; i++) {
            $.extend(data, argObj[i]);
        }
        if (filter !== null) {
            data.zsmart_query_page = new Object();
            data.zsmart_query_page.page_index = filter.PageIndex;
            data.zsmart_query_page.page_size = filter.PageLen;
            if (filter.OrderFields != null) {
                data.zsmart_query_page.order = filter.OrderFields;
            }
            if (filter.ShowFields != null) {
                data.zsmart_query_page.fields = filter.ShowFields;
            }
        }
        this.callRemoteFunctionAsync(queryName, data, function(data) {
            var retObj = data;
            retObj = _packager.QueryResultToObject(retObj);
            successCallBack(retObj);
        }, errorCallBack, hasMask, filter);
    }
};

fish.callRemoteFunction = function(serviceName, data, filter) {
    var result = Remote.callRemoteFunction(serviceName, data, filter);
    return result;
}

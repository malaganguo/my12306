/**
 * zest接口
 */
(function($,doc){

    //对象map映射
    $.ObjectMap = function(){
        this.keys = [];
    };

    $.ObjectMap.prototype.add = function(key,value){
        if(this.keys.indexOf(key) === -1){
            this.keys.push(key);
        }
        this[key] = value;
    };

    $.ObjectMap.prototype.get = function(key){
        return this[key];
    };

    $.ObjectMap.prototype.containKey = function(key){
        return this.keys.indexOf(key) !== -1 ? true : false;
    };

    $.ObjectMap.prototype.containValue = function(value){
        for(var i= 0,s=this.keys.length;i<s;i++){
            if(this[this.keys[i]] === value){
                return true;
            }
        }
        return false;
    };

    //Map映射数组
    MapArray = function(){
        this.data = [];
        this.dataMap = {};
        this.keys = [];
    };

    /**
     * 添加对象
     * @param {type} data
     * @param {type} key
     * @returns {undefined}
     */
    MapArray.prototype.push = function(data,key){
        if(typeof this.dataMap[key] === "undefined" || this.dataMap[key] == null){
            this.data.push(data);
            this.keys.push(key);

            this.dataMap[key] = this.data.length -1;
        }else{
            this.data[this.dataMap[key]] = data;
        }
    };

    MapArray.prototype.unshift = function(data,key){
        if(typeof this.dataMap[key] === "undefined" || this.dataMap[key] == null){
            this.data.unshift(data);
            this.keys.unshift(key);

            this.dataMap[key] = this.data.length -1;
        }else{
            this.data[this.dataMap[key]] = data;
        }
    };

    MapArray.prototype.pop = function(){
        var d,key;
        if(this.data.length > 0){
            d = this.data.pop();
            key = this.keys.pop();

            delete this.dataMap[key];
        }

        return d;
    };

    MapArray.prototype.shift = function(){
        var d,key;
        if(this.data.length > 0){
            d = this.data.shift();
            key = this.keys.shift();

            delete this.dataMap[key];
        }

        return d;
    };

    /**
     * 合并
     * @returns {zest_L4.MapArray.data}
     */
    MapArray.prototype.concat = function(mapArray){
        if(!mapArray) return;
        var self = this;

        jQuery.each(mapArray.dataMap,function(key,index){
            self.push(mapArray.data[index],key);
        });

    };

    /**
     * 把普通数组转换成映射数组
     * @param {type} array  普通数组
     * @param {type} dataKey    数据对象主键，或函数
     * @returns {undefined}
     */
    MapArray.prototype.parse = function(array,dataKey){
        if(!array || array.length == 0){
            return this;
        }
        var key ;
        var self = this;
        jQuery.each(array,function(index,data){
            if(dataKey){
                if(typeof dataKey == 'function'){
                    key = dataKey(data);
                }else{
                    key = data[dataKey];
                }
            }else{
                key = index;
            }

            self.push(data,key);
        });
    };



    //编辑器代理
    var EditProxy = function(id,editor,zest){
        this.id = id;

        //编辑器实例
        this.editor = editor;
        this.zest = zest;

        //编辑器是否已经加载
        this.editorLoad = false;
        //回调函数是否已经运行
        this.editorReadyRuned=false;

        //angular参数
        this.services = null;

        /**
         * 事件监听
         * eventName = {key1:[],key2:[]}
         * @type {Array}
         */
        this.eventList = {};

        /**
         * 是否在加载，在加载中的时候，某一些事件不会被触发
         * @type {boolean}
         */
        this.isLoadingPack = false;

        /**
         * 历史监控配置
         */
        this.moniterConfig = {
            nodeWidth : 85
            ,nodeHeight : 46
            //默认路由边的长度，即元素之间的距离
            ,edgeWidth : 80
            //节点上下之间的间距
            ,nodeHSpace : 15
            //第一个元素左边距
            ,left : 30
            //第一个元素上边距
            ,top : 600
        };

        /**
         * 工具函数
         */
        this.tools = {

            MapArray : MapArray,

             /**
            * 创建多节点，相同行的节点包
            * @param {type} editorProxy
            * @param {type} curNode
            * @returns {undefined}
            */
           createSameNode : function(editorProxy) {
               var tools = editorProxy.tools;
               var MapArray = tools.MapArray;

               var packNode = {
                   logId : ""
                   ,type : 2 //组合节点
                   ,nodeType : 1
                   ,nodes : new MapArray()  //原始节点
                   ,incomeNode : []
                   ,outputNode : []
                   ,resolve : false //节点是否已经被分解
               };

               return packNode;
           },



           /**
            * 根据原节点创建新节点
            * @param {type} editorProxy
            * @returns {EditProxy.tools.createNode.node}
            */
           copeSameNode : function(editorProxy,curNode){
               var tools = editorProxy.tools;
               var MapArray = tools.MapArray;
               var nodes = null;

               if(curNode.type == 2){
                   nodes = curNode.nodes;
               }else{
                   nodes = new MapArray();
                   nodes.push(curNode,curNode.logId);
               }

               return {
                   logId : curNode.logId
                   ,type : 2 //组合节点
                   ,nodeType : curNode.nodeType
                   ,nodes : nodes
                   ,incomeNode : []
                   ,outputNode : []
                   ,hasLine : false
               };
           },

           /**
            *  历史数据转换
            * @param {type} nodeConfig
            * @param {type} hisData
            * @returns
            */
           hisDataConvert : function(nodeConfig , hisData){

               if(!hisData){
                   return null;
               }

               return {
                   logId : hisData.logId
                   ,type : 1 //原始节点
                   ,nodeType : (hisData.toIds.length > 1 ? 2 : 1)
                   ,width : nodeConfig.nodeWidth
                   ,height : nodeConfig.nodeHeight
                   ,incomeNode : []  //入口节点
                   ,outputNode : [] //出口节点

                   ,packNode : null

                   ,data : hisData
                   ,resolve : false

               };

           },

           createPrintLine : function(editorProxy,preLine){
               var tools = editorProxy.tools;
               var MapArray = tools.MapArray;
               var config = editorProxy.moniterConfig;

               var pLine = {
                   startX : config.left //开始x坐标
                   ,startY : config.top  //开始y坐标
                   ,direction : "toRight"   //方向 toLeft   toRight
                   ,ranges : []  //所属范围
                   ,minLevel : 0 //最小层次号
                   ,width : 0
                   ,heigth : 0
               };

               if(preLine){
                   pLine.x = preLine.maxX;
                   pLine.y = preLine.maxY + config.nodeHSpace;
                   pLine.direction = ( "toRight" == preLine.direction  ? "toLeft" : "toRight");
               }

               return pLine;
            },

          /**
           * 创建范围
           * @param {type} editorProxy
           * @returns {undefined}
           */
          createRange : function(editorProxy){
            var tools = editorProxy.tools;
            var config = editorProxy.moniterConfig;

            var MapArray = tools.MapArray;
            return {
                cellCount : 1 //范围列数
                ,startCellIndex : 0
                ,endCellIndex : 0
                ,maxRowIndex : 0 //最小行号
                ,width : config.nodeWidth
                ,height : config.nodeHeight
                ,nodes : new MapArray()
            }
          },

          /**
           * 设置范围x,y坐标
           * @param {type} editorProxy
           * @param {type} printLine
           * @param {type} range
           * @param {type} startCellIndex
           * @returns {undefined}
           */
          setRangeXY : function(editorProxy,printLine,range,startCellIndex){
              var direction  = printLine.printLine;
              var startX = printLine.startX;
              var startY = printLine.startY;
              var x,y;
              if(range.nodes.data && range.nodes.data.length>0){
                    jQuery.each(range.nodes.data,function(index,node){
                        if(node.cellIndex === startCellIndex){
                            x = startX;
                        }else{
                            if(direction === "toRight"){
                                x = startX + (node.cellIndex - startCellIndex) * config.nodeWidth + (node.cellIndex - startCellIndex - 1) * config.edgeWidth;
                            }else{
                                x = startX - (node.cellIndex - startCellIndex) * config.nodeWidth - (node.cellIndex - startCellIndex - 1) * config.edgeWidth;
                            }
                        }
                        y = startY + (node.rowIndex -1) * config.nodeHeight + (node.rowIndex -1) * config.nodeHSpace;
                        node.x = x;
                        node.y = y;
                    });
              }
          },

          /**
           * 节点合并
           * @param {type} editorProxy
           * @param {type} firstNode
           * @param {type} nextNode
           * @returns {undefined}
           */
           mergeNode : function(editorProxy,firstNode,nextNode){
               var tools = editorProxy.tools;
               if(!firstNode && !firstNode){
                   return null;
               }

               if(!firstNode){
                   if(nextNode){
                       if(nextNode.type == 1){
                           return tools.copeSameNode(editorProxy,nextNode);
                       }else{
                           return nextNode;
                       }
                   }
               }

               if(!nextNode){
                   if(firstNode){
                       if(firstNode.type == 1){
                           return tools.copeSameNode(editorProxy,firstNode);
                       }else{
                           return firstNode;
                       }
                   }
               }

               if(firstNode.type ==1 ){
                   if(nextNode.type == 1){
                       var comNode = tools.copeSameNode(editorProxy,firstNode);
                       comNode.nodes.push(nextNode,nextNode.logId);
                       return comNode;
                   }else{
                       return nextNode.nodes.push(firstNode,firstNode.logId);
                   }
               }else{
                   if(nextNode.type == 1){
                       return firstNode.nodes.push(nextNode,nextNode.logId);
                   }else{
                       firstNode.nodes.concat(nextNode.nodes);
                       return firstNode
                   }
               }

           },

           /**
            * 新创建的元素newNode,更新targetNode的输入，输出关系
            * @param {type} editorProxy
            * @param {type} newNode 新创建的组合节点
            * @param {type} lastNode 组合节点最后一个节点
            * @returns {undefined}
            */
           replaceOutputNode : function(editorProxy,newNode,lastNode){
                if(!newNode){
                    return;
                }

                jQuery.each(newNode.outputNode,function(index,outNode){

                    var inNodes = outNode.incomeNode;

                    for(var i =0,s=inNodes.length;i<s;i++){
                        if(inNodes[i].logId === lastNode.logId){
                            outNode.incomeNode[i] =  newNode;
                        }
                    }
                });

           },

           /**
            * 更新，新创建的包与前一个节点的关系
            * @param {type} editorProxy
            * @param {type} newNode
            * @returns {undefined}
            */
           replaceIncomeNode : function(editorProxy,newNode){
               if(!newNode){
                   return;
               }

               jQuery.each(newNode.incomeNode,function(index,inNode){
                    var outputNode = inNode.outputNode;
                    for(var i =0,s=outputNode.length;i<s;i++){
                        if(outputNode[i].logId  === newNode.logId ){
                            outputNode[i] = newNode;
                        }
                    }
                });
           },

           /**
            * 创建行
            * @param {type} editorProxy
            * @param {type} startNode
            * @returns {EditProxy.tools.createLine.line}
            */
           createLine : function(editorProxy,startNode){
               var line = {
                   startNode:null
                   ,hasSubPack : false//是否存在子包
               };

               if(startNode){
                   line.startNode = startNode;
               }

               return line;
           },

           createPackLine : function(editorProxy){
               var packLine = {
                   aboveLines : []
                   ,middleLine : null
                   ,belowLines : []
                   ,hasSubPack : false//是否存在子包,任意一行存在子包
               };

               return packLine;
           },

           /**
            *
            * @param {type} editorProxy 编辑器实例
            * @param {type} hisData
            * @returns [startNode,startNode]   返回开始节点的数组
            */
           initHistoryData : function(editorProxy,hisDataMap,nodeMap,hisData){
               var tools = editorProxy.tools;
               var nodeConfig = editorProxy.moniterConfig;

               //历史数据映射
               if(hisData && hisData.length > 0){
                   jQuery.each(hisData,function(index,his){
                       hisDataMap[his.logId] = his;
                   });
               };

               //开始结点
               var startNodes = [];

               //输入输出线统计
               if(hisData && hisData.length > 0){
                   jQuery.each(hisData,function(index,his){
                       //主键
                       var logId = his.logId;

                       //创建当前节点
                       var curNode = nodeMap[logId];
                       if( !curNode ){
                           curNode = tools.hisDataConvert(nodeConfig,his);
                       }
                       var curNodeType = curNode.nodeType;

                       //统计输出结点
                       if(his && his.toIds.length > 0){
                           var nextNode;
                           jQuery.each(his.toIds , function(i , toId){
                               nextNode = nodeMap[toId];

                               //如果节点不存在，则创建，并缓存
                               if(!nextNode){
                                   nextNode = tools.hisDataConvert(nodeConfig,hisDataMap[toId]);
                                   nodeMap[toId] = nextNode;
                               }

                               //链表关联
                               nextNode.incomeNode.push(curNode);
                               curNode.outputNode.push(nextNode);

    //                           //如果当前结点类型为包，则所属包类型为当前结点
    //                           if(curNodeType === 2 ){
    //                               nextNode.packNode = curNode;
    //                           }

                           });
                       }

                       //缓存当前结点
                       nodeMap[logId] = curNode;
                   });
               }

               //搜索开始结节,入口元素为0的元素
               jQuery.each(nodeMap , function(toId,node){
                   if(node.incomeNode.length === 0){
                       startNodes.push(node);
                   }
               });

               return startNodes;
           }
            /**
             * 设置当前节点的高度和宽度
             * 当前规则：取默认元素大小，不分类型
             * @param {type} editorProxy
             * @param {type} curNode
             * @returns {undefined}
             */
            ,setNodeWH : function(editorProxy , curNode , Bpmn){
                var config = editorProxy.moniterConfig;

                curNode.width = config.nodeWidth;
                curNode.height = config.nodeHeight;
                if(curNode.nodeType === 2){
                    curNode.packWidth = 0;
                    curNode.packWidth = 0;
                }
            }
            /**
             * 返回历史记录的关键字
             * @param {type} editorProxy
             * @param {type} hisData
             * @returns {String}
             */
            ,getHisDataKey : function(editorProxy,hisData){
                return hisData ? hisData.logId : "";
            },

            createArray : function(editorProxy,cellSize){
                if(!cellSize){
                    cellSize = 20;
                }

                var as = [];
                for(var i =0;i<cellSize;i++){
                    as.push("");
                }

                return as;
            },

            /**
             * 创建矩阵
             * @param {type} editorProxy
             * @param {type} rowSize 行数量
             * @returns {undefined}
             */
            createPoint : function(editorProxy,rowSize,cellSize){
                var tools = editorProxy.tools;
                rowSize = rowSize ? 10 : rowSize;
                //矩阵
                var point = {rowSize : rowSize};
                var matrix = {};
                point["matrix"] = matrix;

                //矩阵初始化
                var upCount = parseInt(rowSize/2);
                var downCount = ( rowSize % 2 == 0 ) ?  parseInt(rowSize/2) - 1 : parseInt(rowSize/2);

                point["upCount"] = upCount;
                point["downCount"] = downCount;

                point["upIndex"] = upCount;
                point["downIndex"] = -downCount;

                cellSize = (typeof cellSize == 'undefined' ? 20 : cellSize);
                point["cellSize"] = cellSize;

                for(var i = 0,index=upCount;i<upCount;i++,index--){
                    matrix[index] = tools.createArray(editorProxy,cellSize);
                }

                matrix[0] = tools.createArray(editorProxy,cellSize);

                for(var i = 0,index= -1;i<downCount;i++,index--){
                    matrix[index] = tools.createArray(editorProxy,cellSize);
                }

                return point;
            },

            /**
             * 矩阵扩展
             * @param {type} editorProxy
             * @param {type} type         扩展类型    1:行扩展     2：列扩展    3：行列扩展
             * 扩展20
             * @returns {undefined}
             */
            extendPoint : function(editorProxy,point,type){
                var tools = editorProxy.tools;
                var index;
                //行扩展
                if(type === 1 || type === 3){
                    //添加10行
                    for(var i=1;i<=10;i++){
                        point.upIndex = point.upIndex + 1;
                        point.matrix[point.upIndex] = tools.createArray(editorProxy,point.cellSize);
                        point.upCount = point.upCount + 1;
                        point.rowSize = point.rowSize + 1;

                        point.downIndex = point.downIndex - 1;
                        point.matrix[point.downIndex] = tools.createArray(editorProxy,point.cellSize);
                        point.downCount = point.downCount + 1;
                        point.rowSize = point.rowSize + 1;
                    }

                }else if(type === 2 || type === 3){//列扩展
                    //列添加10列
                    var matrix = point.matrix;

                    jQuery.each(matrix , function(key,m){
                        matrix[key] = matrix[key].concat(tools.createArray(editorProxy,10));
                    });
                }
            },



            /**
             * 把附近相关联相同行的节点组合到一起
             * 从开始节点开始，至到包开始节点(包含) ，或 结束结点(不包含)
             * 注：输入线使用唯一的情况下
             * 调用方法：
             *      //如果开始节点是包节点调用方法
             *      parsePackNode(editorProxy,packNode,firstNode)
             *      //如果开始是普通节点调用方法
             *      parsePackNode(editorProxy,null,firstNode)
             * @param {type} editorProxy
             * @param {type} packNode  开始节点 (如果开始节点为包节点，则填写此参数)
             * @param {type} firstNode   下一个节点(如果开始节点)
             * @param {type} setResolve 是否设置分解标记
             * @returns {undefined}
             */
            parseSameNode : function(editorProxy,packNode,firstNode){
                var tools = editorProxy.tools;

                //创建相同行节点集合
                var sameNode = tools.createSameNode(editorProxy);

                //如果开始节点是包节点
                if(packNode){
                    sameNode.logId = packNode.logId;
                    sameNode.incomeNode = packNode.incomeNode;

                    tools.mergeNode(editorProxy,sameNode,packNode);
                    tools.mergeNode(editorProxy,sameNode,firstNode);

                }else{
                    sameNode.logId = firstNode.logId;
                    sameNode.incomeNode = firstNode.incomeNode;

                    tools.mergeNode(editorProxy,sameNode,firstNode);
                }

                //更新组节点与上一个节点的关系
                tools.replaceIncomeNode(editorProxy,sameNode);

                var curNode = firstNode,isBreak = false;
                var nextNode;

                //当前节点为非包节点，可测试下一个是否是属于同一行
                while(curNode.outputNode.length == 1 && isBreak === false ){
                    nextNode = curNode.outputNode[0];

                    //下一个节点输入数量为1，则属于同一行
                    if(nextNode.incomeNode && nextNode.incomeNode.length == 1){
                        tools.mergeNode(editorProxy,sameNode,nextNode);
                        curNode =  nextNode;
                    }else{
                        isBreak = true;
                    }
                }

                //统计输出节点
                var outputNode = [];
                if(curNode.outputNode && curNode.outputNode.length > 0){
                    jQuery.each(curNode.outputNode,function(index,node){
                        outputNode.push(node);
                    });
                    sameNode.outputNode = outputNode;

                    tools.replaceOutputNode(editorProxy,sameNode,curNode);
                }

                if(outputNode.length > 1){
                    sameNode.nodeType = 2;
                }

                return sameNode;
            },

            /**
             * 向矩阵map添加行元素
             * @param {type} editorProxy
             * @param {type} cellMap
             * @param {type} cellIndex
             * @param {type} hisData
             * @returns {undefined}
             */
            addNodeToCellMap : function(editorProxy,cellMap,cellIndex,hisData){
                var key = hisData.logId;
                var mapData = cellMap[cellIndex];
                if(!mapData){
                    cellMap[cellIndex] = mapData = {
                        dataMap : {}
                        ,dataList : []
                    };
                }

                //列宽
                cellMap.maxCellIndex = cellIndex > cellMap.maxCellIndex ? cellIndex : cellMap.maxCellIndex;

                var dataMap = mapData.dataMap;
                var dataList = mapData.dataList;

                if(!dataMap[key]){
                    dataMap[key] = hisData;
                    dataList.push(hisData);
                }

            },

            /**
             * 定义节点的列号
             * @param {type} editorProxy
             * @param {type} startNodes
             * @returns {undefined}
             */
            initNodeCellIndex : function(editorProxy,startNode){
                var tools = editorProxy.tools;
                var curNodes = [startNode];
                var nextNodes,node,nextNode;
                var incomes,income,canNext;
                var mxCellIndex;

                //创建矩阵
                var cellMap = {maxCellIndex:0};

                //把图形摆放到矩阵
                while(curNodes && curNodes.length > 0 ){
                    nextNodes = [];
                    //中间map，用于判断矩阵是否包含
                    var tempMap = {};

                    node = curNodes.shift();
                    while(node){
                        incomes = node.incomeNode;

                        //设置节点的列:序号
                        if(node == startNode){
                            node.cellIndex = 0;
                            node.canNext = true;
                            tools.addNodeToCellMap(editorProxy,cellMap,node.cellIndex,node);
                        }else if(incomes.length === 1){
                            node.cellIndex = incomes[0].cellIndex + 1;
                            node.canNext = true;
                            tools.addNodeToCellMap(editorProxy,cellMap,node.cellIndex,node);
                        }else if(incomes.length > 1){
                            mxCellIndex = 0;
                            canNext = true;
                            for(var i =0,s=incomes.length;i<s;i++){
                                income = incomes[i];
                                if(income.cellIndex){
                                    mxCellIndex = income.cellIndex > mxCellIndex ? income.cellIndex : mxCellIndex;
                                }else{
                                    canNext = false;
                                }
                            }

                            if(canNext){
                                node.cellIndex = mxCellIndex+1;
                                tools.addNodeToCellMap(editorProxy,cellMap,node.cellIndex,node);
                            }
                            node.canNext = canNext;
                        }

                        //下一步统计
                        if(node.nodeType === 1){
                            if(node.outputNode.length === 1 && node.canNext === true){
                                nextNode = node.outputNode[0];

                                if(!tempMap[nextNode.logId]){
                                    nextNodes.push(nextNode);
                                    tempMap[nextNode.logId] = nextNode;
                                }

                            }
                        }else{
                            if(node.outputNode && node.canNext === true ){
                                for(var i=0,s=node.outputNode.length;i<s;i++){
                                    nextNode = node.outputNode[i];

                                    if(!tempMap[nextNode.logId]){
                                        nextNodes.push(nextNode);
                                        tempMap[nextNode.logId] = nextNode;
                                    }
                                }
                            }
                        }

                        node = curNodes.pop();
                    };

                    curNodes = nextNodes;

                }

                return cellMap;
            }
            /**
             * 找到下一个列数量为1的节点
             * @param {type} editorProxy
             * @param {type} cellMap
             * @param {type} cellIndex
             * @returns {undefined}
             */
            ,getNextNode : function(editorProxy,cellMap,cellIndex){
                var nextNode,nextCellIndex;
                for(var i=cellIndex+1;i<=cellMap.maxCellIndex;i++ ){
                    if(cellMap[i].dataList.length == 1){
                        nextNode = cellMap[i].dataList[0];
                        nextCellIndex = i;
                        break;
                    }
                }

                if(nextNode){
                    return {node:nextNode,cellIndex:nextCellIndex};
                }else{
                    return;
                }
            }

            /**
             * 把并行的包分解，返回包的并行行链表
             * @param {type} editorProxy
             * @param {type} packNode
             * @param {type} endNode
             * @returns {undefined}
             */
            ,resolvePackAge : function(editorProxy,packNode,endNode){
                var outputNode = packNode.outputNode;
                var tools = editorProxy.tools;

                var curNode;
                //包对应的层关系
                var packLine = tools.createPackLine(editorProxy);
                var line;

                var index = parseInt(outputNode.length / 2);
                //是不是奇数行数量
                var isOddLength = outputNode.length % 2 == 1 ? true : false;
                //处理中间的行,如果包的输出数量为寄数，则取中间行
                //偶数，包节点点单独一行
                if(isOddLength){
                    curNode = outputNode[index];
                    packLine.middleLine = tools.resolveLine(editorProxy,packNode,curNode,endNode);
                }else{
                    packLine.middleLine = tools.resolveLine(editorProxy,packNode,null,endNode);
                }

                //分解上边的行
                for(var i = index+(isOddLength ? 1 : 0) ; i<outputNode.length;i++){
                    curNode = outputNode[i];
                    line = tools.resolveLine(editorProxy,null,curNode,endNode);
                    packLine.aboveLines.push(line);
                }

                //分解下边的行
                for(var i = index-1; i >= 0; i--){
                    curNode = outputNode[i];
                    line = tools.resolveLine(editorProxy,null,curNode,endNode);
                    packLine.belowLines.push(line);
                }

                //包的结束节点与中间行同层
                if(endNode){
                    if(packLine.middleLine && packLine.middleLine.startNode && packLine.middleLine.startNode.nodes){
                        if(endNode.type == 2){
                            packLine.middleLine.startNode.nodes.concat(endNode.nodes);
                        }else{
                            packLine.middleLine.startNode.nodes.push(endNode,endNode.logId);
                        }
                    }
                }

                return packLine;
            }

            /**
             * 获取行,并合并了相同行的节点
             * @param {type} editorProxy
             * @param {type} startNode
             * @param {type} endNode
             * @returns {undefined}
             */
            ,resolveLine : function(editorProxy,packNode,startNode,endNode){
                var tools = editorProxy.tools;

                var curNodes=[],nextNodes,nextMap,outputNode;
                var curNewNode,nextNewNode;
                //缓存，复制过后新节点
                var tempMap = {};
                //处理过的节点
                var execMap = {};
                var start;

                //先分解,设置前后关联关系
                if(packNode){
//                    if(packNode.resolve === true){
//                        return null;
//                    }

                    start = tools.copeSameNode(editorProxy,packNode);
                    tempMap[start.logId] = start;
                    packNode.resolve = true;

                    tempMap[start.logId] = start;

                    if(startNode && startNode.resolve === false){
                        var node = tools.copeSameNode(editorProxy,startNode);
                        tempMap[node.logId] = node;
                        startNode.resolve = true;

                        start.outputNode.push(node);
                        node.incomeNode.push(start);

                        if(startNode != endNode){
                            curNodes = [startNode];
                        }
                    }
                }else{
//                    if(startNode.resolve === true){
//                        return null;
//                    }
                    if(startNode && startNode.resolve === false){
                        start = tools.copeSameNode(editorProxy,startNode);
                        startNode.resolve = true;
                        tempMap[start.logId] = start;

                        curNodes = [startNode];

                        if(startNode != endNode){
                            curNodes = [startNode];
                        }
                    }
                }

//                //则结束节点与包开始节点的在同一行上
//                if(endNode){
//                    endNode.resolve = true;
//
//                    if(endNode.type == 2){
//                        start.nodes.concat(endNode.nodes);
//                    }else{
//                        start.nodes.push(endNode,endNode.logId);
//                    }
//                }

                //循环
                while(curNodes && curNodes.length > 0){
                    nextNodes = [];
                    nextMap = {};

                    jQuery.each(curNodes,function(index,curNode){
                        //处理过的节点不用再处理
                        if(!execMap[curNode.logId]){
                            execMap[curNode.logId] = curNode;

                            outputNode = curNode.outputNode;
                            curNewNode = tempMap[curNode.logId];
                            if(!curNewNode){
                                curNewNode = tools.copeSameNode(editorProxy,curNode);
                                curNode.resolve = true;
                                tempMap[curNode.logId] = curNewNode;
                            }

                            if(outputNode && outputNode.length > 0){
                                jQuery.each(outputNode,function(i,nextNode){
                                    if(nextNode.resolve === false && nextNode != endNode ){
                                        nextNewNode = tempMap[nextNode.logId];
                                        if(!nextNewNode){
                                            nextNewNode = tools.copeSameNode(editorProxy,nextNode);
                                            curNode.nextNode = true;
                                            tempMap[nextNode.logId] = nextNewNode;
                                        }

                                        curNewNode.outputNode.push(nextNewNode);
                                        nextNewNode.incomeNode.push(curNewNode);

                                        if(!nextMap[nextNode.logId]){
                                            nextNodes.push(nextNode);
                                            nextMap[nextNode.logId] = nextNode;
                                        }
                                    }
                                });
                            }
                        }
                    });

                    curNodes = nextNodes;
                }


                //把相同行的节点，合同成一个节点
                var hasSubPack = false;
                if(start){
    //                start = tools.parseSameNode(editorProxy,null,start);
                    curNodes = [start];
                    var curNodeMap;

                    //
                    while(curNodes && curNodes.length > 0 ){
                        nextNodes = [];
                        curNodeMap = {};

                        jQuery.each(curNodes,function(index,curNode){
                            if(curNode == start){
                                curNode = tools.parseSameNode(editorProxy,null,curNode);
                                start = curNode;
                            }else{
                                curNode = tools.parseSameNode(editorProxy,null,curNode);
                            }

                            outputNode = curNode.outputNode;

                            jQuery.each(outputNode,function(i,outNode){
                                if(!curNodeMap[outNode.logId]){
                                    nextNodes.push(outNode);
                                    curNodeMap[outNode.logId] = outNode;
                                }

                            });

                            if(outputNode.length > 1){
                                hasSubPack = true;
                            }

//                            //如果遇到包开始节点
//                            if(outputNode.length > 1){
//                                hasSubPack = true;
//                                jQuery.each(outputNode,function(i,outNode){
//                                    nextNodes.push(outNode);
//                                });
//                                //如果遇到结束节点
//                            }else if(curNode.incomeNode.length > 1){
//                                jQuery.each(outputNode,function(i,outNode){
//                                    nextNodes.push(outNode);
//                                });
//                            }

                        });

                        curNodes = nextNodes;
                    }
                }

                var line = tools.createLine(editorProxy,start);
                line.hasSubPack = hasSubPack;
                return line;
            }

            /**
             * 解析包的子行
             * @param {type} editorProxy
             * @param {type} packLine
             * @returns {undefined}
             */
            ,parsePackLine : function(editorProxy,packLine){
                var tools = editorProxy.tools;
                var newPackLine;

                //先处理中间的行
                if(packLine.middleLine && packLine.middleLine.hasSubPack === true){
                    newPackLine = tools.parseLine(editorProxy,packLine.middleLine);
                }else{
                    newPackLine = tools.createPackLine(editorProxy);
                    newPackLine.middleLine = packLine.middleLine;
                }

                var hasSubLine = true;
                //处理上面的行
                var aboveLines = newPackLine.aboveLines.concat(packLine.aboveLines);
                var newAboveLines;
                var aboveLine,newLine;
                while(hasSubLine){
                    hasSubLine = false;
                    newAboveLines = [];

                    for(var i =0, s = aboveLines.length; i<s ; i++ ){
                        aboveLine = aboveLines[i];

                        if(aboveLine.hasSubPack == true ){
                            newLine = tools.parseLine(editorProxy,aboveLine);

                            if(newLine.hasSubPack == true){
                                hasSubLine = true;
                            }

                            newAboveLines = newAboveLines.concat(newLine.belowLines);
                            if(newLine.middleLine){
                                newAboveLines.push(newLine.middleLine);
                            }
                            newAboveLines = newAboveLines.concat(newLine.aboveLines);

                        }else{
                            newAboveLines.push(aboveLine);
                        }
                    }

                    aboveLines = newAboveLines;
                }

                //处理下面的行
                var belowLines = newPackLine.belowLines.concat(packLine.belowLines);
                var newBelowLines,belowLine;

                hasSubLine = true;
                while(hasSubLine){
                    hasSubLine = false;
                    newBelowLines = [];

                    for(var i =0, s = belowLines.length; i<s ; i++ ){
                        belowLine = belowLines[i];

                        if(belowLine.hasSubPack == true ){
                            newLine = tools.parseLine(editorProxy,belowLine);

                            if(newLine.hasSubPack == true){
                                hasSubLine = true;
                            }

                            newBelowLines = newBelowLines.concat(newLine.aboveLines);
                            if(newLine.middleLine){
                                newBelowLines.push(newLine.middleLine);
                            }
                            newBelowLines = newBelowLines.concat(newLine.belowLines);

                        }else{
                            newBelowLines.push(belowLine);
                        }
                    }

                    belowLines = newBelowLines;
                }

//                //处理上面的行
//                var aboveLines = newPackLine.aboveLines;
//                var pLine;
//                for(var i = 0,s=packLine.aboveLines.length; i<s; i++){
//                    if(packLine.aboveLines[i].hasSubPack === true){
//                        pLine = tools.parseLine(editorProxy,packLine.aboveLines[i]);
//                        newPackLine.hasSubPack = (packLine.hasSubPack == true || pLine.hasSubPack == true ) ? true : false;
//
//                        aboveLines = aboveLines.concat(pLine.belowLines);
//                        if(pLine.middleLine){
//                            aboveLines.push(pLine.middleLine);
//                        }
//                        aboveLines = aboveLines.concat(pLine.aboveLines);
//                    }else{
//                        aboveLines.push(packLine.aboveLines[i]);
//                    }
//                }
//
//                var belowLines = newPackLine.belowLines;
//                //处理下面的行
//                for(var i = 0,s=packLine.belowLines.length; i<s; i++){
//                    if(packLine.belowLines[i].hasSubPack === true){
//                        pLine = tools.parseLine(editorProxy,packLine.belowLines[i]);
//                        newPackLine.hasSubPack = (packLine.hasSubPack == true || pLine.hasSubPack == true ) ? true : false;
//
//                        belowLines = belowLines.concat(pLine.aboveLines);
//                        if(pLine.middleLine){
//                            belowLines.push(pLine.middleLine);
//                        }
//                        belowLines = belowLines.concat(pLine.belowLines);
//                    }else{
//                        belowLines.push(packLine.belowLines[i]);
//                    }
//                }

                newPackLine.aboveLines = aboveLines;
                newPackLine.belowLines = belowLines;
                return newPackLine;
            }

            /**
             * 把line分解
             * @param {type} editorProxy
             * @param {type} line
             * @returns {undefined}
             */
            ,parseLine : function(editorProxy,line){
                var tools = editorProxy.tools;

                //创建包的行
                var packLine = tools.createPackLine(editorProxy);

                if(line.hasSubPack === false){
                    packLine.middleLine = line;
                    return packLine;
                }

                //创建列矩阵
                var cellMap = tools.initNodeCellIndex(editorProxy,line.startNode);
                var cellNodeCount = tools.statisticsCellNodeCount(editorProxy,cellMap);

                var startNode = line.startNode;
                var mapData,dataList,curNode,endNode;
                var curPackLine,prePackLine;

                //分解包
                for(var i =0,s=cellMap.maxCellIndex;i<=s;){

                    mapData = cellMap[i];
                    dataList = mapData.dataList;

                    //找到包的开始节点
                    if(dataList.length == 1 && dataList[0].outputNode.length > 1 ){
                        curNode = dataList[0];

                        //找到包的结束,或直到结束
                        for(var index = i+1;index<=cellMap.maxCellIndex;index++){
                            //如果搜索直完成，或间列节点作为包的结束节点
                            if(index == cellMap.maxCellIndex && cellNodeCount[index] !== 1){
                                endNode = null;

                                //先分解
                                curPackLine = tools.resolvePackAge(editorProxy,curNode,endNode);
                                //再解析
                                curPackLine = tools.parsePackLine(editorProxy,curPackLine);

                                //合并
                                curPackLine = tools.mergePackLine(editorProxy,prePackLine,curPackLine);
                                prePackLine = curPackLine;

                                i = index + 1;
                                break;
                            }else if(cellNodeCount[index] === 1){
                                endNode = cellMap[index].dataList[0];

                                //先分解
                                curPackLine = tools.resolvePackAge(editorProxy,curNode,endNode);
                                //再解析
                                curPackLine = tools.parsePackLine(editorProxy,curPackLine);

                                //合并
                                curPackLine = tools.mergePackLine(editorProxy,prePackLine,curPackLine);
                                prePackLine = curPackLine;

                                if(endNode.nodeType == 2){
                                    i = index;
                                }else{
                                    i = index + 1;
                                }
                                break;
                            }

                        }

                    }else{
                        i = i + 1;
                    }

                }

                return prePackLine;
            }

            /**
             * 两个单独的行进行合并
             * @param {type} editorProxy
             * @param {type} preLine
             * @param {type} curLine
             * @returns {undefined}
             */
            ,mergeLine : function(editorProxy,preLine,curLine){
                var tools = editorProxy.tools;
                if(!preLine && !curLine ){
                    return null;
                }

                if(!preLine && curLine ){
                    return curLine;
                }

                if(preLine && !curLine ){
                    return preLine;
                }

                preLine.startNode = tools.mergeNode(editorProxy,preLine.startNode,curLine.startNode);
                return preLine;
            }

            /**
             * 包的行合并
             * @param {type} editorProxy
             * @param {type} prePackNode
             * @param {type} curPackNode
             * @returns {undefined}
             */
            ,mergePackLine : function(editorProxy,prePackLine,curPackLine){
                var tools = editorProxy.tools;

                if(!prePackLine && !curPackLine){
                    return null;
                }

                if(prePackLine && !curPackLine){
                    return prePackLine;
                }

                if(!prePackLine && curPackLine){
                    return curPackLine;
                }

                var preMxCount = curPackLine.aboveLines.length > prePackLine.aboveLines.length ? curPackLine.aboveLines.length : prePackLine.aboveLines.length;
                var belowMxCount = curPackLine.belowLines.length > prePackLine.belowLines.length ? curPackLine.belowLines.length : prePackLine.belowLines.length;
                //创建新的
                var newPackLine = tools.createPackLine(editorProxy);

                //合并中间层
                newPackLine.middleLine = tools.mergeLine(editorProxy,prePackLine.middleLine,curPackLine.middleLine);

                //合并上面的层
                for(var i =0;i<preMxCount;i++){
                    newPackLine.aboveLines.push(tools.mergeLine(editorProxy,prePackLine.aboveLines[i],curPackLine.aboveLines[i]));
                }

                //合并下面的层
                for(var i =0;i<belowMxCount;i++){
                    newPackLine.belowLines.push(tools.mergeLine(editorProxy,prePackLine.belowLines[i],curPackLine.belowLines[i]));
                }

                return newPackLine;
            }

            ,getItemType : function(editorProxy,node){
                var nodeType = node.data.factivityType;

                return editorProxy.zest.getItemType(nodeType);
            }

            ,showNodesInfo : function(editorProxy,cellMap){
                //帮助函数
                var tools = editorProxy.tools;

                var showNode = function(node){
                    var rs = [];
                    rs.push("logId:"+node.logId);
                    rs.push("cellIndex:"+node.cellIndex);
                    rs.push("x:"+node.x);

                    rs.push("rowIndex:"+node.rowIndex);
                    rs.push("y:"+node.y);

                    console.info(rs.join(","));
                }

                for(var i =0 ;i<= cellMap.maxCellIndex;i++){
                    var dataList = cellMap[i].dataList;

                    if(dataList && dataList.length > 0){
                        jQuery.each(dataList,function(index,node){
                            showNode(node);
                        });
                    }
                }

            }

            ,drawNodes : function(editorProxy,nodeMap){
                //帮助函数
                var tools = editorProxy.tools;

                //创建节点
                jQuery.each(nodeMap,function(logId,curNode){
                    if(curNode && !curNode.oid && curNode.x && curNode.y){
                        var itemType = tools.getItemType(editorProxy , curNode);

                        //创建图形元素
                        var curOid = editorProxy.addNode(itemType,"",curNode.x,curNode.y);
                        curNode.oid = curOid;

                        //设置节点名称
                        var data = curNode.data;
                        var ud = editorProxy.getUserData(curOid);
                        ud.name = data.factivityName;
    //                    ud.name = curNode.logId;

                        editorProxy.setUserData(curOid,ud);

                    }
                });

                var outputNode;
                //创建连接线
                jQuery.each(nodeMap,function(logId,curNode){
                    outputNode = curNode.outputNode;
                    if(outputNode && outputNode.length > 0 && curNode.oid){
                        jQuery.each(outputNode,function(index,outNode){
                            if(outNode.oid){
                                editorProxy.addConnect("SequenceFlow","",curNode.oid , outNode.oid);
                            }
                        });
                    }
                });
            }

            ,setNodeRowIndex : function(editorProxy,node,rowIndex){
                if(node){
                    if(node.type == 2){
                        jQuery.each(node.nodes.data,function(index,node){
                            node.rowIndex = rowIndex;
                        });
                    }else{
                        node.rowIndex = rowIndex;
                    }
                }
            }

            /**
             * 设置包的行号
             * @param {type} editorProxy
             * @param {type} packLine
             * @param {type} endNode
             * @returns {undefined}
             */
            ,setPackLineRowIndex : function(editorProxy,packLine){
                //帮助函数
                var tools = editorProxy.tools;

                var middleLine = packLine.middleLine;
                tools.setNodeRowIndex(editorProxy,middleLine.startNode,0);

                var aboveLines = packLine.aboveLines;
                for(var i =0;i<aboveLines.length;i++){
                    tools.setNodeRowIndex(editorProxy,aboveLines[i].startNode,i+1);
                }

                var belowLines = packLine.belowLines;
                for(var i =0;i<belowLines.length;i++){
                    tools.setNodeRowIndex(editorProxy,belowLines[i].startNode,-(i+1));
                }

            }

            /**
             * 初始化行号
             * @param {type} editorProxy
             * @param {type} startNode
             * @returns {undefined}
             */
            ,initNodeRowIndex : function(editorProxy,startNode){
                //帮助函数
                var tools = editorProxy.tools;

                //创建列矩阵
                var cellMap = tools.initNodeCellIndex(editorProxy,startNode);
                var cellNodeCount = tools.statisticsCellNodeCount(editorProxy,cellMap);

                var preNode,curNode,endNode;
                var mapData,dataList;

                //扫描矩阵，把并行行转换
                for(var i =0,s=cellMap.maxCellIndex;i<=s;){
                    mapData = cellMap[i];
                    dataList = mapData.dataList;

                    //找到包的开始节点
                    curNode = dataList[0];

                    if(curNode.nodeType == 1){
                        tools.setNodeRowIndex(editorProxy,curNode,(preNode ? preNode.rowIndex : 0));
                        i = i + 1;
                    }else{
                        //找到包的结束,或直到结束
                        for(var index = i+1;index<=cellMap.maxCellIndex;index++){
                             //如果搜索直完成，或间列节点作为包的结束节点
                            if(index > cellMap.maxCellIndex && cellNodeCount[index] !== 1){
                                endNode = null;

                                var packLine = tools.resolvePackAge(editorProxy,curNode,endNode);
                                packLine = tools.parsePackLine(editorProxy,packLine);
                                tools.setPackLineRowIndex(editorProxy,packLine);

                                i = index + 1;
                                break;
                            }else if(cellNodeCount[index] === 1){
                                endNode = cellMap[index].dataList[0];

                                var packLine = tools.resolvePackAge(editorProxy,curNode,endNode);
                                packLine = tools.parsePackLine(editorProxy,packLine);
                                tools.setPackLineRowIndex(editorProxy,packLine);

                                if(endNode.nodeType == 2){
                                    i = index;
                                }else{
                                    i = index + 1;
                                }

                                break;
                            }

                        }

                    }


                }

            }

            /**
             * 统计列上包含节点数量
             * 注：如果列有跨列，中间的也需要统计，如此，可确定包的结束位置
             * @param {type} editorProxy
             * @param {type} cellMap
             * @returns {undefined}
             */
            ,statisticsCellNodeCount : function(editorProxy,cellMap){
                var countMap = {};
                var dataList,outNode;

                var maxCellIndex = cellMap.maxCellIndex;
                for(var i =0;i<=maxCellIndex;i++){
                    dataList = cellMap[i].dataList;
                    countMap[i] = dataList.length;
                }

                for(var i =0;i<=maxCellIndex;i++){
                    dataList = cellMap[i].dataList;
                    jQuery.each(dataList,function(index,node){
                        if(node.outputNode.length === 1){
                            outNode = node.outputNode[0];

                            //如果中间有间隔，则补齐
                            if( (outNode.cellIndex - node.cellIndex -1) >1 ){
                                for(var j=1,s=(outNode.cellIndex - node.cellIndex -1);j<=s;j++){
                                    countMap[node.cellIndex + j] = countMap[node.cellIndex + j] + 1;
                                }
                            }
                        }
                    });
                }

                return countMap;
            }

            ,setNodeXY : function(editorProxy,nodeMap){
                var tools = editorProxy.tools;
                var config = editorProxy.moniterConfig;

                //创建节点
                jQuery.each(nodeMap,function(logId,node){
                    if(typeof node.cellIndex  === 'number'){
                        node.x = config.left + node.cellIndex * config.edgeWidth + node.cellIndex * config.nodeWidth;
                    }

                    if(typeof node.rowIndex === 'number'){
                        node.y = config.top + node.rowIndex * config.nodeHSpace + node.rowIndex * config.nodeHeight;
                    }
                });

            }

            ,drawHistory : function(editorProxy,hisData){
                //帮助函数
                var tools = editorProxy.tools;
                var config = editorProxy.moniterConfig;

                var hisDataMap = {};
                var cellMap,cellNodeCount;
                var nodeMap = window.nodeMap = {};

                var canvas = editorProxy.editor.getCanvas();

                //画布的宽，高
                var canvasWidth = canvas.bounds.width();
                var canvasHeight = canvas.bounds.height();

                //开始节点集合
                var startNodes = tools.initHistoryData(editorProxy,hisDataMap,nodeMap,hisData);

                var printLine = [],preLine,curLine;

                var startCellIndex,endCellIndex;
                var startNodeCellMap = {};
                var startNodeCellCountMap = {};

                var maxNodeWidth = config.left + config.nodeWidth + config.edgeWidth;
                var packWidth;

                var mapData,dataList,range,node;
                var rangeListMap = {};

                //设置行号
                jQuery.each(startNodes,function(index,startNode){
                    cellMap = startNodeCellMap[startNode.logId];
                    cellNodeCount = startNodeCellCountMap[startNode.logId];

                    tools.initNodeRowIndex(editorProxy,startNode);
                });

                //搜索节点最大宽度，如果画布的宽度小于此宽度，则设置画布的宽度为此宽度
                jQuery.each(startNodes,function(index,startNode){
                    cellMap = tools.initNodeCellIndex(editorProxy,startNode);
                    cellNodeCount = tools.statisticsCellNodeCount(editorProxy,cellMap);

                    startNodeCellMap[startNode.logId] = cellMap;
                    startNodeCellCountMap[startNode.logId] = cellNodeCount;

                    var rangeList = [];
                    rangeListMap[startNode.logId] = rangeList;

                    //搜索最大范围段宽度(两个普通节点之间才能换行)
                    for(var i =0,s=cellMap.maxCellIndex;i<=s;){
                        mapData = cellMap[i];
                        dataList = mapData.dataList;

                        //如果是单列，且下一列的数量小于等于1
                        if(dataList.length == 1 && dataList[0].outputNode.length <= 1  ){
                            node = dataList[0];

                            range = tools.createRange(editorProxy);
                            range.maxRowIndex = node.rowIndex;
                            range.nodes.push(node,node.logId);
                            range.startCellIndex = i;
                            range.endCellIndex = i;
                            rangeList.push(range);

                            i = i + 1;
                        }else if(dataList.length == 1 && dataList[0].outputNode.length > 1){ //包的开始节点
                            node = dataList[0];

                            range = tools.createRange(editorProxy);
                            range.maxRowIndex = node.rowIndex;
                            range.nodes.push(node,node.logId);
                            range.startCellIndex = i;


                            for(var index = i +1;index<=s;index++){
                                mapData = cellMap[i];
                                dataList = mapData.dataList;

                                //找到第一个列数量为1，且(列号==结束列号，或输入数量为1)
                                if(index == s || (dataList.length === 1 && dataList[0].outputNode.length === 1)){
                                    jQuery.each(dataList,function(j,node){
                                        range.maxRowIndex = node.rowIndex > range.maxRowIndex ? node.rowIndex : range.maxRowIndex;
                                        range.nodes.push(node,node.logId);
                                    });

                                    range.endCellIndex = index;
                                    range.width = (range.endCellIndex - range.startCellIndex + 1) * config.nodeWidth + (range.endCellIndex - range.startCellIndex) * node.edgeWidth;
                                    maxNodeWidth = range.width > maxNodeWidth ? range.width : maxNodeWidth;

                                    rangeList.push(range);
                                    index = s + 1;
                                    break;
                                }else{
                                    jQuery.each(dataList,function(j,node){
                                        range.maxRowIndex = node.rowIndex > range.maxRowIndex ? node.rowIndex : range.maxRowIndex;
                                        range.nodes.push(node,node.logId);
                                    });

                                    index = index + 1;
                                }

                            }

                        }
                    }

                });

                var prePrintLine,curPrintLine,curX,range;
                var printLines = [];

                //分层
                jQuery.each(startNodes,function(index,startNode){
                    cellMap = startNodeCellMap[startNode.logId];
                    cellNodeCount = startNodeCellCountMap[startNode.logId];

                    var rangeList = rangeListMap[startNode.logId];

                    curPrintLine = tools.createPrintLine(editorProxy);
                    printLines.push(curPrintLine);

                    for(var i = 0 ,s = rangeList.length;i<s;i++){
                        range = rangeList[i];

                        if( (curPrintLine.width + range.width) < canvasWidth ){
                            curPrintLine.ranges.push(range);
                            curPrintLine.width = curPrintLine.width + range.width;
                        }else{
                            prePrintLine = curPrintLine;

                            curPrintLine = tools.createPrintLine(editorProxy,prePrintLine);
                            printLines.push(curPrintLine);
                            curPrintLine.ranges.push(range);
                            curPrintLine.width = curPrintLine.width + range.width;
                        }
                    }

                });

                //对每一层，把负数的行号整体移动，改为正数,并计算行的高度
                var totalHeight = 0;
                jQuery.each(printLines,function(index,printLine){
                    //统计最小行号
                    var maxRowIndex = 0;//最小行号
                    jQuery.each(printLine.ranges,function(i,range){
                        maxRowIndex = range.minRowIndex > maxRowIndex ? range.minRowIndex : maxRowIndex;
                    });

                    //把行号整体往上推进minRowIndex
                    jQuery.each(printLine.ranges,function(i,range){
                        var nodes = range.nodes.data;
                        jQuery.each(nodes,function(k,node){
                            node.rowIndex = Math.asb(node.rowIndex - (maxRowIndex +1));
                            maxRowIndex = node.rowIndex > maxRowIndex ? node.rowIndex : maxRowIndex;
                        });
                    });

                    printLine.height = maxRowIndex * config.nodeHeight + (maxRowIndex -1)*config.nodeHSpace;
                    totalHeight = totalHeight + printLine.height + config.nodeHSpace;
                });

                if(canvasWidth < maxNodeWidth) {
                    editorProxy.resize(maxNodeWidth ,totalHeight);
                }

                //设置节点的x,y坐标
                prePrintLine = null;
                var x,y,startCellIndex;
                jQuery.each(printLines,function(index,printLine){
                    if(prePrintLine){
                        printLine.startY = prePrintLine.startY + prePrintLine.heigth;

                        if(printLine.direction === "toRight"){
                            printLine.startX = prePrintLine.startX - prePrintLine.width;
                        }else{
                            printLine.startX = prePrintLine.startX + prePrintLine.width;
                        }
                    }

                    if(printLine.ranges && printLine.ranges.length > 0){
                        range = printLine.ranges[0];
                        startCellIndex = range.startCellIndex;

                        jQuery.each(printLine.ranges,function(i,range){
                            tools.setRangeXY(editorProxy,printLine,range,startCellIndex);
                        });
                    }

                });


//                tools.showNodesInfo(editorProxy,cellMap);
                tools.drawNodes(editorProxy,nodeMap);

            }

       };

    };

    /**
     * 绘制历史数据
     * @param {type} eventName
     * @param {type} funcName
     * @returns {undefined}
     */
    EditProxy.prototype.drawHistory = function(hisData){
        var self = this;
        var tools = this.tools;

        //配置信息
        var config = self.moniterConfig;

        self.changeState(self.zest.STATE_DISABLE);
        this.clear();
        tools.drawHistory(this,hisData);
        self.changeState(self.zest.STATE_READONLY);
    },

    /**
     * 添加回调函数
     * @param eventName     监听事件名
     * @param funcName      可以是函数名，也可是函数
     */
    EditProxy.prototype.addEvent = function(eventName,funcName){
        var self = this;
        var events = self.eventList[eventName];
        if(events){
            for(var i= 0,s=events.length;i<s;i++){
                if(events[i]===funcName){
                    events[i] = funcName;
                }
                return;
            }
            events.push(funcName);
        }else{
            self.eventList[eventName] = [funcName];
        }
    };

    /**
     * 移除监听器
     * @param eventName
     * @param funName
     */
    EditProxy.prototype.removeEvent = function(eventName,funcName){
        var self = this;
        var events = self.eventList[eventName];
        if(funcName){//如果funcName存在
            if(events){
                for(var i= 0,s=events.length;i<s;i++){
                    if(events[i]===funcName){
                        events.splice(i,1);
                    }
                    return;
                }
            }
        }else{//不存在，删除当前类型所有
            delete events;
        }

    };

    /**
     * 调用监听器
     * @param eventName  监听器名称
     * 之后为参数
     */
    EditProxy.prototype.fireJSEvent = function(eventName){
        //如果数据正在加载，则某一些事件不被触发
        if(this.isLoadingPack){
            return true;
        }

        var self = this;
        var eventName = arguments[0];
        var args = Array.prototype.slice.call( arguments, 1 );

        var events = self.eventList[eventName];
        if(!events){
            return;
        }
        for(var i= 0,s=events.length;i<s;i++){
            ev=events[i];
            if(typeof ev === 'function'){
                ev.apply(this,args);
            }else {
                //由于jquery的$不能使用需要替换
                if(ev.startsWith('$')){
                    ev = 'jQuery'+ev.substring(1);
                }

                var func = $.zest.getProperty(ev,jQuery.zest.callBackConatiner);
                if(func && typeof func === 'function'){
                    func.apply(this,args);
                }
            }
        }
    };


    /**
     * 卸载插件
     * @param pluginId
     */
    EditProxy.prototype.unloadPlugin = function(pluginId){
        var self = this;
        self.fireJSEvent($.zest.EVENT_PLUGIN_UNLOAD,pluginId);
    };

    /**
     *加载插件
     */
    EditProxy.prototype.loadPlugin = function(pluginId){
        var self = this;
        self.fireJSEvent($.zest.EVENT_PLUGIN_LOADING,pluginId);
        self.fireJSEvent($.zest.PLUGIN_LOAD_COMPLETE, pluginId);
    };

    /**
     * 从数据包内装载框图
     * @param pack 包文本,暂定为XML格式  可以是字符串对象，也可以是json对象
     * @param extendFlag 扩展标志，其意义由用户自定义，作为特殊功能标识
     */
    EditProxy.prototype.fromPack = function(strJson){
        this.isLoadingPack = true;

        if(!strJson){
            this.reset();
            return;
        }

        var jsonObj = strJson;
        if(typeof strJson === 'string'){
            jsonObj = $.parseJSON(strJson);
        }

        this.editor.importJSON(jsonObj);
        this.editor.setSelection([]);

        //清空命令集合
        var p = this.editor.getLoadedPlugin('ORYX.Plugins.Undo');

        if(p){
            p.clear();
        }

        this.isLoadingPack = false;
        return true;
    };

    /**
     * 获得当前框图的包文本
     */
    EditProxy.prototype.toPack = function(){
        return this.editor.getSerializedJSON();
    };

    /**
     *
     */
    EditProxy.prototype.undo =function(){
        var p = this.editor.getLoadedPlugin('ORYX.Plugins.Undo');

        if(p){
            p.doUndo();
        }
    };



    /**
     *
     */
    EditProxy.prototype.redo =function(){
        var p = this.editor.getLoadedPlugin('ORYX.Plugins.Undo');

        if(p){
            p.doRedo();
        }
    };


    /**
     * 是否可重复操作
     * 是否有可重复操作的命令
     */
    EditProxy.prototype.redoIsValid =function(){
        var p = this.editor.getLoadedPlugin('ORYX.Plugins.Undo');

        if(p){
            return p.redoStack.length>0;
        }

        return false;
    };

    /**
     * 是否可撤消操作
     * 是否有可撤消操作的命令
     */
    EditProxy.prototype.undoIsValid =function(){
        var p = this.editor.getLoadedPlugin('ORYX.Plugins.Undo');

        if(p){
            return p.undoStack.length>0;
        }

        return false;
    };

    /**
     * 获取属性数据
     * id必须带命名空间
     * 如 ：http://www.example.org/stencilset#ANode
     * @param nodeId
     */
    EditProxy.prototype.getUserData = function(nodeId){
        var canvas = this.editor.getCanvas();
        var node = canvas;
        if(nodeId){
            node = node.getChildShapeByResourceId(nodeId);
        }

        if(!node){
            node = this.editor.getCanvas();
        }

        var typeId = this.getTypeByOID(nodeId);

        var data = {};

        if(node){
            var keys = node.properties.keys();
            var ps = node.properties;
            var key;
            var newKey;
            for(var i= 0,s = keys.length;i<s;i++){
                key = keys[i];
                if(key.startsWith('oryx-') ){
                    newKey = key.replace('oryx-','');
                }else{
                    continue;
                }
                data[newKey] = ps[key];

            }
        }

        //对应flex版本类型
        data['el_type'] = typeId;
        data['type'] = typeId;
        data['resourceId'] = node.resourceId;

       //默认名称
//        if(!data['name']){
//            data['name'] = node.getStencil().idWithoutNs();
//        }

        canvas.update();
        return data;
    };

    /**
     * 设置属性数据
     * id必须带命名空间
     * 如 ：http://www.example.org/stencilset#ANode
     * @param nodeId
     * @param data
     */
    EditProxy.prototype.setUserData = function(nodeId,data){
        var canvas = this.editor.getCanvas();
        var node = canvas;
        if(nodeId){
            node = node.getChildShapeByResourceId(nodeId);
        }

        if(!node || !data){
            node = this.editor.getCanvas();
        }

        if(data){
            var newKey;
            for(var key in data){
                if(data.hasOwnProperty(key)){
                    if( !key.startsWith('oryx-') ){
                        newKey = 'oryx-'+ key;
                    }else{
                        continue;
                    }

                    node.setProperty(newKey,data[key],false);

                }
            }
        }

        canvas.update();

        return true;
    };

    /**
     * 改变状态
     * @param nodeId
     * @param data
     */
    EditProxy.prototype.changeState = function(state){
        this.editor.setState(state);
    };

    /**
     * 回滚状态
     */
    EditProxy.prototype.rollbackState = function(){

    };

    /**
     * 回滚状态
     */
    EditProxy.prototype.alignNodes = function(pattern){
        var oryxEditPlugin =this.editor.getLoadedPlugin('ORYX.Plugins.Arrangement');
        var type = $.zest.alignType[pattern];
        if(oryxEditPlugin && type){
            oryxEditPlugin.alignShapes(type);
        }
    };

    /**
     * 自动布局
     */
    EditProxy.prototype.tidy  = function(layoutStgy,layoutArgs){
        return true;
    };

    /**
     * 隐藏或显示导航窗口
     */
    EditProxy.prototype.showNavigation  = function(){
        return true;
    };

    /**
     * 返回版本
     */
    EditProxy.prototype.getZestVersion  = function(){
        return 'zest.1.1'
    };

    /**
     * 清空所有元素，根元素除外
     * @returns {undefined}
     */
    EditProxy.prototype.clear  = function(clearRoot){

        //先选择所有元素
        var canvas = this.editor.getCanvas();

        var allShapes = canvas.getChildShapes();
        this.editor.setSelection(allShapes);

        var oryxEditPlugin =this.editor.getLoadedPlugin('ORYX.Plugins.Edit');
        if(oryxEditPlugin){
            oryxEditPlugin.editDelete();
        }

        //清空根元素缓存数据
        if(clearRoot){
            canvas.clearProperties();
        }
    };

    /**
     * 清除所有元素,相当于一个新的模板
     */
    EditProxy.prototype.reset  = function(){

        this.clear(true);
    };


    /**
     * 获取滚动条水平位置
     */
    EditProxy.prototype.getHScrollPos  = function(){
        var cid = this.id;
        if(!cid.startsWith("#")){
            cid = '#' + cid;
        }
        var con = jQuery(cid);
        if(con.length>0){
            return con.scrollLeft();
        }
        return 0;
    };

    /**
     * 获取滚动条垂直位置
     */
    EditProxy.prototype.getVScrollPos = function(){
        var cid = this.id;
        if(!cid.startsWith("#")){
            cid = '#' + cid;
        }
        var con = jQuery(cid);
        if(con.length>0){
            return con.scrollTop();
        }
        return 0;
    };

    /**
     * 添加节点
     * @pattern nodeType 节点类型           --      如果是字符串：则当前是activiti类型，数字类型，则当成是flex类型
     * @pattern pluginSpace 废弃：传空就行
     * @pattern x x坐标
     * @pattern y y坐标
     * @pattern height 废弃
     * @pattern height 废弃
     */
    EditProxy.prototype.addNode  = function(nodeType,pluginSpace,x,y,width,height){
        if(jQuery.isNumeric(nodeType)){
            nodeType = jQuery.zest.getItemType(nodeType);
        }

        var pos = {'x':x,'y':y};
        var option = {};

        var parentNode = this.editor.getCanvas();
        //if(this.editor.selection.length>0){
        //    parentNode = this.editor.selection[0];
        //}
        //类型
        var namespace = this.editor.getStencilSets().values()[0].namespace();
        //var canvasStencil = ORYX.Core.StencilSet.stencil(stencilType);

        option['type'] = namespace + nodeType;
        option['namespace'] = namespace;
        option['position'] = pos;
        option['parent'] = parentNode;

        var commandClass = ORYX.Core.Command.extend({
            construct: function (option, currentParent, canAttach, position, facade) {
                this.option = option;
                this.currentParent = currentParent;
                this.canAttach = canAttach;
                this.position = position;
                this.facade = facade;
                this.editor = facade.getEditor();
                this.selection = this.facade.getSelection();
                this.shape;
                this.parent;

            },
            execute: function () {
                if (!this.shape) {
                    this.shape = this.facade.createShape(option);
                    var endTime = new Date();

                    this.parent = this.shape.parent;
                } else {
                    this.parent.add(this.shape);
                }

                //if (this.canAttach && this.currentParent instanceof ORYX.Core.Node && this.shape.dockers.length > 0) {
                //
                //    var docker = this.shape.dockers[0];
                //
                //    if (this.currentParent.parent instanceof ORYX.Core.Node) {
                //        this.currentParent.parent.add(docker.parent);
                //    }
                //
                //    docker.bounds.centerMoveTo(this.position);
                //    docker.setDockedShape(this.currentParent);
                //    //docker.update();
                //}

                //命令执行前，触发外部事件：选中前
                this.editor.dispatchEvent({type: jQuery.zest.EVENT_BEFORE_SELECT,oids: this.selection });

                this.facade.setSelection([this.shape]);
                this.facade.getCanvas().update();
                this.facade.updateSelection();

                //命令执行成功，触发外部事件：选中
                this.editor.dispatchEvent({type: jQuery.zest.EVENT_SELECTED,oids: [this.shape] });

            },
            rollback: function () {
                //命令执行前，触发外部事件：选中前
                this.editor.dispatchEvent({type: jQuery.zest.EVENT_BEFORE_SELECT,oids: this.editor.getSelection() });

                this.facade.deleteShape(this.shape);

                //this.currentParent.update();

                this.facade.setSelection(this.selection.without(this.shape));
                this.facade.getCanvas().update();
                this.facade.updateSelection();

                //命令执行成功，触发外部事件：选中
                this.editor.dispatchEvent({type: jQuery.zest.EVENT_SELECTED,oids: [] });

            }
        });

        // Update canvas
        var command = new commandClass(option,parentNode, false, pos,this.editor);


        this.editor.executeCommands([command]);

        //命令执行成功，触发外部事件：选中
        this.editor.dispatchEvent({type: jQuery.zest.EVENT_SELECTED,oids: [this.getSelected()[0]] });

        return this.getSelected()[0];
    };

    /**
     * 添加连接线
     */
    EditProxy.prototype.addConnect  = function(connectType,pluginSpace,sourceOID,targetOID,points){
        var c = this.editor.getCanvas();
        var facade = this.editor;
        var commandClass = ORYX.Core.Command.extend({
            construct: function (connectType, sourceOID, targetOID) {
                this.addConnect;
                this.sourceShape = c.getChildShapeByResourceId(sourceOID);
                this.targetShape = c.getChildShapeByResourceId(targetOID);

                this.edge;
                this.facade = facade;
                this.run_state = false;

                this.option = {
                    type : this.sourceShape ? (this.sourceShape.getStencil().namespace()+connectType) : ''
                    ,namespace : this.sourceShape ? this.sourceShape.getStencil().namespace() : ''
                };
            }
            ,execute: function () {
                if(!this.sourceShape || !this.targetShape){
                    this.run_state = false;
                    return this.run_state;
                }

                this.edge = this.facade.createShape(this.option);

                if(this.edge && this.edge instanceof ORYX.Core.Edge){
                    this.edge.dockers.first().setDockedShape(this.sourceShape);
                    this.edge.dockers.first().setReferencePoint(this.sourceShape.bounds.midPoint());
                    this.edge.dockers.last().setDockedShape(this.targetShape);
                    this.edge.dockers.last().setReferencePoint(this.targetShape.bounds.midPoint());

                    this.run_state = true;

                    this.facade.getCanvas().update();
                    this.facade.updateSelection();
                }else{
                    this.run_state = false;
                    return this.run_state;
                }

            }
            ,rollback: function () {
                if(this.edge) {
                    this.facade.deleteShape(this.edge);
                }
                //this.currentParent.update();
                this.facade.setSelection(this.facade.getSelection().without(this.edge));
            }
        });

        var command = new commandClass(connectType,sourceOID,targetOID);
        this.editor.executeCommands([command]);
    };

    /**
     * 移除节点
     */
    EditProxy.prototype.removeZestNode  = function(oid){
        //先选择所有元素
        var canvas = this.editor.getCanvas();
        var allShapes = canvas.getChildShapeByResourceId(oid);

        this.editor.setSelection(allShapes);

        EditProxy.prototype.removeZestSelected();

        //命令执行成功，触发外部事件：选中
        this.editor.dispatchEvent({type: jQuery.zest.EVENT_SELECTED,oids: [] });
    };

    /**
     * 移除连接线
     */
    EditProxy.prototype.removeZestConnect  = function(oid){
        EditProxy.prototype.removeZestNode(oid);

        this.editor.dispatchEvent({type: jQuery.zest.EVENT_SELECTED,oids: [] });
    };

    /**
     * 移除选择的元素
     */
    EditProxy.prototype.removeZestSelected  = function(){
        var oryxEditPlugin = this.editor.getLoadedPlugin("ORYX.Plugins.Edit");
        if(oryxEditPlugin){
            oryxEditPlugin.remove();
        }
    };

    /**
     * 获取插件状态
     */
    EditProxy.prototype.getPluginState  = function(){
        return "";
    };

    /**
     * 返回选中元素
     */
    EditProxy.prototype.getSelected  = function(){
        var sel = [];
        for(var i= 0,s=this.editor.selection.length;i<s;i++){
            if(this.editor.selection[i]){
                sel.push(this.editor.selection[i].resourceId)
            }
        }

        if(sel.length==0){
            sel.push(this.editor.getCanvas().id);
        }

        return sel;
    };

    /**
     * 设置选中节点
     */
    EditProxy.prototype.setSelected  = function(oid,triggerEvent){
        var ids = typeof oid == 'string' ? [oid] : oid;
        var nodes = [];
        var node;
        for(var i= 0,s=ids.length;i<s;i++){
            node = this.editor.getCanvas().getChildShapeByResourceId(ids[i]);
            if(node){
                nodes.push(node);
            }
        }

        triggerEvent = typeof triggerEvent == 'undefined' ? true : false;

        //命令执行前，触发外部事件：选中前
        if(triggerEvent && triggerEvent == true){
            this.editor.dispatchEvent({type: jQuery.zest.EVENT_BEFORE_SELECT,oids: this.getSelected()});
        }

        this.editor.setSelection(nodes,null,true);

        //命令执行成功，触发外部事件：选中
        if(triggerEvent && triggerEvent == true){
            this.editor.dispatchEvent({type: jQuery.zest.EVENT_SELECTED,oids:nodes});
        }
    };

    /**
     * 设置特性开关
     * featureId:特性开关标识
     * state : 特性开关标记
     */
    EditProxy.prototype.setFeature  = function(featureId,state){
        return true;
    };

    /**
     * 获取特性开关
     */
    EditProxy.prototype.getFeature  = function(featureId){
        return true;
    };

    /**
     * 获得节点类型
     * 格式：namespace#id
     * 如：UserTask
     * jsType : 是否返回js类型    默认为否
     */
    EditProxy.prototype.getTypeByOID  = function(oid,jsType){
        var shape = this.editor.getCanvas().getChildShapeByResourceId(oid);
        if(shape){
            var itemType = shape.getStencil().idWithoutNs();
            if(jsType){
                return itemType;
            }else{
                return $.zest.typeMap.get(itemType);
            }

        }

        if(jsType){
            return "BPMNDiagram";
        }else{
            return -1;
        }
    };

    /**
     * 获取节点名称
     */
    EditProxy.prototype.setNodeLabelByOID  = function(oid,text){
        var canvas = this.editor.getCanvas();
        var shape = canvas.getChildShapeByResourceId(oid);
        if(shape){
            shape.setProperty(jQuery.zest.lableProperty,text,true);
            //shape[jQuery.zest.lableProperty] = text;
            canvas.update();
            return true;
        }
        return false;
    };

    EditProxy.prototype.isConnect = function(oid){
        var shape = this.editor.getCanvas().getChildShapeByResourceId(oid);
        if(shape){
            if(shape && shape instanceof ORYX.Core.Edge) {
                return true;
            }
        }

        return false;
    };

    /**
     * 获得根容器对象Id
     */
    EditProxy.prototype.getRootContainerOID  = function(){
        return this.editor.getCanvas().resourceId;
    };

    /**
     * 是否是根节点,即画布节点
     */
    EditProxy.prototype.isRootNode = function(oid){
        if(jQuery.isArray(oid) && oid.length > 0 ){
            oid = oid[0];
        }

        var canvas = this.editor.getCanvas();
        if(oid && canvas.resourceId == oid){
            return true;
        }

        return false;
    };

    /**
     * 将框图导出为PNG格式Base64编码串
     */
    EditProxy.prototype.toPNG  = function(){

    };

    /**
     * 获得所有节点的OID
     */
    EditProxy.prototype.getAllNodes  = function(){
        //先选择所有元素
        var canvas = this.editor.getCanvas();
        var allShapes = canvas.getChildShapes();

        var ids = [];
        for(var i = 0,s = allShapes.length;i<s;i++){
            shape = allShapes[i];
            if(shape instanceof ORYX.Core.Node){
                ids.push(shape.resourceId);
            }

        }

        return ids;
    };

    /**
     * 获得所有节点的OID
     */
    EditProxy.prototype.getNodesByType  = function(nodeType,pluginSpace){
        //先选择所有元素
        var canvas = this.editor.getCanvas();
        var allShapes = canvas.getChildShapes();

        var ids = [];
        for(var i = 0,s = allShapes.length;i<s;i++){
            shape = allShapes[i];
            if(shape instanceof ORYX.Core.Node){
                type = this.getTypeByOID(shape.resourceId,true);
                typeName = type.indexOf('#') >-1 ? type.substring(type.indexOf('#')+1) : nodeType;
                if(typeName == nodeType){
                    ids.push(shape);
                }
            }

        }

        return ids;
    };

    /**
     * 获得所有联接的OID
     */
    EditProxy.prototype.getAllConnects  = function(){
        //先选择所有元素
        var canvas = this.editor.getCanvas();
        var allShapes = canvas.getChildShapes();

        var ids = [];
        for(var i = 0,s = allShapes.length;i<s;i++){
            shape = allShapes[i];
            if(shape instanceof ORYX.Core.Edge){
                ids.push(shape.resourceId);
            }

        }

        return ids;
    };

    /**
     * 自动布局
     */
    EditProxy.prototype.setLabel  = function(oid,text){
        this.setNodeLabelByOID(oid,text);
    };

    /**
     * 检查图形
     */
    EditProxy.prototype.checkDiagram  = function(){
        return true;
    };

    /**
     * 设置默认路由边
     */
    EditProxy.prototype.setDefaultConnect  = function(isDefalut){
        var selectedShape = this.editor.selection[0];
        var key = $.zest.defaultflow;
        var self = this;
        if(selectedShape){
            if(isDefalut){
                var incomingNodes = selectedShape.getIncomingShapes();
                if (incomingNodes && incomingNodes.length > 0) {
                    // get first node, since there can be only one for a sequence flow
                    var rootNode = incomingNodes[0];
                    var flows = rootNode.getOutgoingShapes();
                    if (flows && flows.length > 1) {
                        // in case there are more flows, check if another flow is already defined as default
                        for (var i = 0; i < flows.length; i++) {
                            if (flows[i].resourceId != selectedShape.resourceId) {
                                var ud = self.getUserData(flows[i].resourceId);
                                var defaultFlowProp = ud[key];
                                if (defaultFlowProp == '1') {
                                    ud[key] = '0';
                                    self.setUserData(flows[i].resourceId,ud);
                                }
                            }
                        }
                    }
                }
            }

            var ud = this.getUserData(selectedShape.resourceId);
            ud[key] = isDefalut ? '1' : '0';

            ud.conditionExpr = "";
            ud.conditionExprAlias = "";
            ud.conditionShow = "";

            self.setUserData(selectedShape.resourceId,ud);
        }
    };

    /**
     * 自动布局
     */
    EditProxy.prototype.getState  = function(){
        var sta = this.editor.state;

        return sta;
    };

    /**
     * 设置起始标记
     * @param oid 联接对象Id
     * @param marker 标记类型
     */
    EditProxy.prototype.setStartMarker  = function(oid,marker){
        return true;
    };

    /**
     *放大
     */
    EditProxy.prototype.zoomIn = function(){

        var oryxViewPlugin =this.editor.getLoadedPlugin('ORYX.Plugins.View');
        if(oryxViewPlugin){
            oryxViewPlugin.zoom([1.0 + ORYX.CONFIG.ZOOM_OFFSET]);
        }
    };

    /**
     *缩小
     */
    EditProxy.prototype.zoomOut = function(){

        var oryxViewPlugin =this.editor.getLoadedPlugin('ORYX.Plugins.View');
        if(oryxViewPlugin){
            oryxViewPlugin.zoom([1.0 - ORYX.CONFIG.ZOOM_OFFSET]);
        }
    };

    /**
     *缩小
     */
    EditProxy.prototype.zoomActual = function(){

        var oryxViewPlugin =this.editor.getLoadedPlugin('ORYX.Plugins.View');
        if(oryxViewPlugin){
            oryxViewPlugin.setAFixZoomLevel(1);
        }
    };

    /**
     *缩小
     */
    EditProxy.prototype.zoomFit = function() {

        var oryxViewPlugin = this.editor.getLoadedPlugin('ORYX.Plugins.View');
        if (oryxViewPlugin) {
            oryxViewPlugin.zoomFitToModel();
        }
    };

    EditProxy.prototype.addBendPoint = function(){
        var dockerPlugin = this.editor.getLoadedPlugin('ORYX.Plugins.AddDocker');
        var enableAdd = !dockerPlugin.enabledAdd();
        dockerPlugin.setEnableAdd(enableAdd);
        if (enableAdd)
        {
            dockerPlugin.setEnableRemove(false);
            document.body.style.cursor = 'pointer';
        }
        else
        {
            document.body.style.cursor = 'default';
        }
    };

    EditProxy.prototype.removeBendPoint = function(){
        var dockerPlugin = this.editor.getLoadedPlugin('ORYX.Plugins.AddDocker');
        var enableRemove = !dockerPlugin.enabledRemove();
        dockerPlugin.setEnableRemove(enableRemove);
        if (enableRemove)
        {
            dockerPlugin.setEnableAdd(false);
            document.body.style.cursor = 'pointer';
        }
        else
        {
            document.body.style.cursor = 'default';
        }
    };

    EditProxy.prototype.resize = function(width,height){
        if(width && height){
            var c = this.editor.getCanvas();
            c.setSize({width: width, height: height}, true);
        }
    };

    /**
     * 设置元素的运行状态(1,2,4-9),默认为1
     */
    EditProxy.prototype.setElementState = function(shapeStates){
        var canvas = this.editor.getCanvas();

        if(shapeStates && shapeStates.length > 0){
            jQuery.each(shapeStates,function(index,shapeState){
                var oid = shapeState.oid;
                var state = shapeState.state || 1;

                if(oid){
                    var shape = canvas.getChildShapeByResourceId(oid);
                    if(shape || shape instanceof ORYX.Core.Node){
                        shape.changeState(state);
                    }
                }
            });
        }

        canvas.update();
    };

     /**
     * 返回编辑器支持的元素信息，及分组信息
     * 返回信息的格式为
     * {
     *    groupInfo : {
     *      groupNames : [] //存放分组名称的数组
     *      groupName : [] // 分组名称为key,相对应的组成员数组
     *    }
     *    ,stencilMap : []
     * }
     */
    EditProxy.prototype.getStencilsInfo = function(){
        var editor = this.editor;

        /*
        //bpm支持的节点元素，及分组
        var groupInfo = {groupNames:[]};

        var stencilSets = editor.getStencilSets()[editor.defaultNamespace];
        var stencil;
        var groupName;
        var stencilMap = {};

        for(var i= 0,s=stencilSets._stencils.keys().length;i<s;i++){
            stencil = stencilSets._stencils[stencilSets._stencils.keys()[i]];
            stencilMap[stencil.idWithoutNs()] = stencil;

            groupName=stencil.groups()[0];

            if(stencil.type() == 'node' && !(stencil.idWithoutNs() == 'BPMNDiagram')){
                if(groupInfo.groupNames.indexOf(groupName) == -1 ){
                    groupInfo.groupNames.push(groupName);
                    groupInfo[groupName] = [];
                }

                groupInfo[groupName].push(stencil);
            }
        }

        return {
            groupInfo : groupInfo
            ,stencilMap : stencilMap
        };
        */
       var namespace = editor.defaultNamespace;
       var stencilSets = editor.getStencilSets()[namespace];
        //新的版本没有分组
        var groupInfo = {groupNames:[]};
        var stencilMap = [];

        //开始,结束结点
        stencilMap.push(stencilSets._stencils[namespace + "StartNoneEvent"]);
        stencilMap.push(stencilSets._stencils[namespace + "EndNoneEvent"]);

        //活动节点
        //stencilMap.push(stencilSets._stencils[namespace + "Activity"]);
        stencilMap.push(stencilSets._stencils[namespace + "UserTask"]);
        stencilMap.push(stencilSets._stencils[namespace + "ManualTask"]);
        stencilMap.push(stencilSets._stencils[namespace + "ScriptTask"]);
        stencilMap.push(stencilSets._stencils[namespace + "MailTask"]);
        //事件
//        stencilMap.push(stencilSets._stencils[namespace + "BoundaryInterruptingTimerEvent"]);
        stencilMap.push(stencilSets._stencils[namespace + "CatchTimerEvent"]);
        stencilMap.push(stencilSets._stencils[namespace + "CatchSignalEvent"]);
      //  stencilMap.push(stencilSets._stencils[namespace + "BoundarySignalEvent"]);
        stencilMap.push(stencilSets._stencils[namespace + "ThrowSignalEvent"]);

        //网关
        stencilMap.push(stencilSets._stencils[namespace + "InclusiveGateway"]);
        stencilMap.push(stencilSets._stencils[namespace + "ExclusiveGateway"]);
        stencilMap.push(stencilSets._stencils[namespace + "ParallelGateway"]);
       // stencilMap.push(stencilSets._stencils[namespace + "ComplexGateway"]);

        //其它
        stencilMap.push(stencilSets._stencils[namespace + "SubProcess"]);
        stencilMap.push(stencilSets._stencils[namespace + "EventSubProcess"]);

        //其它
        stencilMap.push(stencilSets._stencils[namespace + "TextAnnotation"]);

        return {
            groupInfo : groupInfo
            ,stencilMap : stencilMap
        };
    };

    /**
     * 图形元素替换，只能同类型元素之间进行替换
     * @param {type} oid    ：　旧的元素id
     * @param {type} x description : 新创建元素X坐标
     * @param {type} y description : 新创建元素Y坐标
     * @param {type} arrTypes   ： 替换成新的元素类型数组
     *            格式:[{ typeName : 新增元素类型(字符串，注：非原flex版本整形类型，如果是则需要进行转换：利用editorIns.zest.getItemType函数) ,data : 附加数据对象 },{}]
     * @param {okFunc}     返回新增元素ID数组
     *          格式：[{ oid : '新创建对象的ID' ,typeName : "" ,data : 附加数据对象	}]
     */
    EditProxy.prototype.replace = function(oid,x,y,arrTypes,okFunc){

        if(oid && jQuery.isArray(oid)){
            oid = oid.length > 0 ? oid[0] : "";
        }

        if(!jQuery.isArray(arrTypes)){

            if(typeof arrTypes === "string"){
                if(arrTypes){
                    var obj = {};
                    obj.typeName = arrTypes;

                    arrTypes = [obj];
                }else{
                    arrTypes = [];
                }
            }else{
                arrTypes = [];
            }
        }

        var command = new ORYX.Command.ShapeCommand.replaceCmd(
            {
                source : oid || ""
                ,x : x
                ,y : y
                ,targetTypes : arrTypes
                ,okFunc : okFunc
            }
            ,this.editor
        );

        this.editor.executeCommands([command]);

        //命令执行成功，触发外部事件：选中
        this.editor.dispatchEvent({type: jQuery.zest.EVENT_SELECTED,oids: this.editor.selection });
    };

    EditProxy.prototype.addActivity = EditProxy.prototype.replace;

    /**
     * 判断连接线是否可以配置条件变量
     * @param {type} oid
     * @returns {undefined}
     */
    EditProxy.prototype.canHasCondition = function(oid){

        var info = this.getFlowIncomingInfo(oid);

        var name = info.name;

        if(name === "ExclusiveGateway" || name === "InclusiveGateway" || name === "ComplexGateway"){
            return true;
        }

        return false;
    };

    /**
     * 返回元素的输出元素
     * @param {type} oid        目标元素
     * @param {type} onlyFlow   是否只返回路由边
     * @returns {undefined}
     */
    EditProxy.prototype.getOutcomingInfo = function(oid , onlyFlow){
        var reList = [];
        var self = this;

        if(!oid){
            return reList;
        }

        var canvas = this.editor.getCanvas();
        var node = canvas;
        if(oid){
            node = node.getChildShapeByResourceId(oid);
        }

        if(!node){
            node = this.editor.getCanvas();
        }

        if(!node){
            return reList;
        }

        var outNodes = node.getOutgoingShapes();

        $.each(outNodes,function(index,outNode){
            var name = outNode.getStencil().idWithoutNs();

            if(onlyFlow){
                if(name === "SequenceFlow"){
                    reList.push({
                        oid :  outNode.resourceId
                        ,stencil : outNode.getStencil()
                        ,name : name
                        ,el_type :  self.zest.getFlexItemType(name)
                    });
                }
            }else{

                reList.push({
                    oid :  outNode.resourceId
                    ,stencil : outNode.getStencil()
                    ,name : name
                    ,el_type :  self.zest.getFlexItemType(name)
                });
            }
        });

        return reList;
    };

    /**
     * 返回节点的入口图形
     * @param {type} oid
     * @returns {undefined}
     */
    EditProxy.prototype.getIncomingInfo = function(oid){
        var rs = [];
        var self = this;
        if(!oid){
            return rs;
        }

        var canvas = this.editor.getCanvas();
        var node = canvas;
        if(oid){
            node = node.getChildShapeByResourceId(oid);
        }

        if(!node){
            node = this.editor.getCanvas();
        }

        if(!node){
            return rs;
        }

        var inNodes = node.getIncomingShapes();
        var name;
        jQuery.each(inNodes,function(index,inNode){
            name = inNode.getStencil().idWithoutNs();
            rs.push({
                oid :  inNode.resourceId
                ,stencil : inNode.getStencil()
                ,name : name
                ,el_type :  self.zest.getFlexItemType(name)
            });
        });

        return rs;
    };

    /**
     * 返回附加节点
     * @param {type} oid
     * @returns {undefined}
     */
    EditProxy.prototype.getIncomingNodes = function(oid){
        var rs = [];
        var self = this;
        if(!oid){
            return rs;
        }

        var canvas = this.editor.getCanvas();
        var node = canvas;
        if(oid){
            node = node.getChildShapeByResourceId(oid);
        }

        if(!node){
            node = this.editor.getCanvas();
        }

        if(!node){
            return rs;
        }

        var inNodes = node.getIncomingNodes();
        var name;
        jQuery.each(inNodes,function(index,inNode){
            name = inNode.getStencil().idWithoutNs();
            rs.push({
                oid :  inNode.resourceId
                ,stencil : inNode.getStencil()
                ,name : name
                ,el_type :  self.zest.getFlexItemType(name)
            });
        });

        return rs;
    };

    /**
     * 返回路由边，入口图形类型信息
     * @param {type} oid
     * @returns {undefined}
     */
    EditProxy.prototype.getFlowIncomingInfo = function(oid){
        if(!oid){
            return {};
        }

        var canvas = this.editor.getCanvas();
        var node = canvas;
        if(oid){
            node = node.getChildShapeByResourceId(oid);
        }

        if(!node){
            node = this.editor.getCanvas();
        }

        if(!node){
            return {};
        }

        var name = node.getStencil().idWithoutNs();

        if(name === "SequenceFlow"){
            var inNodes = node.getIncomingShapes();
            var inNode = inNodes.length > 0 ? inNodes[0] : null;

            if(!inNode){
                return "";
            }

            name = inNode.getStencil().idWithoutNs();

            return {
                oid :  inNode.resourceId
                ,stencil : inNode.getStencil()
                ,name : name
                ,el_type :  this.zest.getFlexItemType(name)
            };
        }

        return {};
    };

    /**
     * 返回所有元素信息
     * @param {type} left
     * @param {type} top
     * @returns {undefined}
     */
    EditProxy.prototype.getAllNodesInfo = function(){
        var canvas = this.editor.getCanvas();
        var shapes = canvas.getChildShapes();

        var reList = [];
        var name;
        var self = this;

        if(shapes && shapes.length > 0){
            jQuery.each(shapes , function(index,node){

               name = node.getStencil().idWithoutNs();
               reList.push(
                    {
                        oid :  node.resourceId
                        ,stencil : node.getStencil()
                        ,name : name
                        ,el_type :  self.zest.getFlexItemType(name)
                    }
                );
            });
        }

        return reList;
    };

    EditProxy.prototype.getAllVariables = function(oid){
        var result = {
            globleVs:[],
            preVs :[]
        };

        var ud = this.getUserData();
        result.globleVs = ud.var_list;

        if(!oid){
            return result;
        }

        var income = this.getFlowIncomingInfo(oid);

        ud = this.getUserData(income.oid);

        result.preVs = ud.var_list;

        return result;
    };

    /**
     * 把图形的位置整体移动到位置lwft,top
     * @param {type} left
     * @param {type} top
     * @returns {undefined} {width: ,height}//返回图形中有效区域的大小
     */
    EditProxy.prototype.moveLeftTop = function(left,top){
        //获取默认位置
        var left = left ? left : (left===0 ? 0 : ORYX.CONFIG.DEFAULT_LEFT);
        var top = top ? top : (top===0 ? 0 : ORYX.CONFIG.DEFAULT_TOP);

        //计算当前元素的最小位置
        var minLeft=-1;
        var minTop=-1;
        var canvas = this.editor.getCanvas();
        var bounds;

        //遍历所有元素，统计最小位置
        jQuery.each(canvas.getChildShapes(),function(index,shape){
            bounds = shape.bounds;

            if(minLeft === -1 || bounds.a.x < minLeft){
                minLeft = bounds.a.x;
            }

            if(minTop === -1 || bounds.a.y < minTop){
                minTop = bounds.a.y;
            }
        });

        var leftDy = minLeft <= left ? 0 : (minLeft - left);
        var topDy = minTop <= top ? 0 : (minTop - top);

        leftDy = - leftDy;
        topDy = - topDy;

        var dockers;
        var docker;

        //区域的有效宽，高
        var width = 0 ,height = 0;

        //遍历所有元素，统计最小位置
        jQuery.each(canvas.getChildShapes(),function(index,shape){
            bounds = shape.bounds;

            bounds.moveBy(leftDy , topDy);
            width = bounds.b.x > width ? bounds.a.x : width;
            height = bounds.b.y > height ? bounds.b.y : height;

            //如果图形是连接线，则中间点也要移动
            if(shape instanceof ORYX.Core.Edge){
                dockers = shape.getDockers();
                if(dockers.length > 2){
                    for(i=1,s=dockers.length-1;i<s;i++){
                        docker = dockers[i];

                        docker.bounds.moveBy(leftDy , topDy);

                        width = bounds.b.x > width ? bounds.a.x : width;
                        height = bounds.b.y > height ? bounds.b.y : height;
                    }
                }
            }
        });

        canvas.update();

        return {width:width + left ,height:height + top};
    };

    /**
     * 自定义配置
     *
     *  quickNew : 元素新建的配置列表
     *  quickReplace ：替换元素列表
     *
     * 例：
        var config = {
            StartNoneEvent  : { quickNew : ["InclusiveGateway","ExclusiveGateway"] }
            ,InclusiveGateway : { quickReplace : ["ExclusiveGateway"] }
        }
     *
     * @param {type} jsonData 配置对象  {itemType : {//配置信息}}    itemType：元素类型
     * @returns {undefined}
     */
    EditProxy.prototype.config  = function(jsonData){
        var editor = this.editor;

        var toMap = function(configLs){
            var map = {};

            if(configLs && configLs.length > 0){
                jQuery.each(configLs , function(index,config){
                    var key = config.itemType;

                    if(key){
                        map[key] = config;
                    }
                });
            }

            return map;
        };

        var updateConfig = function(stencil,key,configData){

            //当前系统配置数据
            var stencilConfigArr = stencil.stencilConfig(key);
            var configMap = toMap(stencilConfigArr);

            var conLs = [];

            jQuery.each(configData,function(index,itemType){

                if(typeof itemType === "string"){
                    if(configMap[itemType]){
                        conLs.push(configMap[itemType]);
                    }
                }else{
                    conLs.push(itemType);
                }

            });

            stencil.stencilConfig(key , conLs);
        };

        if(jsonData){
            jQuery.each(jsonData,function(itemType , configData){
                var namespace = editor.defaultNamespace;
                var stencilSets = editor.getStencilSets()[namespace];
                var stencil = stencilSets._stencils[namespace + itemType];

                if(stencil){
                    if(configData){
                        $.each(configData , function(key , data ){
                            if( key === "quickNew" && $.isArray(data)){
                                updateConfig(stencil,key,data);
                            }else if(key === "quickReplace" && $.isArray(data)){
                                updateConfig(stencil,key,data);
                            }else{
                                stencil.stencilConfig(key , data );
                            }

                        });
                    }
                }
            });
        }

    };


        //映射关系
    var typeMap = new $.ObjectMap();
    typeMap.add("StartNoneEvent",						29);
    typeMap.add("StartTimerEvent",						40);

    typeMap.add("CatchSignalEvent",						72);
    typeMap.add("CatchMessageEvent",                                            35);
    typeMap.add("CatchTimerEvent",                                              43);

    typeMap.add("BoundaryInterruptingCancelEvent",                              63);
    typeMap.add("BoundaryInterruptingTimerEvent",                               44);
    typeMap.add("BoundaryInterruptingErrorEvent",                               61);
    typeMap.add("BoundaryInterruptingCompensationEvent",                        66);
    typeMap.add("BoundarySignalEvent",                                          74);

    typeMap.add("BoundaryNoneInterruptingTimerEvent",                           45);
//    typeMap.add("SignalEvent",                                                  73);

    typeMap.add("ThrowSignalEvent",						75);
    typeMap.add("ThrowCompensationEvent",					67);
    typeMap.add("ThrowMessageEvent",						38);
    typeMap.add("EndNoneEvent",							31);
    typeMap.add("EndErrorEvent",						62);
    typeMap.add("EndCancelEvent",						64);

    typeMap.add("UserTask",							0);
    typeMap.add("ManualTask",							4);
    typeMap.add("ScriptTask",							7);
    typeMap.add("MailTask",							8);
    typeMap.add("MessageTask",							9);
    typeMap.add("AutoTask",							3);
    typeMap.add("BusinessRuleTask",						5);
    typeMap.add("ServiceTask",							6);

    typeMap.add("Activity",							999);

    typeMap.add("SubProcess",							13);
    typeMap.add("EventSubProcess",						94);

    typeMap.add("ExclusiveGateway",						17);
    typeMap.add("ParallelGateway",						19);
    typeMap.add("InclusiveGateway",						20);
    typeMap.add("ComplexGateway",						21);

    typeMap.add("SequenceFlow",							14);
    typeMap.add("MessageFlow",							15);
    typeMap.add("Association",							16);

    typeMap.add("Pool",								25);
    typeMap.add("Lane",								26);

    typeMap.add("TextAnnotation",						27);

    $.zest={
        //事件回调事件
        EVENT_PLUGIN_LOAD_COMPLETE:"plugin_load_complete",
        EVENT_PLUGIN_LOAD_ERROR:"plugin_load_error",
        EVENT_PLUGIN_LOADING:"plugin_loading",
        EVENT_PLUGIN_UNLOAD:"plugin_unload",
        EVENT_PLUGIN_ALL_UNLOAD:"plugin_all_unload",
        EVENT_BEFORE_NODE_ADD:"before_node_add",
        EVENT_NODE_ADDED:"node_added",
        EVENT_BEFORE_NODE_REMOVE:"before_node_remove",
        EVENT_NODE_REMOVED:"node_removed",
        EVENT_BEFORE_NODE_MOVE:"before_node_move",//没有实现
        EVENT_NODE_MOVED:"node_moved",//没有实现
        EVENT_BEFORE_CONNECT_ADD:"before_connect_add",//没有实现
        EVENT_CONNECT_ADDED:"connect_added",//没有实现
        EVENT_SHAPE_DBCLICK : "shape_dbclick",//图形双击
        EVENT_BEFORE_CONNECT:"before_connect",
        EVENT_CONNECTED:"connected",
        EVENT_BEFORE_REMOVE_CONNECT:"before_remove_connect",
        EVENT_CONNECT_REMOVED:"connect_removed",
        EVENT_BEFORE_SELECT:"before_select",
        EVENT_SELECTED:"selected",
        EVENT_ABSORPTION:"absorption",//吸纳
        EVENT_ERROR:"zest-error",
        ALIGN_LEFT:0,
        ALIGN_RIGHT:1,
        ALIGN_TOP:2,
        ALIGN_BOTTOM:3,
        ALIGN_CENTER:4,
        ALIGN_MIDDLE:5,
        STATE_NORMAL:0,
        STATE_CONNECT:1,
        STATE_DISABLE:2,
        STATE_READONLY:3,
        STATE_ABSORPTION:4,
        LAYOUT_TREE:0,
        PLUGIN_STATE_ERROR:-1,
        PLUGIN_STATE_NONE:0,
        PLUGIN_STATE_NOT_LOADED:1,
        PLUGIN_STATE_LOADING:2,
        PLUGIN_STATE_LOADED:3,
        TYPE_RECTANGLE:1,
        TYPE_ELLIPSE:2,
        TYPE_FENCE:3,
        TYPE_HPOOL:4,
        TYPE_VPOOL:5,
        TYPE_RHOMBUS:6,
        TYPE_DATA:7,
        TYPE_CIRCLE:8,
        TYPE_CONNECT:50

        //编辑器配置
        ,defaultEditId : '#canvasSection'
        //空模板
        ,tempDateUrl:''
        //标题对应属性KEY
        ,lableProperty : 'oryx-name'
        //默认路由属性KEY
        ,defaultflow : 'isDefault'
        //应用根路径
        ,basePath : ""
        //编辑器实例,id=>实例
        ,editors : {}
        //编辑器是否被初始化
        ,editorInitialized:false
        //注册回调函数运行环境，默认当前window
        ,callBackConatiner : window
        //类型对应
        ,typeMap :typeMap
        //元素状态
        ,url : {
            temp_module_url :  '/editor/module.json'
            ,stencil_set_url :  '/editor/stencilset.json?version=' + Date.now()
            ,plugins_url :  '/editor/plugins.xml'
        }
        //编辑器加载完成回调函数
        ,editorLoadReady:null
        //参考 ORYX.CONFIG.EDITOR_ALIGN_
        ,alignType : {0:0x08,1:0x20,2:0x04,3:0x01,4:0x10,5:0x02}

        //创建编辑器实例时的配置，实际上是一个份空的数据格式
        ,config : {
            fullscreen : false
            ,model : {
                properties : {}
                ,stencil : {id: "BPMNDiagram"}
                ,stencilset : {
                    url : "stencilsets/bpmn2.0/bpmn2.0.json"
                    ,namespace : "http://b3mn.org/stencilset/bpmn2.0#"
                }
                ,childShapes : []
            }
        }

        ,setBasePath : function(basePath){
            this.basePath = basePath;

            this.url.temp_module_url = basePath + '/editor/module.json';
            this.url.stencil_set_url = basePath + '/editor/stencilset.json';
            this.url.plugins_url = basePath + '/editor/plugins.xml';

        }

        //事件函数初始化
        ,initEvent : function(editProxy){
            var self = this;
            if(editProxy){
                var editor = editProxy.editor;
                editor.registerOnEvent($.zest.EVENT_BEFORE_NODE_ADD,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)});
                editor.registerOnEvent(
                    $.zest.EVENT_NODE_ADDED
                    ,function(eventObj){
                        editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)
                    }
                );
                editor.registerOnEvent($.zest.EVENT_BEFORE_NODE_REMOVE,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)});
                editor.registerOnEvent($.zest.EVENT_NODE_REMOVED,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)});
                editor.registerOnEvent($.zest.EVENT_BEFORE_NODE_MOVE,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)});
                editor.registerOnEvent($.zest.EVENT_NODE_MOVED,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)});

                editor.registerOnEvent($.zest.EVENT_BEFORE_CONNECT_ADD,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)});
                editor.registerOnEvent($.zest.EVENT_CONNECT_ADDED,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)});
                editor.registerOnEvent($.zest.EVENT_BEFORE_CONNECT,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)});
                editor.registerOnEvent($.zest.EVENT_CONNECTED,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)});
                editor.registerOnEvent($.zest.EVENT_BEFORE_REMOVE_CONNECT,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)});
                editor.registerOnEvent($.zest.EVENT_CONNECT_REMOVED,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)});

                //双击事件
                editor.registerOnEvent($.zest.EVENT_SHAPE_DBCLICK
                    ,function(eventObj){
                        editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID);
                    },[0,3]
                );

                 /**
                 * 选中，选中前外部事件处理
                 * eventObj.oids    :
                 *   或   字符串:id  >   选择元素id
                 *   或   为空，或[] >    选择根节点
                 *   或   ['字符串:id'/图形对象]
                 * @param {type} eventObj
                 * @returns {undefined}
                 */
                var getIdsFunc = function(shapes){
                    if(shapes === "string" ){
                        return [shapes];
                    }else{
                        var ids = [];

                        if(shapes && shapes.length > 0){
                            jQuery.each(shapes,function(index,shape){
                                if(typeof shape === "string"){
                                    ids.push(shape);
                                }else{
                                    ids.push(shape.resourceId);
                                }
                            });
                        }else{
                            var canvas = editProxy.editor.getCanvas();
                            ids = [canvas.resourceId];
                        }

                        return ids;
                    }

                };


                editor.registerOnEvent($.zest.EVENT_BEFORE_SELECT
                    ,function(eventObj){
                        //原选择节点元素
                        var oids = getIdsFunc(eventObj.oids);

                        //当前选中节点元素
                        var curSel = getIdsFunc(eventObj.curSel);

                        editProxy.fireJSEvent(eventObj.type,curSel , oids);
                    }
                    ,[0,3]
                );
                editor.registerOnEvent($.zest.EVENT_SELECTED
                    ,function(eventObj){
                        //原选择节点元素
                        var oids = getIdsFunc(eventObj.oids);

                        editProxy.fireJSEvent(eventObj.type, oids);
                    }
                    ,[0,3]
                );
                //挂载吸纳
                editor.registerOnEvent($.zest.EVENT_ABSORPTION,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.posx,eventObj.posy)});
                editor.registerOnEvent($.zest.EVENT_ERROR,function(eventObj){editProxy.fireJSEvent(eventObj.type,eventObj.targetNodeOID)} ,[0,3]);
            }
        }
        //添加编辑器代理实例
        ,addEditor : function(id,editorProxy){
            if(!id){
                return false;
            }

            if(!id.startsWith("#")){
                id = "#" + id;
            }

            this.editors[id] = editorProxy;

//            this.initEvent(editorProxy);
        }

        ,delEditor : function(id){
            delete this.editors[id];
        }
        /**
         * 设置zest准备就绪回调函数
         * @param {function} [funEditor] Zest编辑器代理准备就绪回调函数，此参数可为null
         * @param {function} [funViewer] Zest查看器代理准备就绪回调函数，此参数可为null
         * @return {boolean} 如果回调函数设置成功返回true，否则返回false
         */
        ,ready:function(funEditor,funViewer){
            this.editorLoadReady = funEditor || funViewer;
        }
        /**
         * 获得编辑器或查看器实例
         * @method
         * @param  {string} id 容器DOM元素Id
         * @return {ZestProxy} 如果容器Id有效则返回{@link ZestProxy}实例，否则返回null
         * @example <caption>获得框图代理组件实例</caption>
         * var proxy=$.zest.getProxyInst("DIVorBODYId");
         */
        ,getProxyInst:function(id){
            if(!id){
                return false;
            }

            if(!id.startsWith("#")){
                id = "#" + id;
            }

            var editProxy = this.editors[id];
            if(editProxy){
                return editProxy;
            }else{
                null;
            }
        }

        //加载数据
        ,fetchModel : function (id,moduleUrl){}

        //工具函数:返回对象context下路径属性
        ,getProperty : function(proPath,obj){
            if(!proPath || !obj){
                return {};
            }

            var names = proPath.split('.');
            for(var i= 0,s=names.length;i<s;i++){
                name = names[i];
                obj = obj[name];

                if(!obj){
                    return {};
                }
            }
            return obj;
        }
        /**
         * 执行操作
         * 在editor-app/configuration/toolbar.js定义
         * 在editor-app/toolbar-controller.js重写本方法
         */
        ,execAction :function(actionName){

        }
        //获取原flex元素类型对应的activiti类型
        ,getItemType : function(flexItemType){
            if(!flexItemType){
                return "";
            }

            var typeMap = this.typeMap;
            if(typeMap.keys){
                var key ;
                for(var i = 0,s= typeMap.keys.length;i<s;i++){
                    key = typeMap.keys[i];
                    if(typeMap[key] == flexItemType){
                        return key;
                    }
                }
            }

            return "";
        }

        //获取activiti类型对应的原flex元素类型
        ,getFlexItemType : function(itemType){
            if(!itemType){
                return "";
            }

            var typeMap = this.typeMap;
            return typeMap[itemType];
        }

        /**
         * 节点被创建后，附加功能
         * 主要用于：类型的增补等
         * 以前一定要使用getUserData,setUserData设置
         */
        ,createShapeAddOn : function(shape){
            var stencil = shape.getStencil();
            var shapeType = stencil.idWithoutNs();
            var el_type = jQuery.zest.getItemType(shapeType);
//            var name = stencil.idWithoutNs();

            //设置默认的属性
            shape.setProperty("oryx-el_type",el_type,false);
            shape.setProperty("oryx-type",el_type,false);
            shape.setProperty("oryx-name","",false);
        },

        createEditor : function(zestProxy,editorContainerId,config,funcLoadCallback){

            if(!$.zest.editorInitialized) {
                ORYX._loadPlugins();
            }

            if(!editorContainerId){
                editorContainerId = this.defaultEditId;
            }

            if(!editorContainerId){
                ORYX.Log.info('editor of html element id is null!');
                return false;
            }

            var editor = new ORYX.Editor(editorContainerId,jQuery.zest.basePath,jQuery.zest.config);
            var editorProxy = new EditProxy(editorContainerId,editor,jQuery.zest);
            this.addEditor(editorContainerId,editorProxy);

            if(zestProxy){
                zestProxy.addEditor(editorContainerId,editorProxy);
            }

            //属性配置
            if(config && config.state){
                editorProxy.changeState(config.state);
            }

            //添加事件
            this.initEvent(editorProxy);

            var funcLoadCallback = funcLoadCallback || this.editorLoadReady;
            if(funcLoadCallback){
                //funcLoadCallback.call(null,editorProxy);
                funcLoadCallback(editorProxy);
            }

            editorProxy.editorLoad=true;
            editorProxy.editorReadyRuned = true;

            editorProxy.fireJSEvent($.zest.EVENT_PLUGIN_LOAD_COMPLETE);

            return editorProxy;

        }

    };
})(jQuery,document);

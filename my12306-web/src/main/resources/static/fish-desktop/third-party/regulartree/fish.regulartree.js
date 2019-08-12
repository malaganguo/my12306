/**
 * 第三方组件，规则树控件<br>
 * @class fish.desktop.widget.RegularTree
 * @since V3.10.0
 */
/**
 * 新增节点
 * @method addNode
 * @param  {Object} nodeData 新增的节点数据
 * <pre>
 *     var regtree = new RegularTree('规则树dom元素的id属性值');
 *     //增加根节点
 *     regtree.addNode({
 *         FIELD: 'A',
           OPER: '>',
           VALUE: '1'
 *     })
 *     //增加非根节点
 *     regtree.addNode({
 *         OP: 'OR',
 *         FIELD: 'A',
           OPER: '>',
           VALUE: '1'
 *     })
 * </pre>
 */
/**
 * 编辑节点
 * @method editNode
 * @param  {Object} nodeData 修改后的节点数据
 * <pre>
 *     var regtree = new RegularTree('规则树dom元素的id属性值');
 *     //编辑条件节点
 *     regtree.editNode({
 *         FIELD: 'A',
           OPER: '>',
           VALUE: '1'
 *     })
 *     //编辑条件节点
 *     regtree.editNode({
 *         OP: 'OR'
 *     })
 * </pre>
 */
/**
 * 删除节点
 * @method delNode
 * <pre>
 *     var regtree = new RegularTree('规则树dom元素的id属性值');
 *     //选中一个节点，再执行下面的代码
 *     regtree.delNode()
 * </pre>
 */
/**
 * 获取规则树所有节点的数据
 * @method listAllNodeObjs
 * @return {Array} 返回所有节点的数据
 * <pre>
 *     var regtree = new RegularTree('规则树dom元素的id属性值');
 *
 *     regtree.listAllNodeObjs()
 * </pre>
 */
/**
 * 将规则树转换成表达式
 * @method treeToExpression
 * @return {String} 返回具体的表达式
 * <pre>
 *     var regtree = new RegularTree('规则树dom元素的id属性值');
 *
 *     regtree.treeToExpression()
 * </pre>
 */
/**
 * 将表达式转换成规则树
 * @method expressionToTree
 * @param {String} expression 待转换的表达式
 * @return {Array} data 构造规则树的数据源
 * <pre>
 *     var regtree = new RegularTree('规则树dom元素的id属性值'),
 *         expression = '(E<=3||(B!=4&&(A<1||C>=2))||D>5)';
 *
 *     var treeData = regtree.expressionToTree(expression)
 *     regtree.loadNodes(treeData)
 * </pre>
 */
/**
 * 添加选中节点事件的监听函数
 * @method addSelectedListener
 * @param  {Function} fn 监听函数，该函数接受当前选中节点作为自己的唯一参数
 * <pre>
 *     var regtree = new RegularTree('规则树dom元素的id属性值');
 *
 *     regtree.addSelectedListener(function(node) {
           console.log(node);
       });
 * </pre>
 */
;(function (factory){
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        window.RegularTree = factory();
    }
})(function(){
    function RegularNode(expObj, seq, type, tree) {
        this.tree = tree;
        this.type = type;
        this.nodeId = seq;
        this.obj = expObj;
        this.childrenNode = [];

        this.p_node = null;
        this.p_cell = null;
        this.p_block = null;
    }

    RegularNode.prototype.addChildNode = function(node) {
        node.p_node = this;
        this.childrenNode.push(node);
    };

    RegularNode.prototype.delChildNode = function(nodeId) {
        var findNode = false;
        for (var i = 0; i < this.childrenNode.length; i++) {
            if (nodeId == this.childrenNode[i].nodeId) {
                findNode = true;
                this.childrenNode.splice(i, 1);
            }
        }
        if (!findNode) {
            fish.warn(nodeId + " index of children is -1.");
        }
    };

    RegularNode.prototype.findBrotherNode = function(node) {
        var p_Node = node.p_node, childs = [];
        if (!!p_Node) {
            for (var i = 0; i < p_Node.childrenNode.length; i++) {
                if (node.nodeId != p_Node.childrenNode[i].nodeId) {
                    childs.push(p_Node.childrenNode[i]);
                }
            }
        }
        return childs.length > 0 ? childs : null;
    };

    RegularNode.prototype.getHtmlObj = function() {
        var tree = this.tree;
        var node = this;
        var spanW = document.createElement("span");
        spanW.setAttribute("class", "i-checks reg-radio-group");

        var radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", "decision_node_name");
        radio.setAttribute("isFilterRadio", "Y");
        radio.setAttribute("style",'vertical-align:middle;');
        radio.onclick = function(e) {
            tree.selectedNode = node;

            if (!!tree.selectedFuncton) {
                tree.selectedFuncton(node);
            }
        };
        spanW.appendChild(radio);
        spanW.appendChild(document.createElement("i"));

        var spanN = document.createElement("label");
        spanN.setAttribute("style",'vertical-align:middle;margin:0px 10px 0px 10px;');

        if (this.type == "OP") {
            spanN.innerHTML = this.obj.OP;
        } else if (this.type == "EX") {
            if (Object.prototype.toString.call(this.obj.VALUE) === "[object Array]") {
                this.obj.VALUE = '(' + this.obj.VALUE.join(',&nbsp;') + ')';
            }
            spanN.innerHTML = this.obj.FIELD + '&nbsp;' + this.obj.OPER + '&nbsp;' + this.obj.VALUE;
        } else {
            spanN.innerHTML = "ERROR";
        }

        spanW.appendChild(spanN);

        return spanW;
    };

    function RegularTree(container, emptyTip) {

        $("#" + container).html("");

        this.container = container;
        this.emptyRecords = $("<div class='rg-empty-records'></div>").html(emptyTip || fish.getResource("common.emptyrecords"));
        $("#" + container).append(this.emptyRecords);
        this.nodeSeq = 0;
        this.blockSeq = 0;
        this.blockList = [];
        this.selectedNode = null;
        this.rootNode = null;

        this.selectedFuncton = null;

        // 用于加载很多节点的时候存放临时节点
        this.tempNodes = [];

    }

    RegularTree.prototype.addSelectedListener = function(f) {
        this.selectedFuncton = f;
    };

    RegularTree.prototype.isEmpty = function() {
        return !this.rootNode;
    };

    RegularTree.prototype.addNode = function(obj) {
        $("input[isFilterRadio='Y']").attr("checked", false);
        var opObj, exObj;
        if (!!obj.OP) {
            opObj = {
                ANDOR: obj.OP,
                OP: obj.OP
            };
            delete obj.OP;
            exObj = obj;
        } else {
            opObj = {
                ANDOR: '',
                OP: ''
            };
            exObj = obj;
        }

        var opNode = new RegularNode(opObj, this.getNodeSeq(), "OP", this);
        var exNode = new RegularNode(exObj, this.getNodeSeq(), "EX", this);

        if (!this.rootNode) {
            var block = new RegularBlock(this.getBlockSeq());
            this.blockList.push(block);
            this.rootNode = opNode;
            block.node[0] = opNode;

            opNode.addChildNode(exNode);
            block.addChildRowCell();
            block.fillChildCell(exNode, 1);
            this.addRootBlock(block);

        } else {
            if (!this.selectedNode) {
                fish.warn("请选择一个结点");
                return;
            }
            if (this.rootNode.childrenNode.length === 1) {
                var block = this.selectedNode.p_block;

                this.rootNode = opNode;
                this.selectedNode.p_node = opNode;
                opNode.addChildNode(this.selectedNode);
                opNode.addChildNode(exNode);

                block.addChildRowCell();
                block.fillChildCell(opNode, 0);
                block.fillChildCell(exNode, 2);
            } else {
                var oldblock = this.selectedNode.p_block;
                var oldCell = this.selectedNode.p_cell;
                var oldNode = this.selectedNode.p_node;

                if (this.selectedNode.type == "OP") {
                    if (!!opObj.OP) {
                        var block = new RegularBlock(this.getBlockSeq());
                        var p_p_block = oldblock.p_block;
                        block.fillChildCell(opNode, 0);

                        opNode.addChildNode(this.selectedNode);
                        block.addChildRowCell();

                        opNode.addChildNode(exNode);
                        block.addChildRowCell();
                        block.fillChildCell(exNode, 2);

                        if (!!p_p_block) {
                            var index = p_p_block.getNodeIndex(this.selectedNode.nodeId);
                            p_p_block.fillCellBlock(oldblock.p_cell, block, index, opNode);
                            block.fillChildCellBlock(oldblock, 1, this.selectedNode);

                            oldNode.delChildNode(this.selectedNode.nodeId);
                            oldNode.addChildNode(opNode);
                        } else {
                            // 说明在根节点上添加
                            block.fillChildCellBlock(oldblock, 1, this.selectedNode);
                            document.getElementById(this.container).innerHTML = "";
                            document.getElementById(this.container).appendChild(
                                block.getTable());
                            this.rootNode = opNode;
                        }
                    } else {
                        oldblock.addChildRowCell();
                        oldblock.fillChildCell(exNode, this.selectedNode.childrenNode.length + 1);
                        this.selectedNode.addChildNode(exNode);
                    }
                }
                if (this.selectedNode.type == "EX") {
                    var index = oldblock.getNodeIndex(this.selectedNode.nodeId);
                    var block = new RegularBlock(this.getBlockSeq());
                    block.fillChildCell(opNode, 0);

                    opNode.addChildNode(this.selectedNode);
                    block.addChildRowCell();
                    block.fillChildCell(this.selectedNode, 1);

                    opNode.addChildNode(exNode);
                    block.addChildRowCell();
                    block.fillChildCell(exNode, 2);

                    oldblock.fillCellBlock(oldCell, block, index, opNode);
                    oldNode.delChildNode(this.selectedNode.nodeId);
                    oldNode.addChildNode(opNode);
                }
            }
        }
        $(exNode.p_cell)
            .find("input[isFilterRadio='Y']")
            .click();
    };

    RegularTree.prototype.editNode = function(obj) {
        var newObj;
        if (!this.selectedNode) {
            fish.warn("请选择一个结点进行编辑");
            return;
        }
        if (this.selectedNode.type === "OP") {
            newObj = $.extend({
                NODE_TYPE: 'OP',
                ANDOR: obj.OP
            }, obj);
        } else {
            newObj = $.extend({ NODE_TYPE: 'EX'}, obj);
        }
        this.selectedNode.obj = newObj;
        this.selectedNode.p_cell.innerHTML = "";
        this.selectedNode.p_cell.appendChild(this.selectedNode.getHtmlObj());
        this.selectedNode = null;
    };

    RegularTree.prototype.delNode = function() {
        if (!this.selectedNode) {
            fish.warn("请选择一个结点删除");
            return;
        }
        var p_Node = this.selectedNode.p_node;
        var p_Block = this.selectedNode.type === "EX" ? this.selectedNode.p_block : this.selectedNode.p_block.p_block;
        if (!!p_Node) {
            var p_p_Node = p_Node.p_node;
            var brotherNode = p_Node.findBrotherNode(this.selectedNode);
            var index = p_Block.getNodeIndex(this.selectedNode.nodeId);
            if (!!p_p_Node) {
                if (brotherNode.length > 1) {
                    p_Node.delChildNode(this.selectedNode.nodeId);
                    p_Block.clearCellNode(this.selectedNode, index);
                } else {
                    //ok
                    p_p_Node.delChildNode(p_Node.nodeId);
                    p_p_Node.addChildNode(brotherNode[0]);

                    var p_p_Cell = p_Block.p_cell;
                    var p_p_Block = p_Block.p_block;
                    var pNodeIndex = p_p_Block.getNodeIndex(p_Node.nodeId);
                    p_p_Block.fillCellNode(p_p_Cell, pNodeIndex, brotherNode[0]);
                }
            } else {
                if (!brotherNode) {
                    //无兄弟节点 ok
                    this.rootNode = null;
                    document.getElementById(this.container).innerHTML = "";
                } else {
                    if (brotherNode.length > 1) {
                        //有2个以上的兄弟节点
                        p_Node.delChildNode(this.selectedNode.nodeId);
                        p_Block.clearCellNode(this.selectedNode, index);
                    } else {
                        //只有一个兄弟节点
                        if (brotherNode[0].childrenNode.length > 0) {
                            //该兄弟节点有子节点，即type为OP  ok
                            this.rootNode = brotherNode[0];
                            brotherNode[0].p_node = null;
                            this.addRootBlock(brotherNode[0].p_block);
                        } else {
                            //该兄弟节点无子节点，即type为EX ok
                            this.rootNode = p_Node;
                            p_Node.delChildNode(this.selectedNode.nodeId);
                            p_Block.clearCellNode(this.selectedNode, index);
                            p_Block.clearCells();
                            p_Block.fillChildCell(brotherNode[0], 1, "del");
                        }
                    }
                }
            }
        } else {
            //为根节点
            this.rootNode = null;
            document.getElementById(this.container).innerHTML = "";
            $("#" + this.container).append(this.emptyRecords);
        }

        this.selectedNode = null;
    };

    RegularTree.prototype.addRootBlock = function(block) {
        document.getElementById(this.container).innerHTML = "";
        block.p_block = null;
        block.p_cell = null;
        document.getElementById(this.container).appendChild(block.getTable());
    };

    RegularTree.prototype.findNode = function(nodeId, node) {
        if (!!node) {
            if (node.childrenNode.length !== 0) {
                for (var i = 0; i < node.childrenNode.length; i++) {
                    if (node.childrenNode[i].nodeId == nodeId) {
                        return node.childrenNode[i];
                    } else {
                        var fnode = this.findNode(nodeId, node.childrenNode[i]);
                        if (!!fnode) {
                            return fnode;
                        }
                    }
                }
            }
        }
    };

    RegularTree.prototype.findNodeByTempONodeId = function(tempONodeId) {
        if (this.tempNodes.length !== 0) {
            for (var i = 0; i < this.tempNodes.length; i++) {
                if (this.tempNodes[i].obj.tempONodeId == tempONodeId) {
                    return this.tempNodes[i];
                }
            }
        }
        return null;
    };

    RegularTree.prototype.listAllNodeObjs = function() {
        var listNode = [];
        if (!!this.rootNode) {
            this.listNodeObjs(this.rootNode, listNode);
        }
        return listNode;
    };

    RegularTree.prototype.listNodeObjs = function(node, list) {
        node.obj.NODE_ID = node.nodeId;
        if (node.p_node) {
            node.obj.PARENT_NODE_ID = node.p_node.nodeId;
        } else {
            node.obj.PARENT_NODE_ID = -1;
        }
        node.obj.NODE_TYPE = node.type;
        delete node.obj.tempONodeId;
        delete node.obj.tempOPNodeId;

        list.push(node.obj);
        if (!!node) {
            if (node.childrenNode.length !== 0) {
                for (var i = 0; i < node.childrenNode.length; i++) {
                    this.listNodeObjs(node.childrenNode[i], list);
                }
            }
        }
    };

    RegularTree.prototype.loadNodes = function(array, nodeIdKey, parentNodeIdKey) {
        if (!array || array.length == 0) {
            return;
        }
        //未指定这两个key，则用默认的
        if (!nodeIdKey && !parentNodeIdKey) {
            nodeIdKey = "NODE_ID";
            parentNodeIdKey = "PARENT_NODE_ID";
        }
        if (!!array[0][nodeIdKey]) {
            for (var i = 0; i < array.length; i++) {
                array[i].tempONodeId = array[i][nodeIdKey];
                array[i].tempOPNodeId = array[i][parentNodeIdKey];

                if (array[i].NODE_TYPE === "OP") {
                    array[i].ANDOR = array[i].OP;
                }
            }
        } else {
            fish.warn("can not fine node key.");
        }

        for (var i = 0; i < array.length; i++) {
            var obj = fish.clone(array[i]);

            var node = new RegularNode(obj, this.getNodeSeq(), obj.NODE_TYPE, this);
            this.tempNodes.push(node);

            if (obj.NODE_TYPE == "OP") {
                var block = new RegularBlock(this.getBlockSeq());
                this.blockList.push(block);

                if (!this.rootNode) {//第一个ANDOR节点放进来
                    this.rootNode = node;
                    block.fillChildCell(node, 0);
                    this.addRootBlock(block);
                } else {
                    var pNode = this.findNodeByTempONodeId(obj[parentNodeIdKey]);
                    var p_Block = pNode.p_block;
                    block.fillChildCell(node, 0);
                    p_Block.addChildRowCell();
                    p_Block.fillChildCellBlock(block, pNode.childrenNode.length + 1, node);
                    pNode.addChildNode(node);
                }
            } else if (obj.NODE_TYPE == "EX") {
                // 找父block
                var pNode = this.findNodeByTempONodeId(obj[parentNodeIdKey]);
                var p_Block = pNode.p_block;
                p_Block.addChildRowCell();
                p_Block.fillChildCell(node, pNode.childrenNode.length + 1);
                pNode.addChildNode(node);
            }
        }

        if (array.length === 2) {
            //移除显示的ANDOR操作符
            var b = this.rootNode.p_block;
            b.clearCellNode(this.rootNode, 0);
        }

        this.tempNotes = [];
    };

    RegularTree.prototype.expressionToTree = function(str) {
        var self = this;
        this.expToTreeData = [], data = [];
        this.seqId = 1;
        this.resolveExpression(str.trim(), 0);
        if (this.expToTreeData.length === 1) {
            var obj = {};
            obj.NODE_ID = 1;
            obj.PARENT_NODE_ID = -1;
            obj.NODE_TYPE = "OP";
            obj.OP = "";
            obj.ANDOR = "";
            this.expToTreeData[0].NODE_ID = 2;
            this.expToTreeData[0].PARENT_NODE_ID = 1;
            this.expToTreeData.push(obj);
        }
        fish.each(this.expToTreeData, function (v) {
            if (Object.prototype.toString.call(v.PARENT_NODE_ID) === "[object String]") {
                var res = fish.find(self.expToTreeData, function (ele) {
                    return ele.NODE_TYPE.trim() === v.PARENT_NODE_ID
                });
                v.PARENT_NODE_ID = res.PARENT_NODE_ID;
            }
        })
        var res = fish.filter(this.expToTreeData, function (v) {
            return v.NODE_TYPE === "EX" || v.NODE_TYPE === "OP"
        });
        //给数据排序
        return this.sortDataByChain(res);
    }

    //将数据源排序成指定的顺序
    RegularTree.prototype.sortDataByChain = function (data) {
        var root = fish.find(data, function (v) {
            return v.PARENT_NODE_ID === -1
        });
        this.temp_data = [];
        this.temp_data.push(root);
        this.findNodeRelation(root.NODE_ID, data);
        return this.temp_data;
    }

    RegularTree.prototype.findNodeRelation = function (pid, orign) {
        var self = this,
            res = fish.filter(orign, function (v) {
                return v.PARENT_NODE_ID === pid
            });
        if (res.length > 0) {
            this.temp_data = this.temp_data.concat(res);
            res.forEach(function (v) {
                self.findNodeRelation(v.NODE_ID, orign);
            });
        }
    }

    RegularTree.prototype.resolveExpression = function(str, flag) {
        if (str.indexOf('(') === -1) {
            this.strToObj(str);
            return;
        }
        if (str.lastIndexOf('(') === 0 && str.indexOf(')') === str.length-1) {
            this.strToObj(str.slice(1, str.length-1).trim());
        } else {
            var leftpos = str.lastIndexOf('('),
                rightpos = str.indexOf(')', leftpos),
                newStr = str.slice(leftpos+1, rightpos).trim();

            str = str.replace(str.slice(leftpos, rightpos+1), '@-'+flag);
            this.strToObj(newStr, '@-'+flag);
            this.resolveExpression(str, ++flag);
        }
    }

    RegularTree.prototype.strToObj = function (str, pid) {
        pid = !pid ? -1 : pid;
        var obj = {}, arr, self = this;
        obj.NODE_ID = this.seqId++;
        obj.PARENT_NODE_ID = pid;
        if (str.indexOf('||') !== -1 || str.indexOf('&&') !== -1) {
            if (str.indexOf('||') !== -1 && str.indexOf('&&') !== -1) {
                console.error('表达式某一部分同时含有||和&&逻辑符号，请修改');
                return;
            }
            obj.NODE_TYPE = 'OP';
            obj.OP = str.indexOf('||') !== -1 ? 'OR' : 'AND';
            this.expToTreeData.push(obj);
            arr = str.split(str.indexOf('||') !== -1 ? '||' : '&&');
            arr.forEach(function (v) {
                self.strToObj(v, obj.NODE_ID);
            });
        } else {
            if (str.indexOf('@') !== -1) {
                obj.NODE_TYPE = str;
            } else {
                var res = str.match(/(>|<|>=|<=|!=|=| in | notIn )/g), oper;
                if (res) {
                    oper = res.join('');
                } else {
                    console.error('表达式某一部分无操作符(>,<,=等)，或者表达式中有未知操作符');
                    return;
                }
                obj.NODE_TYPE = 'EX';
                obj.FIELD = str.split(oper)[0].trim();
                obj.OPER = oper;
                obj.VALUE = str.split(oper)[1].trim();
            }
            this.expToTreeData.push(obj);
        }
    }

    RegularTree.prototype.treeToExpression = function () {
        var treeData = this.listAllNodeObjs(), newData = [];

        if (treeData.length === 0) {
            return "";
        }
        for (var i = 0; i < treeData.length; i++) {
            var obj = fish.clone(treeData[i]);
            if (obj.NODE_TYPE === "EX") {
                obj.EX = obj.FIELD + ' ' + obj.OPER + ' ' + obj.VALUE;
            }
            newData.push(obj);
        }
        return this.createExpression(newData, this.rootNode.obj.NODE_ID, this.rootNode.obj.OP);
    };

    RegularTree.prototype.createExpression = function (data, id, type) {
        var expArr = [], restArr = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].NODE_ID === id) {
                continue;
            }
            if (data[i].PARENT_NODE_ID === id) {
                data[i].NODE_TYPE === "EX" ? expArr.push(data[i].EX) : expArr.push(data[i]);
            } else {
                restArr.push(data[i]);
            }
        }

        for (var j = 0; j < expArr.length; j++) {
            if (Object.prototype.toString.call(expArr[j]) !== "[object String]") {
                expArr.splice(j, 1, this.createExpression(restArr, expArr[j].NODE_ID, expArr[j].OP));
            }
        }
        type = type === "AND" ? "&&" : "||";
        return '(' + expArr.join(type) + ')';
    };

    RegularTree.prototype.getNodeSeq = function() {
        this.nodeSeq++;
        return this.nodeSeq;
    };

    RegularTree.prototype.getBlockSeq = function() {
        this.blockSeq++;
        return this.blockSeq;
    };

    function RegularBlock(blockId) {
        this.blockId = blockId;
        this.row = [];
        this.cell = [];
        this.node = [];

        this.table = document.createElement("table");
        this.table.setAttribute("class", "reg-table");

        this.row[0] = this.table.insertRow();
        this.cell[0] = this.row[0].insertCell();
        this.cell[0].style.whiteSpace = "nowrap";
        if (blockId != 1) {
            this.cell[0].style.borderRight = "1px solid #CDCDCD";
        }
        this.node[0] = null;
        this.p_cell = null;
        this.p_block = null;

    }

    RegularBlock.prototype.addChildRowCell = function () {
        var len = this.row.length;
        this.row[len] = this.table.insertRow();
        this.cell[len] = this.row[len].insertCell();
        this.cell[len].style.whiteSpace = "nowrap";
        this.cell[len].style.paddingLeft = "10px";
        this.cell[len].style.paddingTop = "8px";
        this.cell[len].style.paddingBottom = "8px";
        this.node[len] = null;
        this.cell[0].rowSpan = len + 1;
    };

    RegularBlock.prototype.getTable = function() {
        return this.table;
    };

    RegularBlock.prototype.clearCellNode = function(node, i) {
        this.cell[i].innerHTML = "";
        this.cell[i].style = "";
        if(i !== 0) {
            this.row[i].removeChild(this.cell[i]);
            this.table.firstChild.removeChild(this.row[i]);
            this.cell.splice(i, 1);
            this.row.splice(i, 1);
            this.node.splice(i, 1);
            this.cell[0].rowSpan -= 1;
        }
        node.p_cell = null;
        node.p_block = null;
    };

    RegularBlock.prototype.fillCellNode = function(cell, i, node) {
        cell.innerHTML = "";
        if (node.childrenNode.length > 0) {
            cell.appendChild(node.p_block.getTable());
            node.p_block.p_block = this;
            node.p_block.p_cell = cell;
        } else {
            cell.appendChild(node.getHtmlObj());
            node.p_block = this;
            node.p_cell = cell;
        }
        this.node[i] = node;
    };

    RegularBlock.prototype.fillCellBlock = function(cell, block, i, node) {
        cell.innerHTML = "";
        cell.appendChild(block.getTable());
        block.p_cell = cell;
        block.p_block = this;
        this.node[i] = node;
    };

    RegularBlock.prototype.fillChildCellBlock = function(block, i, node) {
        block.p_block = this;
        block.p_cell = this.cell[i];

        this.cell[i].innerHTML = "";
        this.cell[i].appendChild(block.getTable());
        this.node[i] = node;
    };

    RegularBlock.prototype.fillChildCell = function(node, i, option) {
        this.node[i] = node;
        this.cell[i].innerHTML = "";
        this.cell[i].appendChild(node.getHtmlObj());

        if (i === 0) {
            this.cell[i].style.borderRight = !!node.obj.ANDOR ? "1px solid #CDCDCD" : "none";
        }

        if (i === 1) {
            if ((option === "del") && node.p_node && !node.p_node.p_node) {
                this.cell[i-1].style.borderRight = "none";
            }
            if (!option && !node.p_block && node.p_node && !node.p_node.p_node){
                this.cell[i-1].style.borderRight = "none";
            }
        }

        node.p_cell = this.cell[i];
        node.p_block = this;
    };

    RegularBlock.prototype.getNodeIndex = function (nodeId) {
        for (var i = 0; i < this.node.length; i++) {
            if (this.node[i].nodeId === nodeId) {
                return i;
            }
        }
    };

    RegularBlock.prototype.clearCells = function() {
        for (var i = 0; i < this.cell.length; i++) {
            this.cell[i].innerHTML = "";
        }
    };

    return RegularTree
});

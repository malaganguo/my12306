/* 
 * 符合requireJS规范，可导入的
 * Bpmn2常量以及匹配转换接口
 */
define([
    
] ,function(){
    /*

    * Copyright (c) 2014 ZTESOFT TECHNOLOGY CO.,LTD. All rights reserved

    * Author: zhou_ke1@zte.com.cn

    *

    * BPMN图形类型定义，其中事件枚举成员中的后缀数字的意思如下：

    *

    * 0--(Start) Top Level

    * 1--(Start) Event Sub-Process Interupting

    * 2--(Start) Event Sub-Process Non-Interupting

    * 3--(Intermediate) Catching

    * 4--(Intermediate) Boundary Interupting

    * 5--(Intermediate) Boundary Non-Interupting

    * 6--(Intermediate) Throwing

    * 7--(End)

    *

    * 事件类型的定义参看 http://bpmb.de/poster 网站上下载的pdf文件：BPMN2_0_Poster_EN.pdf，事件类型定义对应此文件中的Events一栏的图形描述及顺序，这样便于处理，请注意它们是连续的

    *

    * 依赖：代码中使用了jQuery的部分功能

    */
    var bpmn2={

        //插件名称空间

        PLUGIN_SPACE:"com.ztesoft.zsmart.zest.plugins.bpmn2",

        //模板

        "TEMPLATE":-1,

        //活动

            "BPMN_TASK":0,

        "BPMN_SEND_TASK":1,

        "BPMN_RESEIVE_TASK":2,

        "BPMN_USER_TASK":3,

        "BPMN_MANUAL_TASK":4,

        "BPMN_BUSINESS_RULE_TASK":5,

        "BPMN_SERVICE_TASK":6,

        "BPMN_SCRIPT_TASK":7,

        "BPMN_EXT_MAIL_TASK":8,

        "BPMN_EXT_SMS_TASK":9,

            "BPMN_CALL_ACTIVITY":11,

            "BPMN_TRANSCATION":12,

            "BPMN_EVENT_SUB_PROCESS":13,

            //流

            "BPMN_SEQUENCE_FLOW":14,

            "BPMN_MESSAGE_FLOW":15,

            "BPMN_ASSOCIATION_FLOW":16,

            //网关

            "BPMN_GATEWAY_EXCLUSIVE":17,

            "BPMN_GATEWAY_BASED_EVENT":18,

            "BPMN_GATEWAY_PARALLEL":19,

            "BPMN_GATEWAY_INCLUSIVE":20,

            "BPMN_GATEWAY_COMPLEX":21,

            "BPMN_GATEWAY_EXCLUSIVE_BASED_EVENT":22,

            "BPMN_GATEWAY_PARALLEL_BASED_EVENT":23,

            //数据

            "BPMN_DATA":24,

            //泳池

            "BPMN_POOL":25,

            //泳道

            "BPMN_LANE":26,

            //注释

            "BPMN_ANNOTATION":27,

            //组

            "BPMN_GROUP":28,

            //事件，需要放在一起以生成连续类型值，后续的类型识别会更方便

            "BPMN_EVENT_NONE0":29,

            "BPMN_EVENT_NONE6":30,

            "BPMN_EVENT_NONE7":31,

            "BPMN_EVENT_MESSAGE0":32,

            "BPMN_EVENT_MESSAGE1":33,

            "BPMN_EVENT_MESSAGE2":34,

            "BPMN_EVENT_MESSAGE3":35,

            "BPMN_EVENT_MESSAGE4":36,

            "BPMN_EVENT_MESSAGE5":37,

            "BPMN_EVENT_MESSAGE6":38,

            "BPMN_EVENT_MESSAGE7":39,

            "BPMN_EVENT_TIMER0":40,

            "BPMN_EVENT_TIMER1":41,

            "BPMN_EVENT_TIMER2":42,

            "BPMN_EVENT_TIMER3":43,

            "BPMN_EVENT_TIMER4":44,

            "BPMN_EVENT_TIMER5":45,

            "BPMN_EVENT_ESCALATION1":46,

            "BPMN_EVENT_ESCALATION2":47,

            "BPMN_EVENT_ESCALATION4":48,

            "BPMN_EVENT_ESCALATION5":49,

            "BPMN_EVENT_ESCALATION6":50,

            "BPMN_EVENT_ESCALATION7":51,

            "BPMN_EVENT_CONDITIONAL0":52,

            "BPMN_EVENT_CONDITIONAL1":53,

            "BPMN_EVENT_CONDITIONAL2":54,

            "BPMN_EVENT_CONDITIONAL3":55,

            "BPMN_EVENT_CONDITIONAL4":56,

            "BPMN_EVENT_CONDITIONAL5":57,

            "BPMN_EVENT_LINK3":58,

            "BPMN_EVENT_LINK6":59,

            "BPMN_EVENT_ERROR1":60,

            "BPMN_EVENT_ERROR4":61,

            "BPMN_EVENT_ERROR7":62,

            "BPMN_EVENT_CANCEL4":63,

            "BPMN_EVENT_CANCEL7":64,

            "BPMN_EVENT_COMPENSATION1":65,

            "BPMN_EVENT_COMPENSATION4":66,

            "BPMN_EVENT_COMPENSATION6":67,

            "BPMN_EVENT_COMPENSATION7":68,

            "BPMN_EVENT_SIGNAL0":69,

            "BPMN_EVENT_SIGNAL1":70,

            "BPMN_EVENT_SIGNAL2":71,

            "BPMN_EVENT_SIGNAL3":72,

            "BPMN_EVENT_SIGNAL4":73,

            "BPMN_EVENT_SIGNAL5":74,

            "BPMN_EVENT_SIGNAL6":75,

            "BPMN_EVENT_SIGNAL7":76,

            "BPMN_EVENT_MULTIPLE0":77,

            "BPMN_EVENT_MULTIPLE1":78,

            "BPMN_EVENT_MULTIPLE2":79,

            "BPMN_EVENT_MULTIPLE3":80,

            "BPMN_EVENT_MULTIPLE4":81,

            "BPMN_EVENT_MULTIPLE5":82,

            "BPMN_EVENT_MULTIPLE6":83,

            "BPMN_EVENT_MULTIPLE7":84,

            "BPMN_EVENT_PARALLEL_MULTIPLE0":85,

            "BPMN_EVENT_PARALLEL_MULTIPLE1":86,

            "BPMN_EVENT_PARALLEL_MULTIPLE2":87,

            "BPMN_EVENT_PARALLEL_MULTIPLE3":88,

            "BPMN_EVENT_PARALLEL_MULTIPLE4":89,

            "BPMN_EVENT_PARALLEL_MULTIPLE5":90,

            "BPMN_EVENT_TERMINATE7":91,

            //编排(暂未实现)

            "BPMN_CHOREOGRAPHY":92,

            "BPMN_CHOREOGRAPHY_TASK":93,

            "BPMN_CHOREOGRAPHY_SUB_PROCESS":94,

        //消息流扩展

        "BPMN_MESSAGE_SERIAL_FLOW":1000,

        "BPMN_MESSAGE_PARALLEL_FLOW":1001,

        //图约束规则错误常量

        "ERR_START_EXIST":-2,

        "ERR_POOL_NO_ATTACH":-4,

        "ERR_LANE_NO_ATTACH":-5,

        "ERR_LANE_NO_DETACH":-6,

        "ERR_DONT_ATACH":-7,

        "ERR_MSG_NO_PAIRED":-8,

        "ERR_FLOW_BROKEN":-9,

        "ERR_MUST_ATTACH":-10,

        "ERR_START_ISOLATED":-11,

        "ERR_END_ISOLATED":-12,

        "ERR_START_NO_EXIST":-13,

        "ERR_END_NO_EXIST":-14,

         _getNum:function(t){

            return (typeof(t)==="number")?t:(isNaN(t)?-1:parseInt(t,10));

        },
        
        /**
         * 字符串前补'0'
         * @param {type} str
         * @param {type} length
         * @param {type} repeat
         * @returns {undefined}
         */
        repeatStr : function(str,length){
            var zero = "0000000000";
            if(!str){
                return zero.substr(0,length);
            }
            str = str + '';
            if(length > str.length){
                return zero.substr(0,length - str.length) + str;
            }
            return str;
        },
        
        /**
         * 元素默认值
         * @param {type} t
         * @returns {Bpmn2_L6.bpmn2.userdata.Bpmn2Anonym$5|Bpmn2_L6.bpmn2.userdata.Bpmn2Anonym$3|Bpmn2_L6.bpmn2.userdata.obj|Bpmn2_L6.bpmn2.userdata.Bpmn2Anonym$4}
         */
        userdata:function(t){

            var d,

                obj;
            var rp = this.repeatStr;

            if(this.isTemplate(t)){

                d=new Date();

                obj={
                    version:"1.0",
                    effDate:[d.getFullYear(),"-",rp(d.getMonth()+1,2),"-",rp(d.getDate(),2)," ",rp(d.getHours(),2),":",rp(d.getMinutes(),2),":",rp(d.getSeconds(),2)].join(""),
                    notes:"",
                    id:"",
                    startTime:"",
                    name:"BPMNDiagram",
                    process_id:""
                };

                d.setDate(d.getDate()+30);

                obj.expDate=[d.getFullYear(),"-",rp(d.getMonth()+1,2),"-",rp(d.getDate(),2)," ",rp(d.getHours(),2),":",rp(d.getMinutes(),2),":",rp(d.getSeconds(),2)].join("");

                return obj;

            }else if(this.isActivity(t)){

                return {

                    autoFinish:(t===this.BPMN_EVENT_SUB_PROCESS)?"1":"0",

                    boundEventNum:"0",

                    dataAssociNo:"",

                    isExclusive:"0",    //new

                    extClszz:"",  //new

                    preInterceptor:"",

                    aftInterceptor:"",

                    hint:"",


                    no:"",

                    type:t,

                    extProperties:{

                        canCancle:"0",

                        multInstDecompService:"",

                        canDrawBack:"1",

                        exeService:"",

                        crtService:"",

                        loopNum:"",

                        canRollback:"0",

                        isMultInst:"0",

                        canForceDisp:"0",

                        multExecuteType:"S",

                        //sub process

                        subProcessNo:"",    //new

                        subProcessVerion:"",    //new

                        subProcessName:"",    //new

                        //script activity

                        scriptType:"1",    //new

                        scriptContent:""    //new

                    }

                };

            }else if(this.isGateway(t)){

                return {

                    no:"",

                    type:t

                };

            }else if(this.isEvent(t)){

                obj={


                    no:"",

                    type:t,

                    extProperties:{

                        _timeType:"0",

                        timeDate:"",

                        timeDuration:"",

                        eventRef:"",

                        errorCode:"" //new

                    }

                };

                if(this.isBoundaryEvent(t)){

                    obj.actId="";

                    obj.actNo="";

                    obj.condition="";   //已经废弃

                    obj.eventParams="";

                    obj.execution="";   //已经废弃

                    obj.objType="";

                    obj.service="";

                    obj.notes="";

                    obj.extProperties.activityRef=""; //new

                    obj.extProperties.activityRefName=""; //new

                    obj.extProperties.compensateService="";   //new

                }

                return obj;

            }else if(this.isFlow(t)){

                return {

                    conditionExpr:"",

                    isDefault:"0",

                    isLoop:"0",


                    notes:"",

                    order:"",

                    ruleIParams:"",

                    ruleOPrams:"",

                    type:t

                }

            }

            return null;

        },
        /**
         * 判断类型是否是根元素，即模板
         * @param {type} t
         * @returns {Boolean}
         */
        isTemplate : function(t){
            var tt=this._getNum(t);
            return t == this.TEMPLATE;
        },

        isActivity:function(t){

            var tt=this._getNum(t);

            return (tt>=0 && tt>=this.BPMN_TASK && tt<=this.BPMN_EVENT_SUB_PROCESS);

        },

        isGateway:function(t){

            var tt=this._getNum(t);

            return (tt>=0 && tt>=this.BPMN_GATEWAY_EXCLUSIVE && tt<=this.BPMN_GATEWAY_PARALLEL_BASED_EVENT);

        },

        isFlow:function(t){

            var tt=this._getNum(t);

            return ((tt>=0 && tt>=this.BPMN_SEQUENCE_FLOW && tt<=this.BPMN_ASSOCIATION_FLOW) || tt===this.BPMN_MESSAGE_SERIAL_FLOW || tt===this.BPMN_MESSAGE_PARALLEL_FLOW);

        },

        isEvent:function(t){

            var tt=this._getNum(t);

            return (tt>=0 && tt>=this.BPMN_EVENT_NONE0 && tt<=this.BPMN_EVENT_TERMINATE7);

        },

        isBoundaryEvent:function(t){

            var i,

                arr=[this.BPMN_EVENT_MESSAGE4, this.BPMN_EVENT_MESSAGE5, this.BPMN_EVENT_TIMER4, this.BPMN_EVENT_TIMER5, this.BPMN_EVENT_ESCALATION4, this.BPMN_EVENT_ESCALATION5, this.BPMN_EVENT_CONDITIONAL4, this.BPMN_EVENT_CONDITIONAL5, this.BPMN_EVENT_ERROR4, this.BPMN_EVENT_COMPENSATION4, this.BPMN_EVENT_SIGNAL4, this.BPMN_EVENT_SIGNAL5, this.BPMN_EVENT_MULTIPLE4, this.BPMN_EVENT_MULTIPLE5, this.BPMN_EVENT_PARALLEL_MULTIPLE4, this.BPMN_EVENT_PARALLEL_MULTIPLE5],

                tt=this._getNum(t);

            if(tt>=0){

                for(i=0;i<16;i++){

                    if(arr[i]===tt){

                        return true;

                    }

                }

            }

            return false;

        },

        isCatchEvent:function(t){

            var i,

                arr=[this.BPMN_EVENT_MESSAGE3, this.BPMN_EVENT_TIMER3, this.BPMN_EVENT_CONDITIONAL3, this.BPMN_EVENT_LINK3, this.BPMN_EVENT_SIGNAL3, this.BPMN_EVENT_MULTIPLE3, this.BPMN_EVENT_PARALLEL_MULTIPLE3],

                tt=this._getNum(t);

            if(tt>=0){

                for(i=0;i<7;i++){

                    if(arr[i]===tt){

                        return true;

                    }

                }

            }

            return false;

        },

        isThrowEvent:function(t){

            var i,

                arr=[this.BPMN_EVENT_NONE6, this.BPMN_EVENT_MESSAGE6, this.BPMN_EVENT_ESCALATION6, this.BPMN_EVENT_LINK6, this.BPMN_EVENT_COMPENSATION6, this.BPMN_EVENT_SIGNAL6, this.BPMN_EVENT_MULTIPLE6],

                tt=this._getNum(t);

            if(tt>=0){

                for(i=0;i<7;i++){

                    if(arr[i]===tt){

                        return true;

                    }

                }

            }

            return false;

        },

        isArtifact:function(t){

            var tt=this._getNum(t);

            return (tt>=0 && (tt===this.BPMN_DATA || tt===this.BPMN_ANNOTATION || tt===this.BPMN_GROUP));

        },

        isChoreography:function(t){

            var tt=this._getNum(t);

            return (tt>=0 && tt>=this.BPMN_CHOREOGRAPHY && tt<=this.BPMN_CHOREOGRAPHY_SUB_PROCESS);

        }


    };

    return bpmn2;
 });



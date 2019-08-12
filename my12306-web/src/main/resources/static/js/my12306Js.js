$(document).ready(function () {
    /*navbar鼠标悬停下拉回缩事件*/
    $('#navbar-index a:eq(1)').hover(function () {
        $("#ticket-menu").css('display','block');
    });
    $("#ticket-menu").hover(function() {
        $(this).css('display','block');//鼠标进入下拉框
    }, function () {
        $(this).css('display', 'none');
    });
    /*navbar鼠标悬停下拉回缩事件结束*/

    /*全选事件*/
    $('#trains_type_all').click(function () {
        var trains_type = $('#trains_type_line input');
        for(var i=0;i<trains_type.length;i++){
            trains_type[i].checked = true;
        }
    })
    $('#start_site_all').click(function () {
        var start_line = $('#start_site_line input');
        for(var i=0;i<start_line.length;i++){
            start_line[i].checked = true;
        }
    })
    /*全选事件结束*/

    /*单选车程事件*/
    $('#dfc-container input').change(function () {
        if(this.value == 'wf'){
            $('#return-time-input').removeAttr('disabled','disabled');
        }else{
            // $("#return-time-input").datetimepicker('value', '');//这句不生效
            $('#return-time-input').attr('disabled','disabled');
        }
    });
    /*单选车程事件结束*/

    /*乘车详细信息*/
    $("#ticket-assist").on('click',function (e) {
        $('.ui-tabs-panel').css('height','160px');
        $('.ticket-assist1').css('display','block');
        $("#ticket-assist").hide();
        $('#extend-ticket').show();


    });
    $('#ticket-assist1').on('click',function (e) {
        $('.ui-tabs-panel').css('height','60px');
        $('.ticket-assist1').css('display','none');
        $("#ticket-assist").show();
        $('#extend-ticket').hide();
    });
    /*乘车详细信息结束*/

    /*我的12306*/
    $("#my12306dropdown").hover(
        function(){
            $("#my12306dropdownmenu").show();
        });
    $("#my12306dropdownmenu").hover(function() {
        $(this).show();//鼠标进入下拉框
    }, function() {
        $(this).hide();//鼠标离开下拉框后，就会消失
    });
    /*我的12306结束*/

    /*时间选择器*/
    $("#start-time-input").datetimepicker({
        startDate: new Date(),
        endDate: fish.dateutil.addDays(new Date(), 31),
        buttonIcon: '',
        viewType:'date'
    });
    $("#return-time-input").datetimepicker({
        startDate: new Date(),
        endDate: fish.dateutil.addDays(new Date(), 31),
        buttonIcon: '',
        viewType:'date'
    });
    /*时间选择器结束*/

    /*搜索栏*/
    var search = {
        filterFields: [
            {label: '搜索车票/餐饮/常旅客/相关规章', value: 'search'}
        ],
        query: function(payload, callback) {
            callback([
                {label: '张毅飞'},
                {label: 'ALOHA'},
                {label: 'malaganguo'},
                {label: '前端真的很木乱啊~'}
            ]);
        }
    }
    $('#search').searchbar($.extend(search, {displayMode: 'tail'}));
    $("#tabs").tabs();
    $("#sear-sel").tabs();
    /*搜索栏结束*/

    /*城市选择器*/
    var startarea=new Vcity.CitySelector({input:'start-area-input'});
    var distarea=new Vcity.CitySelector({input:'dist-area-input'})
    /*城市选择器结束*/

    /*fish表格*/

    /*// Set data
    mydata = [
        {number:"G660",start_station:"西安北",end_station:"北京西",start_time:"13:00",end_time:"05:42",start_pastrecords:"16:42",end_pastrecords:"次日到达",bseat:"--",total:"2111.00"} ,
        {number:"G658",start_station:"西安北",end_station:"北京西",start_time:"13:00",end_time:"05:42",start_pastrecords:"16:42",end_pastrecords:"次日到达",bseat:"--",total:"320.00",extra:"tyl"},
        {number:"K1364",start_station:"西安北",end_station:"北京西",start_time:"13:00",end_time:"05:42",start_pastrecords:"16:42",end_pastrecords:"次日到达",bseat:"9",total:"430.00"}
    ];

    var opt = {
        data: mydata,
        height: 800,
        colModel: [{
            name: 'number',
            index: 'number',
            label: '车次',
            width: 55
        }, {
            name: 'station',
            label: '出发站<br clear="none">到达站',
            index: 'start_end',
            width: 70,
            formatter: function(cellval, opts, rwdat, _act) {
                return rwdat.start_station+"<br clear='none'>"+rwdat.end_station ;
            }
        }, {
            name: 'time',
            label: '出发时间<br clear="none">到达时间',
            index: 'time',
            width: 82,
            align: "center",
            formatter: function(cellval, opts, rwdat, _act) {
                return rwdat.start_time+"<br clear='none'>"+rwdat.end_time ;
            }
        }, {
            name: 'pastrecords',
            label: '历时',
            index: 'pastrecords',
            width: 60,
            formatter: function(cellval, opts, rwdat, _act) {
                return rwdat.start_pastrecords+"<br clear='none'>"+rwdat.end_pastrecords ;
            }
        }, {
            name: 'bseat',
            label: '商务座<br clear="none">特等座',
            index: 'bseat',
            width: 70,
            align: "center",
            sorttype: "float"
        }, {
            name: 'fseat',
            label: '一等座',
            index: 'fseat',
            width: 70,
        }, {
            name: 'sseat',
            label: '二等座',
            index: 'sseat',
            width: 70,
        }, {
            name: 'hsleeper',
            label: '高级<br clear="none">软卧',
            index: 'hsleeper',
            width: 66,
        }, {
            name: 'fsleeper',
            label: '软卧<br clear="none">一等卧',
            index: 'fsleeper',
            width: 70,
        }, {
            name: 'msleeper',
            label: '动卧',
            index: 'msleeper',
            width: 66,
        }, {
            name: 'hssleeper',
            label: '硬卧<br clear="none">二等卧',
            index: 'hssleeper',
            width: 70,
        }, {
            name: 'softseat',
            label: '软座',
            index: 'softseat',
            width: 66,
        }, {
            name: 'hardseat',
            label: '硬座',
            index: 'hardseat',
            width: 66,
        }, {
            name: 'noneseat',
            label: '无座',
            index: 'noneseat',
            width: 66,
        }, {
            name: 'other',
            label: '其他',
            index: 'other',
            width: 66,
        }, {
            name: 'commit',
            label: '备注',
            index: 'commit',
            formatter: function(cellval, opts, rwdat, _act) {
                return '<div class="btn-group">' +
                    '<button type="button" class="btn btn-info reserve">预定</button>' +
                    '</div>'
            }
        }]
    };

    $grid = $("#t-list").grid(opt);

    button_event("#t-list button");*/
    /*fish表格结束*/
});

/*点击订票事件函数*/
function button_event(objStr) {
    var cont = '<div class="ui-dialog dialog-md">\n' +
        '    <div class="modal-header">\n' +
        '        <h4 class="modal-title">您尚未登陆</h4>\n' +
        '    </div>\n' +
        '    <div class="modal-body">\n' +
        '        <div class="login-hd" style="height: 48px;line-height: 48px;">\n' +
        '            <div class="login-hd-code" style="margin-right: 60px;float: left;width: 130px;text-align: center;position: relative;">\n' +
        '                <a href="javascript:void(0)">扫码登陆</a>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="fa-qrcode">\n' +
        '            <img src="../images/qrcode.png" style="margin-left: 100px;margin-top: 50px">\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>';
    var options = {
        height: 500,
        width:500,
        modal: false,
        draggable: false,
        content: cont,
        autoResizable: true
    }
    $(objStr).click(function () {
        console.log("点击");
        var popup = fish.popup($.extend({}, options, {
            modal: true
        }));
        options = null;
        cont = null;
        popup.result.then(function (message) {
            alert(message);
        });
    });
};
/*点击订票事件函数结束*/

function ticket_form(mydata) {
    /*fish表格*/

// Set data
    /*mydata = [
        {number:"G660",start_station:"西安北",end_station:"北京西",start_time:"13:00",end_time:"05:42",start_pastrecords:"16:42",end_pastrecords:"次日到达",bseat:"--",total:"2111.00"} ,
        {number:"G658",start_station:"西安北",end_station:"北京西",start_time:"13:00",end_time:"05:42",start_pastrecords:"16:42",end_pastrecords:"次日到达",bseat:"--",total:"320.00",extra:"tyl"},
        {number:"K1364",start_station:"西安北",end_station:"北京西",start_time:"13:00",end_time:"05:42",start_pastrecords:"16:42",end_pastrecords:"次日到达",bseat:"9",total:"430.00"}
    ];*/

    var opt = {
        data: mydata,
        height: 800,
        colModel: [{
            name: 'number',
            index: 'number',
            label: '车次',
            width: 55
        }, {
            name: 'station',
            label: '出发站<br clear="none">到达站',
            index: 'start_end',
            width: 70,
            formatter: function(cellval, opts, rwdat, _act) {
                return rwdat.start_station+"<br clear='none'>"+rwdat.end_station ;
            }
        }, {
            name: 'time',
            label: '出发时间<br clear="none">到达时间',
            index: 'time',
            width: 82,
            align: "center",
            formatter: function(cellval, opts, rwdat, _act) {
                return rwdat.start_time+"<br clear='none'>"+rwdat.end_time ;
            }
        }, {
            name: 'pastrecords',
            label: '历时',
            index: 'pastrecords',
            width: 60,
            formatter: function(cellval, opts, rwdat, _act) {
                return rwdat.start_pastrecords+"<br clear='none'>"+rwdat.end_pastrecords ;
            }
        }, {
            name: 'bseat',
            label: '商务座<br clear="none">特等座',
            index: 'bseat',
            width: 70,
            align: "center",
            sorttype: "float"
        }, {
            name: 'fseat',
            label: '一等座',
            index: 'fseat',
            width: 70,
        }, {
            name: 'sseat',
            label: '二等座',
            index: 'sseat',
            width: 70,
        }, {
            name: 'hsleeper',
            label: '高级<br clear="none">软卧',
            index: 'hsleeper',
            width: 66,
        }, {
            name: 'fsleeper',
            label: '软卧<br clear="none">一等卧',
            index: 'fsleeper',
            width: 70,
        }, {
            name: 'msleeper',
            label: '动卧',
            index: 'msleeper',
            width: 66,
        }, {
            name: 'hssleeper',
            label: '硬卧<br clear="none">二等卧',
            index: 'hssleeper',
            width: 70,
        }, {
            name: 'softseat',
            label: '软座',
            index: 'softseat',
            width: 66,
        }, {
            name: 'hardseat',
            label: '硬座',
            index: 'hardseat',
            width: 66,
        }, {
            name: 'noneseat',
            label: '无座',
            index: 'noneseat',
            width: 66,
        }, {
            name: 'other',
            label: '其他',
            index: 'other',
            width: 66,
        }, {
            name: 'commit',
            label: '备注',
            index: 'commit',
            formatter: function(cellval, opts, rwdat, _act) {
                return '<div class="btn-group">' +
                    '<button type="button" class="btn btn-info reserve">预定</button>' +
                    '</div>'
            }
        }]
    };

    $grid = $("#t-list").grid(opt);
    opt = null;
    button_event("#t-list button");
    button_event('#select_person');//选择乘车人跳转到登陆界面
    /*fish表格结束*/
}

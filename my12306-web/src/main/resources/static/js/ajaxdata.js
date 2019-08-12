$("#query_button").click(function () {
    var start_area = $("#start-area-input").val();
    var dist_area = $("#dist-area-input").val();
    var start_time = $("#start-time-input").val();
    var return_time = $("#return-time-input").val();
    var params = $.param({
        "start_area":start_area,
        "dist_area":dist_area,
        "start_time":start_time
    });
    params = decodeURI(params);
    $.ajax({
       url:'checkticket?start_area='+start_area+'&dist_area='+dist_area+'&start_time='+start_time,
       // data: params,
       type: "GET",
       jsonp: "callback",
       success:function (data) {
           console.log(data);
           ticket_form(data);
       }
    }).then(params = null);//释放params
});
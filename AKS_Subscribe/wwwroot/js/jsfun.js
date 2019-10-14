/*********** 预定课程 **************/
var DuecourseFun = function () {

    var Config = {
        UID: 0,
        StarYear: 0,
        EndYear: 0,
        COID: 0,
        TUID: 0,
        ClassTimes: [],
        ClassTime: null,
        TutorList: null,
        OtherTutor: 0,
        SelectTutor: null,
        ClassTool1: 0,
        ClassTool2: 0,
        wxCourse: null,
        courseid: 0,
        newgettutorbytimeindex: 0,
        CatID: 0,
        IsShowTool: "False"
    };
    //基本
    var Duec_fun = function () {
        //更改套餐
        $("[name=select-btn]").click(function () {
            $(".selectclass").parent().removeClass("display-none").show();
            $(this).parent().toggle();
        });
        $(".selectclass").each(function (i) {
            $(this).parent().find("a").click(function () {
                for (var n = 0; n < $(this).prev().find("option").length; n++) {
                    if ($(this).prev().find("option").eq(n).val() == $(this).prev().val()) {
                        $("[name=select-btn]").eq(i).prev().text($(this).prev().find("option").eq(n).text());
                        var coid = $(".selectclass").val();
                        Config.COID = coid;
                        DuecourseFun.LoadOrderMsg(coid);
                        DuecourseFun.SetDefaultOrder(coid);
                    }
                }
                $(this).parent().toggle();
                $("[name=select-btn]").eq(i).parent().toggle();
            })
        });
        //预约老师被点击 初始化日历
        $("[data-toggle=tab]").click(function () {
            if ($(this).attr("aria-expanded") != "true") {
                setTimeout(function () {
                    $(".fc-today-button.ui-button.ui-state-default.ui-corner-left.ui-corner-right").click();
                    //订课流程引导
                    // Dk_Liuchen2();
                }, 300);
            } else { }
        });
        //套餐伸缩
        $("[name=spilt_1]").click(function () {
            $("[name=spilt_1none]").toggle()
        });
        $("[name=spilt_2]").click(function () {
            $("[name=spilt_2none]").toggle()
        });


        //新版约课筛选
        $('#btn_newbookclass_newgettutorbytime').on('click', function () {

            DuecourseFun.NewGetTutorByTime(0);

        });

        //新版约课换一换
        $('#changeteacher').on('click', function () {

            DuecourseFun.NewGetTutorByTime(Config.newgettutorbytimeindex + 1);
        });
    };
    var RemindEvaluationClass = function (UID) {
        var result = Fn.Course.GetLastThreeRemindStu(UID);
        if (result) {
            var COID = [];
            if (result.length > 0) {
                var html = "";
                $.each(result, function (index, item) {
                    if (COID.indexOf(item["COID"]) == -1) {
                        COID.push(item["COID"]);
                        html += item["COName"] + ",";
                    }
                });
                html = "(" + html.substring(0, html.length - 1) + ")";
                Modal_Fun.init('<h4 class=\'text-center\'>测评课提醒</h4><h5>您的' + html + '套餐还剩最后三节课，阿卡索温馨提示您预订最熟悉的老师参加最后一节测评课</h5>')
            }
        };
    };
    //根据时间约课
    var T_make = function () {
        $('#calendar2').fullCalendar({
            header: {
                left: '',
                center: 'title',
                right: 'today prev,next'
            },
            defaultView: 'agendaWeek',
            selectable: true,
            selectHelper: true,
            defaultEventMinutes: 30,
            firstHour: '6',
            slotMinutes: 30,
            minTime: '6:00',
            maxTime: '24:00',
            slotEventOverlap: false,
            allDayDefault: false,
            allDaySlot: false,
            firstDay: 1,
            axisFormat: 'HH:mm',
            theme: true,
            lang: 'zh-cn',
            buttonText: {
                prevYear: '去年',
                nextYear: '明年',
                today: '今天',
                month: '月',
                week: '周',
                day: '日'
            },
            editable: false,
            eventLimit: true, // allow "more" link when too many eve
            timeFormat: {
                agenda: 'HH:mm{ - HH:mm}'
            },
            events: function (start, end, callback) {
                $.ajax({
                    url: '/Ajax/Web.UI.Fun.Course.aspx',
                    type: 'POST', //type: 'POST' Demo用的Get,
                    dataType: 'json',
                    beforeSend: function () {
                        $(".Show_fullcander").hide();
                        $(".ac_times").show();
                    },
                    data: {
                        __: "GetTutorTimeByIDS",
                        "uid": Config.UID,
                        "coid": Config.COID,
                        "start": start.format(),
                        "end": end.format()
                    },
                    success: function (res) {
                        $(".ac_times").hide();
                        $(".Show_fullcander").show();
                        var obj = new Object();
                        $.each(res.value, function (i, date) {
                            obj.id = date.id;
                            obj.title = date.title;
                            obj.start = date.start;
                            obj.end = date.end;
                            obj.backgroundColor = "#5BA8FE";
                            obj.textColor = "#fff";
                            $('#calendar2').fullCalendar('renderEvent', obj); //核心的更新代码
                        });
                        $('#calendar2').fullCalendar('unselect'); //重新加载
                        $(".fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end.fc-short").click(function () {
                            $(".fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end.fc-short").find(".fc-title").css("background-color", "#1ABC9C");
                            $(this).find(".fc-title").css("background-color", "#FF8C00");
                        }).mouseenter(function () {
                            if ($(this).find(".fc-title").css("background-color") != "rgb(255, 140, 0)") {
                                $(this).find(".fc-title").css("background-color", "#D35746");
                            }
                        }).mouseleave(function () {
                            if ($(this).find(".fc-title").css("background-color") == "rgb(211, 87, 70)") {
                                $(this).find(".fc-title").css("background-color", "#1ABC9C");
                            }
                        })
                    },
                    error: function () { }
                });
            },
            eventClick: function (event) {
                Config.ClassTime = moment(event.start).format("YYYY-MM-DD HH:mm");
                $("[name=DueDate2]").attr("class", "btn btn-circle btn-primary btn-sm").show();
                $("[name=DueDate2]").text(moment(event.start).format("YYYY-MM-DD HH:mm") + "-" + moment(event.end).add(-5, "m").format("HH:mm")).attr("id", event.id);
                var res = Fn.Course.GetTutorByTime(Config.COID, moment(event.start).format("YYYY-MM-DD HH:mm"));
                if (res) {
                    var Teahtml = "",
                        sexhtml = "";
                    $.each(res, function (i, v) {
                        if (v["sex"] == 0)
                            sexhtml = '<div class="Tutor_Nv"></div>';
                        else
                            sexhtml = '<div class="Tutor_Man"></div>';
                        if (!jQuery.isEmptyObject(v["TutorPic"])) {
                            sexhtml = '<img src="' + v["TutorPic"] + '" style="width: 68px;text-align:center;border-radius: 50% !important;height: 68px;padding: 10px;margin-left: 25px;">';
                        }
                        Teahtml += '<div class="Book_Tutor">' +
                            '<div class="Book_Tutor_rom" onclick="DuecourseFun.GetSelectTools2(this,' + v["TUID"] + ')">' +
                            sexhtml +
                            '<div class="Tutor_bottom">' + v["FullName"] + '</div>' +
                            '<div class="Book_ChaKan" title="点击查看老师详情" onclick="DuecourseFun.SearchTutorInfo(this)" data-id="' + v["TUID"] + '"></div></div>' +
                            '<i class="pec_img"></i>' +
                            '</div>';
                    });
                    $(".show_tutor_list2").html(Teahtml);
                }
                $(".full_showtutor").show();
                $(".show_tutor_tools2").html("");
                $(".shownoticeforstu2").hide();
            }
        });
    };
    //订课流程引导
    var Dk_Liuchen = function () {
        // 执行一些动作...
        if ($("#plans_tab .active").length > 0) {
            //根据老师订课
            if ($("#plans_tab li.active a").text().indexOf("根据老师订课") > -1) {
                introJs().setOptions({
                    //对应的按钮
                    prevLabel: '上一步',
                    nextLabel: '下一步',
                    skipLabel: '跳过',
                    doneLabel: '完成',
                    //对应的数组，顺序出现每一步引导提示
                    steps: [{
                        element: '.step_1',
                        intro: '更改当前套餐',
                        position: 'bottom'
                    },
                    {
                        element: '.step_2',
                        intro: '更改当前教材',
                        position: 'top'
                    },
                    {
                        element: '.step_3',
                        intro: '预定课程方式',
                        position: 'top'
                    },
                    {
                        element: '.step_4',
                        intro: '根据老师预定课程：选择上课老师',
                        position: 'top'
                    },
                    {
                        element: '.step_5',
                        intro: '选择上课日期及时间',
                        position: 'top'
                    },
                    {
                        element: '.step_6',
                        intro: '选择上课工具',
                        position: 'top'
                    },
                    {
                        element: '.step_7',
                        intro: '根据时间预定课程：选择上课时间',
                        position: 'top'
                    },
                    {
                        element: '.step_8',
                        intro: '选择上课老师',
                        position: 'top'
                    },
                    {
                        element: '.step_9',
                        intro: '选择选择上课工具',
                        position: 'top'
                    }
                    ]
                }).start();
            }
            if ($("#plans_tab li.active a").text().indexOf("根据时间订课") > -1) {
                Modal_Fun.init(1, 1)
            }
        }
    };
    return {
        init: function (option) {
            Config = $.extend(true, Config, option);
            Duec_fun();
            T_make();
            RemindEvaluationClass(Config.UID);
            DuecourseFun.LoadOrderMsg(Config.COID);

            //新版按时间约课日期初始化
            DuecourseFun.NewClassCalendarInit();
        },
        LoadOrderMsg: function (coid) {
            var result = Fn.Course.GetOrderLesson(coid);
            var html = "";
            if (!jQuery.isEmptyObject(result) && result != "[]") {
                html = "可预约" + result[5] + "课时，";
            }
            $(".setordernum").html(html);
            $(".show_orderList").hide();
            //$(".show_recom").hide();
            $(".show_tutor_list").html("");
            $(".show_recom_tutor").html("");
            $(".ac_tutor").show();
            //var res = Fn.Course.GetOrdeByCOID(coid); //旧版方法
            var res = Fn.Course.GetNewOrdeByCOIDAndCatID(coid, Config.CatID); //新版方法,res.selecttutor 包含老师是否擅长教授此CatID的教材的字段
            if (res) {
                Config.courseid = res.courseid;
                var leftclass = res.LeftClass,
                    TimeExpired = res.TimeExpired,
                    flag = false;
                if (leftclass > 0 && TimeExpired > 0 && res.orderstatus == 0) {
                    $(".ac_tutor,.ac_times,.show_orderstatus").hide();
                    $(".show_orderList,.Show_fullcander,.show_timelist").show();
                    $(".show_orderstatus").html("<div class=\"alert alert-info\">该套餐正常</div>");
                    flag = true;
                } else if (leftclass != "undefined" && leftclass == 0) {
                    $(".ac_tutor,.ac_times,.show_orderstatus").hide();
                    $(".show_orderList,.Show_fullcander,.show_timelist").show();
                    $(".show_orderstatus").html("<div class=\"alert alert-info\">该套餐正常</div>");
                } else if (TimeExpired != "undefined" && TimeExpired == 0) {
                    $(".ac_tutor,.show_orderList,.ac_times,.Show_fullcander,.show_timelist").hide();
                    $(".show_orderstatus").show();
                    $(".show_orderstatus").html("<div class=\"alert alert-danger\">该套餐已过期</div>");
                } else if (res.orderstatus == 2) {
                    $(".ac_tutor,.show_orderList,.ac_times,.Show_fullcander,.show_timelist").hide();
                    $(".show_orderstatus").show();
                    $(".show_orderstatus").html("<div class=\"alert alert-danger\">该套餐已退款</div>");
                } else {
                    $(".ac_tutor,.ac_times,.show_orderstatus").hide();
                    $(".show_orderList,.Show_fullcander,.show_timelist").show();
                    $(".show_orderstatus").html("<div class=\"alert alert-info\">该套餐正常</div>");
                }
                if (TimeExpired != "undefined")
                    $(".valid_date").html(res.endTime);
                else
                    $(".valid_date").html("无");
                //套餐下的老师
                var selecttutor = res.selecttutor;
                if (selecttutor && selecttutor.length > 0) {
                    var num = 0;
                    var fullname = [];
                    var Teahtml = "";
                    Config.select = "";
                    var Teahtml1 = "",
                        sexhtml = "",
                        Theml = "";
                    $.each(selecttutor, function (i, v) {
                        if (v["sex"] == 0)
                            sexhtml = '<div class="Tutor_Nv"></div>';
                        else
                            sexhtml = '<div class="Tutor_Man"></div>';
                        if (!jQuery.isEmptyObject(v["TutorPic"])) {
                            sexhtml = '<img src="' + v["TutorPic"] + '" style="width: 68px;text-align:center;border-radius: 50% !important;height: 68px;padding: 10px;margin-left: 25px;">';
                        }
                        Teahtml1 += '<div class="Book_Tutor">';
                        if (v.NotGoodAt == 1) { //教材不符
                            Teahtml1 += '<div class="Book_Tutor_rom">';

                        } else {
                            Teahtml1 += '<div class="Book_Tutor_rom" onclick="DuecourseFun.GetTutorTimes(this,' + v["TUID"] + ')">';
                        }
                        Teahtml1 += sexhtml + '<div class="Tutor_bottom">' + v["FullName"] + '</div>';

                        if (v.NotGoodAt == 1) { //教材不符
                            Teahtml1 += '      <div class="Book_Discrepancy" style="position: absolute;right:5px;top:5px;color:#FF7676;font-size:12px;">教材不符</div>';
                        } else {
                            Teahtml1 += '      <div class="Book_ChaKan" title="点击查看老师详情" onclick="DuecourseFun.SearchTutorInfo(this)" data-id="' + v["TUID"] + '"></div>';

                        }

                        Teahtml1 += '   </div>' +
                            '           <i class="pec_img"></i>' +
                            '    </div>';
                        Config.select += v["TUID"] + ',';
                        num++;
                    });
                    Config.OtherTutor = 10 - num;
                    if (num < 8) {
                        Theml += '<div class="Book_Tutor_add"><a href="javascript:;" style="border: 2px solid white">' +
                            '<img class="add-teach" style="border-radius:0% !important;width:120px;height:80px;margin-left:0px;padding:0;" onclick="DuecourseFun.SearchByOne(this)" title="点击随机分配老师" href="javascript:;" src="' + CDNUrl + '/web/webnew/assets/admin/pages/img/gray-icon.png" class=" img" />' +
                            '</a></div>';
                        num++;
                    }
                    $(".show_tutor_list").html(Teahtml1 + Theml);
                }
                if (flag) {
                    $(".ac_tutor").hide();
                    $(".show_orderList").show();
                }
            } else {
                $(".ac_tutor").hide();
            }
        },
        //获取推荐老师
        GetRectutor: function (obj) {
            $(obj).html("加载中...");
            $(".show_recom_tutor").html("加载中...");
            //推荐老师
            var rectutor = Fn.Course.GetRectutorList(Config.COID);
            var recom = "暂无推荐老师";
            if (rectutor && rectutor.length > 0 && $(".show_tutor_list").length > 0) {
                var sexhtml = "";
                recom = "";
                $.each(rectutor, function (i, v) {
                    if (v["sex"] == 0)
                        sexhtml = '<div class="Tutor_Nv"></div>';
                    else
                        sexhtml = '<div class="Tutor_Man"></div>';
                    if (!jQuery.isEmptyObject(v["TutorPic"]) && v["CheckPic"] == 1) {
                        sexhtml = '<img src="' + v["TutorPic"] + '" style="width: 68px;text-align:center;border-radius: 50% !important;height: 68px;padding: 10px;margin-left: 25px;">';
                    }

                    recom += '<div class="Book_Tutor">' +
                        '<div class="Book_Tutor_rom" onclick="DuecourseFun.GetTutorTimes(this,' + v["TUID"] + ')">' +
                        sexhtml +
                        '<div class="Tutor_bottom">' + v["FullName"] + '</div>' +
                        '<div class="Book_ChaKan" title="点击查看老师详情" onclick="DuecourseFun.SearchTutorInfo(this)" data-id="' + v["TUID"] + '"></div></div>' +
                        '<i class="pec_img"></i>' +
                        '</div>';
                });
            }
            $(obj).html("点击获取");
            $(".show_recom_tutor").html(recom);
        },
        //获取老师时间
        GetTutorTimes: function (obj, tuid) {
            if ($(obj).parents("#tab_1_1").length > 0) {
                $("#tab_1_1").find(".Book_Tutor").removeClass("active");
            } else if ($(obj).parents("#tab_1_2").length > 0) {
                $("#tab_1_2").find(".Book_Tutor").removeClass("active");
            }
            $(obj).parent().addClass("active");
            Config.TUID = tuid;
            //获取导师可安排时间
            var tutorDays = Fn.Course.GetTutorTime(tuid, Config.COID);
            $("#calendar1").ionCalendar({
                years: Config.StarYear + "-" + Config.EndYear,
                selectMonths: true,
                selectYears: true,
                hideArrows: false,
                Multiplecalls: true,
                dateData: tutorDays,
                onClick: function (t) {
                    var targettime = moment(t).format("YYYY-MM-DD");
                    var hourData = Fn.Course.GetTargetTimeAvaDuration(tuid, targettime, Config.COID);
                    var thtml = "";
                    if (!$.isEmptyObject(hourData)) {
                        $.each(hourData, function (i, obj) {
                            thtml += '<label data-day="' + targettime + '" data-time="' + obj.hour + '" data-tuid="' + tuid + '" onclick="DuecourseFun.OnclickClassTime(this)" class="btn btn-transparent time btn-outline btn-sm margin5" style="vertical-align: middle;">' +
                                obj.duration + '</label>';
                        });
                    }
                    $(".show_tutor_times").html(thtml)
                }
            });
            $(".show_calender").show();
            //获取老师上课工具
            var classtools = Fn.Course.GetNewTutorClassTool(tuid);
            var classtool = classtools.split('').reverse().join('');
            var toolhtml = "";
            Config.ClassTool1 = 0;
            if (classtool && classtool.length > 0) {
                for (var ii = 0; ii < classtool.split(',').length; ii++) {
                    if (classtool.split(',')[ii] == 5)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='E-classroom' class='tutor_tools3' onclick=DuecourseFun.GetTutorTools(this,5,1)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 1)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='QQ' class='tutor_tools1' onclick=DuecourseFun.GetTutorTools(this,1,1)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 6 && Config.wxCourse.indexOf(',' + Config.courseid + ',') >= 0)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='WeChat' class='tutor_tools4' onclick=DuecourseFun.GetTutorTools(this,6,1)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 7)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='ClassIn' class='tutor_tools7' onclick=DuecourseFun.GetTutorTools(this,7,1)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 8)
                        toolhtml += "<li><a href=\"javascript:;\" ><div title='A-Classroom' class='tutor_tools8' onclick=DuecourseFun.GetTutorTools(this,8,1)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 9)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='GameClass' class='tutor_tools9' onclick=DuecourseFun.GetTutorTools(this,9,1)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 2)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='Skype' class='tutor_tools2' onclick=DuecourseFun.GetTutorTools(this,2,1)></div></a><i></i></li>";
                }
                if (Config.IsShowTool == "False")
                    toolhtml += "<li style='margin-top:60px;color:#2e6da4;margin-left:10px;'><label class='moretool' >>> 更多工具</label></li>";
            }
            $(".show_tutor_tools").html(toolhtml);
            $(".shownoticeforstu").hide();

            //清空数据
            Config.ClassTimes = [];
            $(".schooltime1").html('<div class="btn btn-circle btn-primary btn-sm wait_add">待添加</div>');
            $(".show_tutor_times").html("");
            $(".tutor_tools2,.tutor_tools1").parent().parent().hide();
            $(".moretool").on("click", function () {
                $(".tutor_tools2,.tutor_tools1").parent().parent().show();
                $(this).parent().hide();
            });
        },
        GetTutorTools: function (obj, tool, type) {
            if (type == 1) {
                $(obj).parent().parent().addClass("selected").siblings("li").removeClass("selected");
                Config.ClassTool1 = tool;
                if (tool == 5) {
                    $(".shownoticeforstu").show();
                } else {
                    $(".shownoticeforstu").hide();
                }
            } else if (type == 2) {
                $(obj).parent().parent().addClass("selected").siblings("li").removeClass("selected");
                Config.ClassTool2 = tool;
                if (tool == 5) {
                    $(".shownoticeforstu2").show();
                } else {
                    $(".shownoticeforstu2").hide();
                }
            }
        },
        //点击时间事件
        OnclickClassTime: function (obj) {
            $(".wait_add").hide();
            if ($(".schooltime1").find(".classtime1").length < 5) {
                var time = $(obj).attr("data-day") + " " + $(obj).attr("data-time");
                if (Config.ClassTimes.indexOf(time) == -1) {
                    $(".schooltime1").append("<div class=\"btn btn-circle btn-primary btn-sm classtime1 margin5\">" + time + "&nbsp;<i onclick='DuecourseFun.RemoveTimes(this,\"" + time + "\")' class='fa fa-times' style='color: red!important;'></i></div>");
                    Config.ClassTimes.push(time);
                }
            } else if ($(".schooltime1").find(".classtime1").length == 4 || $(".schooltime1").find(".classtime1").length > 4) {
                Modal_Fun.init("一次最多只能预定5节课", 1);
            }
        },
        //老师上课工具
        GetSelectTools2: function (obj, tuid) {
            $(".full_tutortool").show();
            if ($(obj).parents("#tab_1_1").length > 0) {
                $("#tab_1_1").find(".Book_Tutor").removeClass("active");
            } else if ($(obj).parents("#tab_1_2").length > 0) {
                $("#tab_1_2").find(".Book_Tutor").removeClass("active");
            }
            $(obj).parent().addClass("active");
            Config.TUID = tuid;
            Config.ClassTool2 = 0;
            //获取老师上课工具
            var classtools = Fn.Course.GetNewTutorClassTool(tuid);
            var classtool = classtools.split('').reverse().join('');
            var toolhtml = "";
            if (classtool && classtool.length > 0) {
                for (var ii = 0; ii < classtool.split(',').length; ii++) {
                    if (classtool.split(',')[ii] == 5)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='E-classroom' class='tutor_tools3' onclick=DuecourseFun.GetTutorTools(this,5,2)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 6 && Config.wxCourse.indexOf(',' + Config.courseid + ',') >= 0)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='WeChat' class='tutor_tools4' onclick=DuecourseFun.GetTutorTools(this,6,2)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 7)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='ClassIn' class='tutor_tools7' onclick=DuecourseFun.GetTutorTools(this,7,2)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 8)
                        toolhtml += "<li><a href=\"javascript:;\"  ><div title='A-Classroom' class='tutor_tools8' onclick=DuecourseFun.GetTutorTools(this,8,2)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 9)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='GameClass' class='tutor_tools9' onclick=DuecourseFun.GetTutorTools(this,9,2)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 2)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='Skype' class='tutor_tools2' onclick=DuecourseFun.GetTutorTools(this,2,2)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 1)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='QQ' class='tutor_tools1' onclick=DuecourseFun.GetTutorTools(this,1,2)></div></a><i></i></li>";
                }
                if (Config.IsShowTool == "False")
                    toolhtml += "<li style='margin-top:60px;color:#2e6da4;margin-left:10px;'><label class='moretool' >>> 更多工具</label></li>";
            }
            $(".show_tutor_tools2").html(toolhtml);
            $(".shownoticeforstu2").hide();
            $(".tutor_tools2,.tutor_tools1").parent().parent().hide();
            $(".moretool").on("click", function () {
                $(".tutor_tools2,.tutor_tools1").parent().parent().show();
                $(this).parent().hide();
            });
        },
        //移除选定时间
        RemoveTimes: function (obj, time) {
            $(obj).parent().remove();
            for (var i = 0; i < Config.ClassTimes.length; i++) {
                if (Config.ClassTimes[i] == time) {
                    Config.ClassTimes.splice(i, 1)
                }
            }
            if (Config.ClassTimes.length == 0)
                $(".wait_add").show();
        },
        // [ 已废弃的方法，请使用 AppointClass，2018.06.20 by:Seya] 根据老师预定课程
        BookLessonList: function (obj) {
            if ($(".cat_name").html() == undefined || $(".cat_name").html().length == 0) {
                Modal_Fun.init("您还未选择教材！", 1);
                return;
            }
            var $selft = $(obj),
                classtool = Config.ClassTool1;
            if (classtool == 0) {
                Modal_Fun.init("请您选择上课工具", 1);
                return;
            };
            if (Config.ClassTimes.length == 0) {
                Modal_Fun.init("您还未选择时间！", 1);
                return;
            };
            //            if (Config.ClassTimes.length > 5) {
            //                Modal_Fun.init("您最多可选择5个时间预定课程！",1);
            //                return;
            //            };
            if (Config.ClassTimes.length > 1) {
                Modal_Fun.init("系统正在升级暂不支持选择多个时间，您最多可选择1个时间预定课程！", 1);
                return;
            }
            if ((classtool != 7 && classtool != 8) && $("#issz").val() == 1) {
                Modal_Fun.init("<font color='red'>约课失败：该教材只能使用ClassIn或AClassRoom上课，请更换所有未上课的上课工具！</font>", 1);
                return;
            }
            var msg = '';
            for (var ii = 0; ii < Config.ClassTimes.length; ii++) {
                if (ii == (Config.ClassTimes.length - 1))
                    msg += "<label>[" + Config.ClassTimes[ii] + "]</label>";
                else
                    msg += "<label>[" + Config.ClassTimes[ii] + "]、</label>";
            }
            $selft.attr("disabled", true).text("Loading...");
            var tutor = $(".Book_Tutor.active").find(".Book_Tutor_rom>.Tutor_bottom").text();
            var tool = $(".sys_spec_img.show_tutor_tools").find("li.selected>a>div").attr("title");
            var hour = Config.ClassTimes[0].substr(11, 2);
            var str = "";
            if (parseInt(hour) < 10) {
                str = "<br/><small class='text-danger'>温馨提示:早上6-9am的课时暂不提供客服服务，若介意请预约早上9点-晚上11点间的课时</small>";
            }
            Modal_Fun.init("您确定要预约:<br/>" + msg + "的课吗？<br/>上课老师：" + tutor + "<br/>上课工具：" + tool + str, 2);
            $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                if ($('#Modal_Fun_room').attr("data-action") == "true") {
                    //                    var result = Fn.Course.InsertClassTimeList(Config.TUID,3, Config.COID, Config.UID, Config.ClassTimes, classtool)

                    var result = Fn.Course.InsertClassTime(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTimes[0], classtool, 0, "", "")
                    if (result.code == "success") {
                        $(".class-time .checked").addClass("disabled").children("input").attr("disabled", true);
                        Modal_Fun.init("预订成功", 1);
                        DuecourseFun.GetTutorTimes($(".Book_Tutor_rom").find(".Book_Tutor"), Config.TUID);
                    } else {
                        Modal_Fun.init(result.msg, 1);
                    }
                }
            });
            $selft.removeAttr("disabled").text("确定预定");
        },
        // [ 用于替代BookLessonList方法，2018.06.20 by:Seya] 新版根据老师预定课程
        AppointClass: function (obj) {

            /// <summary>
            /// [ 用于替代BookLessonList方法，2018.06.20 by:Seya] 新版根据老师预定课程
            /// </summary>
            /// <param name="obj">按钮</param>
            if ($(".cat_name").html() == undefined || $(".cat_name").html().length == 0) {
                Modal_Fun.init("您还未选择教材！", 1);
                return;
            }
            var $selft = $(obj),
                classtool = Config.ClassTool1;
            if (classtool == 0) {
                Modal_Fun.init("请您选择上课工具", 1);
                return;
            };
            if (Config.ClassTimes.length == 0) {
                Modal_Fun.init("您还未选择时间！", 1);
                return;
            };
            //            if (Config.ClassTimes.length > 5) {
            //                Modal_Fun.init("您最多可选择5个时间预定课程！",1);
            //                return;
            //            };
            if (Config.ClassTimes.length > 1) {
                Modal_Fun.init("系统正在升级暂不支持选择多个时间，您最多可选择1个时间预定课程！", 1);
                return;
            };
            if ((classtool != 7 && classtool != 8) && $("#issz").val() == 1) {
                Modal_Fun.init("<font color='red'>约课失败：该教材只能使用ClassIn或AClassRoom上课，请更换所有未上课的上课工具！</font>", 1);
                return;
            }
            if (new Date(Date.parse(Config.ClassTimes[0])) >= new Date(Date.parse('2018/10/1 00:00')) && classtool == 5) {
                Modal_Fun.init("<font color='red'>约课失败：E-classroom将于2018年9月30日全面下线，请更换上课工具！</font>", 1);
                return;
            }

            var msg = '';
            for (var ii = 0; ii < Config.ClassTimes.length; ii++) {
                if (ii == (Config.ClassTimes.length - 1))
                    msg += "<label>[" + Config.ClassTimes[ii] + "]</label>";
                else
                    msg += "<label>[" + Config.ClassTimes[ii] + "]、</label>";
            }
            $selft.attr("disabled", true).text("Loading...");
            var tutor = $(".Book_Tutor.active").find(".Book_Tutor_rom>.Tutor_bottom").text();
            var tool = $(".sys_spec_img.show_tutor_tools").find("li.selected>a>div").attr("title");
            var hour = Config.ClassTimes[0].substr(11, 2);
            var dateNow = new Date(); //获取当前时间
            var dateDiff = (new Date(Config.ClassTimes[0]).getTime() - dateNow.getTime()) / 60000; //时间差的分钟
            var str = "";
            if (dateDiff < 180) {
                str = "<br/><small class='text-danger'>温馨提示:该课时距离开课时间已不足三小时，预约后将无法取消。</small>";
            }
            if (parseInt(hour) < 10) {
                str = "<br/><small class='text-danger'>温馨提示:早上6-9am的课时暂不提供客服服务，若介意请预约早上9点-晚上11点间的课时</small>";
            }
            Modal_Fun.init("您确定要预约:<br/>" + msg + "的课吗？<br/>上课老师：" + tutor + "<br/>上课工具：" + tool + str, 2);
            $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                if ($('#Modal_Fun_room').attr("data-action") == "true") {
                    //                    var result = Fn.Course.InsertClassTimeList(Config.TUID,3, Config.COID, Config.UID, Config.ClassTimes, classtool)

                    Fn.Course.AppointClass(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTimes[0], classtool, 0, "", "", function (data) {
                        var json = data.value;

                        DuecourseFunNewbtn(Config.UID, Config.ClassTool1, Config.TUID, $(".Book_Tutor.active").find(".Tutor_bottom").text(), json.result, json.msg);

                        if (json.result) {
                            $(".class-time .checked").addClass("disabled").children("input").attr("disabled", true);
                            var HelpCenter = json.msg;
                            if (classtool == 8) {
                                HelpCenter += "<br><a href=\"https://www.acadsoc.com.cn/WebNew/user/HelpCenter/Video.aspx\" target=\"_blank\" class=\"text-success\">点击查看 A-Classroom 使用教学</a>";
                            }

                            /*如果有产品评价资格就只弹出评价框*/
                            var r = Fn.User.IsProductEvaluationCondition(0);
                            if (r["r"] > 0) {

                                $("#product_modal").modal("show");
                            } else {
                                Modal_Fun.init(HelpCenter, 1);
                            }
                            //如果是PC端，则显示PC端的约课成功分享弹窗
                            if (window.WXShareTipConfig && window.WXShareTipConfig.pcOrderClass === true) {
                                if (window.WXShareTipFunc) {
                                    WXShareTipFunc.get_pcOrderClass(); //弹出分享提示
                                }
                            }
                            DuecourseFun.GetTutorTimes($(".Book_Tutor_rom").find(".Book_Tutor"), Config.TUID);
                        } else {
                            Modal_Fun.init(json.msg, 1);
                        }
                    });

                }
            });
            $selft.removeAttr("disabled").text("确定预定");
        },
        //关闭分享提示（具体怎样弹窗等操作）
        closeShare: function (action_id) {
            /// <summary>
            /// 显示用户动作的分享提示，action_id=1 表示约课成功， 2表示上完课
            /// </summary>
            var rid = 0,
                tid = 0;
            if (window.__pageShareActionData) {
                if (__pageShareActionData[action_id.toString()]) {
                    var _action = __pageShareActionData[action_id.toString()];
                    rid = _action.record_id;
                    tid = _action.tid;
                }
            }
            if (rid <= 0 || tid <= 0) {
                return;
            }
            Fn.Course.CloseShareTip(rid, tid, function (data) {
                var json = data.value;
                if (json.result) {
                    //调用本方法时已经关闭了弹窗，所以这里无须再关
                }
            });

            //Fn.Course.GetShareTips(action_id, function (data) {
            //    var json = data.value;
            //    if (json.result) {
            //        if (json.data.has_action) {

            //        }
            //    } else {
            //    }
            //});

        },
        // //显示分享提示（具体怎样弹窗等操作）
        // showShare: function(action) {
        //     window.__shareTipAction = action;
        //     Fn.Course.ShowShareTip(action.record_id, function(data) {
        //         var json = data.value;
        //         if (json.result) {
        //             $('#lessonSharing-modal').modal('show');
        //             //$("#endClassTip").modal("show");
        //             //var url = '/lps/lessonSharing/lessonShareGuide.htm?rid=' + json.data.record_id + '&tid=' + json.data.id;
        //             //$("#lessonSharingViewBtn").attr({
        //             //    'data-url': url
        //             //});
        //         }
        //     });
        // },
        //添加老师
        SearchByOne: function (obj) {
            $obj = $(obj).parent().parent();
            if (Config.OtherTutor > 0) {
                var result = Fn.Course.SearchByOne(Config.select, Config.COID);
                if (result) {
                    if (result._r > 0) {
                        var data = result.data[0];
                        var sexhtml = "";
                        var html = "&nbsp;" + data.Name;

                        if (data["Sex"] == 0)
                            sexhtml = '<div class="Tutor_Nv"></div>';
                        else
                            sexhtml = '<div class="Tutor_Man"></div>';
                        if (!jQuery.isEmptyObject(data["TutorPic"]) && data["CheckPic"] == 1) {
                            sexhtml = '<img src="' + data["TutorPic"] + '" style="width: 68px;text-align:center;border-radius: 50% !important;height: 68px;padding: 10px;margin-left: 25px;">';
                        }

                        var Teahtml = '<div class="Book_Tutor_rom" onclick="DuecourseFun.GetTutorTimes(this,' + data["TUID"] + ')">' +
                            sexhtml +
                            '<div class="Tutor_bottom">' + data["Name"] + '</div>' +
                            '<div class="Book_ChaKan" title="点击查看老师详情" onclick="DuecourseFun.SearchTutorInfo(this)" data-id="' + data["TUID"] + '"></div></div>' +
                            '<i class="pec_img"></i>';
                        $obj.removeClass("Book_Tutor_add").addClass("Book_Tutor").html(Teahtml);

                        Config.select += data.TUID + ",";
                        Config.OtherTutor--;
                        if (Config.OtherTutor > 0) {
                            var Teahtml1 = '<div class="Book_Tutor_add"><a href="javascript:;" style="border: 2px solid white">' +
                                '<img class="add-teach" onclick="DuecourseFun.SearchByOne(this)" title="点击随机分配老师" href="javascript:;" src="' + CDNUrl + '/web/webnew/assets/admin/pages/img/gray-icon.png" class=" img" />' +
                                '</a></div>';
                            $obj.parent().append(Teahtml1);
                        }
                    } else {
                        Modal_Fun.init(result._msg, 1);
                    }
                }
            } else {
                Modal_Fun.init("您套餐下的8位老师已满！", 1);
            }
        },
        AddTeachUser: function (tuid) {
            var i = Fn.User.AddTeachUser(tuid, Config.UID, Config.COID);
            if (i == 1) {
                $("#ModalTeacherAdd").modal("show");
                $("#ModalTeacherintr").modal("hide");
                DuecourseFun.NewGetTutorByTime(0);
            } else if (i == 2) {
                //老师超过10个，去删除老师
                $("#ModalTeacherFull").modal("show");
                $("#ModalTeacherintr").modal("hide");
            } else if (i == 3) {
                alert("该老师你已关注！");
            } else {
                alert("添加失败请找客服处理！");
            }
        },
        //查看老师信息
        SearchTutorInfo: function (obj) {
            var tuid = $(obj).attr("data-id");
            Config.TutorList = Fn.User.GetTutorTableListByTUID(tuid);
            var htm = "";
            if (Config.TutorList != null && Config.TutorList.length > 0) {
                $.each(Config.TutorList, function (index, v) {
                    if (tuid == v.TUID) {
                        //tutor info
                        var htm = "";
                        htm += "  <h4><span style='margin-right:10px'>" + v.FullName + "</span>";
                        if (typeof (v.Sex) != "undefined")
                            htm += (parseInt(v.Sex) == 1 ? "<i class='fa fa-male'></i>" : "<i class='fa  fa-female'></i>");
                        htm += "  <span style='float:right;width: 50px; height:25px;line-height:25px;padding-left:10px'>" + v.Score + "</span><div class='yk_level yk_lv5'></div></p>";
                        htm += "  </h4>";
                        if (typeof (v.mp3file) != "undefined")
                            //                            htm += " <p class='jmp3'>" + v.mp3file + "</p> ";
                            htm += "<div class='col-xs-12 col-md-12 no-padding'><audio src='" + v.mp3file + "' preload='auto' /></div>";
                        if (typeof (v.ListSub) != "undefined" && v.ListSub.length > 0) {
                            htm += " <p>【擅长科目】：";
                            $.each(v.ListSub, function (kk, vv) {
                                htm += " <span class='badge badge-success badge-roundless margin-bottom-10 margin-right-10' style='background-color: #48c9b0;'>" + vv.Name + "</span>";
                            });
                            htm += "</p>";
                        }
                        if (typeof (v.Profile) != "undefined")
                            htm += " <p>【自我介绍】：<span>" + v.Profile + "</span></p>";
                        //modal
                        ($("#tutorinfo_modal").length > 0) ? $("#tutorinfo_modal").remove() : "";
                        var modal = '<div class="modal" id="tutorinfo_modal" aria-hidden="false">' +
                            '<div class="modal-dialog">' +
                            '<div class="modal-content">' +
                            '<div class="modal-header">' +
                            '<button type="button" class="close" aria-hidden="true" data-dismiss="modal" tabindex="-1">&times;</button>' +
                            '<h4 class="modal-title fa fa-graduation-cap">' + v.FullName + ' 个人介绍</h4>' +
                            '</div>' +
                            '<div class="modal-body">' + htm + '</div>' +
                            '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-white" data-dismiss="modal">' +
                            '关闭</button>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        $(modal).appendTo("body").modal("show");
                        //                        $(".jmp3").jmp3({
                        //                            "backcolor": "1ABC9C",
                        //                            "forecolor": "ffffff",
                        //                            "width": "130",
                        //                            "volume": "80"
                        //                        });
                        audiojs.events.ready(function () {
                            var as = audiojs.createAll();
                        });
                    }
                })
            }
        },
        NewSearchTutorInfo: function (obj, ismyteacher) {
            var tuid = $(obj).attr("data-id");
            Config.TutorList = Fn.User.GetTutorTableListByTUID(tuid);
            var htm = "";
            if (Config.TutorList != null && Config.TutorList.length > 0) {
                $.each(Config.TutorList, function (index, v) {
                    if (tuid == v.TUID) {
                        //tutor info
                        var htm = "";
                        htm += "  <div class='ModalTeacherintr1'><div class='ModalTeacherintr1_1'>" + v.FullName;
                        if (typeof (v.Sex) != "undefined")
                            htm += (parseInt(v.Sex) == 1 ? "<span class='man'></span>" : "<span class='woman'></span>");
                        htm += "  <div class='ModalTeacherintr1_2'>" + v.Score + "</div>";
                        htm += "  </div>";
                        //star
                        htm += "<div class='ModalTeacherintr2'><ul><li class='active'></li><li class='active'></li><li class='active'></li><li class='active'></li><li class='active'></li></ul></div>";
                        if (typeof (v.mp3file) != "undefined")
                            //                            htm += " <p class='jmp3'>" + v.mp3file + "</p> ";
                            htm += "<div class='ModalTeacherintr3'><audio id='TeacherAudio' src='" + v.mp3file + "' /></div>";
                        if (typeof (v.ListSub) != "undefined" && v.ListSub.length > 0) {
                            htm += " <div class='ModalTeacherintr5'><div class='col-md-3'>【擅长科目】：</div><div class='col-md-9'>";
                            $.each(v.ListSub, function (kk, vv) {
                                htm += " <span>" + vv.Name + "</span>";
                            });
                            htm += "</div></div>";
                        }
                        if (typeof (v.Profile) != "undefined")
                            htm += " <div class='ModalTeacherintr6'>【自我介绍】：<span>" + v.Profile + "</span></div>";
                        if (ismyteacher != 1) {
                            htm += "<div class='ModalTeacherintr7'><a href='javascript:;' class='btn' onclick='DuecourseFun.AddTeachUser(" + tuid + ")'>关注</a></div>";
                        }
                        //modal
                        ($("#ModalTeacherintr").length > 0) ? $("#ModalTeacherintr").remove() : "";
                        var modal = '<div class="modal fade" id="ModalTeacherintr" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                            '<div class="modal-dialog">' +
                            '<div class="modal-content">' +
                            '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                            '<h6 class="modal-title" id="myModalLabel">' + v.FullName + ' 个人介绍</h6>' +
                            '</div>' +
                            '<div class="modal-body row">' + htm + '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        $(modal).appendTo("body").modal("show");
                        //                        $(".jmp3").jmp3({
                        //                            "backcolor": "1ABC9C",
                        //                            "forecolor": "ffffff",
                        //                            "width": "130",
                        //                            "volume": "80"
                        //                        });
                        audiojs.events.ready(function () {
                            var as = audiojs.createAll();
                        });
                    }
                })
            }
        },
        NewGetTutorByTime: function (index) {

            var selectDate = $('#startDate').val();
            var selecttimeobj = $('.newbookbox.active').find('.ClassTime.active')[0];
            var selecttime = $(selecttimeobj).text();

            if (!selectDate || !selecttime) {
                $("#ModalPleaseClassTime").modal("show");
                return;
            };


            var selectradio = $('.ClassTool.active').find('input')[0];
            var classtool = $(selectradio).val();
            if (!classtool) {
                $("#ModalPleaseTool").modal("show");
                //Modal_Fun.init("请您选择上课工具", 1);
                return;
            };

            var start = $.trim(selectDate) + " " + $.trim(selecttime);
            var coid = $(".selectclass").val();
            var sex = $("#sex").val();





            var IsCamera = $('#IsCamera').val();

            var Personality = $('#TeacherPers').attr('data-id');


            var TeachStyle = $('#TeacherStyle').attr('data-id');





            var data = Fn.Course.NewGetTutorByTime(index, coid, start, classtool, sex, IsCamera, Personality, TeachStyle);

            if (data.code < 0) {
                if (data.code == -1) {

                    //不支持十分钟前约课
                    $("#ModalTenMinutes").modal("show");
                    return;
                } else if (data.code == -2) {
                    if (Fn.User.IsJPClassUser) {
                        alert("请去我的教材解锁课程！");
                        return;
                    }
                    //套餐过期
                    $("#ModalPackageOverdue").modal("show");
                    return;
                } else if (data.code == -3) {
                    if (Fn.User.IsJPClassUser) {
                        alert("请去我的教材解锁课程！");
                        return;
                    }
                    //课时使用完
                    $("#ModalPackageFinished").modal("show");
                    return;
                } else {
                    Modal_Fun.init(data.msg, 1);
                    return;
                }

            }

            var strallteacher = "";
            var strmyteacher = "";

            if (data.MyTeacher.length == 0) {
                $('#myteacherdiv').hide();
            } else {
                $('#myteacherdiv').show();
            }

            if (data.AllTeacher.length == 0) {
                $('#otherteacherdiv').hide();
            } else {
                $('#otherteacherdiv').show();
            }

            if (data.MyTeacher.length == 0 && data.AllTeacher.length == 0) {
                $('#bookclassdiv').hide();
                $('.TeacherVacancy').show();
            } else {
                $('#bookclassdiv').show();
                $('.TeacherVacancy').hide();

            }
            $.each(data.AllTeacher, function (i, v) {
                var sexhtml = "";
                if (v["Sex"] == 0)
                    sexhtml = "TeacherWoMan";
                else
                    sexhtml = "TeacherMan";
                strallteacher += '<div class="TeacherBox" name="MyTeacher" data-id="' + v["TUID"] + '">' +
                    '<div class="TeacherBox1 ' + sexhtml + '"></div>' +
                    '<div class="TeacherBox2">' + v["FullName"] + '</div>' +
                    '<div class="TeacherBox3"><a href="javascript:;" onclick="DuecourseFun.NewSearchTutorInfo(this,0)" class="btn" data-id="' + v["TUID"] + '">查看详情</a>' + '</div>' +
                    '<span class="TeacherState"></span>' +
                    '</div>';
            });
            $('#newbookclass_allteacher').html(strallteacher);


            $.each(data.MyTeacher, function (i, v) {
                var sexhtml = "";
                if (v["Sex"] == 0)
                    sexhtml = "TeacherWoMan";
                else
                    sexhtml = "TeacherMan";
                strmyteacher += '<div class="TeacherBox" name="MyTeacher" data-id="' + v["TUID"] + '">' +
                    '<div class="TeacherBox1 ' + sexhtml + '"></div>' +
                    '<div class="TeacherBox2">' + v["FullName"] + '</div>' +
                    '<div class="TeacherBox3"><a href="javascript:;" onclick="DuecourseFun.NewSearchTutorInfo(this,1)" class="btn" data-id="' + v["TUID"] + '">查看详情</a>' + '</div>' +
                    '<span class="TeacherState"></span>' +
                    '</div>';
            });

            $('#newbookclass_myteacher').html(strmyteacher);


            Config.newgettutorbytimeindex = data.Index;
        },
        //新版按时间约课日期初始化
        NewClassCalendarInit: function () {
            //$("#startDate").val(moment().format('YYYY-MM-DD'));

            //可以约课的时间到下一周的周日
            var endate;
            if (moment().days() == 0) {
                endate = moment().days(7).format('YYYY-MM-DD');
            } else {
                endate = moment().days(14).format('YYYY-MM-DD');
            }

            //先转换为日期再比较
            var days = moment(endate).diff(moment(moment().format('YYYY-MM-DD')), 'days') + 1;
            var classcalendarDays = new Array();
            for (var i = 0; i < days; i++) {
                var dayobj = { "isfull": 0, "time": moment().add(i, "d").format('YYYY-MM-DD') };
                classcalendarDays[i] = dayobj;

            }
            $("#classcalendar").ionCalendar({
                years: moment().add('years', -1).format("YYYY") + "-" + moment().add('years', 1).format("YYYY"),
                selectMonths: true,
                selectYears: true,
                hideArrows: false,
                Multiplecalls: true,
                dateData: classcalendarDays,
                onClick: function (t) {
                    var targettime = moment(t).format("YYYY-MM-DD");
                    var array1 = ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
                    var array2 = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];
                    var array3 = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
                    var array = [array1, array2, array3];
                    $('.newbookbox').each(function (i, obj) {

                        var str = '';
                        $.each(array[i], function (i, value) {

                            if (moment().isBefore(targettime + ' ' + value)) {
                                str += '<a href="javascript:;" class="btn ClassTime">' + value + '</a>';
                            } else {
                                str += '<a href="javascript:;" class="btn ClassTime disabled">' + value + '</a>';
                            }

                        });
                        $(obj).html(str);
                    });
                    $("#startDate").val(targettime);
                    $("#classcalendar").hide();
                }
            });
        },
        //[ 废弃的方法，请使用 AppointLesson 方法 2018.06.21 by:Seya ]根据老师预定课程
        BookLesson: function (obj) {
            /// <summary>
            /// [ 废弃的方法，请使用 AppointLesson 方法 2018.06.21 by:Seya ]根据老师预定课程
            /// </summary>
            if ($(".cat_name").html() == undefined || $(".cat_name").html().length == 0) {
                Modal_Fun.init("您还未选择教材！", 1);
                return;
            }
            var $selft = $(obj),
                classtool = Config.ClassTool2;
            if (Config.ClassTime == null) {
                Modal_Fun.init("您还未选择时间！", 1);
                return;
            };
            if (classtool == 0) {
                Modal_Fun.init('请您选择上课工具！', 1);
                return;
            }
            if ((classtool != 7 && classtool != 8) && $("#issz").val() == 1) {
                Modal_Fun.init("<font color='red'>约课失败：该教材只能使用ClassIn或AClassRoom上课，请更换所有未上课的上课工具！</font>", 1);
                return;
            }
            var msg = '';
            $selft.attr("disabled", true).text("Loading...");
            var hour = Config.ClassTime.substr(11, 2);
            var str = "";
            if (parseInt(hour) < 10) {
                str = "<br/><small class='text-danger'>温馨提示:早上6-10am的课时暂不提供客服服务，若介意请预约早上10点-晚上11点间的课时</small>";
            }
            Modal_Fun.init("您要预约 [" + Config.ClassTime + "] 的课吗？" + str, 2);
            $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                if ($('#Modal_Fun_room').attr("data-action") == "true") {
                    var result = Fn.Course.InsertClassTime(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTime, classtool, 0, "", "");
                    if (result.code == "success") {
                        $(".class-time .checked").addClass("disabled").children("input").attr("disabled", true);
                        Modal_Fun.init("预订成功！", 1);
                        $(".fc-title").each(function (i) {
                            // console.log($(this).text())
                            if ($(this).css("background-color") == "rgb(255, 140, 0)") {
                                $(this).parent().parent("a").hide();
                            }
                        });
                        $("[name=DueDate2]").text("").hide();
                        $(".show_tutor_list2").html("");
                        $(".show_tutor_tools2").html("");
                        $(".full_showtutor").hide();
                        $(".full_tutortool").hide();
                        Config.ClassTime = null;
                        Config.ClassTool2 = 0;
                    } else {
                        Modal_Fun.init(result.msg, 1);
                    }
                }
            });
            $selft.removeAttr("disabled").text("确定预定");
        },
        // [ 用于替代 BookLesson 方法，2018.06.21 by:Seya ]
        AppointLesson: function (obj) {

            /// <summary>
            /// [ 用于替代 BookLesson 方法，2018.06.21 by:Seya ]
            ///</summary>


            if ($(".cat_name").html() == undefined || $(".cat_name").html().length == 0) {
                Modal_Fun.init("您还未选择教材！", 1);
                return;
            }
            var $selft = $(obj),
                classtool = Config.ClassTool2;
            if (Config.ClassTime == null) {
                Modal_Fun.init("您还未选择时间！", 1);
                return;
            };
            if (classtool == 0) {
                Modal_Fun.init('请您选择上课工具！', 1);
                return;
            }
            if ((classtool != 7 && classtool != 8) && $("#issz").val() == 1) {
                Modal_Fun.init("<font color='red'>约课失败：该教材只能使用ClassIn或AClassRoom上课，请更换所有未上课的上课工具！</font>", 1);
                return;
            }
            if (new Date(Date.parse(Config.ClassTime)) >= new Date(Date.parse('2018/10/1 00:00')) && classtool == 5) {
                Modal_Fun.init("<font color='red'>约课失败：E-classroom将于2018年9月30日全面下线，请更换上课工具！</font>", 1);
                return;
            }
            var msg = '';
            $selft.attr("disabled", true).text("Loading...");
            var hour = Config.ClassTime.substr(11, 2);
            var dateNow = new Date(); //获取当前时间
            var dateDiff = (new Date(Config.ClassTimes[0]).getTime() - dateNow.getTime()) / 60000; //时间差的分钟
            var str = "";
            if (dateDiff < 180) {
                str = "<br/><small class='text-danger'>温馨提示:该课时距离开课时间已不足三小时，预约后将无法取消。</small>";
            }
            if (parseInt(hour) < 10) {
                str = "<br/><small class='text-danger'>温馨提示:早上6-9am的课时暂不提供客服服务，若介意请预约早上9点-晚上11点间的课时</small>";
            }
            Modal_Fun.init("您要预约 [" + Config.ClassTime + "] 的课吗？" + str, 2);
            $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                if ($('#Modal_Fun_room').attr("data-action") == "true") {
                    Fn.Course.AppointClass(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTime, classtool, 0, "", "", function (data) {
                        var json = data.value;
                        if (!json.result) {
                            Modal_Fun.init(json.msg, 1);
                            return;
                        }
                        $(".class-time .checked").addClass("disabled").children("input").attr("disabled", true);
                        var HelpCenter = json.msg;
                        if (classtool == 8) {
                            HelpCenter += "<br><a href=\"https://www.acadsoc.com.cn/WebNew/user/HelpCenter/Video.aspx\" target=\"_blank\" class=\"text-success\">点击查看 A-Classroom 使用教学</a>";
                        }
                        Modal_Fun.init(HelpCenter, 1);
                        //Modal_Fun.init(json.msg, 1);
                        $(".fc-title").each(function (i) {
                            //console.log($(this).text())
                            if ($(this).css("background-color") == "rgb(255, 140, 0)") {
                                $(this).parent().parent("a").hide();
                            }
                        });
                        $("[name=DueDate2]").text("").hide();
                        $(".show_tutor_list2").html("");
                        $(".show_tutor_tools2").html("");
                        $(".full_showtutor").hide();
                        $(".full_tutortool").hide();
                        Config.ClassTime = null;
                        Config.ClassTool2 = 0;
                        //如果是PC端，则显示PC端的约课成功分享弹窗
                        if (window.WXShareTipConfig && window.WXShareTipConfig.pcOrderClass === true) {
                            if (window.WXShareTipFunc) {
                                WXShareTipFunc.get_pcOrderClass(); //弹出PC端约课分享提示
                            }
                        }
                    });
                }
            });
            $selft.removeAttr("disabled").text("确定预定");
        },
        //新版根据老师预定课程
        NewBookLesson: function (obj) {

            if ($(".cat_name").html() == undefined || $(".cat_name").html().length == 0) {
                Modal_Fun.init("您还未选择教材！", 1);
                return;
            }
            var $selft = $(obj),
                classtool = Config.ClassTool2;
            var selectDate = $('#startDate').val();
            var selecttimeobj = $('.newbookbox.active').find('.ClassTime.active')[0];
            var selecttime = $.trim($(selecttimeobj).text());
            var start = selectDate.split()[0] + " " + selecttime;
            var classtool = $($('.ClassTool.active').find('input')[0]).val();
            if (selectDate.split()[0].length == 0 && selecttime.length == 0) {
                $("#ModalPleaseClassTime").modal("show");
                return;
            };
            if (!classtool) {
                $("#ModalPleaseTool").modal("show");
                return;
            }
            if ((classtool != 7 && classtool != 8) && $("#issz").val() == 1) {
                Modal_Fun.init("<font color='red'>约课失败：该教材只能使用ClassIn或AClassRoom上课，请更换所有未上课的上课工具！</font>", 1);
                return;
            }
            if (new Date(Date.parse(start)) >= new Date(Date.parse('2018/10/1 00:00')) && classtool == 5) {
                Modal_Fun.init("<font color='red'>约课失败：E-classroom将于2018年9月30日全面下线，请更换上课工具！</font>", 1);
                return;
            }
            var msg = '',
                tname = "";
            var checkteacher = $($('#tab_1_2 [name=MyTeacher].active')[0]);
            if (checkteacher.length > 0) {
                //获取老师性别
                var sex = $(checkteacher)[0].children[0].className;
                if (sex.indexOf('TeacherMan') > -1) {
                    tname += "<span class='man'>预约老师：";
                } else if (sex.indexOf('TeacherWoMan') > -1) {
                    tname += "<span class='woman'>预约老师：";
                }
                //获取老师名字
                //tname += $(checkteacher)[0].children[1].outerText + "</span>";
                tname += $(checkteacher[0].children[1]).text() + "</span>";
            } else {
                $("#ModalTeaching_noTeach").modal("show");
                return;
            }
            $(".ModalWhetherClass_1").text("");
            $(".ModalWhetherClass_2").text("");
            $(".ModalWhetherClass_3").text("");
            $(".ModalWhetherClass_1").append(tname);
            if (selecttime.substring(3) == "00") {
                $(".ModalWhetherClass_2").append("预约时间：" + start + "~" + selecttime.substring(0, 3) + "25");
            } else if (selecttime.substring(3) == "30") {
                $(".ModalWhetherClass_2").append("预约时间：" + start + "~" + selecttime.substring(0, 3) + "55");
            }
            //$(".ModalWhetherClass_3").append("上课工具：" + $($('.ClassTool.active'))[0].outerText);
            $(".ModalWhetherClass_3").append("上课工具：" + $($('.ClassTool.active')[0]).text().trim());
            $("#ModalWhetherClass").modal("show");
            Config.TUID = checkteacher.attr("data-id");
            Config.ClassTime = start;
            Config.ClassTool2 = classtool;
            //如果是PC端，则显示PC端的约课成功分享弹窗
            //if (window.WXShareTipConfig && window.WXShareTipConfig.pcOrderClass === true) {
            //    DuecourseFun.ShowPCAppointTips(); //弹出分享提示
            //}
        },
        //[ 废弃的方法，请使用 AppointClassByTeacher 方法，2018.06.21 by:Seya ]约课
        InsertClassTime: function () {
            var result = Fn.Course.InsertClassTime(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTime, Config.ClassTool2, 1, $("#TeacherPers").val(), $("#TeacherStyle").val());
            $("#ModalWhetherClass").modal("hide");
            if (result.code == "success") {
                $("#ModalNewBookClass").modal("show");
                Config.ClassTime = null;
                Config.ClassTool2 = 0;
            } else {
                if (result.msg.indexOf("此时间已被预订") > -1) {
                    $("#ModalTeacherSlow").modal("show");
                    return;
                }
                if (result.msg.indexOf("前10分钟") > -1) {
                    $("#ModalTeacherSlow").modal("show");
                    return;
                }
                if (result.msg.indexOf("您的订单有效期已过") > -1) {
                    $("#ModalPackageOverdue").modal("show");
                    return;
                }
                if (result.msg.indexOf("您的订单剩余课时不足") > -1) {
                    $("#ModalPackageFinished").modal("show");
                    return;
                }
                Modal_Fun.init(result.msg, 1);
            }
        },
        //[ 用于替代 InsertClassTime 方法，2018.06.21 by:Seya ] 按老师约课
        AppointClassByTeacher: function () {
            Fn.Course.AppointClass(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTime, Config.ClassTool2, 1, $("#TeacherPers").val(), $("#TeacherStyle").val(), function (data) {
                var json = data.value;

                DuecourseFunNewbtn(Config.UID, Config.ClassTool1, Config.TUID, $(".Book_Tutor.active").find(".Tutor_bottom").text(), json.result, json.msg);
                $("#ModalWhetherClass").modal("hide");
                if (!json.result) {
                    if (json.msg.indexOf("此时间已被预订") > -1) {
                        $("#ModalTeacherSlow").modal("show");
                        return;
                    }
                    if (json.msg.indexOf("前10分钟") > -1) {
                        $("#ModalTeacherSlow").modal("show");
                        return;
                    }
                    if (json.msg.indexOf("您的订单有效期已过") > -1) {
                        $("#ModalPackageOverdue").modal("show");
                        return;
                    }
                    if (json.msg.indexOf("您的订单剩余课时不足") > -1) {
                        $("#ModalPackageFinished").modal("show");
                        return;
                    }
                    Modal_Fun.init(json.msg, 1);
                    return;
                }
                $("#ModalNewBookClass").modal("show");
                Config.ClassTime = null;
                Config.ClassTool2 = 0;
                //显示分享提示
                //DuecourseFun.showShare(json.data.action);
            });

        },
        //设置默认套餐
        SetDefaultOrder: function (coid) {
            var res = Fn.Course.SetDefaultOrder(coid);
        },
        //预约课程帮助
        Dk_help: function () {
            Dk_Liuchen();
        }

        //,
        // //显示约课成功的分享提示（微信端显示）
        // ShowAppointTips: function(fn) {
        //     showActionTips(1, fn);
        // },
        // //显示上完课的分享提示（微信端显示）
        // ShowEndClassTips: function(fn) {
        //     showActionTips(2, fn);
        // },
        // //显示约课成功的分享提示（仅PC端显示）
        // ShowPCAppointTips: function(fn) {
        //     showActionTips(14, fn);
        // },
        // //显示上完课的分享提示（仅PC端显示）
        // ShowPCEndClassTips: function(fn) {
        //     showActionTips(15, fn);
        // },
        // //显示试课的上完课分享提示
        // ShowTrailEndClassTips: function(fn) {
        //     showActionTips(8, fn);
        // }
    };
}();

/*********** 最新版预定课程 **************/
var NewDuecourseFun = function () {

    var Config = {
        UID: 0,
        StarYear: 0,
        EndYear: 0,
        COID: 0,
        TUID: 0,
        TutorName: null,
        ClassTimes: [],
        ClassTime: null,
        TutorList: null,
        OtherTutor: 0,
        SelectTutor: null,
        ClassTool1: 0,
        ClassTool2: 0,
        wxCourse: null,
        courseid: 0,
        newgettutorbytimeindex: 0,
        classtool: 0,
        toolname: null,
        CatID: 0,
        IsShowTool: "False"
    };
    //基本
    var Duec_fun = function () {
        //更改套餐
        $("[name=select-btn]").click(function () {
            $(".selectclass").parent().removeClass("display-none").show();
            $(this).parent().toggle();
        });
        $(".selectclass").each(function (i) {
            $(this).parent().find("a").click(function () {
                for (var n = 0; n < $(this).prev().find("option").length; n++) {
                    if ($(this).prev().find("option").eq(n).val() == $(this).prev().val()) {
                        $("[name=select-btn]").eq(i).prev().text($(this).prev().find("option").eq(n).text());
                        var coid = $(".selectclass").val();
                        Config.COID = coid;
                        NewDuecourseFun.LoadOrderMsg(coid);
                        NewDuecourseFun.SetDefaultOrder(coid);
                    }
                }
                $(this).parent().toggle();
                $("[name=select-btn]").eq(i).parent().toggle();
            })
        });
        //更改上课工具
        $("[name=select-tool]").click(function () {
            $(".selecttool").parent().removeClass("display-none").show();
            $(this).parent().toggle();
        });
        $(".selecttool").each(function (i) {
            $(this).parent().find("a").click(function () {
                for (var n = 0; n < $(this).prev().find("option").length; n++) {
                    if ($(this).prev().find("option").eq(n).val() == $(this).prev().val()) {
                        $("[name=select-tool]").eq(i).prev().text($(this).prev().find("option").eq(n).text());
                        var tool = $(".selecttool").val();
                        Config.classtool = tool;
                        Config.toolname = $(".selecttool option:selected").text();
                        Fn.Course.UpdateUserPreferenceTool(tool);
                        //NewDuecourseFun.LoadOrderMsg(coid);
                        //NewDuecourseFun.SetDefaultOrder(coid);
                    }
                }
                $(this).parent().toggle();
                $("[name=select-tool]").eq(i).parent().toggle();
            })
        });
        //预约老师被点击 初始化日历
        $("[data-toggle=tab]").click(function () {
            if ($(this).attr("aria-expanded") != "true") {
                setTimeout(function () {
                    $(".fc-today-button.ui-button.ui-state-default.ui-corner-left.ui-corner-right").click();
                    //订课流程引导
                    // Dk_Liuchen2();
                }, 300);
            } else { }
        });
        //套餐伸缩
        $("[name=spilt_1]").click(function () {
            $("[name=spilt_1none]").toggle()
        });
        $("[name=spilt_2]").click(function () {
            $("[name=spilt_2none]").toggle()
        });
        //新版约课筛选
        $('#btn_newbookclass_newgettutorbytime').on('click', function () {
            NewDuecourseFun.NewGetTutorByTime(0);
        });

        //新版约课换一换
        $('#changeteacher').on('click', function () {
            NewDuecourseFun.NewGetTutorByTime(Config.newgettutorbytimeindex + 1);
        });
    };
    var RemindEvaluationClass = function (UID) {
        var result = Fn.Course.GetLastThreeRemindStu(UID);
        if (result) {
            var COID = [];
            if (result.length > 0) {
                var html = "";
                $.each(result, function (index, item) {
                    if (COID.indexOf(item["COID"]) == -1) {
                        COID.push(item["COID"]);
                        html += item["COName"] + ",";
                    }
                });
                html = "(" + html.substring(0, html.length - 1) + ")";
                Modal_Fun.init('<h4 class=\'text-center\'>测评课提醒</h4><h5>您的' + html + '套餐还剩最后三节课，阿卡索温馨提示您预订最熟悉的老师参加最后一节测评课</h5>')
            }
        };
    };
    //根据时间约课
    var T_make = function () {
        $('#calendar2').fullCalendar({
            header: {
                left: '',
                center: 'title',
                right: 'today prev,next'
            },
            defaultView: 'agendaWeek',
            selectable: true,
            selectHelper: true,
            defaultEventMinutes: 30,
            firstHour: '6',
            slotMinutes: 30,
            minTime: '6:00',
            maxTime: '24:00',
            slotEventOverlap: false,
            allDayDefault: false,
            allDaySlot: false,
            firstDay: 1,
            axisFormat: 'HH:mm',
            theme: true,
            lang: 'zh-cn',
            buttonText: {
                prevYear: '去年',
                nextYear: '明年',
                today: '今天',
                month: '月',
                week: '周',
                day: '日'
            },
            editable: false,
            eventLimit: true, // allow "more" link when too many eve
            timeFormat: {
                agenda: 'HH:mm{ - HH:mm}'
            },
            events: function (start, end, callback) {
                $.ajax({
                    url: '/Ajax/Web.UI.Fun.Course.aspx',
                    type: 'POST', //type: 'POST' Demo用的Get,
                    dataType: 'json',
                    beforeSend: function () {
                        $(".Show_fullcander").hide();
                        $(".ac_times").show();
                    },
                    data: {
                        __: "GetTutorTimeByIDS",
                        "uid": Config.UID,
                        "coid": Config.COID,
                        "start": start.format(),
                        "end": end.format()
                    },
                    success: function (res) {
                        $(".ac_times").hide();
                        $(".Show_fullcander").show();
                        var obj = new Object();
                        $.each(res.value, function (i, date) {
                            obj.id = date.id;
                            obj.title = date.title;
                            obj.start = date.start;
                            obj.end = date.end;
                            obj.backgroundColor = "#5BA8FE";
                            obj.textColor = "#fff";
                            $('#calendar2').fullCalendar('renderEvent', obj); //核心的更新代码
                        });
                        $('#calendar2').fullCalendar('unselect'); //重新加载
                        $(".fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end.fc-short").click(function () {
                            $(".fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end.fc-short").find(".fc-title").css("background-color", "#1ABC9C");
                            $(this).find(".fc-title").css("background-color", "#FF8C00");
                        }).mouseenter(function () {
                            if ($(this).find(".fc-title").css("background-color") != "rgb(255, 140, 0)") {
                                $(this).find(".fc-title").css("background-color", "#D35746");
                            }
                        }).mouseleave(function () {
                            if ($(this).find(".fc-title").css("background-color") == "rgb(211, 87, 70)") {
                                $(this).find(".fc-title").css("background-color", "#1ABC9C");
                            }
                        })
                    },
                    error: function () { }
                });
            },
            eventClick: function (event) {
                Config.ClassTime = moment(event.start).format("YYYY-MM-DD HH:mm");
                $("[name=DueDate2]").attr("class", "btn btn-circle btn-primary btn-sm").show();
                $("[name=DueDate2]").text(moment(event.start).format("YYYY-MM-DD HH:mm") + "-" + moment(event.end).add(-5, "m").format("HH:mm")).attr("id", event.id);
                var res = Fn.Course.GetTutorByTime(Config.COID, moment(event.start).format("YYYY-MM-DD HH:mm"));
                if (res) {
                    var Teahtml = "",
                        sexhtml = "";
                    $.each(res, function (i, v) {
                        if (v["sex"] == 0)
                            sexhtml = '<div class="Tutor_Nv"></div>';
                        else
                            sexhtml = '<div class="Tutor_Man"></div>';
                        if (!jQuery.isEmptyObject(v["TutorPic"])) {
                            sexhtml = '<img src="' + v["TutorPic"] + '" style="width: 68px;text-align:center;border-radius: 50% !important;height: 68px;padding: 10px;margin-left: 25px;">';
                        }
                        Teahtml += '<div class="Book_Tutor">' +
                            '<div class="Book_Tutor_rom" onclick="DuecourseFun.GetSelectTools2(this,' + v["TUID"] + ')">' +
                            sexhtml +
                            '<div class="Tutor_bottom">' + v["FullName"] + '</div>' +
                            '<div class="Book_ChaKan" title="点击查看老师详情" onclick="DuecourseFun.SearchTutorInfo(this)" data-id="' + v["TUID"] + '"></div></div>' +
                            '<i class="pec_img"></i>' +
                            '</div>';
                    });
                    $(".show_tutor_list2").html(Teahtml);

                }
                $(".full_showtutor").show();
                $(".show_tutor_tools2").html("");
                $(".shownoticeforstu2").hide();
            }
        });
    };
    //订课流程引导
    var Dk_Liuchen = function () {
        // 执行一些动作...
        if ($("#plans_tab .active").length > 0) {
            //根据老师订课
            if ($("#plans_tab li.active a").text().indexOf("根据老师订课") > -1) {
                introJs().setOptions({
                    //对应的按钮
                    prevLabel: '上一步',
                    nextLabel: '下一步',
                    skipLabel: '跳过',
                    doneLabel: '完成',
                    //对应的数组，顺序出现每一步引导提示
                    steps: [{
                        element: '.step_1',
                        intro: '更改当前套餐',
                        position: 'bottom'
                    },
                    {
                        element: '.step_2',
                        intro: '更改当前教材',
                        position: 'top'
                    },
                    {
                        element: '.step_3',
                        intro: '预定课程方式',
                        position: 'top'
                    },
                    {
                        element: '.step_4',
                        intro: '根据老师预定课程：选择上课老师',
                        position: 'top'
                    },
                    {
                        element: '.step_5',
                        intro: '选择上课日期及时间',
                        position: 'top'
                    },
                    {
                        element: '.step_6',
                        intro: '选择上课工具',
                        position: 'top'
                    },
                    {
                        element: '.step_7',
                        intro: '根据时间预定课程：选择上课时间',
                        position: 'top'
                    },
                    {
                        element: '.step_8',
                        intro: '选择上课老师',
                        position: 'top'
                    },
                    {
                        element: '.step_9',
                        intro: '选择选择上课工具',
                        position: 'top'
                    }
                    ]
                }).start();
            }
            if ($("#plans_tab li.active a").text().indexOf("根据时间订课") > -1) {
                Modal_Fun.init(1, 1)
            }
        }
    };
    return {
        init: function (option) {
            Config = $.extend(true, Config, option);
            Duec_fun();
            T_make();
            RemindEvaluationClass(Config.UID);
            NewDuecourseFun.LoadOrderMsg(Config.COID);
            //新版按时间约课日期初始化
            NewDuecourseFun.NewClassCalendarInit();
        },
        LoadOrderMsg: function (coid) {
            var result = Fn.Course.GetOrderLesson(coid);
            var html = "";
            if (!jQuery.isEmptyObject(result) && result != "[]") {
                html = "可预约" + result[5] + "课时，";
            }
            $(".setordernum").html(html);
            $(".show_orderList").hide();
            //$(".show_recom").hide();
            $(".show_tutor_list").html("");
            $(".show_recom_tutor").html("");
            $(".ac_tutor").show();
            //var res = Fn.Course.GetOrdeByCOID(coid);  //旧版方法
            var res = Fn.Course.GetNewOrdeByCOIDAndCatID(coid, Config.CatID); //新版方法,res.selecttutor 包含老师是否擅长教授此CatID的教材的字段
            if (res) {
                Config.courseid = res.courseid;
                var leftclass = res.LeftClass,
                    TimeExpired = res.TimeExpired,
                    flag = false;
                if (leftclass > 0 && TimeExpired > 0 && res.orderstatus == 0) {
                    $(".ac_tutor,.ac_times,.show_orderstatus").hide();
                    $(".show_orderList,.Show_fullcander,.show_timelist").show();
                    $(".show_orderstatus").html("<div class=\"alert alert-info\">该套餐正常</div>");
                    flag = true;
                } else if (leftclass != "undefined" && leftclass == 0) {
                    $(".ac_tutor,.ac_times,.show_orderstatus").hide();
                    $(".show_orderList,.Show_fullcander,.show_timelist").show();
                    $(".show_orderstatus").html("<div class=\"alert alert-info\">该套餐正常</div>");
                } else if (TimeExpired != "undefined" && TimeExpired == 0) {
                    $(".ac_tutor,.show_orderList,.ac_times,.Show_fullcander,.show_timelist").hide();
                    $(".show_orderstatus").show();
                    $(".show_orderstatus").html("<div class=\"alert alert-danger\">该套餐已过期</div>");
                } else if (res.orderstatus == 2) {
                    $(".ac_tutor,.show_orderList,.ac_times,.Show_fullcander,.show_timelist").hide();
                    $(".show_orderstatus").show();
                    $(".show_orderstatus").html("<div class=\"alert alert-danger\">该套餐已退款</div>");
                } else {
                    $(".ac_tutor,.ac_times,.show_orderstatus").hide();
                    $(".show_orderList,.Show_fullcander,.show_timelist").show();
                    $(".show_orderstatus").html("<div class=\"alert alert-info\">该套餐正常</div>");
                }
                if (TimeExpired != "undefined")
                    $(".valid_date").html(res.endTime);
                else
                    $(".valid_date").html("无");
                //套餐下的老师
                var selecttutor = res.selecttutor;
                if (selecttutor && selecttutor.length > 0) {
                    var num = 0;
                    var fullname = [];
                    var Teahtml = "";
                    Config.select = "";
                    var Teahtml1 = "",
                        sexhtml = "",
                        Theml = "";
                    $.each(selecttutor, function (i, v) {
                        if (v["sex"] == 0)
                            sexhtml = '<img src="https://img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/Tutor_Nv.png" style="width: 54px;height:54px;" />';
                        else
                            sexhtml = '<img src="https://img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/Tutor_Man.png" style="width: 54px;height:54px;" />';
                        if (!jQuery.isEmptyObject(v["TutorPic"])) {
                            sexhtml = '<img src="' + v["TutorPic"] + '" style="width: 54px;height:54px;border-radius: 50% !important;">';
                        }
                        Teahtml1 += '<div class="swiper-slide Book_Tutor">';
                        if (v.NotGoodAt == 1) { //教材不符
                            Teahtml1 += '<div>' +
                                '             <div class="Book_Discrepancy" style="position: absolute;right:5px;top:5px;color:#FF7676;font-size:12px;">教材不符</div>';
                        } else {
                            Teahtml1 += '<div onclick="NewDuecourseFun.GetTutorTimes(this,' + v["TUID"] + ',\'' + v["FullName"] + '\')">' +
                                '             <div class="Book_ChaKan" title="点击查看老师详情" onclick="NewDuecourseFun.SearchTutorInfo(this)" data-id="' + v["TUID"] + '"></div>';
                        }
                        Teahtml1 += sexhtml +
                            '                  <p>' + v["FullName"] + '</p>' +
                            '                  <a class="concerned" onclick="NewDuecourseFun.AttentionTutor(this,\'' + v["TUID"] + '\',\'' + v["FullName"] + '\')" data-temp="1"><i class="glyphicon glyphicon-star"></i>已关注</a>' +
                            '             </div>' +
                            '        </div>';
                        Config.select += v["TUID"] + ',';
                        num++;
                    });
                    Config.OtherTutor = 10 - num;
                    //if (num < 8) {
                    //    Theml += '<div class="Book_Tutor_add"><a href="javascript:;" style="border: 2px solid white">' +
                    //        '<img class="add-teach" style="border-radius:0% !important;width:120px;height:80px;margin-left:0px;padding:0;" onclick="DuecourseFun.SearchByOne(this)" title="点击随机分配老师" href="javascript:;" src="' + CDNUrl + '/web/webnew/assets/admin/pages/img/gray-icon.png" class=" img" />' +
                    //        '</a></div>';
                    //    num++;
                    //}
                    $(".show_tutor_list").html(Teahtml1 + Theml);
                    var mySwiper = new Swiper('#swiper1', {
                        slidesPerView: 7,
                        spaceBetween: 15,
                        slidesPerView: "auto",
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },

                    });
                }
                if (flag) {
                    $(".ac_tutor").hide();
                    $(".show_orderList").show();
                }
            } else {
                $(".ac_tutor").hide();
            }
        },
        //获取推荐老师
        GetRectutor: function (obj) {
            $(obj).addClass("disabled");
            $(obj).html("加载中...");
            $(".show_recom_tutor").html("加载中...");
            //推荐老师
            var rectutor = Fn.Course.GetNewRectutorList(Config.COID);
            var recom = "暂无推荐老师";
            if (rectutor && rectutor.length > 0 && $(".show_tutor_list").length > 0) {
                var sexhtml = "", Ishigh = "";
                recom = "";
                $.each(rectutor, function (i, v) {
                    Ishigh = "";
                    if (v["sex"] == 0)
                        sexhtml = '<img src="https://img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/Tutor_Nv.png" style="width: 54px;height:54px;" />';
                    else
                        sexhtml = '<img src="https://img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/Tutor_Man.png" style="width: 54px;height:54px;" />';
                    if (!jQuery.isEmptyObject(v["TutorPic"]) && v["CheckPic"] == 1) {
                        sexhtml = '<img src="' + v["TutorPic"] + '" style="width: 54px;height:54px;border-radius: 50% !important;">';
                    }
                    if (v["IsHigh"] == 1)
                        Ishigh = '<div class="matchingtag"><label>高匹配</label></div>';
                    recom += '<div class="swiper-slide Book_Tutor">' +
                        '<div class="Book_Tutor_rom" onclick="NewDuecourseFun.GetTutorTimes(this,' + v["TUID"] + ',\'' + v["FullName"] + '\')">' +
                        '<div class="Book_ChaKan" title="点击查看老师详情" onclick="NewDuecourseFun.SearchTutorInfo(this)" data-id="' + v["TUID"] + '"></div>' +
                        Ishigh + sexhtml +
                        '<p>' + v["FullName"] + '</p>' +
                        '<a class="unconcerned" onclick="NewDuecourseFun.AttentionTutor(this,\'' + v["TUID"] + '\',\'' + v["FullName"] + '\')" data-temp="0"><i class="glyphicon glyphicon-star"></i>未关注</a>' +
                        '</div></div>';
                });
            }
            $(obj).removeClass("disabled");
            $(obj).html("点击获取");
            $(".show_recom_tutor").html(recom);
        },
        //获取老师时间
        GetTutorTimes: function (obj, tuid, name) {
            if ($(obj).parents("#tab_1_1").length > 0) {
                $("#tab_1_1").find(".Book_Tutor").removeClass("active");
            } else if ($(obj).parents("#tab_1_2").length > 0) {
                $("#tab_1_2").find(".Book_Tutor").removeClass("active");
            }
            $(obj).parent().addClass("active");
            Config.TUID = tuid;
            Config.TutorName = name;
            //获取导师可安排时间
            var tutorDays = Fn.Course.GetTutorTime(tuid, Config.COID);
            $("#calendar1").ionCalendar({
                years: Config.StarYear + "-" + Config.EndYear,
                selectMonths: true,
                selectYears: true,
                hideArrows: false,
                Multiplecalls: true,
                dateData: tutorDays,
                onClick: function (t) {
                    var targettime = moment(t).format("YYYY-MM-DD");
                    var hourData = Fn.Course.GetTargetTimeAvaDuration(tuid, targettime, Config.COID);
                    var thtml = "暂无时间";
                    if (!$.isEmptyObject(hourData)) {
                        thtml = "";
                        $.each(hourData, function (i, obj) {
                            thtml += '<label onclick="NewDuecourseFun.OnclickClassTime(this)"   class="btn btn-transparent time btn-outline btn-sm margin5"' +
                                ' data-day="' + targettime + '" data-time="' + obj.hour + '" data-tuid="' + tuid + '"  data-name="' + name + '" >' + obj.duration + '</label>';
                        });
                    }
                    $(".show_tutor_times").html(thtml)
                }
            });
            $(".show_calender").show();
            //清空数据
            Config.ClassTimes = [];
            $(".schooltime1").html('<div class="btn btn-circle btn-primary btn-sm wait_add">待添加</div>');
            $(".show_tutor_times").html("");
        },
        GetTutorTools: function (obj, tool, type) {
            if (type == 1) {
                $(obj).parent().parent().addClass("selected").siblings("li").removeClass("selected");
                Config.ClassTool1 = tool;
                if (tool == 5) {
                    $(".shownoticeforstu").show();
                } else {
                    $(".shownoticeforstu").hide();
                }
            } else if (type == 2) {
                $(obj).parent().parent().addClass("selected").siblings("li").removeClass("selected");
                Config.ClassTool2 = tool;
                if (tool == 5) {
                    $(".shownoticeforstu2").show();
                } else {
                    $(".shownoticeforstu2").hide();
                }
            }
        },
        //点击时间事件
        OnclickClassTime: function (obj) {
            //初始化
            $(".ModalWhetherClass_5").html("");
            $(".book-name").text("");
            $(".book-time").text("");
            $(".book-tool").text("");
            //清空数据
            Config.ClassTimes = [];

            $(".book-name").text($(obj).attr("data-name"));
            $(".book-time").text($(obj).attr("data-day") + " " + $(obj).text());
            $(".book-tool").text(Config.toolname);
            Config.ClassTimes.push($(obj).attr("data-day") + " " + $(obj).attr("data-time"));

            var hour = Config.ClassTimes[0].substr(11, 2);
            var dateNow = new Date(); //获取当前时间
            var dateDiff = (new Date(Config.ClassTimes[0]).getTime() - dateNow.getTime()) / 60000; //时间差的分钟
            var str = "";
            if (dateDiff < 180) {
                str = "<small class='text-danger'>温馨提示:该课时距离开课时间已不足三小时，预约后将无法取消。</small>";
            }
            if (parseInt(hour) < 10) {
                str = "<small class='text-danger'>温馨提示:早上6-9am的课时暂不提供客服服务，若介意请预约早上9点-晚上11点间的课时</small>";
            }
            $(".ModalWhetherClass_5").html(str);
            $("#ModalWhetherClass").modal("show");
        },
        //关注老师
        AttentionTutor: function (obj, tuid, name) {
            var temp = $(obj).attr("data-temp");
            if (temp == 0 && Config.OtherTutor == 0) {
                Modal_Fun.init("您名下老师已满，请先取关某位老师！", 1);
                return false;
            }
            var text = "确定关注" + name + "老师吗";
            if (temp == 1)
                text = "确定取消关注" + name + "老师吗";
            Modal_Fun.init(text, 2);
            $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                if ($('#Modal_Fun_room').attr("data-action") == "true") {
                    var res = null;
                    if (temp == 0)
                        res = Fn.NewCourse.AddOrderTeacher(Config.COID, tuid);
                    else
                        res = Fn.NewCourse.NewDeleteOrderTeacher(Config.COID, tuid);
                    if (res != null && res > 0) {
                        var htm = "";
                        if (temp == 0) {
                            Config.OtherTutor--;
                            $(obj).attr('data-temp', 1);
                            $(obj).removeClass('unconcerned').addClass("concerned");
                            htm = "<i class=\"glyphicon glyphicon-star\"></i>已关注</a>";
                        } else {
                            Config.OtherTutor++;
                            $(obj).attr('data-temp', 0);
                            $(obj).removeClass('concerned').addClass("unconcerned");
                            htm = "<i class=\"glyphicon glyphicon-star\"></i>未关注</a>";
                        }
                        $(obj).html(htm);
                    } else {
                        Modal_Fun.init("操作失败，请重试！", 1);
                    }
                }
            });
        },
        //根据老师预定课程
        NewestBookClass: function (obj) {

            $(obj).addClass("disabled");
            if ($(".cat_name").html() == undefined || $(".cat_name").html().length == 0) {
                Modal_Fun.init("您还未选择教材！", 1);
                return;
            }
            if (Config.classtool <= 0) {
                Modal_Fun.init("请您选择上课工具", 1);
                return;
            };
            if (Config.ClassTimes.length == 0) {
                Modal_Fun.init("您还未选择时间！", 1);
                return;
            };
            if ((Config.classtool != 7 && Config.classtool != 8) && $("#issz").val() == 1) {
                Modal_Fun.init("<font color='red'>约课失败：该教材只能使用ClassIn或AClassRoom上课，请更换所有未上课的上课工具！</font>", 1);
                return;
            }
            if (new Date(Date.parse(Config.ClassTimes[0])) >= new Date(Date.parse('2018/10/1 00:00')) && Config.classtool == 5) {
                Modal_Fun.init("<font color='red'>约课失败：E-classroom将于2018年9月30日全面下线，请更换上课工具！</font>", 1);
                return;
            }
            Fn.Course.AppointClass(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTimes[0], Config.classtool, 0, "", "", function (data) {
                var json = data.value;
                DuecourseFunNewbtn(Config.UID, Config.ClassTool1, Config.TUID, $(".Book_Tutor.active").find(".Tutor_bottom").text(), json.result, json.msg);

                if (json.result) {
                    $("#ModalWhetherClass").modal("hide");
                    //$(".class-time .checked").addClass("disabled").children("input").attr("disabled", true);
                    var HelpCenter = json.msg;
                    if (Config.classtool == 8) {
                        HelpCenter += "<br><a href=\"https://www.acadsoc.com.cn/WebNew/user/HelpCenter/Video.aspx\" target=\"_blank\" class=\"text-success\">点击查看 A-Classroom 使用教学</a>";
                    }

                    /*如果有产品评价资格就只弹出评价框*/
                    var r = Fn.User.IsProductEvaluationCondition(0);
                    if (r["r"] > 0) {
                        $("#product_modal").modal("show");
                    } else {
                        Modal_Fun.init(HelpCenter, 1);
                    }
                    //如果是PC端，则显示PC端的约课成功分享弹窗
                    if (window.WXShareTipConfig && window.WXShareTipConfig.pcOrderClass === true) {
                        if (window.WXShareTipFunc) {
                            WXShareTipFunc.get_pcOrderClass(); //弹出分享提示
                        }
                    }
                    //重新加载时间
                    var index = Config.ClassTimes[0].lastIndexOf(" ");
                    var time = Config.ClassTimes[0].substring(0, index);
                    var hourData = Fn.Course.GetTargetTimeAvaDuration(Config.TUID, time, Config.COID);
                    var thtml = "暂无时间";
                    if (!$.isEmptyObject(hourData)) {
                        thtml = "";
                        $.each(hourData, function (i, obj) {//data-toggle="modal" data-target="#ModalWhetherClass"
                            thtml += '<label onclick="NewDuecourseFun.OnclickClassTime(this)"   class="btn btn-transparent time btn-outline btn-sm margin5"' +
                                ' data-day="' + time + '" data-time="' + obj.hour + '" data-tuid="' + Config.TUID + '"  data-name="' + Config.TutorName + '" >' + obj.duration + '</label>';
                        });
                    }
                    $(".show_tutor_times").html(thtml)
                } else {
                    Modal_Fun.init(json.msg, 1);
                }
            });
            $(obj).removeClass("disabled");
        },
        //老师上课工具
        GetSelectTools2: function (obj, tuid) {
            $(".full_tutortool").show();
            if ($(obj).parents("#tab_1_1").length > 0) {
                $("#tab_1_1").find(".Book_Tutor").removeClass("active");
            } else if ($(obj).parents("#tab_1_2").length > 0) {
                $("#tab_1_2").find(".Book_Tutor").removeClass("active");
            }
            $(obj).parent().addClass("active");
            Config.TUID = tuid;
            Config.ClassTool2 = 0;
            //获取老师上课工具
            var classtools = Fn.Course.GetNewTutorClassTool(tuid);
            var classtool = classtools.split('').reverse().join('');
            var toolhtml = "";
            if (classtool && classtool.length > 0) {
                for (var ii = 0; ii < classtool.split(',').length; ii++) {
                    if (classtool.split(',')[ii] == 5)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='E-classroom' class='tutor_tools3' onclick=DuecourseFun.GetTutorTools(this,5,2)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 6 && Config.wxCourse.indexOf(',' + Config.courseid + ',') >= 0)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='WeChat' class='tutor_tools4' onclick=DuecourseFun.GetTutorTools(this,6,2)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 7)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='ClassIn' class='tutor_tools7' onclick=DuecourseFun.GetTutorTools(this,7,2)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 8)
                        toolhtml += "<li><a href=\"javascript:;\"  ><div title='A-Classroom' class='tutor_tools8' onclick=DuecourseFun.GetTutorTools(this,8,2)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 9)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='GameClass' class='tutor_tools9' onclick=DuecourseFun.GetTutorTools(this,9,2)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 2)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='Skype' class='tutor_tools2' onclick=DuecourseFun.GetTutorTools(this,2,2)></div></a><i></i></li>";
                    else if (classtool.split(',')[ii] == 1)
                        toolhtml += "<li><a href=\"javascript:;\"><div title='QQ' class='tutor_tools1' onclick=DuecourseFun.GetTutorTools(this,1,2)></div></a><i></i></li>";
                }
                if (Config.IsShowTool == "False")
                    toolhtml += "<li style='margin-top: 60px;color:#2e6da4;margin-left:10px;'><label class='moretool' >>> 更多工具</label></li>";
            }
            $(".show_tutor_tools2").html(toolhtml);
            $(".shownoticeforstu2").hide();
            $(".tutor_tools2,.tutor_tools1").parent().parent().hide();
            $(".moretool").on("click", function () {
                $(".tutor_tools2,.tutor_tools1").parent().parent().show();
                $(this).parent().hide();
            });
        },
        //移除选定时间
        RemoveTimes: function (obj, time) {
            $(obj).parent().remove();
            for (var i = 0; i < Config.ClassTimes.length; i++) {
                if (Config.ClassTimes[i] == time) {
                    Config.ClassTimes.splice(i, 1)
                }
            }
            if (Config.ClassTimes.length == 0)
                $(".wait_add").show();
        },
        // [ 已废弃的方法，请使用 AppointClass，2018.06.20 by:Seya] 根据老师预定课程
        BookLessonList: function (obj) {
            if ($(".cat_name").html() == undefined || $(".cat_name").html().length == 0) {
                Modal_Fun.init("您还未选择教材！", 1);
                return;
            }
            var $selft = $(obj),
                classtool = Config.classtool;
            if (classtool == 0) {
                Modal_Fun.init("请您选择上课工具", 1);
                return;
            };
            if (Config.ClassTimes.length == 0) {
                Modal_Fun.init("您还未选择时间！", 1);
                return;
            };
            //            if (Config.ClassTimes.length > 5) {
            //                Modal_Fun.init("您最多可选择5个时间预定课程！",1);
            //                return;
            //            };
            if (Config.ClassTimes.length > 1) {
                Modal_Fun.init("系统正在升级暂不支持选择多个时间，您最多可选择1个时间预定课程！", 1);
                return;
            }
            if ((classtool != 7 && classtool != 8) && $("#issz").val() == 1) {
                Modal_Fun.init("<font color='red'>约课失败：该教材只能使用ClassIn或AClassRoom上课，请更换所有未上课的上课工具！</font>", 1);
                return;
            }
            var msg = '';
            for (var ii = 0; ii < Config.ClassTimes.length; ii++) {
                if (ii == (Config.ClassTimes.length - 1))
                    msg += "<label>[" + Config.ClassTimes[ii] + "]</label>";
                else
                    msg += "<label>[" + Config.ClassTimes[ii] + "]、</label>";
            }
            $selft.attr("disabled", true).text("Loading...");
            var tutor = $(".Book_Tutor.active").find(".Book_Tutor_rom>.Tutor_bottom").text();
            var tool = $(".sys_spec_img.show_tutor_tools").find("li.selected>a>div").attr("title");
            var hour = Config.ClassTimes[0].substr(11, 2);
            var str = "";
            if (parseInt(hour) < 10) {
                str = "<br/><small class='text-danger'>温馨提示:早上6-9am的课时暂不提供客服服务，若介意请预约早上9点-晚上11点间的课时</small>";
            }
            Modal_Fun.init("您确定要预约:<br/>" + msg + "的课吗？<br/>上课老师：" + tutor + "<br/>上课工具：" + tool + str, 2);
            $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                if ($('#Modal_Fun_room').attr("data-action") == "true") {
                    //                    var result = Fn.Course.InsertClassTimeList(Config.TUID,3, Config.COID, Config.UID, Config.ClassTimes, classtool)

                    var result = Fn.Course.InsertClassTime(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTimes[0], classtool, 0, "", "")
                    if (result.code == "success") {
                        $(".class-time .checked").addClass("disabled").children("input").attr("disabled", true);
                        Modal_Fun.init("预订成功", 1);
                        NewDuecourseFun.GetTutorTimes($(".Book_Tutor_rom").find(".Book_Tutor"), Config.TUID);
                    } else {
                        Modal_Fun.init(result.msg, 1);
                    }
                }
            });
            $selft.removeAttr("disabled").text("确定预定");
        },
        // [ 用于替代BookLessonList方法，2018.06.20 by:Seya] 新版根据老师预定课程
        AppointClass: function (obj) {

            /// <summary>
            /// [ 用于替代BookLessonList方法，2018.06.20 by:Seya] 新版根据老师预定课程
            /// </summary>
            /// <param name="obj">按钮</param>
            if ($(".cat_name").html() == undefined || $(".cat_name").html().length == 0) {
                Modal_Fun.init("您还未选择教材！", 1);
                return;
            }
            var $selft = $(obj),
                classtool = Config.classtool;
            if (classtool == 0) {
                Modal_Fun.init("请您选择上课工具", 1);
                return;
            };
            if (Config.ClassTimes.length == 0) {
                Modal_Fun.init("您还未选择时间！", 1);
                return;
            };
            //            if (Config.ClassTimes.length > 5) {
            //                Modal_Fun.init("您最多可选择5个时间预定课程！",1);
            //                return;
            //            };
            if (Config.ClassTimes.length > 1) {
                Modal_Fun.init("系统正在升级暂不支持选择多个时间，您最多可选择1个时间预定课程！", 1);
                return;
            };
            if ((classtool != 7 && classtool != 8) && $("#issz").val() == 1) {
                Modal_Fun.init("<font color='red'>约课失败：该教材只能使用ClassIn或AClassRoom上课，请更换所有未上课的上课工具！</font>", 1);
                return;
            }
            if (new Date(Date.parse(Config.ClassTimes[0])) >= new Date(Date.parse('2018/10/1 00:00')) && classtool == 5) {
                Modal_Fun.init("<font color='red'>约课失败：E-classroom将于2018年9月30日全面下线，请更换上课工具！</font>", 1);
                return;
            }

            var msg = '';
            for (var ii = 0; ii < Config.ClassTimes.length; ii++) {
                if (ii == (Config.ClassTimes.length - 1))
                    msg += "<label>[" + Config.ClassTimes[ii] + "]</label>";
                else
                    msg += "<label>[" + Config.ClassTimes[ii] + "]、</label>";
            }
            $selft.attr("disabled", true).text("Loading...");
            var tutor = $(".Book_Tutor.active").find(".Book_Tutor_rom>.Tutor_bottom").text();
            var tool = $(".sys_spec_img.show_tutor_tools").find("li.selected>a>div").attr("title");
            var hour = Config.ClassTimes[0].substr(11, 2);
            var dateNow = new Date(); //获取当前时间
            var dateDiff = (new Date(Config.ClassTimes[0]).getTime() - dateNow.getTime()) / 60000; //时间差的分钟
            var str = "";
            if (dateDiff < 180) {
                str = "<br/><small class='text-danger'>温馨提示:该课时距离开课时间已不足三小时，预约后将无法取消。</small>";
            }
            if (parseInt(hour) < 10) {
                str = "<br/><small class='text-danger'>温馨提示:早上6-9am的课时暂不提供客服服务，若介意请预约早上9点-晚上11点间的课时</small>";
            }
            Modal_Fun.init("您确定要预约:<br/>" + msg + "的课吗？<br/>上课老师：" + tutor + "<br/>上课工具：" + tool + str, 2);
            $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                if ($('#Modal_Fun_room').attr("data-action") == "true") {
                    //                    var result = Fn.Course.InsertClassTimeList(Config.TUID,3, Config.COID, Config.UID, Config.ClassTimes, classtool)

                    Fn.Course.AppointClass(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTimes[0], classtool, 0, "", "", function (data) {
                        var json = data.value;

                        DuecourseFunNewbtn(Config.UID, Config.ClassTool1, Config.TUID, $(".Book_Tutor.active").find(".Tutor_bottom").text(), json.result, json.msg);

                        if (json.result) {
                            $(".class-time .checked").addClass("disabled").children("input").attr("disabled", true);
                            var HelpCenter = json.msg;
                            if (classtool == 8) {
                                HelpCenter += "<br><a href=\"https://www.acadsoc.com.cn/WebNew/user/HelpCenter/Video.aspx\" target=\"_blank\" class=\"text-success\">点击查看 A-Classroom 使用教学</a>";
                            }

                            /*如果有产品评价资格就只弹出评价框*/
                            var r = Fn.User.IsProductEvaluationCondition(0);
                            if (r["r"] > 0) {

                                $("#product_modal").modal("show");
                            } else {
                                Modal_Fun.init(HelpCenter, 1);
                            }
                            //如果是PC端，则显示PC端的约课成功分享弹窗
                            if (window.WXShareTipConfig && window.WXShareTipConfig.pcOrderClass === true) {
                                if (window.WXShareTipFunc) {
                                    WXShareTipFunc.get_pcOrderClass(); //弹出分享提示
                                }
                            }
                            NewDuecourseFun.GetTutorTimes($(".Book_Tutor_rom").find(".Book_Tutor"), Config.TUID);
                        } else {
                            Modal_Fun.init(json.msg, 1);
                        }
                    });

                }
            });
            $selft.removeAttr("disabled").text("确定预定");
        },
        //关闭分享提示（具体怎样弹窗等操作）
        closeShare: function (action_id) {
            /// <summary>
            /// 显示用户动作的分享提示，action_id=1 表示约课成功， 2表示上完课
            /// </summary>
            var rid = 0,
                tid = 0;
            if (window.__pageShareActionData) {
                if (__pageShareActionData[action_id.toString()]) {
                    var _action = __pageShareActionData[action_id.toString()];
                    rid = _action.record_id;
                    tid = _action.tid;
                }
            }
            if (rid <= 0 || tid <= 0) {
                return;
            }
            Fn.Course.CloseShareTip(rid, tid, function (data) {
                var json = data.value;
                if (json.result) {
                    //调用本方法时已经关闭了弹窗，所以这里无须再关
                }
            });

            //Fn.Course.GetShareTips(action_id, function (data) {
            //    var json = data.value;
            //    if (json.result) {
            //        if (json.data.has_action) {

            //        }
            //    } else {
            //    }
            //});

        },
        // //显示分享提示（具体怎样弹窗等操作）
        // showShare: function(action) {
        //     window.__shareTipAction = action;
        //     Fn.Course.ShowShareTip(action.record_id, function(data) {
        //         var json = data.value;
        //         if (json.result) {
        //             $('#lessonSharing-modal').modal('show');
        //             //$("#endClassTip").modal("show");
        //             //var url = '/lps/lessonSharing/lessonShareGuide.htm?rid=' + json.data.record_id + '&tid=' + json.data.id;
        //             //$("#lessonSharingViewBtn").attr({
        //             //    'data-url': url
        //             //});
        //         }
        //     });
        // },
        //添加老师
        SearchByOne: function (obj) {
            $obj = $(obj).parent().parent();
            if (Config.OtherTutor > 0) {
                var result = Fn.Course.SearchByOne(Config.select, Config.COID);
                if (result) {
                    if (result._r > 0) {
                        var data = result.data[0];
                        var sexhtml = "";
                        var html = "&nbsp;" + data.Name;

                        if (data["Sex"] == 0)
                            sexhtml = '<div class="Tutor_Nv"></div>';
                        else
                            sexhtml = '<div class="Tutor_Man"></div>';
                        if (!jQuery.isEmptyObject(data["TutorPic"]) && data["CheckPic"] == 1) {
                            sexhtml = '<img src="' + data["TutorPic"] + '" style="width: 68px;text-align:center;border-radius: 50% !important;height: 68px;padding: 10px;margin-left: 25px;">';
                        }

                        var Teahtml = '<div class="Book_Tutor_rom" onclick="DuecourseFun.GetTutorTimes(this,' + data["TUID"] + ')">' +
                            sexhtml +
                            '<div class="Tutor_bottom">' + data["Name"] + '</div>' +
                            '<div class="Book_ChaKan" title="点击查看老师详情" onclick="DuecourseFun.SearchTutorInfo(this)" data-id="' + data["TUID"] + '"></div></div>' +
                            '<i class="pec_img"></i>';
                        $obj.removeClass("Book_Tutor_add").addClass("Book_Tutor").html(Teahtml);

                        Config.select += data.TUID + ",";
                        Config.OtherTutor--;
                        if (Config.OtherTutor > 0) {
                            var Teahtml1 = '<div class="Book_Tutor_add"><a href="javascript:;" style="border: 2px solid white">' +
                                '<img class="add-teach" onclick="DuecourseFun.SearchByOne(this)" title="点击随机分配老师" href="javascript:;" src="' + CDNUrl + '/web/webnew/assets/admin/pages/img/gray-icon.png" class=" img" />' +
                                '</a></div>';
                            $obj.parent().append(Teahtml1);
                        }
                    } else {
                        Modal_Fun.init(result._msg, 1);
                    }
                }
            } else {
                Modal_Fun.init("您套餐下的8位老师已满！", 1);
            }
        },
        AddTeachUser: function (tuid) {
            var i = Fn.User.AddTeachUser(tuid, Config.UID, Config.COID);
            if (i == 1) {
                $("#ModalTeacherAdd").modal("show");
                $("#ModalTeacherintr").modal("hide");
                NewDuecourseFun.NewGetTutorByTime(0);
            } else if (i == 2) {
                //老师超过10个，去删除老师
                $("#ModalTeacherFull").modal("show");
                $("#ModalTeacherintr").modal("hide");
            } else if (i == 3) {
                alert("该老师你已关注！");
            } else {
                alert("添加失败请找客服处理！");
            }
        },
        //查看老师信息
        SearchTutorInfo: function (obj) {
            var tuid = $(obj).attr("data-id");
            Config.TutorList = Fn.User.GetTutorTableListByTUID(tuid);
            var htm = "";
            if (Config.TutorList != null && Config.TutorList.length > 0) {
                $.each(Config.TutorList, function (index, v) {
                    if (tuid == v.TUID) {
                        //tutor info
                        var htm = "";
                        htm += "  <h4><span style='margin-right:10px'>" + v.FullName + "</span>";
                        if (typeof (v.Sex) != "undefined")
                            htm += (parseInt(v.Sex) == 1 ? "<i class='fa fa-male'></i>" : "<i class='fa  fa-female'></i>");
                        htm += "  <span style='float:right;width: 50px; height:25px;line-height:25px;padding-left:10px'>" + v.Score + "</span><div class='yk_level yk_lv5'></div></p>";
                        htm += "  </h4>";
                        if (typeof (v.mp3file) != "undefined")
                            //                            htm += " <p class='jmp3'>" + v.mp3file + "</p> ";
                            htm += "<div class='col-xs-12 col-md-12 no-padding'><audio src='" + v.mp3file + "' preload='auto' /></div>";
                        if (typeof (v.ListSub) != "undefined" && v.ListSub.length > 0) {
                            htm += " <p>【擅长科目】：";
                            $.each(v.ListSub, function (kk, vv) {
                                htm += " <span class='badge badge-success badge-roundless margin-bottom-10 margin-right-10' style='background-color: #48c9b0;'>" + vv.Name + "</span>";
                            });
                            htm += "</p>";
                        }
                        if (typeof (v.Profile) != "undefined")
                            htm += " <p>【自我介绍】：<span>" + v.Profile + "</span></p>";
                        //modal
                        ($("#tutorinfo_modal").length > 0) ? $("#tutorinfo_modal").remove() : "";
                        var modal = '<div class="modal" id="tutorinfo_modal" aria-hidden="false">' +
                            '<div class="modal-dialog">' +
                            '<div class="modal-content">' +
                            '<div class="modal-header">' +
                            '<button type="button" class="close" aria-hidden="true" data-dismiss="modal" tabindex="-1">&times;</button>' +
                            '<h4 class="modal-title fa fa-graduation-cap">' + v.FullName + ' 个人介绍</h4>' +
                            '</div>' +
                            '<div class="modal-body">' + htm + '</div>' +
                            '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-white" data-dismiss="modal">' +
                            '关闭</button>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        $(modal).appendTo("body").modal("show");
                        //                        $(".jmp3").jmp3({
                        //                            "backcolor": "1ABC9C",
                        //                            "forecolor": "ffffff",
                        //                            "width": "130",
                        //                            "volume": "80"
                        //                        });
                        audiojs.events.ready(function () {
                            var as = audiojs.createAll();
                        });
                    }
                })
            }
        },
        NewSearchTutorInfo: function (obj, ismyteacher) {
            var tuid = $(obj).attr("data-id");
            Config.TutorList = Fn.User.GetTutorTableListByTUID(tuid);
            var htm = "";
            if (Config.TutorList != null && Config.TutorList.length > 0) {
                $.each(Config.TutorList, function (index, v) {
                    if (tuid == v.TUID) {
                        //tutor info
                        var htm = "";
                        htm += "  <div class='ModalTeacherintr1'><div class='ModalTeacherintr1_1'>" + v.FullName;
                        if (typeof (v.Sex) != "undefined")
                            htm += (parseInt(v.Sex) == 1 ? "<span class='man'></span>" : "<span class='woman'></span>");
                        htm += "  <div class='ModalTeacherintr1_2'>" + v.Score + "</div>";
                        htm += "  </div>";
                        //star
                        htm += "<div class='ModalTeacherintr2'><ul><li class='active'></li><li class='active'></li><li class='active'></li><li class='active'></li><li class='active'></li></ul></div>";
                        if (typeof (v.mp3file) != "undefined")
                            //                            htm += " <p class='jmp3'>" + v.mp3file + "</p> ";
                            htm += "<div class='ModalTeacherintr3'><audio id='TeacherAudio' src='" + v.mp3file + "' /></div>";
                        if (typeof (v.ListSub) != "undefined" && v.ListSub.length > 0) {
                            htm += " <div class='ModalTeacherintr5'><div class='col-md-3'>【擅长科目】：</div><div class='col-md-9'>";
                            $.each(v.ListSub, function (kk, vv) {
                                htm += " <span>" + vv.Name + "</span>";
                            });
                            htm += "</div></div>";
                        }
                        if (typeof (v.Profile) != "undefined")
                            htm += " <div class='ModalTeacherintr6'>【自我介绍】：<span>" + v.Profile + "</span></div>";
                        if (ismyteacher != 1) {
                            htm += "<div class='ModalTeacherintr7'><a href='javascript:;' class='btn' onclick='NewDuecourseFun.AddTeachUser(" + tuid + ")'>关注</a></div>";
                        }
                        //modal
                        ($("#ModalTeacherintr").length > 0) ? $("#ModalTeacherintr").remove() : "";
                        var modal = '<div class="modal fade" id="ModalTeacherintr" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                            '<div class="modal-dialog">' +
                            '<div class="modal-content">' +
                            '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                            '<h6 class="modal-title" id="myModalLabel">' + v.FullName + ' 个人介绍</h6>' +
                            '</div>' +
                            '<div class="modal-body row">' + htm + '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        $(modal).appendTo("body").modal("show");
                        //                        $(".jmp3").jmp3({
                        //                            "backcolor": "1ABC9C",
                        //                            "forecolor": "ffffff",
                        //                            "width": "130",
                        //                            "volume": "80"
                        //                        });
                        audiojs.events.ready(function () {
                            var as = audiojs.createAll();
                        });
                    }
                })
            }
        },
        NewGetTutorByTime: function (index) {
            var selectDate = $('#startDate').val();
            var selecttimeobj = $('.newbookbox.active').find('.ClassTime.active')[0];
            var selecttime = $(selecttimeobj).text();

            if (!selectDate || !selecttime) {
                $("#ModalPleaseClassTime").modal("show");
                return;
            };

            var selectradio = $('.ClassTool.active').find('input')[0];
            //var classtool = $(selectradio).val();
            //if (!classtool) {
            //    $("#ModalPleaseTool").modal("show");
            //    //Modal_Fun.init("请您选择上课工具", 1);
            //    return;
            //};

            var start = $.trim(selectDate) + " " + $.trim(selecttime);
            var coid = $(".selectclass").val();
            var sex = $("#sex").val();

            var IsCamera = $('#IsCamera').val();

            var Personality = $('#TeacherPers').attr('data-id');

            var TeachStyle = $('#TeacherStyle').attr('data-id');

            var data = Fn.Course.NewGetTutorByTime(index, coid, start, Config.classtool, sex, IsCamera, Personality, TeachStyle);

            if (data.code < 0) {
                if (data.code == -1) {

                    //不支持十分钟前约课
                    $("#ModalTenMinutes").modal("show");
                    return;
                } else if (data.code == -2) {
                    if (Fn.User.IsJPClassUser) {
                        alert("请去我的教材解锁课程！");
                        return;
                    }
                    //套餐过期
                    $("#ModalPackageOverdue").modal("show");
                    return;
                } else if (data.code == -3) {
                    if (Fn.User.IsJPClassUser) {
                        alert("请去我的教材解锁课程！");
                        return;
                    }
                    //课时使用完
                    $("#ModalPackageFinished").modal("show");
                    return;
                } else {
                    Modal_Fun.init(data.msg, 1);
                    return;
                }

            }

            var strallteacher = "";
            var strmyteacher = "";

            if (data.MyTeacher.length == 0) {
                $('#myteacherdiv').hide();
            } else {
                $('#myteacherdiv').show();
            }

            if (data.AllTeacher.length == 0) {
                $('#otherteacherdiv').hide();
            } else {
                $('#otherteacherdiv').show();
            }

            if (data.MyTeacher.length == 0 && data.AllTeacher.length == 0) {
                $('#bookclassdiv').hide();
                $('.TeacherVacancy').show();
            } else {
                $('#bookclassdiv').show();
                $('.TeacherVacancy').hide();

            }

            $.each(data.AllTeacher, function (i, v) {
                var sexhtml = "";

                if (v["Sex"] == 0)
                    sexhtml = '<img src="https://img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/Tutor_Nv.png" style="width: 54px;height:54px;" />';
                else
                    sexhtml = '<img src="https://img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/Tutor_Man.png" style="width: 54px;height:54px;" />';
                if (!jQuery.isEmptyObject(v["TutorPic"]) && v["CheckPic"] == 1) {
                    sexhtml = '<img src="' + v["TutorPic"] + '" style="width: 54px;height:54px;border-radius: 50% !important;">';
                }

                strallteacher += '<div class="TeacherBox" name="MyTeacher" data-id="' + v["TUID"] + '">' +
                    '<div class="TeacherBox1 ">' + sexhtml + '</div>' +
                    '<div class="TeacherBox2">' + v["FullName"] + '</div>' +
                    '<div class="TeacherBox3"><a href="javascript:;" onclick="NewDuecourseFun.NewSearchTutorInfo(this,0)" class="btn" data-id="' + v["TUID"] + '">查看详情</a>' + '</div>' +
                    '<span class="TeacherState"></span>' +
                    '</div>';
            });
            $('#newbookclass_allteacher').html(strallteacher);


            $.each(data.MyTeacher, function (i, v) {
                var sexhtml = "";

                if (v["Sex"] == 0)
                    sexhtml = '<img src="https://img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/Tutor_Nv.png" style="width: 54px;height:54px;" />';
                else
                    sexhtml = '<img src="https://img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/Tutor_Man.png" style="width: 54px;height:54px;" />';
                if (!jQuery.isEmptyObject(v["TutorPic"]) && v["CheckPic"] == 1) {
                    sexhtml = '<img src="' + v["TutorPic"] + '" style="width: 54px;height:54px;border-radius: 50% !important;">';
                }
                strmyteacher += '<div class="TeacherBox" name="MyTeacher" data-id="' + v["TUID"] + '">' +
                    '<div class="TeacherBox1">' + sexhtml + '</div>' +
                    '<div class="TeacherBox2">' + v["FullName"] + '</div>' +
                    '<div class="TeacherBox3"><a href="javascript:;" onclick="NewDuecourseFun.NewSearchTutorInfo(this,1)" class="btn" data-id="' + v["TUID"] + '">查看详情</a>' + '</div>' +
                    '<span class="TeacherState"></span>' +
                    '</div>';
            });

            $('#newbookclass_myteacher').html(strmyteacher);


            Config.newgettutorbytimeindex = data.Index;
        },
        //新版按时间约课日期初始化
        NewClassCalendarInit: function () {
            //$("#startDate").val(moment().format('YYYY-MM-DD'));

            //可以约课的时间到下一周的周日
            var endate;
            if (moment().days() == 0) {
                endate = moment().days(7).format('YYYY-MM-DD');
            } else {
                endate = moment().days(14).format('YYYY-MM-DD');
            }

            //先转换为日期再比较
            var days = moment(endate).diff(moment(moment().format('YYYY-MM-DD')), 'days') + 1;
            var classcalendarDays = new Array();
            for (var i = 0; i < days; i++) {
                var dayobj = { "isfull": 0, "time": moment().add(i, "d").format('YYYY-MM-DD') };
                classcalendarDays[i] = dayobj;

            }
            $("#classcalendar").ionCalendar({
                years: moment().add('years', -1).format("YYYY") + "-" + moment().add('years', 1).format("YYYY"),
                selectMonths: true,
                selectYears: true,
                hideArrows: false,
                Multiplecalls: true,
                dateData: classcalendarDays,
                onClick: function (t) {
                    var targettime = moment(t).format("YYYY-MM-DD");
                    var array1 = ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
                    var array2 = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];
                    var array3 = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
                    var array = [array1, array2, array3];
                    $('.newbookbox').each(function (i, obj) {

                        var str = '';
                        $.each(array[i], function (i, value) {

                            if (moment().isBefore(targettime + ' ' + value)) {
                                str += '<a href="javascript:;" class="btn ClassTime">' + value + '</a>';
                            } else {
                                str += '<a href="javascript:;" class="btn ClassTime disabled">' + value + '</a>';
                            }

                        });
                        $(obj).html(str);
                    });
                    $("#startDate").val(targettime);
                    $("#classcalendar").hide();
                }
            });
        },
        //[ 废弃的方法，请使用 AppointLesson 方法 2018.06.21 by:Seya ]根据老师预定课程
        BookLesson: function (obj) {
            /// <summary>
            /// [ 废弃的方法，请使用 AppointLesson 方法 2018.06.21 by:Seya ]根据老师预定课程
            /// </summary>
            if ($(".cat_name").html() == undefined || $(".cat_name").html().length == 0) {
                Modal_Fun.init("您还未选择教材！", 1);
                return;
            }
            var $selft = $(obj),
                classtool = Config.classtool;
            if (Config.ClassTime == null) {
                Modal_Fun.init("您还未选择时间！", 1);
                return;
            };
            if (classtool == 0) {
                Modal_Fun.init('请您选择上课工具！', 1);
                return;
            }
            if ((classtool != 7 && classtool != 8) && $("#issz").val() == 1) {
                Modal_Fun.init("<font color='red'>约课失败：该教材只能使用ClassIn或AClassRoom上课，请更换所有未上课的上课工具！</font>", 1);
                return;
            }
            var msg = '';
            $selft.attr("disabled", true).text("Loading...");
            var hour = Config.ClassTime.substr(11, 2);
            var str = "";
            if (parseInt(hour) < 10) {
                str = "<br/><small class='text-danger'>温馨提示:早上6-10am的课时暂不提供客服服务，若介意请预约早上10点-晚上11点间的课时</small>";
            }
            Modal_Fun.init("您要预约 [" + Config.ClassTime + "] 的课吗？" + str, 2);
            $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                if ($('#Modal_Fun_room').attr("data-action") == "true") {
                    var result = Fn.Course.InsertClassTime(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTime, classtool, 0, "", "");
                    if (result.code == "success") {
                        $(".class-time .checked").addClass("disabled").children("input").attr("disabled", true);
                        Modal_Fun.init("预订成功！", 1);
                        $(".fc-title").each(function (i) {
                            // console.log($(this).text())
                            if ($(this).css("background-color") == "rgb(255, 140, 0)") {
                                $(this).parent().parent("a").hide();
                            }
                        });
                        $("[name=DueDate2]").text("").hide();
                        $(".show_tutor_list2").html("");
                        $(".show_tutor_tools2").html("");
                        $(".full_showtutor").hide();
                        $(".full_tutortool").hide();
                        Config.ClassTime = null;
                        Config.ClassTool2 = 0;
                    } else {
                        Modal_Fun.init(result.msg, 1);
                    }
                }
            });
            $selft.removeAttr("disabled").text("确定预定");
        },
        // [ 用于替代 BookLesson 方法，2018.06.21 by:Seya ]
        AppointLesson: function (obj) {

            /// <summary>
            /// [ 用于替代 BookLesson 方法，2018.06.21 by:Seya ]
            ///</summary>


            if ($(".cat_name").html() == undefined || $(".cat_name").html().length == 0) {
                Modal_Fun.init("您还未选择教材！", 1);
                return;
            }
            var $selft = $(obj),
                classtool = Config.classtool;
            if (Config.ClassTime == null) {
                Modal_Fun.init("您还未选择时间！", 1);
                return;
            };
            if (classtool == 0) {
                Modal_Fun.init('请您选择上课工具！', 1);
                return;
            }
            if ((classtool != 7 && classtool != 8) && $("#issz").val() == 1) {
                Modal_Fun.init("<font color='red'>约课失败：该教材只能使用ClassIn或AClassRoom上课，请更换所有未上课的上课工具！</font>", 1);
                return;
            }
            if (new Date(Date.parse(Config.ClassTime)) >= new Date(Date.parse('2018/10/1 00:00')) && classtool == 5) {
                Modal_Fun.init("<font color='red'>约课失败：E-classroom将于2018年9月30日全面下线，请更换上课工具！</font>", 1);
                return;
            }
            var msg = '';
            $selft.attr("disabled", true).text("Loading...");
            var hour = Config.ClassTime.substr(11, 2);
            var dateNow = new Date(); //获取当前时间
            var dateDiff = (new Date(Config.ClassTimes[0]).getTime() - dateNow.getTime()) / 60000; //时间差的分钟
            var str = "";
            if (dateDiff < 180) {
                str = "<br/><small class='text-danger'>温馨提示:该课时距离开课时间已不足三小时，预约后将无法取消。</small>";
            }
            if (parseInt(hour) < 10) {
                str = "<br/><small class='text-danger'>温馨提示:早上6-9am的课时暂不提供客服服务，若介意请预约早上9点-晚上11点间的课时</small>";
            }
            Modal_Fun.init("您要预约 [" + Config.ClassTime + "] 的课吗？" + str, 2);
            $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                if ($('#Modal_Fun_room').attr("data-action") == "true") {
                    Fn.Course.AppointClass(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTime, classtool, 0, "", "", function (data) {
                        DuecourseFunNewbtn(Config.UID, Config.ClassTool1, Config.TUID, $(".Book_Tutor.active").find(".Tutor_bottom").text(), json.result, json.msg);

                        var json = data.value;
                        if (!json.result) {
                            Modal_Fun.init(json.msg, 1);
                            return;
                        }
                        $(".class-time .checked").addClass("disabled").children("input").attr("disabled", true);
                        var HelpCenter = json.msg;
                        if (classtool == 8) {
                            HelpCenter += "<br><a href=\"https://www.acadsoc.com.cn/WebNew/user/HelpCenter/Video.aspx\" target=\"_blank\" class=\"text-success\">点击查看 A-Classroom 使用教学</a>";
                        }
                        Modal_Fun.init(HelpCenter, 1);
                        //Modal_Fun.init(json.msg, 1);
                        $(".fc-title").each(function (i) {
                            //console.log($(this).text())
                            if ($(this).css("background-color") == "rgb(255, 140, 0)") {
                                $(this).parent().parent("a").hide();
                            }
                        });
                        $("[name=DueDate2]").text("").hide();
                        $(".show_tutor_list2").html("");
                        $(".show_tutor_tools2").html("");
                        $(".full_showtutor").hide();
                        $(".full_tutortool").hide();
                        Config.ClassTime = null;
                        Config.ClassTool2 = 0;
                        //如果是PC端，则显示PC端的约课成功分享弹窗
                        if (window.WXShareTipConfig && window.WXShareTipConfig.pcOrderClass === true) {
                            if (window.WXShareTipFunc) {
                                WXShareTipFunc.get_pcOrderClass(); //弹出PC端约课分享提示
                            }
                        }
                    });
                }
            });
            $selft.removeAttr("disabled").text("确定预定");
        },
        //新版根据老师预定课程
        NewBookLesson: function (obj) {

            if ($(".cat_name").html() == undefined || $(".cat_name").html().length == 0) {
                Modal_Fun.init("您还未选择教材！", 1);
                return;
            }
            var $selft = $(obj),
                classtool = Config.classtool;
            var selectDate = $('#startDate').val();
            var selecttimeobj = $('.newbookbox.active').find('.ClassTime.active')[0];
            var selecttime = $.trim($(selecttimeobj).text());
            var start = selectDate.split()[0] + " " + selecttime;
            //var classtool = $($('.ClassTool.active').find('input')[0]).val();
            if (selectDate.split()[0].length == 0 && selecttime.length == 0) {
                $("#ModalPleaseClassTime").modal("show");
                return;
            };
            if (classtool <= 0) {
                $("#ModalPleaseTool").modal("show");
                return;
            }
            if ((classtool != 7 && classtool != 8) && $("#issz").val() == 1) {
                Modal_Fun.init("<font color='red'>约课失败：该教材只能使用ClassIn或AClassRoom上课，请更换所有未上课的上课工具！</font>", 1);
                return;
            }
            if (new Date(Date.parse(start)) >= new Date(Date.parse('2018/10/1 00:00')) && classtool == 5) {
                Modal_Fun.init("<font color='red'>约课失败：E-classroom将于2018年9月30日全面下线，请更换上课工具！</font>", 1);
                return;
            }
            var msg = '',
                tname = "";
            var checkteacher = $($('#tab_1_2 [name=MyTeacher].active')[0]);
            if (checkteacher.length > 0) {
                //获取老师性别
                var sex = $(checkteacher)[0].children[0].className;
                if (sex.indexOf('TeacherMan') > -1) {
                    tname += "<span class='man'>预约老师：";
                } else if (sex.indexOf('TeacherWoMan') > -1) {
                    tname += "<span class='woman'>预约老师：";
                }
                //获取老师名字
                //tname += $(checkteacher)[0].children[1].outerText + "</span>";
                tname += $(checkteacher[0].children[1]).text() + "</span>";
            } else {
                $("#ModalTeaching_noTeach").modal("show");
                return;
            }
            $(".ModalWhetherClass_1").text("");
            $(".ModalWhetherClass_2").text("");
            $(".ModalWhetherClass_3").text("");
            $(".ModalWhetherClass_1").append(tname);
            if (selecttime.substring(3) == "00") {
                $(".ModalWhetherClass_2").append("预约时间：" + start + "~" + selecttime.substring(0, 3) + "25");
            } else if (selecttime.substring(3) == "30") {
                $(".ModalWhetherClass_2").append("预约时间：" + start + "~" + selecttime.substring(0, 3) + "55");
            }
            //$(".ModalWhetherClass_3").append("上课工具：" + $($('.ClassTool.active'))[0].outerText);
            $(".ModalWhetherClass_3").append("上课工具：" + Config.toolname);
            $("#ModalWhetherClass2").modal("show");
            Config.TUID = checkteacher.attr("data-id");
            Config.ClassTime = start;
            //Config.ClassTool2 = classtool;
            //如果是PC端，则显示PC端的约课成功分享弹窗
            //if (window.WXShareTipConfig && window.WXShareTipConfig.pcOrderClass === true) {
            //    NewDuecourseFun.ShowPCAppointTips(); //弹出分享提示
            //}
        },
        //[ 废弃的方法，请使用 AppointClassByTeacher 方法，2018.06.21 by:Seya ]约课
        InsertClassTime: function () {
            var result = Fn.Course.InsertClassTime(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTime, Config.classtool, 1, $("#TeacherPers").val(), $("#TeacherStyle").val());
            $("#ModalWhetherClass").modal("hide");
            if (result.code == "success") {
                $("#ModalNewBookClass").modal("show");
                Config.ClassTime = null;
                Config.ClassTool2 = 0;
            } else {
                if (result.msg.indexOf("此时间已被预订") > -1) {
                    $("#ModalTeacherSlow").modal("show");
                    return;
                }
                if (result.msg.indexOf("前10分钟") > -1) {
                    $("#ModalTeacherSlow").modal("show");
                    return;
                }
                if (result.msg.indexOf("您的订单有效期已过") > -1) {
                    $("#ModalPackageOverdue").modal("show");
                    return;
                }
                if (result.msg.indexOf("您的订单剩余课时不足") > -1) {
                    $("#ModalPackageFinished").modal("show");
                    return;
                }
                Modal_Fun.init(result.msg, 1);
            }
        },
        //[ 用于替代 InsertClassTime 方法，2018.06.21 by:Seya ] 按老师约课
        AppointClassByTeacher: function () {
            Fn.Course.AppointClass(Config.TUID, 3, Config.COID, Config.UID, Config.ClassTime, Config.classtool, 1, $("#TeacherPers").val(), $("#TeacherStyle").val(), function (data) {
                var json = data.value;

                DuecourseFunNewbtn(Config.UID, Config.ClassTool1, Config.TUID, $(".Book_Tutor.active").find(".Tutor_bottom").text(), json.result, json.msg);
                $("#ModalWhetherClass2").modal("hide");
                if (!json.result) {
                    if (json.msg.indexOf("此时间已被预订") > -1) {
                        $("#ModalTeacherSlow").modal("show");
                        return;
                    }
                    if (json.msg.indexOf("前10分钟") > -1) {
                        $("#ModalTeacherSlow").modal("show");
                        return;
                    }
                    if (json.msg.indexOf("您的订单有效期已过") > -1) {
                        $("#ModalPackageOverdue").modal("show");
                        return;
                    }
                    if (json.msg.indexOf("您的订单剩余课时不足") > -1) {
                        $("#ModalPackageFinished").modal("show");
                        return;
                    }
                    Modal_Fun.init(json.msg, 1);
                    return;
                }
                $("#ModalNewBookClass2").modal("show");
                Config.ClassTime = null;
                //Config.ClassTool2 = 0;
                //显示分享提示
                //DuecourseFun.showShare(json.data.action);
            });

        },
        //设置默认套餐
        SetDefaultOrder: function (coid) {
            var res = Fn.Course.SetDefaultOrder(coid);
        },
        //预约课程帮助
        Dk_help: function () {
            Dk_Liuchen();
        }

        //,
        // //显示约课成功的分享提示（微信端显示）
        // ShowAppointTips: function(fn) {
        //     showActionTips(1, fn);
        // },
        // //显示上完课的分享提示（微信端显示）
        // ShowEndClassTips: function(fn) {
        //     showActionTips(2, fn);
        // },
        // //显示约课成功的分享提示（仅PC端显示）
        // ShowPCAppointTips: function(fn) {
        //     showActionTips(14, fn);
        // },
        // //显示上完课的分享提示（仅PC端显示）
        // ShowPCEndClassTips: function(fn) {
        //     showActionTips(15, fn);
        // },
        // //显示试课的上完课分享提示
        // ShowTrailEndClassTips: function(fn) {
        //     showActionTips(8, fn);
        // }
    };
}();


/********* 我的老师************/
var MyTeachers = function () {
    //配置
    var Config = {
        PreDeleteIds: [], //预删除老师对应表id
        CurrentOrderId: 0, //当前订单
        CurrentOrderName: "", //当前订单名称
        CurrentOrderTutorNum: 0, //当前订单已分配老师数
        CurrentOrderTutorIds: [], //当前订单已分配老师的id集合
        PreAddTuids: [], //预添加老师id
        IsSaved: true,
        level: 0 //订单级别
    };
    //点击更改按钮
    $('#alterOrderTutorBtn').on('click', function (e) {
        if ($(this).attr('data-type') === '0') {
            $(this).html('保存').attr('data-type', '1').siblings().show();
            $(".Book_Tutor").css("height", "130px");
            $(".Book_Tutor_rom").css("height", "130px");
            Config.PreDeleteIds = [];
            Config.IsSaved = false;
            $('.Book_Del').toggle();
            e.stopPropagation();
        } else {
            $(".Book_Tutor").css("height", "100px");
            $(".Book_Tutor_rom").css("height", "100px");
            $(this).attr('diabled', true);
            var $this = $(this);
            var ids = Config.PreDeleteIds.toString();
            if ($.isEmptyObject(Config.PreDeleteIds)) {
                $('#cancelOrderTutorBtn').trigger('click');
                $this.attr('diabled', false);
                return;
            }
            var res = Fn.NewCourse.DeleteOrderTeacher(ids);
            if (res) {
                Modal_Fun.init("保存成功！", 1);
            } else {
                Modal_Fun.init("保存失败！", 1);
            }
            $('#cancelOrderTutorBtn').trigger('click');
            $('#sel_Orders').trigger('change');
            $this.attr('diabled', false);
        }
    });
    //点击取消按钮
    $('#cancelOrderTutorBtn').on('click', function () {
        $('#alterOrderTutorBtn').html('修改').attr('data-type', '0').siblings().eq(0).hide();
        $('.Book_Del').toggle();
        $('#sel_Orders').trigger('change');
    });
    //添加单个老师 
    //        $('#book_tutor_add')
    //            .on('click',function() {
    //                    if ( $('#sel_orders').val()==="") {
    //                        modal_fun.init("请先选择套餐！",1);
    //                        return;
    //                    }
    //                    if ($('#alterordertutorbtn').attr('data-type') === '1') {
    //                        modal_fun.init("您的删除老师操作还未保存，请先保存再添加！",1);
    //                        return;
    //                    }
    //                    if (config.currentordertutornum>=8) {
    //                        modal_fun.init("您套餐下的8位老师已满！",1);
    //                        return;
    //                    }
    //                    var result = fn.course.searchbyone(config.currentordertutorids.tostring(), config.currentorderid);
    //                    if (result) {
    //                        if (result._r > 0) {
    //                            var data = result.data[0];
    //                            var teahtml= '<div class="book_tutor_rom">';
    //                              teahtml += '<div class="'+(data["sex"]===0?"tutor_nv":"tutor_man")+'" >';
    //                              teahtml += '</div>';
    //                              teahtml += '<div class="tutor_bottom">';
    //                              teahtml += data["name"] + '</div>';
    //                              teahtml += '<div class="book_chakan" title="点击查看老师详情" onclick="duecoursefun.searchtutorinfo(this)" data-id="'+ data["tuid"] +'">';
    //                              teahtml += '</div>';
    //                              teahtml += '<div class="book_del" style="display:none" title="删除当前老师" onclick="" data-id="' +
    //                                  result.id +'">';
    //                              teahtml += '</div>';
    //                              teahtml += '</div>';
    //                              teahtml += '<i class="pec_img"></i>';
    //                            $('<div class="book_tutor"></div>').html(teahtml).insertbefore('#operbtns');
    //                            config.currentordertutorids.push(data.tuid);
    //                            config.currentordertutornum++;
    //                            if (config.currentordertutornum < 8) {
    //                                $('.book_tutor_add').show();
    //                            } else {
    //                                $('.book_tutor_add').hide();
    //                            }
    //                        } else {
    //                             modal_fun.init(result._msg,1);
    //                        }
    //                    }
    //                });

    $('#Book_Tutor_add').on('click', function () {
        //判断是否是分级套餐
        var index = Config.CurrentOrderName.indexOf('级老师')
        if (index >= 0) {
            Config.level = Config.CurrentOrderName.slice(index - 1, index);
        }
        var res = Fn.NewCourse.SelectTeachers(parseFloat(Config.CurrentOrderId), -1, "0", 0, 0, 0, Config.CurrentOrderTutorIds.toString(), Config.level);
        if (!res || res._r <= 0) {
            Modal_Fun.init("未找到符合当前订单所设置课表时间的老师！", 1);
            return;
        }
        $('#searchFilter,#searchResult').toggle(200);
    });
    //点击删除图标
    $('div.course_order_teachers').on('click', '.Book_Del', function () {
        $(this).parents('.Book_Tutor').remove();
        Config.PreDeleteIds.push($(this).attr('data-id'));
    });
    //未保存点其他地方
    //    $('body').on('click', '*',function(e) {
    //        if (!Config.IsSaved) {
    //            if (!$(this).hasClass('btn_Qud')&&
    //                $(this).attr('id')!=='cancelOrderTutorBtn'&&
    //                $(this).attr('id')!=='alterOrderTutorBtn') 
    //                {
    //                    Modal_Fun.init("请先保存！",1);
    //                }
    //                e.stopPropagation();
    //                e.preventDefault();
    //                return false;
    //        }
    //    });
    //更改订单显示该订单下的老师
    $('#sel_Orders').on('change', function () {
        if ($('#alterOrderTutorBtn').attr('data-type') === '1') {
            $('#alterOrderTutorBtn').trigger('click');
        }
        MyTeachers.Reset();
        $('div.course_order_teachers .Book_Tutor').remove();
        if (!$.isEmptyObject(Config.CurrentOrderId) && Config.CurrentOrderId !== 0) {
            var res = Fn.NewCourse.GetOrderTeacherList(parseFloat(Config.CurrentOrderId));
            if (res == null) {
                $('#Book_Tutor_add').show();
                return;
            }
            var arr = [];
            $.each(res, function (i, t) {
                var html = '<div class="Book_Tutor">';
                html += '<div class="Book_Tutor_rom" onclick="">';
                html += '<div class="' + (t.sex === 0 ? "Tutor_Nv" : "Tutor_Man") + '" >';
                html += '</div>';
                html += '<div class="Tutor_bottom">';
                html += t.tutorname + '</div>';
                html += '<div class="Tutor_bottom Book_Del" style="display:none;" data-id="' + t.id + '">';
                html += "移除" + '</div>';
                html += '<div class="Book_ChaKan" title="点击查看老师详情" onclick="DuecourseFun.SearchTutorInfo(this)" data-id="' + t.tuid + '">';
                html += '</div>';
                //html += '<div class="Book_Del" style="display:none" title="删除当前老师" onclick="" data-id="' +
                //    t.id +
                //     '">';
                //html += '</div>';
                html += '</div>';
                html += '<i class="pec_img"></i>';
                html += '</div>';
                arr.push(html);
                // $('div.course_order_teachers').prepend($(html));
                Config.CurrentOrderTutorIds.push(t.tuid);
            });
            var html = arr.join("");
            $('div.course_order_teachers').prepend($(html));
            Config.CurrentOrderTutorNum = $('div.course_order_teachers .Book_Tutor').length;
            if (Config.CurrentOrderTutorNum > 7) {
                $('#Book_Tutor_add').hide();
            } else {
                $('#Book_Tutor_add').show();
            }
        }
    });
    //查询老师列表
    var getSearchTeacherList = function (searchBtn, searchType) {
        var $this = $(searchBtn);
        //$this.attr('disabled', true);



        if ($.isEmptyObject(Config.CurrentOrderId)) {
            // $this.attr('disabled', false);
            Modal_Fun.init("请选择有效订单！", 1);
            // $loader.remove();
            return;
        }

        var $loader = $('<div class="loader-inner ball-triangle-path"><div></div><div></div><div></div></div>');
        $('div.search-list').after($loader);
        // $loader.appendTo($('.panel-body').eq(1));

        var json = {
            result: false,
            msg: "查询条件错误！"
        };

        switch (searchType) {
            case "byCondition": //按条件筛选
                {
                    var sex = $('#SelectSex option:selected').val(); //性别
                    //        var age = $('#SelectAge option:selected').val();//年龄
                    //        var hasVedio = $('[name="name1"]:checked').val();//有无摄像头
                    var subject = $('#SelectSubject option:selected').val();
                    var IsCamera = $('#IsCamera').val(); //有无摄像头
                    var Personality = $('#TeacherPers').attr('data-id'); //老师个性
                    var TeachStyle = $('#TeacherStyle').attr('data-id'); //教学风格		

                    //var classTool = $('[name="name2"]:checked').val();//教学工具
                    var tool = document.getElementsByName("name2");
                    var classTool = "";
                    var classToolArr = [];
                    for (var i = 0; i < tool.length; i++) {
                        if (tool[i].checked)
                            classToolArr.push(tool[i].value);
                    }
                    classTool = classToolArr.join(",");
                    //var res = Fn.NewCourse.SelectTeachers(parseFloat(Config.CurrentOrderId), sex, age, subject, hasVedio, classTool, Config.CurrentOrderTutorIds.toString(), Config.level);
                    json = Fn.NewCourse.QueryTeachers(parseFloat(Config.CurrentOrderId), sex, subject, IsCamera, Personality, TeachStyle, classTool, Config.CurrentOrderTutorIds.toString(), Config.level);
                }
                break;
            case "byName": //按姓名筛选
                {
                    var teacher_name = $("#teacherName").val();
                    teacher_name = $.trim(teacher_name);
                    if (!teacher_name) {
                        Modal_Fun.init("请输入老师姓名！", 1);
                        $loader.remove();
                        return;
                    }
                    json = Fn.NewCourse.QueryTeacherByName(Config.CurrentOrderId, teacher_name, Config.CurrentOrderTutorIds.toString());
                }
            default:
                break;
        }



        $('div.search-list').find('.Book_Tutor').remove();
        if (!json.result) {
            $this.attr('disabled', false);
            // Modal_Fun.init("未找到符合当前订单所设置课表时间的老师！", 1);
            Modal_Fun.init(json.msg);
            $loader.remove();
            return;
        }
        var arr = [];
        $.each(json.data.list, function (i, t) {
            var html = '<div class="Book_Tutor" style="opacity:0.7;">';
            html += '<div class="Book_Tutor_rom">';
            html += '<div class="' + (t.Sex === 0 ? "Tutor_Nv" : "Tutor_Man") + '" >';
            html += '</div>';
            html += '<div class="Tutor_bottom">';
            html += t.Name + '</div>';
            html += '<div class="Book_ChaKan" title="点击查看老师详情" onclick="DuecourseFun.SearchTutorInfo(this)" data-id="' + t.TUID + '">';
            html += '</div>';
            html += '</div>';
            html += '<i class="pec_img"></i>';
            html += '</div>';
            arr.push(html);
        });
        var html = arr.join("");
        // $(html).insertBefore($('div#addTutorToOrder2'));
        $('div#addTutorToOrder').before(html);
        $this.attr('disabled', false);
        $loader.remove();
    };


    //根据条件搜索老师
    $('#selectTutorBtn').click(function () {
        getSearchTeacherList(this, "byCondition");
    });
    //点击搜索结果的老师
    $('.search-list').on('click', '.Book_Tutor', function () {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $(this).css('opacity', 1);
        } else {
            $(this).css('opacity', 0.7);
        }
    });
    //点击添加到当前套餐
    $('#AddToOrder').on('click', function () {
        $(this).addClass('disabled');
        Config.PreAddTuids = [];
        var $this = $(this);
        if ($('.Book_Tutor.active').length < 1) {
            Modal_Fun.init("请先选择要添加的老师！", 1);
            $this.removeClass('disabled');
            return;
        }
        if ($('#sel_Orders').val() === "") {
            Modal_Fun.init("请先选择套餐！", 1);
            $this.removeClass('disabled');
            return;
        }
        if ($('#alterOrderTutorBtn').attr('data-type') === '1') {
            Modal_Fun.init("您的删除老师操作还未保存，请先保存再添加！", 1);
            $this.removeClass('disabled');
            return;
        }
        if (Config.CurrentOrderTutorNum >= 10) {
            Modal_Fun.init("您套餐下的10位老师已满！", 1);
            $this.removeClass('disabled');
            return;
        }
        if ($('.Book_Tutor.active').length + Config.CurrentOrderTutorNum > 10) {
            Modal_Fun.init("添加老师数目已超限，请核对后再添加！", 1);
            $this.removeClass('disabled');
            return;
        }
        var tidPanels = $('.Book_Tutor.active').find('.Book_ChaKan');
        $.each(tidPanels, function (i, obj) {
            var tuid = $(obj).attr('data-id');
            Config.PreAddTuids.push(tuid);
        });
        var res = Fn.NewCourse.AddOrderTeacher(Config.CurrentOrderId, Config.PreAddTuids.toString());
        if (res > 0) {
            $(".active").remove();
            Modal_Fun.init("成功添加了" + res / 2 + "位老师！", 1);
        } else {
            Modal_Fun.init("添加失败！", 1);
        }
        $('#sel_Orders').trigger('change');
        $this.removeClass('disabled');
    });

    //按老师姓名查询
    $("#btnSearchTeacher").on("click", function () {
        getSearchTeacherList(this, "byName");
    });
    return {
        init: function (option) {
            Config = $.extend(true, Config, option);
        },
        Reset: function () {
            Config.PreDeleteIds = [];
            Config.CurrentOrderId = $('#sel_Orders option:selected').val();
            Config.CurrentOrderName = $('#sel_Orders option:selected').text();
            Config.CurrentOrderTutorNum = 0;
            Config.CurrentOrderTutorIds = [];
            Config.PreAddTuids = [];
            Config.IsSaved = true;
        }
    }
}();

/********* 我的课表************/
var MyClassFun = function () {
    var Config = {
        COID: 0,
        UID: 0,
        Times: null,
        CurrentTime: null,
        liitem: 0,
        Overtime: 0
    };
    //我的课程表
    var School_Fun = function () {
        $("[name=select-btn]").click(function () {
            $(".selectclass").parent().removeClass("display-none").show();
            $(this).parent().toggle();
        });
        $(".fc-today-button").click(function () {
            MyClassFun.GetLessonList(Config.Times);
        });
        //点击"确认打赏"按钮，进行打赏的功能操作
        $("#btnRewardSubmit").click(function () {
            var clid = $(this).attr("data-clid");
            var tuid = $(this).attr("data-tuid");
            if (tuid == null || clid == null) {
                Modal_Fun.init("操作有误，请重试！", 1);
                return;
            }
            var rewardCount = $("#Play_hua").val();
            if (rewardCount == 0) {
                Modal_Fun.init("请选择要赠送的礼物", 1);
                return;
            }
            var msg = "";
            if (rewardCount == 100)
                msg = "饭团";
            if (rewardCount == 200)
                msg = "饺子";
            else if (rewardCount == 500)
                msg = "面包";
            else if (rewardCount == 1000)
                msg = "小笼包";
            else if (rewardCount == 5000)
                msg = "披萨";
            else if (rewardCount == 10000)
                msg = "蛋糕";
            Modal_Fun.init("是否确定赠送该老师“" + msg + "”（" + rewardCount + "A豆）？", 2);
            $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                if ($("#Modal_Fun_room").attr("data-action") == "true") {
                    var r = Fn.NewUser.RewardToTeacher(tuid, clid, rewardCount, 1);
                    if (r == -2) {
                        Modal_Fun.init("A豆数量不足，请充值");
                    }
                    if (r == -1) {
                        Modal_Fun.init("每天对同一老师只能赠送5次哦，不能再赠送啦");
                    }
                    if (r == 0) {
                        Modal_Fun.init("赠送失败，请重试");
                    }
                    if (r == -3) {
                        Modal_Fun.init("赠送失败，请选择要赠送的礼物");
                    }
                    if (r == 1) {
                        Modal_Fun.init("赠送成功", 1, true);
                    }
                }
            });
        });
        //打赏
        $('.Play_hua li').each(function (i) {
            $(this).click(function () {
                for (var n = 0; n <= i; n++) {
                    $('.Play_hua li').eq(n).addClass('liitem');
                }
                Config.liitem = i + 1;
                $("[name=Play_hua]").val($('.Play_hua li').eq(i).attr("data-num") * 100);
            }).mouseenter(function () {
                $('.Play_hua li').removeClass('liitem');
                for (var n = 0; n <= i; n++) {
                    $('.Play_hua li').eq(n).addClass('liitem');
                }
            }).mouseleave(function () {
                $('.Play_hua li').removeClass('liitem')
                if (Config.liitem > 0) {
                    for (var n = 0; n < Config.liitem; n++) {
                        $('.Play_hua li').eq(n).addClass('liitem');
                    }
                }
            })
        });
    };
    return {
        init: function (option) {
            Config = $.extend(true, Config, option);
            School_Fun();
            MyClassFun.GetLessonList(Config.Times);
            MyClassFun.ReloadFullCalendar();

        },
        //重新加载日历
        ReloadFullCalendar: function () {
            $("#calendar1").remove();
            $(".full_calendar1").html("<div data-step=\"1\" data-intro=\"选择上课日期\ class=\"col-md-10 col-md-offset-1 panding-bottom10 margin-top10\" id=\"calendar1\"></div>")
            $('#calendar1').fullCalendar('unselect'); //重新加载
            $('#calendar1').fullCalendar({
                header: {
                    left: '',
                    center: 'title',
                    right: 'today prev,next'
                },
                defaultView: 'month',
                weekMode: "liquid",
                selectable: true,
                selectHelper: true,
                slotEventOverlap: false,
                allDayDefault: false,
                allDaySlot: false,
                firstDay: 1,
                axisFormat: 'HH:mm',
                lang: 'zh-cn',
                buttonText: {
                    prevYear: '去年',
                    nextYear: '明年',
                    today: '今天',
                    month: '月',
                    week: '周',
                    day: '日'
                },
                theme: true,
                editable: false,
                eventLimit: true, // allow "more" link when too many eve
                timeFormat: {
                    agenda: 'HH:mm{ - HH:mm}'
                },
                events: function (start, end, callback) {
                    var obj = new Object();
                    var res = Fn.User.GetUserLessonsByCOID(Config.COID, MyClassFun.FormatDate(start), MyClassFun.FormatDate(end));
                    if (res) {
                        $.each(res, function (i, date) {
                            obj.id = i + 1;
                            obj.title = "";
                            obj.start = date.start;
                            obj.end = date.end;
                            obj.color = "transparent";
                            //console.log(obj)
                            $('#calendar1').fullCalendar('renderEvent', obj); //核心的更新代码
                        });
                    }
                    $('#calendar1').fullCalendar('unselect'); //重新加载
                    $(window).load(function () {
                        setTimeout(function () {
                            $('.fc-content-skeleton').find('table thead tr td').each(function (i) {
                                if ($(this).attr('class').indexOf('ui-state-highlight') != -1) {
                                    $('.fc-content-skeleton').find('table tbody tr td').eq(i).find("a").click()
                                }
                            })
                        }, 500)
                    });

                    $(".fc-day-grid-event.fc-h-event.fc-event.fc-start.fc-end").click(function () {
                        $(".fc-day-grid-event.fc-h-event.fc-event.fc-start.fc-end").css("background-image", "url('" + CDNUrl + "/web/webnew/assets/admin/pages/img/sign.png')").attr("is-this", 0);
                        $(this).css("background-image", "url('" + CDNUrl + "/web/webnew/assets/admin/pages/img/sign_y.png')").attr("is-this", 1);
                    }).mouseenter(function () {
                        if ($(this).attr("is-this") != 1) {
                            $(this).css("background-image", "url('" + CDNUrl + "/web/webnew/assets/admin/pages/img/sign_h.png')");
                        }
                    }).mouseleave(function () {
                        if ($(this).attr("is-this") == 1) {
                            $(this).css("background-image", "url('" + CDNUrl + "/web/webnew/assets/admin/pages/img/sign_y.png')");
                        } else {
                            $(this).css("background-image", "url('" + CDNUrl + "/web/webnew/assets/admin/pages/img/sign.png')");
                        }
                    })
                },
                eventClick: function (event) {
                    var sTime = moment(event.start).format("YYYY-MM-DD HH:mm");
                    Config.CurrentTime = sTime;
                    MyClassFun.GetLessonList(sTime);
                }
            });
        },
        ChangeUserLesson: function () {
            var coid = $("#selectclass").val();
            Config.COID = coid;
            $(".course_name").text($("#selectclass option:selected").text());
            MyClassFun.ReloadFullCalendar();
            $(".hide_orders").hide();
            $(".show_orders").show();
        },
        FormatDate: function (strTime) {
            var date = new Date(strTime);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },
        GetLessonList: function (times) {
            $(".show_lessonlist").hide();
            $(".my_lesson").show();
            var res = Fn.User.GetStudentLessonsByTime(Config.COID, times);

            var html = "";
            var mhtml = "";
            if (res) {
                $.each(res, function (i, data) {
                    html += "<tr>";
                    html += "<td>" + data["id"] + "</td>";
                    html += "<td>" + data["start"] + " -- " + data["end"] + "</td>";
                    html += "<td>" + data["fullname"] + "</td>";
                    html += "<td  style='text-align:center;'>" + data["tools"] + "</td>";
                    html += "<td style='min-width:200px;white-space:normal;'>" + data["toolhtml"] + "</td>";
                    html += "<td>" + data["title"] + "</td>";
                    html += "<td>" + data["operate"] + "</td>";
                    html += "</tr>";
                    i++;
                    var cancel = "";
                    if (data["mflag"] == 1) {
                        cancel = "<li class=\"col-md-6 col-sm-6 col-xs-6 color-black text-right line-height25 margin-top2 margin-bottom2 no-padding\">" +
                            "<a href=\"javascript:;\" class=\"btn btn-outline btn-circle dark btn-sm black btn-cancel\" data-id=\"" + data["id"] + "\">" +
                            " 取消课程</a></li>";
                    }
                    mhtml += '<div class="row mylesson-m-border">' +
                        '<div class="col-xs-12">' +
                        '<div class="row mylesson-m-top">' +
                        '<div class="col-xs-6 text-left">' + data["start"] + '</div>' +
                        '<div class="col-xs-6 text-right" style="padding-left:0;">课程状态:' + data["title"] + '</div>' +
                        '</div>' +
                        '</div>' +
                        ' <div class="col-xs-12">' +
                        '    <div class="row mylesson-m-cen">' +
                        '      <div class="col-xs-6 text-left">课节号:#' + data["id"] + '</div>' +
                        '       <div class="col-xs-6 text-left" style="padding:0">导师:<span>' + data["fullname"] + '</span></div>' +
                        '  <div class="col-xs-12 text-left">上课工具:' + data["tools"] + '</div>' +
                        '      <div class="col-xs-12 text-left">教室入口:' + data["toolhtml"] + '</div>' +
                        '  </div>' +
                        '</div>' +
                        '<div class="col-xs-12">' +
                        '<div class="row mylesson-m-bot">' +
                        '<div class="col-xs-12">' +
                        data["operate"] +
                        '</div>' +
                        '</div>' +
                        ' </div>' +
                        ' </div>';
                    //                    mhtml+="<li class=\"list my-border border-radius8 overflow margin-bottom10 clearfix\">"+
                    //                            "<ul>"+
                    //                                "<li class=\"clearfix\">"+
                    //                                    "<ul class=\"col-md-12 col-sm-12 col-xs-12 no-padding bg-grey\">"+
                    //                                        "<li class=\"col-md-6 col-sm-6 col-xs-6 text-left no-padding\"><span class=\"label label-sm label-success bg-agba0 height-40 line-height40\">"+
                    //                                            "<i class=\"fa fa-clock-o\"></i>"+data["start"]+" </span></li>"+
                    //                                        "<li class=\"col-md-6 col-sm-6 col-xs-6 text-right no-padding\"><span class=\"label label-sm label-success bg-agba0 height-40 line-height40\">"+
                    //                                            "<i class=\"fa fa-graduation-cap\"></i>导师：" + data["fullname"] + "</span></li>"+
                    //                                    "</ul>"+
                    //                                "</li>"+
                    //                                "<li class=\"clearfix\">"+
                    //                                    "<ul>"+
                    //                                        "<li class=\"clearfix\">"+
                    //                                            "<ul>"+
                    //                                                "<li class=\"col-md-6 col-sm-6 col-xs-6 color-black text-left line-height25 margin-top2 margin-bottom2 no-padding\">"+
                    //                                                    "<span class=\"label label-sm label-success bg-agba0\"><i class=\"fa fa-star-o\"></i>课节号：#"+data["id"]+
                    //                                                    "</span></li>"+cancel+
                    //                                            "</ul>"+
                    //                                        "</li>"+
                    //                                        "<li class=\"clearfix\">"+
                    //                                            "<ul>"+
                    //                                                "<li class=\"col-md-12 col-sm-12 col-xs-12 color-black text-left line-height25 margin-top2 margin-bottom2 no-padding\">"+
                    //                                                    "<span class=\"label label-sm label-success bg-agba0 float-left\"><i class=\"fa fa-cutlery\"></i>上课工具："+data["ctools"]+
                    //                                                    "</span></li>"+
                    //                        "</ul></li></ul></li></ul></li>";
                    //console.log(data["ctools"]);
                });
            } else {
                html = '<tr class="active"><td colspan="7"><h4 class=" text-center">当天没有上课安排</h4></td></tr>';
            }
            $(".my_lesson").hide();
            $(".show_lessonlist").show();

            $("#lessonlist tbody").html(html);
            $("#mobile_Class").html(mhtml);


            //隐藏求救按钮
            $("#lessonlist .open-shit-modal").hide();
            $("#lessonlist .AlertCircumstance").hide();

            //我的课表入口&enter=3 预复习按钮 add by civic20190620
            //我的课表入口 课前预习
            $(".btn-ClassBeforePreview").click(function () {
                //仅预复习用。 1000：等待上课；1001：正常上完的课；1002：缺席，包括主动缺席和被动缺席
                var dataClid = $(this).attr("data-clid");
                var dataSid = $(this).attr("data-sid");
                var dataUid = $(this).attr("data-uid");
                var isGameOver = $(this).attr("data-isover");
                var lstPrev = $(this).attr("data-lessonStatusForPrev");
                var res = Fn.User.GetPreviewMaterials(dataSid, 2);
                switch (lstPrev) {
                    case "1000":
                    case "1001": {
                        if (dataSid == "0" || res.Code == 0 || (res.Code == 1 && res.Data.length == 0)) {
                            Modal_Fun.init('抱歉，未找到可供预习的课件！', 1);
                            return false;
                        } else {
                            //跳转到课前预习
                            window.open("/WebNew/user/previewReview/preview.aspx?clid=" + dataClid + "&sid=" + dataSid + "&uid=" + dataUid + "&enter=3", "_parent");
                        }
                    }; break;
                    case "1002": {
                        //缺席之前预习过功课，很认真嘛，小学生！
                        //跳转到课前预习
                        if (isGameOver == "100") {
                            if (res.Code == 0 || (res.Code == 1 && res.Data.length == 0)) {
                                Modal_Fun.init('抱歉，未找到您之前预习过的课件！', 1);
                                return false;
                            } else {
                                window.open("/WebNew/user/previewReview/preview.aspx?clid=" + dataClid + "&sid=" + dataSid + "&uid=" + dataUid + "&enter=3", "_parent");
                            }
                        } else {
                            Modal_Fun.init('您这节课已缺席，没有可预习的课件！', 1);
                        }
                    }; break;
                }
            });
            //我的课表入口&enter=3 课后复习 
            $(".btn-ClassAfterReview").click(function () {
                //仅预复习用。 1000：等待上课；1001：正常上完的课；1002：缺席，包括主动缺席和被动缺席
                var dataClid = $(this).attr("data-clid");
                var dataSid = $(this).attr("data-sid");
                var dataUid = $(this).attr("data-uid");
                var isGameOver = $(this).attr("data-isover");
                var lstPrev = $(this).attr("data-lessonStatusForPrev");
                switch (lstPrev) {
                    case "1000": {
                        //未上完课无法复习
                        Modal_Fun.init('请上完当前课再复习！', 1);
                    }; break;
                    case "1001": {
                        var res = Fn.User.GetExercises(dataSid, 2);
                        var resKlg = Fn.User.GetKnowledgeReview(dataSid, 2);
                        if (resKlg.Code == 0 || (resKlg.Code == 1 && resKlg.Data.length == 0)) {
                            if (res.Code == 0 || (res.Code == 1 && res.Data.length == 0)) {
                                Modal_Fun.init('抱歉，未找到可供复习的课件！', 1);
                                return false;
                            }
                        }
                        //跳转到课后复习
                        window.open("/WebNew/user/previewReview/review.aspx?clid=" + dataClid + "&sid=" + dataSid + "&uid=" + dataUid + "&enter=3", "_parent");
                    }; break;
                    case "1002": {
                        Modal_Fun.init('您这节课已缺席，没有可复习的课件！', 1);
                    }; break;
                }
            });
            //----end 预复习--

            //评价
            $(".open-rate-modal").click(function () {
                var clid = $(this).attr("data-id");
                var tuid = $(this).attr("data-tuid");
                var tool = $(this).attr("data-tool");
                $("#tool").addClass("data-tool", tool);
                $("#tool").html(tool);
                ShowNoCommentModel(Fn.Course.GetCommentLesson(clid), "search");
            });
            $(".open-edit-rate-modal").click(function () {
                var clid = $(this).attr("data-id");
                var tuid = $(this).attr("data-tuid");
                var tool = $(this).attr("data-tool");
                $("#tool").addClass("data-tool", tool);
                $("#tool").html(tool);
                ShowNoCommentModel(Fn.Course.GetCommentLesson(clid), "edit");
            });
            $(".open-add-rate-modal").click(function () {
                var clid = $(this).attr("data-id");
                var tuid = $(this).attr("data-tuid");
                var tool = $(this).attr("data-tool");
                $("#tool").addClass("data-tool", tool);
                $("#tool").html(tool);
                ShowNoCommentModel(Fn.Course.GetCourseLessonByCLID(clid), "addNo");
            });
            //取消课程
            $(".btn-cancel").click(function () {
                $(this).attr("disabled", true).find("i").addClass("fa-spinner fa-spin");
                if (confirm("取消后您可能无法再次预约到此时间，您确定要取消该课程吗？")) {
                    var clid = $(this).attr("data-id");
                    var r = Fn.Course.CancelMyClass(clid, "WEBCANCEL");
                    if (r.code == "success") {
                        Modal_Fun.init('取消成功！', 1);
                        MyClassFun.GetLessonList(Config.CurrentTime);
                    } else {
                        Modal_Fun.init(r.msg + "(错误代码[" + r.code + "])", 1);
                    }
                }
                $(this).removeAttr("disabled").find("i").removeClass("fa-spinner fa-spin");
            });
            //我要缺席
            $(".btn-Absent").click(function () {
                var Dq = $(this);
                Dq.attr("disabled", true)
                $(this).attr("disabled", true).find("i").addClass("fa-spinner fa-spin");
                var clid = $(this).attr("data-id");
                //var tipsType2 = '<img class="tipsType" src="https://img.acadsoc.com.cn/web/img/tipsType-success.png"/>';
                //mconfirm("该节课距离开课时间已不足3小时，无法取消。缺席本节课，系统将通知老师并扣除掉您该节课时？", tipsType2, ['确定缺席', '暂不缺席'], function (y)
                //{
                //    if (y.index == 0)
                //    {

                //    } else { }

                //});
                var absenthtml = "该节课距离开课时间已不足3小时，无法取消。<span class='text-danger'>缺席本节课，系统将通知老师并扣除掉您该节课时。</span>";
                Modal_Fun.init(absenthtml, 2);
                $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                    if ($('#Modal_Fun_room').attr("data-action") == "true") {
                        var r = Fn.Course.EndAbsentClass(clid, 1);
                        if (r == 0) {
                            alert('缺席成功！');
                            //刷新
                            window.location.reload();
                        } else {
                            alert('缺席失败，请确定课程信息。重新尝试！');
                        }
                    }
                });
                //if (confirm("该节课距离开课时间已不足3小时，无法取消。<br><strong>缺席本节课，系统将通知老师并扣除掉您该节课时？</strong>")) {

                //    var r = Fn.Course.EndAbsentClass(clid,2);
                //    if (r == 0)
                //    {
                //        alert('缺席成功！');
                //    } else
                //    {
                //        alert('缺席失败，请确定课程信息。重新尝试！');
                //    }
                //    //刷新
                //    window.location.reload();
                //} else {
                //    //$('.loding').hide();
                //}
                $(this).removeAttr("disabled").find("i").removeClass("fa-spinner fa-spin");
            });
            //求救
            $(".open-shit-modal").click(function () {
                $("#shit_modal").remove();
                var clid = $(this).attr("data-id");
                if ($("#shit_modal").length == 0) {
                    var modal = '<div class="modal fade" id="shit_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                        '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>' +
                        '<h4 class="modal-title">我的课出现问题，需要帮助（课节序号' + clid + '）</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '<div class="control-group clearfix">' +
                        '<label class="col-md-3"><strong>问题状况：</strong></label>' +
                        '<div class="col-md-9">' +
                        '<select class="form-control login-field" name="shit_status"><option value="">请选择你遇到的状况</option><option value="1">老师没来上课</option><option value="2">网络问题听不清楚</option><option value="3">老师断线</option><option value="4">进不了课室</option></select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="control-group clearfix">' +
                        '<label class="col-md-3"><strong>描述问题：</strong></label>' +
                        '<div class="col-md-9" style="word-wrap:break-word;"><textarea class="form-control login-field" name="shit_msg"></textarea></div>' +
                        '</div>' +
                        '<div class="control-group clearfix">' +
                        '<div class="col-md-9 col-md-offset-3"><button type="button" data-id="' + clid + '" onclick="MyClassFun.SubmitShit(this)" class="btn btn-primary">提交问题</button></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' //modal-content
                        +
                        '</div>' //modal-dialog
                        +
                        '</div>'; //modal
                    $("body").append(modal);
                } else {
                    $("#shit_modal [name='clid']").val(clid);
                };
                $("#shit_modal").modal("show");
            });
            //查看求救
            $(".AlertCircumstance").click(function () {
                $("#circumstance_modal").remove();
                var clid = $(this).attr("data-id");
                var res = Fn.Course.GetStudentLessonWarningByCLID(clid);
                var modal = '<div class="modal fade" id="shit_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>' +
                    '<h4 class="modal-title">上课出现问题（课节序号' + clid + '）</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="control-group clearfix">' +
                    '<input type="hidden"  name="clid"  value="' + clid + '"/>' +
                    '<label class="col-md-3"><strong>上课工具：</strong></label>' +
                    '<div class="col-md-9">' + res.classtool + '</div>' +
                    '</div>'

                    +
                    '<div class="control-group clearfix">' +
                    '<input type="hidden" name="clid" value="' + clid + '"/>' +
                    '<label class="col-md-3"><strong>问题状况：</strong></label>' +
                    '<div class="col-md-9" style="word-wrap:break-word;">' + res.circumstance + '</div>' +
                    '</div>' +
                    '<div class="control-group clearfix">' +
                    '<label class="col-md-3"><strong>描述问题：</strong></label>' + '<div class="col-md-9" style="word-wrap:break-word;">' + (res.desc != "" ? res.desc : "空") + '</div></div>' +
                    '<div class="control-group clearfix">' +
                    '<div class="col-md-9 col-md-offset-3"><button class="btn btn-default" data-dismiss="modal" type="button">确定</button></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' //modal-content
                    +
                    '</div>' //modal-dialog
                    +
                    '</div>'; //modal
                $(modal).appendTo("body").modal("show");
            });

            //问题反馈
            $(".open-shit-modal2").click(function () {
                //$("#shit_modal2").remove();
                $("#didiTeacher").remove();
                var clid = $(this).attr("data-id");
                var html = "";
                if ($("#didiTeacher").length == 0) {
                    //                    var modal = '<div class="modal fade" id="shit_modal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                    //                        '<div class="modal-dialog">' +
                    //                        '<div class="modal-content" style="height:550px">' +
                    //                        '<div class="modal-header">' +
                    //                        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>' +
                    //                        '<h4 class="modal-title">上课期间遇到问题，需要帮助（课节序号' + clid + '）</h4>' +
                    //                        '</div>' +
                    //                        '<div class="modal-body"><strong class="text-danger">方法1：</strong>' +
                    //                        '<form id="problemfeedbackform" method="POST" enctype="multipart/form-data">' +
                    //                        '<h5 style="color:#31708f">温馨提示：建议耐心等待一下下哦，老师可能正在赶来的路上，若超过5分钟还未正常开课，请于下面提交情况.</h5>' +
                    //                        '<div class="control-group clearfix">' +
                    //                        '<label class="col-md-3"><strong>问题状况：</strong></label>' +
                    //                        '<div class="col-md-9">' +
                    //                        '<select class="form-control login-field" name="type"><option value="">请选择类型</option><option value="1">老师没来</option><option value="2">网络中断/卡顿影响上课</option></select>' +
                    //                        '</div>' +
                    //                        '</div>' +
                    //                        '<div class="control-group clearfix">' +
                    //                        '<label class="col-md-3"><strong>反馈证据：</strong></label>' +
                    //                        '<div class="col-md-9">' +
                    //                        '<table style=" width:100%;">' +
                    //                        '<tr>' +
                    //                        '<td>' +
                    //                        '<div class="fileupload-buttonbar" >' +
                    //                        '<span class="fileinput-button"> <input type="file" name="feedbackfile" multiple="" style=" width:175px;"> </span>' +
                    //                        '</div>' +
                    //                        '</td>' +
                    //                        '<td><span style="color:#999;">(请上传截图，支持jpg、png)</span></td>' +
                    //                        '</tr>' +
                    //                        '</table>' +
                    //                        '</div>' +
                    //                        '</div>' +
                    //                        '<div class="control-group clearfix">' +
                    //                        '<label class="col-md-3"><strong>内容描述：</strong></label>' +
                    //                        '<div class="col-md-9"><textarea class="form-control login-field" name="desc"></textarea></div>' +
                    //                        '</div>' +
                    //                        '</form>' +
                    //                        '</div>' + //modal-body
                    //                        '<div class="control-group clearfix">' +
                    //                        '<div class="col-md-12">' +
                    //                        '<p style="margin-top: 10px!important;color:#999; font-size: 12px; padding: 0 10px!important;margin-top:-15px!important; margin-bottom:10px!important;"><span style="color:#ed6b75;">*</span> 注意：请尽量上传图片依据，或描述清楚情况，帮助工作人员尽快核实查证，我们会于24小时内联系您进行处理。感谢您的支持与合作。</p>' +
                    //                        '</div>' +
                    //                        '<div class="col-md-8 col-md-offset-4"><button type="button" data-id="' + clid + '" onclick="MyClassFun.SubmitShit2(this)" class="btn btn-primary margin-bottom10" >提交反馈</button></div>' +
                    //                        '</div>' +
                    //                        '<div class="modal-body"><strong class="text-danger">方法2：</strong>'+
                    //                        '<form>'+
                    //                        '<h5 style="color:#31708f">温馨提示：您可以选择更换老师，相应的上课时间也会往后延迟。前提是您下一个时间点无课程安排！</h5>' +
                    //                        '<div class="changetutor">' +
                    //                        '<div class="col-md-8 col-md-offset-4"><button type="button" data-id="' + clid + '" onclick="MyClassFun.ChangeOtherTutor(this)" class="btn btn-success margin-bottom10" >更换老师</button></div>' +
                    //                        '</div>' +
                    //                        '</form></div>'+
                    //                        '</div>' //modal-content
                    //                        +
                    //                        '</div>' //modal-dialog
                    //                        +
                    //                        '</div>'; //modal
                    //判断UID能不能显示更换老师


                    html = '<div class="modal fade" id="didiTeacher" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                        '    <div class="modal-dialog">' +
                        '        <div class="modal-content">' +
                        '            <div class="modal-header">' +
                        '                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                        '                <h4 class="modal-title" >上课期间遇到问题，需要帮助</h4>' +
                        '            </div>' +
                        '            <div class="modal-body">' +
                        '               <div class="start hidden">' +
                        '                   <p class="p1"><strong>温馨提示：</strong>亲爱的学员，请耐心等待一下哦，开课3~10分钟内，若还未正常上课，您有一次【更换老' +
                        '师】的机会，更换的老师为<strong>系统匹配的当前时段有时间的老师</strong>，原课时将取消自动返还，更换老师的课' +
                        '时将免费赠送给您，若介意也可以直接<strong>提交反馈</strong>。</p>' +
                        '                   <img class="teacher-img" src="//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-befor.png"  data-id="' + clid + '" onclick="MyClassFun.NewChangeTeacher(this)">' +
                        '                   <a class="submit-btn" onclick="$(this).parent(\'.start\').addClass(\'hidden\').siblings(\'#didiTeacher .upload\').removeClass(\'hidden\')">提交反馈 >></a>' +
                        '               </div>' +
                        '                <div class="upload-success hidden">' +
                        '                    <p class="p1"><strong>温馨提示：</strong>亲爱的学员，请耐心等待一下哦，开课3~10分钟内，若还未正常上课，您有一次【更换老' +
                        '师】的机会，更换的老师为<strong>系统匹配的当前时段有时间的老师</strong>，原课时将取消自动返还，更换老师的课' +
                        '时将免费赠送给您，若介意也可以直接<strong>提交反馈</strong>。</p>' +
                        '                    <img class="upload-success-img" src="//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-upload-success-img.png">' +
                        '                    <p class="p2">您已提交反馈，无法更换老师，请等待核实，<br>' +
                        '                        我们会于24h内为您处理~</p>' +
                        '                    <a class="submit-btn disble" >提交反馈 >></a>' +
                        '                </div>' +
                        '                <div class="upload">' +
                        '        <form id="problemfeedbackform" method="POST" enctype="multipart/form-data">' +
                        '            <p class="p1">' +
                        '                <strong>温馨提示：</strong>请耐心等待一下下哦，老师可能正在赶来的路上，建议若超过5分钟还' +
                        '                未正常开课，请于下面提交情况。' +
                        '            </p>' +
                        '            <table>' +
                        '                <tr>' +
                        '                    <td>问题状况：</td>' +
                        '                    <td>' +
                        '        <select class="form-control login-field" name="type">' +
                        '        <option value="">请选择类型</option>' +
                        '        <option value="1">老师没来</option>' +
                        '        <option value="2">网络中断/卡顿影响上课</option>' +
                        '        </select>' +
                        '                    </td>' +
                        '                </tr>' +
                        '                <tr>' +
                        '                    <td>反馈证据：</td>' +
                        '                        <td>' +
                        '                            <div class="fileupload-buttonbar">' +
                        '                                <span class="fileinput-button"> <input type="file" name="feedbackfile" multiple="" style=" width:175px;"> </span>' +
                        '                            </div>' +
                        '                        </td>' +
                        '                        <td><span style="color:#999;">(请上传截图，支持jpg、png)</span></td>' +
                        '                </tr>' +
                        '                <tr>' +
                        '                    <td>内容描述：</td>' +
                        '                    <td>' +
                        '                        <textarea placeholder="请选择类型" name="desc"></textarea>' +
                        '                    </td>' +
                        '                </tr>' +
                        '            </table>' +
                        '            <p class="p2">' +
                        '                <strong>注意：</strong>请尽量上传图片依据，或描述清楚情况，帮助工作人员尽快核实查证，我们会于24小时' +
                        '                内联系您进行处理，感谢您的支持与合作' +
                        '            </p>' +
                        '            <a class="submit-btn" data-id="' + clid + '" onclick="MyClassFun.NewSubmitShit2(this)">提交反馈 >></a>' +
                        '        </form>' +
                        '                </div>' +
                        '                <div class="matching hidden">' +
                        '                    <p class="p1"><strong>温馨提示：</strong>亲爱的学员，请耐心等待一下哦，开课3~10分钟内，若还未正常上课，您有一次【更换老' +
                        '师】的机会，更换的老师为<strong>系统匹配的当前时段有时间的老师</strong>，原课时将取消自动返还，更换老师的课' +
                        '时将免费赠送给您，若介意也可以直接<strong>提交反馈</strong>。</p>' +
                        '                    <img class="matching-img" src="//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-matching.png">' +
                        '                    <p class="p2">正在为您匹配合适的老师...</p>' +
                        '                    <p class="p3"><span id="matching-time">60</span>s</p>' +
                        '                </div>' +
                        '                <div class="match-lose hidden">' +
                        '                    <p class="p1"><strong>温馨提示：</strong>亲爱的学员，请耐心等待一下哦，开课3~10分钟内，若还未正常上课，您有一次【更换老' +
                        '师】的机会，更换的老师为<strong>系统匹配的当前时段有时间的老师</strong>，原课时将取消自动返还，更换老师的课' +
                        '时将免费赠送给您，若介意也可以直接<strong>提交反馈</strong>。</p>' +
                        '                    <img class="nofit-img" src="//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-nofit.png">' +
                        '                    <p class="p2">抱歉，当前无合适的老师可以更换<br>' +
                        '                        您可以直接提交反馈</p>' +
                        '                    <a  onclick="$(this).parent(\'.match-lose\').addClass(\'hidden\').siblings(\'#didiTeacher .upload\').removeClass(\'hidden\')" class="submit-btn">提交反馈 >></a>' +
                        '                </div>' +
                        '                <div class="match-success hidden">' +
                        '                    <p class="p1"><strong>温馨提示：</strong>亲爱的学员，请耐心等待一下哦，开课3~10分钟内，若还未正常上课，您有一次【更换老' +
                        '师】的机会，更换的老师为<strong>系统匹配的当前时段有时间的老师</strong>，原课时将取消自动返还，更换老师的课' +
                        '时将免费赠送给您，若介意也可以直接<strong>提交反馈</strong>。</p>' +
                        '                    <img class="matchSuccess-img" src="//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-match-success.png"  onclick=" alert(\'还剩0次更换老师机会\')">' +
                        '                    <a class="submit-btn" onclick="$(this).parent(\'.match-success\').addClass(\'hidden\').siblings(\'#didiTeacher .upload\').removeClass(\'hidden\')">提交反馈 >></a>' +
                        '                    <table id="NewTeacherCH" class="table table-bordered">' +
                        '                        <tr>' +
                        '                            <td>上课时间</td>' +
                        '                            <td>上课老师</td>' +
                        '                            <td>上课工具</td>' +
                        '                            <td>教室入口</td>' +
                        '                        </tr>' +
                        '                    </table>' +
                        '                </div>' +
                        '            </div>' +
                        '        </div>' +
                        '    </div>' +
                        '</div>';
                    $("body").append(html);
                } else {
                    $("#didiTeacher [name='clid']").val(clid);
                };
                //判断有没更换过老师
                var dd = Fn.Course.GetDiDiTutor(clid);

                //计算课程时间和当前时间差是否有十分钟以上或者三分钟之内
                var time = $(this).attr("name");
                var stime = Date.parse(new Date(time));
                var now = (new Date().valueOf());

                var Overtime = (now - stime) - 600000; //十分钟
                var OvertimeTwo = (now - stime) - 180000; //三分钟
                //alert(stime+","+now+","+Overtime+","+OvertimeTwo);
                //滴滴学生列表
                var uids = ["10018", "792820", "287451", "792818", "802414"];
                var IsShow = 0;
                for (var i = 0; i < uids.length; i++) {
                    if (uids[i] == Config.UID) {
                        IsShow = 1
                        break;
                    }
                }
                if (IsShow == 1) {
                    $('#didiTeacher .upload').addClass('hidden');
                    $('#didiTeacher .start').removeClass('hidden');
                }
                //三分钟之内
                if (OvertimeTwo < 0) {
                    $("#didiTeacher .teacher-img").attr('src', "//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-match-success.png");
                    $("#didiTeacher .teacher-img").removeAttr('onclick');
                }
                //超过三分钟并且小于十分钟
                if (OvertimeTwo > 0 && Overtime < 0) {
                    $("#didiTeacher .teacher-img").attr('src', "//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-befor.png");
                    $("#didiTeacher .teacher-img").attr('onclick', 'MyClassFun.NewChangeTeacher(this)');
                }

                //超过十分钟
                if (Overtime > 0) {
                    $("#didiTeacher .teacher-img").attr('src', "//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-match-success.png");
                    $("#didiTeacher .teacher-img").removeAttr('onclick');
                }

                if (!jQuery.isEmptyObject(dd)) {
                    //显示抢单数据
                    //                    $(".changetutor").children().remove();
                    //                    var html='<table class="table table-striped table-bordered table-hover">'+
                    //                            '<thead><tr><th>老师</th><th>上课时间</th><th>上课工具</th><th>教室入口</th></tr></thead>'+
                    //                            '<tbody><tr>'+
                    //                            '<td>' + dd.FullName + '</td>'+
                    //                            '<td>' + dd.StartTime + '</td>'+
                    //                            '<td>' + dd.toolimg + '</td>'+
                    //                            '<td>' + dd.classtool + '</td>'+
                    //                            '</tr></tbody></table>';
                    //                    $(".changetutor").html(html);

                    var html = '<tr class="active">' +
                        '                            <td>' + dd.StartTime + '</td>' +
                        '                            <td>' + dd.FullName + '</td>' +
                        '                            <td>' + dd.toolimg + '</td>' +
                        '                            <td>' + dd.classtool + '</td>' +
                        '                        </tr>';
                    //$('#didiTeacher .upload').addClass('hidden');

                    $("#NewTeacherCH").append(html);
                    $('#didiTeacher .start').addClass('hidden');
                    $('#didiTeacher .match-success').removeClass('hidden');
                    $("#didiTeacher").modal("show");

                    //$("#shit_modal2 .modal-content").height(600);
                }
                $("#didiTeacher").modal("show");

                //$("#shit_modal2").modal("show");

            });
            //查看问题反馈
            $(".looklessonproblem").click(function () {
                $("#looklessonproblem_modal").remove();
                var clid = $(this).attr("data-id");
                var res = Fn.Course.GetStudentLessonProblemByCLID(clid);
                var dd = Fn.Course.GetDiDiTutor(clid);
                var modal = '<div class="modal fade" id="looklessonproblem_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>' +
                    '<h4 class="modal-title">上课出现问题（课节序号' + clid + '）</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div id="Ngp" class="control-group clearfix">' +
                    '<input type="hidden" name="clid" value="' + clid + '"/>' +
                    '<label class="col-md-3"><strong>问题状况：</strong></label>' +
                    '<div class="col-md-9">' + res.type + '</div>' +
                    '</div>' +
                    '<div class="control-group clearfix">' +
                    '<label class="col-md-3"><strong>描述问题：</strong></label>' + '<div class="col-md-9" style="word-wrap:break-word;">' + (res.desc != "" ? res.desc : "空") + '</div></div>' +
                    '<div class="control-group clearfix">' +
                    '<label class="col-md-3"><strong>反馈证据：</strong></label>' + '<div class="col-md-9"><img src="' + res.img + '" width="400"></div></div>' +
                    '<div class="control-group clearfix">' +
                    '<div class="col-md-9 col-md-offset-3"><button class="btn btn-default" data-dismiss="modal" type="button">确定</button></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' //modal-content
                    +
                    '</div>' //modal-dialog
                    +
                    '</div>'; //modal

                var html = "";
                $(modal).appendTo("body").modal("show");
                if (!jQuery.isEmptyObject(dd)) {
                    html = '<div class="control-group clearfix">' +
                        '            <label class="col-md-3"><strong>更换老师：</strong></label>' +
                        '            <div class="col-md-3">' + dd.FullName + '</div>' +
                        '            <div class="col-md-1">' + dd.toolimg + '</div>' +
                        '            <div class="col-md-5">' + dd.StartTime + '</div>' +
                        '        </div>';
                    $(html).insertBefore("#Ngp");
                }
            });


            //老师评价 弹出课程描述
            $(".open-class-Meno").on("click", function () {
                $("#class_meno_modal").remove();
                var usid = $(this).attr("data-id");
                var res = Fn.User.GetTutorClassRemark(usid);

                if (res != null) {
                    var modal = '<div class="modal" id="class_meno_modal" aria-hidden="false">' +
                        '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<button data-dismiss="modal" class="close" type="button">' +
                        '<span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>' +
                        '<h4 class="modal-title">上课评价</h4>' +
                        '</div>' +
                        '<div class="modal-body" style="max-height:500px; overflow-x: hidden; overflow-y: scroll">';
                    $.each(res, function (k, y) {
                        var item = "";
                        if (!jQuery.isEmptyObject(y.TestScore))
                            item = '<div class="control-group"><label class="control-label">测试正确率：</label>' + y.TestScore + ' %</div>';
                        modal += '<div class="panel panel-primary lp-item view-feedbacks"><div aria-controls="collapseOne" aria-expanded="true" href="#panel-' + (k + 1) + '" data-parent="#accordion" data-toggle="collapse" class="panel-heading collapsed">' +
                            '<h4 class="panel-title">' +
                            '<span class="fa fa-chevron-down"></span>&nbsp;<strong>课节 ' + (k + 1) + '</strong>' +
                            '</h4>' +
                            '</div>' +
                            '<div aria-labelledby="headingOne" role="tabpanel" class="panel-collapse collapse" id="panel-' + (k + 1) + '" style="height: 0px;">' +
                            '<div class="panel-body">' +
                            '<div class="control-group"><label class="control-label">老师名：</label>' + y.tutor + '</div>' +
                            '<div class="control-group"><label class="control-label">上课工具：</label>' + y.classtool + '</div>' +
                            '<div class="control-group"><label class="control-label">上课时间：</label>' + y.classtime + '</div>' + item +
                            '<div class="tabbable tabbable-custom">' +
                            '    <ul class="nav nav-tabs">' +
                            '       <li class="active" style="width:auto;">' +
                            '           <a data-toggle="tab" href="#tab_meno_1_' + (k + 1) + '">' +
                            '           老师评价</a>' +
                            '       </li>' +
                            '       <li style="width:auto;">' +
                            '           <a data-toggle="tab" href="#tab_meno_2_' + (k + 1) + '">' +
                            '           课堂词汇</a>' +
                            '       </li>' +
                            '       <li style="width:auto;">' +
                            '           <a data-toggle="tab" href="#tab_meno_3_' + (k + 1) + '">' +
                            '           课堂纠错</a>' +
                            '       </li>' +
                            '   </ul>' +
                            '   <div class="tab-content">' +
                            '       <div id="tab_meno_1_' + (k + 1) + '" class="tab-pane fontawesome-demo active" style="word-wrap:break-word;" ><p>' + y.description + '</p></div>' +
                            '       <div id="tab_meno_2_' + (k + 1) + '" class="tab-pane fontawesome-demo" style="word-wrap:break-word;"><p>' + y.vocabularies + '</p></div>' +
                            '       <div id="tab_meno_3_' + (k + 1) + '" class="tab-pane fontawesome-demo" style="word-wrap:break-word;"><p>' + y.sentences + '</p></div>' +
                            '   </div>' +
                            '</div></div></div></div>';
                        teacherCommentPC(y.clid, y.tutor, y.classtool, y.classtime);
                    })
                    modal += '</div></div></div>';
                    $(modal).appendTo("body").modal("show");
                    $("#class_meno_modal .view-feedbacks").first().find(".panel-heading").trigger("click");
                } else {
                    Modal_Fun.init("对不起，暂无老师评价！", 1);
                }
            });
            //打赏老师（按课程打赏）
            $(".MylessonsAReward").on("click", function () {
                $("#Modal_Terur .Play_txt").text($(this).parent().parent().find("td").eq(2).text() || $(this).parent().parent().parent().prev().find("div.row.mylesson-m-cen>div").eq(1).find("span").text())
                $("#btnRewardSubmit").attr("data-clid", $(this).attr("data-clid"));
                $("#btnRewardSubmit").attr("data-tuid", $(this).attr("data-tuid"));
                var TutorImg = CDNUrl + "/web/webnew/assets/admin/pages/img/Tutor_Nv.png";
                if ($(this).attr("data-sex") == "1")
                    TutorImg = CDNUrl + "/web/webnew/assets/admin/pages/img/Tutor_Man.png";
                $("#TutorImg").attr("src", TutorImg);
            });
        },
        EditClassTool: function (obj, tuid, tools) {
            $(obj).attr("disabled", "true");
            var uid = $(obj).attr("data-uid");
            var flag = Fn.Course.IsShenZ(uid);
            if (flag == "True") {
                Modal_Fun.init("<font color='red'>更换工具失败：当前教材只支持ClassIn上课无法更换其他上课工具，请见谅！</font>", 1);
                $(obj).removeAttr("disabled");
                return;
            }
            var rn = Fn.Course.GetNewTutorClassTool(tuid);
            if (rn != null && rn != "") {
                $.ajax({
                    url: "/Ajax/NewUserAjax.ashx?method=getclasstool",
                    type: "POST",
                    dataType: "json",
                    data: {
                        "COID": $(obj).attr("data-coid"),
                        classTool: rn
                    },
                    success: function (res) {
                        $(obj).removeAttr("disabled");
                        res = eval(res);
                        var classToolHtml = "请选择上课工具:<select id='editClassToolSelect'>";
                        var SelTool = "";
                        for (var i = res.length - 1; i >= 0; i--) {
                            SelTool = "";
                            if (tools == res[i].value)
                                SelTool = "selected";
                            classToolHtml += "<option value='" + res[i].value + "' " + SelTool + ">" + res[i].text + "</option>";
                        }
                        classToolHtml += "</select><br><br><br><small class=\"text-danger\">温馨提示：<br>课前1小时外可修改，1小时内不可修改。</small>";

                        Modal_Fun.init(classToolHtml, 2);

                        $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                            if ($('#Modal_Fun_room').attr("data-action") == "true") {
                                var classtool = $("#editClassToolSelect").val();
                                var clid = $(obj).attr("data-clid");
                                $.ajax({
                                    url: "/Ajax/NewUserAjax.ashx?method=changetutorclassTool",
                                    type: "POST",
                                    dataType: "json",
                                    data: {
                                        "clid": clid,
                                        tool: classtool
                                    },
                                    success: function (res) {
                                        if (res == 1 || res == "1") {
                                            Modal_Fun.init("修改上课工具成功!", 1);
                                            $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                                                MyClassFun.GetLessonList(Config.CurrentTime);
                                            });
                                        } else if (res == -99) {
                                            Modal_Fun.init("修改上课工具失败!只能在课前1小时之前修改", 1);
                                        } else {
                                            Modal_Fun.init("修改上课工具失败!", 1);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        },
        //提交求救
        SubmitShit: function (obj) {
            var form = $("#shit_modal");
            var clid = $(obj).attr("data-id");
            var status = form.find("[name=shit_status]  option:selected").val();
            var msg = form.find("[name=shit_msg]").val();
            if (clid == "") {
                Modal_Fun.init("数据出错！", 1);
                return false;
            }

            if (status == "") {
                Modal_Fun.init("请选择问题状况！", 1);
                return false;
            }

            var i = Fn.Course.StudentsFofHelp(clid, status, msg);
            if (i > 0) {
                Modal_Fun.init("您的问题已经提交，客服很快帮你解决问题，请稍等。", 1, true)
            } else {
                Modal_Fun.init("操作失败！", 1);
            }
        },
        SubmitShit2: function (obj) {
            //var form = $("#shit_modal");
            //var clid = $(obj).attr("data-id");
            //var status = form.find("[name=shit_status]  option:selected").val();
            //var msg = form.find("[name=shit_msg]").val();


            //var i = Fn.Course.StudentsFofHelp(clid, status, msg);
            //if (i > 0) {
            //	Modal_Fun.init("您的问题已经提交，客服很快帮你解决问题，请稍等。", 1, true)
            //} else {
            //	Modal_Fun.init("操作失败！", 1);
            //}
            var form = $("#problemfeedbackform");
            var clid = $(obj).attr("data-id");
            if (clid == "") {
                Modal_Fun.init("数据出错！", 1);
                return false;
            }

            var type = form.find("[name=type]  option:selected").val();

            if (type == "") {
                Modal_Fun.init("请选择问题状况！", 1);
                return false;
            }

            var file = form.find("[name=feedbackfile]").val();
            var desc = form.find("[name=desc]").val().trim();

            if (file == "" && desc == "") {

                Modal_Fun.init("反馈证据和内容描述必须填写其中一项", 1);
                return false;

            }



            var option = {
                dataType: "json",
                data: { __: "StudentsForProblem", clid: clid },
                url: '/Ajax/Web.UI.Fun.Course.aspx',
                beforeSubmit: function () {

                },
                success: function (result) {
                    var data = result.value;
                    if (data > 0) {
                        Modal_Fun.init("您的问题已经提交，客服很快帮你解决问题，请稍等。", 1, true);
                    } else {
                        Modal_Fun.init("操作失败！", 1);
                        return false;
                    }
                },
                error: function (result) {
                    //bootbox.alert(data.msg);
                    return false;
                }
            };
            form.ajaxSubmit(option);
        },
        //新版提交反馈
        NewSubmitShit2: function (obj) {
            var form = $("#problemfeedbackform");
            var clid = $(obj).attr("data-id");
            if (clid == "") {
                Modal_Fun.init("数据出错！", 1);
                return false;
            }
            var type = form.find("[name=type]  option:selected").val();
            if (type == "") {
                Modal_Fun.init("请选择问题状况！", 1);
                return false;
            }
            var file = form.find("[name=feedbackfile]").val();
            var desc = form.find("[name=desc]").val().trim();

            if (file == "" && desc == "") {
                Modal_Fun.init("反馈证据和内容描述必须填写其中一项", 1);
                return false;
            }
            $(obj).attr("disabled", true);
            $(obj).css("pointer-events", "none");
            var option = {
                dataType: "json",
                data: { __: "StudentsForProblem", clid: clid },
                url: '/Ajax/Web.UI.Fun.Course.aspx',
                beforeSubmit: function () {

                },
                success: function (result) {
                    $(obj).attr("disabled", true);
                    $(obj).css("pointer-events", "auto");
                    var data = result.value;
                    if (data > 0) {
                        Modal_Fun.init("您的问题已经提交，客服很快帮你解决问题，请稍等。", 1);
                        $("#didiTeacher").modal("hide");
                        //$('#didiTeacher .upload').addClass('hidden');
                        //$('#didiTeacher .upload-success').removeClass('hidden');
                        MyClassFun.GetLessonList(Config.CurrentTime);
                    } else if (data == -1) {
                        Modal_Fun.init("文件类型错误或者文件太大了！", 1);
                        return false;
                    } else if (data == -2) {
                        Modal_Fun.init("课程不存在！", 1);
                        return false;
                    } else if (data == -3) {
                        Modal_Fun.init("只能在上课后和课程24h前反馈！", 1);
                        return false;
                    } else {
                        Modal_Fun.init("操作失败！", 1);
                        return false;
                    }
                },
                error: function (result) {
                    //bootbox.alert(data.msg);
                    return false;
                }
            };
            form.ajaxSubmit(option);
        },
        NewPictureUp: function (obj) {
            var userAgent = navigator.userAgent; //用于判断浏览器类型
            //获取选择图片的对象
            var docObj = $(obj)[0];
            var picDiv = $(obj).parents(".picDiv");
            //得到所有的图片文件
            var fileList = docObj.files;
            //循环遍历
            for (var i = 0; i < fileList.length; i++) {
                //动态添加html元素
                var picHtml = "<div class='imageDiv' > <img id='img" + fileList[i].name + "' /> <div class='cover'><i class='delbtn'>删除</i></div></div>";
                // console.log(picHtml);
                picDiv.prepend(picHtml);
                //获取图片imgi的对象
                var imgObjPreview = document.getElementById("img" + fileList[i].name);
                if (fileList && fileList[i]) {
                    //图片属性
                    imgObjPreview.style.display = 'block';
                    imgObjPreview.style.width = '60px';
                    imgObjPreview.style.height = '60px';
                    //imgObjPreview.src = docObj.files[0].getAsDataURL();
                    //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要以下方式
                    if (userAgent.indexOf('MSIE') == -1) {
                        //IE以外浏览器
                        imgObjPreview.src = window.URL.createObjectURL(docObj.files[i]); //获取上传图片文件的物理路径;
                        // console.log(imgObjPreview.src);
                        // var msgHtml = '<input type="file" id="fileInput" multiple/>';
                    } else {
                        //IE浏览器
                        if (docObj.value.indexOf(",") != -1) {
                            var srcArr = docObj.value.split(",");
                            imgObjPreview.src = srcArr[i];
                        } else {
                            imgObjPreview.src = docObj.value;
                        }
                    }
                }
            }
        },
        //更换老师
        ChangeOtherTutor: function (obj) {
            var clid = $(obj).attr("data-id");
            if (clid == "") {
                Modal_Fun.init("数据出错！", 1);
                return false;
            }
            var res = Fn.Course.ChangeOtherTutor(clid);
            if (res) {
                if (res.code == 1 || res.code == -94) {
                    //倒计时1min
                    clearInterval(countInterval);
                    clearTimeout(countInterval)
                    var countDown = 60;
                    $(obj).addClass("disabled").append("<span class='append-count'>&nbsp;(<span class='count-down'>" + countDown + "</span>)</span>").unbind("click").attr("disabled", true);
                    var countInterval = setInterval(function () {
                        countDown--;
                        $(".count-down").text(countDown);
                        if (countDown == 0) {
                            $(obj).removeClass("disabled").attr("disabled", false);
                            $(".append-count").remove();
                            clearInterval(countInterval);
                        };
                        //实时抓取数据
                        if (countDown % 5 == 0) {
                            var dd = Fn.Course.GetDiDiTutor(clid);
                            if (!jQuery.isEmptyObject(dd)) {
                                //去除倒计时
                                $(obj).removeClass("disabled").attr("disabled", false);
                                $(".append-count").remove();
                                clearInterval(countInterval);
                                //显示抢单数据
                                $(".changetutor").children().remove();
                                var html = '<table class="table table-striped table-bordered table-hover">' +
                                    '<thead><tr><th>老师</th><th>上课时间</th><th>上课工具</th><th>教室入口</th></tr></thead>' +
                                    '<tbody><tr>' +
                                    '<td>' + dd.FullName + '</td>' +
                                    '<td>' + dd.StartTime + '</td>' +
                                    '<td>' + dd.toolimg + '</td>' +
                                    '<td>' + dd.classtool + '</td>' +
                                    '</tr></tbody></table>';
                                $(".changetutor").html(html);
                                $("#shit_modal2 .modal-content").height(600);
                            } else if (countDown == 0) {
                                Modal_Fun.init("暂无其他老师，您可选择提交反馈。", 1);
                                return false;
                            }
                        }
                    }, 1000);
                } else {
                    Modal_Fun.init(res.msg, 1);
                    return false;
                }
            }
        },
        //新版更换老师
        NewChangeTeacher: function (obj) {
            //$(obj).parent('.start').addClass('hidden').siblings('#didiTeacher .matching').removeClass('hidden');
            var clid = $(obj).attr("data-id");
            if (clid == "") {
                Modal_Fun.init("数据出错！", 1);
                return false;
            }

            var res = Fn.Course.ChangeOtherTutor(clid);
            if (res.code == 1 || res.code == -94) {
                //倒计时1min
                $(obj).parent('.start').addClass('hidden').siblings('#didiTeacher .matching').removeClass('hidden');
                var countDown = 60;
                var time = document.getElementById("matching-time");
                time.innerHTML = countDown;
                var countInterval = setInterval(function () {
                    countDown--;
                    time.innerHTML = countDown;
                    if (countDown == 0) {
                        $('#didiTeacher .matching').addClass('hidden');
                        $('#didiTeacher .match-lose').removeClass('hidden');
                        clearInterval(countInterval);
                    };
                    //实时抓取数据
                    if (countDown % 5 == 0) {
                        var dd = Fn.Course.GetDiDiTutor(clid);
                        if (!jQuery.isEmptyObject(dd)) {
                            //去除倒计时
                            //$(obj).removeClass("disabled").attr("disabled", false);

                            $(".append-count").remove();
                            clearInterval(countInterval);
                            //显示抢单数据
                            var html = '<tr class="active">' +
                                '                            <td>' + dd.StartTime + '</td>' +
                                '                            <td>' + dd.FullName + '</td>' +
                                '                            <td>' + dd.toolimg + '</td>' +
                                '                            <td>' + dd.classtool + '</td>' +
                                '                        </tr>';
                            $('#didiTeacher .match-success').removeClass('hidden');
                            $('#didiTeacher .matching').addClass('hidden');
                            $("#NewTeacherCH").append(html);

                        } else if (countDown == 0) {
                            //Modal_Fun.init("暂无其他老师，您可选择提交反馈。", 1);
                            $('#didiTeacher .match-lose').removeClass('hidden');
                            return false;
                        }
                    }
                }, 1000);
            } else {

                $('#didiTeacher .start').addClass('hidden');
                $('#didiTeacher .upload').removeClass('hidden');
                Modal_Fun.init(res.msg, 1);

                return false;
            }

        }
    }
}();

/*********** 首页 ************/
var IndexFun = function () {
    var Config = {
        COID: 0,
        UID: 0,
        Times: null,
        Overtime: 0
    };
    var HandFun = function () {
        //公告栏轮播
        var swiper2 = new Swiper('.swiper-two .swiper-container', {
            pagination: '.swiper-two .swiper-pagination',
            paginationClickable: true,
            direction: 'vertical',
            loop: true,
            autoplay: 10000
        });
    };
    return {
        init: function (option) {
            Config = $.extend(true, Config, option);
            HandFun();
            IndexFun.GetLessonList(Config.Times);
            IndexFun.GetOtherLessonList();
            IndexFun.GetNewWordsData();
        },
        NewInit: function (option) {
            Config = $.extend(true, Config, option);
            HandFun();
            IndexFun.GetNewWordsData();
        },
        GetLessonList: function (times) {
            var res = Fn.User.GetStudentLessonsByTime(Config.COID, times, true);
            var html = "";
            var mhtml = "";
            var today = "";
            if ($("#today_class").length > 0) {
                $("#today_class").text("加载中...");
            }
            if (res) {
                $.each(res, function (i, data) {
                    today = data["start"].split(" ")[0];
                    html += "<tr>";
                    html += "<td>" + data["id"] + "</td>";
                    html += "<td>" + data["start"].split(" ")[1] + " -- " + data["end"] + "</td>";
                    html += "<td class='max-width120 backstr'>" + data["fullname"] + "</td>";
                    html += "<td  style='text-align:center;'>" + data["tools"] + "</td>";
                    html += "<td style='text-align:right;min-width:200px;white-space:normal;'>" + data["toolhtml"] + "</td>";
                    html += "<td>" + data["title"] + "</td>";
                    html += "<td>" + data["operate"];
                    //html += "<a class=\"btn warning btn-xs\" href=\"#\" data-toggle=\"modal\"  data-target=\"#shit_modal2\">课中反馈</a>";
                    html += "</td>";
                    html += "</tr>";
                    i++;
                    var cancel = "";
                    if (data["mflag"] == 1) {
                        cancel = "<li class=\"col-md-6 col-sm-6 col-xs-6 color-black text-right line-height25 margin-top2 margin-bottom2 no-padding\">" +
                            "<a href=\"javascript:;\" class=\"btn btn-outline btn-circle dark btn-sm black btn-cancel\" data-id=\"" + data["id"] + "\">" +
                            " 取消课程</a></li>";
                    }
                    mhtml += '<div class="row mylesson-m-border">' +
                        '<div class="col-xs-12">' +
                        '<div class="row mylesson-m-top">' +
                        '<div class="col-xs-6 text-left">' + data["start"] + '</div>' +
                        '<div class="col-xs-6 text-right" style="padding-left:0;">课程状态:' + data["title"] + '</div>' +
                        '</div>' +
                        '</div>' +
                        ' <div class="col-xs-12">' +
                        '    <div class="row mylesson-m-cen">' +
                        '      <div class="col-xs-6 text-left">课节号:#' + data["id"] + '</div>' +
                        '       <div class="col-xs-6 text-left" style="padding:0">导师:<span>' + data["fullname"] + '</span></div>' +
                        '  <div class="col-xs-12 text-left">上课工具:' + data["tools"] + '</div>' +
                        '      <div class="col-xs-12 text-left">教室入口:' + data["toolhtml"] + '</div>' +
                        '  </div>' +
                        '</div>' +
                        '<div class="col-xs-12">' +
                        '<div class="row mylesson-m-bot">' +
                        '<div class="col-xs-12">' +
                        data["operate"] +
                        '</div>' +
                        '</div>' +
                        ' </div>' +
                        ' </div>';
                });
            } else {
                html = '<tr class="active"><td colspan="7"><h4 class=" text-center">当天没有上课安排　<a href="/WebNew/user/BookClass/newbookclass.aspx" class="btn btn-xs btn-danger border-radius20">去约课</a></h4></td></tr>';
                mhtml = '<tr class=" active"><td colspan="7"><h4 class=" text-center">当天没有上课安排　<a href="/WebNew/user/BookClass/newbookclass.aspx" class="btn btn-xs btn-danger border-radius20">去约课</a></h4></td></tr>';
            }
            $("#lessonlist tbody").html(html);

            //隐藏求救按钮
            $("#lessonlist .open-shit-modal").hide();
            $("#lessonlist .AlertCircumstance").hide();


            if ($("#today_class").length > 0) {
                if (today) {
                    $("#today_class").text(today);
                } else {
                    $("#today_class").text("您今天还没有约课");
                }
            }
            $("#mobile_Class").html(mhtml);
            //评价
            $(".open-rate-modal").click(function () {
                var clid = $(this).attr("data-id");
                var tuid = $(this).attr("data-tuid");
                var tool = $(this).attr("data-tool");
                $("#tool").addClass("data-tool", tool);
                $("#tool").html(tool);
                ShowNoCommentModel(Fn.Course.GetCommentLesson(clid), "search");
            });
            $(".open-edit-rate-modal").click(function () {
                var clid = $(this).attr("data-id");
                var tuid = $(this).attr("data-tuid");
                var tool = $(this).attr("data-tool");
                $("#tool").addClass("data-tool", tool);
                $("#tool").html(tool);
                ShowNoCommentModel(Fn.Course.GetCommentLesson(clid), "edit");
            });
            $(".open-add-rate-modal").click(function () {
                var clid = $(this).attr("data-id");
                var tuid = $(this).attr("data-tuid");
                var tool = $(this).attr("data-tool");
                $("#tool").addClass("data-tool", tool);
                $("#tool").html(tool);
                ShowNoCommentModel(Fn.Course.GetCourseLessonByCLID(clid), "addNo");
            });
            //取消课程
            $(".btn-cancel").click(function () {
                $(this).attr("disabled", true).find("i").addClass("fa-spinner fa-spin");
                if (confirm("取消后您可能无法再次预约到此时间，您确定要取消该课程吗？")) {
                    var clid = $(this).attr("data-id");
                    var r = Fn.Course.CancelMyClass(clid, "WEBCANCEL");
                    if (r.code == "success") {
                        Modal_Fun.init('取消成功！', 1);
                        IndexFun.GetLessonList(Config.Times);
                    } else {
                        Modal_Fun.init(r.msg + "(错误代码[" + r.code + "])", 1);
                    }
                }
                $(this).removeAttr("disabled").find("i").removeClass("fa-spinner fa-spin");
            });
            //我要缺席
            $(".btn-Absent").click(function () {
                var Dq = $(this);
                Dq.attr("disabled", true)
                $(this).attr("disabled", true).find("i").addClass("fa-spinner fa-spin");
                var clid = $(this).attr("data-id");
                //var tipsType2 = '<img class="tipsType" src="https://img.acadsoc.com.cn/web/img/tipsType-success.png"/>';
                //mui.confirm("该节课距离开课时间已不足3小时，无法取消。缺席本节课，系统将通知老师并扣除掉您该节课时？", tipsType2, ['确定缺席', '暂不缺席'], function (y)
                //{
                //    if (y.index == 0)
                //    {

                //    } else { }

                //});
                var absenthtml = "该节课距离开课时间已不足3小时，无法取消。<span class='text-danger'>缺席本节课，系统将通知老师并扣除掉您该节课时。</span>";
                Modal_Fun.init(absenthtml, 2);
                $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                    if ($('#Modal_Fun_room').attr("data-action") == "true") {
                        var r = Fn.Course.EndAbsentClass(clid, 1);
                        if (r == 0) {
                            alert('缺席成功！');
                            //刷新
                            window.location.reload();
                        } else {
                            alert('缺席失败，请确定课程信息。重新尝试！');
                        }
                    }
                });
                $(this).removeAttr("disabled").find("i").removeClass("fa-spinner fa-spin");
                //if (confirm("该节课距离开课时间已不足3小时，无法取消。<br><strong>缺席本节课，系统将通知老师并扣除掉您该节课时？</strong>"))
                //{

                //    var r = Fn.Course.EndAbsentClass(clid,1);
                //    if (r == 0)
                //    {
                //        alert('缺席成功！');
                //    } else
                //    {
                //        alert('缺席失败，请确定课程信息。重新尝试！');
                //    }
                //    //刷新
                //    window.location.reload();
                //} else
                //{
                //    //$('.loding').hide();
                //}
            });
            //求救
            $(".open-shit-modal").click(function () {
                $("#shit_modal").remove();
                var clid = $(this).attr("data-id");
                if ($("#shit_modal").length == 0) {
                    var modal = '<div class="modal fade" id="shit_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                        '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>' +
                        '<h4 class="modal-title">我的课出现问题，需要帮助（课节序号' + clid + '）</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '<div class="control-group clearfix">' +
                        '<label class="col-md-3"><strong>问题状况：</strong></label>' +
                        '<div class="col-md-9">' +
                        '<select class="form-control login-field" name="shit_status"><option value="">请选择你遇到的状况</option><option value="1">老师没来上课</option><option value="2">网络问题听不清楚</option><option value="3">老师断线</option><option value="4">进不了课室</option></select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="control-group clearfix">' +
                        '<label class="col-md-3"><strong>描述问题：</strong></label>' +
                        '<div class="col-md-9" style="word-wrap:break-word;"><textarea class="form-control login-field" name="shit_msg"></textarea></div>' +
                        '</div>' +
                        '<div class="control-group clearfix">' +
                        '<div class="col-md-9 col-md-offset-3"><button type="button" data-id="' + clid + '" onclick="MyClassFun.SubmitShit(this)" class="btn btn-primary">提交问题</button></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' //modal-content
                        +
                        '</div>' //modal-dialog
                        +
                        '</div>'; //modal
                    $("body").append(modal);
                } else {
                    $("#shit_modal [name='clid']").val(clid);
                };
                $("#shit_modal").modal("show");
            });
            //查看求救
            $(".AlertCircumstance").click(function () {
                $("#circumstance_modal").remove();
                var clid = $(this).attr("data-id");
                var res = Fn.Course.GetStudentLessonWarningByCLID(clid);
                var modal = '<div class="modal fade" id="shit_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>' +
                    '<h4 class="modal-title">上课出现问题（课节序号' + clid + '）</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="control-group clearfix">' +
                    '<input type="hidden"  name="clid"  value="' + clid + '"/>' +
                    '<label class="col-md-3"><strong>上课工具：</strong></label>' +
                    '<div class="col-md-9">' + res.classtool + '</div>' +
                    '</div>'

                    +
                    '<div class="control-group clearfix">' +
                    '<input type="hidden" name="clid" value="' + clid + '"/>' +
                    '<label class="col-md-3"><strong>问题状况：</strong></label>' +
                    '<div class="col-md-9">' + res.circumstance + '</div>' +
                    '</div>' +
                    '<div class="control-group clearfix">' +
                    '<label class="col-md-3"><strong>描述问题：</strong></label>' + '<div class="col-md-9" style="word-wrap:break-word;">' + (res.desc != "" ? res.desc : "空") + '</div></div>' +
                    '<div class="control-group clearfix">' +
                    '<div class="col-md-9 col-md-offset-3"><button class="btn btn-default" data-dismiss="modal" type="button">确定</button></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' //modal-content
                    +
                    '</div>' //modal-dialog
                    +
                    '</div>'; //modal
                $(modal).appendTo("body").modal("show");
            });

            //问题反馈
            $(".open-shit-modal2").click(function () {
                //$("#shit_modal2").remove();
                $("#didiTeacher").remove();
                var clid = $(this).attr("data-id");

                //计算课程时间和当前时间差是否有十分钟以上
                var Overtime = $(this).attr("name");
                var stime = Date.parse(new Date(Overtime));
                var now = new Date;
                now.setMinutes(now.getMinutes() - 10);
                var endtime = (new Date(now)).valueOf();
                Config.Overtime = endtime - stime;

                var html = "";
                if ($("#didiTeacher").length == 0) {
                    //                    var modal = '<div class="modal fade" id="shit_modal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                    //                        '<div class="modal-dialog">' +
                    //                        '<div class="modal-content">' +
                    //                        '<div class="modal-header">' +
                    //                        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>' +
                    //                        '<h4 class="modal-title">上课期间遇到问题，需要帮助（课节序号' + clid + '）</h4>' +
                    //                        '</div>' +
                    //                        '<div class="modal-body">' +
                    //                        '<form id="problemfeedbackform" method="POST" enctype="multipart/form-data">' +
                    //                        '<h5 style="color:#31708f">温馨提示：建议耐心等待一下下哦，老师可能正在赶来的路上，若超过5分钟还未正常开课，请于下面提交情况.</h5>' +
                    //                        '<div class="control-group clearfix">' +
                    //                        '<label class="col-md-3"><strong>问题状况：</strong></label>' +
                    //                        '<div class="col-md-9">' +
                    //                        '<select class="form-control login-field" name="type"><option value="">请选择类型</option><option value="1">老师没来</option><option value="2">网络中断/卡顿影响上课</option></select>' +
                    //                        '</div>' +
                    //                        '</div>' +
                    //                        '<div class="control-group clearfix">' +
                    //                        '<label class="col-md-3"><strong>反馈证据：</strong></label>' +
                    //                        '<div class="col-md-9">' +
                    //                        '<table style=" width:100%;">' +
                    //                        '<tr>' +
                    //                        '<td>' +
                    //                        '<div class="fileupload-buttonbar" >' +
                    //                        '<span class="fileinput-button"> <input type="file" name="feedbackfile" multiple="" style=" width:175px;"> </span>' +
                    //                        '</div>' +
                    //                        '</td>' +
                    //                        '<td><span style="color:#999;">(请上传截图，支持jpg、png)</span></td>' +
                    //                        '</tr>' +
                    //                        '</table>' +
                    //                        '</div>' +
                    //                        '</div>' +
                    //                        '<div class="control-group clearfix">' +
                    //                        '<label class="col-md-3"><strong>内容描述：</strong></label>' +
                    //                        '<div class="col-md-9"><textarea class="form-control login-field" name="desc"></textarea></div>' +
                    //                        '</div>' +
                    //                        '</form>' +
                    //                        '</div>' + //modal-body
                    //                        '<div class="control-group clearfix">' +
                    //                        '<div class="col-md-12">' +
                    //                        '<p style="margin-top: 10px!important;color:#999; font-size: 12px; padding: 0 10px!important;margin-top:-15px!important; margin-bottom:10px!important;"><span style="color:#ed6b75;">*</span> 注意：请尽量上传图片依据，或描述清楚情况，帮助工作人员尽快核实查证，我们会于24小时内联系您进行处理。感谢您的支持与合作。</p>' +
                    //                        '</div>' +
                    //                        '<div class="col-md-9 col-md-offset-3"><button type="button" data-id="' + clid + '" onclick="MyClassFun.SubmitShit2(this)" class="btn btn-primary margin-bottom10" >提交反馈</button></div>' +
                    //                        '</div>' +
                    //                        '</div>' //modal-content
                    //                        +
                    //                        '</div>' //modal-dialog
                    //                        +
                    //                        '</div>'; //modal

                    //                    $("body").append(modal);

                    html = '<div class="modal fade" id="didiTeacher" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                        '    <div class="modal-dialog">' +
                        '        <div class="modal-content">' +
                        '            <div class="modal-header">' +
                        '                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                        '                <h4 class="modal-title" >上课期间遇到问题，需要帮助</h4>' +
                        '            </div>' +
                        '            <div class="modal-body">' +
                        '               <div class="start hidden">' +
                        '                   <p class="p1"><strong>温馨提示：</strong>亲爱的学员，请耐心等待一下哦，开课3~10分钟内，若还未正常上课，您有一次【更换老' +
                        '师】的机会，更换的老师为<strong>系统匹配的当前时段有时间的老师</strong>，原课时将取消自动返还，更换老师的课' +
                        '时将免费赠送给您，若介意也可以直接<strong>提交反馈</strong>。</p>' +
                        '                   <img class="teacher-img" src="//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-befor.png"  data-id="' + clid + '" onclick="IndexFun.NewChangeTeacher(this)">' +
                        '                   <a class="submit-btn" onclick="$(this).parent(\'.start\').addClass(\'hidden\').siblings(\'#didiTeacher .upload\').removeClass(\'hidden\')">提交反馈 >></a>' +
                        '               </div>' +
                        '                <div class="upload-success hidden">' +
                        '                    <p class="p1"><strong>温馨提示：</strong>亲爱的学员，请耐心等待一下哦，开课3~10分钟内，若还未正常上课，您有一次【更换老' +
                        '师】的机会，更换的老师为<strong>系统匹配的当前时段有时间的老师</strong>，原课时将取消自动返还，更换老师的课' +
                        '时将免费赠送给您，若介意也可以直接<strong>提交反馈</strong>。</p>' +
                        '                    <img class="upload-success-img" src="//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-upload-success-img.png">' +
                        '                    <p class="p2">您已提交反馈，无法更换老师，请等待核实，<br>' +
                        '                        我们会于24h内为您处理~</p>' +
                        '                    <a class="submit-btn disble" >提交反馈 >></a>' +
                        '                </div>' +
                        '                <div class="upload">' +
                        '        <form id="problemfeedbackform" method="POST" enctype="multipart/form-data">' +
                        '            <p class="p1">' +
                        '                <strong>温馨提示：</strong>请耐心等待一下下哦，老师可能正在赶来的路上，建议若超过5分钟还' +
                        '                未正常开课，请于下面提交情况。' +
                        '            </p>' +
                        '            <table>' +
                        '                <tr>' +
                        '                    <td>问题状况：</td>' +
                        '                    <td>' +
                        '        <select class="form-control login-field" name="type">' +
                        '        <option value="">请选择类型</option>' +
                        '        <option value="1">老师没来</option>' +
                        '        <option value="2">网络中断/卡顿影响上课</option>' +
                        '        </select>' +
                        '                    </td>' +
                        '                </tr>' +
                        '                <tr>' +
                        '                    <td>反馈证据：</td>' +
                        '                        <td>' +
                        '                            <div class="fileupload-buttonbar">' +
                        '                                <span class="fileinput-button"> <input type="file" name="feedbackfile" multiple="" style=" width:175px;"> </span>' +
                        '                            </div>' +
                        '                        </td>' +
                        '                        <td><span style="color:#999;">(请上传截图，支持jpg、png)</span></td>' +
                        '                </tr>' +
                        '                <tr>' +
                        '                    <td>内容描述：</td>' +
                        '                    <td>' +
                        '                        <textarea placeholder="请选择类型" name="desc"></textarea>' +
                        '                    </td>' +
                        '                </tr>' +
                        '            </table>' +
                        '            <p class="p2">' +
                        '                <strong>注意：</strong>请尽量上传图片依据，或描述清楚情况，帮助工作人员尽快核实查证，我们会于24小时' +
                        '                内联系您进行处理，感谢您的支持与合作' +
                        '            </p>' +
                        '            <a class="submit-btn" data-id="' + clid + '" onclick="IndexFun.NewSubmitShit2(this)">提交反馈 >></a>' +
                        '        </form>' +
                        '                </div>' +
                        '                <div class="matching hidden">' +
                        '                    <p class="p1"><strong>温馨提示：</strong>亲爱的学员，请耐心等待一下哦，开课3~10分钟内，若还未正常上课，您有一次【更换老' +
                        '师】的机会，更换的老师为<strong>系统匹配的当前时段有时间的老师</strong>，原课时将取消自动返还，更换老师的课' +
                        '时将免费赠送给您，若介意也可以直接<strong>提交反馈</strong>。</p>' +
                        '                    <img class="matching-img" src="//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-matching.png">' +
                        '                    <p class="p2">正在为您匹配合适的老师...</p>' +
                        '                    <p class="p3"><span id="matching-time">60</span>s</p>' +
                        '                </div>' +
                        '                <div class="match-lose hidden">' +
                        '                    <p class="p1"><strong>温馨提示：</strong>亲爱的学员，请耐心等待一下哦，开课3~10分钟内，若还未正常上课，您有一次【更换老' +
                        '师】的机会，更换的老师为<strong>系统匹配的当前时段有时间的老师</strong>，原课时将取消自动返还，更换老师的课' +
                        '时将免费赠送给您，若介意也可以直接<strong>提交反馈</strong>。</p>' +
                        '                    <img class="nofit-img" src="//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-nofit.png">' +
                        '                    <p class="p2">抱歉，当前无合适的老师可以更换<br>' +
                        '                        您可以直接提交反馈</p>' +
                        '                    <a  onclick="$(this).parent(\'.match-lose\').addClass(\'hidden\').siblings(\'#didiTeacher .upload\').removeClass(\'hidden\')" class="submit-btn">提交反馈 >></a>' +
                        '                </div>' +
                        '                <div class="match-success hidden">' +
                        '                    <p class="p1"><strong>温馨提示：</strong>亲爱的学员，请耐心等待一下哦，开课3~10分钟内，若还未正常上课，您有一次【更换老' +
                        '师】的机会，更换的老师为<strong>系统匹配的当前时段有时间的老师</strong>，原课时将取消自动返还，更换老师的课' +
                        '时将免费赠送给您，若介意也可以直接<strong>提交反馈</strong>。</p>' +
                        '                    <img class="matchSuccess-img" src="//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-match-success.png"  onclick=" alert(\'还剩0次更换老师机会\')">' +
                        '                    <a class="submit-btn" onclick="$(this).parent(\'.match-success\').addClass(\'hidden\').siblings(\'#didiTeacher .upload\').removeClass(\'hidden\')">提交反馈 >></a>' +
                        '                    <table id="NewTeacherCH" class="table table-bordered">' +
                        '                        <tr>' +
                        '                            <td>上课时间</td>' +
                        '                            <td>上课老师</td>' +
                        '                            <td>上课工具</td>' +
                        '                            <td>教室入口</td>' +
                        '                        </tr>' +
                        '                    </table>' +
                        '                </div>' +
                        '            </div>' +
                        '        </div>' +
                        '    </div>' +
                        '</div>';
                    $("body").append(html);
                } else {
                    $("#shit_modal2 [name='clid']").val(clid);
                };
                //判断有没更换过老师
                var dd = Fn.Course.GetDiDiTutor(clid);
                //计算课程时间和当前时间差是否有十分钟以上或者三分钟之内
                var time = $(this).attr("name");
                var stime = Date.parse(new Date(time));
                var now = (new Date().valueOf());

                var Overtime = (now - stime) - 600000; //十分钟
                var OvertimeTwo = (now - stime) - 180000; //三分钟
                //alert(stime+","+now+","+Overtime+","+OvertimeTwo);
                if (Config.UID == '10018') {
                    $('#didiTeacher .upload').addClass('hidden');
                    $('#didiTeacher .start').removeClass('hidden');
                }
                //三分钟之内
                if (OvertimeTwo < 0) {
                    $("#didiTeacher .teacher-img").attr('src', "//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-match-success.png");
                    $("#didiTeacher .teacher-img").removeAttr('onclick');
                }
                //超过三分钟并且小于十分钟
                if (OvertimeTwo > 0 && Overtime < 0) {
                    $("#didiTeacher .teacher-img").attr('src', "//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-befor.png");
                    $("#didiTeacher .teacher-img").attr('onclick', 'MyClassFun.NewChangeTeacher(this)');
                }

                //超过十分钟
                if (Overtime > 0) {
                    $("#didiTeacher .teacher-img").attr('src', "//img.acadsoc.com.cn/web/webnew/assets/admin/pages/img/didiTeacher-match-success.png");
                    $("#didiTeacher .teacher-img").removeAttr('onclick');
                }
                if (!jQuery.isEmptyObject(dd)) {
                    var html = '<tr class="active">' +
                        '                            <td>' + dd.StartTime + '</td>' +
                        '                            <td>' + dd.FullName + '</td>' +
                        '                            <td>' + dd.toolimg + '</td>' +
                        '                            <td>' + dd.classtool + '</td>' +
                        '                        </tr>';

                    $("#NewTeacherCH").append(html);
                    $('#didiTeacher .start').addClass('hidden');
                    $('#didiTeacher .match-success').removeClass('hidden');
                    $("#didiTeacher").modal("show");

                    //$("#shit_modal2 .modal-content").height(600);
                }
                $("#didiTeacher").modal("show");

                //$("#shit_modal2").modal("show");
            });
            //查看问题反馈
            $(".looklessonproblem").click(function () {
                $("#looklessonproblem_modal").remove();
                var clid = $(this).attr("data-id");
                var res = Fn.Course.GetStudentLessonProblemByCLID(clid);
                var dd = Fn.Course.GetDiDiTutor(clid);
                var modal = '<div class="modal fade" id="looklessonproblem_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>' +
                    '<h4 class="modal-title">上课出现问题（课节序号' + clid + '）</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div id="Ngp" class="control-group clearfix">' +
                    '<input type="hidden" name="clid" value="' + clid + '"/>' +
                    '<label class="col-md-3"><strong>问题状况：</strong></label>' +
                    '<div class="col-md-9">' + res.type + '</div>' +
                    '</div>' +
                    '<div class="control-group clearfix">' +
                    '<label class="col-md-3"><strong>描述问题：</strong></label>' + '<div class="col-md-9" style="word-wrap:break-word;">' + (res.desc != "" ? res.desc : "空") + '</div></div>' +
                    '<div class="control-group clearfix">' +
                    '<label class="col-md-3"><strong>反馈证据：</strong></label>' + '<div class="col-md-9"><img src="' + res.img + '" width="400"></div></div>' +
                    '<div class="control-group clearfix">' +
                    '<div class="col-md-9 col-md-offset-3"><button class="btn btn-default" data-dismiss="modal" type="button">确定</button></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' //modal-content
                    +
                    '</div>' //modal-dialog
                    +
                    '</div>'; //modal
                $(modal).appendTo("body").modal("show");
                var html = "";
                if (!jQuery.isEmptyObject(dd)) {
                    html = '<div class="control-group clearfix">' +
                        '            <label class="col-md-3"><strong>更换老师：</strong></label>' +
                        '            <div class="col-md-3">' + dd.FullName + '</div>' +
                        '            <div class="col-md-1">' + dd.toolimg + '</div>' +
                        '            <div class="col-md-5">' + dd.StartTime + '</div>' +
                        '        </div>';
                    $(html).insertBefore("#Ngp");
                }
            });

            //课后评价
            $(".open-rate-modal").click(function () {
                var clid = $(this).attr("data-id");
                var tuid = $(this).attr("data-tuid");
                var tool = $(this).attr("data-tool");
                $("#tool").addClass("data-tool", tool);
                $("#tool").html(tool);
                ShowNoCommentModel(Fn.Course.GetCourseLessonByCLID(clid), "addNo");
            });
            //老师评价 弹出课程描述
            $(".open-class-Meno").on("click", function () {
                $("#class_meno_modal").remove();
                var usid = $(this).attr("data-id");
                var res = Fn.User.GetTutorClassRemark(usid);
                console.log(res);
                if (res != null) {
                    var modal = '<div class="modal" id="class_meno_modal" aria-hidden="false">' +
                        '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<button data-dismiss="modal" class="close" type="button">' +
                        '<span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>' +
                        '<h4 class="modal-title">上课评价</h4>' +
                        '</div>' +
                        '<div class="modal-body" style="max-height:500px; overflow-x: hidden; overflow-y: scroll">';
                    $.each(res, function (k, y) {
                        var item = "";
                        if (!jQuery.isEmptyObject(y.TestScore))
                            item = '<div class="control-group"><label class="control-label">测试正确率：</label>' + y.TestScore + ' %</div>';
                        modal += '<div class="panel panel-primary lp-item view-feedbacks"><div aria-controls="collapseOne" aria-expanded="true" href="#panel-' + (k + 1) + '" data-parent="#accordion" data-toggle="collapse" class="panel-heading collapsed">' +
                            '<h4 class="panel-title">' +
                            '<span class="fa fa-chevron-down"></span>&nbsp;<strong>课节 ' + (k + 1) + '</strong>' +
                            '</h4>' +
                            '</div>' +
                            '<div aria-labelledby="headingOne" role="tabpanel" class="panel-collapse collapse" id="panel-' + (k + 1) + '" style="height: 0px;">' +
                            '<div class="panel-body">' +
                            '<div class="control-group"><label class="control-label">老师名：</label>' + y.tutor + '</div>' +
                            '<div class="control-group"><label class="control-label">上课工具：</label>' + y.classtool + '</div>' +
                            '<div class="control-group"><label class="control-label">上课时间：</label>' + y.classtime + '</div>' + item +
                            '<div class="tabbable tabbable-custom">' +
                            '    <ul class="nav nav-tabs">' +
                            '       <li class="active" style="width:auto;">' +
                            '           <a data-toggle="tab" href="#tab_meno_1_' + (k + 1) + '">' +
                            '           老师评价</a>' +
                            '       </li>' +
                            '       <li style="width:auto;">' +
                            '           <a data-toggle="tab" href="#tab_meno_2_' + (k + 1) + '">' +
                            '           课堂词汇</a>' +
                            '       </li>' +
                            '       <li style="width:auto;">' +
                            '           <a data-toggle="tab" href="#tab_meno_3_' + (k + 1) + '">' +
                            '           课堂纠错</a>' +
                            '       </li>' +
                            '   </ul>' +
                            '   <div class="tab-content">' +
                            '       <div id="tab_meno_1_' + (k + 1) + '" class="tab-pane fontawesome-demo active"><p>' + y.description + '</p></div>' +
                            '       <div id="tab_meno_2_' + (k + 1) + '" class="tab-pane fontawesome-demo"><p>' + y.vocabularies + '</p></div>' +
                            '       <div id="tab_meno_3_' + (k + 1) + '" class="tab-pane fontawesome-demo"><p>' + y.sentences + '</p></div>' +
                            '   </div>' +
                            '</div></div></div></div>';
                        teacherCommentPC(y.clid, y.tutor, y.classtool, y.classtime);
                    })
                    modal += '</div></div></div>';
                    $(modal).appendTo("body").modal("show");
                    $("#class_meno_modal .view-feedbacks").first().find(".panel-heading").trigger("click");
                } else {
                    Modal_Fun.init("对不起，暂无老师评价！", 1);
                }
            });
            //打赏老师（按课程打赏）
            $(".MylessonsAReward").on("click", function () {
                $("#Modal_Terur .Play_txt").text($(this).parent().parent().find("td").eq(2).text() || $(this).parent().parent().parent().prev().find("div.row.mylesson-m-cen>div").eq(1).find("span").text())
                $("#btnRewardSubmit").attr("data-clid", $(this).attr("data-clid"));
                $("#btnRewardSubmit").attr("data-tuid", $(this).attr("data-tuid"));
                var TutorImg = CDNUrl + "/web/webnew/assets/admin/pages/img/Tutor_Nv.png";
                if ($(this).attr("data-sex") == "1")
                    TutorImg = CDNUrl + "/web/webnew/assets/admin/pages/img/Tutor_Man.png";
                $("#TutorImg").attr("src", TutorImg);
            });
            //点击"确认打赏"按钮，进行打赏的功能操作
            $("#btnRewardSubmit").click(function () {
                var clid = $(this).attr("data-clid");
                var tuid = $(this).attr("data-tuid");
                if (tuid == null || clid == null) {
                    Modal_Fun.init("操作有误，请重试！", 1);
                    return;
                }
                var rewardCount = $("#Play_hua").val();
                if (rewardCount == 0) {
                    Modal_Fun.init("请选择要赠送的礼物", 1);
                    return;
                }
                var msg = "";
                if (rewardCount == 100)
                    msg = "饭团";
                if (rewardCount == 200)
                    msg = "饺子";
                else if (rewardCount == 500)
                    msg = "面包";
                else if (rewardCount == 1000)
                    msg = "小笼包";
                else if (rewardCount == 5000)
                    msg = "披萨";
                else if (rewardCount == 10000)
                    msg = "蛋糕";
                Modal_Fun.init("是否确定赠送该老师“" + msg + "”（" + rewardCount + "A豆）？", 2);
                $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                    if ($("#Modal_Fun_room").attr("data-action") == "true") {
                        var r = Fn.NewUser.RewardToTeacher(tuid, clid, rewardCount, 1);
                        if (r == -2) {
                            Modal_Fun.init("A豆数量不足，请充值");
                        }
                        if (r == -1) {
                            Modal_Fun.init("每天对同一老师只能赠送5次哦，不能再赠送啦");
                        }
                        if (r == 0) {
                            Modal_Fun.init("赠送失败，请重试");
                        }
                        if (r == -3) {
                            Modal_Fun.init("赠送失败，请选择要赠送的礼物");
                        }
                        if (r == 1) {
                            Modal_Fun.init("赠送成功", 1, true);
                        }
                    }
                });
            });
        },
        GetUserLevel: function () {
            var res = Fn.User.GetUserSubLevelJson();
            if (res.level > 0) {
                $("#UserLevel").html(res.level);
                $(".User_Index_Level").html("等级 LV " + res.level);
                $("#levelmsg").html(res.msg);
                $("#myModalA").modal("show");
            } else {
                $("#myModalB").modal("show");
            }
        },
        GetOtherLessonList: function () {
            var res = Fn.User.GetOtherLessonList(Config.COID);
            var html = "";
            var mhtml = "";
            if (res) {
                $.each(res, function (i, data) {
                    html += "<tr>";
                    html += "<td>" + data["id"] + "</td>";
                    html += "<td>" + data["start"] + " -- " + data["end"] + "</td>";
                    html += "<td>" + data["fullname"] + "</td>";
                    html += "<td  style='text-align:center;'>" + data["tools"] + "</td>";
                    html += "<td style='text-align:right;min-width:200px;white-space:normal;'>" + data["toolhtml"] + "</td>";
                    html += "<td>" + data["title"] + "</td>";
                    html += "<td>" + data["operate"] + "</td>";
                    html += "</tr>";
                    i++;
                    var cancel = "";
                    if (data["mflag"] == 1) {
                        cancel = "<li class=\"col-md-6 col-sm-6 col-xs-6 color-black text-right line-height25 margin-top2 margin-bottom2 no-padding\">" +
                            "<a href=\"javascript:;\" class=\"btn btn-outline btn-circle dark btn-sm black btn-cancel-other\" data-id=\"" + data["id"] + "\">" +
                            " 取消课程</a></li>";
                    }
                    mhtml += '<div class="row mylesson-m-border">' +
                        '<div class="col-xs-12">' +
                        '<div class="row mylesson-m-top">' +
                        '<div class="col-xs-6 text-left">' + data["start"] + '</div>' +
                        '<div class="col-xs-6 text-right" style="padding-left:0;">课程状态:' + data["title"] + '</div>' +
                        '</div>' +
                        '</div>' +
                        ' <div class="col-xs-12">' +
                        '    <div class="row mylesson-m-cen">' +
                        '      <div class="col-xs-6 text-left">课节号:#' + data["id"] + '</div>' +
                        '       <div class="col-xs-6 text-left" style="padding:0">导师:' + data["fullname"] + '</div>' +
                        '  <div class="col-xs-12 text-left">上课工具:' + data["tools"] + '</div>' +
                        '      <div class="col-xs-12 text-left">教室入口:' + data["toolhtml"] + '</div>' +
                        '  </div>' +
                        '</div>' +
                        '<div class="col-xs-12">' +
                        '<div class="row mylesson-m-bot">' +
                        '<div class="col-xs-12">' +
                        data["operate"] +
                        '</div>' +
                        '</div>' +
                        ' </div>' +
                        ' </div>';
                    //                    mhtml+="<li class=\"list my-border border-radius8 overflow margin-bottom10 clearfix\">"+
                    //                            "<ul>"+
                    //                                "<li class=\"clearfix\">"+
                    //                                    "<ul class=\"col-md-12 col-sm-12 col-xs-12 no-padding bg-grey\">"+
                    //                                        "<li class=\"col-md-6 col-sm-6 col-xs-6 text-left no-padding\"><span class=\"label label-sm label-success bg-agba0 height-40 line-height40\">"+
                    //                                            "<i class=\"fa fa-clock-o\"></i>"+data["start"]+" </span></li>"+
                    //                                        "<li class=\"col-md-6 col-sm-6 col-xs-6 text-right no-padding\"><span class=\"label label-sm label-success bg-agba0 height-40 line-height40\">"+
                    //                                            "<i class=\"fa fa-graduation-cap\"></i>导师：" + data["fullname"] + "</span></li>"+
                    //                                    "</ul>"+
                    //                                "</li>"+
                    //                                "<li class=\"clearfix\">"+
                    //                                    "<ul>"+
                    //                                        "<li class=\"clearfix\">"+
                    //                                            "<ul>"+
                    //                                                "<li class=\"col-md-6 col-sm-6 col-xs-6 color-black text-left line-height25 margin-top2 margin-bottom2 no-padding\">"+
                    //                                                    "<span class=\"label label-sm label-success bg-agba0\"><i class=\"fa fa-star-o\"></i>课节号：#"+data["id"]+
                    //                                                    "</span></li>"+cancel+
                    //                                            "</ul>"+
                    //                                        "</li>"+
                    //                                        "<li class=\"clearfix\">"+
                    //                                            "<ul>"+
                    //                                                "<li class=\"col-md-12 col-sm-12 col-xs-12 color-black text-left line-height25 margin-top2 margin-bottom2 no-padding\">"+
                    //                                                    "<span class=\"label label-sm label-success bg-agba0\"><i class=\"fa fa-cutlery\"></i>上课工具："+data["ctools"]+
                    //                                                    "</span></li>"+
                    //                        "</ul></li></ul></li></ul></li>";
                });
            } else {
                $(".My_OrderLesson").hide();
                html = '<tr class="active"><td colspan="7"><h4 class=" text-center">当天没有上课安排</h4></td></tr>';
                mhtml = '<tr class=" active"><td colspan="7"><h4 class=" text-center">当天没有上课安排</h4></td></tr>';
            }
            $("#OtherLessonList tbody").html(html);
            $("#mobile_OtherLessonList").html(mhtml);
            //取消课程
            $(".btn-cancel-other").click(function () {
                $(this).attr("disabled", true).find("i").addClass("fa-spinner fa-spin");
                if (confirm("取消后您可能无法再次预约到此时间，您确定要取消该课程吗？")) {
                    var clid = $(this).attr("data-id");
                    var r = Fn.Course.CancelMyClass(clid, "WEBCANCEL");
                    if (r.code == "success") {
                        Modal_Fun.init('取消成功！', 1);
                        IndexFun.GetOtherLessonList();
                    } else {
                        Modal_Fun.init(r.msg + "(错误代码[" + r.code + "])", 1);
                    }
                }
                $(this).removeAttr("disabled").find("i").removeClass("fa-spinner fa-spin");
            });
            //求救
            $(".open-shit-modal-other").click(function () {
                $("#shit_modal").remove();
                var clid = $(this).attr("data-id");
                if ($("#shit_modal").length == 0) {
                    var modal = '<div class="modal fade" id="shit_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                        '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>' +
                        '<h4 class="modal-title">我的课出现问题，需要帮助（课节序号' + clid + '）</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '<div class="control-group clearfix">' +
                        '<label class="col-md-3"><strong>问题状况：</strong></label>' +
                        '<div class="col-md-9">' +
                        '<select class="form-control login-field" name="shit_status"><option value="">请选择你遇到的状况</option><option value="1">老师没来上课</option><option value="2">网络问题听不清楚</option><option value="3">老师断线</option><option value="4">进不了课室</option></select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="control-group clearfix">' +
                        '<label class="col-md-3"><strong>描述问题：</strong></label>' +
                        '<div class="col-md-9" style="word-wrap:break-word;"><textarea class="form-control login-field" name="shit_msg"></textarea></div>' +
                        '</div>' +
                        '<div class="control-group clearfix">' +
                        '<div class="col-md-9 col-md-offset-3"><button type="button" data-id="' + clid + '" onclick="MyClassFun.SubmitShit(this)" class="btn btn-primary">提交问题</button></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' //modal-content
                        +
                        '</div>' //modal-dialog
                        +
                        '</div>'; //modal
                    $("body").append(modal);
                } else {
                    $("#shit_modal [name='clid']").val(clid);
                };
                $("#shit_modal").modal("show");
            });
            //查看求救
            $(".AlertCircumstance-other").click(function () {
                $("#circumstance_modal").remove();
                var clid = $(this).attr("data-id");
                var res = Fn.Course.GetStudentLessonWarningByCLID(clid);
                var modal = '<div class="modal fade" id="shit_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>' +
                    '<h4 class="modal-title">上课出现问题（课节序号' + clid + '）</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="control-group clearfix">' +
                    '<input type="hidden"  name="clid"  value="' + clid + '"/>' +
                    '<label class="col-md-3"><strong>上课工具：</strong></label>' +
                    '<div class="col-md-9">' + res.classtool + '</div>' +
                    '</div>'

                    +
                    '<div class="control-group clearfix">' +
                    '<input type="hidden" name="clid" value="' + clid + '"/>' +
                    '<label class="col-md-3"><strong>问题状况：</strong></label>' +
                    '<div class="col-md-9">' + res.circumstance + '</div>' +
                    '</div>' +
                    '<div class="control-group clearfix">' +
                    '<label class="col-md-3"><strong>描述问题：</strong></label>' + '<div class="col-md-9" style="word-wrap:break-word;">' + (res.desc != "" ? res.desc : "空") + '</div></div>' +
                    '<div class="control-group clearfix">' +
                    '<div class="col-md-9 col-md-offset-3"><button class="btn btn-default" data-dismiss="modal" type="button">确定</button></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' //modal-content
                    +
                    '</div>' //modal-dialog
                    +
                    '</div>'; //modal
                $(modal).appendTo("body").modal("show");
            });
            //课后评价
            $(".open-rate-modal-other").click(function () {
                var clid = $(this).attr("data-id");
                var tuid = $(this).attr("data-tuid");
                var tool = $(this).attr("data-tool");
                $("#tool").addClass("data-tool", tool);
                $("#tool").html(tool);
                ShowNoCommentModel(Fn.Course.GetCourseLessonByCLID(clid), "addNo");
            });
            //老师评价 弹出课程描述
            $(".open-class-Meno-other").on("click", function () {
                $("#class_meno_modal").remove();
                var usid = $(this).attr("data-id");
                var res = Fn.User.GetTutorClassRemark(usid);
                if (res != null) {
                    var modal = '<div class="modal" id="class_meno_modal" aria-hidden="false">' +
                        '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<button data-dismiss="modal" class="close" type="button">' +
                        '<span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>' +
                        '<h4 class="modal-title">上课评价</h4>' +
                        '</div>' +
                        '<div class="modal-body" style="max-height:500px; overflow-x: hidden; overflow-y: scroll">';
                    $.each(res, function (k, y) {
                        var item = "";
                        if (!jQuery.isEmptyObject(y.TestScore))
                            item = '<div class="control-group"><label class="control-label">测试正确率：</label>' + y.TestScore + ' %</div>';
                        modal += '<div class="panel panel-primary lp-item view-feedbacks"><div aria-controls="collapseOne" aria-expanded="true" href="#panel-' + (k + 1) + '" data-parent="#accordion" data-toggle="collapse" class="panel-heading collapsed">' +
                            '<h4 class="panel-title">' +
                            '<span class="fa fa-chevron-down"></span>&nbsp;<strong>课节 ' + (k + 1) + '</strong>' +
                            '</h4>' +
                            '</div>' +
                            '<div aria-labelledby="headingOne" role="tabpanel" class="panel-collapse collapse" id="panel-' + (k + 1) + '" style="height: 0px;">' +
                            '<div class="panel-body">' +
                            '<div class="control-group"><label class="control-label">老师名：</label>' + y.tutor + '</div>' +
                            '<div class="control-group"><label class="control-label">上课工具：</label>' + y.classtool + '</div>' +
                            '<div class="control-group"><label class="control-label">上课时间：</label>' + y.classtime + '</div>' + item +
                            '<div class="tabbable tabbable-custom">' +
                            '    <ul class="nav nav-tabs">' +
                            '       <li class="active" style="width:auto;">' +
                            '           <a data-toggle="tab" href="#tab_meno_1_' + (k + 1) + '">' +
                            '           老师评价</a>' +
                            '       </li>' +
                            '       <li style="width:auto;">' +
                            '           <a data-toggle="tab" href="#tab_meno_2_' + (k + 1) + '">' +
                            '           课堂词汇</a>' +
                            '       </li>' +
                            '       <li style="width:auto;">' +
                            '           <a data-toggle="tab" href="#tab_meno_3_' + (k + 1) + '">' +
                            '           课堂纠错</a>' +
                            '       </li>' +
                            '   </ul>' +
                            '   <div class="tab-content">' +
                            '       <div id="tab_meno_1_' + (k + 1) + '" class="tab-pane fontawesome-demo active"><p>' + y.description + '</p></div>' +
                            '       <div id="tab_meno_2_' + (k + 1) + '" class="tab-pane fontawesome-demo"><p>' + y.vocabularies + '</p></div>' +
                            '       <div id="tab_meno_3_' + (k + 1) + '" class="tab-pane fontawesome-demo"><p>' + y.sentences + '</p></div>' +
                            '   </div>' +
                            '</div></div></div></div>';
                        teacherCommentPC(y.clid, y.tutor, y.classtool, y.classtime);
                    })
                    modal += '</div></div></div>';
                    $(modal).appendTo("body").modal("show");
                    $("#class_meno_modal .view-feedbacks").first().find(".panel-heading").trigger("click");
                } else {
                    Modal_Fun.init("对不起，暂无老师评价！", 1);
                }
            });
            //打赏老师（按课程打赏）
            $(".MylessonsAReward-other").on("click", function () {
                $("#Modal_Terur .Play_txt").text($(this).parent().parent().find("td").eq(2).text() || $(this).parent().parent().parent().prev().find("div.row.mylesson-m-cen>div").eq(1).find("span").text())
                $("#btnRewardSubmit").attr("data-clid", $(this).attr("data-clid"));
                $("#btnRewardSubmit").attr("data-tuid", $(this).attr("data-tuid"));
                var TutorImg = CDNUrl + "/web/webnew/assets/admin/pages/img/Tutor_Nv.png";
                if ($(this).attr("data-sex") == "1")
                    TutorImg = CDNUrl + "/web/webnew/assets/admin/pages/img/Tutor_Man.png";
                $("#TutorImg").attr("src", TutorImg);
            });
            //点击"确认打赏"按钮，进行打赏的功能操作
            $("#btnRewardSubmit").click(function () {
                var clid = $(this).attr("data-clid");
                var tuid = $(this).attr("data-tuid");
                if (tuid == null || clid == null) {
                    Modal_Fun.init("操作有误，请重试！", 1);
                    return;
                }
                var rewardCount = $("#Play_hua").val();
                if (rewardCount == 0) {
                    Modal_Fun.init("请选择要赠送的礼物", 1);
                    return;
                }
                var msg = "";
                if (rewardCount == 100)
                    msg = "饭团";
                if (rewardCount == 200)
                    msg = "饺子";
                else if (rewardCount == 500)
                    msg = "面包";
                else if (rewardCount == 1000)
                    msg = "小笼包";
                else if (rewardCount == 5000)
                    msg = "披萨";
                else if (rewardCount == 10000)
                    msg = "蛋糕";
                Modal_Fun.init("是否确定赠送该老师“" + msg + "”（" + rewardCount + "A豆）？", 2);
                $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                    if ($("#Modal_Fun_room").attr("data-action") == "true") {
                        var r = Fn.NewUser.RewardToTeacher(tuid, clid, rewardCount, 1);
                        if (r == -2) {
                            Modal_Fun.init("A豆数量不足，请充值");
                        }
                        if (r == -1) {
                            Modal_Fun.init("每天对同一老师只能赠送5次哦，不能再赠送啦");
                        }
                        if (r == 0) {
                            Modal_Fun.init("赠送失败，请重试");
                        }
                        if (r == -3) {
                            Modal_Fun.init("赠送失败，请确认赠送的礼物");
                        }
                        if (r == 1) {
                            Modal_Fun.init("赠送成功", 1, true);
                        }
                    }
                });
            });
        },
        EditClassTool: function (obj, tuid, num, tools) {
            $(obj).attr("disabled", "true");
            var uid = $(obj).attr("data-uid");
            var flag = Fn.Course.IsShenZ(uid);
            if (flag == "True") {
                Modal_Fun.init("<font color='red'>更换工具失败：当前教材只支持ClassIn上课无法更换其他上课工具，请见谅！</font>", 1);
                $(obj).removeAttr("disabled");
                return;
            }
            var rn = Fn.Course.GetNewTutorClassTool(tuid);
            if (rn != null && rn != "") {
                $.ajax({
                    url: "/Ajax/NewUserAjax.ashx?method=getclasstool",
                    type: "POST",
                    dataType: "json",
                    data: {
                        "COID": $(obj).attr("data-coid"),
                        classTool: rn
                    },
                    success: function (res) {
                        $(obj).removeAttr("disabled");
                        res = eval(res);
                        var classToolHtml = "请选择上课工具:<select id='editClassToolSelect'>";
                        var SelTool = "";
                        for (var i = res.length - 1; i >= 0; i--) {
                            SelTool = "";
                            if (res[i].value == tools)
                                SelTool = "selected";
                            classToolHtml += "<option value='" + res[i].value + "' " + SelTool + ">" + res[i].text + "</option>";
                        }
                        classToolHtml += "</select><br><br><br><small class=\"text-danger\">温馨提示：<br>课前1小时外可修改，1小时内不可修改。</small>";

                        Modal_Fun.init(classToolHtml, 2);
                        $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                            if ($('#Modal_Fun_room').attr("data-action") == "true") {
                                var classtool = $("#editClassToolSelect").val();
                                var clid = $(obj).attr("data-clid");
                                $.ajax({
                                    url: "/Ajax/NewUserAjax.ashx?method=changetutorclassTool",
                                    type: "POST",
                                    dataType: "json",
                                    data: {
                                        "clid": clid,
                                        tool: classtool
                                    },
                                    success: function (res) {
                                        if (res == 1 || res == "1") {
                                            Modal_Fun.init("修改上课工具成功!", 1);
                                            $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                                                if (num == 2) {
                                                    IndexFun.GetOtherLessonList();
                                                } else if (num == 1) {
                                                    IndexFun.GetLessonList(Config.Times);
                                                }
                                            });
                                        } else if (res == -99) {
                                            Modal_Fun.init("修改上课工具失败!只能在课前1小时之前修改", 1);
                                        } else {
                                            Modal_Fun.init("修改上课工具失败!", 1);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        },
        GetNewWordsData: function () {
            //加载Loading
            $("#NewWordsList").html('<div class="loader"><div class="loader-inner ball-triangle-path"><div></div><div></div><div></div></div></div>');
            $.ajax({
                type: 'post',
                async: true,
                dataType: 'json',
                url: "/Ajax/NewUserAjax.ashx?method=GetIndexCourseNewWords",
                success: function (data) {
                    var html = "";
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            html += '<div class="col-md-12" style="border-left: 3px solid #1cbc9d; border-bottom:1px dashed #bbb;border-top:1px dashed #bbb;border-right:1px dashed #bbb;; padding: 20px 0;' +
                                '    margin-top: 10px; margin-bottom: 10px;">' +
                                '    <a href="javascript:;" name="TranslationText" onclick="IndexFun.ClickTranslationText(this)" data-toggle="modal" data-target="#Modal_fanyi" dataTitle="' + data[i]["Title"] + '">' +
                                '        <strong class="text-danger font-18 col-md-4 col-sm-4 col-xs-12 text-left ovestr tooltips text-center" title="' + data[i]["Title"] + '">' +
                                '            ' + data[i]["Title"] + '</strong>' +
                                '    </a>' +
                                '    <label class="col-md-2 col-sm-2 col-xs-12 text-left ovestr tooltips text-center" title="' + data[i]["Content"] + '">' +
                                '        ' + data[i]["Content"] + '</label>' +
                                '    <span style="margin: 0 5px;" class="EnVoice">美音</span> ' +
                                '    <span style="margin: 0 5px;" class="UkVoice">英音</span> ' +
                                '    <span style="margin: 0 5px;white-space:nowrap;"> ' + data[i]["CreateTime"] + '</span>';
                            if (data[i]["State"] != 1) {
                                html += '    <a href="javascript:;" name="Complete" data-id="' + data[i]["Id"] + '"' +
                                    '                title="添加到学会的单词" class="btn btn-danger btn-xs border-radius20" style="margin: 0 10px;">' +
                                    '                <i class="fa fa-check"></i>完成</a>';
                            }
                            html += '    <a href="javascript:;" data-id="' + data[i]["Id"] + '" name="Del" title="删除"' +
                                '        class="fa fa-trash text-danger font-18" style="margin: 0 5px;"></a>' +
                                '</div>';
                        }
                    } else {
                        html = "<h3 class=\"col-md-10 col-md-offset-1\" style=\"border:1px solid #E7ECF1;background:#FBFCFD;text-align:center;padding:20px 0\">没有记录</h3>";
                    }
                    $("#NewWordsList").html(html);
                    Play_m.init();
                    //删除单词
                    $("a[name=Del]").click(function () {
                        if (confirm("您确定删除该单词吗?")) {
                            var Id = $(this).attr("data-id");
                            if (Fn.NewUser.UpdateNewWords(-1, Id) > 0)
                                location.reload();
                        }
                    });
                    //完成单词
                    $("a[name=Complete]").click(function () {
                        if (confirm("您确定已学会该单词吗?")) {
                            var Id = $(this).attr("data-id");
                            if (Fn.NewUser.UpdateNewWords(1, Id) > 0)
                                location.reload();
                        }
                    });
                }
            });
        },
        ClickTranslationText: function (pbj) {
            var str = $(pbj).attr("dataTitle");
            $("[name=FanYiText]").val(str);
            $("#fanyi").click();
        },
        //新版提交反馈
        NewSubmitShit2: function (obj) {
            var form = $("#problemfeedbackform");
            var clid = $(obj).attr("data-id");
            if (clid == "") {
                Modal_Fun.init("数据出错！", 1);
                return false;
            }
            var type = form.find("[name=type]  option:selected").val();
            if (type == "") {
                Modal_Fun.init("请选择问题状况！", 1);
                return false;
            }
            var file = form.find("[name=feedbackfile]").val();
            var desc = form.find("[name=desc]").val().trim();

            if (file == "" && desc == "") {
                Modal_Fun.init("反馈证据和内容描述必须填写其中一项", 1);
                return false;
            }
            $(obj).attr("disabled", true);
            $(obj).css("pointer-events", "none");
            var option = {
                dataType: "json",
                data: { __: "StudentsForProblem", clid: clid },
                url: '/Ajax/Web.UI.Fun.Course.aspx',
                beforeSubmit: function () {

                },
                success: function (result) {
                    var data = result.value;
                    $(obj).removeAttr("disabled");
                    $(obj).css("pointer-events", "auto");
                    if (data > 0) {
                        Modal_Fun.init("您的问题已经提交，客服很快帮你解决问题，请稍等。", 1);
                        $("#didiTeacher").modal("hide");
                        //$('#didiTeacher .upload').addClass('hidden');
                        //$('#didiTeacher .upload-success').removeClass('hidden');
                        IndexFun.GetLessonList(Config.Times);
                    } else if (data == -1) {
                        Modal_Fun.init("文件类型错误或者文件太大了！", 1);
                        return false;
                    } else if (data == -2) {
                        Modal_Fun.init("课程不存在！", 1);
                        return false;
                    } else if (data == -3) {
                        Modal_Fun.init("只能在上课后和课程24h前反馈！", 1);
                        return false;
                    } else {
                        Modal_Fun.init("操作失败！", 1);
                        return false;
                    }
                },
                error: function (result) {
                    //bootbox.alert(data.msg);
                    return false;
                }
            };
            form.ajaxSubmit(option);
        },
        //新版更换老师
        NewChangeTeacher: function (obj) {
            //$(obj).parent('.start').addClass('hidden').siblings('#didiTeacher .matching').removeClass('hidden');
            var clid = $(obj).attr("data-id");
            if (clid == "") {
                Modal_Fun.init("数据出错！", 1);
                return false;
            }

            var res = Fn.Course.ChangeOtherTutor(clid);
            if (res.code == 1 || res.code == -94) {
                //倒计时1min
                $(obj).parent('.start').addClass('hidden').siblings('#didiTeacher .matching').removeClass('hidden');
                var countDown = 60;
                var time = document.getElementById("matching-time");
                time.innerHTML = countDown;
                var countInterval = setInterval(function () {
                    countDown--;
                    time.innerHTML = countDown;
                    if (countDown == 0) {
                        $('#didiTeacher .matching').addClass('hidden');
                        $('#didiTeacher .match-lose').removeClass('hidden');
                        clearInterval(countInterval);
                    };
                    //实时抓取数据
                    if (countDown % 5 == 0) {
                        var dd = Fn.Course.GetDiDiTutor(clid);
                        if (!jQuery.isEmptyObject(dd)) {
                            //去除倒计时
                            //$(obj).removeClass("disabled").attr("disabled", false);

                            $(".append-count").remove();
                            clearInterval(countInterval);
                            //显示抢单数据
                            var html = '<tr class="active">' +
                                '                            <td>' + dd.StartTime + '</td>' +
                                '                            <td>' + dd.FullName + '</td>' +
                                '                            <td>' + dd.toolimg + '</td>' +
                                '                            <td>' + dd.classtool + '</td>' +
                                '                        </tr>';
                            $('#didiTeacher .match-success').removeClass('hidden');
                            $('#didiTeacher .matching').addClass('hidden');
                            $("#NewTeacherCH").append(html);

                        } else if (countDown == 0) {
                            //Modal_Fun.init("暂无其他老师，您可选择提交反馈。", 1);
                            $('#didiTeacher .match-lose').removeClass('hidden');
                            return false;
                        }
                    }
                }, 1000);
            } else {
                $('#didiTeacher .start').addClass('hidden');
                $('#didiTeacher .upload').removeClass('hidden');
                Modal_Fun.init(res.msg, 1);

                return false;
            }

        },
        //获取学霸证书
        GetMyExcellentCert: function (obj) {
            var res = Fn.User.GetMyExcellentCert(Config.UID);
            if (res != null) {
                $(".certificateModal").show();
                $('.spinner').show();
                $(".certificateModal .warp .box").hide();
                $(".showstuimg").html("<img src=\"https://img.acadsoc.com.cn/webnew/assets/admin/img/" + (res.sex == 1 ? 'boy.png' : 'girl.png') + "\">")
                $(".showstuname").html(res.name);
                $("#certificate_date").html(res.jointime);
                $("#certificate_number").html(res.count);
                $("#certificate_time").html(res.classtime);
                $(".showstuQRcode").html("<img src=\"" + res.QRimg + "\">");
                setTimeout(function () {
                    $(".certificateModal .warp .box").show();
                    $('.spinner').hide();
                }, 500)
            } else {
                alert("Error!");
            }
        }
    }
}();

/*********** 用户等级认证 ************/
var UserCardFun = function () {
    //Load&Active
    var LoadFun = function () {
        $("#submitVerify").click(function () {
            var UID = $("#UID").html(),
                IDName = $("#IDName").val(),
                IDCardNum = $("#IDCardNum").val(),
                sex = $("input[name='sex']").val(),
                UserBorn = $("#UserBorn").val(),
                IDEmail = $("#IDEmail").val();
            if (UID <= 0) {
                alert("数据错误，请重试！");
                return false;
            }
            var res = Fn.User.AddUserAuthen(UID, IDName, IDCardNum, sex, UserBorn, IDEmail);
            if (!jQuery.isEmptyObject(res)) {
                if (res.code == "success") {
                    window.location.reload();
                } else {
                    alert(res.msg);
                }
            }
        });
    };
    //Web Api
    return {
        // init 
        init: function () {
            LoadFun();
        },
        StepFun: function (num) {
            if (num == 1) {
                $("#step1").removeClass("done").addClass("active");
                $("#step2").removeClass("active");
                $("#portlet_tab2,#portlet_tab3").removeClass("active");
                $("#portlet_tab1").addClass("active");
            } else if (num == 2) {
                $("#step1").removeClass("active").addClass("done");
                $("#step2").addClass("active");
                $("#step3").removeClass("active");
                $("#portlet_tab1,#portlet_tab3").removeClass("active");
                $("#portlet_tab2").addClass("active");
            } else if (num == 3) {
                $("#step2").removeClass("active").addClass("done");
                $("#step3").addClass("active");
                $("#portlet_tab1,#portlet_tab2").removeClass("active");
                $("#portlet_tab3").addClass("active");
            }
        }
    }
}();

/*********** 用户上课需求 ************/
var UserClassNeedFun = function () {
    var Config = {
        Sex: 0,
        Speak: 0,
        Teaching: 0,
        MyEng: 0,
        Num: 0
    }
    var Hand = function () {
        $(".select_lesson").click(function () {
            $(this).addClass("on").siblings().removeClass("on");
        });
        $(".label_radio").click(function () {
            $(this).addClass("r_on").siblings().removeClass("r_on");
        });
        $("#nextButton").click(function () {
            //if (Config.Sex != 0 && Config.Speak != 0 && Config.Teaching != 0 && Config.MyEng != 0) {
            if (Config.Teaching != 0 && Config.MyEng != 0) {
                $("#Step_3").show();
                $("#Step_2").hide();
            } else {
                bootbox.alert("请确定选择完成，在点击下一步！");
            }
        });
        $("#up_btn").click(function () {
            $("#Step_2").show();
            $("#Step_3").hide();
        });
        //老师性别要求
        //        $(".tutor_sex").click(function () {
        //            Config.Sex = $(this).attr("data-val");
        //        });
        //老师口音要求
        //        $(".tutor_speak").click(function () {
        //            Config.Speak = $(this).attr("data-val");
        //        });
        //我想上这个教材
        $(".teach_it").click(function () {
            Config.Teaching = $(this).val();
        });
        //我的英语水平
        $(".my_eng").click(function () {
            Config.MyEng = $(this).val();
        });
        //提交
        $("#over_btn").click(function () {
            var len = $("#Step_3").find("span.on").length;
            if (len != Config.Num) {
                bootbox.alert("对不起，请选择完成后，再提交！");
                return false;
            }
            var str = new Array();
            //str.push({ "AID": Config.Sex });
            str.push({ "AID": Config.MyEng })
            //str.push({ "AID": Config.Speak })
            str.push({ "AID": Config.Teaching })
            for (var i = 0; i < Config.Num; i++) {
                str.push({ "AID": $(".Les_Need" + (i + 1) + ".on").attr("data-val") });
            }
            var res = Fn.User.InsertChoice(JSON.stringify(str));
            if (res && res == 1) {
                $("#Step_3").html("");
                $("#Step_2").hide();
                var html = '<div class="alert alert-warning" style="margin: 25px"><div class="modal-header">';
                html += '<h2 class="modal-title text-success fa fa-check-circle" id="myModalLabel">';
                html += '恭喜您,提交成功!</h2>';
                html += '</div>';
                html += '<div class="modal-body">';
                html += ' <p> 温馨提示： 我们会根据您的需求，给您匹配最佳课程以及老师，<strong class="text-info">24小时内我们的学习顾问会主动联系您，请您耐心等待。</strong>若我们的学顾问未联系您，您可以联系我们的在线客服进行咨询。非常感谢您的理解与配合！</p>';
                html += '</div>';
                html += ' <div class="modal-footer">';
                html += ' <a href="/plans/" class="btn btn-danger fa fa-money">了解课程套餐</a><a href="/testing/" class="btn btn-primary fa fa-mortar-board"> 水平自测</a>';
                html += ' </div></div>';
                $("#Step_3").removeClass("container").addClass("main-container").html(html);
                $("#Step_3").show();
            } else {
                bootbox.alert("提交失败！");
                return false;
            }
        });
    };
    return {
        init: function (option) {
            Config = $.extend(true, Config, option);
            Hand();
        }
    };
}();

/********* 上课功能设置 **********/
var CheckFun = function () {
    var Config = {
        IsShowTen: 0
    };
    //基本
    var Che_fun = function () {
        //checkbox 按钮样式
        $("[class^=js-checkbox]").each(function (n) {
            i = document.querySelector(".js-checkbox_" + n),
                t = (new Switchery(i, {
                    color: "#1AB394"
                }), document.querySelector(".js-switch_2")),
                a = (new Switchery(t, {
                    color: "#ED5565"
                }), document.querySelector(".js-switch_3"));
            new Switchery(a, {
                color: "#1AB394"
            });
        });
        //radio 按钮样式
        $(".i-checks").iCheck({
            checkboxClass: "icheckbox_square-green",
            radioClass: "iradio_square-green"
        });

        $('#Deck1').on('ifClicked', function (event) {
            if ($(this).prop("checked") == true) { //这里就可以判断当前是否被选择了
                // DeskFun.init("上课提醒","您已经取消桌面提示");
            } else {
                DeskFun.init("上课提醒", "您看到此条信息桌面提醒设置成功");
            }
        });
        $('#Deck2').on('ifClicked', function (event) {
            if ($(this).prop("checked") == true) { //这里就可以判断当前是否被选择了
                // DeskFun.init("老师时间更新提醒","您已经取消桌面提示");
            } else {
                DeskFun.init("老师时间更新提醒", "您看到此条信息桌面提醒设置成功");
            }
        });
    };
    return {
        init: function (option) {
            Config = $.extend(true, Config, option);
            Che_fun();
        }
    }
}();

/********* 学生评价 **************/
var StundentFun = function () {
    var Stu_Fun = function () {
        //点星评分操作
        $(".tooltip-demo").each(function (n) {
            $(this).find("i").each(function (i) {
                $(this).click(function () {
                    $(".tooltip-demo").eq(n).find("i").attr("class", "fa fa-star-o");
                    for (var x = 0; x <= i; x++) {
                        $(".tooltip-demo").eq(n).find("i").eq(x).removeClass("fa-star-o").addClass("fa-star")
                    }
                    $(this).parent().parent().prev().val(i + 1);
                    //选择1
                    if ($("[name=tutor_score]").val() == 5 || $("[name=tutor_score]").val() == 0) {
                        $("[name=tutor_score]").parent().next().next().hide();
                    } else {
                        $("[name=tutor_score]").parent().next().next().show();
                    }
                    //选择2
                    if ($("[name=subject_score]").val() == 5 || $("[name=subject_score]").val() == 0) {
                        $("[name=subject_score]").parent().next().next().hide();
                    } else {
                        $("[name=subject_score]").parent().next().next().show();

                    }
                    //选择3
                    if ($("[name=service_score]").val() == 5 || $("[name=service_score]").val() == 0) {
                        $("[name=service_score]").parent().next().hide();
                    } else {
                        $("[name=service_score]").parent().next().show();

                    }
                }).mouseenter(function () {
                    $(".tooltip-demo").eq(n).find("i").attr("class", "fa fa-star-o");
                    for (var x = 0; x <= i; x++) {
                        $(".tooltip-demo").eq(n).find("i").eq(x).removeClass("fa-star-o").addClass("fa-star")
                    }
                }).mouseleave(function () {
                    $(".tooltip-demo").eq(n).find("i").attr("class", "fa fa-star-o");
                    for (var x = 0; x < $(this).parent().parent().prev().val(); x++) {
                        $(".tooltip-demo").eq(n).find("i").eq(x).removeClass("fa-star-o").addClass("fa-star")
                    }
                })
            })
        });

        function qita() { }

        //选择评价
        $(".chebox_dome label").click(function () {
            var thi = $(this);
            $(".chebox_domo label").each(function () {
                if ($(this).attr("for") == thi.attr("for")) {
                    $(this).css("display", "inline-block");
                    thi.hide();
                }
            })
        })

        $(".chebox_domo label").click(function () {
            var thi = $(this);
            if ($(this).attr("disabled") == "disabled") {

            } else {
                var thi = $(this);
                $(".chebox_dome label").each(function () {
                    if ($(this).attr("for") == thi.attr("for")) {
                        $(this).css("display", "inline-block");
                        thi.hide();
                    }
                })
            }
        });
    };
    return {
        init: function (option) {
            Stu_Fun();
        }
    }
}();

/********* tooltip-deomo ***********/
var TooltipFun = function () {
    var Tool_Fun = function () {
        $('.tooltip-demo').tooltip({
            selector: "[data-toggle=tooltip]"
        });
    };
    return {
        init: function () {
            Tool_Fun();
        }
    }
}();

/********* 桌面提醒 ***************/
var DeskFun = function () {
    var Desk_Fun = function (title, content) {
        if (!title && !content) {
            title = "桌面通知";
            content = "您看到此条信息桌面提醒设置成功";
        }
        var iconUrl = CDNUrl + "/web/webnew/assets/pages/img/Alarm.png";
        if (window.webkitNotifications) {
            //chrome老版本
            if (window.webkitNotifications.checkPermission() == 0) {
                var notif = window.webkitNotifications.createNotification(iconUrl, title, content);
                notif.display = function () { };
                notif.onerror = function () { };
                notif.onclose = function () { };
                notif.onclick = function () {
                    this.cancel();
                };
                notif.replaceId = 'Meteoric';
                notif.show();
            } else {
                window.webkitNotifications.requestPermission($jy.notify);
            }
        } else if ("Notification" in window) {
            // 判断是否有权限
            if (Notification.permission === "granted") {
                var notification = new Notification(title, {
                    "icon": iconUrl,
                    "body": content,
                });
            }
            //如果没权限，则请求权限
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {
                    // Whatever the user answers, we make sure we store the
                    // information
                    if (!('permission' in Notification)) {
                        Notification.permission = permission;
                    }
                    //如果接受请求
                    if (permission === "granted") {
                        var notification = new Notification(title, {
                            "icon": iconUrl,
                            "body": content,
                        });
                    } else {
                        ToastrFun.init('warning', '未获得权限', '设置失败');
                    }
                });
            }
        } else {
            ToastrFun.init('Error', '您的浏览器不支持桌面通知特性，请下载谷歌或火狐浏览器使用该功能', '设置失败');
            Modal_Fun.init("您的浏览器不支持桌面通知特性，请下载谷歌或火狐浏览器使用该功能", 1)
        }
    };
    return {
        init: function (title, content) {
            Desk_Fun(title, content);
        }
    }
}();

/********* Toastr提醒 *************/
var ToastrFun = function () {
    var Toastr_Fun = function (state, content, title) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-center",
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        if (state == "success") {
            toastr.success(content, title);
        } else if (state == "info") {
            toastr.info(content, title);
        } else if (state == "warning") {
            toastr.warning(content, title);
        } else if (state == "error") {
            toastr.error(content, title);
        }
    };
    return {
        init: function (state, content, title) {
            Toastr_Fun(state, content, title);
        }
    }
}();

/************** 视屏介绍 *******************/
var VideoFun = function () {
    var Video_Fun = function () {
        var clear = "&src=iqiyi.com&v=852178273&qd_src=vcl&qd_tm=1463127330415&qd_ip=116.213.69.54&qd_sc=2671c083e09bb9ea883c2b0deb7dd4cb&qypid=5426293209_-102463?&uuid=74d54536-57358d23-38&c=0&b=1&p=1"
        $("a[data-target$=Modal_Video]").mouseenter(function () {
            $(".ckplayer_play").html("<embed id='ckplayer_playerContent' align='middle' allowscriptaccess='always' allowfullscreen='true'quality='high' bgcolor='#FFF' wmode='transparent' src='/WebNew/assets/admin/global/plugins/ckplayer/ckplayer.swf' flashvars=" + $(this).attr("data-videosrc") + clear + "' name='ckplayer_playerContent' type='application/x-shockwave-flash' pluginspage='https://www.macromedia.com/go/getflashplayer'>");
        })
    }
    return {
        init: function () {
            Video_Fun();
        }
    }
}();

/************** Faq页面 ****************************/
var FaqFun = function () {
    var searchToggle = function (obj, evt) {
        var container = $(obj).closest('.search-wrapper');

        if (!container.hasClass('active')) {
            container.addClass('active');
            evt.preventDefault();
        } else if (container.hasClass('active') && $(obj).closest('.input-holder').length == 0) {
            container.removeClass('active');
            // clear input
            container.find('.search-input').val('');
            // clear and hide result container when we press close
            container.find('.result-container').fadeOut(100, function () {
                $(this).empty();
            });
        }
    }
    return {
        searchToggle: function (obj, evt) {
            searchToggle(obj, evt);
        }
    }
}();

/************** 语音播放 *********************************/
var Play_Mp3 = function () {
    var Play = function (why, lang, mp3) {
        var ukrse, enrse, TypeLang;
        if (lang == "uk") {
            TypeLang = 1;
        } else if (lang == "en") {
            TypeLang = 2;
        }
        if (navigator.appName == 'Microsoft Internet Explorer' && navigator.appVersion.split(';')[1].replace(/[ ]/g, '') == 'MSIE8.0') {
            why.html("<label class=\"myaudio2\"></label><embed style='display:none;' type=\"audio/mp3\" id='" + lang + "rse' src='//dict.youdao.com/dictvoice?audio=" + mp3 + "&type=" + TypeLang + "' autostart='false'  loop='false' />");
        } else {
            why.html("<label class=\"myaudio2\"></label><audio style='display:none;' id='" + lang + "rse' controls='controls' height='30' width='30'>" +
                "<source src='//dict.youdao.com/dictvoice?audio=" + mp3 + "&type=" + TypeLang + "' type='audio/mp3' />" +
                "<source src='//dict.youdao.com/dictvoice?audio=" + mp3 + "&type=" + TypeLang + "' type='audio/ogg' />" +
                "</audio>");
        }
        if ($("#ukrse").length == 1 && $("#enrse").length == 1) {
            ukrse = document.getElementById("ukrse");
            enrse = document.getElementById("enrse");
            $('span#uk label').mouseenter(function () {
                $(this).attr("class", "myaudio3");
            }).mouseleave(function () {
                if ($(this).attr("class") != "myaudio1") {
                    $(this).attr("class", "myaudio2");
                }
            }).click(function () {
                var myVid = $(this);
                var time = myVid.next()[0].duration * 1000;
                mp3_stop.init();
                ukrse.play()
                $(this).attr("class", "myaudio1");
                setTimeout(function () {
                    myVid.attr("class", "myaudio2");
                }, time);
            })
            $('span#sk label').mouseenter(function () {
                $(this).attr("class", "myaudio3");
            }).mouseleave(function () {
                if ($(this).attr("class") != "myaudio1") {
                    $(this).attr("class", "myaudio2");
                }
            }).click(function () {
                var myVid = $(this);
                var time = myVid.next()[0].duration * 1000;
                mp3_stop.init();
                enrse.play();
                $(this).attr("class", "myaudio1");
                setTimeout(function () {
                    myVid.attr("class", "myaudio2");
                }, time);
            })
            //                    $("span#uk").click(function(){
            //                        ukrse.play();
            //                    })
            //                    $("span#sk").click(function(){
            //                        enrse.play();
            //                    })
        }

    };
    return {
        Play: function (why, lang, mp3) {
            Play(why, lang, mp3);
        }
    }
}();

/************** 语音播放 *********************************/
var Play_m = function () {
    var en = function () {
        $(".EnVoice").each(function (i) {
            if (navigator.appName == 'Microsoft Internet Explorer' && navigator.appVersion.split(';')[1].replace(/[ ]/g, '') == 'MSIE8.0') {
                $(this).html("<label class=\"myaudio2\"></label><embed style='display:none;' type=\"audio/mp3\" src='//dict.youdao.com/dictvoice?audio=" + $.trim($(this).prev().prev().text()) + "&type=2' autostart='false'  loop='false' />");
            } else {
                $(this).html("<label class=\"myaudio2\">美:</label><audio style='display:none;' controls='controls' height='30' width='30'>" +
                    "<source src='//dict.youdao.com/dictvoice?audio=" + $.trim($(this).prev().prev().text()) + "&type=2' type='audio/mp3' />" +
                    "<source src='//dict.youdao.com/dictvoice?audio=" + $.trim($(this).prev().prev().text()) + "&type=2' type='audio/ogg' />" +
                    "</audio>");
            }
        })
        var EnVoice;
        $('.EnVoice label').mouseenter(function () {
            $(this).attr("class", "myaudio3");
        }).mouseleave(function () {
            if ($(this).attr("class") != "myaudio1") {
                $(this).attr("class", "myaudio2");
            }
        }).click(function () {
            var myVid = $(this);
            var time = myVid.next()[0].duration * 1000;
            EnVoice = $(this).next()[0];
            mp3_stop.init();
            EnVoice.play();
            $(this).attr("class", "myaudio1");
            setTimeout(function () {
                myVid.attr("class", "myaudio2");
            }, time);
        })
    };
    var uk = function () {
        $(".UkVoice").each(function (i) {
            if (navigator.appName == 'Microsoft Internet Explorer' && navigator.appVersion.split(';')[1].replace(/[ ]/g, '') == 'MSIE8.0') {
                $(this).html("<label class='myaudio2'></label><embed style='display:none;' type='audio/mp3' src='//dict.youdao.com/dictvoice?audio=" + $.trim($(this).prev().prev().prev().text()) + "&type=1' autostart='false'  loop='false' />");
            } else {
                if (navigator.appName == 'Microsoft Internet Explorer' && navigator.appVersion.split(';')[1].replace(/[ ]/g, '') == 'MSIE8.0') {
                    $(this).html('<label class="myaudio2"></label><embed style=\'display:none;\' type="audio/mp3" src=\'//dict.youdao.com/dictvoice?audio=' + $.trim($(this).prev().prev().prev().text()) + '&type=1\' autostart=\'false\'  loop=\'false\' />');
                } else {
                    if ($.trim($(this).prev().prev().prev().text()).indexOf(" ") == -1) {
                        $(this).html('<label class="myaudio2">英:</label><audio style=\'display:none;\' controls=\'controls\' height=\'30\' width=\'30\'>' +
                            '<source src=\'//dict.youdao.com/dictvoice?audio=' + $.trim($(this).prev().prev().prev().text()) + '&type=1\' type=\'audio/mp3\' />' +
                            '<source src=\'//dict.youdao.com/dictvoice?audio=' + $.trim($(this).prev().prev().prev().text()) + '&type=1\' type=\'audio/ogg\' />' +
                            '</audio>');
                    } else {
                        $(this).html("　　　");
                    }
                }
            }
        })
        var UkVoice;
        $('.UkVoice label').mouseenter(function () {
            $(this).attr("class", "myaudio3");
        }).mouseleave(function () {
            if ($(this).attr("class") != "myaudio1") {
                $(this).attr("class", "myaudio2");
            }
        }).click(function () {
            var myVid = $(this);
            var time = myVid.next()[0].duration * 1000;
            UkVoice = $(this).next()[0];
            mp3_stop.init();
            UkVoice.play();
            $(this).attr("class", "myaudio1");
            setTimeout(function () {
                myVid.attr("class", "myaudio2");
            }, time);
        })
    };
    return {
        init: function () {
            en();
            uk();
        }
    }
}();

/***************** 停止mp3 ********************/
var mp3_stop = function () {
    var fun = function () {
        if ($("audio").length > 0) {
            $("audio").each(function () {
                $(this)[0].pause();
                $(this)[0].currentTime = 0.0;
            })
        }
        if ($("EMBED").length > 0) {
            $("EMBED").each(function () {
                $(this)[0].stop();
            })
        }
    };
    return {
        init: function () {
            fun();
        }
    }
}();

/****************************** Modal ******************************************/
var Modal_Fun = function () {
    var Modal_funk = function (txt, type, om, btntext) {
        if (om != true) {
            om == false
        };
        if (btntext == "" || btntext == undefined || btntext == null) {
            btntext = "确　定"
        }
        if (type != 1 && type != 2) {
            var Modal = '<div class="modal fade" id="Modal_Fun_room" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                '<div class="modal-header" style="border:0;">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                '<h4 class="modal-title" id="myModalLabel"></h4>' +
                '</div>' +
                '<div class="modal-body" style="border:0;">' +
                '<div class="row">' +
                '<div class="col-md-5 text-center">' +
                '<img src="' + CDNUrl + '/web/webnew/assets/admin/pages/img/Modal_acLogo.gif" style="width:100%;height:auto;max-width:100px;" />' +
                '</div>' +
                '<div class="col-md-7 NeiRong">' +
                txt + //这里是提示内容
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="modal-footer" style="border:0;background:#1abc9c url("' + CDNUrl + '/web/webnew/assets/admin/pages/img/Modal_Bottom.gif") no-repeat top center ;height:65px;text-align:center;">' +
                '<a href="javascript:;" class="btn btn_Qud" data-dismiss="modal">　确　定　</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        } else {
            if (type == 2) {
                var Modal = '<div class="modal fade" id="Modal_Fun_room" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header" style="border:0;">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                    '<h4 class="modal-title" id="myModalLabel"></h4>' +
                    '</div>' +
                    '<div class="modal-body" style="border:0;">' +
                    '<div class="row">' +
                    '<div class="col-md-5 text-center">' +
                    '<img src="' + CDNUrl + '/web/webnew/assets/admin/pages/img/Modal_acLogo.gif" style="width:100%;height:auto;max-width:100px;" />' +
                    '</div>' +
                    '<div class="col-md-7 NeiRong">' +
                    txt + //这里是提示内容
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-footer" style="border:0;background:#1abc9c url("' + CDNUrl + '/web/webnew/assets/admin/pages/img/Modal_Bottom.gif") no-repeat top center ;height:65px;text-align:center;">' +
                    '<a href="javascript:;" class="btn btn_Qud" data-dismiss="modal">　确　定　</a>' +
                    '<a href="javascript:;" class="btn btn_Qux" data-dismiss="modal">　取　消　</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            } else if (type == 1) {
                var Modal = '<div class="modal fade" id="Modal_Fun_room" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header" style="border:0;">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                    '<h4 class="modal-title" id="myModalLabel"></h4>' +
                    '</div>' +
                    '<div class="modal-body" style="border:0;">' +
                    '<div class="row">' +
                    '<div class="col-md-5 text-center">' +
                    '<img src="' + CDNUrl + '/web/webnew/assets/admin/pages/img/Modal_acLogo.gif" style="width:100%;height:auto;max-width:100px;" />' +
                    '</div>' +
                    '<div class="col-md-7 NeiRong">' +
                    txt + //这里是提示内容
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-footer" style="border:0;background:#1abc9c url("' + CDNUrl + '/web/webnew/assets/admin/pages/img/Modal_Bottom.gif") no-repeat top center ;height:65px;text-align:center;">' +
                    '<a href="javascript:;" class="btn btn_Qud" data-dismiss="modal">　' + btntext + '　</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        };
        if ($("#Modal_Fun_room").length > 0) {
            $("#Modal_Fun_room").remove();
            $(".modal-backdrop.fade.in").remove();
        }
        $("body").append(Modal);
        $("#Modal_Fun_room").modal("show");

    }
    return {
        init: function (txt, type, om, btntext) { //om 表示关闭弹窗的时候是否重载当前页面
            Modal_funk(txt, type, om, btntext);
            $("#Modal_Fun_room .btn_Qux").click(function () {
                $("#Modal_Fun_room").attr("data-action", "false");
            });
            $("#Modal_Fun_room .btn_Qud").click(function () {
                $("#Modal_Fun_room").attr("data-action", "true");
            });
            if (om == true) {
                $('#Modal_Fun_room').on('hidden.bs.modal', function () {
                    window.location.reload();
                });
            }
            // 此方法获取操作的值
            //                $('#Modal_Fun_room').on('hidden.bs.modal', function () {
            //                   $("#Modal_Fun_room").attr("data-action");
            //                });
        }
    };
}();

var Click_dropdown = function () {
    var dropdown = function (obj) {
        if ($(obj).next().css("display") == "none") {
            $(obj).parent().parent().find("li.dropdown.dropdown-extended a.dropdown-toggle").each(function (i) {
                $(this).next().hide();
            });
            $(obj).next().toggle();
        } else {
            $(obj).parent().parent().find("li.dropdown.dropdown-extended a.dropdown-toggle").each(function (i) {
                $(this).next().hide();
            });
        }

        $(".page-container").click(function () {
            $("[id^=header_]").find("a.dropdown-toggle").each(function () {
                $(this).next().hide();
            })
        })
    }
    return {
        init: function (obj) {
            dropdown(obj);

        }
    }
}();

/****************************** 动态加载 ***************************************/
var JsCssFile = function () {
    var Add_JsCss_Fun = function (filename, filetype) {
        //动态加载一个js/css文件
        if (filetype == "js") {
            var fileref = document.createElement('script')
            fileref.setAttribute("type", "text/javascript")
            fileref.setAttribute("src", filename)
        } else if (filetype == "css") {
            var fileref = document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
    }
    var Remove_Js_Css_Fun = function (filename, filetype) {
        //移动已经加载过的js/css
        var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none"
        var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none"
        var allsuspects = document.getElementsByTagName(targetelement)
        for (var i = allsuspects.length; i >= 0; i--) {
            if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
                allsuspects[i].parentNode.removeChild(allsuspects[i])
        }
    }
    return {
        Add: function (filename, filetype) {
            Add_JsCss_Fun(filename, filetype);
        },
        Remove: function (filename, filetype) {
            Remove_Js_Css_Fun(filename, filetype);
        }
    }
}();

/****************************** 排行榜红包领取 ***************************************/
var RewardClaim = function () {
    var Reward = function () {
        //点击红包领取
        $("#Redenvelopes").click(function () {

            var AcGetNumber = $("#jlvalue").val();
            var res = Fn.NewUser.UserLearningReward(AcGetNumber);
            Modal_Fun.init("领取成功！", 1);

            $(".jlReward").html(AcGetNumber);
        });

    }
    return {
        init: function () {
            Reward();
        }
    }
}();
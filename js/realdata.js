//var t1 = window.setInterval("getrealdatabystation(1);",30000);
//getrealdatabynodeid(-1);
var chart_type = "", chart_unit = "", chart_max = 100, chart_min = 0, chart_sigle = "", is_have = false;
var start_angle = 0, end_angle = 180;
var myChart2 = echarts.init(document.getElementById('realdata_chart'));
var myChart = echarts.init(document.getElementById('realdata_gaugechart'));
var sname;
let isfirst = "true";
var maxval = 0, minval = 0, maxvalue = 0, minvalue = 0;
var colors = [];
var pageSize = 100;    //每页显示的记录条数
var curPage = 0;        //当前页
var lastPage;        //最后页
var direct = 0;        //方向
var len;            //总行数
var page;            //总页数
var begin;
var end;
var count;
var $table;
var sign = '>';
function initpage() {
    updatapcnav(3);
    if (typeof (Worker) !== "undefined") {//只在网络状态下可用，本地磁盘目录下不可用。
        if (typeof (w1) == "undefined") {
            w1 = new Worker("delay_worker.js");
        }
        var i = 0;
        w1.onmessage = function (event) {
            //document.getElementById("result").innerHTML = event.data;
            i++
            if (i % 60 == 0) {
                //getrealdatabynodeid(-1);
                decoderealdata();
                //getrealdatabynodeid(0);
            }
        };
    } else {
        //document.getElementById("result").innerHTML = "抱歉，你的浏览器不支持 Web Workers...";
        var t1 = window.setInterval("getrealdatabynodeid(-1);", 60000);
    }
    getrealdatabynodeid(-1);
}
//var t_pt=0;
//表格排序使用插件
/*$(function() {
    //$("#realtable").tablesort();		
});*/
function stopWorker() {
    w1.terminate();
    w1 = undefined;
};
var datas = [];
datas.splice(0, datas.length);//
for (var i = 0; i < 1; i++) {
    var value = 0;//(Math.random() * 100).toFixed(2) - 0;
    datas.push(JSON.parse('{"name":"","value":' + value + '}'));
    var value = 0;//(Math.random() * 100).toFixed(2) - 0;
    datas.push(JSON.parse('{"name":"","value":' + value + '}'));
}
updatachart(chart_type);
initseries(datas);
initchart2();
initpage();
function decoderealdata() {
    //$("#realdata-tbody tr").empty();
    obj_realdata = JSON.parse(localStorage.getItem("realdata"));
    $table = document.getElementById('realdata-tbody');
    //var tableLength = $table.rows.length;
    for (var j = $table.rows.length - 1; j >= 0; j--) {
        $table.removeChild($table.rows[j]);
    }
    var sensors = JSON.parse(localStorage.getItem("sensors"));
    var obj_data = new Object();
    var pt = 0;
    var kssj = getCurrentDate(1) + " 00:00:00";
    var jssj = getCurrentDate(2);
    if (sensors != null) {
        for (var i = 0; i < sensors.length; i++) {
            var sid = sensors[i].id + "";
            if ((obj_realdata) && (obj_realdata.hasOwnProperty(sid))) {
                sname = sensors[i].Value.Name;
                var xs = 1;//sensors[i].Value.Factor;  //数据结构修改，后台的value数据已经乘上系数，svalue为未乘以系数的原始数据
                var type_td = sensors[i].Value.Catalog;
                //if(type_td=="pd"){xs=xs*-1}
                obj_data = (obj_realdata)[sid];////
                //添加数据列表项
                var tr = document.createElement('tr');
                tr.setAttribute("onclick", "tableclick(this)");//ondblclick
                var tdename = document.createElement('td');
                //var tdsalary=document.createElement('td');
                var tdid = document.createElement('td');
                var tdtype = document.createElement('td');
                var tdtime = document.createElement('td');
                var tdvalue = document.createElement('td');
                var tdvalue2 = document.createElement('td');
                var tdhistory = document.createElement('td');
                var tdwarnlog = document.createElement('td');
                var tdmessage = document.createElement('td');
                tdename.innerHTML = sname;
                tdid.innerHTML = sid;
                tdid.style.cssText = "display:none";
                tdtype.innerHTML = type_td;
                tdtype.style.cssText = "display:none";
                tdtime.innerHTML = obj_data[0].Time; //jsonObject[i].color;
                kssj = (obj_data[0].Time).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
                jssj = obj_data[0].Time;
                tdvalue.innerHTML = (obj_data[0].Value * xs).toFixed(Number_of_decimal);
                //tdvalue2.innerHTML = (obj_data[0].Value*xs/1.5).toFixed(Number_of_decimal);//此处应为第二个数值，目前没有意义
                tdhistory.setAttribute('backgroundColor', '#ffffff');
                tdhistory.setAttribute('onclick', 'tohistory(' + sid + ')');
                tdhistory.innerHTML = "<button href='javascript:void(0)'>>></button>";
                tdwarnlog.setAttribute('onclick', 'towarnlog(' + sid + ')');
                tdwarnlog.setAttribute('backgroundColor', '#ffffff');
                //tdwarnlog.style.cssText="display:none";
                tdwarnlog.innerHTML = '<button href="javascript:void(0)">>></button>';
                var mes = obj_data[0].Message;
                tdmessage.innerHTML = mes;
                tdmessage.style.cssText = "display:none";
                tr.appendChild(tdename);
                tr.appendChild(tdtime);
                tr.appendChild(tdvalue);
                //tr.appendChild(tdvalue2);
                tr.appendChild(tdhistory);
                tr.appendChild(tdwarnlog);//z不显示
                tr.appendChild(tdid);//不显示
                tr.appendChild(tdtype);//不显示
                tr.appendChild(tdmessage);//不显示 告警信息
                var cl = "#000";
                //隔行显示不同的颜色
                //if (pt % 2 == 1) {
                //	cl="#16b9c9";
                //}
                if (mes) {
                    cl = "#f20";
                }
                tr.style.color = cl;
                pt++;
                $table.appendChild(tr);
                $(".time").text('');
                $(".sensorname").text('');
                $(".value1").text('');
                $(".value2").text('');
            }
        }
        //document.getElementById('count_val').innerHTML = pt + "条";
        //document.getElementById('normal_count').innerHTML=count-err_count+"条";
        //document.getElementById('err_count').innerHTML = 0 + "条";
        if (pt > 0) {
            var tableLength = $table.rows.length;
            for (var int = 0; int < tableLength; int++) {
                if ($table.rows[int].cells[5].innerHTML == sessionStorage.SensorId) {
                    sessionStorage.t_p = int;
                }
            }
            if (typeof (sessionStorage.t_p) != "undefined") {
                sname = $table.rows[sessionStorage.t_p].cells[0].innerHTML;
                chart_type = $table.rows[sessionStorage.t_p].cells[6].innerHTML;
                sensor_Id = parseInt($table.rows[sessionStorage.t_p].cells[5].innerHTML);
                var lasttime = $table.rows[sessionStorage.t_p].cells[1].innerHTML;
                //var myChart2 = echarts.init(document.getElementById('realdata_chart'));
                updatachart(chart_type);
                value0 = parseFloat($table.rows[sessionStorage.t_p].cells[2].innerHTML);
                //value1=parseFloat($table.rows[sessionStorage.t_p].cells[3].innerHTML);
                var heightpx = $("#realdata-tbody tr").height() + 1;//加1是网格线的宽度
                var ppt = +sessionStorage.t_p;
                $("#realdata-tbody").scrollTop((ppt) * heightpx);//表格重新滚动定位到选定的行
                $table.rows[ppt].style.backgroundColor = color_table_cur;
                if (isfirst != "true") {
                    var temp_option = myChart2.getOption();
                    if (temp_option.series[0]) {
                        if (temp_option.series[0].data[temp_option.series[0].data.length - 1][0] < strtodatetime(lasttime)) {
                            temp_option.series[0].data.push([strtodatetime(lasttime), value0, temp_option.series[0].data.length]);
                            //temp_option.series[1].data.push([strtodatetime(lasttime),value1,temp_option.series[1].data.length]);
                            if (maxvalue < value0) {
                                maxvalue = value0;
                                maxval = (maxvalue + (maxvalue - minvalue) * 0.2).toFixed(Number_of_decimal);
                                temp_option.yAxis[0].max = maxval;
                            }
                            if (minvalue > value0) {
                                minvalue = value0;
                                minval = (minvalue - (maxvalue - minvalue) * 0.2).toFixed(Number_of_decimal);
                                temp_option.yAxis[0].min = minval;
                            }
                            myChart2.setOption(temp_option);
                        }
                        if (maxvalue < value0) {
                            maxvalue = value0;
                            option.series[0].data[0].value = maxvalue;
                            option.series[1].data[0].value = value0;
                            //myChart.setOption(option);
                        }
                        refreshData();
                    }
                } else {
                    isfirst = "false";
                    //myChart2.showLoading();
                    gethistorydata(sensor_Id, kssj, jssj, 1);
                }
            }//else{	//$table.rows[0].ondblclick();	//}
        } else {
            layer.alert("没有符合条件的数据", info_showtime);
        }
    } else {
        layer.alert("没有符合条件的数据", info_showtime);
    }
    //$table.rows[t_pt].scrollIntoView();
    //refreshData();
    display();
}
function updatachart(atype) {
    switch (atype.toLowerCase()) {
        case "temp":
        case "tmp":
            chart_min = -30;
            chart_max = 170;
            start_angle = -45;
            chart_unit = "℃"
            chart_sigle = "";
            colors = [[0.15, '#1e90ff'], [0.4, '#090'], [0.6, '#ffa500'], [0.8, '#ff4500'], [1, '#ff0000']];
            break;
        case "pd":
            chart_min = 0;
            chart_max = -100;
            chart_unit = "dB";
            chart_sigle = ""
            colors = [[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']];
            break;
        default:
            chart_min = 0;
            chart_max = 100;
            chart_unit = "";
            chart_sigle = ""
            colors = [[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']];
    }
}
function tableclick(tr) {
    $(tr).siblings("tr[backgroundColor!='#ff0']").css("background", "");
    sessionStorage.t_p = tr.rowIndex - 1;
    sname = tr.cells[0].innerHTML;
    chart_type = tr.cells[6].innerHTML;
    updatachart(chart_type);
    value0 = parseFloat(tr.cells[2].innerHTML);
    //value1=parseFloat(tr.cells[3].innerHTML);
    if (parseInt(tr.cells[5].innerHTML) != sessionStorage.SensorId) {
        sessionStorage.SensorId = parseInt(tr.cells[5].innerHTML);
        var kssj = getCurrentDate(1) + " 00:00:00";
        var jssj = getCurrentDate(2);
        kssj = (tr.cells[1].innerHTML).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
        jssj = (tr.cells[1].innerHTML);
        myChart2.showLoading();
        gethistorydata(sessionStorage.SensorId, kssj, jssj, 1);
    }
    //maxval=0;
    refreshData();
    //moduletable("realdata-tbody");
    $(tr).css("background", color_table_cur);//区分选中行
    //var myChart2 = echarts.init(document.getElementById('realdata_chart'));
}
function initseries(data) {
    // 基于准备好的dom，初始化echarts实例
    // 指定图表的配置项和数据
    option = {
        backgroundColor: '#888',
        title: {
            left: '40%',
            offsetCenter: ['200%', '0'],
            textStyle: {
                color: 'white',
            },
            text: sname,
        },
        tooltip: {
            formatter: "{a} <br/>{c} {b}"
        },
        toolbox: {
            show: true,
            feature: {
                mark: {
                    show: true
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        series: [
            {
                name: '当天峰值',
                type: 'gauge',
                center: ['25%', '50%'], // 默认全局居中
                radius: '70%',//半径
                min: chart_min,
                max: chart_max,
                //startAngle: 135,//起始角度
                //endAngle: 35,//终止角度
                splitNumber: 5,//
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [0.2, 'green'],
                            [1, '#1f1f1f']
                        ],
                        color: [[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']],
                        width: 14,
                        /*shadowColor: 'yellow', //默认透明
                        shadowOffsetX:2,
                        shadowBlur: 10*/
                    }
                },
                axisTick: { // 坐标轴小标记
                    show: true,
                    splitNumber: 5,
                },
                axisLabel: {
                    textStyle: { // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    },
                },
                splitLine: { // 分隔线
                    length: 18, // 属性length控制线长
                    lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 2,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: {
                    show: true,
                    width: 3,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 0
                },
                title: {
                    show: true,
                    offsetCenter: [0, '-30%'], // x, y，单位px
                    textStyle: {
                        color: 'white',
                        fontSize: 24
                    }
                },
                detail: {
                    show: true,
                    offsetCenter: [0, '100%'],
                    formatter: ' {value}  \n\n' + '当天峰值: ' + ' ',//+chart_unit,
                    textStyle: {
                        fontSize: 20,
                        color: '#F8F43C'
                    }
                },
                data: [data[0]],//[{value: 20,name: '温度'}]
            },
            {
                name: '实时值',
                type: 'gauge',
                center: ['75%', "50%"], // 默认全局居中
                radius: '70%',//半径
                min: chart_min,
                max: chart_max,
                //startAngle: 315,//起始角度
                //endAngle: 225,//终止角度
                splitNumber: 5,//
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [0.2, 'green'],
                            [1, '#1f1f1f']
                        ],
                        color: [[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']],
                        width: 14,
                        /* shadowColor: 'yellow', //默认透明
                         shadowOffsetX:2,
                         shadowBlur: 10*/
                    }
                },
                axisTick: { // 坐标轴小标记
                    show: true,
                    splitNumber: 5,
                },
                axisLabel: {
                    textStyle: { // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    },
                },
                splitLine: { // 分隔线
                    length: 18, // 属性length控制线长
                    lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 2,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10,
                    }
                },
                pointer: {
                    show: true,
                    width: 3,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 5
                },
                title: {
                    show: true,
                    offsetCenter: [0, '-30%'], // x, y，单位px
                    textStyle: {
                        color: 'white',
                        fontSize: 24
                    }
                },
                detail: {
                    show: true,
                    offsetCenter: [0, '100%'],
                    formatter: '实时值:\n\n' + ' ' + ' {value}  ' + chart_unit,
                    textStyle: {
                        fontSize: 20,
                        color: '#F8F43C'
                    }
                },
                data: [data[1],],//[{value: 20,name: '温度'}]
            }
        ]
    };
    myChart.setOption(option);
}
//window.setInterval("getrealdatabynodeid(-1)",60000);
function refreshData() {
    //var myChart = echarts.init(document.getElementById('realdata_gaugechart'));
    if (chart_type == "pd") {
        option.series[0].data[0].value = minvalue
    } else {
        option.series[0].data[0].value = maxvalue;
    }
    val1 = eval("value" + 0);
    option.series[1].data[0].value = val1;
    for (var i = 0; i < option.series.length; i++) {
        option.series[i].axisLine.lineStyle.color = colors;
        option.series[i].max = chart_max;
        option.series[i].min = chart_min;
        value = option.series[i].data[0].value;
        option.series[i].detail.formatter = chart_sigle + value + ': \n\n' + option.series[i].name + ' ';//+chart_unit;
        option.series[i].data[0].name = chart_unit;//sname;
        option.title.text = sname;
        //形成进度条式的填充仪表效果并分段显示不同延时用于指示不同状态。    
        /*if(value<20){
            option.series[i].axisLine.lineStyle.color[0]=[value/100,'blue'];
        }else if(value<80){
            option.series[i].axisLine.lineStyle.color[0]=[value/100,"green"];
        }else{
            option.series[i].axisLine.lineStyle.color[0]=[value/100,"red"];
        }*/
    }
    myChart.setOption(option);
}
function decodedatas(obj_chartdata) {
    //maxval=0;
    //var iserror = false,
    //err_info = "获取";
    //var isnull = false,
    //nullname = "";
    var pa = [];
    //pb = [],
    //pc = [];
    //labels = [],
    //t;
    myChart2.clear();
    if (obj_chartdata == null) {
        myChart2.hideLoading();
        return;
        //drawchart();
    }
    minval = maxval = obj_chartdata[0].Value;
    for (var i = 0; i < obj_chartdata.length; i++) {
        pa.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value, i])
        //pb.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value/1.5, i])
        //pc.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value/2, i])
        if (parseFloat(obj_chartdata[i].Value) > maxval) {
            maxval = obj_chartdata[i].Value;
        }
        if (parseFloat(obj_chartdata[i].Value) < minval) {
            minval = obj_chartdata[i].Value;
        }
    }
    maxvalue = (maxval * 1).toFixed(Number_of_decimal);
    minvalue = (minval * 1).toFixed(Number_of_decimal);
    maxval = (maxval * 1 + (maxval - minval) * 0.2).toFixed(Number_of_decimal);
    minval = (minval * 1 - (maxval - minval) * 0.2).toFixed(Number_of_decimal);
    var lengenddata = [];
    lengenddata.push("当天峰值");
    lengenddata.push("实时值");
    //lengenddata.push(document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text+"457");
    option.series[0].data[0].value = maxvalue;
    option.series[0].data[0]
    //myChart.setOption(option);
    refreshData();
    drawchart();
    //绘制图形线条
    function drawchart() {
        //var myChart = echarts.init(document.getElementById('main'));
        var lengenddata1 = [];
        lengenddata1.push("实时值");
        var option2 = {
            color: ['#FF0000', '#FFFF00'],//,'#00ff00'
            backgroundColor: '#d0d0d0',
            title: {
                text: '当天变化趋势图',
                x: "center",
            },/**/
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var date = new Date(params.value[0]);
                    data = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
                    return data + '<br/>' + params.value[1];
                }
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    magicType: {
                        show: true,
                        type: ['line']
                    },
                    //, 'bar', 'stack', 'tiled'
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            dataZoom: {
                show: true,
                start: 0
            },
            legend: {
                data: lengenddata1,
                orient: "horizontal",//"vertical",
                x: 'center',
                y: '30',
                //color: 'white',
            },
            grid: {
                y2: 80
            },
            xAxis: [{
                type: 'time',
                splitNumber: 10,
                axisLine: {
                    lineStyle: {
                        color: 'black',
                        width: 2
                    },
                    onZero: false,
                },
            }],
            yAxis: [{
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: 'black',
                        width: 2
                    }
                },
                min: minval,
                max: maxval,
            }],
            series: [/**/{
                name: lengenddata1[0],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text,
                type: 'line',
                showAllSymbol: true,
                symbolSize: 1,
                data: pa,
                smooth: true//平滑曲线
            },
                /*{
                    name: lengenddata[1],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text+"177",
                    type: 'line',
                    showAllSymbol: true,
                    symbolSize: 1,
                    data: pb,
                    smooth: true//平滑曲线
                },
                {
                    name: document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text+"457",
                    type: 'line',
                    showAllSymbol: true,
                    symbolSize: 1,
                    data: pc
                }*/
            ]
        };
        myChart2.hideLoading();
        myChart2.setOption(option2);
    }
}
function initchart2() {
    var option2 = {
        color: ['#FFFF00', '#FF0000'],//,'#00ff00'
        backgroundColor: '#c0c0c0',
        title: {
            text: '当天变化趋势图',
            x: "center",
        },/**/
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                var date = new Date(params.value[0]);
                data = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
                return data + '<br/>' + params.value[1];
            }
        },
        toolbox: {
            show: true,
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: {
                    show: true,
                    type: ['line']
                },
                //, 'bar', 'stack', 'tiled'
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        dataZoom: {
            show: true,
            start: 0
        },
        legend: {
            data: [],//lengenddata,
            orient: "horizontal",//"vertical",
            x: 'center',
            y: '30',
            //color: 'white',
        },
        grid: {
            y2: 80
        },
        xAxis: [{
            type: 'time',
            splitNumber: 10,
            axisLine: {
                lineStyle: {
                    color: 'black',
                    width: 2,
                },
                onZero: false,
            },
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: 'black',
                    width: 2
                }
            },
            min: minval,
            max: maxval,
        }],
        series: [/**/{
            name: '',//lengenddata[0],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text,
            type: 'line',
            showAllSymbol: true,
            symbolSize: 1,
            data: [0]
        },
			/*{
				name: '',//lengenddata[1],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text+"177",
				type: 'line',
				showAllSymbol: true,
				symbolSize: 1,
				data: []
			},
			{
				name: document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text+"457",
				type: 'line',
				showAllSymbol: true,
				symbolSize: 1,
				data: pc
			}*/
        ]
    };
    //myChart2.hideLoading();
    myChart2.setOption(option2);
}
function display() {
    //var $table=$("#warnlogdata-tbody");
    len = $table.rows.length;// - 1;    // 求这个表的总行数，剔除第一行介绍
    page = len % pageSize == 0 ? len / pageSize : Math.floor(len / pageSize) + 1;//根据记录条数，计算页数
    // alert("page==="+page);
    curPage = 1;    // 设置当前为第一页
    displayPage(1);//显示第一页
    document.getElementById("btn0").innerHTML = "当前 " + curPage + "/" + page + " 页    每页 ";    // 显示当前多少页
    document.getElementById("sjzl").innerHTML = "数据总量 <span class='badge' style='font-size:18px'>" + len + "";        // 显示数据量
    document.getElementById("pageSize").value = pageSize;
}
function firstPage() {    // 首页
    curPage = 1;
    direct = 0;
    displayPage();
}
function frontPage() {    // 上一页
    direct = -1;
    displayPage();
}
function nextPage() {    // 下一页
    direct = 1;
    displayPage();
}
function LastPage() {    // 尾页
    curPage = page;
    direct = 0;
    displayPage();
}
function changePage() {    // 转页
    curPage = document.getElementById("changePage").value * 1;
    if (!/^[1-9]\d*$/.test(curPage)) {
        layer.alert("请输入正整数", info_showtime);
        return;
    }
    if (curPage > page) {
        layer.alert("超出数据页面", info_showtime);
        return;
    }
    direct = 0;
    displayPage();
}
function setPageSize() {    // 设置每页显示多少条记录
    pageSize = document.getElementById("pageSize").value;    //每页显示的记录条数
    if (!/^[1-9]\d*$/.test(pageSize)) {
        layer.alert("请输入正整数", info_showtime);
        return;
    }
    len = $table.rows.length - 1;
    page = len % pageSize == 0 ? len / pageSize : Math.floor(len / pageSize) + 1;//根据记录条数，计算页数
    curPage = 1;        //当前页
    direct = 0;        //方向
    firstPage();
    displayPage();
}
function displayPage() {
    if (curPage <= 1 && direct == -1) {
        direct = 0;
        layer.alert("已经是第一页了", info_showtime);
        return;
    } else if (curPage >= page && direct == 1) {
        direct = 0;
        layer.alert("已经是最后一页了", info_showtime);
        return;
    }
    lastPage = curPage;
    // 修复当len=1时，curPage计算得0的bug
    if (len > pageSize) {
        curPage = ((curPage + direct + len) % len);
    } else {
        curPage = 1;
    }
    document.getElementById("btn0").innerHTML = "当前 " + curPage + "/" + page + " 页    每页 ";        // 显示当前多少页
    begin = (curPage - 1) * pageSize;// 起始记录号
    end = begin + 1 * pageSize;    // 末尾记录号
    if (end > len) end = len;
    //var theTable=$("#warnlogdata-tbody");// document.getElementById("warnlogdata-tbody");
    for (var i = 0; i < len; i++) {
        $table.rows[i].style.display = 'none';
    }
    for (var i = begin; i < end; i++) {
        $table.rows[i].style.display = '';
    }
    /*$table.find("tr").hide();    // 首先，设置这行为隐藏
    $table.find("tr").each(function(i){    // 然后，通过条件判断决定本行是否恢复显示
        if((i>=begin && i<=end) )//显示begin<=x<=end的记录
            $(this).show();
    });*/
}
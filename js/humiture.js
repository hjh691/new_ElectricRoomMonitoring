//const { data } = require("jquery");

var chartgauge=echarts.init(document.getElementById("ht-gauge"));
function initgauge(divid,data){
    var option={
        backgroundColor: '#7b7b7b',
        tooltip: {
            formatter:  "{a}: <br/>{c} "
        },
        toolbox: {
            show: false,
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
        series: [{ 
            name: data[0].name,//'温度',
            type: 'gauge',
            center: ['50%', "50%"], // 默认全局居中
            radius: '80%',//半径
            min: -20,
            max: 180,
            startAngle: 145,//起始角度
            endAngle:35,//终止角度
            splitNumber: 5,//坐标轴的刻度线数量，大刻度
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [[0.15, '#1e40ff'],[0.85, 'lime'],[1, '#ff4500']],
                    width: 10,
                    //shadowColor : '#fff', //默认透明
                    //shadowBlur: 10,
                },
            },
            splitLine: { // 分隔线
                length: 18, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 1,
                    color: '#fff',
                // shadowColor: '#fff', //默认透明
                    //shadowBlur: 10,
                },
            },
            axisTick: { // 坐标轴上的小刻度线
                show: true,
                splitNumber:10,//细分标线个数
                length:8,
                lineStyle:{
                    color:'#000',
                },
            },
            axisLabel: {
                textStyle: { // 属性lineStyle控制线条样式
                    //fontWeight: 'bolder',
                    color: '#fff',
                    //shadowColor: '#fff', //默认透明
                    //shadowBlur: 10,
                    fontSize:14,
                },
            },
            pointer: {
                show:true,
                width: 3,
                length:'100%',
                shadowColor: '#fff', //默认透明
                shadowBlur: 5,
                color:"#0f0",
            },
            title: {
                show: true,
                offsetCenter: [0, '-60%'], // x, y，单位px
                textStyle: {
                    color: 'white',
                    fontSize: 18,
                },
            },
            detail: {
                show: true,
                offsetCenter: ['0', '-130%'],
                formatter:  "温度: {value} ℃",
                textStyle: {
                    fontSize: 18,
                    color:'#F8F43C',
                },
            },
            data:[data[0]],//[{value: 20,name: '温度'}],// [data]
            },
            { 
            name: data[1].name,//'湿度',
            type: 'gauge',
            center: ['50%', "50%"], // 默认全局居中
            radius: '80%',//半径
            min: 100,
            max: 0,
            startAngle: -45,//起始角度
            endAngle:-135,//终止角度
            splitNumber: 5,//
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [[0.2, '#1e40ff'],[0.80, 'lime'],[1, '#ff4500']],
                    width: 10,
                    //shadowColor : '#fff', //默认透明
                    //shadowBlur: 10,
                },
            },
            splitLine: { // 分隔线
                length: 18, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 1,
                    color: '#fff',
                // shadowColor: '#fff', //默认透明
                    //shadowBlur: 10,
                },
            },
            axisTick: { // 坐标轴小标记
                show: true,
                splitNumber:10,
                lineStyle:{
                    color: '#000',
                },
            },
            axisLabel: {
                textStyle: { // 属性lineStyle控制线条样式
                    //fontWeight: 'bolder',
                    color: '#fff',
                    //shadowColor: '#fff', //默认透明
                    //shadowBlur: 10,
                    fontSize:14,
                },
            },
            pointer: {
                show:true,
                width: 3,
                length:'100%',
                shadowColor: '#fff', //默认透明
                shadowBlur: 5,
            },
            title: {
                show: true,
                offsetCenter: [0, '60%'], // x, y，单位px
                textStyle: {
                    color: 'white',
                    fontSize: 18,
                },
            },
            detail: {
                show: true,
                offsetCenter: ['0', '130%'],
                formatter: '湿度: {value}'+'%',
                textStyle: {
                    fontSize: 18,
                    color:'#F8F43C',
                },
            },
            data:[data[1]],//[{value: 20,name: '湿度'}],// [data]
        }]
    }
    divid.setOption(option);
}
initgauge(chartgauge,[{value:65,name:"温度"},{value:10,name:"湿度"}])
var chart_line=echarts.init(document.getElementById("ht-chart"));
function initlinechart(divid,data){
    var option = {
        title: {
            text: '温湿度变化趋势',
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                param = params[0];
                var date = new Date(param.name);
                return date.getFullYear()+'-'+ (date.getMonth() + 1)+date.getDate()+ ' '+date.getHours()+':'+date.getMinutes()+'  <br/> ' +" 温度 ："+ params[0].value[1]+"℃ <br/>  湿度 ："+params[1].value[1]+" %";
            },
            axisPointer: {
                animation: false,
            },
           /* trigger: 'axis',
            axisPointer: {
                animation: false
            }*/
        },
        axisPointer: {
            link: {xAxisIndex: 'all'}//两个图的指针关联，否则上边的params[0].value[1]报错。
        },
        grid: [{
            left: 50,
            right: 50,
            height: '25%'
        }, {
            left: 50,
            right: 50,
            top: '55%',
            height: '25%'
        }],
        xAxis: [{//x轴和y轴都需要有两套。
            type: 'time',
            splitLine: {
                show: false,
            },
            axisLine: {onZero: true},
        },
        {
            type:'time',
            gridIndex: 1,
            axisLine: {onZero: true},
            //position: 'top'
        }
        ],
        yAxis: [{
            name: '温度',
            type: 'value',
            //boundaryGap: [0, '100%'],
            splitLine: {
                show: false,
            },
            max:200,
            min:-30,
        },{
            name: '湿度',
            type: 'value',
            //namelocation: 'start',
            gridIndex: 1,
            max: 100,
            min:0,
            //inverse: true,
        }
        ],
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 1,
                end: 100,
                xAxisIndex: [0, 1]
            },
            {
                type: 'inside',
                realtime: true,
                start: 1,
                end: 100,
                xAxisIndex: [0, 1]
            }
        ],
        legend: {
            data: ["温度","湿度"],
            color: '#FF0000',
            x: 'center',
            y: 'top',
            orient :'horizontal',//'vertical',
        },
        series: [{
            name: '温度',
            type: 'line',
            color:"#f00",
            showSymbol: false,
            hoverAnimation: false,
            data: data[0],
        },
        {
            name: '湿度',
            type: 'line',
            color:"#00f",
            xAxisIndex: 1,
            yAxisIndex: 1,
            showSymbol: false,
            hoverAnimation: false,
            data: data[1],
        }],
    };
    divid.setOption(option);
}
function randomData() {
    now = new Date(+now + oneHour);
    value =  Math.random() * 180 - 20;
    value1 =  Math.random() * 100 - 0;
    var min=now.getMinutes();
    if(min<10){
        min="0"+min;
    }
    return [{name: now.toString(),
        value:[[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')+" "+now.getHours()+":"+min,
        Math.round(value)]},
        {name: now.toString(),value:[[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')+" "+now.getHours()+":"+min,
        Math.round(value1)]
        }
    ];
}
var datas = [];
var data1=[],data2=[];
var now = +new Date(2020,6, 1,3,8);
var oneHour=600*1000;
var oneDay = 24*oneHour;
var value = Math.random() * 10;
for (var i = 0; i < 99; i++) {
    var value2=randomData();
    data1.push(value2[0]);
    data2.push(value2[1]);
}
datas.push(data1);
datas.push(data2);
initlinechart(chart_line,datas);
setInterval(function () {
    
    for (var i = 0; i <1; i++) {
        data1.shift();
        data2.shift();
        var value3=randomData();
        //data1.push(value3[0]);
        //data2.push(value3[1]);
    }
    refresh_hum_temp(new Date(+now + oneHour),value3[0].value[1],value3[1].value[1]);
    /*datas.splice(0,datas.length);//
    datas.push(data1);
    datas.push(data2);
    chart_line.setOption({
        series: [{
            //data: datas[0],
        },
        {
            data:datas[1],
        },
    ],
    });
    chartgauge.setOption({
        series:[
            {
                data:[{name:"温度",value:value3[0].value[1]}],
            },
            {
                data:[{name:"湿度",value:value3[1].value[1]}],
            },
        ],
    });*/
}, 3000);
function iniview(){
    var sel_sensor=document.getElementById("jcdd");
	for (var i = 0; i < sel_sensor.length; i++) {
		sel_sensor.removeChild(sel_sensor.options[0]);
		sel_sensor.remove(0);
		sel_sensor.options[0] = null;
	}
	sensors=JSON.parse(localStorage.getItem("sensors"));
	configs=JSON.parse(localStorage.getItem("Configs"));
	if(sensors!=null){
		for(var i=0;i<sensors.length;i++){
			if((sensors[i].Value.ParentId!="-1")&&(sensors[i].Value.ParentId!=parentid)){
				parentid=sensors[i].Value.ParentId;
				for(var j=0;j<sensors.length;j++){
					if(sensors[j].id==parentid){
						parentname=sensors[j].Value.Name+"_";
						break;
					}
				}
			}
			var map=new Object();
			map.value=sensors[i].id;
			map.name=parentname+sensors[i].Value.Name; 
			maps.push(map);
		}
		var compare = function (obj1, obj2) {
			var val1 = obj1.name;
			var val2 = obj2.name;
			if (val1 < val2) {
				return -1;
			} else if (val1 > val2) {
				return 1;
			} else {
				return 0;
			}            
		} 
		maps.sort(compare);
		for(var k=0;k<maps.length;k++){
			var op=document.createElement("option");
			op.setAttribute("value",maps[k].value);
			op.innerHTML=maps[k].name;
			sel_sensor.appendChild(op);
		}
	}
	setSelectOption("jcdd", sessionStorage.SensorId);
}
function refresh_hum_temp(atime,avalue,avalue2){
    //data1.shift();
    var min=atime.getMinutes();
    if(min<10){
        min="0"+min;
    }
    data1.push({name:atime.toString(),value:[[atime.getFullYear(), atime.getMonth() + 1, atime.getDate()].join('/')+" "+atime.getHours()+":"+min,avalue]});
    data2.push({name:atime.toString(),value:[[atime.getFullYear(), atime.getMonth() + 1, atime.getDate()].join('/')+" "+atime.getHours()+":"+min,avalue2]});
    chart_line.setOption({series:[{
            data:data1,
        },
        {
            data:data2,
        }],
    });
    chartgauge.setOption({
        series:[
            {
                data:[{name:"温度",value:avalue}],
            },
            {
                data:[{name:"湿度",value:avalue2}],
            },
        ],
    });
}
function refresh_hum_swet(atime,avalue2){
    data2.push({name:atime.toString(),value:[[atime.getFullYear(), atime.getMonth() + 1, atime.getDate()].join('/')+" "+atime.getHours()+":"+min,avalue2]});
    chart_line.setOption({
        series:[{
            data:data1,
        },
        {
            data:data2,
        }],
});
}
function gradeChange() {
    var objS = document.getElementById("jcdd");
    sessionStorage.SensorId = objS.options[objS.selectedIndex].value;
    gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj,sessionStorage.jssj);
}
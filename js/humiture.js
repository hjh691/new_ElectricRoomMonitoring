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
            splitNumber: 5,//
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [[0.15, '#1e40ff'],[0.85, 'lime'],[1, '#ff4500']],
                    width: 10,
                    //shadowColor : '#fff', //默认透明
                    //shadowBlur: 10
                }
            },
            splitLine: { // 分隔线
                length: 18, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 1,
                    color: '#fff',
                // shadowColor: '#fff', //默认透明
                    //shadowBlur: 10
                }
            },
            axisTick: { // 坐标轴小标记
                show: true,
                splitNumber:4,
                length:8,
                lineStyle:{
                    color:'#000',
                }
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
                }
            },
            detail: {
                show: true,
                offsetCenter: ['0', '-130%'],
                formatter:  "温度: {value} ℃",
                textStyle: {
                    fontSize: 18,
                    color:'#F8F43C',
                }
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
                    //shadowBlur: 10
                },
            },
            splitLine: { // 分隔线
                length: 18, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 1,
                    color: '#fff',
                // shadowColor: '#fff', //默认透明
                    //shadowBlur: 10
                },
            },
            axisTick: { // 坐标轴小标记
                show: true,
                splitNumber:5,
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
            text: '温湿度变化趋势'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                param = params[0];
                var date = new Date(param.name);
                return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : <br/> ' +" 温度 ："+ params[0].value[1]+"℃ <br/>  湿度 ："+params[1].value[1]+" %";
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            }
        },
        dataZoom: {
            show: true,
            start: 0
        },
        legend: {
            data: ["温度","湿度"],
            color: '#FF0000',
            x: 'right',
            y: 'top',
            orient : 'vertical',
        },
        grid: {
            show:true,
        },
        series: [{
            name: '温度',
            type: 'line',
            color:"#f00",
            showSymbol: false,
            hoverAnimation: false,
            data: data[0]
        },
        {
            name: '湿度',
            type: 'line',
            color:"#00f",
            showSymbol: false,
            hoverAnimation: false,
            data: data[1]
        }]
    };
    divid.setOption(option);
}
function randomData() {
    now = new Date(+now + oneHour);
    value =  Math.random() * 200 - 20;
    value1 =  Math.random() * 100 - 0;
    return [{name: now.toString(),
        value:[[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')+" "+now.getHours(),
        Math.round(value)]},
        {name: now.toString(),value:[[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')+" "+now.getHours(),
        Math.round(value1)]
        }
    ]
}
var datas = [];
var data1=[],data2=[];
var now = +new Date(2020,3, 3);
var oneHour=3600*1000;
var oneDay = 24*oneHour;
var value = Math.random() * 10;
for (var i = 0; i < 24; i++) {
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
        data1.push(value3[0]);
        data2.push(value3[1]);
    }
    datas.splice(0,datas.length);//
    datas.push(data1);
    datas.push(data2);
    chart_line.setOption({
        series: [{
            data: datas[0]
        },
        {
            data:datas[1]
        }
    ]
    });
    chartgauge.setOption({
        series:[
            {
                data:[{name:"温度",value:value3[0].value[1]}],
            },
            {
                data:[{name:"湿度",value:value3[1].value[1]}],
            }
        ]
    });
}, 3000);

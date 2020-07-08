var chart_P=echarts.init(document.getElementById("chart-P"),'light');
var chart_vA=echarts.init(document.getElementById("chart-vA"));
var chart_vB=echarts.init(document.getElementById("chart-vB"));
var chart_vC=echarts.init(document.getElementById("chart-vC"));
var chart_iA=echarts.init(document.getElementById("chart-iA"));
var chart_iB=echarts.init(document.getElementById("chart-iB"));
var chart_iC=echarts.init(document.getElementById("chart-iC"));
var chart_p=echarts.init(document.getElementById("chart-p"));
var chart_va=echarts.init(document.getElementById("chart-va"));
var chart_vb=echarts.init(document.getElementById("chart-vb"));
var chart_vc=echarts.init(document.getElementById("chart-vc"));
var chart_ia=echarts.init(document.getElementById("chart-ia"));
var chart_ib=echarts.init(document.getElementById("chart-ib"));
var chart_ic=echarts.init(document.getElementById("chart-ic"));
//初始化数据
var category = ['A相功率','B相功率', 'C相功率'];
var barDatas = [[800, 850, 750],[450,600,1200]];
initbarchart(chart_P,barDatas[0]);
initbarchart(chart_p,barDatas[1]);
initgaugechart(chart_va,[{name:'a相电压',value:300}]);
initgaugechart(chart_vb,[{name:'b相电压',value:300}]);
initgaugechart(chart_vc,[{name:'c相电压',value:300}]);
initgaugechart(chart_ia,[{name:'a相电流',value:5}]);
initgaugechart(chart_vA,[{name:'A相电压',value:300}]);
initgaugechart(chart_vB,[{name:'B相电压',value:300}]);
initgaugechart(chart_vC,[{name:'C相电压',value:300}]);
initgaugechart(chart_ib,[{name:'b相电流',value:5}]);
initgaugechart(chart_ic,[{name:'c相电流',value:5}]);
initgaugechart(chart_iA,[{name:'A相电流',value:5}]);
initgaugechart(chart_iB,[{name:'B相电流',value:5}]);
initgaugechart(chart_iC,[{name:'C相电流',value:5}]);
window.setInterval(refreshchart,5000);/**/
function initbarchart(chartid,bardata){
    var option_bar = {
        title :{
            show:true,
            text: '功率(Kw)',
            textStyle:{
                color: "blue",
            },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        color: ['#ff0', '#0F0','#F00'],
        grid: {
            x: 20,//left: '2%',
            y: 25,//right: '5%',
            x2: 30,//bottom: '2%',
            y2: 20,//top:'2%',
            containLabel: true,
            borderColor :"#fff",
            borderWidt:1,
        },
        xAxis: {
            type: 'value',
            //max: 2000,
            axisLine: {
                show: true,
                lineStyle:{
                    color:"#fff",
                    width:2,
                }
            },
            axisLabel:{
                show:true,
                textStyle:{color:"#fff"},
                color:"#fff"
            },
            axisTick: {
                show: false
            },
            position: 'top',
            //axisLabel :{
                //formatter : '{value}Kw',
                //rotate :30,
            //},
        },
        yAxis: {
            type: 'category',
            data: category,
            splitLine: {show: true},
            axisLine: {
                show: true,
                lineStyle:{
                    color:"#fff",
                    width:2,
                },
            },
            axisTick: {
                show: false
            },
            axisLabel:{
                show:true,
                textStyle:{color:"#fff"},
                color:"#fff",
            },
            offset: 0,
            nameTextStyle: {
                fontSize: 15
            },
            inverse: true,
        },
        series: [
            {
                name: '数量',
                type: 'bar',
                data: bardata,
                barWidth: 14,
                barGap: 10,
                smooth: true,
                label: {
                    normal: {
                        show: true,//
                        position: 'right',
                        offset: [5, -2],
                        textStyle: {
                            color: '#F68300',
                            fontSize: 13,
                        }
                    }
                },
                itemStyle: {
                    emphasis: {
                        barBorderRadius: 2
                    },
                    normal: {
                        barBorderRadius: 7,
                        color : new echarts.graphic.LinearGradient(
                            0, 0, 1, 0,
                            [
                                {offset: 0, color: '#3977E6'},
                                {offset: 1, color: '#37BBF8'},
                                {offset: 0, color: '#3977E6'},
                            ]
                        ),/*['#ff0', '#0F0','#F00'],'#39F736'*/
                    },
                }
            }
        ]
    };
    chartid.setOption(option_bar);
}
function initgaugechart(chartid,data){
    var unit="V",vmax=400,spl=4;
    var str=new Object();
    str=data[0];
    if(((str.name).indexOf("电压"))>0){
        unit="V";vmax=400;spl=4;
    }else{unit="A";vmax=5;spl=5}
    var option_gauge= {
        backgroundColor: '#fff',
        tooltip: {
            formatter:  "{a}: <br/>{c} "+unit
        },
        grid:{
            show:true,
            bolderColor:'rgba(255,0,0,1)',
            bolderWidth : 3,
            bolderType:'dotted',
            top:'10%',
            left:'20%',
            bottom:'27%',
            right:'17%',
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
            name: data[0].name,//'电压',
            type: 'gauge',
            center: ['80%', "70%"], // 默认全局居中
            radius: '100%',//半径
            min: 0,
            max: vmax,
            startAngle: 180,//起始角度
            endAngle: 90,//终止角度
            splitNumber: spl,//
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [[1, '#000']],//[0.29, 'lime'],[0.86, '#1e90ff']
                    width: 0,
                    //shadowColor : '#000', //默认透明
                    //shadowBlur: 10
                }
            },
            axisTick: { // 坐标轴小标记
                show: true,
                splitNumber:5,
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 1,
                    color: '#f22',
                }
            },
            axisLabel: {
                distance: -30,//控制刻度值的位置
                textStyle: { // 属性lineStyle控制线条样式
                    //fontWeight: 'bolder',
                    color: '#000',
                    //shadowColor: '#fff', //默认透明
                    //shadowBlur: 10,
                    fontSize:12,
                },
            },
            splitLine: { // 分隔线
                length: 12, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 2,
                    color: '#000',
                    shadowColor: '#000', //默认透明
                    shadowBlur: 10,
                }
            },
            pointer: {
                show:true,
                width: 2,
                length : '100%',
                color: '#F00',
                shadowColor: '#00f', //默认透明
                shadowBlur: 5,
            },
            itemStyle:{
                color:'#000',
                bolderColor:"#000",
                bolderWidth:2,
                bolderType:'dotted',
            },
            title: {
                show: true,
                offsetCenter: ['-110%', '-120%'], // x, y，单位px
                textStyle: {
                    color: 'black',
                    fontSize: 16,
                    fontStyle: 'bolder',
                }
            },
            detail: {
                show: true,
                offsetCenter: ['-40%', '30%'],
                formatter: '{value}'+unit,
                textStyle: {
                    fontSize: 14,
                    color:'#18343C'
                }
            },
            data:[data[0]],//[{value: 20,name: '电压'}],// renbao pingan taipingyang dadi yangguang fude 
        }]
    }
    chartid.setOption(option_gauge);
}
function refreshchart(avalue,bonding){
    var UA=((Math.random() * 220).toFixed(1) - 0);
    var UB=((Math.random() * 220).toFixed(1) - 0);
    var UC=((Math.random() * 220).toFixed(1) - 0);
    var ua=((Math.random() * 220).toFixed(1) - 0);
    var ub=((Math.random() * 220).toFixed(1) - 0);
    var uc=((Math.random() * 220).toFixed(1) - 0);
    var IA=(Math.random() * 5).toFixed(2) - 0;
    var IB=(Math.random() * 5).toFixed(2) - 0;
    var IC=(Math.random() * 5).toFixed(2) - 0;
    var ia=(Math.random() * 5).toFixed(2) - 0;
    var ib=(Math.random() * 5).toFixed(2) - 0;
    var ic=(Math.random() * 5).toFixed(2) - 0;
    initgaugechart(chart_va,[{name:'a相电压',value:ua}]);
    initgaugechart(chart_vb,[{name:'b相电压',value:ub}]);
    initgaugechart(chart_vc,[{name:'c相电压',value:uc}]);
    initgaugechart(chart_ia,[{name:'a相电流',value:ia}]);
    initgaugechart(chart_vA,[{name:'A相电压',value:UA}]);
    initgaugechart(chart_vB,[{name:'B相电压',value:UB}]);
    initgaugechart(chart_vC,[{name:'C相电压',value:UC}]);
    initgaugechart(chart_ib,[{name:'b相电流',value:ib}]);
    initgaugechart(chart_ic,[{name:'c相电流',value:ic}]);
    initgaugechart(chart_iA,[{name:'A相电流',value:IA}]);
    initgaugechart(chart_iB,[{name:'B相电流',value:IB}]);
    initgaugechart(chart_iC,[{name:'C相电流',value:IC}]);
    /*for(i=0;i<barDatas.length;i++){
        for(j=0;j<barDatas[i].length;j++){
            barDatas[i][j]=(Math.random() * 1000).toFixed(0) - 0;
        }
    }*/
    switch(bonding){
        case "UA":
            initgaugechart(chart_vA,[{name:"A相电压",value:avalue}]);
            break;
        case "UB":
            initgaugechart(chart_vB,[{name:'B相电压',value:avalue}]);
            break;
        case "UC":
            initgaugechart(chart_vC,[{name:'C相电压',value:avalue}]);
            break;
        case "ua":
            initgaugechart(chart_va,[{name:"a相电压",value:avalue}]);
            break;
        case "ub":
            initgaugechart(chart_vb,[{name:'b相电压',value:avalue}]);
            break;
        case "uc":
            initgaugechart(chart_vc,[{name:'c相电压',value:avalue}]);
            break;
        case "IA":
            initgaugechart(chart_iA,[{name:"A相电流",value:avalue}]);
            break;
        case "IB":
            initgaugechart(chart_iB,[{name:'B相电流',value:avalue}]);
            break;
        case "IC":
            initgaugechart(chart_iC,[{name:'C相电流',value:avalue}]);
            break;
        case "ia":
            initgaugechart(chart_ia,[{name:"a相电流",value:avalue}]);
            break;
        case "ib":
            initgaugechart(chart_ib,[{name:'b相电流',value:avalue}]);
            break;
        case "ic":
            initgaugechart(chart_ic,[{name:'c相电流',value:avalue}]);
            break;
    }
    UA=chart_vA.getOption().series[0].data[0].value;
    UB=chart_vA.getOption().series[0].data[0].value;
    UC=chart_vA.getOption().series[0].data[0].value;
    ua=chart_va.getOption().series[0].data[0].value;
    ub=chart_vb.getOption().series[0].data[0].value;
    uc=chart_vc.getOption().series[0].data[0].value;
    IA=chart_iA.getOption().series[0].data[0].value;
    IB=chart_iB.getOption().series[0].data[0].value;
    IC=chart_iC.getOption().series[0].data[0].value;
    ia=chart_ia.getOption().series[0].data[0].value;
    ib=chart_ib.getOption().series[0].data[0].value;
    ic=chart_ic.getOption().series[0].data[0].value;
    var auA=document.getElementById("PT_A").innerHTML.split(":")
    var tuA=auA[0]/auA[1];
    var aiA=document.getElementById("CT_A").innerHTML.split(":");
    var tiA=aiA[0]/aiA[1];
    var aua=document.getElementById("pt_a").innerHTML.split(":");
    var tua=aua[0]/aua[1];
    var aia=document.getElementById("ct_a").innerHTML.split(":");
    var tia=aia[0]/aia[1];
    barDatas[0][0]=(UA*IA*tuA*tiA/1000).toFixed(2);
    barDatas[0][1]=(UB*IB*tuA*tiA/1000).toFixed(2);
    barDatas[0][2]=(UC*IC*tuA*tiA/1000).toFixed(2);
    barDatas[1][0]=(ua*ia*tua*tia/1000).toFixed(2);
    barDatas[1][1]=(ub*ib*tua*tia/1000).toFixed(2);
    barDatas[1][2]=(uc*ic*tua*tia/1000).toFixed(2);
    initbarchart(chart_P,barDatas[0]);
    initbarchart(chart_p,barDatas[1]);
}/**duiyixiechongfudaimajinxinghebingchongxiechenghanshujinxfuyong,jingjianjiegou */
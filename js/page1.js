var tabs = document.getElementsByClassName('tab-head')[0].getElementsByTagName('div'),
    contents = document.getElementsByClassName('tab-content')[0].getElementsByClassName('tab-div');
var bodyfrm = (document.compatMode.toLowerCase() == "css1compat") ? document.documentElement : document.body;
var number=99;
function refreshwindow(){
    (function changeTab(tab) {
        for(var i = 0, len = tabs.length; i < len; i++) {
        tabs[i].onclick = showTab;
        }
    })();
    var tabhead=document.getElementById("tab-content");
    var title=document.getElementById("title");
    wwidth=bodyfrm.clientWidth-5;
    wheight=bodyfrm.clientHeight-title.offsetHeight-28;
    tabhead.style.width=wwidth+"px";
    tabhead.style.height=wheight+"px";
    for(var j=0;j<contents.length;j++){
        contents[j].style.width=wwidth+"px";
        contents[j].style.height=wheight+"px";
    }
    //var myChart = echarts.init(document.getElementById('chart00'));
    //document.getElementById("main2").style.height="500px";
    //initseries(myChart);
    initpage1();
    //形成图表数据对象数组
    
    var datas=[];
    for(var i=0;i<6;i++){
        var value=(Math.random() * 100).toFixed(2) - 0;
        datas.push(JSON.parse('{"name":"温度'+i+'","value":'+value+'}'));
    }
    //画仪表盘式图表（多个）；
    drawmeters(datas);
    
    
}; 
window.onload=window.onresize=refreshwindow;
window.setInterval("refreshData()",5000);//自动刷新图表数据
function showTab() {
    for(i=0;i<tabs.length;i++){
        if(tabs[i]===this){
            tabs[i].className="selected";
            contents[i].className="tab-div show";
        }else{
            tabs[i].className="";
            contents[i].className="tab-div";
        }
    }
    /*if("仪表显示"=== this.innerText) {
        tabs[0].className = 'selected';
        tabs[1].className = '';
        tabs[2].className = '';
        document.getElementById("main").style.display="block";
        document.getElementById("reallist").style.display="none";
        document.getElementById("chartmain").style.display="none";
    } else if(this.innerText==="数据列表"){
        tabs[0].className = '';
        tabs[1].className = 'selected';
        tabs[2].className = '';
        document.getElementById("main").style.display="none";
        document.getElementById("reallist").style.display="block";
        document.getElementById("chartmain").style.display="none";
    }else if(this.innerText==="变化趋势"){
        tabs[0].className = '';
        tabs[2].className = 'selected';
        tabs[1].className = '';
        document.getElementById("main").style.display="none";
        document.getElementById("reallist").style.display="none";
        document.getElementById("chartmain").style.display="block";
    }*/

}
function initseries(myChart,data){
    // 基于准备好的dom，初始化echarts实例
    //var myChart = echarts.init(document.getElementById('main'));

    // 指定图表的配置项和数据
    option = {
        backgroundColor: '#1b1b1b',
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
        series: [/*{
            name: '速度',
            type: 'gauge',
            min: 0,
            max: 220,
            center:["10%","13%"],
            splitNumber: 11,
            radius: '15%',
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [
                        [0.09, 'lime'],
                        [0.82, '#1e90ff'],
                        [1, '#ff4500']
                    ],
                    width: 10,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisLabel: { // 坐标轴小标记
                textStyle: { // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisTick: { // 坐标轴小标记
                length: 15, // 属性length控制线长
                lineStyle: { // 属性lineStyle控制线条样式
                    color: 'auto',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            splitLine: { // 分隔线
                length: 25, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 3,
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            pointer: { // 分隔线
                width:2,
                shadowColor: '#fff', //默认透明
                shadowBlur: 5
            },
            title: {
                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: 14,
                    fontStyle: 'italic',
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            detail: {
                backgroundColor: 'rgba(30,144,255,0.8)',
                width:50,
                height:20,
                borderWidth: 1,
                borderColor: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 5,
                offsetCenter: [0, '10%'], // x, y，单位px
                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    //fontWeight: 'bolder',
                    color: '#fff',
                    fontSize:14,
                }
            },
            data: [{
                value: 40,
                name: 'km/h'
            }]
        }, 
        {
            name: '转速',
            type: 'gauge',
            center: ['30%', '13%'], // 默认全局居中
            radius: '15%',
            min: 0,
            max: 7,
            //endAngle: 45,
            splitNumber: 7,
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [
                        [0.29, 'lime'],
                        [0.86, '#1e90ff'],
                        [1, '#ff4500']
                    ],
                    width: 2,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisLabel: { // 坐标轴小标记
                textStyle: { // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisTick: { // 坐标轴小标记
                length: 12, // 属性length控制线长
                lineStyle: { // 属性lineStyle控制线条样式
                    color: 'auto',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            splitLine: { // 分隔线
                length: 20, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 3,
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            pointer: {
                width: 5,
                shadowColor: '#fff', //默认透明
                shadowBlur: 5
            },
            title: {
                offsetCenter: [0, '30%'], // x, y，单位px
                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontStyle: 'italic',
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            detail: {
                //backgroundColor: 'rgba(30,144,255,0.8)',
                // borderWidth: 1,
                borderColor: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 5,
                //width: 80,
                //height: 30,
                offsetCenter: [25, '20%'], // x, y，单位px
                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: '#fff'
                }
            },
            data: [{
                value: 1.5,
                name: 'x1000 r/min'
            }]
        }, 
        {
            name: '油表',
            type: 'gauge',
            center: ['50%', '13%'], // 默认全局居中
            radius: '15%',
            min: 0,
            max: 2,
            //startAngle: 135,
            //endAngle: 45,
            splitNumber: 2,
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [
                        [0.2, 'lime'],
                        [0.8, '#1e90ff'],
                        [1, '#ff4500']
                    ],
                    width: 2,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisTick: { // 坐标轴小标记
                length: 12, // 属性length控制线长
                lineStyle: { // 属性lineStyle控制线条样式
                    color: 'auto',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisLabel: {
                textStyle: { // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                },
                formatter: function(v) {
                    switch(v + '') {
                        case '0':
                            return 'E';
                        case '1':
                            return 'Gas';
                        case '2':
                            return 'F';
                    }
                }
            },
            splitLine: { // 分隔线
                length: 15, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 3,
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            pointer: {
                width: 2,
                shadowColor: '#fff', //默认透明
                shadowBlur: 5
            },
            title: {
                show: false
            },
            detail: {
                show: false
            },
            data: [{
                value: 0.5,
                name: 'gas'
            }]
        }, 
        {
            name: '水表',
            type: 'gauge',
            center: ['70%', '13%'], // 默认全局居中
            radius: '15%',//半径
            min: 0,
            max: 2,
            //startAngle: 315,//起始角度
            //endAngle: 225,//终止角度
            splitNumber: 2,//
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [
                        [0.2, 'lime'],
                        [0.8, '#1e90ff'],
                        [1, '#ff4500']
                    ],
                    width: 2,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisTick: { // 坐标轴小标记
                show: false,
                splitNumber:2,
            },
            axisLabel: {
                textStyle: { // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                },
                formatter: function(v) {
                    switch(v + '') {
                        case '0':
                            return 'H';
                        case '1':
                            return 'Water';
                        case '2':
                            return 'C';
                    }
                }
            },
            splitLine: { // 分隔线
                length: 15, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 3,
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            pointer: {
                width: 2,
                shadowColor: '#fff', //默认透明
                shadowBlur: 5
            },
            title: {
                show: false
            },
            detail: {
                show: false
            },
            data: [{
                value: 0.5,
                name: 'gas'
            }]
        },
        {
            name: '湿度',
            type: 'gauge',
            center: ['90%', '13%'], // 默认全局居中
            radius: '15%',//半径
            min: 0,
            max: 100,
            //startAngle: 315,//起始角度
            //endAngle: 225,//终止角度
            splitNumber: 5,//
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [
                        [0.2, 'lime'],
                        [0.8, '#1e90ff'],
                        [1, '#ff4500']
                    ],
                    width: 2,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisTick: { // 坐标轴小标记
                show: true,
                splitNumber:5,
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
                length: 15, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 3,
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            pointer: {
                width: 2,
                shadowColor: '#fff', //默认透明
                shadowBlur: 5
            },
            title: {
                show: false
            },
            detail: {
                show: false
            },
            data: [{
                value: 0.5,
                name: 'gas'
            }]
        },*/
        {
            name: data.name,//'温度',
            type: 'gauge',
            center: ['50%', "50%"], // 默认全局居中
            radius: '50%',//半径
            min: 0,
            max: 100,
            //startAngle: 315,//起始角度
            //endAngle: 225,//终止角度
            splitNumber: 5,//
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [
                        [0.2, 'green'],
                        [1, '#1f1f1f'],
                    ],
                    width: 10,
                    shadowColor: "'yellow'", //默认透明
                    shadowOffsetX:2,
                    shadowBlur: 10
                }
            },
            axisTick: { // 坐标轴小标记
                show: true,
                splitNumber:5,
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
                length: 12, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 1,
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            pointer: {
                show:false,
                width: 2,
                shadowColor: '#fff', //默认透明
                shadowBlur: 5
            },
            title: {
                show: true,
                offsetCenter: [0, '-10%'], // x, y，单位px
                textStyle: {
                    color: 'white',
                    fontSize: 16
                }

            },
            detail: {
                show: true,
                offsetCenter: [0, '-10%'],
                formatter: '{value}',
                textStyle: {
                    fontSize: 16,
                    color:'#F8F43C'
                }

            },
            data: [data],//[{value: 20,name: '温度'}]
        }
        ]
    };

    myChart.setOption(option);
    //var option = myChart.getOption();
    var value =data.value;
    option.series[0].data[0].value=value; 
    //形成进度条式的填充仪表效果并分段显示不同延时用于指示不同状态。    
    if(value<20){
        option.series[0].axisLine.lineStyle.color[0]=[value/100,'blue'];
    }else if(value<80){
        option.series[0].axisLine.lineStyle.color[0]=[value/100,"green"];
    }else{
        option.series[0].axisLine.lineStyle.color[0]=[value/100,"red"];
    }
        //option.series[5].axisLine.lineStyle.color[0][0]=value/220;
    myChart.setOption(option);
    /*setInterval(function() {
        
        //option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
        //option.series[1].data[0].value = (Math.random() * 7).toFixed(2) - 0;
        //option.series[2].data[0].value = (Math.random() * 2).toFixed(2) - 0;
        //option.series[3].data[0].value = (Math.random() * 2).toFixed(2) - 0;
        //option.series[4].data[0].value = (Math.random() * 100).toFixed(2) - 0;
        //var value = (Math.random() * 100).toFixed(2) - 0;
        var value =data.value;
        
        option.series[0].data[0].value=value; 
        
        if(value<20){
            option.series[0].axisLine.lineStyle.color[0]=[value/100,'blue'];
        }else if(value<80){
            option.series[0].axisLine.lineStyle.color[0]=[value/100,"green"];
        }else{
            option.series[0].axisLine.lineStyle.color[0]=[value/100,"red"];
        }
        //option.series[5].axisLine.lineStyle.color[0][0]=value/220;
        myChart.setOption(option);
    }, 2000);*/
    
}
var chartarray=[];
function drawmeters(datas){
    if(datas===null||datas===undefined){
        return;
    }
    mcount=datas.length;
    var row=Math.floor(mcount/mcol);
    var mod=(mcount%mcol);
    for(var r=0;r<row;r++){
        for(var c=0;c<mcol;c++){
            var div=document.getElementById("chart"+r+c);
            //如果已经存在此图表div，则进行刷新，没有则创建添加，下同。
            if(div===null || div===undefined){
                var div= document.createElement("div");
                div.setAttribute("style","width:300px;height:300px;");
                div.setAttribute("id","chart"+r+c);
                document.getElementById("column"+c).appendChild(div);
                var chart=echarts.init(document.getElementById("chart"+r+c));
                chartarray.push(chart);
                initseries(chart,datas[r*4+c]);
            }
            
            
        }
    }
    for(var m=0;m<mod;m++){
        var div=document.getElementById("chart"+r+m);
        if((div===null) || (div===undefined)){
            var div=document.createElement("div");
            div.setAttribute("style","width:300px;height:300px;");
            div.setAttribute("id","chart"+r+m);
            document.getElementById("column"+m).appendChild(div);
            var chart=echarts.init(document.getElementById("chart"+r+m));
            chartarray.push(chart) ;
            initseries(chart,datas[r*mcol+m]);
        }                                        
        
    }
}
function refreshData(){
    number--;
    if(number<10){number=100;}
    //if(!myChart){
    //    return;
    //}
    
    //更新数据
    //var option = myChart.getOption();
    //option.series[0].data = data;
    var datas=[];
    for(var i=0;i<chartarray.length;i++){
        //var value=(Math.random() * 100).toFixed(2) - 0;
        datas.push(JSON.parse('{"name":"温度'+i+'","value":'+number+'}'));
        var chart1=chartarray[i];
        initseries(chart1,datas[i])
    }   
    //myChart.setOption(option);
    //drawmeters(datas)    
}
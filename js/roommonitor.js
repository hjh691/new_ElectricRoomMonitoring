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
        function initbarchart(chartid,bardata){
        var option_bar = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                //left: '2%',
                //right: '5%',
                //bottom: '2%',
                //top:'2%',
                x: 20,
                y: 25,
                x2: 30,
                y2: 20,
                containLabel: true
            },
            xAxis: {
                type: 'value',
                axisLine: {
                    show: true,
                    lineStyle:{
                        color:"#fff"
                    }
                },
                axisLabel:{
                    show:true,
                    textStyle:{color:"#fff"},
                    color:"#fff"
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'category',
                data: category,
                splitLine: {show: false},
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel:{
                    show:true,
                    textStyle:{color:"#fff"},
                    color:"#fff"
                },
                offset: 0,
                nameTextStyle: {
                    fontSize: 15
                }
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
                            show: true,
                            position: 'right',
                            offset: [5, -2],
                            textStyle: {
                                color: '#F68300',
                                fontSize: 13
                            }
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            barBorderRadius: 7
                        },
                        normal: {
                            barBorderRadius: 7,
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 1, 0,
                                [
                                    {offset: 0, color: '#3977E6'},
                                    {offset: 1, color: '#37BBF8'}

                                ]
                            ),/*'#39F736'*/
                        }
                    }
                }
            ]
        };
        chartid.setOption(option_bar);
        }
        initbarchart(chart_P,barDatas[0]);
        initbarchart(chart_p,barDatas[1]);
        function initgaugechart(chartid,data){
            var unit="V",vmax=400,spl=4;
            var str=new Object();
            str=data[0];
            if(((str.name).indexOf("电压"))>0){
                unit="V";vmax=400;spl=4;
            }else{unit="A";vmax=5;spl=5}
            var option_gauge= {
            backgroundColor: '#1b1b1b',
            tooltip: {
                formatter:  "{a}: <br/>{c} "+unit
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
                center: ['50%', "50%"], // 默认全局居中
                radius: '70%',//半径
                min: 0,
                max: vmax,
                //startAngle: 90,//起始角度
                //endAngle: 180,//终止角度
                splitNumber: spl,//
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [[0.29, 'lime'],[0.86, '#1e90ff'],[1, '#ff4500']],
                        width: 1,
                        shadowColor : '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: { // 坐标轴小标记
                    show: true,
                    splitNumber:5,
                },
                axisLabel: {
                    textStyle: { // 属性lineStyle控制线条样式
                        //fontWeight: 'bolder',
                        color: '#fff',
                        //shadowColor: '#fff', //默认透明
                        shadowBlur: 10,
                        fontSize:10,
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
                    show:true,
                    width: 3,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 5,
                    
                },
                title: {
                    show: true,
                    offsetCenter: [0, '140%'], // x, y，单位px
                    textStyle: {
                        color: 'white',
                        fontSize: 16
                    }

                },
                detail: {
                    show: true,
                    offsetCenter: ['-10%', '85%'],
                    formatter: '{value}'+unit,
                    textStyle: {
                        fontSize: 14,
                        color:'#F8F43C'
                    }

                },
                data:[data[0]],//[{value: 20,name: '电压'}],// [data]
            }]
            
        }
        chartid.setOption(option_gauge);
        }
        initgaugechart(chart_va,[{name:'a相电压',value:30}]);
        initgaugechart(chart_vb,[{name:'b相电压',value:30}]);
        initgaugechart(chart_vc,[{name:'c相电压',value:30}]);
        initgaugechart(chart_ia,[{name:'a相电流',value:30}]);
        initgaugechart(chart_vA,[{name:'A相电压',value:30}]);
        initgaugechart(chart_vB,[{name:'B相电压',value:30}]);
        initgaugechart(chart_vC,[{name:'C相电压',value:30}]);
        initgaugechart(chart_ib,[{name:'b相电流',value:30}]);
        initgaugechart(chart_ic,[{name:'c相电流',value:30}]);
        initgaugechart(chart_iA,[{name:'A相电流',value:30}]);
        initgaugechart(chart_iB,[{name:'B相电流',value:30}]);
        initgaugechart(chart_iC,[{name:'C相电流',value:30}]);
        window.setInterval(refreshchart,5000);
        function refreshchart(){
            var value=(Math.random() * 400).toFixed(0) - 0;
            initgaugechart(chart_va,[{name:'a相电压',value:(Math.random() * 400).toFixed(0) - 0}]);
            initgaugechart(chart_vb,[{name:'b相电压',value:(Math.random() * 400).toFixed(0) - 0}]);
            initgaugechart(chart_vc,[{name:'c相电压',value:(Math.random() * 400).toFixed(0) - 0}]);
            initgaugechart(chart_ia,[{name:'a相电流',value:(Math.random() * 5).toFixed(2) - 0}]);
            initgaugechart(chart_vA,[{name:'A相电压',value:(Math.random() * 400).toFixed(0) - 0}]);
            initgaugechart(chart_vB,[{name:'B相电压',value:(Math.random() * 400).toFixed(0) - 0}]);
            initgaugechart(chart_vC,[{name:'C相电压',value:(Math.random() * 400).toFixed(0) - 0}]);
            initgaugechart(chart_ib,[{name:'b相电流',value:(Math.random() * 5).toFixed(2) - 0}]);
            initgaugechart(chart_ic,[{name:'c相电流',value:(Math.random() * 5).toFixed(2) - 0}]);
            initgaugechart(chart_iA,[{name:'A相电流',value:(Math.random() * 5).toFixed(2) - 0}]);
            initgaugechart(chart_iB,[{name:'B相电流',value:(Math.random() * 5).toFixed(2) - 0}]);
            initgaugechart(chart_iC,[{name:'C相电流',value:(Math.random() * 5).toFixed(2) - 0}]);
            for(i=0;i<barDatas.length;i++){
                for(j=0;j<barDatas[i].length;j++){
                    barDatas[i][j]=(Math.random() * 1000).toFixed(0) - 0;
                }
            }
            initbarchart(chart_P,barDatas[0]);
            initbarchart(chart_p,barDatas[1]);
        }
//var xs=1;
var sensors;
var isfirst=true;
//var sel_sensor=document.getElementById("jcdd");
var type="",step=true;
var jssj=getCurrentDate(2);
var catalog="",dname="",tname="";
var configs,scatalog;
var myChart;
var timer=null;
var flashit=$("#chaxun");
$(function () {
    initpage();			
});
//初始化页面
function initpage(){
    updatapcnav(5);
    sessionStorage.framepage="historydata.html";
    //var treeseneors=JSON.parse(localStorage.getItem("sensor_tree"))
    //var treenode=buildnode(treeseneors,0);
    //inittreeview(treenode);haoxiangshizhemohuishi conding you
    document.getElementById("kssj_history").value = sessionStorage.kssj;
    document.getElementById("jssj_history").value = sessionStorage.jssj;
    /*for (var i = 0; i < sel_sensor.options.length; i++) {
        sel_sensor.removeChild(sel_sensor.options[0]);
        sel_sensor.remove(0);
        sel_sensor.options[0] = null;
    }*/
    sensors=JSON.parse(localStorage.getItem("sensors"));
    configs=JSON.parse(localStorage.Configs);
    /*if(sensors!=null){
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
            //op.setAttribute('class',"dropdown-menu");
            op.innerHTML=maps[k].name;
            sel_sensor.appendChild(op);
        }
    }
    setSelectOption("jcdd", sessionStorage.SensorId);*/
    appenddisplaytype(sessionStorage.SensorId);
    if((!sessionStorage.timeindex)||(typeof(sessionStorage.timeindex)=="undefined")||(sessionStorage.timeindex>4)){
        sessionStorage.timeindex=0;
    }
    $(":radio[name='timeselect'][value='"+sessionStorage.timeindex+"']").prop("checked","checked");
    seletime($(":radio[name='timeselect'][value='"+sessionStorage.timeindex+"']")[0]);
    if(sessionStorage.SensorName==undefined){
        sessionStorage.SensorName="";
    }
    //if(sessionStorage.timeindex==4){//
                                        
        queryhistorydata(0);//decodedatas();//
    //}
    $("#main").height(parent.window.windowHeight-250);
    $("#list").height(parent.window.windowHeight-250);
    myChart = echarts.init(document.getElementById('main'));
}
function appenddisplaytype(element_id,time){
    var display_type=document.getElementById("display_type")
    for(var i=display_type.childElementCount;i>0;i--)
    display_type.removeChild(display_type.childNodes[i]);
    if(element_id>=0){
        if(sensors)
        for(var k=0;k<sensors.length;k++){
            if(sensors[k].Value.id==element_id){
                scatalog=sensors[k].Value.type;//catalog;//读取对应的Catalog项1
                if(scatalog)
                    scatalog=scatalog.toLowerCase();
                break;
            }
        }
        if(configs){
            for(var i=0;i<configs.length;i++){
                if((configs[i].name.toLowerCase()==scatalog)){//&&(configs.hasOwnProperty(scatalog))){//检查配置中是否有catalog项
                    var s_des=configs[i].details;//如果有，读取其所有配置项
                    for(var p in s_des){
                        var lab=document.createElement("label");
                        if(sessionStorage.datatype){
                            if(s_des[p].name==sessionStorage.datatype){//如果有原先的选择
                            //if(p==0){
                                dname=s_des[p].name;//Name
                                catalog=s_des[p].folder;//Catalog; //not type
                                lab.className="btn btn-primary active"
                                tname=s_des[p].desc;//20201023
                            }else{
                                lab.className="btn btn-primary";
                            }
                        }else{ //没有选择项，则默认为第一项
                            if(p==0){
                            dname=s_des[p].name;//Name
                            catalog=s_des[p].folder;//Catalog; //not type
                            lab.className="btn btn-primary active"
                            tname=s_des[p].desc;//20201023
                            }else{
                                lab.className="btn btn-primary";
                            }
                        }
                        lab.innerHTML='<input class="catalog" type="radio" name="options" value="'+s_des[p].name+'" >'+s_des[p].desc;
                        //lab.innerHTML=s_des[p].Desc;
                        display_type.appendChild(lab);
                    }
                    break;
                }
            }
        }else{

        }
    }
    $(".btn").click(function(){//用于动态加载的元素的点击响应。
        $(this).button('toggle');
        var eobj=$(".catalog:checked")
        dname= eobj.val();
        tname= eobj[0].parentNode.innerText;
        sessionStorage.datatype=dname;//保存选择项的值，用于页面刷新时恢复当前数据。
        catalog=getcatalog(dname);
        flashbutton();
        //gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj, sessionStorage.jssj);
    });
}
function buildnode(data, level) {
    var tree = [];
    if (data == null || typeof(data) == "undefined") {
        /*for (i = 0; i < 3; i++) {
            var anodes = new Object();
            anodes.text = "门禁" + (2 - i);
            anodes.id = i;
            anodes.Catalog="门禁";
            anodes.nodes = [];
            anodes.icon = "url(res/lock.png)";
            anodes.level=0;
            var node = '[{"text":"动环","id":' + ((i + 1) * 10) +',"icon":"glyphicon glyphicon-user","Catalog":"UPS","level":1},{"text":"水浸","id":' 
                + ((i + 1) * 10 + 1) + ',"level":1},{"text":"电源","id":' + ((i + 1) * 10 + 2) + ',"level":1},{"text":"环境","id":' + ((i + 1) * 10 + 3) 
                + ',"level":1},{"text":"灯光","id":' + ((i + 1) * 10 + 4) +
                    ',"level":1,"nodes":[{"text":"门禁","id":543,"level":2},{"text":"水浸","id":345,"level":2}]}]';
            anodes.nodes = (JSON.parse(node));
            //var lnode=new Object();
            tree.push(anodes);
        }*/
    }else
    for (var j = 0; j < data.length; j++) {
            var anodes = new Object();
            anodes.text = data[j].Value.Name;
            anodes.id = data[j].Value.Id;
            anodes.ParentId=data[j].Value.ParentId;
            anodes.NodeId=data[j].Value.NodeId;//----
            anodes.Catalog = data[j].Value.Catalog;
            anodes.Address=data[j].Value.Address//----
            anodes.Group=data[j].Value.Group;//----
            anodes.Serial=data[j].Value.Serial;//----
            anodes.Location=data[j].Value.Location;//----
            anodes.Config = data[j].Value.Config;
            anodes.Time = data[j].Value.Time;
            anodes.level = level;
            if (data[j].Value.hasOwnProperty("NodeId")) {
                anodes.NodeId = data[j].Value.NodeId;
            }
            var icon = 'glyphicon glyphicon-user';
            switch (data[j].Value.Name) {
                case "机房监控":
                    icon = 'glyphicon glyphicon-inbox';//
                    break;
                case "门禁":
                    icon = 'glyphicon glyphicon-lock';//
                    break;
                case "灯光":
                    icon = 'glyphicon glyphicon-cog';
                    break;
                case "红外":
                    icon = 'glyphicon glyphicon-signal';
                    break;
                case "动力":
                    icon = 'glyphicon glyphicon-retweet';
                    break;
                case "环境":
                    icon = "glyphicon glyphicon-leaf";//
                    break;
                case "水浸":
                    icon = "glyphicon glyphicon-tint";//
            }
            if (level == 0) {
                icon = "glyphicon glyphicon-home";
            }
            anodes.icon = icon;
            //var chi_len = data[j].Children.length;
            if (data[j].Children&&data[j].Children.length != 0) {
                anodes.nodes = [];
                anodes.nodes = buildnode(data[j].Children, level + 1)
            }
            tree.push(anodes);
        }
    return tree;
}
function tableclick(tr){
    $(tr).siblings().css("background","");
    $(tr).css("background","#85e494");//区分选中行
}
function refreshsensorslist(){
    window.parent.GetSensorsByNode(sessionStorage.nodeId);
}
function changetype(){
    var title=document.getElementById("change");
    if(title.innerText==">> 数据列表"){
        document.getElementById("list").style.display="";
        document.getElementById("main").style.display="none";
        title.innerText=">> 趋势图";
    }else if(title.innerText==">> 趋势图"){
        document.getElementById("list").style.display="none";
        document.getElementById("main").style.display="";
        title.innerText=">> 数据列表";
    }
}
//查询历史记录
function queryhistorydata() {
    if(sensors){//
        for(var i=0;i<sensors.length;i++){
            if(sensors[i].id==sessionStorage.SensorId){
                type=sensors[i].Value.type; //Catalog
            }
        }
    }
    stoptimer(timer);
    /*var sel=document.getElementById("jcdd");
    if(sel.options.length<=0){
        layer.alert("请选择要查询的测量点名称",info_showtime);
        showstateinfo("请选择要查询的测量点名称");
        return;
    }*/
    if(sessionStorage.timeindex==4){
        var kssj = document.getElementById("kssj_history").value;
        if ((kssj == null) || (kssj == "") || (typeof(kssj) == "undefined")) {
            layer.alert("请指定开始时间",info_showtime);
            showstateinfo("请指定开始时间");
            return;
        }
        var jssj = document.getElementById("jssj_history").value;
        if ((jssj == null) || (jssj == "") || (typeof(jssj) == "undefined")) {
            layer.alert("请指定截至时间",info_showtime);
            showstateinfo("请指定截止时间");
            return;
        }
        //if((sessionStorage.SensorId==sel.value)&&(sessionStorage.kssj==kssj)&&(sessionStorage.jssj==jssj)&&(!isfirst)
        //	&&(sessionStorage.typecatalog==catalog)&&(sessionStorage.typename==dname)){
            //layer.alert("查询条件与上一次相同，请重新选择!",info_showtime)
        //	return;
        //}
        sessionStorage.kssj = kssj;
        sessionStorage.jssj = jssj;
    }
    //sessionStorage.SensorId = sel.value;
    //sessionStorage.SensorName = sel.options[sel.selectedIndex].text;
    sessionStorage.typename=dname;
    sessionStorage.typecatalog=catalog;
    //xs=sensors[sel.selectedIndex].Value.Factor;
    //$("#historydata-tbody tr").empty();
    /*var tbl = document.getElementById('historydata-tbody');
    var tableLength = tbl.rows.length;
    for (var int = 0; int < tableLength; int++) {
        tbl.deleteRow(0);
    }*/
    gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj, sessionStorage.jssj);
    isfirst=false;
    //document.getElementById("timedefine").style.display="none";
}
function decodedatas(obj_data){
    var count = 0;
    var maxvalue=-1,minvalue=-1,avgvalue=-1,ps=0,ct=1,maxval=-1,minval=-1,hourvalue=-1;
    //var stime=new Date(sessionStorage.kssj).getTime();
    var stime=new Date(Date.parse(sessionStorage.kssj.replace(/-/g,"/"))).getTime();
    var etime=new Date(Date.parse(sessionStorage.jssj.replace(/-/g,"/"))).getTime();
    var maxtime="",mintime="";
    var senconds=etime-stime;
    var pa = [],pb = [],pc = [];
    var jiange="";
    
    myChart.clear();
    //$("#historydata-tbody tr").empty();
    var tbl = document.getElementById('historydata-tbody');
    var tableLength = tbl.rows.length;
    for (var int = 0; int < tableLength; int++) {
        tbl.deleteRow(0);
    }
    //数据以表格行的形式添加进table中，其实现隔行颜色区分。
    if((obj_data==null)||(obj_data.length<=0)){
        document.getElementById('count_val').innerHTML = count + "条";
        document.getElementById('normal_count').innerHTML = sessionStorage.SensorName;
        return;
    }
    if(sessionStorage.nodetype==2){//Math.ceil(senconds/1000/60)<1430//如果是机房监控，则显示所有数据，并使图形显示为阶梯图，表示开关状态。
        step='end';
        for (var i = 0; i <obj_data.length; i++) {
            var tr = document.createElement('tr');
            if (i % 2 == 0) {//此处抵消css定义的table隔行变色的显示效果.来显示机房监控的状态列表
                tr.setAttribute('style', "background-color:#16b9c9");
            }
            var tdname = document.createElement('td');
            tdname.className="seneorname";// setAttribute('class', 'seneorname');
            var tdtime = document.createElement('td');
            tdtime.className="time";// setAttribute('class', 'time');
            var tdvalue1 = document.createElement('td');
            tdvalue1.className="value1";// setAttribute('class', 'value1'); //给单元格添加类名属性
            var tdvalue2 = document.createElement('td');
            tdvalue2.className="value2";// setAttribute('class', 'value2');
            var tdvalue3=document.createElement("td");
            tdvalue3.className="value3";// setAttribute("class",'value3');
            tdname.innerHTML=sessionStorage.SensorName;
            tdvalue1.innerHTML = obj_data[i].value;
            //tdename.innerHTML=data.Result[i].SensorName;//jsonObject[i].name;
            tdtime.innerHTML = obj_data[i].time; //jsonObject[i].color;
            tdvalue2.innerHTML = obj_data[i].value;
            tdvalue3.innerHTML= obj_data[i].value;
            //tr.appendChild(tdname);
            tr.appendChild(tdtime);
            tr.appendChild(tdvalue1);
            tr.appendChild(tdvalue2);
            tr.appendChild(tdvalue3);
            //var tbody = document.getElementById('historydata-tbody');
            tbl.appendChild(tr);
            pa.push([strtodatetime(strtime+":00"), obj_data[i].value, ps]);
            pb.push([strtodatetime(strtime+":00"), obj_data[i].value, ps]);
            pc.push([strtodatetime(strtime+":00"),obj_data[i].value , ps]);
            ps++;
        }
        //ps=obj_data.length;
    }else /**/if(Math.ceil(senconds/1000/60)<=1440){
        step=false;
        jiange="按小时统计";
        var temp=parseFloat(obj_data[0].value);
        if(isNaN(temp)){
            obj_data[0].value=-1;
        }
        maxvalue=minvalue=avgvalue=parseFloat(obj_data[0].value);
        maxval=minval=maxvalue;
        hourvalue=parseFloat(obj_data[0].value);
        maxtime=mintime=obj_data[0].time;
        var strtime=obj_data[0].time.substr(0,13);
        var temp=parseInt(strtime.substr(11));
        jisuan(11,13);
        avgvalue=(avgvalue/ct);
        var tr = document.createElement('tr');
        tr.setAttribute("onclick","tableclick(this)");
        //var tdname = document.createElement('td');
        //tdname.setAttribute('class', 'seneorname');
        var tdtime = document.createElement('td');
        tdtime.className='time';
        var tdhourvalue=document.createElement('td');
        tdhourvalue.className="hvalue";
        var tdvalue1 = document.createElement('td');//最大值
        tdvalue1.className='value1'; //给单元格添加类名属性
        var tdvalue2 = document.createElement('td');//平均值
        tdvalue2.className='value2';
        var tdmaxtime=document.createElement('td');
        tdmaxtime.className="maxtime";
        var tdvalue3=document.createElement("td");//最小值
        tdvalue3.className='value3';
        var tdmintime=document.createElement('td');
        tdmintime.className="mintime";
        //tdname.innerHTML=sessionStorage.SensorName;
        if(type=="pd"){
            tdvalue1.innerHTML = minvalue.toFixed(Number_of_decimal);
            tdmaxtime.innerHTML=mintime;
            tdvalue3.innerHTML = maxvalue.toFixed(Number_of_decimal);
            tdmintime.innerHTML=maxtime;
        }else{
            tdvalue1.innerHTML = maxvalue.toFixed(Number_of_decimal);
            tdmaxtime.innerHTML=maxtime;
            tdvalue3.innerHTML = minvalue.toFixed(Number_of_decimal);
            tdmintime.innerHTML=mintime;
        }
        //tdename.innerHTML=data.Result[i].SensorName;//jsonObject[i].name;
        tdtime.innerHTML = strtime+":00"; //jsonObject[i].color;
        tdhourvalue.innerHTML=hourvalue.toFixed(Number_of_decimal);
        tdvalue2.innerHTML = avgvalue.toFixed(Number_of_decimal);
        //tr.appendChild(tdname);
        tr.appendChild(tdtime);
        tr.appendChild(tdhourvalue);
        tr.appendChild(tdvalue1);
        //tr.appendChild(tdvalue2);
        tr.appendChild(tdmaxtime);
        tr.appendChild(tdvalue3);
        tr.appendChild(tdmintime);
        //var tbody = document.getElementById('historydata-tbody');
        tbl.appendChild(tr);
        pa.push([strtodatetime(strtime+":00"), maxvalue, ps]);
        pb.push([strtodatetime(strtime+":00"), avgvalue.toFixed(Number_of_decimal), ps]);
        pc.push([strtodatetime(strtime+":00"),minvalue , ps]);
    }else{
        step=false;
        jiange="按日统计";
        var temp=parseFloat(obj_data[0].value);
        if(isNaN(temp)){
            obj_data[0].value=-1
        }
        maxvalue=minvalue=avgvalue=parseFloat(obj_data[0].value);
        maxval=minval=maxvalue;
        hourvalue=parseFloat(obj_data[0].value);
        maxtime=mintime=obj_data[0].time;
        var strtime=obj_data[0].time.substr(0,10);
        var temp=parseInt(strtime.substr(8));
        jisuan(8,10);//参数是区日期时间格式串的起始和结束位置的由零算起的索引值。2020-04-16 14:50:10，
        avgvalue=(avgvalue/ct);
        var tr = document.createElement('tr');
        tr.setAttribute("onclick","tableclick(this)");
        //var tdname = document.createElement('td');//
        //tdname.setAttribute('class', 'seneorname');//
        var tdtime = document.createElement('td');
        tdtime.className='time';
        var tdhourvalue=document.createElement('td');
        tdhourvalue.className="hvalue";
        var tdvalue1 = document.createElement('td');//最大值
        tdvalue1.className='value1'; //给单元格添加类名属性
        var tdvalue2 = document.createElement('td');//平均值
        tdvalue2.className='value2';
        var tdmaxtime=document.createElement('td');
        tdmaxtime.className="maxtime";
        var tdvalue3=document.createElement("td");//最小值
        tdvalue3.className='value3';
        var tdmintime=document.createElement('td');
        tdmintime.className="mintime";
        //tdname.innerHTML=sessionStorage.SensorName;
        if(type=="pd"){
            tdvalue1.innerHTML = minvalue.toFixed(Number_of_decimal);
            tdmaxtime.innerHTML=mintime;
            tdvalue3.innerHTML = maxvalue.toFixed(Number_of_decimal);
            tdmintime.innerHTML=maxtime;
        }else{
            tdvalue1.innerHTML = maxvalue.toFixed(Number_of_decimal);
            tdmaxtime.innerHTML=maxtime;
            tdvalue3.innerHTML = minvalue.toFixed(Number_of_decimal);
            tdmintime.innerHTML=mintime;
        }
        //tdename.innerHTML=data.Result[i].SensorName;//jsonObject[i].name;
        tdtime.innerHTML = strtime; //jsonObject[i].color;
        tdhourvalue.innerHTML=hourvalue.toFixed(Number_of_decimal);
        tdvalue2.innerHTML = avgvalue.toFixed(Number_of_decimal);
        //tr.appendChild(tdname);
        tr.appendChild(tdtime);
        tr.appendChild(tdhourvalue);
        tr.appendChild(tdvalue1);
        //tr.appendChild(tdvalue2);
        tr.appendChild(tdmaxtime);
        tr.appendChild(tdvalue3);
        tr.appendChild(tdmintime);
        //var tbody = document.getElementById('historydata-tbody');
        tbl.appendChild(tr);
        pa.push([strtodatetime(strtime+":00"), maxvalue, ps])
        pb.push([strtodatetime(strtime+":00"), avgvalue.toFixed(Number_of_decimal), ps])
        pc.push([strtodatetime(strtime+":00"),minvalue , ps])
    }
    //表标题
    document.getElementById("cld_name").innerHTML=sessionStorage.SensorName;
    document.getElementById("tongji_time").innerHTML=sessionStorage.kssj+"—"+sessionStorage.jssj
    document.getElementById("his_caption").innerHTML=jiange+"报表";
    count =ps+1;//obj_data.length;
    document.getElementById('count_val').innerHTML ="<span class='badge' style='font-size:18px'>"+ count + "条";
    //document.getElementById('station_name').innerHTML = sessionStorage.stationName;
    document.getElementById('normal_count').innerHTML = "<span class='badge' style='font-size:18px'>"+sessionStorage.SensorName;
    var lengenddata = [];
    lengenddata.push("最大值");
    lengenddata.push("平均值");
    lengenddata.push("最小值");
    if(maxval==minval){
        maxval=maxval*1.5;
        minval=minval/2;
    }else{
        maxval=(maxval*1+(maxval-minval)*0.2).toFixed(Number_of_decimal);
        minval=(minval*1-(maxval-minval)*0.2).toFixed(Number_of_decimal);
    }
    drawchart();
    function drawchart() {
        //var myChart = echarts.init(document.getElementById('main'));
        var option = {
            color: ['#FFFF00', '#FF0000','#00ff00'],//
            backgroundColor: '#d0d0d0',
            title : {
                        text : sessionStorage.SensorName+":"+tname+'    变化趋势图  ',
                        x:"center",
                        subtext:jiange+"   "+sessionStorage.kssj+"——"+sessionStorage.jssj,
                        subtextStyle:{
                            color: "#000",
                        }
                    },/**/
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    var date = new Date(params.value[0]);
                    data = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' +
                        date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
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
                    magicType: { //
                        show: true,
                        type: ['line']
                    },
                    //, 'bar', 'stack', 'tiled'// 
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            legend: {
                data: lengenddata,
                orient:"horizontal",//"vertical",//
                x:'left',
                y:'30',
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
                    onZero:false
                }
            }],
            yAxis: [{
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: 'black',
                        width: 2
                    }
                },
                min:minval,
                max:maxval,
            }],/**/
            dataZoom: [{
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                xAxisIndex: 0,
                show: true,
                start: 0,
                end:100,
            },
            {   // 这个dataZoom组件，也控制x轴。
                type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件  
                start: 0,      // 左边在 10% 的位置。
                end: 100,       // 右边在 60% 的位置。 
            },
            /*{//官网示例正常，此处总是报错，数据位数控制时报非定义函数错误。
                type: 'slider',
                yAxisIndex: 0,
                start: 80,
                end: 100
            },
            {
                type: 'inside',
                yAxisIndex: 0,
                start: 80,
                end: 100
            }*/
            ],
            series: [{
                name: lengenddata[0],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text,
                type: 'line',
                step: step,
                showAllSymbol: true,
                symbolSize: 1,
                data: pa
            },
            {
                name: lengenddata[1],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text+"177",
                type: 'line',
                step: step,
                showAllSymbol: true,
                symbolSize: 1,
                data: pb
            },
            {
                name: lengenddata[2],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text+"最小值",
                type: 'line',
                step: step,
                showAllSymbol: true,
                symbolSize: 1,
                data: pc
            }
            ]
        };/**/
        myChart.hideLoading();
        myChart.setOption(option);
        myChart.on('click',function(params){
            if(params.name==""){}
        });
        myChart.resize;
    }
    function jisuan(a1,a2){
        for (var i = 1; i <obj_data.length; i++) {
            if(isNaN(parseFloat(obj_data[i].value))){
                obj_data[i].value=-1;
            }
            if(parseInt(obj_data[i].time.substr(a1,a2))==temp){
                if(parseFloat(obj_data[i].value)>maxvalue){
                    maxvalue=parseFloat(obj_data[i].value);
                    maxtime=obj_data[i].time;
                }
                if(parseFloat(obj_data[i].value)<minvalue){
                    minvalue=parseFloat(obj_data[i].value);
                    mintime=obj_data[i].time;
                }
                /*if(parseFloat(obj_data[i].value)>maxval){
                    maxval=parseFloat(obj_data[i].value);
                }
                if(parseFloat(obj_data[i].value)<minval){
                    minval=parseFloat(obj_data[i].value);
                }*/
                avgvalue=(parseFloat(avgvalue)+parseFloat(obj_data[i].value));
                ct++;
            }else{
                avgvalue=(avgvalue/ct);
                var tr = document.createElement('tr');
                tr.setAttribute("onclick","tableclick(this)");
                //var tdname = document.createElement('td');
                //tdname.setAttribute('class', 'seneorname');
                var tdtime = document.createElement('td');
                tdtime.className='time';
                var tdhourvalue=document.createElement('td');
                tdhourvalue.className="hvalue";
                var tdvalue1 = document.createElement('td');//最大值
                tdvalue1.className='value1'; //给单元格添加类名属性
                var tdvalue2 = document.createElement('td');//平均值
                tdvalue2.className='value2';
                var tdmaxtime=document.createElement('td');
                tdmaxtime.className="maxtime";
                var tdvalue3=document.createElement("td");//最小值
                tdvalue3.className='value3';
                var tdmintime=document.createElement('td');
                tdmintime.className="mintime";
                //tdname.innerHTML=sessionStorage.SensorName;
                if(type=="pd"){
                    tdvalue1.innerHTML = minvalue.toFixed(Number_of_decimal);
                    tdmaxtime.innerHTML=mintime;
                    tdvalue3.innerHTML = maxvalue.toFixed(Number_of_decimal);
                    tdmintime.innerHTML=maxtime;
                }else{
                    tdvalue1.innerHTML = maxvalue.toFixed(Number_of_decimal);
                    tdmaxtime.innerHTML=maxtime;
                    tdvalue3.innerHTML = minvalue.toFixed(Number_of_decimal);
                    tdmintime.innerHTML=mintime;
                }
                //tdename.innerHTML=data.Result[i].SensorName;//jsonObject[i].name;
                if(a1==11){
                    tdtime.innerHTML = strtime+":00";//
                }else{tdtime.innerHTML = strtime;}//+":00" //jsonObject[i].color;
                tdhourvalue.innerHTML=hourvalue.toFixed(Number_of_decimal);
                tdvalue2.innerHTML = avgvalue.toFixed(Number_of_decimal);
                //tr.appendChild(tdname);
                tr.appendChild(tdtime);
                tr.appendChild(tdhourvalue);
                tr.appendChild(tdvalue1);
                //tr.appendChild(tdvalue2);
                tr.appendChild(tdmaxtime);
                tr.appendChild(tdvalue3);
                tr.appendChild(tdmintime);
                //var tbody = document.getElementById('historydata-tbody');
                tbl.appendChild(tr);
                pa.push([strtodatetime(strtime+":00"), maxvalue, ps]);
                pb.push([strtodatetime(strtime+":00"), avgvalue.toFixed(Number_of_decimal), ps]);
                pc.push([strtodatetime(strtime+":00"),minvalue , ps]);
                maxvalue=minvalue=avgvalue=parseFloat(obj_data[i].value);
                hourvalue=parseFloat(obj_data[i].value);
                maxtime=mintime=obj_data[i].time;
                strtime=obj_data[i].time.substr(0,a2);
                temp=parseInt(strtime.substr(a1));
                ps++;
                ct=1;
            }
            maxval=maxval>maxvalue?maxval:maxvalue;//20200910 append 
            minval=minval<minvalue?minval:minvalue;
        }
    }
}//
function gradeChange() {
    $("#historydata-tbody tr").empty();
    var objS = document.getElementById("jcdd");
    sessionStorage.SensorId = objS.options[objS.selectedIndex].value;
    //gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj,sessionStorage.jssj);
}
/** 
 * 添加在改变标签后自动刷新所对应的配置项内容以及动态添加的配置项的点击响应，时段选取与查询的对应关系，所选节点变化所定义的标签树的更新功能，查询和导出按钮位置
	标签标题名称（包括告警查询页面）
	切换节点 页面图形、数据不能及时更新，二级菜单树总是有时自动选择某个菜单的问题，
	0727关于图表和数据列表的标签名称（单一和复合）与告警信息查询页的同步问题，
	0827 对返回数据中一些非数值类型的处理，如果为非数字则按-1来赋值。如果发生其他容错，则忽略。设置在最大值、最小值
	相同时的图形边界最大值和最小值设置处理；
	趋势图标题添加类别分组项的显示内容。
	去掉二次菜单  1126edit
*/
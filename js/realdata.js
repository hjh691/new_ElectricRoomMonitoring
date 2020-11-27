/**var t1 = window.setInterval("getrealdatabystation(1);",30000);
//getrealdatabynodeid(-1);
//当没有数据返回时更新页面造成报某变量未定义的问题value0. 
//20200709 实时值图表详情显示当天峰值的提示（已修改），数据列表表头刷新可以点击刷新按钮进行刷新（不必有数据);图形配置刷新；（没数不刷新，或限值不匹配原来不正确,标题undfine）
20200716 针对新实时数据页面添加实时最大值{仪表盘）、统计比例（柱状图）两个图表的数据计算过程，其中比例计算有待进一步完善。修改某标签过去24小时最大值和实时值以及变化趋势图的
    刷新过程，添加在主页面点击二级菜单时，对历史数据等页面的配置项进行更新显示功能
**/
var chart_type = "", chart_unit = "", chart_max = 100, chart_min = 0, chart_sigle = "", is_have = false;
var start_angle = 0, end_angle = 180;
var myChart2 = echarts.init(document.getElementById('realdata_chart'));//趋势图
var myChart = echarts.init(document.getElementById('realdata_maxvalOfDay'));//24小时极值
var mychart3=echarts.init(document.getElementById('realdata_rateOfNormal'));//占比统计
var myChart1=echarts.init(document.getElementById('realdata_maxvalOfReal'));//实时极值
var myChart4=echarts.init(document.getElementById('realdata_realdata'));//实时值
var option,option1,option2,option3,option4;//对应mychart（1-4）的配置项 need speed seed deed
var chartdataname1="温度";
var sname="",sid,type_td,title_index=3;
let isfirst = "true";
var maxval = 0, minval = 0, maxvalue = 0, minvalue = 0,value0=0,maxOfRealdata=0;//value0未定义错误
var maxvaluetime="",happentime="";
var colors = [];
var pageSize = 100;    //每页显示的记录条数
var curPage = 0;        //当前页
//var lastPage;        //最后页
var direct = 0;        //方向
var len;            //总行数
var page;            //总页数
var begin;
var end;
var count=0;
var $table;
var sign = '>';
var allconfigs;
var allselect=null;
var typename="",titlename="";
var tab_head;
var backgroudcolor='#999';
//var obj_realdata;
var datas = [];
var alertconfig=[10,20,30,40];
var alertcount=[10,20,30,40];
initrealdata();
function initrealdata(){
    datas = [];
    datas.splice(0, datas.length);//
    for (var i = 0; i < 1; i++) {
        var value = 0;//(Math.random() * 100).toFixed(2) - 0;
        datas.push(JSON.parse('{"name":"","value":' + value + '}'));
        var value = 0;//(Math.random() * 100).toFixed(2) - 0;
        datas.push(JSON.parse('{"name":"","value":' + value + '}'));//砸死 大堤砸掉
    }
    updatachart(chart_type);
    initseries(datas);
    initchart2();
    initpage();
}
function initpage() {
    updatapcnav(3);
    sessionStorage.framepage="newrealdata.html";
    tab_head=document.getElementById("tab_head");
    if (typeof (Worker) !== "undefined") {//只在网络状态下可用，本地磁盘目录下不可用。
        if (typeof (w1) == "undefined") {
            w1 = new Worker("delay_worker.js");
        }
        var i = 0;
        w1.onmessage = function (event) {
            i++
            if (i % 60 == 0) {
                //getrealdatabynodeid(-1);rage
                decoderealdata();
            }
        };
    } else {
        var t1 = window.setInterval("getrealdatabynodeid(-1);", 60000);
    }
    appendalldisplaytype("display_type");/**/
    btn_refresh_click();
}
$(function () {
    $(".btn").click(function(){
        $(this).button('toggle');
        dname= $(".btn:checked").val();
        catalog=getcatalog(dname);
        gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj,sessionStorage.jssj);
    });
});
function appendalldisplaytype(){
    var display_type=document.getElementById("display_type");
    for(var i=display_type.childNodes.length;i>0;i--)
    display_type.removeChild(display_type.childNodes[i-1]);
    allconfigs=JSON.parse(localStorage.Configs);
    if(allconfigs){//检查配置中是否有catalog项
        //for(var i=0;i<allconfigs.length;i++){
            for(var ac in allconfigs){//如果有，读取其所有配置项
                var s_des=allconfigs[ac].details;
                for(var p in s_des){
                    var lab=document.createElement("label");
                    lab.setAttribute("style","margin-left:20px")
                    var ainput=document.createElement("input");
                    ainput.setAttribute("type","checkbox");
                    ainput.setAttribute("name","options");
                    ainput.setAttribute("value",s_des[p].name);
                    ainput.className="btn";
                    //ainput.setAttribute('onclick','checkboxclick("'+s_des[p].Name+'")')
                    ainput.innerText=s_des[p].desc;
                    ainput.className="catalog";
                    var spn=document.createElement("span");
                    spn.innerHTML=s_des[p].desc;
                    if(p==0){
                        name=s_des[p].name;
                        catalog=s_des[p].type;//Catalog;
                        ainput.checked=true;
                        lab.className=""
                    }else{
                        lab.className="";
                    }
                    lab.appendChild(ainput);
                    lab.appendChild(spn);
                    //lab.innerHTML='<input class="catalog" type="checkbox" name="options" value="'+s_des[p].Name+'" >'+s_des[p].Desc;
                    display_type.appendChild(lab);
                }
            }
        //}
        $.sortTable.sort('realtable',3);
    }
}
//"刷新"按钮点击事件
function btn_refresh_click(obj){
    allselect = $('[name="options"]');
    refresh_tabhead(allselect);
    decoderealdata();
}
function refresh_tabhead(sel){
    count=0;
    if(sel){
        //tab_head=document.getElementById("tab_head");
        for (var j = tab_head.rows.length - 1; j >= 0; j--) {
            tab_head.removeChild(tab_head.rows[j]);
        }
        var th_tr=document.createElement("tr");
        th_tr.setAttribute("id","th_tr");
        var th_th=document.createElement("th");
        th_th.setAttribute("style","display:none");
        th_th.setAttribute("width","180px");
        th_th.innerHTML="编号";
        th_tr.appendChild(th_th);
        th_th=document.createElement("th");
        th_th.setAttribute("onclick","$.sortTable.sort('realtable',1)");
        th_th.setAttribute("width","180px");
        var aa=document.createElement("a");
        aa.setAttribute("href","javascript:");
        aa.innerHTML='测量点名称<span class="sensorname"></span>';
        th_th.appendChild(aa);
        th_tr.appendChild(th_th);
        th_th=document.createElement("th");
        th_th.setAttribute("onclick","$.sortTable.sort('realtable',2)");
        aa=document.createElement("a");
        aa.setAttribute("href","javascript:");
        aa.innerHTML='测量时间<span class="time"></span>';
        th_th.appendChild(aa);
        th_th.setAttribute("width","180px");
        th_tr.appendChild(th_th);
        for(var k=0;k<sel.length;k++){
            count++;
            th_th=document.createElement("th");
            th_th.setAttribute("width","180px");
            th_th.setAttribute("onclick","$.sortTable.sort('realtable',"+(k+3)+")");
            aa=document.createElement("a");
            aa.setAttribute("href","javascript:");
            aa.innerHTML=sel[k].textContent+'<span class="value"'+(k+1)+'></span>';
            th_th.appendChild(aa);
            th_tr.appendChild(th_th);
            if(!sel[k].checked){
                th_th.setAttribute("style","display:none");
                count--;
            }
        }
        /*th_th=document.createElement("th");
        th_th.innerHTML="查看历史数据";
        th_th.setAttribute("width","180px");
        th_tr.appendChild(th_th);
        th_th=document.createElement("th");
        th_th.innerHTML="查看告警信息";
        th_th.setAttribute("width","180px");
        th_tr.appendChild(th_th);*/
        th_th=document.createElement("th");
        th_th.setAttribute("width","180px");
        th_th.innerHTML="类别";
        th_th.style.cssText="display:none";
        th_tr.appendChild(th_th);
        th_th=document.createElement("th");
        th_th.setAttribute("width","180px");
        th_th.style.cssText="display:none";
        th_th.innerHTML="信息";
        th_tr.appendChild(th_th);
        tab_head.appendChild(th_tr);
    }else{
        //var tab_head=document.getElementById("tab_head");
        for (var j = tab_head.rows.length - 1; j >= 0; j--) {
            tab_head.removeChild(tab_head.rows[j]);
        }
        var th_tr=document.createElement("tr");
        th_tr.setAttribute("id","th_tr");
        var th_tr=document.createElement("tr");
        th_tr.setAttribute("id","th_tr");
        var th_th=document.createElement("th");
        th_th.setAttribute("style","display:none");
        th_th.innerHTML="编号";
        th_th.setAttribute("width","150px");
        th_tr.appendChild(th_th);
        th_th=document.createElement("th");
        th_th.setAttribute("onclick","$.sortTable.sort('realtable',1)");
        var aa=document.createElement("a");
        aa.setAttribute("href","javascript:");
        aa.innerHTML='测量点名称<span class="sensorname"></span>';
        th_th.appendChild(aa);
        th_th.setAttribute("width","150px");
        th_tr.appendChild(th_th);
        th_th=document.createElement("th");
        th_th.setAttribute("onclick","$.sortTable.sort('realtable',2)");
        aa=document.createElement("a");
        aa.setAttribute("href","javascript:");
        aa.innerHTML='测量时间<span class="time"></span>';
        th_th.appendChild(aa);
        th_th.setAttribute("width","150px");
        th_tr.appendChild(th_th);
        var tdname="";
        if(obj_realdata){
            for(var i=0;i<obj_realdata.length;i++){
                if(tdname==obj_realdata[i].name){
                    continue;
                }else{
                    var thd=document.createElement("td");
                    thd.setAttribute("onclick","$.sortTable.sort('realtable',"+(count+3)+")");
                    aa=document.createElement("a");
                    aa.setAttribute("href","javascript:");
                    aa.innerHTML=obj_realdata[i].name+'<span class="value"'+count>+'</span>';
                    thd.appendChild(aa);
                    thd.setAttribute("width","150px");
                    tdname=obj_realdata[i].name;
                    thd.innerHTML=obj_realdata[i].name;
                    th_tr.appendChild(thd);
                    count++
                }
            }
        }
        /*th_th=document.createElement("th");
        th_th.innerHTML="查看历史数据";
        th_th.setAttribute("width","150px");
        th_tr.appendChild(th_th);
        th_th=document.createElement("th");
        th_th.innerHTML="查看告警信息";
        th_th.setAttribute("width","150px");
        th_tr.appendChild(th_th);*/
        th_th=document.createElement("th");
        th_th.setAttribute("width","150px");
        th_th.innerHTML="类别";
        th_th.style.cssText="display:none";
        th_tr.appendChild(th_th);
        th_th=document.createElement("th");
        th_th.setAttribute("width","150px");
        th_th.style.cssText="display:none";
        th_th.innerHTML="信息";
        th_tr.appendChild(th_th);
        tab_head.appendChild(th_tr);
    }
    //document.getElementById("realtable").width=150*(count+5)+"px";// 设定数据列表的总宽度
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
//根据数据列值获取Catalog。
function getCatalog(index){
    var  catalogsel = $('[name="options"]');
    typename=catalogsel[index].value;
    titlename=catalogsel[index].textContent;//显示项的标题 //20200518
    updatachart(typename);//0709 更新图表配置
    refreshData();
    if(allconfigs){
        for(var q in allconfigs){
            for(var l in allconfigs[q].details){
                if(allconfigs[q].details[l].name.toLowerCase()==typename.toLowerCase()){
                    var configname=allconfigs[q].name;
                    var jo_config=JSON.parse(localStorage.Config);
                    for(var c in jo_config)
                        if(jo_config[c].name.toLowerCase()==configname.toLowerCase()){
                            if(!jQuery.isEmptyObject(jo_config[c].details)){
                                var d_config=jo_config[c].details; //20200918 获取配置项参数 由allconfigs（typeconfigs）的details里的name找到typename，然后取其
                                for(var i in d_config){            //name,由name到configs里查找name，找到后从其details里提取config，然后从config中提取所需的配置数值。
                                    if((d_config[i].name.toLowerCase()==typename.toLowerCase())&&((d_config[i].config))){
                                        chart_unit=d_config[i].config.Unit;
                                        chart_max=d_config[i].config.Top;
                                        chart_min=d_config[i].config.Bot;
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    return allconfigs[q].details[l].folder;
                }
            }
        }
    }
}
function decoderealdata(obj_realdata) {
    //$("#realdata-tbody tr").empty();
    var v_sel = $('[name="options"]');
    $table = document.getElementById('realdata-tbody');
    //var tableLength = $table.rows.length;
    for (var j = $table.rows.length - 1; j >= 0; j--) {
        $table.removeChild($table.rows[j]);
    }
    if(!obj_realdata){
        obj_realdata=JSON.parse(localStorage.getItem("realdata"));
    }
    var sensors = JSON.parse(localStorage.getItem("sensors"));
    var obj_data = new Object();
    var pt = 0;
    var kssj = getCurrentDate(1) + " 00:00:00";
    var jssj = getCurrentDate(2);
    var grouptype,dname;
    var isnew=true,isfind=false,isbreak=false;
    var atr;
    sid=-1;
    if (obj_realdata) {
        refresh_tabhead(v_sel);//根据选项刷新表头的显示内容
        var title_len=tab_head.rows[0].cells.length;
        if(v_sel){//有显示控制选择项时进行如下操作.
            for (var j=0;j<obj_realdata.length;j++) {
                dname=obj_realdata[j].name;
                grouptype=obj_realdata[j].type;//Catalog;
                if(obj_realdata[j].sensorId==sid){//是否为新的标签项,相同标签的数据默认连续
                    isnew=false;
                }else{ 
                    sid=obj_realdata[j].sensorId;
                    isnew=true;
                }
                if (sensors&&isnew)
                for (var i = 0; i < sensors.length; i++) {//是否在需要显示的标签列表中
                    if(obj_realdata[j].sensorId==sensors[i].id){
                        //sid = sensors[i].id + "";
                        type_td = sensors[i].Value.type;//Catalog;//
                        sname = sensors[i].Value.name;
                        isfind=true;
                        break;
                    }
                }
                if(isfind){//在需要显示的标签列表
                    //isnew=true;
                    obj_data = (obj_realdata)[j];////sid
                    if(isnew){//如果是新的标签，就创建一行，添加所有的td单元，
                        atr=document.createElement("tr");
                        atr.setAttribute("onclick", "tableclick(this)");//ondblclick
                        for(var k=0;k<tab_head.rows[0].cells.length;k++){
                            var atd=document.createElement("td");
                            atd.setAttribute("width","150px");
                            atr.appendChild(atd);
                        }
                        atr.cells[0].innerHTML=sid;//标签id
                        atr.cells[0].style.cssText="display:none";
                        atr.cells[1].innerHTML=sname;//第一列添加标签名称，
                        atr.cells[2].innerHTML=obj_data.time;//第二列添加测量时间
                        // 取过去24小时时间，用于调取历史记录
                        var ckssj=new Date((obj_data.time.replace(/-/g,"/")));//.replace(/-/g,"/"));
                        var yesterdayend=ckssj-(1000*60*60*24);
                        //sessionStorage.kssj=dateToString(new Date(yesterdayend),2);
                        kssj = dateToString(new Date(yesterdayend),2);//new Date((obj_data.Time).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
                        jssj = obj_data.time;
                        //atr.cells[tab_head.rows[0].cells.length-4].innerHTML="<button backgroundColor='#fff' onclick=tohistory("+sid+") href='javascript:void(0)'>>></button>";
                        //atr.cells[tab_head.rows[0].cells.length-3].innerHTML="<button backgroundColor='#fff' onclick=towarnlog("+sid+") href='javascript:void(0)'>>></button>";
                        atr.cells[tab_head.rows[0].cells.length-2].innerHTML=obj_data.name;
                        atr.cells[tab_head.rows[0].cells.length-2].style.cssText="display:none";
                        atr.cells[tab_head.rows[0].cells.length-1].innerHTML=obj_data.message;
                        atr.cells[tab_head.rows[0].cells.length-1].style.cssText="display:none";
                        for(var k=0;k<v_sel.length;k++){//添加到指定列,不同配置项添加到不同的列，由显示控制项控制显示与否
                            if(v_sel[k].value==dname){
                                atr.cells[k+3].innerHTML=(obj_data.value*1).toFixed(Number_of_decimal);
                            }
                            if(!v_sel[k].checked){
                                atr.cells[k+3].style.cssText = "display:none";
                            }
                        }
                        $table.appendChild(atr);
                        pt++;
                    }else{//不是新标签
                        for(var l=0;l<$table.rows.length;l++){
                            if($table.rows[l].cells[0].innerHTML==obj_data.sensorId){
                                for(var k=0;k<v_sel.length;k++){//对照用户所选显示项，添加显示值到对应列，
                                    if(v_sel[k].value==dname){
                                        $table.rows[l].cells[k+3].innerHTML=(obj_data.value*1).toFixed(Number_of_decimal);
                                        isbreak=true;
                                        if($table.rows[l].cells[1].innerHTML<obj_data.time){//更新最新时间
                                            $table.rows[l].cells[1].innerHTML=obj_data.time;
                                        }
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    /*var xs = 1;//sensors[i].Value.Factor;  //数据结构修改，后台的value数据已经乘上系数，svalue为未乘以系数的原始数据
                    //if(type_td=="pd"){xs=xs*-1}
                    if(isbreak){
                        continue;
                    }
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
                    tdtime.innerHTML = obj_data.Time; //jsonObject[i].color;
                    kssj = (obj_data.Time).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
                    jssj = obj_data.Time;
                    tdvalue.innerHTML = (obj_data.Value * xs).toFixed(Number_of_decimal);
                    //tdvalue2.innerHTML = (obj_data[0].Value*xs/1.5).toFixed(Number_of_decimal);//此处应为第二个数值，目前没有意义
                    tdhistory.setAttribute('backgroundColor', '#ffffff');
                    tdhistory.setAttribute('onclick', 'tohistory(' + sid + ')');
                    tdhistory.innerHTML = "<button href='javascript:void(0)'>>></button>";
                    tdwarnlog.setAttribute('onclick', 'towarnlog(' + sid + ')');
                    tdwarnlog.setAttribute('backgroundColor', '#ffffff');
                    //tdwarnlog.style.cssText="display:none";
                    tdwarnlog.innerHTML = '<button href="javascript:void(0)">>></button>';
                    var mes = obj_data.Message;
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
                    break;*/
                }
            }
        }else{//如果没有显示控制项（分组配置项） 20200509 编写，还需测试完善。
            for (var j=0;j<obj_realdata.length;j++) {
                dname=obj_realdata[j].name;
                grouptype=obj_realdata[j].type;//Catalog;
                if(obj_realdata[j].SensorId==sid){//是否为新的标签项
                    isnew=false;
                }else{ 
                    sid=obj_realdata[j].sensorId;
                    isnew=true;
                }
                if (sensors&&isnew)
                for (var i = 0; i < sensors.length; i++) {//是否在需要显示的标签列表中
                    if(obj_realdata[j].sensorId==sensors[i].id){
                        //sid = sensors[i].id + "";
                        type_td = sensors[i].Value.tyoe;//Catalog;
                        sname = sensors[i].Value.name;
                        isfind=true;
                        break;
                    }
                }
                if(isfind){//在需要显示的标签列表
                        //isnew=true;
                    obj_data = (obj_realdata)[j];////sid
                    if(isnew){//如果是新的标签，就创建一行，添加所有的td单元，
                        atr=document.createElement("tr");
                        var length=tab_head.rows[0].cells.length
                        for(var k=0;k<length;k++){
                            var atd=document.createElement("td");
                            atr.appendChild(td);
                        }
                        atr.cells[0].innerHTML=sid;
                        atr.cells[0].style.cssText="display:none";
                        atr.cells[1].innerHTML=sname;//第一列添加标签名称，
                        atr.cells[2].innerHTML=obj_data.time;//第二列添加测量时间
                        // 取过去24小时时间，用于调取历史记录
                        var ckssj=new Date((obj_data.Time.replace(/-/g,"/")));//.replace(/-/g,"/"));
                        var yesterdayend=ckssj-(1000*60*60*24);
                        //sessionStorage.kssj=dateToString(new Date(yesterdayend),2);
                        kssj = dateToString(new Date(yesterdayend),2);//new Date((obj_data.Time).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
                        jssj = obj_data.time;
                        //atr.cells[length-2].innerHTML="<button backgroundColor='#fff' onclick=tohistory("+sid+") href='javascript:void(0)'>>></button>";
                        //atr.cells[length-1].innerHTML="<button backgroundColor='#fff' onclick=towarnlog("+sid+") href='javascript:void(0)'>>></button>";
                        for(var k in tab_head.rows[0].cells){//添加到指定列。
                            if(obj_data.name==tab_head.rows[0].cells[k].innerHTML){
                                atr.cells[k].innerHTML=obj_data.value.toFixed(Number_of_decimal);
                                break;
                            }
                        }
                        atr.cells[tab_head.rows[0].cells.length-2].innerHTML=obj_data.name;
                        atr.cells[tab_head.rows[0].cells.length-2].style.cssText="display:none";
                        atr.cells[tab_head.rows[0].cells.length-1].innerHTML=obj_data.message;
                        atr.cells[tab_head.rows[0].cells.length-1].style.cssText="display:none";
                        $table.appendChild(atr);
                    }else{//不是新标签
                        for(var l=0;l<$table.rows.length;l++){//定位到指定行
                            if($table.rows[l].cells[0].innerHTML==obj_data.sensorId){
                                for(var k in tab_head.rows[0].cells){
                                    if(obj_data.name==tab_head.rows[0].cells[k].innerHTML){//添加到指定列
                                        atr.cells[k].innerHTML=obj_data.Value.toFixed(Number_of_decimal);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (pt > 0) {
            var tableLength = $table.rows.length;
            for (var int = 0; int < tableLength; int++) {
                if ($table.rows[int].cells[0].innerHTML == sessionStorage.SensorId) {
                    sessionStorage.t_p = int;
                }
                if(($table.rows[int].cells[title_index].innerHTML)*1>maxOfRealdata){
                    maxOfRealdata=($table.rows[int].cells[title_index].innerHTML)*1
                    maxvaluetime=($table.rows[int].cells[2].innerHTML);
                }
                jisuanyichangbili(($table.rows[int].cells[title_index].innerHTML)*1);
            }
            if (typeof (sessionStorage.t_p) != "undefined") {
                sname = $table.rows[sessionStorage.t_p].cells[1].innerHTML;
                //chart_type = $table.rows[sessionStorage.t_p].cells[6].innerHTML;
                sensor_Id = parseInt($table.rows[sessionStorage.t_p].cells[0].innerHTML);
                var lasttime = $table.rows[sessionStorage.t_p].cells[2].innerHTML;
                //var myChart2 = echarts.init(document.getElementById('realdata_chart'));
                updatachart(typename);
                value0 = ($table.rows[sessionStorage.t_p].cells[title_index].innerHTML)*1;//字符转实数；
                //value1=parseFloat($table.rows[sessionStorage.t_p].cells[3].innerHTML);
                var heightpx = $("#realdata-tbody tr").height() + 1;//加1是网格线的宽度
                var ppt = +sessionStorage.t_p;
                $("#realdata-tbody").scrollTop((ppt) * heightpx);//表格重新滚动定位到选定的行张丽欣
                $table.rows[ppt].style.backgroundColor = color_table_cur;
                if (isfirst != true) {
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
                            //myChart.setOption(option);//
                        }
                        refreshData();
                    }
                } else {
                    isfirst = false;
                    //myChart2.showLoading();
                    gethistorydata(sensor_Id,catalog,typename, kssj, jssj, 1);
                }
            }//else{	//$table.rows[0].ondblclick();	//}
            //showstateinfo("");
        } else {
            layer.alert("没有符合条件的数据",info_showtime);
            showstateinfo("没有符合条件的数据");
        }
    } else {
        layer.alert("没有符合条件的数据", info_showtime);
        showstateinfo("没有符合条件的数据");
    }
    //$table.rows[t_pt].scrollIntoView();
    //refreshData();
    display();
}
function updatachart(atype) {
    switch (atype.toLowerCase()) {
        case "temp":
        case "tmp":
            //if(!chart_min)//20200518 如果获取的配置项参数为空或不存在，则赋予默认值
                chart_min = -30;
            //if(!chart_max)
                chart_max = 170;
            start_angle = -45;
            //if(!chart_unit)
                chart_unit = "℃"
            chart_sigle = "";
            colors = [[0.15, '#1e90ff'], [0.4, '#090'], [0.6, '#ffa500'], [0.8, '#ff4500'], [1, '#ff0000']];
            break;
        case "pd":
            //if(!chart_min)
                chart_min = 0;
            //if(!chart_max)
                chart_max = -100;
            //if(!chart_unit)
                chart_unit = "dB";
            chart_sigle = ""
            colors = [[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']];
            break;
        default:
            //if(!chart_min)
                chart_min = 0;
            //if(!chart_max)
                chart_max = 100;
            //if(!chart_unit)
                chart_unit = "";
            chart_sigle = ""
            colors = [[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']];
    }
}
function tableclick(tr) {
    $(tr).siblings("tr[backgroundColor!='#ff0']").css("background", "");
    sessionStorage.t_p = tr.rowIndex - 1;
    sname = tr.cells[1].innerHTML;
    //chart_type = tr.cells[tr.cells.length-2].innerHTML;
    updatachart(typename);
    if(title_index!=-1)
        value0 = parseFloat(tr.cells[title_index].innerHTML).toFixed(Number_of_decimal);
    //value1=parseFloat(tr.cells[3].innerHTML);
    if (parseInt(tr.cells[0].innerHTML) != sessionStorage.SensorId) {
        sessionStorage.SensorId = parseInt(tr.cells[0].innerHTML);
        var kssj = getCurrentDate(1) + " 00:00:00";
        var jssj = getCurrentDate(2);
        kssj = (tr.cells[2].innerHTML).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
        jssj = (tr.cells[2].innerHTML);
        myChart2.showLoading();
        gethistorydata(sessionStorage.SensorId,catalog,typename, kssj, jssj, 1);
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
        backgroundColor: backgroudcolor,
        title: {
            //left: '40%',
            offsetCenter: ['200%', '0'],
            textStyle: {
                color: 'white',
            },
            text: sname+"--24小时极值",
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
                name: '24小时峰值',
                type: 'gauge',
                center: ['50%', '50%'], // 默认全局居中
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
                    text: '24小时峰值',
                    textStyle: {
                        color: 'white',
                        fontSize: 20
                    }
                },
                detail: {
                    show: true,
                    offsetCenter: [0, '80%'],
                    formatter: ' {value}  \n\n' + '时间: ' + happentime,//+chart_unit,
                    textStyle: {
                        fontSize: 20, 
                        color: '#F8F43C'
                    }
                },
                data: [data[0]],//[{value: 20,name: '温度'}]
            },
        ]
    };
    myChart.setOption(option);//24小时极值
    option4 = {
        backgroundColor: backgroudcolor,
        title: {
            //left: '40%',
            offsetCenter: ['200%', '0'],
            textStyle: {
                color: 'white',
            },
            text: sname+"-实时值",
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
                name: '实时值',
                type: 'gauge',
                center: ['50%', "50%"], // 默认全局居中
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
                    formatter:  '{value}  \n\n' + '实时值: ' + ' ',//'实时值:\n\n' + ' ' + ' {value}  ' + chart_unit,
                    textStyle: {
                        fontSize: 20,
                        color: '#F8F43C'
                    }
                },
                data: [data[1],],//[{value: 20,name: '温度'}]
            }
        ]
    };
    myChart4.setOption(option4);
    initecharts();
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
    //option.series[0].data[0].value = maxvalue;
    option.series[0].max = chart_max;
    option.series[0].min = chart_min;
    value = option.series[0].data[0].value;
    option.series[0].detail.formatter = chart_sigle + value + ': \n\n' +"时间："+happentime;//+chart_unit;
    option.series[0].data[0].name = chart_unit;//sname;
    option.title.text = sname+" : "+titlename;
    /*for (var i = 0; i < option.series.length; i++) {
        option.series[i].axisLine.lineStyle.color = colors;
        option.series[i].max = chart_max;
        option.series[i].min = chart_min;
        value = option.series[i].data[0].value;
        option.series[i].detail.formatter = chart_sigle + value + ': \n\n' + option.series[i].name + ' ';//+chart_unit;
        option.series[i].data[0].name = chart_unit;//sname;
        option.title.text = sname+" : "+titlename;//添加显示项的标题指示；*/
        //形成进度条式的填充仪表效果并分段显示不同延时用于指示不同状态。    
        /*if(value<20){
            option.series[i].axisLine.lineStyle.color[0]=[value/100,'blue'];
        }else if(value<80){
            option.series[i].axisLine.lineStyle.color[0]=[value/100,"green"];
        }else{
            option.series[i].axisLine.lineStyle.color[0]=[value/100,"red"];
        }
    }*/
    myChart.setOption(option);
    option4.series[0].data[0].value = val1;
    option4.series[0].max = chart_max;
    option4.series[0].min = chart_min;
    value = option4.series[0].data[0].value;
    option4.series[0].detail.formatter = chart_sigle + value + ': \n\n' + option.series[0].name + ' ';//+chart_unit;
    option4.series[0].data[0].name = chart_unit;//sname;
    option4.title.text = sname+" : "+titlename;
    myChart4.setOption(option4);
    option1.series[0].data[0].value= 54.321;//maxOfRealdata.toFixed(Number_of_decimal);
    myChart1.setOption(option1);
    for(var i=0;i<4;i++){
        option3.series[0].data[i].value=alertcount[i];
    }
    mychart3.setOption(option3);
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
        maxvalue=NaN;//20200518
        myChart2.hideLoading();
        refreshData();//20200518
        return;
        //drawchart();
    }
    minval = maxval =value0;// obj_chartdata[0].Value;
    for (var i = 0; i < obj_chartdata.length; i++) {
        pa.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value, i])
        //pb.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value/1.5, i])
        //pc.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value/2, i])
        if (parseFloat(obj_chartdata[i].Value) > maxval) {
            maxval = obj_chartdata[i].Value;
            happentime=obj_chartdata[i].Time;
        }
        if (parseFloat(obj_chartdata[i].Value) < minval) {
            minval = obj_chartdata[i].Value;
        }
    }
    maxvalue = (maxval * 1).toFixed(Number_of_decimal);
    minvalue = (minval * 1).toFixed(Number_of_decimal);
    if(maxval==minval){
        maxval=maxval*1.5;
        minval=minval/2;
    }else{
        maxval=(maxval*1+(maxval-minval)*0.2).toFixed(Number_of_decimal);
        minval=(minval*1-(maxval-minval)*0.2).toFixed(Number_of_decimal);
    }
    var lengenddata = [];
    lengenddata.push("当天峰值");
    lengenddata.push("实时值");
    //lengenddata.push(document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text+"457");
    option.series[0].data[0].value = maxvalue;
    //option.series[0].data[0]
    //myChart.setOption(option);
    refreshData();
    drawchart();
    decoderealdata();//进行一次实时数据刷新，完善图表的指示内容；//20200518
    //绘制图形线条
    function drawchart() {
        //var myChart = echarts.init(document.getElementById('main'));
        var lengenddata1 = [];
        lengenddata1.push(titlename);//20200518
        var option2 = {
            color: ['#FF0000', '#FFFF00'],//,'#00ff00'
            backgroundColor: '#d0d0d0',
            title: {
                text: titlename+' : 当天变化趋势图',//20200518
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
                show: false,
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
                splitNumber: 6,
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
                smooth: true//平滑曲线 sangeshijianjiedianshang
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
        color: ['#FFFF00', '#FF0000'],//,'#00ff00' complain mountain 
        backgroundColor: backgroudcolor,
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
            show: false,
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
    //if(page==0) page=1; 为零时，即只有第一页，第零页即第一页
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
    //lastPage = curPage;
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
function initecharts(){
    option1 = {
        backgroundColor: backgroudcolor,
        title: {
            //left: '40%',
            offsetCenter: ['200%', '0'],
            textStyle: {
                color: 'white',
            },
            text: '实时极值',
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
                name: '实时极值',
                type: 'gauge',
                center: ['50%', '50%'], // 默认全局居中
                radius: '60%',//半径
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
                        fontSize: 18
                    }
                },
                detail: {
                    show: true,
                    offsetCenter: [0, '100%'],
                    formatter: ' {value}  \n\n' + '发生时刻: ' +maxvaluetime+ '\n\n 标签名称: '+sname,//+chart_unit,
                    textStyle: {
                        fontSize: 16,
                        color: '#F8F43C'
                    }
                },
                data: [{value: 20,name: chartdataname1}],//[data[0]],//
            },
        ]
    };
    myChart1.setOption(option1);
    option3 = {
        backgroundColor: backgroudcolor,
        color:['#090','#055','#f70','#b00','#095','#f0f','#444'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        title : {
            text: "比例统计图",
            textStyle:{
                color: "#FFF",
            },
        },
        /*xAxis: [
            {
                type: 'category',
                data: ['正常', '预警', '一级', '二级', '告警'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],*/
        series: [
            {
                name: '占比统计',
                type: 'pie',
                radius: ['30%', '60%'],
                avoidLabelOverlap: false,
                label: {
                    show: true,
                    position: 'out',
                    color:"#fff"
                },
                //barWidth: '60%',
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: true
                },
                data: [{value:310,name:'正常'}, {value:52,name:'预警'},{value:20,name:'一级告警'} ,
                    {value:34,name:'二级告警'}]//,,{value:90,name:'告警'}
                    //{value:30,name:'故障'},{value: 20,name: '停运'}]
            }
        ]
    };
    mychart3.setOption(option3);
}
function jisuanyichangbili(avalue){
    if(avalue>alertconfig[3]){
        alertcount[3]++;
    }else if(avalue>alertconfig[2]){
        alertcount[2]++;
    }else if(avalue>alertconfig[1]){
        alertcount[1]++;
    }else if(avalue>alertconfig[0]){
        alertcount[0]++;
    }else{
        normal++;
    }
}

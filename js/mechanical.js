/**var t1 = window.setInterval("getrealdatabystation(1);",30000);
//getrealdatabynodeid(-1);
//当没有数据返回时更新页面造成报某变量未定义的问题value0. 
**/
var chart_type = "", chart_unit = "", chart_max = 100, chart_min = 0, chart_sigle = "", is_have = false;
var start_angle = 0, end_angle = 180;
var myChartMechanicalVolt = echarts.init(document.getElementById('mechanical_volt'));//温度
var myChartMechanicalVt = echarts.init(document.getElementById('mechanical_vt'));//温度趋势
//var mychart3=echarts.init(document.getElementById('realdata_rateOfNormal'));//占比统计
var myChartMechanicalLt=echarts.init(document.getElementById('mechanical_lt'));//湿度趋势
var myChartMechanicalCurrent=echarts.init(document.getElementById('mechanical_current'));//湿度
var optionMechanicalVolt,optionMechanicalLt,optionMechanicalVt,option3,optionMechanicalCurren;//对应mychart（1-4）的配置项 need speed seed deed
var chartdataname1="";
var sname="",sid,type_td,title_index=3;
//let isfirst = "true";
//var maxval = 0, minval = 0, maxvalue = 0, minvalue = 0,value0=0,maxOfRealdata=0;//value0未定义错误
//var maxvaluetime="",happentime="",maxOfRealdataName="";
//var colors = [];
//var allconfigs;
//var allselect=null;
//var typename="",titlename="";
//var tab_head;
var backgroudcolor='#aaaaaa';
//var obj_realdata;
var datas = [];
//let haverealdata=false;
//var catalog="Defalt";
var display_type=document.getElementById("display_type");
var base = +new Date();
var oneDay = 24 * 3600 * 1000;
var oneTime=5*6000;
var visdata = [[base, Math.random() * 100]];

var TP_value = 55;
var kd = [];
var Gradient = [];
var leftColor = '';
var showValue = '';
var boxPosition = [85, 0];
var TP_txt = ''
var now = new Date(base += oneTime);
initrealdata();
function initrealdata(){
    try{
    datas = [];
    datas.splice(0, datas.length);//
    for (var i = 0; i < 1; i++) {
        var value = (Math.random() * 100).toFixed(2) - 0;
        datas.push(JSON.parse('{"name":"","value":' + value + '}'));
        var value = (Math.random() * 5).toFixed(2) - 0;
        datas.push(JSON.parse('{"name":"","value":' + value + '}'));//
    }
    for (var i = 1; i < 24; i++) {
        now = new Date(base += oneDay);
        visdata.push([
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
            Math.round((Math.random() - 0.5) * 100 )
        ]);
    }
    updataMechanicalChart(chart_type);
    initMechanicalSeries(datas);
    initMechanicalChart2(visdata);
    //initchart2();
    initMechanicalPage();
    }catch(err){
        showstateinfo(err.message.message,"initrealdata");
    }
}
function initMechanicalPage() {
    //updatapcnav(3);
    //保存页面现场，在点击浏览器的刷新按钮刷新时应用
    /*sessionStorage.framepage="newrealdata.html";
    sessionStorage.pageinfex=2;
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
    }*/
    //appendalldisplaytype();/*"display_type"*/
    //btn_refresh_click();//210
    //window.parent.closeloadlayer();
    var t1 = window.setInterval("refreshDataForMechanical();", 5000);
}
/*$(function () {
    $(".btn").click(function(){
        $(this).button('toggle');
        dname= $(".btn:checked").val();
        catalog=getcatalog(dname);
        gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj,sessionStorage.jssj);
    });
});*/
/*function appendalldisplaytype(){
    try{
    for(var i=display_type.childNodes.length;i>0;i--)
        display_type.removeChild(display_type.childNodes[i-1]);
    allconfigs=JSON.parse(localStorage.Configs);
    var sel_datatypename=[];
    if(sessionStorage.sel_datatypename) 
    {
        sel_datatypename=JSON.parse(sessionStorage.sel_datatypename);
    }
    if(sel_datatypename.length>0){
        for(var i=0;i<sel_datatypename.length;i++){
            add_displaytype(display_type,sel_datatypename[i].value,sel_datatypename[i].folder,sel_datatypename[i].text,sel_datatypename[i].checked);
        }
    }
    else{
    
    if(allconfigs){//检查配置中是否有catalog项
        for(var ac in allconfigs){//如果有，读取其所有配置项
            var s_des=allconfigs[ac].details;
            for(var p in s_des){
                /*var lab=document.createElement("label");
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
                spn.innerHTML=s_des[p].desc;*/
/*                if(p==0){
                    name=s_des[p].name;
                    catalog=s_des[p].folder;//Catalog;
                    //ainput.checked=true;
                    //lab.className=""
                    add_displaytype(display_type,s_des[p].name,s_des[p].folder,s_des[p].desc,true);
                }else{
                    //lab.className="";
                    add_displaytype(display_type,s_des[p].name,s_des[p].folder,s_des[p].desc,false);
                }
                /*lab.appendChild(ainput);
                lab.appendChild(spn);
                //lab.innerHTML='<input class="catalog" type="checkbox" name="options" value="'+s_des[p].Name+'" >'+s_des[p].Desc;
                display_type.appendChild(lab);*/
/*            }
        }
        
    }
    }
    if(sessionStorage.realdata_index && sessionStorage.realdata_index>=3)
    $.sortTable.sort('realtable',sessionStorage.realdata_index)
    else
        $.sortTable.sort("realtable",3);
    }catch(err){
        showstateinfo(err.message,"realdata/appendalldisplaytype");
    }
}
function add_displaytype(parent,name,folder,text,check){
    var lab=document.createElement("label");
    lab.setAttribute("style","margin-left:20px")
    var ainput=document.createElement("input");
    ainput.setAttribute("type","checkbox");
    ainput.setAttribute("name","options");
    ainput.setAttribute("value",name);
    ainput.setAttribute("folder",folder);
    ainput.className="btn";
    //ainput.setAttribute('onclick','checkboxclick("'+s_des[p].Name+'")')
    ainput.innerText=text
    ainput.className="catalog";
    var spn=document.createElement("span");
    spn.innerHTML=text;
    //if(check){
        //name=s_des[p].name;
        //catalog=s_des[p].type;//Catalog;
    ainput.checked=check;
        //lab.className=""
    //}else{
        lab.className="";
    //}
    lab.appendChild(ainput);
    lab.appendChild(spn);
    parent.appendChild(lab);
}
//"刷新"按钮点击事件
function btn_refresh_click(obj){
    allselect = $('[name="options"]');
    var allselects=[];
    
    for(var i=0;i<allselect.length;i++){
        var obj_sel = new Object();
        obj_sel.value=allselect[i].value;
        obj_sel.text=allselect[i].textContent;
        obj_sel.checked=allselect[i].checked;
        obj_sel.folder=allselect[i].attributes.folder.nodeValue;
        //obj.type=allselect[i].type;
        allselects.push(obj_sel);
    }
    sessionStorage.setItem("sel_datatypename",JSON.stringify(allselects));
    refresh_tabhead(allselect);
    decoderealdata();
    if(haverealdata)
        decodedatas();
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
/*        th_th=document.createElement("th");
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
/*        th_th=document.createElement("th");
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
}*/
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
/*function getCatalog(index){
    try{
    var catalog="";
    var  catalogsel = $('[name="options"]');
    typename=catalogsel[index].value;
    titlename=catalogsel[index].textContent;//显示项的标题 //20200518
    catalog=catalogsel[index].attributes.folder.nodeValue;
    updatachart(typename);//0709 更新图表配置
    refreshData();
    return catalog;
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
                        catalog= allconfigs[q].details[l].folder;
                }
            }
        }
    }
    return catalog;
    }catch(err){
        showstateinfo(err.message,"realdata/getCatalog")
    }
}*/
/*function decoderealdata(obj_realdata) {
    try{
    $("#realdata-tbody").empty();
    var v_sel = $('[name="options"]');
    $table = document.getElementById('realdata-tbody');
    //var tableLength = $table.rows.length;
    //for (var j = $table.rows.length - 1; j >= 0; j--) {
    //    $table.removeChild($table.rows[j]);
    //}
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
    var parentid=-1,parentname="";
    var isfindtype=false;
    var realdatafolder;
    haverealdata=false;
    sid=-1;
    if (obj_realdata) {
        refresh_tabhead(v_sel);//根据选项刷新表头的显示内容
        var title_len=tab_head.rows[0].cells.length;
        if(v_sel){//有显示控制选择项时进行如下操作.
            for (var j=0;j<obj_realdata.length;j++) {
                dname=obj_realdata[j].name;
                realdatafolder=obj_realdata[j].folder;
                isfindtype=false;
                grouptype=obj_realdata[j].type;//Catalog;
                if(obj_realdata[j].sensorId==sid){//是否为新的标签项,相同标签的数据默认连续
                    isnew=false;
                }else{ 
                    sid=obj_realdata[j].sensorId;
                    isnew=true;
                }
                if (sensors&&isnew)
                for (var i = 0; i < sensors.length; i++) {//是否在需要显示的标签列表中
                    isfind=false;
                    if(obj_realdata[j].sensorId==sensors[i].id){
                        //sid = sensors[i].id + "";
                        type_td = sensors[i].Value.type;//Catalog;//
                        sname = sensors[i].Value.name;
                        //parentid=sensors[i].Value.parentId;
                        if((sensors[i].Value.parentId!="-1")&&(sensors[i].Value.parentId!=parentid)){//20201221
                            parentid=sensors[i].Value.parentId;
                            for(var k=0;k<sensors.length;k++){
                                if(sensors[k].id==parentid){
                                    parentname=sensors[k].Value.name+"_";
                                    break;
                                }
                            }
                        }
                        sname=parentname+sname;
                        isfind=true;
                        haverealdata=true;
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
                            //atd.setAttribute("width","150px");
                            atd.innerHTML= "&nbsp;";
                            atr.appendChild(atd);
                        }
                        atr.cells[0].innerHTML=sid;//标签id
                        atr.cells[0].style.cssText="display:none";
                        atr.cells[1].innerHTML=sname;//第一列添加标签名称，
                        atr.cells[2].innerHTML=(obj_data.time.replace(/T/g," ")).substring(10,19);//第二列添加测量时间
                        // 取过去24小时时间，用于调取历史记录
                        var ckssj=new Date((obj_data.time.replace(/T/g," ")).substring(0,19));//(obj_data.time.replace(/-/g,"/")).substring(0,19));//.replace(/-/g,"/"));
                        var yesterdayend=ckssj-(1000*60*60*24);
                        //sessionStorage.kssj=dateToString(new Date(yesterdayend),2);
                        kssj = dateToString((yesterdayend),2);//new Date((obj_data.Time).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
                        jssj = (obj_data.time.replace(/T/g," ")).substring(0,19);
                        //atr.cells[tab_head.rows[0].cells.length-4].innerHTML="<button backgroundColor='#fff' onclick=tohistory("+sid+") href='javascript:void(0)'>>></button>";
                        //atr.cells[tab_head.rows[0].cells.length-3].innerHTML="<button backgroundColor='#fff' onclick=towarnlog("+sid+") href='javascript:void(0)'>>></button>";
                        atr.cells[tab_head.rows[0].cells.length-2].innerHTML=obj_data.name;
                        atr.cells[tab_head.rows[0].cells.length-2].style.cssText="display:none";
                        atr.cells[tab_head.rows[0].cells.length-1].innerHTML=obj_data.message;
                        atr.cells[tab_head.rows[0].cells.length-1].style.cssText="display:none";
                        for(var k=0;k<v_sel.length;k++){//添加到指定列,不同配置项添加到不同的列，由显示控制项控制显示与否
                            if(v_sel[k].value == dname){
                                atr.cells[k+3].innerHTML=(obj_data.value*1).toFixed(Number_of_decimal);
                                isfindtype=true;
                            }
                            if(!v_sel[k].checked){
                                atr.cells[k+3].style.cssText = "display:none";
                            }
                        }
                        if((k>=v_sel.length)&&(!isfindtype)){//如果没有在类型列表中，要如何处置
                            //需要表头标题添加name，所有列表项添加一列（cell）
                            add_displaytype(display_type,dname,realdatafolder,dname,false);
                            v_sel = $('[name="options"]');
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
                                if((k>=v_sel.length)&&(!isbreak)){//如果没有在类型列表中，要如何处置
                                    //需要表头标题添加name，所有列表项添加一列（cell）
                                    add_displaytype(display_type,dname,realdatafolder,dname,false);
                                    v_sel = $('[name="options"]');
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
/*                }
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
                    isfindtype=false;
                    if(obj_realdata[j].sensorId==sensors[i].id){
                        //sid = sensors[i].id + "";
                        type_td = sensors[i].Value.tyoe;//Catalog;
                        sname = sensors[i].Value.name;
                        if((sensors[i].Value.parentId!="-1")&&(sensors[i].Value.parentId!=parentid)){
                            parentid=sensors[i].Value.parentId;
                            for(var k=0;k<sensors.length;k++){
                                if(sensors[k].id==parentid){
                                    parentname=sensors[k].Value.name+"_";
                                    
                                    break;
                                }
                            }
                        }
                        sname=parentname+sname;
                        isfind=true;
                        break;
                    }
                }
                if(isfind){//在需要显示的标签列表
                        //isnew=true;
                    obj_data = (obj_realdata)[j];////sid
                    if(isnew){//如果是新的标签，就创建一行，添加所有的td单元，
                        atr=document.createElement("tr");
                        //atr.setAttribute("height","35px");
                        var length=tab_head.rows[0].cells.length
                        for(var k=0;k<length;k++){
                            var atd=document.createElement("td");
                            atr.appendChild(td);
                        }
                        atr.cells[0].innerHTML=sid;
                        atr.cells[0].style.cssText="display:none";
                        atr.cells[1].innerHTML=sname;//第一列添加标签名称，
                        atr.cells[2].innerHTML=(obj_data.time.replace(/T/g," ")).substring(10,19);//第二列添加测量时间
                        // 取过去24小时时间，用于调取历史记录
                        var ckssj=new Date((obj_data.time.replace(/T/g," ")).substring(0,19));//(obj_data.Time.replace(/-/g,"/")).substring(0,19));//.replace(/-/g,"/"));
                        var yesterdayend=ckssj-(1000*60*60*24);
                        //sessionStorage.kssj=dateToString(new Date(yesterdayend),2);
                        kssj = dateToString((yesterdayend),2);//new Date((obj_data.Time).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
                        jssj = (obj_data.time.replace(/T/g," ")).substring(0,19);
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
            alertcount=[0,0,0,0,0]
            maxOfRealdata=($table.rows[0].cells[title_index].innerHTML)*1;
            maxvaluetime=($table.rows[0].cells[2].innerHTML);
            maxOfRealdataName=($table.rows[0].cells[1].innerHTML)
            for (var int = 0; int < tableLength; int++) {
                if ($table.rows[int].cells[0].innerHTML == sessionStorage.SensorId) {
                    sessionStorage.t_p = int;
                }
                if(($table.rows[int].cells[title_index].innerHTML)*1>maxOfRealdata){
                    maxOfRealdata=($table.rows[int].cells[title_index].innerHTML)*1
                    maxvaluetime=($table.rows[int].cells[2].innerHTML);
                    maxOfRealdataName=($table.rows[int].cells[1].innerHTML)
                }
                jisuanyichangbili(($table.rows[int].cells[title_index].innerHTML)*1);
            }
            if (typeof (sessionStorage.t_p) != "undefined") {
                sname = $table.rows[sessionStorage.t_p].cells[1].innerHTML;
                //chart_type = $table.rows[sessionStorage.t_p].cells[6].innerHTML;
                sensor_Id = parseInt($table.rows[sessionStorage.t_p].cells[0].innerHTML);
                var lasttime = $table.rows[sessionStorage.t_p].cells[2].innerHTML;
                //var myChartMechanicalVt = echarts.init(document.getElementById('realdata_chart'));
                updatachart(typename);
                value0 = ($table.rows[sessionStorage.t_p].cells[title_index].innerHTML)*1;//字符转实数
                //happentime=lasttime;
                //value1=parseFloat($table.rows[sessionStorage.t_p].cells[3].innerHTML);
                var heightpx = $("#realdata-tbody tr").height() + 1;//加1是网格线的宽度
                var ppt = +sessionStorage.t_p;
                $("#realdata-tbody").scrollTop((ppt) * heightpx);//表格重新滚动定位到选定的行张丽欣
                $table.rows[ppt].style.backgroundColor = color_table_cur;
                if (isfirst != true) {
                    var temp_option = myChartMechanicalVt.getOption();
                    if (temp_option.series.length>0) {
                        if (temp_option.series[0].data[temp_option.series[0].data.length - 1][0] < strtodatetime(lasttime)) {
                            temp_option.series[0].data.push([strtodatetime(lasttime), value0, temp_option.series[0].data.length]);
                            //temp_option.series[1].data.push([strtodatetime(lasttime),value1,temp_option.series[1].data.length]);
                            if (maxvalue < value0) {
                                maxvalue = value0;
                                maxval = (maxvalue + (maxvalue - minvalue) * 0.2).toFixed(Number_of_decimal);
                                temp_option.yAxis[0].max = maxval;
                                happentime=lasttime
                            }
                            if (minvalue > value0) {
                                minvalue = value0;
                                minval = (minvalue - (maxvalue - minvalue) * 0.2).toFixed(Number_of_decimal);
                                temp_option.yAxis[0].min = minval;
                            }
                            myChartMechanicalVt.setOption(temp_option);
                        }
                        if (maxvalue < value0) {
                            maxvalue = value0;
                            optionMechanicalVolt.series[0].data[0].value = maxvalue;
                            //optionMechanicalVolt.series[1].data[0].value = value0;
                            //myChartMechanicalVolt.setOption(optionMechanicalVolt);//
                            happentime=lasttime
                        }
                        refreshData();
                    }
                } else {
                    isfirst = false;
                    //myChartMechanicalVt.showLoading();
                    gethistorydata(sensor_Id,catalog,typename, kssj, jssj, 1);
                }
            }//else{	//$table.rows[0].ondblclick();	//}
            //showstateinfo("");
        } else {
            showmsg("没有符合条件的实时数据",info_showtime);
            showstateinfo("没有符合条件的实时数据","realdata");
        }
    } else {
        showmsg("没有符合条件的实时数据", info_showtime);
        showstateinfo("没有符合条件的实时数据","realdata");
    }
    //$table.rows[t_pt].scrollIntoView();
    //refreshData();
    //display();
    }catch(err){
        showstateinfo(err.message,"realdata/decoderealdata");
    }
}*/
function updataMechanicalChart(atype) {//根据不同设备类型，更新图形当中的最大最小值设置以及数值单位
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
/*function tableclick(tr) {
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
        sessionStorage.sel_id=sessionStorage.SensorId;
        //var kssj = getCurrentDate(1) + " 00:00:00";
        var jssj = getCurrentDate(2);
        var yesterdaytime= (new Date(jssj))-(1000*60*60*24);
        var kssj=dateToString((yesterdaytime),2);
        //kssj = (tr.cells[2].innerHTML).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
        //jssj = (tr.cells[2].innerHTML);
        myChartMechanicalVt.showLoading();
        gethistorydata(sessionStorage.SensorId,catalog,typename, kssj, jssj, 1);
    }
    //maxval=0;
    refreshData();
    //moduletable("realdata-tbody");
    $(tr).css("background", color_table_cur);//区分选中行
    //var myChartMechanicalVt = echarts.init(document.getElementById('realdata_chart'));
}*/
function initMechanicalSeries(data) {//温度计、湿度表。
    optionMechanicalVolt= {
        backgroundColor: '#fff',
        tooltip: {
            formatter:  "{a}: <br/>{c} "+"V",
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
            max: 400,
            startAngle: 180,//起始角度
            endAngle: 90,//终止角度
            splitNumber: 4,//
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
                formatter: '{value}'+"V",
                textStyle: {
                    fontSize: 14,
                    color:'#18343C'
                }
            },
            data:[data[0]],//[{value: 20,name: '电压'}],// renbao pingan taipingyang dadi yangguang fude 
        }]
    }
    myChartMechanicalVolt.setOption(optionMechanicalVolt);//温度计
    optionMechanicalCurren = {
        backgroundColor: '#fff',
        tooltip: {
            formatter:  "{a}: <br/>{c} "+"A",
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
            max: 5,
            startAngle: 180,//起始角度
            endAngle: 90,//终止角度
            splitNumber: 5,//
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
                formatter: '{value}'+"A",
                textStyle: {
                    fontSize: 14,
                    color:'#18343C'
                }
            },
            data:[data[1]],//[{value: 20,name: '电压'}],// renbao pingan taipingyang dadi yangguang fude 
        }]
    }
    myChartMechanicalCurrent.setOption(optionMechanicalCurren);
}
//window.setInterval("getrealdatabynodeid(-1)",60000);
function refreshDataForMechanical() {
    TP_value= ((Math.random() * 400).toFixed(Number_of_decimal))*1;
    //var refresh_option=myChartMechanicalVolt.getOption();
    optionMechanicalVolt.series[0].data[0].value=TP_value;//+20;
    //optionMechanicalVolt.series[0].data[0].label.formatter= '{back| ' + TP_value + ' }{unit|°C}',//\n{downTxt|' + TP_txt + '}',
    myChartMechanicalVolt.setOption(optionMechanicalVolt);
    /*//optionMechanicalVolt.series[0].data[0].value = maxvalue;
    optionMechanicalVolt.series[0].max = chart_max;
    optionMechanicalVolt.series[0].min = chart_min;
    value = optionMechanicalVolt.series[0].data[0].value;
    optionMechanicalVolt.series[0].detail.formatter = chart_sigle + value + ': \n\n' +"时间："+happentime;//+chart_unit;
    optionMechanicalVolt.series[0].data[0].name = chart_unit;//sname;
    optionMechanicalVolt.title.text = sname+" : "+titlename+" 24小时峰值";
    for (var i = 0; i < optionMechanicalVolt.series.length; i++) {
        optionMechanicalVolt.series[i].axisLine.lineStyle.color = colors;
        optionMechanicalVolt.series[i].max = chart_max;
        optionMechanicalVolt.series[i].min = chart_min;
        value = optionMechanicalVolt.series[i].data[0].value;
        optionMechanicalVolt.series[i].detail.formatter = chart_sigle + value + ': \n\n' + optionMechanicalVolt.series[i].name + ' ';//+chart_unit;
        optionMechanicalVolt.series[i].data[0].name = chart_unit;//sname;
        optionMechanicalVolt.title.text = sname+" : "+titlename;//添加显示项的标题指示；*/
        //形成进度条式的填充仪表效果并分段显示不同延时用于指示不同状态。    
        /*if(value<20){
            optionMechanicalVolt.series[i].axisLine.lineStyle.color[0]=[value/100,'blue'];
        }else if(value<80){
            optionMechanicalVolt.series[i].axisLine.lineStyle.color[0]=[value/100,"green"];
        }else{
            optionMechanicalVolt.series[i].axisLine.lineStyle.color[0]=[value/100,"red"];
        }
    }
    myChartMechanicalVolt.setOption(optionMechanicalVolt);*/
    optionMechanicalCurren.series[0].data[0].value = (TP_value/80).toFixed(Number_of_decimal)*1;
    //optionMechanicalCurren.series[0].max = chart_max;
    optionMechanicalCurren.series[0].min = chart_min;
    value = optionMechanicalCurren.series[0].data[0].value;
    //optionMechanicalCurren.series[0].detail.formatter = chart_sigle + value + ': \n\n' + optionMechanicalCurren.series[0].name + ' ';//+chart_unit;
    //optionMechanicalCurren.series[0].data[0].name = chart_unit;//sname;
    //optionMechanicalCurren.title.text = sname+" : "+titlename;
    myChartMechanicalCurrent.setOption(optionMechanicalCurren);
    optionMechanicalVt.series[0].data.shift();
    now = new Date(base += oneDay);
    optionMechanicalVt.series[0].data.push([
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
        TP_value
    ])// maxOfRealdata.toFixed(Number_of_decimal);//54.321;
    //optionMechanicalLt.series[0].detail.formatter=maxOfRealdata.toFixed(Number_of_decimal)+ '\n\n 标签名称: '+maxOfRealdataName;//实时极值的标签名称,"发生时刻:"+maxvaluetime+
    optionMechanicalVt.series[0].max = chart_max;
    optionMechanicalVt.series[0].min = chart_min;
    //optionMechanicalVt.series[0].data[0].name = chart_unit;//sname;
    //optionMechanicalVt.title.text="实时极值: "+titlename;
    myChartMechanicalLt.setOption(optionMechanicalVt);
    myChartMechanicalVt.setOption(optionMechanicalVt);
    
}
/*function decodedatas(obj_chartdata) {
    try{
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
    myChartMechanicalVt.clear();
    if(obj_chartdata==null){
        obj_chartdata=JSON.parse(localStorage.getItem("historydata"));
    }
    if (obj_chartdata == null) {
        maxvalue=NaN;//20200518
        myChartMechanicalVt.hideLoading();
        refreshData();//20200518
        return;
        //drawchart();
    }
    minval = maxval = obj_chartdata[0].value;//value0;
    //var zero=getCurrentDate(1) + " 00:00:00";
    happentime=(obj_chartdata[0].time.replace(/T/g," ")).substring(0,19);//发生时刻
    for (var i = 0; i < obj_chartdata.length; i++) {
        //if((obj_chartdata[i].time).replace(/T/g," ").substring(0,19)>=zero)//取当天零点以后的值，obj_chartdata保存24小时以内的值
            pa.push([strtodatetime(obj_chartdata[i].time), obj_chartdata[i].value, i]);
        //pb.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value/1.5, i])
        //pc.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value/2, i])
        if (parseFloat(obj_chartdata[i].value) > maxval) {
            maxval = obj_chartdata[i].value;
            happentime=(obj_chartdata[i].time.replace(/T/g," ")).substring(0,19);
        }
        if (parseFloat(obj_chartdata[i].value) < minval) {
            minval = obj_chartdata[i].value;
            //happentime=(obj_chartdata[i].time.replace(/T/g," ")).substring(0,19);
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
    lengenddata.push("当前温度值");
    lengenddata.push("湿度");
    //lengenddata.push(document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text+"457");
    optionMechanicalVolt.series[0].data[0].value = maxvalue;
    //optionMechanicalVolt.series[0].data[0]
    //myChartMechanicalVolt.setOption(optionMechanicalVolt);
    refreshData();
    drawchart();
    decoderealdata();//进行一次实时数据刷新，完善图表的指示内容；//20200518
    //绘制图形线条
    function drawchart() {
        //var myChartMechanicalVolt = echarts.init(document.getElementById('main'));
        var lengenddata1 = [];
        lengenddata1.push(titlename);//20200518
        var optionMechanicalVt = {
            color: ['#FF0000', '#FFFF00'],//,'#00ff00'
            backgroundColor: '#d0d0d0',
            title: {
                text: sname+" "+titlename+' : 24小时变化趋势图',//20200518
                x: "center",
            },/**/
/*            tooltip: {
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
                        readOnly: false,
                        optionToContent: function(opt) {
                            var axisData = opt.xAxis[0].data;
                            var series = opt.series;
                            var table = '<table style="width:100%;text-align:center"><tbody><tr>'
                                         + '<td>时间</td>'
                                         + '<td>' + series[0].name + '</td>'
                                         + '<td>' + series[1].name + '</td>'
                                         + '</tr>';
                            for (var i = 0, l = axisData.length; i < l; i++) {
                                table += '<tr>'
                                         + '<td>' + axisData[i] + '</td>'
                                         + '<td>' + series[0].data[i] + '</td>'
                                         + '<td>' + series[1].data[i] + '</td>'
                                         + '</tr>';
                            }
                            table += '</tbody></table>';
                            return table;
                        }
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
            dataZoom: [{
                show: false,
                start: 0
            },
            {   // 这个dataZoom组件，也控制x轴。
				type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件  
				start: 0,      // 左边在 10% 的位置。
				end: 100,       // 右边在 60% 的位置。 
			},],
            legend: {
                show:false,
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
            series: [/**///{
/*                name: lengenddata1[0],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text,
                type: 'line',
                showAllSymbol: true,
                symbolSize: 1,
                data: pa,
                smooth: true,//平滑曲线 sangeshijianjiedianshang
                smoothMonotone: 'x',
            }
            ]
        };
        myChartMechanicalVt.hideLoading();
        myChartMechanicalVt.setOption(optionMechanicalVt);
    }
    }catch(err){
        showstateinfo(err.message.message,"realdata/decodedatas");
    }
}*/
function initMechanicalChart2(adata) {
    optionMechanicalVt = {
        color: ['#FFFF00', '#FF0000'],//,'#00ff00' complain mountain 
        backgroundColor: backgroudcolor,
        title: {
            text: '触头行程时间曲线',
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
            splitNumber: 6,
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
            //min: minval,
            //max: maxval,
        }],
        series: [/**/{
            name: '',//lengenddata[0],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text,
            type: 'line',
            showAllSymbol: true,
            symbolSize: 1,
            data: adata,
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
    //myChartMechanicalVt.hideLoading();
    myChartMechanicalVt.setOption(optionMechanicalVt);
    myChartMechanicalLt.setOption(optionMechanicalVt);
}
function jisuanyichangbili(avalue){
    if(avalue>alertconfig[3]){
        alertcount[4]++;
    }else if(avalue>alertconfig[2]){
        alertcount[3]++;
    }else if(avalue>alertconfig[1]){
        alertcount[2]++;
    }else if(avalue>alertconfig[0]){
        alertcount[1]++;
    }else{
        alertcount[0]++;
    }
}
function selectid(obj){
    sessionStorage.sensorId=obj.value;
}
/**
 * 
 */
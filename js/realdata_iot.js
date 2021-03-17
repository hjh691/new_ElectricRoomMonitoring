/**var t1 = window.setInterval("getrealdatabystation(1);",30000);
//getrealdatabynodeid(-1);
//当没有数据返回时更新页面造成报某变量未定义的问题value0. 
//20200709 实时值图表详情显示当天峰值的提示（已修改），数据列表表头刷新可以点击刷新按钮进行刷新（不必有数据);图形配置刷新；（没数不刷新，或限值不匹配原来不正确,标题undfine）
20200716 针对新实时数据页面添加实时最大值{仪表盘）、统计比例（柱状图）两个图表的数据计算过程，其中比例计算有待进一步完善。修改某标签过去24小时最大值和实时值以及变化趋势图的
    刷新过程，添加在主页面点击二级菜单时，对历史数据等页面的配置项进行更新显示功能
**/
var chartOption={};
//var chart_type = "", chart_unit = "", chart_max = 100, chart_min = 0, chart_sigle = "", is_have = false;
var start_angle = 0, end_angle = 180;
//var myChart2 = echarts.init(document.getElementById('realdata_chart'));//趋势图
//var myChart = echarts.init(document.getElementById('realdata_maxvalOfDay'));//24小时极值
//var mychart3=echarts.init(document.getElementById('realdata_rateOfNormal'));//占比统计
//var myChart1=echarts.init(document.getElementById('realdata_maxvalOfReal'));//实时极值
//var myChart4=echarts.init(document.getElementById('realdata_realdata'));//实时值
//var option,option1,option2,option3,option4;//对应mychart（1-4）的配置项 need speed seed deed
var chartdataname1="";
var sname="",sid,type_td,title_index=3,hidden_cells=3;
let isfirst = "true";
var maxval = 0, minval = 0, maxvalue = 0, minvalue = 0,value0=0,maxOfRealdata=0;//value0未定义错误
var maxvaluetime="",happentime="",maxOfRealdataName="";
//var colors = [];
//var pageSize = 10;    //每页显示的记录条数
//var curPage = 0;        //当前页
//var lastPage;        //最后页
//var direct = 0;        //方向
//var len;            //总行数
//var page;            //总页数
//var begin;
//var end;
var count=0;
var $table;
var sign = '>';
var allconfigs;
var allselect=null;
var typename="",titlename="";
var tab_head;
var backgroudcolor='#999';
//var obj_realdata;
//var datas = [];
//var alertconfig=[70,100,120,140,];
//var alertcount=[0,0,0,0];//;
//let haverealdata=false;
var catalog="Defalt";
//var display_type=document.getElementById("display_type");
initrealdata_iot();
function initchartoption(){//初始化图表选择和显示值；
    chartOption={chart_type:"",chart_unit:"",chart_max:100,chart_min:0,chart_sigle:"",
                 chart_main_num:4,chart_chi_num:8,chart_detail_font_size:16,chart_title_font_size:16,
                 start_angle:0,end_angle:180};
    maxval =  minval =  maxvalue =minvalue = value0=maxOfRealdata=0;
    //alert_obj={};//状态统计对象
    sname=maxOfRealdataName=maxvaluetime=happentime="";//图表的标签名称、最大值标签名称、最大值发生时间、24h极值发生时刻，maxvaluetime暂时未使用。
}
function initrealdata_iot(){
    try{
        initchartoption();
    //    datas = [];
    //datas.splice(0, datas.length);//
    //for (var i = 0; i < 1; i++) {
    //    var value = 0;//(Math.random() * 100).toFixed(2) - 0;
    //    datas.push(JSON.parse('{"name":"","value":' + value + '}'));
    //    var value = 0;//(Math.random() * 100).toFixed(2) - 0;
    //    datas.push(JSON.parse('{"name":"","value":' + value + '}'));//
    //}
    //updatachart(chartOption.chart_type);
    //initseries(datas);
    //initchart2();
    initpage();
    }catch(err){
        showstateinfo(err.message.message,"initrealdata_iot");
    }
}
function initpage() {
    updatapcnav(17);
    //保存页面现场，在点击浏览器的刷新按钮刷新时应用
    sessionStorage.framepage="realdata_iot.html";
    sessionStorage.pageindex=17;
    tab_head=document.getElementById("tab_head");
    if (typeof (Worker) !== "undefined") {//只在网络状态下可用，本地磁盘目录下不可用。
        if (typeof (w1) == "undefined") {
            w1 = new Worker("delay_worker.js");
        }
        var i = 0;
        w1.onmessage = function (event) {
            i++
            //if (i % 1 == 0) {
                //getrealdatabynodeid(-1);rage
                decoderealdata();
            //}
        };
    } else {
        var t1 = window.setInterval("getrealdatabynodeid(-1);", 60000);
    }/**/
    appendalldisplaytype();/*"display_type"*/
    //btn_refresh_click();
    window.parent.closeloadlayer();
    
    //var topTable = $("table").eq(0).offset().top;//获取表格位置
    var c_top =  $('.oa-nav_top').height() ? $('.oa-nav_top').height() : 0;//获取导航高度没有可填0
    $("#datadiv").scroll(function() {
        var table_hd = $("table").eq(0).find('thead'); //浮动的表头
        var table_bd = $("table").eq(0).find('tbody'); //表内容
        //判断
        if(!table_hd || !table_hd.offset() || !table_bd){
            return;
        }
        var w_scrollTop = $("#datadiv").scrollTop();  //滚动条的垂直位置
        if(w_scrollTop >5 ){ //当滚动条的 位置大于 表头的位置，开始悬浮topTable
            var add = w_scrollTop - 0 + c_top;
            $("table").eq(0).find('thead').attr("style","transform: translateY(" + add + "px);")//固定
        }else{
            $("table").eq(0).find('thead').attr("style","transform: translateY(0px);")//复原
        }
    });
    if(sessionStorage.getItem("chartoption")){
        chartOption=JSON.parse(sessionStorage.getItem("chartoption"));
    }
    //btn_refresh_click();
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
    try{
        //for(var i=display_type.childNodes.length;i>0;i--)
        //    display_type.removeChild(display_type.childNodes[i-1]);
        allconfigs=JSON.parse(localStorage.Configs);
        /*var sel_datatypename=[];
        if(sessionStorage.sel_datatypename) 
        {
            sel_datatypename=JSON.parse(sessionStorage.sel_datatypename);
        }
        let sel_datatypename_len=sel_datatypename.length;
        if(sel_datatypename_len>0){
            for(var i=0;i<sel_datatypename_len;i++){
                add_displaytype(display_type,sel_datatypename[i].value,sel_datatypename[i].folder,sel_datatypename[i].text,sel_datatypename[i].checked);
            }
        }
        else{
        
        if(allconfigs){//检查配置中是否有catalog项
            for(var ac in allconfigs){//如果有，读取其所有配置项
                var s_des=allconfigs[ac].details;
                for(var p in s_des){
                    if(p==0){
                        name=s_des[p].name;
                        catalog=s_des[p].folder;//Catalog;
                        //ainput.checked=true;
                        //lab.className=""
                        add_displaytype(display_type,s_des[p].name,s_des[p].folder,s_des[p].desc,true);
                    }else{
                        //lab.className="";
                        add_displaytype(display_type,s_des[p].name,s_des[p].folder,s_des[p].desc,false);
                    }
                }
            }
        }
        }
        if(sessionStorage.realdata_index && sessionStorage.realdata_index>=hidden_cells)
        $.sortTable.sort('other_realtable',sessionStorage.realdata_index)
        else
            $.sortTable.sort("other_realtable",hidden_cells);*/
        }catch(err){
            showstateinfo(err.message,"realdata_iot/appendalldisplaytype");
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
    //refresh_tabhead(allselect);
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
        th_th.setAttribute("onclick","$.sortTable.sort('other_realtable',1)");
        th_th.setAttribute("width","180px");
        var aa=document.createElement("a");
        aa.setAttribute("href","javascript:");
        aa.innerHTML='测量点名称<span class="sensorname"></span>';
        th_th.appendChild(aa);
        th_tr.appendChild(th_th);
        th_th=document.createElement("th");
        th_th.setAttribute("onclick","$.sortTable.sort('other_realtable',2)");
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
            th_th.setAttribute("onclick","$.sortTable.sort('other_realtable',"+(k+3)+")");
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
        th_th.setAttribute("onclick","$.sortTable.sort('other_realtable',1)");
        var aa=document.createElement("a");
        aa.setAttribute("href","javascript:");
        aa.innerHTML='测量点名称<span class="sensorname"></span>';
        th_th.appendChild(aa);
        th_th.setAttribute("width","150px");
        th_tr.appendChild(th_th);
        th_th=document.createElement("th");
        th_th.setAttribute("onclick","$.sortTable.sort('other_realtable',2)");
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
                    thd.setAttribute("onclick","$.sortTable.sort('other_realtable',"+(count+3)+")");
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
    //document.getElementById("other_realtable").width=150*(count+5)+"px";// 设定数据列表的总宽度
}
//var t_pt=0;
//表格排序使用插件
/*$(function() {
    //$("#other_realtable").tablesort();		
});*/
function stopWorker() {
    w1.terminate();
    w1 = undefined;
};
//根据数据列值获取Catalog。
function getCatalog(index){
    try{
        //var catalog="";
        //var  catalogsel = $('[name="options"]');
        typename=index;//catalogsel[index].value;
        //initchartoption();
        //titlename=catalogsel[index].textContent;//显示项的标题 //20200518
        var stitlename;;
        updatachart(typename);//0709 更新图表配置
        refreshData();
        //return catalog;
        if(allconfigs){
            for(var q in allconfigs){
                for(var l in allconfigs[q].details){
                    if(allconfigs[q].details[l].name.toLowerCase()==typename.toLowerCase()){
                        stitlename=allconfigs[q].details[l].desc;
                        var configname=allconfigs[q].name;
                        var jo_config=JSON.parse(localStorage.Config);
                        for(var c in jo_config)
                            if(jo_config[c].type.toLowerCase()==configname.toLowerCase()){
                                if(!jQuery.isEmptyObject(jo_config[c].details)){
                                    var d_config=jo_config[c].details; //20200918 获取配置项参数 由allconfigs（typeconfigs）的details里的name找到typename，然后取其
                                    for(var i in d_config){            //name,由name到configs里查找name，找到后从其details里提取config，然后从config中提取所需的配置数值。
                                        if((d_config[i].name.toLowerCase()==typename.toLowerCase())&&((d_config[i].config))){
                                            chartOption.chart_unit=d_config[i].config.Unit;
                                            if(!chartOption.chart_unit)
                                                chartOption.chart_unit="";
                                            chartOption.chart_max=d_config[i].config.Top;
                                            chartOption.chart_min=d_config[i].config.Bot;
                                            /*if((chartOption.chart_max-chartOption.chart_min)%10==0){
                                                chartOption.chart_main_num=4;
                                                chartOption.chart_chi_num=8;
                                            };
                                            if((chartOption.chart_max-chartOption.chart_min)%5==0){
                                                chartOption.chart_main_num=5;
                                                chartOption.chart_chi_num=10;
                                            }*/
                                            sessionStorage.setItem("chartoption",JSON.stringify(chartOption));
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                            //catalog= allconfigs[q].details[l].folder;
                    }
                }
            }
        }
        //catalog=catalogsel[index].attributes.folder.nodeValue;
        return stitlename;
    }catch(err){
        showstateinfo(err.message,"realdata_iot/getCatalog")
    }
}
function decoderealdata(obj_realdata,asensorid,isload) {
    try{
        var v_sel = $('[name="options"]');
        $('#others_realdata_tbody').empty();
        $table = document.getElementById('others_realdata_tbody');
        if(!obj_realdata){
            obj_realdata=JSON.parse(localStorage.getItem("realdata"));
        }
        var sensors_length=0;
        var sensors = JSON.parse(localStorage.getItem("sensors"));
        if(sensors)
            sensors_length=sensors.length;
        var obj_data = new Object();
        var pt = 0;
        //var dname;
        var isnew=true,isfind=false;//isbreak=false;
        var atr;
        var parentid=-1,parentname="";
        //var isfindtype=false;
        var realdatafolder;
        //var kssj = dateToString((new Date(getCurrentDate(2))-(1000*60*60*24)),2) ;// + " 00:00:00";
        //var jssj = getCurrentDate(2);
        //haverealdata=false;
        sid=-1;
        var nodata=true;
        //var sconfig,saddr;
        if(!asensorid)
            nodata=false;
        if (obj_realdata) {
            var realdata_len=obj_realdata.length;
            //tablehead_len=tab_head.rows[0].cells.length;
            //refresh_tabhead(v_sel);//根据选项刷新表头的显示内容
            //alert_obj={};
            //var title_len=tab_head.rows[0].cells.length;
            //if(v_sel){//有显示控制选择项时进行如下操作.
                for (var j=0;j<realdata_len;j++) {
                    dname=obj_realdata[j].name;
                    realdatafolder=obj_realdata[j].folder;
                    isfindtype=false;
                    //grouptype=obj_realdata[j].type;//Catalog;
                    if(obj_realdata[j].sensorId==asensorid)
                        nodata=false;
                    if(obj_realdata[j].sensorId==sid){//是否为新的标签项,相同标签的数据默认连续
                        isnew=false;
                    }else{ 
                        sid=obj_realdata[j].sensorId;
                        isnew=true;
                    }
                    if (sensors&&isnew)
                    for (var i = 0; i < sensors_length; i++) {//是否在需要显示的标签列表中
                        isfind=false;
                        if(sid==sensors[i].id){
                            let sensor_obj = sensors[i].Value;
                            type_td = sensor_obj.type;//Catalog;//
                            sname = sensor_obj.name;
                            //sconfig=sensor_obj.config;
                            //saddr=sensor_obj.address;
                            //parentid=sensors[i].Value.parentId;
                            if(sensor_obj.parentId!="-1"){  
                                if((sensor_obj.parentId!=parentid)){//20201221
                                    parentid=sensor_obj.parentId;
                                    for(var k=0;k<sensors_length;k++){
                                        if(sensors[k].id==parentid){
                                            parentname=sensors[k].Value.name;//+"_";
                                            break;
                                        }
                                    }
                                }
                                //sensors.splice(i, 1);
                            }
                            //sname=parentname+"_"+sname;
                            isfind=true;
                            //haverealdata=true;
                            break;
                        }
                    }
                    var data_value;
                    if(isfind){//在需要显示的标签列表
                        //isnew=true;
                        obj_data = (obj_realdata)[j];////sid
                        //(isNaN(obj_data.value))
                            data_value=obj_data.value
                        //else
                        //    data_value=parseFloat(obj_data.value);
                        //for(var k=0;k<v_sel.length;k++){//对照用户所选显示项，添加显示值到对应列，
                        //    if(v_sel[k].value==dname){
                        //        break;
                        //    }
                        //}
                        //if((k>=v_sel.length)&&(!isfindtype)){//如果没有在类型列表中，要如何处置
                            //需要表头标题添加name，所有列表项添加一列（cell）
                        //    add_displaytype(display_type,dname,realdatafolder,dname,false);
                        //    v_sel = $('[name="options"]');
                            //tablehead_len++;//第一次进入统计比例错误的问题，不应该递增。
                        //}
                        if(isnew){//如果是新的标签，就创建一行，添加所有的td单元，//
                            atr=document.createElement("tr");
                            atr.setAttribute("onclick", "tableclick(this,true)");//ondblclick
                            for(var k=0;k<10;k++){//tablehead_len
                                var atd=document.createElement("td");
                                //atd.setAttribute("width","150px");
                                atd.innerHTML= "&nbsp;";
                                atr.appendChild(atd);
                            }
                            atr.cells[0].innerHTML=pt;//标签id
                            //atr.cells[0].style.cssText="width:80px";
                            atr.cells[1].innerHTML=sid;
                            atr.cells[2].innerHTML=sname;//第一列添加标签名称，
                            atr.cells[3].value=dateToString(obj_data.time,2);//用于对下一次的采集时间进行比较计算
                            atr.cells[3].innerHTML=dateToString(obj_data.time,2).substring(10,19);//第二列添加测量时间，去掉日期，保留时间。
                            // 取指定标签过去24小时时间，用于调取历史记录
                            //if(asensorid===sid){//不加判断会总是取最后一组数据的时间；
                            //    var ckssj=new Date(dateToString(obj_data.time,2));//(obj_data.Time.replace(/-/g,"/")).substring(0,19));//.replace(/-/g,"/"));
                            //    var yesterdayend=ckssj-(1000*60*60*24);
                                //sessionStorage.kssj=dateToString(new Date(yesterdayend),2);
                            //    kssj = dateToString((yesterdayend),2);//new Date((obj_data.Time).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
                            //    jssj = dateToString((ckssj.getTime()+60000*1),2);
                            //}
                            //atr.cells[tab_head.rows[0].cells.length-4].innerHTML="<button backgroundColor='#fff' onclick=tohistory("+sid+") href='javascript:void(0)'>>></button>";
                            //atr.cells[tab_head.rows[0].cells.length-3].innerHTML="<button backgroundColor='#fff' onclick=towarnlog("+sid+") href='javascript:void(0)'>>></button>";
                            atr.cells[4].style.cssText="display:none";
                            atr.cells[5].innerHTML=parentname;
                            titlename=obj_data.name;
                            if(getCatalog(obj_data.name))
                                titlename=getCatalog(obj_data.name);
                            atr.cells[6].innerHTML=titlename+" : "+obj_data.value+" "+chartOption.chart_unit;
                            atr.cells[6].style.cssText="padding-left:5px;text-align:left;width:250px";
                            atr.cells[7].innerHTML=obj_data.message;
                            atr.cells[8].innerHTML=obj_data.folder;
                            /*for(var k=0;k<v_sel.length;k++){//添加到指定列,不同配置项添加到不同的列，由显示控制项控制显示与否
                                if(!v_sel[k].checked){
                                    atr.cells[k+hidden_cells].style.cssText = "display:none";
                                }
                                if(v_sel[k].value == dname){
                                    
                                    atr.cells[k+hidden_cells].innerHTML=data_value;
                                    if(obj_data.message){
                                        atr.cells[k+hidden_cells].style.backgroundColor="#ffff00";
                                    }else{
                                        atr.cells[k+hidden_cells].style.backgroundColor=""
                                    }
                                    isfindtype=true;
                                    //break;
                                }
                            }
                            if((k>=v_sel.length)&&(!isfindtype)){//如果没有在类型列表中，要如何处置
                                //需要表头标题添加name，所有列表项添加一列（cell）
                                add_displaytype(display_type,dname,realdatafolder,dname,false);
                                v_sel = $('[name="options"]');
                                tablehead_len++;
                            }*/
                            $table.appendChild(atr);
                            pt++;
                        }else{//不是新标签
                            let tab_row_len=$table.rows.length;
                            for(var l=0;l<tab_row_len;l++){
                                if($table.rows[l].cells[1].innerHTML==obj_data.sensorId){
                                    //for(var k=0;k<v_sel.length;k++){//对照用户所选显示项，添加显示值到对应列，
                                    //    if(!v_sel[k].checked){
                                    //        atr.cells[k+hidden_cells].style.cssText = "display:none";
                                    //    }
                                    //    if(v_sel[k].value==dname){
                                            titlename=obj_data.name;
                                            if(getCatalog(obj_data.name))
                                            titlename=getCatalog(obj_data.name);
                                            let str_hh=$table.rows[l].cells[6].innerHTML;
                                            if(str_hh.indexOf(titlename+" : ")!=-1){
                                                exp_str=str_hh.substring(str_hh.indexOf(titlename),(str_hh.indexOf("<br>",str_hh.indexOf(titlename))+4));
                                                str_hh.replace(exp_str,titlename+" : "+data_value+" "+chartOption.chart_unit);
                                            }else{
                                                str_hh=str_hh+"<br>"+
                                                titlename+" : "+ data_value+" "+chartOption.chart_unit;
                                            }
                                            $table.rows[l].cells[6].innerHTML=str_hh;
                                            //isbreak=true;
                                            if($table.rows[l].cells[2].innerHTML<dateToString(obj_data.time,2).substring(10,19)){//更新最新时间
                                                $table.rows[l].cells[2].innerHTML=dateToString(obj_data.time,2).substring(10,19);
                                                $table.rows[l].cells[2].value=dateToString(obj_data.time,2);
                                            }
                                            if(obj_data.message){
                                                //atr.cells[k+hidden_cells].style.backgroundColor="#ffff00";
                                                if(atr.cells[7].innerHTML)
                                                    atr.cells[7].innerHTML+=","+obj_data.message
                                                else
                                                    atr.cells[7].innerHTML=obj_data.message;
                                            }//else{
                                            //    atr.cells[k+hidden_cells].style.backgroundColor=""
                                            //}
                                            //break;
                                //        }
                                            atr.cells[8].innerHTML=obj_data.folder;
                                    //}
                                    /*if((k>=v_sel.length)&&(!isbreak)){//如果没有在类型列表中，要如何处置
                                        //需要表头标题添加name，所有列表项添加一列（cell）
                                        add_displaytype(display_type,dname,realdatafolder,dname,false);
                                        v_sel = $('[name="options"]');
                                    }*/
                                    break;
                                }
                            }
                        }
                    }
                }
            /*}else{//如果没有显示控制项（分组配置项） 20200509 编写，还需测试完善。
                for (var j=0;j<realdata_len;j++) {
                    dname=obj_realdata[j].name;
                    //grouptype=obj_realdata[j].type;//Catalog;
                    if(obj_realdata[j].SensorId==sid){//是否为新的标签项
                        isnew=false;
                    }else{ 
                        sid=obj_realdata[j].sensorId;
                        isnew=true;
                    }
                    if(obj_realdata[j].sensorId==asensorid)
                        nodata=false;
                    if (sensors&&isnew)
                    for (var i = 0; i < sensors_length; i++) {//是否在需要显示的标签列表中
                        isfindtype=false;
                        if(obj_realdata[j].sensorId==sensors[i].id){
                            let sensor_obj = sensors[i].Value;
                            type_td = sensor_obj.tyoe;//Catalog;
                            sname = sensor_obj.name;
                            if(sensor_obj.parentId!="-1"){
                                if((sensor_obj.parentId!=parentid)){
                                    parentid=sensor_obj.parentId;
                                    for(var k=0;k<sensors_length;k++){
                                        if(sensors[k].id==parentid){
                                            parentname=sensors[k].Value.name+"_";
                                            break;
                                        }
                                    }
                                }
                                //sensors.splice(i, 1);//找到并应用后删除元素，减少后续的循环次数。
                            }
                            sname=parentname+sname;
                            isfind=true;
                            break;
                        }
                    }
                    if(isfind){//在需要显示的标签列表
                            //isnew=true;
                        obj_data = (obj_realdata)[j];////sid
                        //if(isNaN(obj_data.value))
                            data_value=obj_data.value
                        //else
                            //data_value=parseFloat(obj_data.value).toFixed(Number_of_decimal);
                        if(isnew){//如果是新的标签，就创建一行，添加所有的td单元，
                            atr=document.createElement("tr");
                            //atr.setAttribute("height","35px");
                            tablehead_len=tab_head.rows[0].cells.length
                            for(var k=0;k<tablehead_len;k++){
                                var atd=document.createElement("td");
                                atr.appendChild(td);
                            }
                            atr.cells[0].innerHTML=sid;
                            atr.cells[0].style.cssText="display:none";
                            atr.cells[1].innerHTML=sname;//第一列添加标签名称，
                            atr.cells[2].value=dateToString(obj_data.time,2);
                            atr.cells[2].innerHTML=dateToString(obj_data.time,2).substring(10,19);//第二列添加测量时间
                            // 取指定标签过去24小时时间，用于调取历史记录
                            if(asensorid===sid){
                                var ckssj=new Date(dateToString(obj_data.time,2));//(obj_data.Time.replace(/-/g,"/")).substring(0,19));//.replace(/-/g,"/"));
                                var yesterdayend=ckssj-(1000*60*60*24);
                                //sessionStorage.kssj=dateToString(new Date(yesterdayend),2);
                                kssj = dateToString((yesterdayend),2);//new Date((obj_data.Time).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
                                jssj = dateToString((ckssj.getTime()+60000),2);
                            }
                            //atr.cells[length-2].innerHTML="<button backgroundColor='#fff' onclick=tohistory("+sid+") href='javascript:void(0)'>>></button>";
                            //atr.cells[length-1].innerHTML="<button backgroundColor='#fff' onclick=towarnlog("+sid+") href='javascript:void(0)'>>></button>";
                            for(var k in tab_head.rows[0].cells){//添加到指定列。
                                if(obj_data.name==tab_head.rows[0].cells[k].innerHTML){
                                    atr.cells[k].innerHTML=data_value;
                                    if(obj_data.message){
                                        atr.cells[k+hidden_cells].style.backgroundColor="#ffff00";
                                    }else{
                                        atr.cells[k+hidden_cells].style.backgroundColor=""
                                    }
                                    break;
                                }
                            }
                            atr.cells[tablehead_len-2].innerHTML=obj_data.name;
                            atr.cells[tablehead_len-2].style.cssText="display:none";
                            atr.cells[tablehead_len-1].innerHTML=obj_data.message;
                            atr.cells[tablehead_len-1].style.cssText="display:none";
                            $table.appendChild(atr);
                            pt++;
                        }else{//不是新标签
                            let tab_row_len=$table.rows.length;
                            for(var l=0;l<tab_row_len;l++){//定位到指定行
                                if($table.rows[l].cells[0].innerHTML==obj_data.sensorId){
                                    for(var k in tab_head.rows[0].cells){
                                        if(obj_data.name==tab_head.rows[0].cells[k].innerHTML){//添加到指定列
                                            atr.cells[k].innerHTML=data_value;
                                            if(obj_data.message){
                                                atr.cells[k+hidden_cells].style.backgroundColor="#ffff00";
                                                if(atr.cells[tablehead_len-1].innerHTML)
                                                    atr.cells[tablehead_len-1].innerHTML+=","+obj_data.message
                                                else
                                                atr.cells[tablehead_len-1].innerHTML=obj_data.message;
                                            }else{
                                                atr.cells[k+hidden_cells].style.backgroundColor=""
                                            }
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }*/
            if(nodata){
                showmsg("没有所选标签的实时数据");
                return;
            }
            /*if (pt > 0) {
                var tableLength = $table.rows.length;
                tab_head=document.getElementById("tab_head");
                //alertcount=[0,0,0,0,0]
                maxOfRealdata=($table.rows[0].cells[title_index].innerHTML)*1;
                maxvaluetime=($table.rows[0].cells[2].innerHTML);
                maxOfRealdataName=($table.rows[0].cells[1].innerHTML)
                if(!maxOfRealdata)
                    maxOfRealdata=0;
                for (var int = 0; int < tableLength; int++) {
                    if ($table.rows[int].cells[0].innerHTML == sessionStorage.SensorId) {
                        sessionStorage.t_p = int;
                    }
                    if(($table.rows[int].cells[title_index].innerHTML)*1>maxOfRealdata){
                        maxOfRealdata=($table.rows[int].cells[title_index].innerHTML)*1
                        maxvaluetime=($table.rows[int].cells[2].innerHTML);
                        maxOfRealdataName=($table.rows[int].cells[1].innerHTML)
                    }
                    //jisuanyichangbili(($table.rows[int].cells[title_index].innerHTML)*1);
                    //jisuanyichangbili(($table.rows[int].cells[tab_head.rows[0].cells.length-1].innerHTML));
                }
                /*if (typeof (sessionStorage.t_p) != "undefined") {
                    sname = $table.rows[sessionStorage.t_p].cells[1].innerHTML;
                    //chartOption.chart_type = $table.rows[sessionStorage.t_p].cells[6].innerHTML;
                    sensor_Id = parseInt($table.rows[sessionStorage.t_p].cells[0].innerHTML);
                    var lasttime = $table.rows[sessionStorage.t_p].cells[2].value;
                    var shottime=$table.rows[sessionStorage.t_p].cells[2].innerHTML;
                    //var myChart2 = echarts.init(document.getElementById('realdata_chart'));
                    updatachart(typename);
                    value0 = ($table.rows[sessionStorage.t_p].cells[title_index].innerHTML)*1;//字符转实数
                    //happentime=lasttime;
                    //value1=parseFloat($table.rows[sessionStorage.t_p].cells[3].innerHTML);
                    var heightpx = $("#other_realdata_tbody tr").height();// + 1;//加1是网格线的宽度
                    var ppt = parseInt(sessionStorage.t_p);
                    if(ppt>pageSize){
                        curPage=parseInt(ppt/pageSize);
                    }else{
                        curPage=0;
                    }
                    
                    //tableclick($table.rows[curPage]);
                    $("#datadiv").scrollTop((ppt) * heightpx);//表格重新滚动定位到选定的行datadiv为table的上级div的id；
                    $table.rows[ppt].style.backgroundColor = color_table_cur;
                    //tableclick($table.rows[ppt],true);
                    if (isfirst != true) {
                        var temp_option = myChart2.getOption();
                        if (temp_option.series.length>0) {
                            if (temp_option.series[0].data[temp_option.series[0].data.length - 1][0] < Date.parse(lasttime)) {
                                //从队头删除数据,如果第一个数据的时间与24小时前的时间差在10分钟内，则删除第一数据,否则添加数据,firsttime 最后时间的24小时前的时间
                                var firsttime=(Date.parse(lasttime)-1000*3600*24);
                                if (Math.abs(GetDateDiff(dateToString(temp_option.series[0].data[0][0],2),dateToString(firsttime,2),"minute"))<10)
                                    temp_option.series[0].data.shift();
                                temp_option.series[0].data.push([Date.parse(lasttime), value0, temp_option.series[0].data.length]);
                                //temp_option.series[1].data.push([strtodatetime(lasttime),value1,temp_option.series[1].data.length]);
                                if (maxvalue < value0) {
                                    maxvalue = value0;
                                    maxval = (maxvalue + (maxvalue - minvalue) * 0.2).toFixed(Number_of_decimal);
                                    temp_option.yAxis[0].max = maxval;
                                    happentime=shottime;
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
                                //option.series[1].data[0].value = value0;
                                //myChart.setOption(option);//
                                happentime=shottime;
                            }
                            //refreshData();
                        }
                        window.parent.treelocationforsensorid(sensor_Id);
                    } else {
                        isfirst = false; //
                        //myChart2.showLoading();
                        if(!isload)
                        window.parent.treelocationforsensorid(sensor_Id,true);
                        gethistorydata(sensor_Id,catalog,typename, kssj, jssj, 1);
                    }
                }//else{	//$table.rows[0].ondblclick();	//}
                //showstateinfo("");
                
            } else {
                //showmsg("没有符合条件的实时数据",info_showtime);
                showstateinfo("没有符合条件的实时数据","otherrealdata");
            }*/
        } else {
            showmsg("没有符合条件的实时数据", info_showtime);
            showstateinfo("没有符合条件的实时数据","otherrealdata");
        }
        //$table.rows[t_pt].scrollIntoView();
        //refreshData();
        //display();
        //page=new Page(pageSize,'other_realtable','others_realdata_tbody','pageindex');
        //page.changePage(curPage);
    }catch(err){
        showstateinfo(err.message,"realdata_iot/decoderealdata");
    }
}
function localrowbysensorid(asensorid){
    //var isfinded=false;
    initchartoption();
    isfirst=true;
    decoderealdata(null,asensorid,true);//
}
function updatachart(atype) {//根据不同设备类型，更新图形当中的最大最小值设置以及数值单位
    switch (atype.toLowerCase()) {
        case "temp":
        case "tmp":
            if(!chartOption.chart_min)//20200518 如果获取的配置项参数为空或不存在，则赋予默认值
                chartOption.chart_min = -30;
            if(!chartOption.chart_max)
                chartOption.chart_max = 170;
            chartOption.start_angle = -45;
            if(!chartOption.chart_unit || chartOption.chart_unit=="度")
            chartOption.chart_unit = "℃"
            chartOption.chart_sigle = "";
            colors = [[0.2, '#1e90ff'], [0.7, '#090'], [0.8, '#ffa500'], [0.9, '#ff4500'], [1, '#ff0000']];
            break;
        case "pd":
        case "max":
        case "avg":
            //if(!chartOption.chart_min)
                chartOption.chart_min = 0;
            //if(!chartOption.chart_max)
                chartOption.chart_max = -100;
            //if(!chart_unit)
            chartOption.chart_unit = "dB";
            chartOption.chart_sigle = ""
            colors = [[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']];
            break;
        default:
            //if(!chartOption.chart_min)
                chartOption.chart_min = 0;
            //if(!chartOption.chart_max)
                chartOption.chart_max = 100;
            //if(!chart_unit)
            chartOption.chart_unit = "";
            chartOption.chart_sigle = ""
            colors = [[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']];
    }
}
function tableclick(tr,isloadmain) {
    $(tr).siblings("tr[backgroundColor!='#ff0']").css("background", "");
    sessionStorage.t_p = tr.rowIndex - 1;
    sname = tr.cells[1].innerHTML;
    //chart_type = tr.cells[tr.cells.length-2].innerHTML;
    //updatachart(typename);
    //if(title_index!=-1)
    //    value0 = parseFloat(tr.cells[6].innerHTML).toFixed(Number_of_decimal);
    //value1=parseFloat(tr.cells[3].innerHTML);
    if (parseInt(tr.cells[1].innerHTML) != sessionStorage.SensorId) {
        sessionStorage.SensorId = parseInt(tr.cells[1].innerHTML);
        sessionStorage.sel_id=sessionStorage.SensorId;
        //var kssj = getCurrentDate(1) + " 00:00:00";
        //var jssj = getCurrentDate(2);
        //var yesterdaytime= (new Date(jssj))-(1000*60*60*24);
        //var kssj=dateToString(new Date(yesterdaytime),2);
        //kssj = (tr.cells[2].innerHTML).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
        //jssj = (tr.cells[2].innerHTML);
        //myChart2.showLoading();
        //gethistorydata(sessionStorage.SensorId,catalog,typename, kssj, jssj, 1);
    }
    //if (isloadmain)
       // window.parent.treelocationforsensorid(sessionStorage.SensorId);
    //maxval=0;
    //refreshData();
    //moduletable("other_realdata_tbody");
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
                fontWeight: 'normal',
                fontSize:chartOption.chart_detail_font_size,
            },
            text: sname+"--24小时极值",
        },
        tooltip: {
            formatter: "{a} <br/>{c} {b}"
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
        series: [
            {
                name: '24小时极值',
                type: 'gauge',
                center: ['50%', '50%'], // 默认全局居中
                radius: '70%',//半径
                min: chartOption.chart_min,
                max: chartOption.chart_max,
                //startAngle: 135,//起始角度
                //endAngle: 35,//终止角度
                splitNumber: chartOption.chart_main_num,//
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [0.2, 'green'],
                            [1, '#1f1f1f']
                        ],
                        color: [[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']],
                        width: 29,
                        /*shadowColor: 'yellow', //默认透明
                        shadowOffsetX:2,
                        shadowBlur: 10*/
                    }
                },
                axisTick: { // 坐标轴小标记
                    show: true,
                    splitNumber: chartOption.chart_chi_num,
                    length:10,
                },
                axisLabel: {
                    textStyle: { // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10,
                        fontSize: chartOption.chart_detail_font_size,
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
                    width: 5,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 0
                },
                title: {
                    show: true,
                    offsetCenter: [0, '-30%'], // x, y，单位px
                    text: '24小时峰值',
                    textStyle: {
                        color: 'white',
                        fontSize: chartOption.chart_title_font_size, 
                    }
                },
                detail: {
                    show: true,
                    offsetCenter: [0, '100%'],
                    formatter: ' {value}  \n\n' + '时间: ' + happentime,//+chart_unit,
                    textStyle: {
                        fontSize: chartOption.chart_detail_font_size, 
                        color: '#F8F43C'
                    }
                },
                data: [data[0]],//[{value: 20,name: '温度'}]
            },
        ]
    };
    //myChart.setOption(option);//24小时极值
    option4 = {
        backgroundColor: backgroudcolor,
        title: {
            //left: '40%',
            offsetCenter: ['200%', '0'],
            textStyle: {
                color: 'white',
                fontWeight: 'normal',
                fontSize: chartOption.chart_title_font_size,
            },
            text: sname+"-实时值",
        },
        tooltip: {
            formatter: "{a} <br/>{c} {b}"
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
        series: [
            {
                name: '实时值',
                type: 'gauge',
                center: ['50%', "50%"], // 默认全局居中
                radius: '70%',//半径
                min: chartOption.chart_min,
                max: chartOption.chart_max,
                //startAngle: 135,//起始角度
                //endAngle: 35,//终止角度
                splitNumber: chartOption.chart_main_num,//
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [0.2, 'green'],
                            [1, '#1f1f1f']
                        ],
                        color: [[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']],
                        width: 29,
                        /* shadowColor: 'yellow', //默认透明
                         shadowOffsetX:2,
                         shadowBlur: 10*/
                    }
                },
                axisTick: { // 坐标轴小标记
                    show: true,
                    splitNumber: chartOption.chart_chi_num,
                    length:10,
                },
                axisLabel: {
                    textStyle: { // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10,
                        fontSize:14,
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
                    width: 5,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 5
                },
                title: {
                    show: true,
                    offsetCenter: [0, '-30%'], // x, y，单位px
                    textStyle: {
                        color: 'white',
                        fontSize: chartOption.chart_title_font_size,
                    }
                },
                detail: {
                    show: true,
                    offsetCenter: [0, '100%'],
                    formatter:  '{value}  \n\n' + '实时值: ' + ' ',//'实时值:\n\n' + ' ' + ' {value}  ' + chart_unit,
                    textStyle: {
                        fontSize: chartOption.chart_detail_font_size,
                        color: '#F8F43C'
                    }
                },
                data: [data[1],],//[{value: 20,name: '温度'}]
            }
        ]
    };
    myChart4.setOption(option4);
    //initecharts();
}
//window.setInterval("getrealdatabynodeid(-1)",60000);
function refreshData() {
    //var myChart = echarts.init(document.getElementById('realdata_gaugechart'));
    /*if (chart_type == "pd") {
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
    option.title.text = sname+" : "+titlename+" 24小时峰值";
    for (var i = 0; i < option.series.length; i++) {
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
    }
    myChart.setOption(option);*/
    /*option4.series[0].data[0].value =value0;//val1;
    option4.series[0].max = chartOption.chart_max;
    option4.series[0].min = chartOption.chart_min;
    option4.series[0].splitNumber=chartOption.chart_main_num;
    option4.series[0].axisLine.lineStyle.color=colors;
    option4.series[0].axisTick.splitNumber=chartOption.chart_chi_num;
    value = option4.series[0].data[0].value;
    option4.series[0].detail.formatter = chartOption.chart_sigle + value + ': \n\n' + option4.series[0].name + ' ';//+chart_unit;
    option4.series[0].data[0].name = chart_unit;//sname;
    option4.title.text = sname+" : "+titlename;
    myChart4.setOption(option4);
    option1.series[0].data[0].value= maxOfRealdata.toFixed(Number_of_decimal);//54.321;
    option1.series[0].detail.formatter=maxOfRealdata.toFixed(Number_of_decimal)+ '\n\n 标签名称: '+maxOfRealdataName;//实时极值的标签名称,"发生时刻:"+maxvaluetime+
    option1.series[0].max = chart_max;
    option1.series[0].min = chart_min;
    option1.series[0].data[0].name = chart_unit;//sname;
    option1.title.text="实时极值: "+titlename;
    myChart1.setOption(option1);
    var ratArr=[],str_name="";
    for(var i=0;i<alertcount.length;i++){
        if(alertcount[i]!=0){
            switch(i){
                case 0:
                    str_name="正常";
                    break;
                case 1:
                    str_name="预警";
                    break;
                case 2:
                    str_name="三级告警";
                    break;
                case 3:
                    str_name="二级告警";
                    break;
                case 4:
                    str_name="一级告警";
                    break;
            }
            ratArr.push({name:str_name,value:alertcount[i]});
        }
        
        
    }
    option3.series[0].data=ratArr;
    mychart3.setOption(option3);
    */
}
function decodedatas(obj_chartdata) {
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
    myChart2.clear();
    if(obj_chartdata==null){
        obj_chartdata=JSON.parse(localStorage.getItem("historydata"));
    }
    if (obj_chartdata == null) {
        maxvalue=NaN;//20200518
        myChart2.hideLoading();
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
    lengenddata.push("当天峰值");
    lengenddata.push("实时值");
    //lengenddata.push(document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text+"457");
    option.series[0].data[0].value = maxvalue;
    //option.series[0].data[0]
    //myChart.setOption(option);
    refreshData();
    drawchart();
    //decoderealdata();//进行一次实时数据刷新，完善图表的指示内容；//20200518
    //绘制图形线条
    function drawchart() {
        //var myChart = echarts.init(document.getElementById('main'));
        var lengenddata1 = [];
        lengenddata1.push(titlename);
        var option2 = {
            color: ['#FF0000', '#FFFF00'],//,'#00ff00'
            backgroundColor: '#d0d0d0',
            title: {
                text: sname+" "+titlename+' : 24小时变化趋势图',
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
            series: [/**/{
                name: lengenddata1[0],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text,
                type: 'line',
                showAllSymbol: true,
                symbolSize: 1,
                data: pa,
                smooth: true,//平滑曲线 sangeshijianjiedianshang
                smoothMonotone: 'x',
            }
            ]
        };
        myChart2.hideLoading();
        myChart2.setOption(option2);
    }
    }catch(err){
        showstateinfo(err.message.message,"otherrealdata/decodedatas");
    }
}
function initchart2() {
    var option2 = {
        color: ['#FFFF00', '#FF0000'],//,'#00ff00' 
        backgroundColor: backgroudcolor,
        title: {
            text: '24h 变化趋势图',
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
            data: [0],
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
        series: [
            {
                name: '实时极值',
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
                        width: 29,
                        /*shadowColor: 'yellow', //默认透明
                        shadowOffsetX:2,
                        shadowBlur: 10*/
                    }
                },
                axisTick: { // 坐标轴小标记
                    show: true,
                    splitNumber: 4,
                    length:10,
                    lineStyle:{
                        color:"#fff",
                    }
                },
                axisLabel: {
                    textStyle: { // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10,
                        fontSize:14,
                    },
                },
                splitLine: { // 分隔线
                    length: 20, // 属性length控制线长
                    lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 2,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: {
                    show: true,
                    width: 5,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 0
                },
                title: {
                    show: true,
                    offsetCenter: [0, '-30%'], // x, y，单位px
                    textStyle: {
                        color: 'white',
                        fontSize: 20
                    }
                },
                detail: {
                    show: true,
                    offsetCenter: [0, '100%'],
                    formatter: ' {value}  \n\n' + '发生时刻: ' +maxvaluetime+ '\n\n 标签名称: '+sname,//+chart_unit,
                    textStyle: {
                        fontSize: 20,
                        color: '#F8F43C'
                    }
                },
                data: [{value: 20,name: chartdataname1}],//[data[0]],//
            },
        ]
    };
    //myChart1.setOption(option1);
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
            text: "状态统计图",
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
                radius: ['20%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    formatter: '{b}： {c}\n\n  {{d}%}  ',
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
                data: []//,,{value:90,name:'告警'},{value:0,name:"严重告警"}
                    //{value:30,name:'故障'},{value: 20,name: '停运'}]{value:310,name:'正常'}, {value:52,name:'预警'},{value:20,name:'一级告警'} ,
                    //{value:34,name:'二级告警'}
            }
        ]
    };
    //mychart3.setOption(option3);
    //mychart3.on('click',function(params){//点击事件
    //    console.log(params);
    //});
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
/**
 * 解决在首次登录今日实时数据页面时数据不立即显示的问题，标签名称添加上级名称，区分同名标签；
 * 状态统计添加图形序列的数值显示；
 * 数据列表项控制显示项添加folder属性，并进行页面级存储，在刷新时加载。同时可以在标签没有配置项时可以通过实时数据获取到其folder属性。1224
 * 数据列表显示控制函数合并（告警、设备、实时）
 * 解决在没有数据时的状态比例图形显示错误问题；
 */
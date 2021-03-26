/**var t1 = window.setInterval("getrealdatabystation(1);",30000);
//getrealdatabynodeid(-1);
//当没有数据返回时更新页面造成报某变量未定义的问题value0. 
//20200709 实时值图表详情显示当天峰值的提示（已修改），数据列表表头刷新可以点击刷新按钮进行刷新（不必有数据);图形配置刷新；（没数不刷新，或限值不匹配原来不正确,标题undfine）
20200716 针对新实时数据页面添加实时最大值{仪表盘）、统计比例（柱状图）两个图表的数据计算过程，其中比例计算有待进一步完善。修改某标签过去24小时最大值和实时值以及变化趋势图的
    刷新过程，添加在主页面点击二级菜单时，对历史数据等页面的配置项进行更新显示功能
**/
var is_have = false;
var chartOption={};
var myChart2 = echarts.init(document.getElementById('realdata_chart'));//趋势图
var myChart = echarts.init(document.getElementById('realdata_maxvalOfDay'));//24小时极值
var myChart3=echarts.init(document.getElementById('realdata_rateOfNormal'));//占比统计
var myChart1=echarts.init(document.getElementById('realdata_maxvalOfReal'));//实时极值
var myChart4=echarts.init(document.getElementById('realdata_realdata'));//实时值
var option,option1,option2,option3,option4;//对应mychart（1-4）的配置项 need speed seed deed
var chartdataname1="";
var sname="",sid,type_td,title_index=3,hidden_cells=3;
var isfirst = "true";
var maxval = 0, minval = 0, maxvalue = 0, minvalue = 0,value0=0,maxOfRealdata=0;//value0未定义错误
var maxvaluetime="",happentime="",maxOfRealdataName="";
var colors = [];
var pageSize = 10;    //每页显示的记录条数
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
//var alertconfig=[0,25,"温度过低","温度过高"];
//var alertcount=[0,0,0,0];//;
var alert_obj=new Object();
//let haverealdata=false;
var catalog="Defalt";
var display_type=document.getElementById("display_type_realdata");
var pt = 0;
$(function () {
    initrealdata();
});
function initchartoption(){//初始化图表选择和显示值；
    chartOption={chart_type:"",chart_unit:"",chart_max:170,chart_min:0,chart_sigle:"",
                 chart_main_num:4,chart_chi_num:8,chart_detail_font_size:16,chart_title_font_size:16,
                 start_angle:0,end_angle:180};
    maxval =  minval =  maxvalue =minvalue = value0=maxOfRealdata=0;
    alert_obj={};//状态统计对象
    sname=maxOfRealdataName=maxvaluetime=happentime="";//图表的标签名称、最大值标签名称、最大值发生时间、24h极值发生时刻，maxvaluetime暂时未使用。
}
function initrealdata(){//初始化页面选项
  try{
    initchartoption();
    cleartable();
    datas = [];
    datas.splice(0, datas.length);//
    if(sessionStorage.pageSize)
        pageSize=parseInt(sessionStorage.pageSize);
    for (var i = 0; i < 1; i++) {
        var value = 0;//(Math.random() * 100).toFixed(2) - 0;
        datas.push(JSON.parse('{"name":"","value":' + value + '}'));
        var value = 0;//(Math.random() * 100).toFixed(2) - 0;
        datas.push(JSON.parse('{"name":"","value":' + value + '}'));//
    }
    updatachart(chartOption.chart_type);
    initseries(datas);
    //initchart2();
    initpage();
    }catch(err){
        showstateinfo(err.message.message,"initrealdata");
    }
}
function initpage() {
    updatapcnav(3);
    window.parent.closeloadlayer();
    //保存页面现场，在点击浏览器的刷新按钮刷新时应用
    sessionStorage.framepage="newrealdata.html";
    sessionStorage.pageindex=2;
    tab_head=document.getElementById("tab_head");
    if (typeof (Worker) !== "undefined") {//只在网络状态下可用，本地磁盘目录下不可用。// 
        if (typeof (w1) == "undefined") {
            w1 = new Worker("delay_worker.js");
        }
        var i = 0;
        w1.onmessage = function (event) {
            i++
            if (i<=1) //第一次略过
                return;
            decoderealdata();
        };
    } else {
        var t1 = window.setInterval("decoderealdata();", 60000);
    }
    appendalldisplaytype();/*"display_type"*/
    
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
    try{
    for(var i=display_type.childNodes.length;i>0;i--)
        display_type.removeChild(display_type.childNodes[i-1]);
    allconfigs=JSON.parse(localStorage.Config);
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
    else*/{
    
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
                allselect = $('[name="options"]');
                let isrepeat=false;
                let allselect_len=allselect.length;
                for(var i=0;i<allselect_len;i++){
                    if((s_des[p].name==allselect[i].value)&&(allconfigs[ac].type==allselect[i].attributes.datatype.nodeValue)){
                        isrepeat=true;
                        break;
                    }
                }
                if(isrepeat)
                    break;
                if(p==0){
                    //name=s_des[p].name;
                    catalog=s_des[p].folder;//Catalog;
                    //ainput.checked=true;
                    //lab.className=""
                    add_displaytype(display_type,s_des[p].name,s_des[p].folder,s_des[p].desc,allconfigs[ac].type,true);
                }else{
                    //lab.className="";
                    add_displaytype(display_type,s_des[p].name,s_des[p].folder,s_des[p].desc,allconfigs[ac].type,false);
                }
                /*lab.appendChild(ainput);//a-
                lab.appendChild(spn);
                //lab.innerHTML='<input class="catalog" type="checkbox" name="options" value="'+s_des[p].Name+'" >'+s_des[p].Desc;
                display_type.appendChild(lab);*/
            }
        }
    }
    }
    if(sessionStorage.realdata_index && sessionStorage.realdata_index>=hidden_cells)
    $.sortTable.sort('realtable',sessionStorage.realdata_index)
    else
        $.sortTable.sort("realtable",hidden_cells);
    }catch(err){
        showstateinfo(err.message,"realdata/appendalldisplaytype");
    }
}
function add_displaytype(parent,name,folder,text,type,check){
    var lab=document.createElement("label");
    lab.setAttribute("style","margin-left:20px")
    var ainput=document.createElement("input");
    ainput.setAttribute("type","checkbox");
    ainput.setAttribute("name","options");
    ainput.setAttribute("value",name);
    ainput.setAttribute("folder",folder);
    ainput.setAttribute("datatype",type);
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
    var tab=$("#realdata-tbody");
    if(tab[0].rows.length>0){
        tableaddcell();
    }    
}
function tableaddcell(){
    var ttd=document.createElement("td");
    ttd.setAttribute("display","none");
    var tab_rows=$("#realdata-tbody")[0].rows;
    var tab_len=tab_rows.length;
    for(let i=0;i<tab_len;i++)
        tab_rows[i].appendChild(td);
}
//"刷新"按钮点击事件
function btn_refresh_click(obj){
    allselect = $('[name="options"]');
    var allselects=[];
    let allselect_len=allselect.length;
    for(var i=0;i<allselect_len;i++){
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
    cleartable();
    //decoderealdata();
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
        let sel_len=sel.length;
        for(var k=0;k<sel_len;k++){
            count++;
            th_th=document.createElement("th");
            th_th.setAttribute("width","180px");
            let atype=sel[k].attributes.datatype.value;
            th_th.setAttribute("onclick","$.sortTable.sort('realtable',"+(k+hidden_cells)+",'"+atype+"',)");
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
            let obj_realdata_len=obj_realdata.length;
            for(var i=0;i<obj_realdata_len;i++){
                if(tdname==obj_realdata[i].name){
                    continue;
                }else{
                    var thd=document.createElement("td");
                    thd.setAttribute("onclick","$.sortTable.sort('realtable',"+(count+hidden_cells)+")");
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
function getCatalog(adatatype,index){
    try{
    var catalog="";
    var  catalogsel = $('[name="options"]');
    typename=catalogsel[index].value;
    titlename=catalogsel[index].textContent;//显示项的标题 //20200518
    updatachart(typename);//0709 更新图表配置
    refreshData();
    //return catalog;
    var isfindconfig=false;
    if(allconfigs){
        for(var q in allconfigs){
            if(allconfigs[q].type===adatatype)
            for(var l in allconfigs[q].details){
                if(allconfigs[q].details[l].name.toLowerCase()==typename.toLowerCase()){
                    var configname=allconfigs[q].name;
                    var jo_config=JSON.parse(localStorage.Config);
                    for(var c in jo_config)
                        if(jo_config[c].name.toLowerCase()==configname.toLowerCase()){
                            if(!jQuery.isEmptyObject(jo_config[c].details)){
                                var d_config=jo_config[c].details; //20200918 获取配置项参数 由allconfigs（typeconfigs）的details里的name找到typename，然后取其
                                for(var i in d_config){            //name,由name到configs里查找name，找到后从其details里提取config，然后从config中提取所需的配置数值。
                                    if((d_config[i].name.toLowerCase()==typename.toLowerCase())&&((d_config[i].details))){
                                        for(var detail in d_config[i].details){
                                            if(d_config[i].details[detail].name.toLowerCase()=="Unit".toLowerCase()){
                                                chartOption.chart_unit=d_config[i].details[detail].value;
                                                continue;
                                            }
                                            if(d_config[i].details[detail].name.toLowerCase()=="Top".toLowerCase()){
                                                chartOption.chart_max=d_config[i].details[detail].value;
                                                continue;
                                            }
                                            if(d_config[i].details[detail].name.toLowerCase()=="Bot".toLowerCase()){
                                                chartOption.chart_min=d_config[i].details[detail].value;
                                                continue;
                                            }
                                        }
                                        //chartOption.chart_max=d_config[i].details.Top;
                                        //chartOption.chart_min=d_config[i].details.Bot;
                                        if((chartOption.chart_max-chartOption.chart_min)%10==0){
                                            chartOption.chart_main_num=4;
                                            chartOption.chart_chi_num=8;
                                        };
                                        if((chartOption.chart_max-chartOption.chart_min)%5==0){
                                            chartOption.chart_main_num=5;
                                            chartOption.chart_chi_num=10;
                                        }
                                        sessionStorage.setItem("chartoption",JSON.stringify(chartOption));
                                        //alertconfig[1]=d_config[i].config.Max;
                                        //alertconfig[0]=d_config[i].config.Min;
                                        //alertconfig[3]=d_config[i].config.MMax;
                                        //alertconfig[2]=d_config[i].config.MMin;
                                        isfindconfig=true;
                                        break;
                                    }
                                }
                            }
                            if(isfindconfig)
                            break;
                        }
                        //catalog= allconfigs[q].details[l].folder;
                        if(isfindconfig)
                        break;
                }
            }
            if(isfindconfig)
            break;
        }
    }
    catalog=catalogsel[index].attributes.folder.nodeValue;
    return catalog;
    }catch(err){
        showstateinfo(err.message,"realdata/getCatalog")
    }
}
function cleartable(){
    $('#realdata-tbody').empty();
    getrealdatabynodeid(-1);
}
function decoderealdata(obj_realdata,asensorid,isload) {//obj_realdata 实时数据，asensorid 当前标签id，isload 是否与主菜单标签表同步
    try{
    var v_sel = $('[name="options"]');
    //$('#realdata-tbody').empty();
    $table = document.getElementById('realdata-tbody');
    if(!obj_realdata){
        obj_realdata=JSON.parse(localStorage.getItem("realdata"));
    }
    var sensors_length=0;
    var sensors = JSON.parse(localStorage.getItem("sensors"));
    if(sensors)
        sensors_length=sensors.length;
    var obj_data = new Object();
    var dname;
    var isnew=true,isfind=false;//isbreak=false;
    var atr;
    var parentid=-1,parentname="";
    var isfindtype=false;
    var realdatafolder;
    var kssj = dateToString((new Date(getCurrentDate(2))-(1000*60*60*24)),2) ;// + " 00:00:00";
    var jssj = getCurrentDate(2);
    //haverealdata=false;
    sid=-1;
    var nodata=true;
    if(!asensorid)
        nodata=false;
    if (obj_realdata) {
        var realdata_len=obj_realdata.length, 
        tablehead_len=tab_head.rows[0].cells.length;
        refresh_tabhead(v_sel);//根据选项刷新表头的显示内容
        //alert_obj={};
        //var title_len=tab_head.rows[0].cells.length;
        if(v_sel){//有显示控制选择项时进行如下操作.
            for (var j=0;j<realdata_len;j++) {
                if(window.parent.realdataid<parseInt(obj_realdata[j].id))
                    window.parent.realdataid=parseInt(obj_realdata[j].id);
                $table = document.getElementById('realdata-tbody');
                var tab_rows_len=$table.rows.length;
                dname=obj_realdata[j].name;
                realdatafolder=obj_realdata[j].folder;
                isfindtype=false;
                //grouptype=obj_realdata[j].type;//Catalog;
                if(obj_realdata[j].sensorId==asensorid)
                    nodata=false;
                /*if(obj_realdata[j].sensorId==sid){//是否为新的标签项,相同标签的数据默认连续
                    isnew=false;
                }else{ 
                    sid=obj_realdata[j].sensorId;
                    isnew=true;
                }*/
                sid=obj_realdata[j].sensorId;
                    for(p=0;p<tab_rows_len;p++){
                        if($table.rows[p].cells[0].innerHTML==obj_realdata[j].sensorId){
                            isfindtype=true;
                            break;
                        }
                    }
                    if(isfindtype)
                        isnew=false
                    else
                        isnew=true;
                if (sensors)//&&isnew
                for (var i = 0; i < sensors_length; i++) {//是否在需要显示的标签列表中
                    isfind=false;
                    if(sid==sensors[i].id){
                        let sensor_obj = sensors[i].Value;
                        type_td = sensor_obj.type;//Catalog;//
                        sname = sensor_obj.name;
                        //parentid=sensors[i].Value.parentId;
                        if(sensor_obj.parentId!="-1"){  
                            if((sensor_obj.parentId!=parentid)){//20201221
                                parentid=sensor_obj.parentId;
                                for(var k=0;k<sensors_length;k++){
                                    if(sensors[k].id==parentid){
                                        parentname=sensors[k].Value.name+"_";
                                        break;
                                    }
                                }
                            }
                            //sensors.splice(i, 1);
                        }
                        sname=parentname+sname;
                        isfind=true;
                        //haverealdata=true;
                        break;
                    }
                }
                var data_value;
                if(isfind){//在需要显示的标签列表
                    //isnew=true;
                    obj_data = (obj_realdata)[j];////sid
                    if(parseFloat(obj_data.value))
                        data_value=(obj_data.value*1).toFixed(Number_of_decimal)
                    else
                        data_value=obj_data.value;
                    for(var k=0;k<v_sel.length;k++){//对照用户所选显示项，添加显示值到对应列，
                        if(v_sel[k].value==dname){
                            break;
                        }
                    }
                    if((k>=v_sel.length)&&(!isfindtype)){//如果没有在类型列表中，要如何处置
                        //需要表头标题添加name，所有列表项添加一列（cell）
                        add_displaytype(display_type,dname,realdatafolder,dname,false);
                        v_sel = $('[name="options"]');
                        refresh_tabhead(v_sel);//
                        tablehead_len++;//第一次进入统计比例错误的问题，不应该递增。
                        tableaddcell();
                    }
                    if(isnew){//如果是新的标签，就创建一行，添加所有的td单元，//
                        atr=document.createElement("tr");
                        atr.setAttribute("onclick", "tableclick(this,true)");//ondblclick
                        for(var k=0;k<tablehead_len;k++){
                            var atd=document.createElement("td");
                            //atd.setAttribute("width","150px");
                            atd.innerHTML= "&nbsp;";
                            atr.appendChild(atd);
                        }
                        atr.cells[0].innerHTML=sid;//标签id   1/4 74/270
                        atr.cells[0].style.cssText="display:none";
                        atr.cells[1].innerHTML=sname;//第一列添加标签名称，
                        atr.cells[2].value=dateToString(obj_data.time,2);//用于对下一次的采集时间进行比较计算
                        atr.cells[2].innerHTML=dateToString(obj_data.time,2).substring(10,19);//第二列添加测量时间，去掉日期，保留时间。
                        // 取指定标签过去24小时时间，用于调取历史记录
                        if(asensorid===sid){//不加判断会总是取最后一组数据的时间；
                            var ckssj=new Date(dateToString(obj_data.time,2));//(obj_data.Time.replace(/-/g,"/")).substring(0,19));//.replace(/-/g,"/"));
                            var yesterdayend=ckssj-(1000*60*60*24);
                            //sessionStorage.kssj=dateToString(new Date(yesterdayend),2);
                            kssj = dateToString((yesterdayend),2);//new Date((obj_data.Time).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
                            jssj = dateToString((ckssj.getTime()+60000*1),2);
                        }
                        //atr.cells[tab_head.rows[0].cells.length-4].innerHTML="<button backgroundColor='#fff' onclick=tohistory("+sid+") href='javascript:void(0)'>>></button>";
                        //atr.cells[tab_head.rows[0].cells.length-3].innerHTML="<button backgroundColor='#fff' onclick=towarnlog("+sid+") href='javascript:void(0)'>>></button>";
                        atr.cells[tablehead_len-2].innerHTML=obj_data.name;
                        atr.cells[tablehead_len-2].style.cssText="display:none";
                        atr.cells[tablehead_len-1].innerHTML=obj_data.message;
                        atr.cells[tablehead_len-1].style.cssText="display:none";
                        for(var k=0;k<v_sel.length;k++){//添加到指定列,不同配置项添加到不同的列，由显示控制项控制显示与否
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
                        /*if((k>=v_sel.length)&&(!isfindtype)){//如果没有在类型列表中，要如何处置
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
                            if($table.rows[l].cells[0].innerHTML==obj_data.sensorId){
                                for(var k=0;k<v_sel.length;k++){//对照用户所选显示项，添加显示值到对应列，
                                    if(!v_sel[k].checked){
                                        $table.rows[l].cells[k+hidden_cells].style.cssText = "display:none";
                                    }
                                    if(v_sel[k].value==dname){
                                        $table.rows[l].cells[k+hidden_cells].innerHTML=data_value;
                                        //isbreak=true;
                                        if($table.rows[l].cells[2].innerHTML<dateToString(obj_data.time,2).substring(10,19)){//更新最新时间
                                            $table.rows[l].cells[2].innerHTML=dateToString(obj_data.time,2).substring(10,19);
                                            $table.rows[l].cells[2].value=dateToString(obj_data.time,2);
                                        }
                                        if(obj_data.message){
                                            $table.rows[l].cells[k+hidden_cells].style.backgroundColor="#ffff00";
                                            if($table.rows[l].cells[tablehead_len-1].innerHTML&&($table.rows[l].cells[tablehead_len-1].innerHTML.indexOf(obj_data.message)<0))
                                            $table.rows[l].cells[tablehead_len-1].innerHTML+=","+obj_data.message
                                            else
                                            $table.rows[l].cells[tablehead_len-1].innerHTML=obj_data.message;
                                        }else{
                                            $table.rows[l].cells[k+hidden_cells].style.backgroundColor=""
                                        }
                                        break;
                                    }
                                    
                                }
                                /*if((k>=v_sel.length)&&(!isbreak)){//如果没有在类型列表中，要如何处置
                                    //需要表头标题添加name，所有列表项添加一列（cell）
                                    add_displaytype(display_type,dname,realdatafolder,dname,false);
                                    v_sel = $('[name="options"]');
                                }*/
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
                    if(parseFloat(obj_data.value))
                        data_value=(obj_data.value*1).toFixed(Number_of_decimal)
                    else
                        data_value=obj_data.value;
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
        }
        if(nodata){
            //showmsg("没有所选标签的实时数据");
            return;
        }
        if (pt > 0) {
            alert_obj=[];
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
                jisuanyichangbili(($table.rows[int].cells[tab_head.rows[0].cells.length-1].innerHTML));
            }
            if (typeof (sessionStorage.t_p) != "undefined") {
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
                var heightpx = $("#realdata-tbody tr").height();// + 1;//加1是网格线的宽度
                var ppt = parseInt(sessionStorage.t_p);
                if(ppt<pageSize){
                    curPage=0;
                }else{
                    curPage=parseInt((ppt)/pageSize);
                }
                /**
                 */
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
            showstateinfo("没有符合条件的实时数据","realdata");
        }
    } else {
        showmsg("没有符合条件的实时数据", info_showtime);
        showstateinfo("没有符合条件的实时数据","realdata");
    }
    //$table.rows[t_pt].scrollIntoView();
    refreshData();
    //display();
    //page=new Page(pageSize,'realtable','realdata-tbody','pageindex');
    //page.changePage(curPage);
    }catch(err){
        showstateinfo(err.message,"realdata/decoderealdata");
    }
}
function localrowbysensorid(asensorid){
    var isfinded=false;
    //initchartoption();
    //isfirst=true;
    //decoderealdata(null,asensorid,true);//是否可以用其他函数代替（定位到指定的当前行）
    //btn_refresh_click();
    $table = document.getElementById('realdata-tbody');
    let tablehead_len=$table.rows.length;
    for (var int = 0; int < tablehead_len; int++) {
        if ($table.rows[int].cells[0].innerHTML == (asensorid+"")) {
            sessionStorage.t_p = int;
            var row=$table.rows[int];
            tableclick(row);
            var heightpx = $("#realdata-tbody tr").height();// + 1;//加1是网格线的宽度
            var ppt = +sessionStorage.t_p;
            /*if(ppt>pageSize){
                curPage=parseInt(ppt/pageSize);
            }else{
                curPage=0;
            }*/
            $("#datadiv").scrollTop((ppt) * heightpx);
            gethistorydata(asensorid,catalog,typename, kssj, jssj, 1);
            isfinded=true;
            break;  
        }
    }
    if(!isfinded&&!isfirst)//
        showmsg("没有符合条件的实时数据", info_showtime);/*/**/
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
            if(!chart_unit || chart_unit=="度")
                chart_unit = "℃"
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
                chart_unit = "dB";
            chartOption.chart_sigle = ""
            colors = [[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']];
            break;
        default:
            //if(!chartOption.chart_min)
                chartOption.chart_min = 0;
            //if(!chartOption.chart_max)
                chartOption.chart_max = 100;
            //if(!chart_unit)
                chart_unit = "";
            chartOption.chart_sigle = ""
            colors = [[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']];
    }
}
function tableclick(tr,isloadmain) {
    $(tr).siblings("tr[backgroundColor!='#ff0']").css("background", "");
    $(tr).css("background", color_table_cur);//区分选中行
    sessionStorage.t_p = tr.rowIndex - 1;
    sname = tr.cells[1].innerHTML;
    //chartOption.chart_type = tr.cells[tr.cells.length-2].innerHTML;
    updatachart(typename);
    if(title_index!=-1)
        value0 = parseFloat(tr.cells[title_index].innerHTML).toFixed(Number_of_decimal);
    //value1=parseFloat(tr.cells[3].innerHTML);
    //if (parseInt(tr.cells[0].innerHTML) != sessionStorage.SensorId) {
        sessionStorage.SensorId = parseInt(tr.cells[0].innerHTML);
        sessionStorage.sel_id=sessionStorage.SensorId;
        //var kssj = getCurrentDate(1) + " 00:00:00";
        var jssj = dateToString((new Date(getCurrentDate(2))).getTime()+60000*1,2);
        var yesterdaytime= (new Date(jssj))-(1000*60*60*24);
        var kssj=dateToString((yesterdaytime),2);
        //kssj = (tr.cells[2].innerHTML).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
        //jssj = (tr.cells[2].innerHTML);
        myChart2.showLoading();
        gethistorydata(sessionStorage.SensorId,catalog,typename, kssj, jssj, 1);
        if (isloadmain)
        window.parent.treelocationforsensorid(sessionStorage.SensorId);
    //}
    //maxval=0;
    refreshData();
    //moduletable("realdata-tbody");
    //btn_refresh_click();
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
                //fontStyle: "normal",
                fontWeight: 'normal',
                fontSize:chartOption.chart_detail_font_size,
            },
            text: sname+"--24h 极值",
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
                name: '24h 极值',
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
                        color: colors,//[[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']],
                        width: 30,
                        /*shadowColor: 'yellow', //默认透明
                        shadowOffsetX:2,
                        shadowBlur: 10*/
                    }
                },
                axisTick: { // 坐标轴小标记
                    distance: -29,
                    show: true,
                    splitNumber: chartOption.chart_chi_num,
                    length:10,
                    lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 1.5,
                        color: '#fff',
                        //shadowColor: '#fff', //默认透明
                        //shadowBlur: 10
                    }
                },
                axisLabel: {
                    distance:-38,//采用echarts5.0以上，此值为-10，采用V4.6.0以下版本，此值为-45，此时标签正好在园的外围，且数字显示完全。
                    textStyle: { // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10,
                        fontSize:chartOption.chart_detail_font_size,
                    },
                },
                splitLine: { // 分隔线
                    distance: -29,//与坐标轴的宽度取相对值
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
                    width: 6,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10,
                    length:'90%',
                },
                title: {
                    show: true,
                    offsetCenter: [0, '-30%'], // x, y，单位px
                    text: '24h 峰值',
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
    myChart.setOption(option);//24小时极值
    option1 = {
        backgroundColor: backgroudcolor,
        title: {
            //left: '40%',
            offsetCenter: ['200%', '0'],
            textStyle: {
                color: 'white',
                fontWeight: 'normal',
                fontSize: chartOption.chart_title_font_size,
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
                        color: colors,//[[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']],
                        width: 30,
                        /*shadowColor: 'yellow', //默认透明
                        shadowOffsetX:2,
                        shadowBlur: 10*/
                    }
                },
                axisTick: { // 坐标轴小标记
                    distance:-29,
                    show: true,
                    splitNumber: chartOption.chart_chi_num,
                    length:10,
                    lineStyle:{
                        color:"#fff",
                        width:1.5,
                    }
                },
                axisLabel: {
                    distance:-38,//采用echarts5.0以上，此值为-10，采用V4.6.0以下版本，此值为-45，此时标签正好在园的外围，且数字显示完全。
                    textStyle: { // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10,
                        fontSize:14,
                    },
                },
                splitLine: { // 分隔线
                    distance:-29,
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
                    width: 6,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 0,
                    length:'90%',
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
                    formatter: ' {value}  \n\n' + '发生时刻: ' +maxvaluetime+ '\n\n 标签名称: '+sname,//+chart_unit,
                    textStyle: {
                        fontSize: chartOption.chart_detail_font_size,
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
        //color:['#090','#f75','#055','#b00','#095','#f0f','#444'],
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
                fontWeight: 'normal',
                fontSize: chartOption.chart_title_font_size,
            },
        },

        series: [
            {
                name: '占比统计',
                type: 'pie',
                radius: ['20%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 5,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    formatter: '{b}: {c}\n\n  {{d}%}  ',
                    show: true,
                    position: 'outer',
                    color:"#fff",
                    alignTo: 'edge',
                    edgeDistance: 10,
                    //bleedMargin: 15,
                    margin: 20
                },
                //barWidth: '60%', []
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '16',
                        //fontWeight: 'bold'
                    }
                },/*
                labelLine: {
                    show: true
                },*/
                data: []//,,{value:90,name:'告警'},{value:0,name:"严重告警"} 
                    //{value:30,name:'故障'},{value: 20,name: '停运'}]{value:310,name:'正常'}, {value:52,name:'预警'},{value:20,name:'一级告警'} ,
                    //{value:34,name:'二级告警'}
            }
        ]
    };
    myChart3.setOption(option3);
    myChart3.on('click',function(params){//点击事件
        console.log(params);
    });
    option4 = {
        backgroundColor: backgroudcolor,
        title: {
            //left: '40%',
            offsetCenter: ['200%', '0'],
            textStyle: {
                color: 'white',
                fontWeight: 'normal',
                fontSize:14,
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
                //startAngle: 315,//起始角度
                //endAngle: 225,//终止角度
                splitNumber: chartOption.chart_main_num,//
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [0.2, 'green'],
                            [1, '#1f1f1f']
                        ],
                        color: colors,//[[0.2, '#1e90ff'], [0.8, '#090'], [1, '#ff4500']],
                        width: 30,
                        /* shadowColor: 'yellow', //默认透明
                         shadowOffsetX:2,
                         shadowBlur: 10*/
                    }
                },
                axisTick: { // 坐标轴小标记
                    show: true,
                    splitNumber: chartOption.chart_chi_num,
                    length:10,
                    distance: -29,
                    lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 1.5,
                        color: '#fff',
                        //shadowColor: '#fff', //默认透明
                        //shadowBlur: 10,
                    }
                },
                axisLabel: {
                    distance:-38,//采用echarts5.0以上，此值为-10，采用V4.6.0以下版本，此值为-45，此时标签正好在园的外围，且数字显示完全。
                    textStyle: { // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        //shadowColor: '#fff', //默认透明
                        //shadowBlur: 10,
                        fontSize:14,
                    },
                },
                splitLine: { // 分隔线
                    distance: -29,
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
                    width: 6,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10,
                    length:"90%",
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

}
//window.setInterval("getrealdatabynodeid(-1)",60000);
function refreshData() {
    //var myChart = echarts.init(document.getElementById('realdata_gaugechart'));
    if (chartOption.chart_type == "pd") {
        option.series[0].data[0].value = minvalue
    } else {
        option.series[0].data[0].value = maxvalue;
    }
    val1 = eval("value" + 0);
    //option.series[0].data[0].value = maxvalue;
    option.series[0].max = chartOption.chart_max;
    option.series[0].min = chartOption.chart_min;
    option.series[0].splitNumber=chartOption.chart_main_num;
    option.series[0].axisLine.lineStyle.color=colors;
    option.series[0].axisTick.splitNumber=chartOption.chart_chi_num;
    value = option.series[0].data[0].value;
    option.series[0].detail.formatter = chartOption.chart_sigle + value + ' \n\n' +"时间："+happentime;//+chart_unit;
    option.series[0].data[0].name = chart_unit;//sname;
    option.title.text = sname+":  "+titlename+" 24h 峰值";
    /*for (var i = 0; i < option.series.length; i++) {
        option.series[i].axisLine.lineStyle.color = colors;
        option.series[i].max = chart_max;
        option.series[i].min = chartOption.chart_min;
        value = option.series[i].data[0].value;
        option.series[i].detail.formatter = chartOption.chart_sigle + value + ': \n\n' + option.series[i].name + ' ';//+chart_unit;
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
    option4.series[0].max = chartOption.chart_max;
    option4.series[0].min = chartOption.chart_min;
    option4.series[0].splitNumber=chartOption.chart_main_num;
    option4.series[0].axisLine.lineStyle.color=colors;
    option4.series[0].axisTick.splitNumber=chartOption.chart_chi_num;
    value = option4.series[0].data[0].value;
    option4.series[0].detail.formatter = chartOption.chart_sigle + value + ' \n\n' + option4.series[0].name + ' ';//+chart_unit;
    option4.series[0].data[0].name = chart_unit;//sname;
    option4.title.text = sname+" : "+titlename;
    myChart4.setOption(option4);
    option1.series[0].data[0].value= maxOfRealdata.toFixed(Number_of_decimal);//54.321;
    option1.series[0].detail.formatter=maxOfRealdata.toFixed(Number_of_decimal)+ '\n\n标签名称: '+maxOfRealdataName;//实时极值的标签名称,"发生时刻:"+maxvaluetime+
    option1.series[0].max = chartOption.chart_max;
    option1.series[0].min = chartOption.chart_min;
    option1.series[0].splitNumber=chartOption.chart_main_num;
    option1.series[0].axisLine.lineStyle.color=colors;
    option1.series[0].axisTick.splitNumber=chartOption.chart_chi_num;
    option1.series[0].data[0].name = chart_unit;//sname;
    option1.title.text="实时极值: "+titlename;
    myChart1.setOption(option1);
    var ratArr=[];//,str_name=""
    //var keys=Object.keys(alert_obj);
    for(let key in alert_obj){
        //console.log(key + '---' + alert_obj[key])
        if(alert_obj[key]!=0){
            ratArr.push({name:key,value:alert_obj[key]});
        }
    }
    option3.series[0].data=ratArr;
    myChart3.setOption(option3);
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
    happentime=dateToString(obj_chartdata[0].time,2);//发生时刻
    let chartdata_len=obj_chartdata.length;
    for (var i = 0; i < chartdata_len; i++) {
        //if((obj_chartdata[i].time).replace(/T/g," ").substring(0,19)>=zero)//取当天零点以后的值，obj_chartdata保存24小时以内的值
            pa.push([Date.parse(obj_chartdata[i].time), obj_chartdata[i].value, i]);
        //pb.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value/1.5, i])
        //pc.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value/2, i])
        if (parseFloat(obj_chartdata[i].value) > maxval) {
            maxval = obj_chartdata[i].value;
            happentime=dateToString(obj_chartdata[i].time,2);
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
    //decoderealdata();//进行一次实时数据刷新，完善图表的指示内容；
    //绘制图形线条
    function drawchart() {
        //var myChart = echarts.init(document.getElementById('main'));
        var lengenddata1 = [];
        lengenddata1.push(titlename);//20200518
        var option2 = {
            color: ['#FF0000', '#FFFF00'],//,'#00ff00'
            backgroundColor: '#d0d0d0',
            title: {
                text: sname+" "+titlename+' : 24h 变化趋势图',//20200518
                x: "center",
                textStyle: {
                    fontWeight: 'normal',
                    fontSize:chartOption.chart_title_font_size,
                }
            },/**/
            tooltip: {
                trigger: 'item',
                //trigger: 'axis',
                formatter: function (params) {
                    if(params.seriesId){
                    var date = new Date(params.value[0]);
                    data = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
                    return data + '<br/>' + params.value[1];
                    }
                }/**/
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
                        optionToContent: function (opt) {
                            //let axisData = opt.xAxis[0].data; //坐标数据
                            let series = opt.series; //折线图数据
                            let tdHeads = '<td  >时间</td>'; //表头
                            let tdBodys = ''; //数据
                            series.forEach(function (item) {
                                //组装表头
                                tdHeads += `<td >${item.name}</td>`;
                            });
                            let table = `<table border="1" ><tbody><tr>${tdHeads} </tr>`;
                            let series_data_len=series[0].data.length;
                            for (let i = 0, l = series_data_len; i < l; i++) {
                                //for (let j = 0; j < series.length; j++) {
                                    //组装表数据
                                    strtime=dateToString((series[0].data[i][0]),2);
                                    tdBodys += `<td>${ series[0].data[i][1]}</td>`;
                                //}
                                table += `<tr><td >${strtime}</td>${tdBodys}</tr>`;
                                tdBodys = '';
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
                symbolSize: 3,
                data: pa,
                markPoint: {
                    symbol: 'arrow',
                    color: 'blue',
                    symbolSize:15,
                    data: [
                        {type: 'max', name: '最大值',symbolRotate:-180},
                        {type: 'min', name: '最小值', label:{position:'bottom',}}
                    ],
                    itemStyle:{
                        color: 'rgb(0,144,0)',
                    },
                    label:{
                        position: 'top',
                        color:'rgb(0,0,0)',
                        fontSize: 14,
                    }
                },
                /*markLine:{
                    data: [
                        //{type: 'average', name: '平均值'},
                        [{
                            symbol: 'none',
                            x: '90%',
                            yAxis: 'max'
                        }, {
                            symbol: 'circle',
                            label: {
                                position: 'start',
                                formatter: '最大值'
                            },
                            type: 'max',
                            name: '最高点'
                        }
                    ],
                    [{
                        symbol: 'none',
                        x: '90%',
                        yAxis: 'min'
                    }, {
                        symbol: 'circle',
                        label: {
                            position: 'start',
                            formatter: '最小值'
                        },
                        type: 'min',
                        name: '最低点'
                    }
                ],
                    ]
                },*/
                smooth: true,//平滑曲线
                smoothMonotone: 'x',
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
    }catch(err){
        showstateinfo(err.message.message,"realdata/decodedatas");
    }
}
/*function display() {
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
        showmsg("请输入正整数", info_showtime);
        return;
    }
    if (curPage > page) {
        showmsg("超出数据页面", info_showtime);
        return;
    }
    direct = 0;
    displayPage();
}
function setPageSize() {    // 设置每页显示多少条记录
    pageSize = document.getElementById("pageSize").value;    //每页显示的记录条数
    if (!/^[1-9]\d*$/.test(pageSize)) {
        showmsg("请输入正整数", info_showtime);
        return;
    }
    //len = $table.rows.length; //- 1;
    page = len % pageSize == 0 ? len / pageSize : Math.floor(len / pageSize) + 1;//根据记录条数，计算页数
    curPage = 1;        //当前页
    direct = 0;        //方向
    firstPage();
    displayPage();
}
function displayPage() {
    
    if (curPage <= 1 && direct == -1) {
        direct = 0;
        showmsg("已经是第一页了", info_showtime);
        //return;
    } else if (curPage >= page && direct == 1) {
        direct = 0;
        showmsg("已经是最后一页了", info_showtime);
        //return;
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
    /*$table.find("tr").hide();    // 首先，设置这行为隐藏即既概
    $table.find("tr").each(function(i){    // 然后，通过条件判断决定本行是否恢复显示
        if((i>=begin && i<=end) )//显示begin<=x<=end的记录
            $(this).show();
    });
}*/

function jisuanyichangbili(avalue){//一个标签有多个类型的数据报警时，告警类型的统计可能有问题，有待验证。
    if(!avalue){
        avalue="正常";
    }
    if(alert_obj.hasOwnProperty(avalue)){
        alert_obj[avalue]++;
    }else{
        alert_obj[avalue]=1;
    }
    /*
    //if(avalue>alertconfig[3]){
    //    alertcount[4]++;
    //}else if(avalue>alertconfig[2]){
    //    alertcount[3]++;
    //}else 
    if(avalue>alertconfig[1]){
        alertcount[2]++;
    }else if(avalue<alertconfig[0]){
        alertcount[1]++;
    }else{
        alertcount[0]++;
    }*/
}
/**
 * 解决在首次登录今日实时数据页面时数据不立即显示的问题，标签名称添加上级名称，区分同名标签；
 * 状态统计添加图形序列的数值显示；
 * 数据列表项控制显示项添加folder属性，并进行页面级存储，在刷新时加载。同时可以在标签没有配置项时可以通过实时数据获取到其folder属性。1224
 * 数据列表显示控制函数合并（告警、设备、实时）
 * 解决在没有数据时的状态比例图形显示错误问题；
 * 2021
 * 解决原来数值不能进行倒叙排序的问题。图表配置项页面保存
 * 
 * 解析实时数据时对标签选项的匹配做优化，减少循环次数提高运行效率。分页的每页最大行数进行页面级保存。添加刷新时重新定位到当前选定的行所在的页和行。
 * 解决由于从页面取值为字符类型而设置分页长度失败的问题。
 * 
 * 更新图形绑定标签格式以及告警信息列表的数据更新，根据配置确定仪表盘图形的刻度线数量；解决采集器数据为空时实时极值显示NaN的问题；
 * 
 * 实时数据列表点击后要与标签树形菜单进行同步对应选择（标签进行选择和滚动定位）（比较耗时）
 * 
 * 异常统计，采用告警信息作为标准，对象形式进行统计；
 * 仪表盘图形的分段显示因图而异的功能，以及图形标题字体字号的跳转，长标题可以显示完全。
 * 
 * 24h趋势图形中的起止时间与选定标签实时列表不一致的问题（总是取实时数据的最后一个数据的时间，应与选定标签的id进行匹配取值）；
 * 以及退出后重新登录，实时数据不显示的问题0205
 * 
 * 首次进入标签定位树形图和实时数据列表选定行同步。
 * 
 * 标签项目录点击没有当前项的指示、编辑通用多页面显示布局的主页面框架布局
 */
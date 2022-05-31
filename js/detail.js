/**以组为单位显示标签实时数据和图片指示 
 * 分组名称添加按名称排序功能；标签列表添加点击世界与图形的匹配关系；数据列表（table）的列排序过程，
 * 将数值列和字符串列分开排序，避免数值也按字符顺序排序造成的混乱，图形添加名称指示项。蓬勃 磅礴 滂沱 撺掇 
 */
var list_group=$("#ul_group");
var sen_id=parseInt(sessionStorage.sensorId);//此处sensorId首字母为小写。只在分组显示相关操作使用 realdata.js,detail.js,initdrawmap.js,realdata_iot.js
var js_sensors=JSON.parse(localStorage.getItem("sensor_tree"));
var sa=[];
var chartOption={};
var type_td="",group_name="";
var sensors,allsensors;
var allconfigs;
const c_no=0,c_id=6,c_name=1,c_val=2,c_time=3,c_mes=4,c_statu=5;
var compare = function (obj1, obj2) {
    if(obj1 && obj2){
        var val1 = obj1.value.name;
        var val2 = obj2.value.name;
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}
$(function(){
    initpage();
    function initpage(){
        sessionStorage.framepage="detail.html";
        sessionStorage.pageindex=21;
        window.parent.document.getElementById("tree").style.pointerEvents ="none";
        try{
        allsensors=JSON.parse(localStorage.getItem("sensors"));
        allconfigs=JSON.parse(localStorage.Config);
        }catch(err){}
        list_group.empty();
        sa=findsensorbyid(js_sensors,sen_id);
        sa.sort(compare);
        if(sa!=null){
            for(var i=0;i<sa.length;i++){
                var btn=document.createElement("button");
                btn.setAttribute("value",sa[i].value.id);
                btn.setAttribute("style","width:70%;height:30px;background-color:rgba(8, 177, 106, 0.2);");
                btn.setAttribute("class","btn_group");
                btn.setAttribute("onclick","refreshgroup("+i+")");
                group_name=sa[i].value.name;
                btn.innerHTML=group_name;
                list_group[0].appendChild(btn);
                if(sa[i].value.id==sen_id){
                    btn.onclick();
                }
            }
        };
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
        //window.parent.getrealdatabynodeid(-1);
    }
    function findsensorbyid(obj,sid,p){
        var a=null;
        for(var json in obj){
            if(obj[json].value.id==sid){
                if(obj[json].value.parentId==-1){
                    if(p=="p"){//是根目录并且是否是进行二次验证目录
                        return a= obj;
                    }else{
                        if(isgroup(obj[json].children)){//是根目录而非验证目录，有子目录
                            return a=obj[json].children;
                        }else{
                            return a=obj;//没有子目录，取上一级。
                        }
                    }
                }else if(obj[json].children.length>0){//非根目录而有子目录
                    return a=obj
                }else{//非根目录，而没有子目录，取其父目录进行二次验证。
                    var p_id=obj[json].value.parentId;
                    sen_id=p_id;
                    a=findsensorbyid(js_sensors,p_id,"p");
                }
                if(a!=null)
                    return a;
                break;
            }else{//对子目录标签进行对比。
                if(obj[json].children.length>0){
                    var ja_json=obj[json].children;
                    a=findsensorbyid(ja_json,sid);
                }
            }
            if(a!=null)//找到即返回。
                return a;
        }
        return a;
    }
    function isgroup(asensors){
        var temp=false;
        if(asensors!=null)
        for(var j=0;j<asensors.length;j++){
            if(asensors[j].children.length>0){
                temp= true;
                break;
            }
        }
        return temp;
    }
});
function initchartoption(){//初始化图表选择和显示值；
    chartOption={chart_title:"",chart_unit:"",chart_max:100,chart_min:0,chart_sigle:"",child_classname:"",
                 chart_main_num:4,chart_chi_num:8,chart_detail_font_size:16,chart_title_font_size:16,
                 start_angle:0,end_angle:180};
    //maxval =  minval =  maxvalue =minvalue = value0=maxOfRealdata=0;
    //alert_obj={};//状态统计对象
    //sname=maxOfRealdataName=maxvaluetime=happentime="";//图表的标签名称、最大值标签名称、最大值发生时间、24h极值发生时刻，maxvaluetime暂时未使用。
}
function refreshgroup(sid){
    var btn_group=$("#ul_group");
    for(var i=0;i<btn_group[0].children.length;i++){
        if(i==sid){
            btn_group[0].children[i].attributes.style.value="width:70%;height:30px;background-color:rgba(8, 177, 106, 0.2);border-color:rgba(8, 8, 106, 0.8)";
            group_name=btn_group[0].children[i].innerHTML;
        }else{
            btn_group[0].children[i].attributes.style.value="width:70%;height:30px;background-color:rgba(8, 177, 106, 0.2);";
        }
    }
    if(sa[sid].children.length>0){
        sensors=sa[sid].children;
    }else{
        sensors=[sa[sid]];
    }
    sensors.sort(compare);
    window.parent.getrealdatabynodeid(-1);
    refreshpicture(sid)//,sensors
    showAllSensors(sensors);
    
}
function showAllSensors(sensors){
    //var parentid=-1,parentname="";
    //sensors = JSON.parse(localStorage.getItem("sensors"));
    $('#detail_realdata_tbody').empty();
    $table = document.getElementById('detail_realdata_tbody');
    //添加所有的标签项
    if(sensors!=null){
        sensors_length=sensors.length
        for(var i=0;i<sensors_length;i++){
            //var tr=document.createElement("tr");
            //tr.setAttribute("onclick","tableclick(this)");
            /*var td_did=document.createElement("td");
            td_did.innerHTML=sensors[i].id;
            if(sensors[i].value.parentId=="-1"){
                parentname="";
            }else if(sensors[i].value.parentId!=parentid){
                parentid=sensors[i].value.parentId;
                for(var j=0;j<sensors.length;j++){
                    if(sensors[j].id==parentid){
                        parentname=sensors[j].value.name;
                        break;
                    }
                }
            }*/
            atr=document.createElement("tr");
            atr.setAttribute("onclick", "tableclick(this,true)");//ondblclick
            for(var k=0;k<7;k++){//tablehead_len
                var atd=document.createElement("td");
                atd.setAttribute("height","30px");
                //atd.innerHTML= "&nbsp;";
                atr.appendChild(atd);
            }
            value = ""; (Math.random() * 30 + 5).toFixed(Number_of_decimal);//模拟随机数
            atr.cells[c_no].innerHTML=i+1;//序号从1开始
            atr.cells[c_id].innerHTML=sensors[i].value.id;//标签id
            atr.cells[c_id].style.cssText="display:none";
            //atr.cells[1].innerHTML=sensors[i].id;
            atr.cells[c_name].innerHTML=sensors[i].value.name;//第三列添加标签名称，
            atr.cells[c_val].style.cssText="padding-left:5px;";//text-align:left
            atr.cells[c_val].innerHTML=value;// style.cssText="display:none";
            atr.cells[c_statu].innerHTML="";//parentname;运行
            //if(parseInt(jfjk_base_config.realdatashowmodle))
            //    atr.style="display:none;"
            $table.appendChild(atr);//we are famly
            if(i==0)
            appenddisplaytype(sensors[i].value.id);
        }
        refreshData();
        
    }
}
function sumtotal(){//对列表中的数据进行简单统计分析
    var iyunxing=0,igaojing=0,max="",min="",addr_max="",addr_min="";
    $table = document.getElementById('detail_realdata_tbody');
    let total=$table.rows.length;
    if(total>0){
        if(isNumber($table.rows[0].cells[c_val].innerHTML)){
            max=min=parseFloat($table.rows[0].cells[c_val].innerHTML);
        }
        for (var int = 0; int < total; int++) {
            if(isNumber($table.rows[int].cells[c_val].innerHTML)){
                if(max==""){max=parseFloat(parseFloat($table.rows[int].cells[c_val].innerHTML).toFixed(Number_of_decimal))}
                if(max<parseFloat(parseFloat($table.rows[int].cells[c_val].innerHTML).toFixed(Number_of_decimal))){
                    max=parseFloat(parseFloat($table.rows[int].cells[c_val].innerHTML).toFixed(Number_of_decimal));
                    addr_max=$table.rows[int].cells[c_name].innerHTML;
                }
                if(min==""){min=parseFloat(parseFloat($table.rows[int].cells[c_val].innerHTML).toFixed(Number_of_decimal))}
                if(min>parseFloat(parseFloat($table.rows[int].cells[c_val].innerHTML).toFixed(Number_of_decimal))){
                    min=parseFloat(parseFloat($table.rows[int].cells[c_val].innerHTML).toFixed(Number_of_decimal));
                    addr_min=$table.rows[int].cells[c_name].innerHTML;
                }
            }
            if($table.rows[int].cells[c_statu].innerText=="运行"){
                iyunxing++;
                if($table.rows[int].cells[c_mes].innerText!="" && $table.rows[int].cells[c_mes].innerText!=null){
                    igaojing++;
                }
            }
        }
    }//
    $("#total").text(total);
    $("#yunxing").text(iyunxing);
    $("#normal").text(iyunxing-igaojing);
    $("#warning").text(igaojing);
    //$("#outline").text(total-iyunxing);
    if(!max){max="-";}
    if(!min){min="-";}
    $("#max").text(max);
    $("#min").text(min);
    $("#addr_max").text(addr_max);
    $("#addr_min").text(addr_min);
}
function tableclick(tr,isloadmain) {
    $(tr).siblings("tr[backgroundColor!='#ff0']").css("background", "");
    sessionStorage.sel_id = tr.rowIndex - 1;
    if (parseInt(tr.cells[c_id].innerHTML) != sessionStorage.sensorId) {
        sessionStorage.sensorId = parseInt(tr.cells[c_id].innerHTML);
        sessionStorage.SensorId=sessionStorage.sensorId;
        sessionStorage.sel_id=sessionStorage.sensorId;//
    }
    //if (isloadmain)
    //    window.parent.treelocationforsensorid(sessionStorage.SensorId);
    refreshpicture(tr.rowIndex,tr.cells[c_name].innerHTML);
    $(tr).css("background", color_table_cur);//区分选中行
    
}
function refreshpicture(aid,asensors){
    //type=sa[aid].value.type;//[id,parentId,nodeId,type,address,company=null,serial=null,config,location=null,name,time,]
    if(!asensors){
       asensors="";
    }else{
        asensors="_"+asensors;
    }
    $("#pic_name").text(group_name+asensors);
    aid=(aid % 3)+1;//以后要与后台对应关联，此时采用模拟变换。
    var path='';//"/res/kgg"+aid+".jpg";//kgg  dlxl
    $("#img1").attr('src',path); 
}
function refreshData(){//刷新数据内容，由主页面根据实时数据的页面索引来调用。
    $table = document.getElementById('detail_realdata_tbody');
    try{
    var arrdata=JSON.parse(localStorage.getItem("realdata"));
    }catch(err){

    }
    var realdatafolder;
    var sid=-1;
    var tab_rows_len=$table.rows.length;
    var titlename="";
    var tj=true;
    if(arrdata){
        var data_len=arrdata.length;
        for(var l=0;l<tab_rows_len;l++){
            for(var j=0;j<data_len;j++){
                obj_data=arrdata[j];
                realdatafolder=obj_data.folder;
                tj=true;
                if(sessionStorage.pageindex==2)
                    tj=(obj_data.name.toLowerCase()==sessionStorage.typename.toLowerCase());
                if(parseInt($table.rows[l].cells[c_id].innerHTML)==parseInt(obj_data.sensorId) && tj){    
                    if( obj_data.name==dname){
                        titlename=realdatafolder+concat_str+obj_data.name;
                        var sid=parseInt($table.rows[l].cells[c_id].innerHTML);
                        if (sensors)//&&isnew
                        for (var i = 0; i < sensors.length; i++) {//是否在需要显示的标签列表中（本节点下的标签）
                            //isfind=false;
                            if(sid==sensors[i].value.id){
                                let sensor_obj = sensors[i].value;
                                type_td = sensor_obj.type;//Catalog;//   
                                //sname = sensor_obj.name;
                                /*if(sensor_obj.parentId!="-1"){  
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
                                }*/
                                //sname=parentname+"_"+sname; 
                                //isfind=true;
                                //haverealdata=true;
                                break;
                            }
                        }
                        if(getCatalog(type_td,realdatafolder,obj_data.name).chart_title)
                            titlename=getCatalog(type_td,realdatafolder, obj_data.name).chart_title;
                        if(chartOption.child_classname=="UHFdata"){
                            var storagename=sid+"_"+titlename;
                            localStorage[storagename]=base64ToArrayBuffer(obj_data.value);
                            obj_data.value='<a onclick="openmodal(\''+storagename+'\')" data-toggle="modal" data-target="#myModal">'+obj_data.value.substring(0,5)+'\>\>\></a>';
                        }
                        let str_hh=''
                        if(isNumber(obj_data.value)){
                            str_hh=(obj_data.value*1).toFixed(Number_of_decimal);
                        }else{
                            str_hh=obj_data.value;// $table.rows[l].cells[2].innerHTML;
                        }
                        /*if(!str_hh){
                            str_hh=titlename+" : "+ obj_data.value+" "+chartOption.chart_unit;
                        }else if(str_hh.indexOf(titlename+" : ")!=-1){
                            exp_str=str_hh.substring(str_hh.indexOf(titlename),(str_hh.indexOf("<br>",str_hh.indexOf(titlename))+4));
                            str_hh.replace(exp_str,titlename+" : "+obj_data.value+" "+chartOption.chart_unit);
                        }else{
                            str_hh=str_hh+"<br>"+
                            titlename+" : "+ obj_data.value+" "+chartOption.chart_unit;
                        }*/
                        $table.rows[l].cells[c_val].innerHTML=str_hh;
                        //isbreak=true;
                        if(!$table.rows[l].cells[c_time].value || ($table.rows[l].cells[c_time].value<dateToString(obj_data.time,2))){//更新最新时间
                            $table.rows[l].cells[c_time].innerHTML=dateToString(obj_data.time,2).substring(10,19);
                            $table.rows[l].cells[c_time].value=dateToString(obj_data.time,2);
                        }/**/
                        if(obj_data.message){
                            //atr.cells[k+hidden_cells].style.backgroundColor="#ffff00";
                            if($table.rows[l].cells[c_mes].innerHTML&&($table.rows[l].cells[c_mes].innerHTML.indexOf(obj_data.message)<0)){
                                $table.rows[l].cells[c_mes].innerHTML+=";"+obj_data.message;
                            }else{
                                $table.rows[l].cells[c_mes].innerHTML=obj_data.message;
                            }
                        }
                        $table.rows[l].cells[c_statu].innerHTML='运行';//obj_data.folder;
                        $table.rows[l].style="";
                        break;
                    }
                }
            }
        }
        //var heightpx = $("#detail_realdata_tbody tr").height();// + 1;//加1是网格线的宽度
        for (var int = 0; int < tab_rows_len; int++) {
            if ($table.rows[int].cells[c_id].innerHTML == sessionStorage.sensorId) {
                sessionStorage.t_p = int;
                var ppt = parseInt(sessionStorage.t_p);
                var divheight=$("#datadiv").height();
                if(($table.rows[int].offsetTop)>(divheight)){
                    $("#datadiv").scrollTop($table.rows[int].offsetTop-35);//表格重新滚动定位到选定的行datadiv为table的上级div的id；
                }else{
                    $("#datadiv").scrollTop(0)
                }
                $table.rows[ppt].style.backgroundColor = color_table_cur;
                break;
            }
        }
    }else{
        showstateinfo("本次获取实时数据为空","realdata_detail");
    }
    sumtotal();
}
//
//根据数据列值获取Catalog。
//
//
function getCatalog(atype,afolder,aname){
    try{
        initchartoption();//数据配置信息和单位信息初始化（更新）
        try{
        allconfigs=JSON.parse(localStorage.Config);
        }catch(err){
            
        }
        //return catalog;
        if(allconfigs){
            for(var q in allconfigs){
                if(allconfigs[q].type===atype)
                for(var l in allconfigs[q].details){
                    if(allconfigs[q].details[l].name.toLowerCase()==aname.toLowerCase()&&(allconfigs[q].details[l].folder==afolder)){
                        chartOption.chart_title=allconfigs[q].details[l].desc;
                        if(!jQuery.isEmptyObject(allconfigs[q].details)){
                            var d_config=allconfigs[q].details; //20200918 获取配置项参数 由allconfigs（typeconfigs）的details里的name找到typename，然后取其
                            for(var i in d_config){            //name,由name到configs里查找name，找到后从其details里提取config，然后从config中提取所需的配置数值。
                                if((d_config[i].name.toLowerCase()==aname.toLowerCase())&&((d_config[i].details))){
                                    for(var detail in d_config[i].details){
                                        switch(d_config[i].details[detail].name.toLowerCase()){
                                            case "Type".toLowerCase():
                                                chartOption.child_classname=d_config[i].details[detail].value;
                                                break;
                                            case "Unit".toLowerCase():
                                                chartOption.chart_unit=d_config[i].details[detail].value;
                                                break;
                                            case "Top".toLowerCase():
                                                chartOption.chart_max=d_config[i].details[detail].value;
                                                break;
                                            case "Bot".toLowerCase():
                                                chartOption.chart_min=d_config[i].details[detail].value;
                                                break;
                                        }
                                    }
                                    /*if((chartOption.chart_max-chartOption.chart_min)%10==0){
                                        chartOption.chart_main_num=4;
                                        chartOption.chart_chi_num=8;// 
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
                }
            }
        }
        //catalog=catalogsel[index].attributes.folder.nodeValue;
        if(chartOption.chart_unit==null ||chartOption.chart_unit==undefined)
            chartOption.chart_unit="";
        return chartOption;
    }catch(err){
        showstateinfo(err.message,"detail/getCatalog")
    }
}
function appenddisplaytype(element_id,time){
    try{
        var lcatalog="",ldname="";
        var display_type=document.getElementById("display_type")
        for(var i=display_type.childElementCount;i>0;i--)
        display_type.removeChild(display_type.childNodes[i]);
        initconfigOption();
        if(element_id>=0){
            if(allsensors){
            let sensors_len=allsensors.length;
            for(var k=0;k<sensors_len;k++){
                if(allsensors[k].Value.id==element_id){
                    scatalog=allsensors[k].Value.type;//catalog;//读取对应的Catalog项1
                    if(scatalog)
                        scatalog=scatalog.toLowerCase();
                    break;
                }
            }}
            if(allconfigs){
                let configs_len=allconfigs.length;
                for(var i=0;i<configs_len;i++){
                    if((allconfigs[i].type.toLowerCase()==scatalog)){//&&(configs.hasOwnProperty(scatalog))){//检查配置中是否有catalog项
                        var s_des=allconfigs[i].details;//如果有，读取其所有配置项
                        var inside=false;
                        for(var p in s_des){
                            var lab=document.createElement("label");
                            ldname=s_des[p].name;//Name
                            lcatalog=s_des[p].folder;//Catalog; //not type
                            tname=s_des[p].desc;//20201023
                            /*if(!jQuery.isEmptyObject(s_des[p].details)){
                                for(var detail in s_des[p].details){
                                    switch(s_des[p].details[detail].name.toLowerCase()){
                                        case "Type".toLowerCase():
                                            configOption.childclassname=s_des[p].details[detail].value;
                                            break;
                                        case "Unit".toLowerCase():
                                            configOption.unit=s_des[p].details[detail].value;
                                            break;
                                        case "Top".toLowerCase():
                                            configOption.maxvalue=s_des[p].details[detail].value;
                                            break;
                                        case "Bot".toLowerCase():
                                            configOption.minvalue=s_des[p].details[detail].value;
                                            break;
                                    }
                                }
                            }*/
                            lab.innerHTML='<input class="catalog" type="radio" name="options" childtype="'+configOption.childclassname+'" folder="'+lcatalog+'" value="'+ldname+'" >'+tname;
                            if(sessionStorage.datatype){
                                if(s_des[p].name==sessionStorage.datatype){//如果有原先的选择
                                    lab.className="btn btn-primary active";
                                    dname=ldname;
                                    catalog=lcatalog;
                                    childclassname=configOption.childclassname;
                                    inside=true;
                                }else{
                                    lab.className="btn btn-primary";
                                }
                            }else{ //没有选择项，则默认为第一项
                                if(p==0){
                                    lab.className="btn btn-primary active";
                                    dname=ldname;
                                    catalog=lcatalog;
                                }else{
                                    lab.className="btn btn-primary";
                                }
                            }
                            //lab.innerHTML=s_des[p].Desc;
                            display_type.appendChild(lab);
                        }
                        if(!inside && sessionStorage.datatype){
                            display_type.childNodes[1].className="btn btn-primary active";
                            dname=display_type.children[0].children[0].defaultValue;
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
            if(dname!=eobj.val()){//判断显示数据类型是否发生改变，改变在清除，未改变则不动作。20210817
                dname= eobj.val();
                tname= eobj[0].parentNode.innerText;
                sessionStorage.datatype=dname;//保存选择项的值，用于页面刷新时恢复当前数据。
                catalog=eobj[0].getAttribute("folder");//getcatalog(dname);
                childclassname=eobj[0].getAttribute("childtype");
                clearvalue();//清除原来的数值
                //gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj, sessionStorage.jssj);
                //showAllSensors(sensors);
                window.parent.getrealdatabynodeid(-1);//获取所有实时数据，避免漏掉有关数据而造成错误显示20210817,取代refreshData。
                //refreshData();
            }
        });
    }catch(err){
        showstateinfo(err.message,"historydata/appenddisplaytype");
    }
}
function clearvalue(){//清除原来的数值
    $table = document.getElementById('detail_realdata_tbody');
    for(var i=0;i<$table.rows.length;i++){
        $table.rows[i].cells[c_val].innerHTML="";
    }
}
function openmodal(aname){
    var title=$("#bind_name");
    title.text(aname+": 数据详细内容")
    var detail=document.getElementById("details");
    detail.style="width:500px;height:500px;"
    var temp=(localStorage[aname].split(','));
    var float=[];
    var stemp="";
    for(var i=8;i<temp.length;i=i+4){
        float[(i/4)-2] = hex2float(bytesarraytofloat(temp,i)).toFixed(Number_of_decimal);
    //stemp+=float[(i/4)-2]+" ";
    }
    //detail.innerHTML=stemp;
    //var chartdiv=document.createElement("div");
    //chartdiv.setAttribute('style','width:300px;height:300px;')
    //var echarts = require('echarts');
    //require('echarts-gl');
    //var chartDom = document.getElementById('chartdiv');
    //chartDom.style="width:300px;height:300px;"
    var myChart = echarts.init(detail);
    var option;
    var seriesArray=[];
    // Parametric curve
    var float_len=float.length;
    var y=-1,x=-1;
    var series=new Object();
    series.type="line3D";
    series.lineStyle={width:4};
    var data = [];
    for (var t = 0; t < float_len; t ++) {
        var x = t % caiyangcishu;
        var z = float[t];
        if(y!=parseInt(t / caiyangcishu)){//采用变量浮动截取相对的周期和采样值。避免采用固定数值时数据的长短造成错误。
            var y =parseInt(t / caiyangcishu) ;//t + 2.0 * Math.sin(75 * t);
            data=[];
            series=new Object();
            series.type="line3D";
            series.lineStyle={width:4};
            data.push([x, y, z]);
            series.data=data;
            seriesArray.push(series);
        }else{
            data=series.data;
            data.push([x,y,z]);
            series.data=data;
        }
    }
    option = {
        tooltip: {},
        backgroundColor: '#fff',
        visualMap: {
            show: false,
            dimension: 2,
            min: 0,
            max: 30,
            inRange: {
                //color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
        },
        xAxis3D: {
            type: 'category'
        },
        yAxis3D: {
            type: 'category'
        },
        zAxis3D: {
            type: 'value'
        },
        grid3D: {
            viewControl: {
                projection: 'orthographic'
            }
        },
        series: seriesArray,/*[{
            type: 'line3D',
            data: data,
            lineStyle: {
                width: 4
            }
        }]*/
    };
    option && myChart.setOption(option);
    //detail.appendChild(chartdiv); 
}
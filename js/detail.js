/**以组为单位显示标签实时数据和图片指示 
 * 分组名称添加按名称排序功能；标签列表添加点击世界与图形的匹配关系；数据列表（table）的列排序过程，
 * 将数值列和字符串列分开排序，避免数值也按字符顺序排序造成的混乱，图形添加名称指示项。蓬勃 磅礴 滂沱 撺掇 
 */
var list_group=$("#ul_group");
var sen_id=parseInt(sessionStorage.sensorId);//此处sensorId首字母为小写。//飛
var js_sensors=JSON.parse(localStorage.getItem("sensor_tree"));
var sa=[];
var chartOption={};
var type_td="",group_name="";
var sensors;
var allconfigs;
$(function(){
    initpage();
    function initpage(){
        //sessionStorage.pageindex=21;
        list_group.empty();
        sa=findsensorbyid(js_sensors,sen_id);
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
        window.parent.getrealdatabynodeid(-1);
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
    showAllSensors(sensors);
    refreshpicture(sid)//,sensors
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
            for(var k=0;k<6;k++){//tablehead_len
                var atd=document.createElement("td");
                atd.setAttribute("height","30px");
                //atd.innerHTML= "&nbsp;";
                atr.appendChild(atd);
            }
            value =  (Math.random() * 30 + 5).toFixed(Number_of_decimal);//模拟随机数
            atr.cells[0].innerHTML=i;
            atr.cells[5].innerHTML=sensors[i].value.id;//标签id
            atr.cells[5].style.cssText="display:none";
            //atr.cells[1].innerHTML=sensors[i].id;
            atr.cells[1].innerHTML=sensors[i].value.name;//第三列添加标签名称，
            atr.cells[2].style.cssText="padding-left:5px;text-align:left";
            atr.cells[2].innerHTML=value;// style.cssText="display:none";
            atr.cells[3].innerHTML="运行";//parentname;
            //if(parseInt(jfjk_base_config.realdatashowmodle))
            //    atr.style="display:none;"
            $table.appendChild(atr);//we are famly
        }
        sumtotal();
    }
}
function sumtotal(){//对列表中的数据进行简单统计分析
    var iyunxing=0,igaojing=0,max=0,min=0,addr_max="",addr_min="";
    $table = document.getElementById('detail_realdata_tbody');
    let total=$table.rows.length;
    if(total>0){
        max=min=parseFloat($table.rows[0].cells[2].innerHTML);
        addr_min=addr_max=$table.rows[0].cells[1].innerHTML;
        for (var int = 0; int < total; int++) {
            if(max<parseFloat($table.rows[int].cells[2].innerHTML)){
                max=parseFloat($table.rows[int].cells[2].innerHTML);
                addr_max=$table.rows[int].cells[1].innerHTML;
            }
            if(min>parseFloat($table.rows[int].cells[2].innerHTML)){
                min=parseFloat($table.rows[int].cells[2].innerHTML);
                addr_min=$table.rows[int].cells[1].innerHTML;
            }
            if($table.rows[int].cells[3].innerText=="运行"){
                iyunxing++;
                if($table.rows[int].cells[4].innerText!="" && $table.rows[int].cells[4].innerText!=null){
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
    $("#max").text(max);
    $("#min").text(min);
    $("#addr_max").text(addr_max);
    $("#addr_min").text(addr_min);
}
function tableclick(tr,isloadmain) {
    $(tr).siblings("tr[backgroundColor!='#ff0']").css("background", "");
    sessionStorage.sel_id = tr.rowIndex - 1;
    if (parseInt(tr.cells[5].innerHTML) != sessionStorage.SensorId) {
        sessionStorage.SensorId = parseInt(tr.cells[5].innerHTML);
        sessionStorage.sel_id=sessionStorage.SensorId;
    }
    //if (isloadmain)
    //    window.parent.treelocationforsensorid(sessionStorage.SensorId);
    refreshpicture(tr.rowIndex,tr.cells[1].innerHTML);
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
    var path="/res/kgg"+aid+".jpg";//kgg  dlxl
    $("#img1").attr('src',path); 
}
function refreshData(){//刷新数据内容，由主页面根据实时数据的页面索引来调用。
    $table = document.getElementById('detail_realdata_tbody');
    var arrdata=JSON.parse(localStorage.getItem("realdata"));
    var realdatafolder;
    var sid=-1;
    var tab_rows_len=$table.rows.length;
    var titlename="";
    var tj=true;
    if(arrdata){
        var data_len=arrdata.length;
        for(var j=0;j<data_len;j++){
            obj_data=arrdata[j];
            realdatafolder=obj_data.folder;
            tj=true;
            if(sessionStorage.pageindex==2)
                tj=(obj_data.name.toLowerCase()==sessionStorage.typename.toLowerCase());
            for(var l=0;l<tab_rows_len;l++){
                if(parseInt($table.rows[l].cells[5].innerHTML)==parseInt(obj_data.sensorId) && tj){    
                    titlename=realdatafolder+concat_str+obj_data.name;
                    var sid=parseInt($table.rows[l].cells[5].innerHTML);
                    if (sensors)//&&isnew
                    for (var i = 0; i < sensors.length; i++) {//是否在需要显示的标签列表中
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
                    let str_hh=$table.rows[l].cells[2].innerHTML;
                    if(!str_hh){
                        str_hh=titlename+" : "+ obj_data.value+" "+chartOption.chart_unit;
                    }else if(str_hh.indexOf(titlename+" : ")!=-1){
                        exp_str=str_hh.substring(str_hh.indexOf(titlename),(str_hh.indexOf("<br>",str_hh.indexOf(titlename))+4));
                        str_hh.replace(exp_str,titlename+" : "+obj_data.value+" "+chartOption.chart_unit);
                    }else{
                        str_hh=str_hh+"<br>"+
                        titlename+" : "+ obj_data.value+" "+chartOption.chart_unit;
                    }
                    $table.rows[l].cells[2].innerHTML=str_hh;
                    //isbreak=true;
                    /*if(!$table.rows[l].cells[3].value || ($table.rows[l].cells[3].value<dateToString(obj_data.time,2))){//更新最新时间
                        $table.rows[l].cells[3].innerHTML=dateToString(obj_data.time,2).substring(10,19);
                        $table.rows[l].cells[3].value=dateToString(obj_data.time,2);
                    }*/
                    if(obj_data.message){
                        //atr.cells[k+hidden_cells].style.backgroundColor="#ffff00";
                        if($table.rows[l].cells[4].innerHTML&&($table.rows[l].cells[4].innerHTML.indexOf(obj_data.message)<0)){
                            $table.rows[l].cells[4].innerHTML+=";"+obj_data.message;
                        }else{
                            $table.rows[l].cells[4].innerHTML=obj_data.message;
                        }
                    }
                    $table.rows[l].cells[3].innerHTML='运行';//obj_data.folder;
                    $table.rows[l].style="";
                    break;
                }
            }
        }
        //var heightpx = $("#detail_realdata_tbody tr").height();// + 1;//加1是网格线的宽度
        for (var int = 0; int < tab_rows_len; int++) {
            if ($table.rows[int].cells[1].innerHTML == sessionStorage.SensorId) {
                sessionStorage.t_p = int;
                var ppt = parseInt(sessionStorage.t_p);
                var divheight=$("#datadiv").height();
                if(($table.rows[int].offsetTop-30)>(divheight))
                    $("#datadiv").scrollTop($table.rows[int].offsetTop-30);//表格重新滚动定位到选定的行datadiv为table的上级div的id；
                $table.rows[ppt].style.backgroundColor = color_table_cur;
                break;
            }
        }
    }else{
        showstateinfo("本次获取实时数据为空","realdata_detail");
    }
}
//
//根据数据列值获取Catalog。
//        一级：    二级    三级     四级
//防火墙   3.0      3.0     3.0     3.0
//承重墙   3.0      2.5     2.0     0.5
//
//
function getCatalog(atype,afolder,aname){
    try{
        initchartoption();//数据配置信息和单位信息初始化（更新）
        allconfigs=JSON.parse(localStorage.Config);
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
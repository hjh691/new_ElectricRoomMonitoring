var obj_realdata;
var isfirst=true;
var temp=0;
var pt = [0,0,0,0,0,0,0,0];
initpage();
$(function (){$("[data-toggle='popover']").popover();});
$(".tab a:last").tab("show");
function decoderealdata(){
    var v_sel = $('[name="options"]');
    $table = document.getElementById('guard_tbody');
    //var tableLength = $table.rows.length;
    for (var j = $table.rows.length-1; j >= 0; j--) { //暂时屏蔽，实际运行要清除所有内容。
        //$table.removeChild($table.rows[j]);  
    }
    //清除灯光状态列表
    $table = document.getElementById('light_tbody');
    //var tableLength = $table.rows.length;
    for (var j = $table.rows.length-1; j >= 0; j--) { //暂时屏蔽，实际运行要清除所有内容。
        //$table.removeChild($table.rows[j]);  
    }
    //清除烟感状态列表
    $table = document.getElementById('smoken_tbody');
    //var tableLength = $table.rows.length;
    for (var j = $table.rows.length-1; j >= 0; j--) { //暂时屏蔽，实际运行要清除所有内容。
        //$table.removeChild($table.rows[j]);  
    }
    //清除水浸模块状态列表
    $table = document.getElementById('flooding_tbody');
    //var tableLength = $table.rows.length;
    for (var j = $table.rows.length-1; j >= 0; j--) { //暂时屏蔽，实际运行要清除所有内容。
        //$table.removeChild($table.rows[j]);  
    }
    if(!obj_realdata){
        obj_realdata=JSON.parse(localStorage.getItem("realdata"));
    }
    switch($('li.active').id){
        case 'guard':
            //
            break;
        case 'light':
            //
            break;
        
    }
    var sensors = JSON.parse(localStorage.getItem("sensors"));
    var obj_data = new Object();
    
    //var kssj = getCurrentDate(1) + " 00:00:00";
    //var jssj = getCurrentDate(2);
    var grouptype,bondinginfo;
    var isnew=true,isfind=false,isbreak=false;
    var atr;
    sid=-1;
    if (obj_realdata) {
        if(v_sel){//有显示控制选择项时进行如下操作， 20200509 编写，还需测试完善。
            for (var j=0;j<obj_realdata.length;j++) {
                typename=obj_realdata[j].Name;
                grouptype=obj_realdata[j].Catalog;
                bondinginfo=obj_realdata[j].Desc
                if(obj_realdata[j].SensorId==sid){//是否为新的标签项
                    isnew=false;
                }else{ 
                    sid=obj_realdata[j].SensorId;
                    isnew=true;
                }
                if (sensors&&isnew)
                for (var i = 0; i < sensors.length; i++) {//是否在需要显示的标签列表中
                    if(obj_realdata[j].SensorId==sensors[i].id){
                        sid = sensors[i].id + "";
                        type_td = sensors[i].Value.Catalog;
                        sname = sensors[i].Value.Name;
                        isfind=true;
                        break;
                    }
                }
                if(isfind){//在需要显示的标签列表
                    obj_data = (obj_realdata)[j];////sid
                    if(isnew){//如果是新的标签，就创建一行，添加所有的td单元，
                        //TODO-list-----需要编写处理过程：根据不同分类，添加到不同的页面项目中，共客户浏览。
                        switch(typename){
                            case "guard"://guard为门禁，暂时定义，看实际使用的定义字符串
                                pt[0]++;
                                switch(obj_data.Value){//由其数值来区分不同的状态，对页面的显示元素进行更新（状态指示，信息更新，新标签的添加等）
                                    case a:
                                    case b:
                                    case c:
                                }
                                document.getElementById("guard_tbody").appendChild(createline(sid,sname,"关闭","正常关闭"));
                                $table = document.getElementById('guard_tbody');
                                break;
                            case "light"://light为灯光控制，暂定，同上
                                pt[1]++;
                                switch(obj_data.Value){
                                    case a:
                                    case b:
                                    case c:
                                }
                                document.getElementById("light_tbody").appendChild(createline(sid,sname,"正常","正常熄灭"));//("l00"+i,"name"+i,"故障","无法点亮")
                                $table = document.getElementById('light_tbody');
                                break;
                            case "smoken"://烟感暂定为”smoken”，同上
                                pt[2]++;
                                switch(obj_data.Value){
                                    case a:
                                    case b:
                                    case c:
                                }
                                document.getElementById("smoken_tbody").appendChild(createline(sid,sname,"告警"));
                                $table = document.getElementById('smoken_tbody');
                                break;
                            case "flooding"://水浸暂定为“flooding”，同上
                                pt[3]++;
                                switch(obj_data.Value){
                                    case a:
                                    case b:
                                    case c:
                                }
                                document.getElementById("flooding_tbody").appendChild(createline(sid,sname,"正常"));
                                $table = document.getElementById('flooding_tbody');
                                break;
                            case "UPS"://UPS电源检测，暂定“ups",同上
                                pt[4]++;
                                switch(sname){
                                    case 'A':
                                        break;
                                    case 'B':
                                        break;
                                    default :
                                };                              
                                break;
                            case "airconditioning"://环境检测，暂定”airconditioning",同上
                                pt[5]++;
                                switch(obj_data.Value){
                                    case a:
                                    case b:
                                    case c:
                                }
                                break;
                            case "humiture"://温湿度，暂定“humtiture”
                                pt[6]++;
                                switch(grouptype){
                                    case a://温度
                                        refresh_hum_temp(obj_data.Time,obj_data.Value);
                                        break;
                                    case b://湿度
                                        refresh_hum_swet(obj_data.Time,obj_data.Value);
                                        break;
                                    case c:
                                }
                                break;
                            case "room"://动力检测 同上
                                pt[7]++;
                                switch(grouptype){
                                    case a:
                                        refreshchart(obj.data.Value,bondinginfo);//roommonitor.js
                                    case b:
                                    case c:
                                }
                                break;
                        }
                        atr=document.createElement("tr");
                        for(var k=0;k<tab_head.rows[0].cells.length;k++){
                            var atd=document.createElement("td");
                            atr.appendChild(td);
                        }
                        count=v_sel.length;//count没有定义，取显示控制向的选取个数  709修改
                        atr.cells[0].innerHTML=sid;
                        atr.cells[0].style.ccsText="display:none";
                        atr.cells[1].innerHTML=sname;//第一列添加标签名称，
                        atr.cells[2].innerHTML=obj_data.Time;//第二列添加测量时间
                        atr.cells[count+3].innerHTML="<button backgroundColor='#fff' onclick=tohistory("+sid+") href='javascript:void(0)'>>></button>";
                        atr.cells[count+4].innerHTML="<button backgroundColor='#fff' onclick=towarnlog("+sid+") href='javascript:void(0)'>>></button>";
                        for(var k=0;k<v_sel.length;k++){//添加到指定列
                            if(v_sel[k].value==typename){
                                atr.cells[k+3].innerHTML=obj_data.Value.toFixed(Number_of_decimal);
                            }
                            if(!v_sel[k].checked){
                                atr.cells[k+3].style.cssText = "display:none";
                            }
                        }
                        $table.appendChild(atr);//添加新行
                    }else{//不是新标签，从已添加列表中查询同id的标签行，然后添加到对应列
                        for(var l=0;l<$table.rows.length;l++){
                            if($table.rows[l].cells[0].innerHTML==obj_data.SensorId){
                                for(k in v_sel){//对照用户所选显示项，添加显示数值到对应列，
                                    if(v_sel[k].value==typename){
                                        $table.rows[l].cells[k+3].innerHTML=obj_data.Value.toFixed(Number_of_decimal);
                                        isbreak=true;
                                        if($table.rows[l].cells[1].innerHTML<obj_data.Time){//更新最新时间
                                            $table.rows[l].cells[1].innerHTML=obj_data.Time;
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
        }else{//如果没有显示控制项（分组配置项） 20200520 编写，还需测试完善。want to 
            if(isnew){//如果是新的标签，就创建一行，添加所有的td单元，
                atr=document.createElement("tr");
                var length=tab_head.rows[0].cells.length
                for(var k=0;k<length;k++){
                    var atd=document.createElement("td");
                    atr.appendChild(td);
                }
                atr.cells[0].innerHTML=sid;
                atr.cells[0].style.ccsText="display:none";
                atr.cells[1].innerHTML=sname;//第一列添加标签名称，
                atr.cells[2].innerHTML=obj_data.Time;//第二列添加测量时间
                atr.cells[length-2].innerHTML="<button backgroundColor='#fff' onclick=tohistory("+sid+") href='javascript:void(0)'>>></button>";
                atr.cells[length-1].innerHTML="<button backgroundColor='#fff' onclick=towarnlog("+sid+") href='javascript:void(0)'>>></button>";
                for(var k in tab_head.rows[0].cells){//添加到指定列。
                    if(obj_data.Name==tab_head.rows[0].cells[k].innerHTML){
                        atr.cells[k].innerHTML=obj_data.Value.toFixed(Number_of_decimal);
                        break;
                    }
                }
                $table.appendChild(atr);
            }else{//不是新标签
                for(var l=0;l<$table.rows.length;l++){//定位到指定行
                    if($table.rows[l].cells[0].innerHTML==obj_data.SensorId){
                        for(var k in tab_head.rows[0].cells){
                            if(obj_data.Name==tab_head.rows[0].cells[k].innerHTML){//添加到指定列
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
    //一些部分模拟测试动态标签页的显示和隐藏用，实际使用时需要针对数据进行修改 temperature
    if(isfirst){
        pt[(temp%8)]=1;
    }else{
        pt[8-(temp%8)]=0;
    }
    temp++;
    var tappanes=$('.tab-pane');
    var tablabels=$('.tab-label');
    var z_count=0;
    for(var i=0;i<8;i++){
        if(pt[i]>0){
            tappanes[i].style.display="";
            tablabels[i].style.display="";
            //tablabels[i].classList.add("in");
            //tablabels[i].classList.add("active");
            //tappanes[i].classList.add("in");
            //tappanes[i].classList.add("active");
            z_count++;
        }else{
            tappanes[i].style.display="none";
            tablabels[i].style.display="none";
        }
        tablabels[i].classList.remove("in");
        tablabels[i].classList.remove("active");
        tappanes[i].classList.remove("in");
        tappanes[i].classList.remove("active");
    }
    $('.tab-pane').eq(z_count-1).addClass("in");//定义最后的页为当前页面和标签
    tablabels[z_count-1].classList.add("active");
    tappanes[z_count-1].classList.add("in");
    tappanes[z_count-1].classList.add("active");
    if(z_count>=8)
        isfirst=false
    else if(z_count<=1)
        isfirst=true;/**/
}
function setactive(aid){
    var lis=$("#nav").find("li");//获取所有tab菜单项
    var tabs=$(".tab-pane");//获取所有tab面板项
    for(var i=0;i<lis.length;i++){
        if(lis[i].id==aid){
            lis[i].classList.add("active");
            tabs[i].classList.add("in");
            tabs[i].classList.add("active");
        }else{
            lis[i].classList.remove("active");
            tabs[i].classList.remove("in");
            tabs[i].classList.remove("active");
        }
    }
}
function initpage() {
    updatapcnav(14);
    sessionStorage.framepage="realstate.html";
    var parentid=-100,parentname="";
	var maps=[];
    if (typeof (Worker) !== "undefined") {//只在网络状态下可用，本地磁盘目录下不可用。
        if (typeof (w1) == "undefined") {
            w1 = new Worker("delay_worker.js");
        }
        var i = 0;
        w1.onmessage = function (event) {
            i++
            if (i % 10 == 0) {
                //getrealdatabynodeid(-1);
                decoderealdata();
            }
        };/**/
    } else {
        //document.getElementById("result").innerHTML = "抱歉，你的浏览器不支持 Web Workers...";
        var t1 = window.setInterval("getrealdatabynodeid(-1);", 60000);//定时刷新页面定时器；
    }
    var sel_sensor=document.getElementById("jcdd");
	for (var i = 0; i < sel_sensor.length; i++) {
		sel_sensor.removeChild(sel_sensor.options[0]);
		sel_sensor.remove(0);
		sel_sensor.options[0] = null;
	}
	sensors=JSON.parse(localStorage.getItem("sensors"));
	configs=JSON.parse(localStorage.getItem("Configs"));
	if(sensors!=null){
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
			op.innerHTML=maps[k].name;
			sel_sensor.appendChild(op);
		}
	}
    setSelectOption("jcdd", sessionStorage.SensorId);
    getrealdatabynodeid(-1);
}
function stopWorker() {//停止自动刷新数据 
    w1.terminate();
    w1 = undefined;
};
/**1. duiecharttubiaopeizhicanshujinxingyouhua,xianshixiaoguogenmeiguanheli
 * 编写页面标签随数据动态变化的实现方法。lazy 
 * 动力监测和空调参数页面超出显示范围，调整，并按bootstrap的网络系统进行调整和布置。
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 0727-0731 对web程序功能进行调试，对发现的问题进行了修改和完善，同时对页面和交互操作进行了友好性改进。下周还是进行调试和完善
 * 
 * 
*/

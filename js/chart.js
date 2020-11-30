    //初始化历史数据图形显示页面（在进入趋势图页面时触发）。
    var check_val = [],check_name=[];
    var kssj,jssj;
    var sensors,configs;
    var sel_str=[];
    var ch1,ch2,ch3,ch4;
    var cname,catalog;
    var isfound=false;
    var selectText="";
    var timer=null;
    var flashit=$("#chaxun");
    inithistorychart();
    function inithistorychart() {
        updatapcnav(7);
        //var el=$("[class $= 't']");jquery 选择器 结束、开始、包含、等于
        sessionStorage.framepage="chart.html";
        //return;
        sessionStorage.pageindex = 4;
        ch1=document.getElementById("chart1");
        ch2=document.getElementById("chart2");
        ch3=document.getElementById("chart3");
        ch4=document.getElementById("chart4");
        //var parentid = -100, parentname = "";
        //var maps = [];
        $("#cxsj").val((sessionStorage.cxsj).substr(0,11));
        if(sessionStorage.comperator_sensors)
        var sel_sensor =JSON.parse(sessionStorage.comperator_sensors);
        var tree_obj=window.parent.$("#tree_chi");
        var obj_node=tree_obj.treeview("getSelected");
        if(obj_node.length>0)//判断有没有选中项
        {tree_obj.treeview("unselectNode",obj_node[0]);}//使选择项为不选中，为下一步选择所有未选择项准备//	$("#sel-sensorname").val("所选标签: "+tree_obj.treeview("getSelected")[0].text);
        var sensors=tree_obj.treeview("getUnselected");//选取未选中项
        if(sensors && sel_sensor)
        for (var i = 0; i <sel_sensor.length; i++) {
            for(var j=0;j<sensors.length;j++){
                if(sel_sensor[i]==sensors[j].id){
                    tree_obj.treeview("selectNode",sensors[j].nodeId);
                    break;
                }
            }
        }
        //sensors=JSON.parse(localStorage.getItem("sensors"));//
        configs=JSON.parse(localStorage.Configs);
        /*if (sensors != null) {
            for (var i = 0; i < sensors.length; i++) {
                if ((sensors[i].Value.ParentId != "-1") && (sensors[i].Value.ParentId != parentid)) {
                    parentid = sensors[i].Value.ParentId;
                    for (var j = 0; j < sensors.length; j++) {
                        if (sensors[j].id == parentid) {
                            parentname = sensors[j].Value.Name + "_";
                            break;
                        }
                    }
                }
                var map = new Object();
                map.value = sensors[i].id;
                map.name = parentname + sensors[i].Value.Name;  manage foreign language forest
                maps.push(map);
            }
            var compare = function (obj1, obj2) {//zw20-12 zw32-12 zw43-12 
                var val1 = obj1.name;
                var val2 = obj2.name;
                return val1.localeCompare(val2);//
            }
            maps.sort(compare);
            for (var k = 0; k < maps.length; k++) {//将标签添加到多选列表中 
                var p = document.createElement("p");
                var lab=document.createElement("label");
                var input=document.createElement("input");
                input.setAttribute("type","checkbox");
                input.setAttribute("name","checks");
                input.setAttribute("id",maps[k].name);
                input.setAttribute("value",maps[k].value);
                input.setAttribute('onclick','itemclick(this)');
                var spn=document.createElement("span");
                spn.innerHTML=maps[k].name;
                lab.appendChild(input);
                lab.appendChild(spn);
                p.appendChild(lab);
                sel_sensor.appendChild(p);
            }
        }*/
        appenddisplaytype();
        //setSelectOption("jcdd", sessionStorage.SensorId);
        oneChoice();
    }
    //添加类别分组选项
    function appenddisplaytype(anodeid){
        selectText="";
        if(sessionStorage.selectText){
            sel_str=sessionStorage.selectText.split(";");
        }else{
            sel_str=[];
        }
        var temp=document.getElementById("display_type");
        allconfigs=JSON.parse(localStorage.Configs);
        if(allconfigs){
            for(var ac in allconfigs){//如果有，读取其所有配置项
                var s_des=allconfigs[ac].details;//如果有，读取其所有配置项
                for(var p in s_des){
                    for(var i=0;i<temp.children.length;i++){//0721 edit 判断是否存在配置项，如果存在则跳过继续，不存在则添加;
                        if((temp.children[i].children[0].children[0].value.toLowerCase()==s_des[p].name.toLowerCase())
                            &&(temp.children[i].children[0].children[1].innerText.toLowerCase()==s_des[p].desc.toLowerCase())){
                            isfound=true;
                            break;
                        }
                    }
                    if(isfound){
                        isfound=false;
                        for(var j=0;j<sel_str.length;j++){
                            if(temp.children[i].children[0].children[1].innerText==sel_str[j]){
                                temp.children[i].children[0].checked=true;
                                break;
                            }
                        }
                        continue;
                    }//0721 edit/**/
                    var li=document.createElement("li");
                    var lab=document.createElement("label");
                    //lab.setAttribute("style","margin-left:20px")
                    var ainput=document.createElement("input");
                    ainput.setAttribute("type","checkbox");
                    ainput.setAttribute("name","checkbox");
                    ainput.setAttribute("value",s_des[p].name);
                    ainput.className="check_box";
                    var spn=document.createElement("span");
                    spn.innerHTML=s_des[p].desc;
                    for(var j=0;j<sel_str.length;j++){
                        if(sel_str[j]==s_des[p].desc){
                            ainput.setAttribute("checked",true);
                            break;
                        }
                    }
                    lab.appendChild(ainput);
                    lab.appendChild(spn);
                    //lab.innerHTML='<input class="catalog" type="checkbox" name="options" value="'+s_des[p].Name+'" >'+s_des[p].Desc;
                    li.appendChild(lab);
                    temp.appendChild(li);
                    //var title_th =document.createElement("th");
                    //title_th.innerHTML=s_des[p].Desc;
                    //document.getElementById("table_title").appendChild(title_th);
                }
            }
            if(sel_str.length==0){
                temp.children[0].children[0].children[0].checked=true;
                sel_str.push(temp.children[0].children[0].children[1].innerHTML);
            }
            for(var i=0;i<temp.children.length;i++){
                if(temp.children[i].children[0].children[0].checked==true){
                    selectText=selectText+temp.children[i].children[0].children[1].innerHTML+";";
                }
            }
            if(selectText.charAt(selectText.length - 1)==";"){
                //去除末尾分号
                selectText=selectText.substring(0,selectText.length - 1);
                //selectVal=selectVal.substring(0,selectVal.length - 1);
            }
            if(selectText==""){
                selectText="请选择类别分组项"
            }
        }else{
            for(var i=temp.childNodes.length;i>0;i--)
            temp.removeChild(temp.childNodes[i-1]);
            selectText="没有可选项";
        }
        document.getElementById("select_text").value=selectText;
        showchartview(sel_str);
    }

    /*function itemclick(obj){//多选列表项的点击响应过程
        var allobj = $('[name="checks"]');
        var c=0;
        for(var k in allobj){
            if(allobj[k].checked){
                c++;
            }
        }
        if(c>6){
            obj.checked=false;
            alert("对比测量点不能大于6个!",info_showtime);
            showstateinfo("对比测量点不能大于6个");
        }
    }
    function refreshsensorslist() {
        window.parent.GetSensorsByNode(sessionStorage.nodeId);
    }
    function allChoice(){//取消选择项
        var obj = $('[name="checks"]');
        var btn=document.getElementById("allcheck")
        //if(btn.value=="全选"){
        //	for(var i=0;i<obj.length;i++){
        //		obj[i].checked=true;
        //	}
        //	btn.value="全不选";
        //}else{
            for(var i=0;i<obj.length;i++){
                obj[i].checked=false;
            }
        //	btn.value="全选";
        //}
    }*/
    //对比按钮
    function oneChoice(){
        stoptimer(timer);
        var obj = window.parent.$("#tree_chi").treeview("getSelected");
        //$("#comprate-tbody tr").remove();
        kssj=$("#cxsj").val()+" 00:00:00"
        jssj=$("#cxsj").val()+" 23:59:59"
        sessionStorage.cxsj=jssj;
        //var obj = $('[name="checks"]');
        check_name=[];check_val=[];
        for(var k=0;k<obj.length;k++){
            //if(obj[k].checked && obj[k].value != "-1"){
                check_val.push(parseInt(obj[k].id));
                check_name.push(obj[k].text);
            //}
        }
        sessionStorage.setItem("comperator_sensors", JSON.stringify(check_val));
        if(check_val.length>0){
            //sessionStorage.sensors
            var allobj = $('[name="checkbox"]');
            var pt=0;
            if(sel_str.length>0){
                for(var i=0;i<sel_str.length;i++){
                    for(var j=0;j<allobj.length;j++){
                        if(allobj[j].parentElement.outerText==sel_str[i]){
                            cname=allobj[j].value;
                            catalog=getcatalog(cname);
                            pt++;
                            gethistorybysensors(check_val,catalog,cname,pt,sel_str[i]);
                        }
                    }
                }
            }else{
                if(allobj.length>0){//是否有类别分组内容配置项
                    layer.alert("请选择要显示的类别分组内容!",info_showtime);
                    showstateinfo("请选择要显示的类别分组内容");
                }else{//没有配置项，传递空串，返回所有//20200520 add this function,need Verification; 
                    gethistorybysensors(check_val,"","",1,"");
                }
            }
        }else{
            layer.alert("请选择要对比的测量点名称!",info_showtime);
            showstateinfo("请选择要对比的测量点名称!");
        }
    }
    /*function gethistorybysensors(arr_sensors,folder,aname,apt,atitle){
        var url = jfjk_base_config.baseurl + "GetHistoriesBySensors?folder="+folder+"&name="+aname+"&from="+kssj+"&to="+jssj;
        url = encodeURI(url);
        if (sessionStorage.islogin == "true") {
            $.ajax({
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", sessionStorage.token);
                },
                url: url,
                type: 'POST',
                dataType: 'json',
                contentType: "application/json",
                data:JSON.stringify(arr_sensors),
                timeout: 10000,
                error: function(jqXHR, textStatus, errorThrown) {
                    sessionStorage.errortime++;
                    ajaxLoadingHidden();
                    decodedatas([],apt,atitle);//
                    //myChart.hideLoading();
                    if (errorThrown == "Unauthorized") {
                        layer.alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取历史数据操作失败',info_showtime);
                        showstateinfo(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取历史数据操作失败');
                        LoginOrder(localStorage.username,sessionStorage.password,1)
                    } else {
                        layer.alert(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取历史数据操作失败',info_showtime);
                        showstateinfo(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取历史数据操作失败');
                    }
                    if(sessionStorage.errortime>3){
                        sessionStorage.islogin=false;
                        sessionStorage.errortime=0;
                    }
                },
                success: function(data, status) {
                    //var reg = new RegExp("(^|&)value1=([^&]*)(&|$)"); 
                    ajaxLoadingHidden();
                    if (status == "success") {
                        sessionStorage.errortime = 0;
                        sessionStorage.islogin = true;
                        if (data.Error == null) {//Result.
                            if (!jQuery.isEmptyObject(data.datas)) {
                                showstateinfo("");
                                decodedatas( data.datas,apt,atitle);
                            } else {
                                layer.alert("没有符合条件的 "+atitle+" 记录",info_showtime);
                                showstateinfo("没有符合条件的 "+atitle+" 记录");
                                decodedatas([],apt,atitle);//
                            }
                        } else {
                            decodedatas([],apt,atitle);//
                            layer.alert(data.Error,info_showtime);
                            showstateinfo(data.Error);
                        }
                    }
                }
            });
        } else {
            Alert("用户未登录，您无权完成此次操作", info_showtime);
            showstateinfo("用户未登录，你无权完成此次操作");
        }
    }*/
    function gethistorybysensors(arr_sensors,folder,aname,apt,atitle){
        sendpostorder("GetHistoriesBySensors?folder="+folder+"&name="+aname+"&from="+kssj+"&to="+jssj,arr_sensors,function(data){
            if (data!= null) {//Result.
                if (!jQuery.isEmptyObject(data.datas)) {
                    //showstateinfo("");
                    decodedatas( data.datas,apt,atitle);
                } else {
                    Alert("没有符合条件的 "+atitle+" 记录",info_showtime);
                    showstateinfo("没有符合条件的 "+atitle+" 记录");
                    decodedatas([],apt,atitle);//
                }
            } else {
                decodedatas([],apt,atitle);//
                Alert("没有符合条件的 "+atitle+" 记录",info_showtime);
                showstateinfo("没有符合条件的 "+atitle+" 记录");
            }
        })
    }
//动态添加的元素注册添加点击事件//
$(document).on("click",".check_box",function (event){
    event.stopPropagation();//阻止事件冒泡，防止触发li的点击事件
    //获取多选列表的所有选项内容。
    //勾选的项
    var $selectTextDom=$(this).parent().parent().parent("ul").siblings("label").children(".select_text");
    //勾选项的值
    //var $selectValDom=$(this).parent().parent().parent("ul").siblings(".select_val");
    //是否有选择项了
    var isSelected=$selectTextDom[0].getAttribute("data-is-select");
    //文本值，用于显示
    //var selectVal=$selectValDom.val();//实际值，会提交到后台的
    var selected_text=$(this).siblings("span").text();//当次勾选的文本值
    var selected_val=$(this).val();//当次勾选的实际值
    //判断是否选择过
    if(isSelected=="true"){
        selectText=$selectTextDom.val();
    }
    if(selectText!=""&&selectText!="请选择类别分组项"&&selectText!="没有可选项"){
        if(selectText.indexOf(selected_text)>=0){//判断是否已经勾选过
            selectText=selectText.replace(selected_text,"").replace(";;",";");//替换掉
            //selectVal=selectVal.replace(selected_val,"").replace(",,",",");//替换掉
            //判断最后一个字符是否是分号
            if(selectText.charAt(selectText.length - 1)==";"){
                //去除末尾分号
                selectText=selectText.substring(0,selectText.length - 1);
                //selectVal=selectVal.substring(0,selectVal.length - 1);
            }
            //判断第一个字符是否是分号，是的话去掉。
            if(selectText.charAt(0)==";"){
                selectText=selectText.substring(1);
            }
        }else{
            selectText+=";"+selected_text;
            //selectVal+=","+selected_val;
        }
    }else{
        selectText=selected_text;
        //selectVal=selected_val;
    }
    $selectTextDom.val(selectText);
    sessionStorage.selectText=selectText;
    //$selectValDom.val(selectVal);
    if(selectText==""){
        $selectTextDom.val("请选择类别分组项");
        $selectTextDom[0].setAttribute("data-is-select","false");
        sel_str.length=0;
    }else{
        $selectTextDom[0].setAttribute("data-is-select","true");
        sel_str=selectText.split(";")
        showchartview(sel_str);
    }
    flashbutton();
});
function showchartview(asel_str) {
    switch(asel_str.length){
        case 1:
            ch1.className="col-xs-11 col-sm-11 displaytype1";
            ch2.setAttribute("style","display:none");
            ch3.setAttribute("style","display:none");
            ch4.setAttribute("style","display:none");
            break;
        case 2:
            ch1.className="col-xs-11 col-sm-11 displaytype2";
            ch2.className="col-xs-11 col-sm-11 displaytype2";
            ch2.setAttribute("style","display:block");
            ch3.setAttribute("style","display:none");
            ch4.setAttribute("style","display:none");
            break;
        case 3:
            ch1.className="col-xs-11 col-sm-5 displaytype2";
            ch3.className="col-xs-11 col-sm-5 displaytype2";
            ch3.setAttribute("style","display:block");
            ch2.className="col-xs-11 col-sm-5 displaytype2";
            ch2.setAttribute("style","display:block");
            ch4.setAttribute("style","display:none");
            break;
        case 4:
            ch1.className="col-xs-11 col-sm-5 displaytype2";
            ch3.className="col-xs-11 col-sm-5 displaytype2";
            ch3.setAttribute("style","display:block");
            ch2.className="col-xs-11 col-sm-5 displaytype2";
            ch2.setAttribute("style","display:block");
            ch4.className="col-xs-11 col-sm-5 displaytype2";
            ch4.setAttribute("style","display:block");
            break;
    }
}
//绘图变化趋势图   used by electricroommonitor chart.html
function decodedatas(obj_chartdatas,apt,atitle) {
	//var iserror = false,
	//err_info = "获取";
	//var isnull = false,
	var jiange="";
	//var stime=new Date(kssj).getTime();
	//var etime=new Date(jssj).getTime();
	//var senconds=etime-stime;
	var pa = [],pb = [],pc = [];
	var maxvalue=-1,minvalue=-1,maxval=-1,minval=-1;//avgvalue=0,ps=0,count=1,
	var lengenddata = [];
	var obj_chartdata=[];
	var seriess=[];
	var step=false;
	var myChart = echarts.init(document.getElementById('chart'+apt));
	myChart.clear();
	if(obj_chartdatas.length>0){
		var tbody=document.getElementById("comprate-tbody");
		if(check_val.length>0){
			var title_tr=document.createElement("tr");
			var title_th=document.createElement("th");
			title_th.setAttribute('colspan','4');//setAttribute('colspan','4')"
			//title_th.setAttribute('style','text-align: center');
			title_th.innerHTML=atitle;
			title_tr.appendChild(title_th);
			tbody.appendChild(title_tr);
			for(var i=0;i<check_val.length;i++){
				var sensorid=check_val[i];
				var series=new Object();
				series.name=check_name[i];//+"["+sensorid+"]"
				lengenddata.push(check_name[i]);//+"["+sensorid+"]"
				obj_chartdata=obj_chartdatas;//[sensorid];
				if(obj_chartdata){
					pb= new Array();
					if(isNaN(parseFloat(obj_chartdata[0].value))){
						obj_chartdata[0].value=-1;
					}
					maxvalue=minvalue=parseFloat(obj_chartdata[0].value);
					for (var j = 0; j <obj_chartdata.length; j++) {
						if(obj_chartdata[j].sensorId==sensorid){
							pb.push([strtodatetime(obj_chartdata[j].time), obj_chartdata[j].value, j]);
							if(isNaN(parseFloat(obj_chartdata[j].value))){
								obj_chartdata[j].value=-1;
							}
							if(parseFloat(obj_chartdata[j].value)>maxvalue){
								maxvalue=parseFloat(obj_chartdata[j].value);
							}
							if(parseFloat(obj_chartdata[j].value)<minvalue){
								minvalue=parseFloat(obj_chartdata[j].value);
							}
							var tr=document.createElement("tr");
							var td_name=document.createElement("td");
							td_name.innerHTML=check_name[i];
							var td_time=document.createElement("td");
							td_time.innerHTML=obj_chartdata[j].time;
							var td_value=document.createElement("td");
							td_value.innerHTML=obj_chartdata[j].value;//.toFixed(2);
							var td_bz=document.createElement("td");
							tr.appendChild(td_name);
							tr.appendChild(td_time);
							tr.appendChild(td_value);
							tr.appendChild(td_bz);
							tbody.appendChild(tr);
						}
					}
					if(i==0){
						maxval=maxvalue;
						minval=minvalue;
					}else{
						maxval=maxval>maxvalue?maxval:maxvalue;
						minval=minval<minvalue?minval:minvalue;
					}
				}
				series.type='line';
				series.step= step;
				series.showAllSymbol=true;
				series.symbolSize= 1;
				series.data= pb;
				//series.itemStyle= {normal: {areaStyle: {type: 'default'}}}; //线下区域
				seriess.push(series);
			}
		}
	}
	/*//if(Math.ceil(senconds/1000/60)<1430){
		for (var i = 0; i <obj_chartdata.length; i++) {
			pa.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value, i])
			pb.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value, i])
			pc.push([strtodatetime(obj_chartdata[i].Time), obj_chartdata[i].Value, i])
		}
		maxvalue=minvalue=avgvalue=parseFloat(obj_chartdata[0].Value);
		var strtime=obj_chartdata[0].Time.substr(0,13);
		var temp=parseInt(strtime.substr(11));
		for (var i = 1; i <obj_chartdata.length; i++) {
			if(parseInt(obj_chartdata[i].Time.substr(11,13))==temp){
				if(parseFloat(obj_chartdata[i].Value)>maxvalue){
					maxvalue=parseFloat(obj_chartdata[i].Value);
				}
				if(parseFloat(obj_chartdata[i].Value)<minvalue){
					minvalue=parseFloat(obj_chartdata[i].Value);
				}
				avgvalue=(parseFloat(avgvalue)+parseFloat(obj_chartdata[i].Value));
				count++;
			}else{
				avgvalue=(avgvalue/count);
				pa.push([strtodatetime(strtime+":00"), maxvalue, ps])
				pb.push([strtodatetime(strtime+":00"), avgvalue.toFixed(Number_of_decimal), ps])
				pc.push([strtodatetime(strtime+":00"),minvalue , ps])
				maxvalue=minvalue=avgvalue=parseFloat(obj_chartdata[i].Value);
				strtime=obj_chartdata[i].Time.substr(0,13);
				temp=parseInt(strtime.substr(11));
				ps++;
				count=1;
			}
		}
		avgvalue=(avgvalue/count);
		pa.push([strtodatetime(strtime+":00"), maxvalue, ps])
		pb.push([strtodatetime(strtime+":00"), avgvalue.toFixed(Number_of_decimal), ps])
		pc.push([strtodatetime(strtime+":00"),minvalue , ps])
	//}else 
	/*if(Math.ceil(senconds/1000/60)<=1440){
		jiange="按小时统计";
		maxvalue=minvalue=avgvalue=parseFloat(obj_chartdata[0].Value);
		maxval=minval=maxvalue;
		var strtime=obj_chartdata[0].Time.substr(0,13);
		var temp=parseInt(strtime.substr(11));
		for (var i = 1; i <obj_chartdata.length; i++) {
			if(parseInt(obj_chartdata[i].Time.substr(11,13))==temp){
				if(parseFloat(obj_chartdata[i].Value)>maxvalue){
					maxvalue=parseFloat(obj_chartdata[i].Value);
				}
				if(parseFloat(obj_chartdata[i].Value)<minvalue){
					minvalue=parseFloat(obj_chartdata[i].Value);
				}
				if(parseFloat(obj_chartdata[i].Value)>maxval){
					maxval=parseFloat(obj_chartdata[i].Value);
				}
				if(parseFloat(obj_chartdata[i].Value)<minval){
					minval=parseFloat(obj_chartdata[i].Value);
				}
				avgvalue=(parseFloat(avgvalue)+parseFloat(obj_chartdata[i].Value));
				count++;
			}else{
				avgvalue=(avgvalue/count);
				pa.push([strtodatetime(strtime+":00"), maxvalue, ps])
				pb.push([strtodatetime(strtime+":00"), avgvalue.toFixed(Number_of_decimal), ps])
				pc.push([strtodatetime(strtime+":00"),minvalue , ps])
				maxvalue=minvalue=avgvalue=parseFloat(obj_chartdata[i].Value);
				strtime=obj_chartdata[i].Time.substr(0,13);
				temp=parseInt(strtime.substr(11));
				ps++;
				count=1;
			}
		}
		avgvalue=(avgvalue/count);
		pa.push([strtodatetime(strtime+":00"), maxvalue, ps])
		pb.push([strtodatetime(strtime+":00"), avgvalue.toFixed(Number_of_decimal), ps])
		pc.push([strtodatetime(strtime+":00"),minvalue , ps])
	}else{
		jiange="按日统计";
		maxvalue=minvalue=avgvalue=parseFloat(obj_chartdata[0].Value);
		maxval=minval=maxvalue;
		var strtime=obj_chartdata[0].Time.substr(0,10);
		var temp=parseInt(strtime.substr(8));
		for (var i = 1; i <obj_chartdata.length; i++) {
			if(parseInt(obj_chartdata[i].Time.substr(8,10))==temp){
				if(parseFloat(obj_chartdata[i].Value)>maxvalue){
					maxvalue=parseFloat(obj_chartdata[i].Value);
				}
				if(parseFloat(obj_chartdata[i].Value)<minvalue){
					minvalue=parseFloat(obj_chartdata[i].Value);
				}
				if(parseFloat(obj_chartdata[i].Value)>maxval){
					maxval=parseFloat(obj_chartdata[i].Value);
				}
				if(parseFloat(obj_chartdata[i].Value)<minval){
					minval=parseFloat(obj_chartdata[i].Value);
				}
				avgvalue=(parseFloat(avgvalue)+parseFloat(obj_chartdata[i].Value));
				count++;
			}else{
				avgvalue=(avgvalue/count);
				pa.push([strtodatetime(strtime), maxvalue, ps])
				pb.push([strtodatetime(strtime), avgvalue.toFixed(Number_of_decimal), ps])
				pc.push([strtodatetime(strtime),minvalue , ps])
				maxvalue=minvalue=avgvalue=parseFloat(obj_chartdata[i].Value);
				strtime=obj_chartdata[i].Time.substr(0,10);
				temp=parseInt(strtime.substr(8));
				ps++;
				count=1;
			}
		}
		avgvalue=(avgvalue/count);
		pa.push([strtodatetime(strtime), maxvalue, ps])
		pb.push([strtodatetime(strtime), avgvalue.toFixed(Number_of_decimal), ps])
		pc.push([strtodatetime(strtime),minvalue , ps])
	}
	var lengenddata = [];
	lengenddata.push("最大值");
	lengenddata.push("平均值");
	lengenddata.push("最小值");*/
	if(maxval==minval){
		maxval=maxval*1.5;
		minval=minval/2;
	}else{
		maxval=(maxval*1+(maxval-minval)*0.2).toFixed(Number_of_decimal);
		minval=(minval*1-(maxval-minval)*0.2).toFixed(Number_of_decimal);
	}
	drawchart();
	//绘制图形线条
	function drawchart() {
		//var myChart = echarts.init(document.getElementById('main'));
		var option = {
			color: ['#ff6c00', '#FF0000','#228B22',"#9400D3","#00BFFF","#3B30f2","#20B2AA","#0000CD"," #FF4500 "],//
			backgroundColor: '#dcdcdc',
			title : {
						text : atitle+": "+' 变化趋势比对  ',//标题 标签名称+项目名称；
						x:"center",
						subtext:jiange+"   "+kssj+"——"+jssj,
						subtextStyle:{
							color: "#000",
						}
					},/**/
			tooltip: {
				trigger: 'item',
				formatter: function(params) {
					var date = new Date(params.value[0]);
					data = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
					return data + '<br/>' + params.value[1];
				}
			},
			toolbox: {
				show: true,
				feature: {
					mark: {
						show: false
					},
					dataView: {
						show: false,
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
			dataZoom: [{
				show: true,
				start: 0
			},
			{   // 这个dataZoom组件，也控制x轴。
				type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件  
				start: 0,      // 左边在 10% 的位置。
				end: 100,       // 右边在 60% 的位置。 
			},],
			legend: {//图例
				data: lengenddata,
				orient:"vertical",//"horizontal",
				x:'right',//'left'
				y:'45',//
				textStyle:{
					color: 'blue',//
				}
				
			},
			grid: {
				y2: 80
			},
			xAxis: [{//x轴
				type: 'time',
				splitNumber: 10,
				axisLine: {
					lineStyle: {
						color: 'black',
						width: 2
					},
					onZero:false
				},
			}],
			yAxis: [{//Y轴
				type: 'value',
				axisLine: {
					lineStyle: {
						color: 'black',
						width: 2
					}
				},
				min:minval,
				max:maxval,
			}],
			series: seriess,/*[{
				name: lengenddata[0],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text,
				type: 'line',
				showAllSymbol: true,
				symbolSize: 1,
				data: pa
			},
			{
				name: lengenddata[1],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text+"177",
				type: 'line',
				showAllSymbol: true,
				symbolSize: 1,
				data: pb
			},
			{
				name: lengenddata[2],//document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text+"最小值",
				type: 'line',
				showAllSymbol: true,
				symbolSize: 1,
				data: pc
			}/
			]**/
		};
		myChart.hideLoading();
		myChart.setOption(option);
		myChart.resize();
	}
}
    
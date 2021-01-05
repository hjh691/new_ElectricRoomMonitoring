	var pageSize = 18;    //每页显示的记录条数
	var curPage=0;        //当前页
	//var lastPage;        //最后页
	var direct=0;        //方向
	var len;            //总行数
	var page;            //总页数
	var begin,end;
	var count=0,count_l=0,count_h=0;
	var $table;
	var configs;
	var dname="",catalog="";
	var allcatalog;
	var isfound=false;
	var selectText="";
	var sel_str=[];
	var timer=null;
	var flashit=$("#chaxun");
	$(function () {
		initwarnlog();		
	});

	//初始化告警信息查询页面（在进入告警信息页面时触发）。  used by electricroommonitor
	function initwarnlog() {
		try{
		updatapcnav(8);
		//保存页面现场，在点击浏览器的刷新按钮刷新时应用20201211
		sessionStorage.framepage="warnlog.html";
		sessionStorage.pageindex = 5;
		//var parentid=-100,parentname="";
		//var maps=[];
		
		//var treeseneors=JSON.parse(localStorage.getItem("sensor_tree"))
		//var treenode=buildnode(treeseneors,0);
		//inittreeview(treenode);
		$("#kssj_warning").val(sessionStorage.kssj);
		$("#jssj_warning").val(sessionStorage.jssj);
		/*var sel_sensor=document.getElementById("jcdd");
		for (var i = 0; i < sel_sensor.length; i++) {
			sel_sensor.removeChild(sel_sensor.options[0]);
			sel_sensor.remove(0);
			sel_sensor.options[0] = null;
		}*/
		sensors=JSON.parse(localStorage.getItem("sensors"));
		configs=JSON.parse(localStorage.getItem("Configs"));
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
				op.innerHTML=maps[k].name;
				sel_sensor.appendChild(op);
			}
		}
		setSelectOption("jcdd", sessionStorage.SensorId);
		sessionStorage.SensorId = sel_sensor.value;*/
		if(sessionStorage.SensorId=="")
			sessionStorage.SensorId=-1;
		//GetSensorsByStation();
		if((!sessionStorage.timeindex)||(typeof(sessionStorage.timeindex)=="undefined")){
			sessionStorage.timeindex=0;
		}
		$(":radio[name='timeselect'][value='"+sessionStorage.timeindex+"']").prop("checked","checked");
		seletime($(":radio[name='timeselect'][value='"+sessionStorage.timeindex+"']")[0]);
		appenddisplaytype(sessionStorage.SensorId);
		//if(sessionStorage.timeindex==4){
		querywarnlog();//decodedatas();
		//}	
		if(typeof(Worker) !== "undefined") {//只在网络状态下可用，本地磁盘目录下不可用。 
			if(typeof(w1) == "undefined") {
				w1 = new Worker("delay_worker.js");
			}
			var i=0;
			w1.onmessage = function(event) {
				//document.getElementById("result").innerHTML = event.data;
				i++
				if(i%60==0){
					if(sessionStorage.timeindex==5)
					showrealworning();
				}
			};
		} else {
			var t1 = window.setInterval("getrealdatabynodeid(-1);",60000);
		}
		$("#warnlogdata-tbody").height(parent.window.windowHeight-320);
		window.parent.closeloadlayer();
		}catch(err){
			showstateinfo(err.message,"warnlog/initwarnlog");
		}
	}
	/*
	function buildnode(data, level) {
		var tree = [];
		if (data == null || typeof(data) == "undefined") {
			
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
	}*/
	function appenddisplaytype(asensorid){
		try{
		var temp=document.getElementById("event_type");
		for(var i=temp.childElementCount;i>0;i--)
			temp.removeChild(temp.children[i-1]);
		var disply_type=document.getElementById("display_type")
		for(var i=disply_type.childElementCount;i>1;i--)
		disply_type.removeChild(disply_type.childNodes[i-1]);
		//for(var j=document.getElementById("event_type").childNodes.length;j>0;j--)
		//	document.getElementById("event_type").removeChild(document.getElementById("event_type").childNodes[j-1]);
		selectText="";
		if(sessionStorage.eventTypeSelected){
			sel_str=sessionStorage.eventTypeSelected.split(";");
		}else{
			sel_str=[];
		}
		var lis=$("#display_type label")
		for(var i=0;i<lis.length;i++){
			lis[i].classList.remove("active");
		}
		if(!sessionStorage.warnlogname){
			lis[0].classList.add("active");
		}
		if(asensorid>=0&&sensors){
			for(var k=0;k<sensors.length;k++){
				if(sensors[k].Value.id==asensorid){
					allcatalog=sensors[k].Value.type;//Catalog;//读取对应的Catalog项
					if(allcatalog)
					allcatalog=allcatalog.toLowerCase();
					break;
				}
			}
			if((configs)){//检查配置中是否有catalog项
				for(var i=0;i<configs.length;i++){
					if((configs[i].name.toLowerCase()==allcatalog)){
						var s_des=configs[i].details//如果有，读取其所有配置项
						for(var p in s_des){
							lab=document.createElement("label");
							/*if(p==0){
								name=s_des[p].Name;
								catalog=s_des[p].Catalog;
								lab.className="btn btn-primary active"
							}else{}*/
							
							if(s_des[p].name==sessionStorage.warnlogname){
								lab.className="btn btn-primary active"
								dname=sessionStorage.warnlogname;
								catalog=getcatalog(dname);
							}else{
								lab.className="btn btn-primary";
							}
							lab.innerHTML='<input class="catalog" type="radio" name="options" value="'+s_des[p].name+'" onclick=displaytype(this) >'+s_des[p].desc;
							var other=document.getElementById("type_other");
							disply_type.insertBefore(lab,other);//类别
							
							if(s_des[p].folder=="event"&&s_des[p].name=="event"){//告警、事件类型 
								var config=new Object()
								config=(s_des[p].config);//JSON.parse
								if(config){
									for(var c in config){
										for(var i=0;i<temp.children.length;i++){//0721 edit 判断是否存在配置项，如果存在则跳过继续，不存在则添加;
											if((temp.children[i].children[0].children[0].value==c)&&(temp.children[i].children[0].children[1].innerText==config[c])){
												isfound=true;
												break;
											}
										}
										if(isfound){
											isfound=false;
											/*for(var j=0;j<sel_str.length;j++){
												if(temp.children[i].children[0].children[1].innerText==sel_str[j]){
													temp.children[i].children[0].checked=true;
													break;  
												}
											}*/
											continue;
										}//0721 edit what will i be big 
										var li=document.createElement("li");
										var lab=document.createElement("label");
										//lab.setAttribute("style","margin-left:20px")
										var ainput=document.createElement("input");
										ainput.setAttribute("type","checkbox");
										ainput.setAttribute("name","checkbox");
										ainput.setAttribute("value",c);
										ainput.className="check_box";
										var spn=document.createElement("span");
										spn.innerHTML=config[c];
										lab.appendChild(ainput);
										lab.appendChild(spn);
										//lab.innerHTML='<input class="catalog" type="checkbox" name="options" value="'+s_des[p].Name+'" >'+s_des[p].Desc;
										li.appendChild(lab);
										temp.appendChild(li);
									}
								}
								for(var i=0;i<temp.children.length;i++){
									for(var j=0;j<sel_str.length;j++){
										if(temp.children[i].children[0].children[1].innerText==sel_str[j]){
											temp.children[i].children[0].checked=true;
											//temp.children[i].children[0].children[0].checked=true;
											break;
										}
									}
									if(temp.children[i].children[0].checked==true){//.children[0]
										selectText=selectText+temp.children[i].children[0].children[1].innerHTML+";";
										temp.children[i].children[0].children[0].checked=true;
									}
								}
								if(selectText.charAt(selectText.length - 1)==";"){
									//去除末尾分号
									selectText=selectText.substring(0,selectText.length - 1);
									//selectVal=selectVal.substring(0,selectVal.length - 1);
								}
								if(selectText==""){
									//selectText="请选择告警事件，不选为全部告警"
								}
							}
						}
					}
					break;
				}
			}else{
				for(var j=temp.childNodes.length;j>0;j--)
				temp.removeChild(temp.childNodes[j-1]);
				var li=document.createElement("li"); 
				selectText="没有告警事件选项"
			}
		}else{
			for(var j=temp.childNodes.length;j>0;j--)
			temp.removeChild(temp.childNodes[j-1]);
			var li=document.createElement("li"); 
			selectText="没有告警事件选项";
		}
		$("#select_text").val(selectText);
		//下面时按钮的点击响应函数，如果放在初始化过程，对后来动态添加的按钮不起作用。 
		$(".btn").click(function(){// 
			$(this).button('toggle');
			dname= $(".catalog:checked").val();
			sessionStorage.warnlogname=dname;
			catalog=getcatalog(dname);
			gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj,sessionStorage.jssj);
			//decodedatas(JSON.parse(localStorage.historydata));// 
		});
		}catch(err){
			showstateinfo(err.message,"warnlog/appenddisplaytype");
		}
	}
	
	function displaytype(obj){
		dname= obj.value;
		catalog=getcatalog(dname);
	}
	function decodedatas(obj_data,flag){
		try{
		/*objS = document.getElementById("jcdd");//
		var name;
		var sift=false;
		if(objS.options.length>0){
			name=objS.options[objS.selectedIndex].innerText;
		}*/
		var type_str=[];
		count = 0;
		count_h=0;
		var count_l=[];
			$("#warnlogdata-tbody").empty();//显示空了，但实际的行数还在，不过行内容已经变为空了，感觉还是逐条删除比较保险.
			$table=document.getElementById("warnlogdata-tbody");
			//for(var j=$table.rows.length-1;j>=0;j--){
			//	$table.removeChild($table.rows[j]);
			//}
			document.getElementById("tj_kssj").innerHTML=sessionStorage.kssj;
			document.getElementById("tj_zzsj").innerHTML=sessionStorage.jssj;
			if(obj_data&&obj_data.length>0){
				var warning_type=sessionStorage.eventTypeSelected;//document.getElementById("select_text").value;
				if(!warning_type){
					warning_type="";
				}
				type_str=warning_type.split(";");
					//sift=true;
				//}else{
					//warning_type="越上限;越下限";
					//type_str=warning_type.split(";");
					//sift=false;
				//}
				for(var j=0;j<=type_str.length;j++){
					count_l[j]=0;
					window.eval("var tr"+j+"=document.createElement('tr');");
					window.eval("tr"+j+'.setAttribute("id","tr'+j+'")');
					window.eval("var td"+j+"=document.createElement('td');");
					window.eval("td"+j+".setAttribute('id','td"+j+"')");
					window.eval("td"+j+".setAttribute('colspan','4')");
					if(j==type_str.length){
						window.eval("td"+j+".setAttribute('style','display:none')");
						window.eval("tr"+j+".setAttribute('style','display:none')");
					}
					window.eval("td"+j+".innerHTML='"+type_str[j]+"'");
					window.eval("tr"+j+".appendChild(td"+j+")");
					window.eval("tr"+j+".setAttribute('style','color:#f20')");
					
					$table.appendChild(window.eval("tr"+j));
					//console.log(window.eval("tr"+j));
				}
				/*var tr1=document.createElement("tr");
				tr1.setAttribute("id","tr1");
				var td_first=document.createElement("td");
				td_first.setAttribute("colspan","4");
				td_first.innerHTML=warning_sign_hight;
				td_first.setAttribute("id","td1")
				//td_first.setAttribute('style','display:none');
				//tr1.setAttribute('style','display:none');
				tr1.appendChild(td_first);
				tr1.setAttribute("style","background-color:#f70");
				$table.appendChild(tr1);
				var tr2=document.createElement("tr");
				tr2.setAttribute("id","tr2");
				//tr2.setAttribute("style","display:none");
				tr2.setAttribute("style","background-color:#07f");
				var td_second=document.createElement("td");
				td_second.setAttribute("id","td2")
				td_second.innerHTML=warning_sign_low;
				//td_second.setAttribute('style','display:none');
				td_second.setAttribute("colspan","4");
				tr2.appendChild(td_second);
				$table.appendChild(tr2);
				var tr3=document.createElement("tr");
				tr3.setAttribute("style","display:none");
				var td_third=document.createElement("td");
				td_third.setAttribute('style','display:none');
				td_third.setAttribute("colspan","4");
				tr3.appendChild(td_third);
				$table.appendChild(tr3);*/
				for (var i = 0; i <obj_data.length; i++) {
					if(obj_data[i].message){
						if((dname!="")&&(obj_data[i].name!=dname)){
							continue;
						}
						var tr=document.createElement("tr");
						tr.setAttribute("onclick","tableclick(this)");
						var td_did=document.createElement("td");
						td_did.innerHTML=sessionStorage.SensorId;//objS.options[objS.selectedIndex].value;
						td_did.setAttribute("style","display:none");
						var td_dname=document.createElement("td");
						td_dname.innerHTML=sessionStorage.SensorName;//name;
						var td_dtime=document.createElement("td");
						var time=obj_data[i].time;//(ttime-oneday*(2*i+5));
						td_dtime.innerHTML=time;//dateToString(new Date(time),2);
						var td_dadr=document.createElement("td");
						var value=obj_data[i].value;//(Math.random() * 10) - 0;
						td_dadr.innerHTML=(value*1).toFixed(Number_of_decimal);
						if(td_dadr.innerHTML=="NaN")
							td_dadr.innerHTML="-";
						var td_dtype=document.createElement("td");
						td_dtype.innerHTML=obj_data[i].message;//"数值越限";/**/
						tr.appendChild(td_did);
						tr.appendChild(td_dname);
						tr.appendChild(td_dtime);
						tr.appendChild(td_dadr);
						tr.appendChild(td_dtype);
						if(warning_type==""){
							$table.appendChild(tr);
							count++;
						}else
						for(var j=0;j<type_str.length;j++){
							if(type_str[j]!=""&&obj_data[i].message.indexOf(type_str[j])!=-1){
								$table.insertBefore(tr,window.eval("tr"+(j+1)));
								count_l[j]=count_l[j]+1;
								count++;
								//break; 
							}/*else if(obj_data[i].Message==warning_sign_hight){
								$table.insertBefore(tr,tr1);
								count_h++;
							}else{
								$table.appendChild(tr);
							}*/
						}
						/*if ((j>=type_str.length)){//20200403&&(!sift)
							$table.appendChild(tr);
							count++;
						}*/
					}
				}
				if(!count){
					if(!flag)
					showmsg("沒有符合条件的告警数据",info_showtime);
					showstateinfo("没有符合条件的告警数据");
					document.getElementById("count_val").innerHTML="";
					//document.getElementById("count_first").innerHTML="";
					//document.getElementById("count_third").innerHTML="";
					//document.getElementById("tr0").style.display="none";
					//document.getElementById("td0").style.display="none";
					//document.getElementById("tr1").style.display="none";
					//document.getElementById("td1").style.display="none";
					//document.getElementById("count_first").innerHTML=0;
					//document.getElementById("count_third").innerHTML=0;
				}else{
					//showstateinfo("");
					/*if(count_h==0){
						document.getElementById("tr0").style.display="none";
						document.getElementById("td0").style.display="none";
					}
					if(count_l==0){
						document.getElementById("tr1").style.display="none";
						document.getElementById("td1").style.display="none";
					}*/
					document.getElementById("count_val").innerHTML=count;
					//document.getElementById("count_first").innerHTML=count_l[0];
					//document.getElementById("count_third").innerHTML=count_l[1];
					//var dtr=document.getElementById(window.eval("'tr"+type_str.length+"'"));
					//$table.removeChild(dtr);//去掉最后一行（插入参考行
				}
				for(var i=0;i<=type_str.length;i++){
					////if(count_l[i]==0){
						//document.getElementById(window.eval("'td"+i+"'")).style.display="none";
						var dtr=document.getElementById(window.eval("'tr"+i+"'"));//;//.style.display="none";
						$table.removeChild(dtr);//去掉统计为零的标题行
						count_h++
					//}
				}
				count_h=type_str.length+1-count_h;//统计告警类型项的数量，数据表总量要减去告警类型统计项的标题行。
				//ps=obj_data.length;
			}else{
				//document.getElementById("count_first").innerHTML=0;
				//document.getElementById("count_third").innerHTML=0;
			}
		}catch(err){
			showstateinfo(err.message,"warnlog/decodedatas");
		}
		//display();
		page=new Page(pageSize,'warnlogtable','warnlogdata-tbody','pageindex');
	}
	function tableclick(tr){
		$(tr).siblings().css("background","");
		$(tr).css("background",color_table_cur);//区分选中行
	}

	function stopWorker(){ 
		w1.terminate();
		w1 = undefined;
	};
	//显示实时告警信息
	function showrealworning(){
		try{
		//document.getElementById("jcdd").disabled=true;
		var sift=false;
		count=0,count_l=[0,0],count_h=0;
		var timedefine=document.getElementById("timedefine");//取得主程序实时数据列表元素内容。
		var warningtab = window.parent.document.getElementById("realwarningdata-tbody");
		var trs = warningtab.getElementsByTagName("tr");
		document.getElementById("tj_kssj").innerHTML="";
		document.getElementById("tj_zzsj").innerHTML="";
		$table = document.getElementById("warnlogdata-tbody");
		//var trl = document.createElement('tr');
		if ($table == null) {
			$table = iframe_main.document.getElementById("warnlogdata-tbody");
		}
		var rowNum = $table.rows.length;
		for (var i = 0; i < rowNum; i++) {
			
			$table.removeChild($table.rows[0]);
		}
		if(trs.length>0){
			/**
			 * 在表格中定义一些关键节点（行），采用insertbifore命令时的参考节点。//
			 * 用于对表格中的数据进行分类插入，并作为分类显示的标题。tr1,tr2...
			 * **/
			 var warning_type=$("#select_text").val();
			if(warning_type.length>0){
				type_str=warning_type.split(",");
				sift=true;
			}else{
				warning_type="越上限,越下限";
				type_str=warning_type.split(",");
				sift=false;
			}

			for(var j=0;j<=type_str.length;j++){
				count_l[j]=0;
				window.eval("var tr"+j+"=document.createElement('tr');");
				window.eval("tr"+j+'.setAttribute("id","tr'+j+'")');
				window.eval("var td"+j+"=document.createElement('td');");
				window.eval("td"+j+".setAttribute('id','td"+j+"')");
				window.eval("td"+j+".setAttribute('colspan','4')");
				if(j==type_str.length){
					window.eval("td"+j+".setAttribute('style','display:none')");
					window.eval("tr"+j+".setAttribute('style','display:none')");
				}
				window.eval("td"+j+".innerHTML='"+type_str[j]+"'");
				window.eval("tr"+j+".appendChild(td"+j+")");
				window.eval("tr"+j+".setAttribute('style','color:#f20')");
				$table.appendChild(window.eval("tr"+j));
				//console.log(window.eval("tr"+j));
			}
			for (var i = 0; i < trs.length; i++) {//
				//warning_sign_low、warning_sign_hight为判断标准，在config.js里定义内容，
				/*if(trs[i].cells[5].innerText==warning_sign_low){
					$table.insertBefore($(trs[i].outerHTML)[0],tr3);
					count_l++;
				}else if(trs[i].cells[5].innerText==warning_sign_hight){
					$table.insertBefore($(trs[i].outerHTML)[0],tr2);
					count_h++;
				}*/
				for(var j=0;j<type_str.length;j++){
					if(trs[i].cells[4].innerText.indexOf(type_str[j])>=0){
						var tr=document.createElement("tr");
						tr=$(trs[i].outerHTML)[0];
						tr.setAttribute("onclick","tableclick(this)");
						$table.insertBefore(tr,window.eval("tr"+(j+1)));
						count_l[j]=count_l[j]+1;
						count++;
						break;
					}
					count++
				}
				if((j>=type_str.length)&&(!sift)){
					$table.appendChild($(trs[i].outerHTML)[0]);
					count++;
				}
			}
			for(var i=0;i<=type_str.length;i++){
				if(count_l[i]==0){
					//document.getElementById(window.eval("'td"+i+"'")).style.display="none";//neighbourhood
					var dtr=document.getElementById(window.eval("'tr"+i+"'"));//;//.style.display="none";
					$table.removeChild(dtr);//去掉统计为零的标题行
					count_h++; 
				}
			}
			count_h=type_str.length+1-count_h;//统计告警类型项的数量，数据表总量要减去告警类型统计项的标题行。
			//var dtr=document.getElementById(window.eval("'tr"+type_str.length+"'"));//20200403
			//$table.removeChild(dtr);//去掉最后一行（插入的参考行）
		}else{
			showmsg("当前没有告警!",info_showtime);
			showstateinfo("当前没有告警信息");
		}
		//document.getElementById("count_first").innerHTML=count_l[0];
		//document.getElementById("count_third").innerHTML=count_l[1];
		}catch(err){
			showstateinfo(err.message,"warnlog/showrealworning");
		}
		display();
	}
	/*function refreshsensorslist(){
		window.parent.GetSensorsByNode(sessionStorage.nodeId);
	}*/

	/*function display(){   
		//var $table=$("#warnlogdata-tbody");
		if(!$table){
			return;
		}
		len =$table.rows.length ;    //- 1;// 求这个表的总行数，剔除第一行介绍
		page=len % pageSize==0 ? len/pageSize : Math.floor(len/pageSize)+1;//根据记录条数，计算页数
		// alert("page==="+page);
		curPage=1;    // 设置当前为第一页
		displayPage(1);//显示第一页
		document.getElementById("btn0").innerHTML="当前 " + curPage + "/" + page + " 页    每页 ";    // 显示当前多少页
		document.getElementById("sjzl").innerHTML="数据总量 <span class='badge' style='font-size:18px'>" + len + "";        // 显示数据量 数据表总量要减去告警类型统计项的标题行。
		document.getElementById("pageSize").value = pageSize;
	}
		function firstPage(){    // 首页
			curPage=1;
			direct = 0;
			displayPage();
		}
		function frontPage(){    // 上一页
			direct=-1;
			displayPage();
		}
		function nextPage(){    // 下一页
			direct=1;
			displayPage();
		}
		function LastPage(){    // 尾页
			curPage=page;
			direct = 0;
			displayPage();
		}
		function changePage(){    // 转页
			curPage=document.getElementById("changePage").value * 1;
			if (!/^[1-9]\d*$/.test(curPage)) {
				showmsg("请输入正整数",info_showtime);
				return ;
			}
			if (curPage > page) {
				showmsg("超出数据页面",info_showtime);
				return ;
			}
			direct = 0;
			displayPage();
		}
		function setPageSize(){    // 设置每页显示多少条记录
			pageSize = document.getElementById("pageSize").value;    //每页显示的记录条数
			if (!/^[1-9]\d*$/.test(pageSize)) {
				showmsg("请输入正整数",info_showtime);
				return ;
			}
			//len =$table.rows.length;// - 1;
			page=len % pageSize==0 ? len/pageSize : Math.floor(len/pageSize)+1;//根据记录条数，计算页数
			curPage=1;        //当前页
			direct=0;        //方向
			firstPage();
			displayPage();
		}
	function displayPage(){
		if(curPage <=1 && direct==-1){
			direct=0;
			showmsg("已经是第一页了",info_showtime);
			return;
		} else if (curPage >= page && direct==1) {
			direct=0;
			showmsg("已经是最后一页了",info_showtime);
			return ;
		}
		//lastPage = curPage;
		// 修复当len=1时，curPage计算得0的bug
		if (len > pageSize) {
			curPage = ((curPage + direct + len) % len);
		} else {
			curPage = 1;
		}
		document.getElementById("btn0").innerHTML="当前 " + curPage + "/" + page + " 页    每页 ";        // 显示当前多少页
		begin=(curPage-1)*pageSize ;// 起始记录号
		end = begin + 1*pageSize ;    // 末尾记录号
		if(end > len ) end=len;
		//var theTable=$("#warnlogdata-tbody");// document.getElementById("warnlogdata-tbody");
		for ( var i = 0; i<len; i++ ) {
			$table.rows[i].style.display = 'none';
		}
		for ( var i = begin; i<end; i++ ) {
			$table.rows[i].style.display = '';
		}
		/*$table.find("tr").hide();    // 首先，设置这行为隐藏
		$table.find("tr").each(function(i){    // 然后，通过条件判断决定本行是否恢复显示
			if((i>=begin && i<=end) )//显示begin<=x<=end的记录
				$(this).show();
		});
		}*/
		
		var selectText
		$(document).on("click",".check_box",function(event){
		event.stopPropagation();//阻止事件冒泡，防止触发li的点击事件
		//勾选的项
		var $selectTextDom=$(this).parent().parent().parent("ul").siblings("label").children(".select_text");
		//勾选项的值
		//var $selectValDom=$(this).parent().parent().parent("ul").siblings(".select_val");
		//是否有选择项了
		var isSelected=!event.currentTarget.checked;// $selectTextDom[0].getAttribute("data-is-select");
		//var selectText="";//文本值，用于显示
		//var selectVal=$selectValDom.val();//实际值，会提交到后台的
		var selected_text=$(this).siblings("span").text();//当次勾选的文本值
		var selected_val=$(this).val();//当次勾选的实际值
		//判断是否选择过
		if(isSelected==true){
			selectText=$selectTextDom.val();
		}
		if(selectText!=""&&selectText!="没有告警事件选项"&&selectText!="请选择告警事件，不选为全部告警"){
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
		sessionStorage.eventTypeSelected=selectText;
		//$selectValDom.val(selectVal);
		if(selectText==""){
			$selectTextDom.val("请选择告警事件，不选为全部告警");
			$selectTextDom[0].setAttribute("data-is-select","false");
		}else{
			$selectTextDom[0].setAttribute("data-is-select","true");
		}
		var i_sel=$('input[name="timeselect"]:checked').val();//20200403添加筛选条件改变后自动刷新列表
		switch(i_sel*1){
			case 0:	case 1:	case 2:	case 3:	case 4:
				//gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj,sessionStorage.jssj);
				decodedatas(JSON.parse(localStorage.historydata),true);
				break;
			case 5:
				showrealworning();
				break;
		}
	});

	//告警信息查询按钮  used by electricroommonitor
function querywarnlog(num) {
	/*var sel=document.getElementById("jcdd");
	if(sel.options.length<=0){
		layer.alert("请选择要查询的测量点名称",info_showtime);
		showstateinfo("请选择要查询的测量点名称");
		return;
	}*/
	//sessionStorage.SensorId = sel.value;//document.getElementById("jcdd")
	//sessionStorage.SensorName = sel.options[document.getElementById("jcdd").selectedIndex].text;
	stoptimer(timer);//关闭闪烁
	if(sessionStorage.timeindex==4){
		var kssj = document.getElementById("kssj_warning").value;
		if ((kssj == null) || (kssj == "") || (typeof(kssj) == "undefined")) {
			showmsg("请指定开始时间",info_showtime);
			showstateinfo("请指定开始时间");
			return;
		}
		sessionStorage.kssj = kssj;
		var jssj = document.getElementById("jssj_warning").value;
		if ((jssj == null) || (jssj == "") || (typeof(jssj) == "undefined")) {
			showmsg("请指定截至时间",info_showtime);
			showstateinfo("请指定截止时间");
			return;
		}
		sessionStorage.jssj = jssj;
	}
	$("#warnlogdata-tbody tr").empty();
	if (num == 0) {//name 改为dname 20200520 edit;at the options was null,get the all data;
		gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj,sessionStorage.jssj);
	} else {
		gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj,sessionStorage.jssj);
	}
}
/*告警类型项目的添加为空时提示，历史状态页添加信息统计显示项 bootstap的组件内容类定义，对代码进行简化
	添加标签目录树，标签目录树的根据节点自动更新，配置项根据标签自动更新，时段与查询的对应，动态按钮组的响应过程，导出到excel按钮位置
	点击时段选择跳出提示框，更换标签时，告警事件选项重复加载，采用二次树形菜单来选择标签项，标签选择项调整，原隐藏。
	按钮样式（选中、颜色）选项记忆和获取共以及显示内容。下载页结构调整，去除多余关联文件。按钮组样式
	1019 类型名称的忽略大小写，
	选择实时告警时不能自动关闭时段选择控件的问题，实时数据页面导出图标和导出功能函数。
	添加根据类别分组选择来对告警信息进行筛选的古城函数，
	1123 修改导出操excel时的表头格式，修改列表时非数字的数值显示内容“-”取代NaN形式，防止误解。
	1126 去掉二次菜单
	1211 登录页面在登录失败时控制台报错问题（元素未找到）；对其他页面进行现场保存处理，
	添加页面现场信息保存，在当前页面点击浏览器刷新按钮时，直接进入当前页面,同时杜绝因早不到页面元素而报错。
	
*/
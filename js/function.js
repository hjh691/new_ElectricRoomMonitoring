var token = "1234567";//后台http认证码
//localStorage.errortime=0;
sessionStorage.dataId = 0;
//sessionStorage.sensors=[];
//sessionStorage.timeindex=0;
var maps=[];
var str_speech = "告警";//告警信息
function KeyUp() {
	if (event.keyCode == 13) {
		event.keyCode = 9;
		//layer.alert(event.srcElement.id);
		if (event.srcElement.id == "password") //如果最后一个焦点在验证码上
		{
			event.returnValue = false;
			document.all("btn_login").click(); //btnlogin :服务器按钮的id
		}
	}
} //end function
//获取当前日期和时间
/**
format=1时，精确到日，  
format=2时，精确到分。  used by electricroommonitor 
*/
function getCurrentDate(format) {
	var now = new Date();
	var year = now.getFullYear(); //得到年份
	var month = now.getMonth(); //得到月份
	var date = now.getDate(); //得到日期
	var day = now.getDay(); //得到周几
	var hour = now.getHours(); //得到小时
	var minu = now.getMinutes(); //得到分钟
	var sec = now.getSeconds(); //得到秒
	month = month + 1;
	if (month < 10) month = "0" + month;
	if (date < 10) date = "0" + date;
	if (hour < 10) hour = "0" + hour;
	if (minu < 10) minu = "0" + minu;
	if (sec < 10) sec = "0" + sec;
	var time = "";
	//精确到天，
	if (format == 1) {
		time = year + "-" + month + "-" + date;
	}
	//精确到分
	else if (format == 2) {
		time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
	}
	return time;
}
function dateToString(now,format){
	if(now==null)
		return;
	if(typeof(now)!="object")
		now=new Date(now);
	var year = now.getFullYear(); //得到年份
	var month = now.getMonth(); //得到月份
	var date = now.getDate(); //得到日期
	var day = now.getDay(); //得到周几
	var hour = now.getHours(); //得到小时
	var minu = now.getMinutes(); //得到分钟
	var sec = now.getSeconds(); //得到秒
	month = month + 1;
	if (month < 10) month = "0" + month;
	if (date < 10) date = "0" + date;
	if (hour < 10) hour = "0" + hour;
	if (minu < 10) minu = "0" + minu;
	if (sec < 10) sec = "0" + sec;
	var time = "";
	//精确到天
	if (format == 1) {
		time = year + "-" + month + "-" + date;
	}
	//精确到分
	else if (format == 2) {
		time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
	}
	return time;
}
/// <summary>
/// GMT时间转成本地时间
/// </summary>
/// <param name="gmt">字符串形式的GMT时间</param>
/// <returns></returns>
function GMTToStr(time){
    let date = new Date(time)
    let Str=date.getFullYear() + '-' +
    (date.getMonth() + 1) + '-' +
    date.getDate() + ' ' +
    date.getHours() + ':' +
    date.getMinutes() + ':' +
    date.getSeconds()
    return Str
}
//读取本地json文件userinfo.txt"：
function getJsonFile(fileName) {
	$.getJSON("js/" + fileName,
	function(data) {
		$.each(data,
		function(i, item) {
			$("#disp").append("<h3>" + item.name + "</h3>");
			$("#disp").append("<p>" + item.sex + "</p>");
			$("#disp").append("<p>" + item.email + "</p>");
		});
	});
}
function showmsg(msg){
	layer.open({
		time:info_showtime,
		content:"<div>"+msg+"</div>",
	});
	/*Alert(msg,info_showtime);*/
}
//初始化登录页面： used by electricroommonitor 
function initlogin() {
	//localStorage.backfile="E:\ElectricRoomMonitoring\res";
	//previewHandle(localStorage.backfile);
	if((localStorage.backfile!=undefined)&&(localStorage.backfile!=null)&&(localStorage.backfile!="")){
		jfjk_base_config.bg_src=localStorage.backfile;
	}
	//document.getElementById("login_pic").src = jfjk_base_config.login_src;
	document.getElementById("company_name").innerHTML = jfjk_base_config.app_name;
	document.getElementById("company_name").style="color:"+jfjk_base_config.appname_font_color;
	document.getElementById("main").style="background:url("+jfjk_base_config.bg_src+")no-repeat center top ;background-size:100%";// 
	var width_screen = $(window).width();
	var height_screen = $(window).height();
	var wh = width_screen / height_screen;
	var bgurl = 1.2;//背景图宽高比
	if (bgurl > wh){
		$("body").css("background-size","auto 100%");
	}else {
		$("body").css("background-size","100% auto");
	}
	//localStorage.backfile="res/bj03.jpg";
	$("#username").focus();
	$("#form1").validate();
}
//读取本地图片
function previewHandle(fileDOM) {
    var file = fileDOM.files[0], // 获取文件
        imageType = /^image\//,
        reader = '';
    // 文件是否为图片
    if (!imageType.test(file.type)) {
        alert("请选择图片！");
        return;
    }
    // 判断是否支持FileReader    
    if (window.FileReader) {
        reader = new FileReader();
    }
    // IE9及以下不支持FileReader
    else {
        alert("您的浏览器不支持图片预览功能，如需该功能请升级您的浏览器！");
        return;
    }
    // 读取完成    
    reader.onload = function (event) {
        // 获取图片DOM
        var img = document.getElementById("preview-img");
        // 图片路径设置为读取的图片    
        jfjk_base_config.bg_src = event.target.result;
    };
    reader.readAsDataURL(file);
}
//判断用户名和密码输入是否符合语法  used by electricroommonitor 
function LoginOrder(name, ps,flag,order,callback,datas) {
	var url = localStorage.server_url + "Login?name=" + name + "&pass=" + ps;
	url = encodeURI(url);
	$.ajax({
		url: url,
		type: 'GET',
		beforeSend: function(request) {
			request.setRequestHeader("Token", token);
			//sessionStorage.islogin = false;
		},
		dataType: 'json',
		timeout: 10000,
		error: function(data, status) {
			if (status == "timeout") {
				showmsg("登录超时",info_showtime);
				showstateinfo("登录超时","loginOrder");
			} else if(data.hasOwnProperty("responseJSON")&&data.responseJSON==undefined){//0928修改，判断是否由此项
				showmsg("服务器连接失败，请稍后重试",info_showtime);
				showstateinfo("服务器连接失败，请稍后重试","loginOrder");
			}else {
				showmsg(data.responseText,info_showtime);
				showstateinfo(data.responseText,order);
				if(flag==0)
					sessionStorage.islogin = false;
			}
			sessionStorage.errortime++;
			if(sessionStorage.errortime>=4){
				sessionStorage.islogin=false;
				showusername(true);
			}
		},
		success: function(data, status,xml) {
			var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
			if (status == "success") {
				sessionStorage.errortime = 0;
				showstateinfo(xml,"loginOrder");
				if (data.Error == null) {
					//sessionStorage.userinfo=JSON.stringify(data);
					sessionStorage.token ="Bearer "+ data.accessToken;
					sessionStorage.accessToken=data.accessToken;
					sessionStorage.refreshtoken=data.refreshToken;
					sevsertime=GMTToStr(xml.getResponseHeader("date"));
					sessionStorage.td=GetDateDiff(sevsertime,getCurrentDate(2),"second");
					var d=new Date(data.expire);
					var dd=(new Date(d.setSeconds(d.getSeconds()+parseInt(sessionStorage.td))))
					sessionStorage.refreshtime=dateToString(dd,2);
					
					localStorage.username = name;
					sessionStorage.islogin = true;
					if ((flag==0)) {//修改第一次登录不能进入主页面的问题。&&(!sessionStorage.errortime || (sessionStorage.errortime == 0))
						window.location.href = "mainpage.html";
						
						showstateinfo(localStorage.username+"用户登录成功!","loginOrder");
					} else {
						showusername();
						showstateinfo(localStorage.username+"用户重新登录成功!","loginOrder");
						if(order!=null)
							sendorder(order,callback,datas);
					}
				} else {
					sessionStorage.islogin = false;
					window.location.href = "index.html";
					showmsg("登录失败，" + data.Error + ",请确认输入信息正确，注意字母的大小写。",info_showtime);
					showstateinfo("登录失败","loginOrder");
					sessionStorage.errortime++;
				}
			}
		}
	});
}
//刷新安全证书 used by electricroommonitor
function RefreshToken(order,callback,datas){
	//if(wsconnect){
	//	wssend("RefreshToken",JSON.parse('{"refreshToken":"'+sessionStorage.refreshtoken+'"}'));
	//}else this function is refesh the te accesse token
	{
		sendorder("RefreshToken?refreshToken=" + sessionStorage.refreshtoken,function(data){
			refreshtoken_bc(data,order,datas)
		});
	}
	if(datas)
		//localStorage.username = name;
		sendorder(order,callback,datas);
}
function refreshtoken_bc(data){
	try{
	if (data) {
		//sessionStorage.userinfo=JSON.stringify(data);
		sessionStorage.token ="Bearer "+ data.accessToken;
		sessionStorage.accessToken=data.accessToken;
		sessionStorage.refreshtoken=data.refreshToken;
		sessionStorage.islogin = true;
		var d=new Date(data.expire);
		var dd=(new Date(d.setSeconds(d.getSeconds()+parseInt(sessionStorage.td))))
		sessionStorage.refreshtime=dateToString(dd,2);
		showstateinfo("认证码刷新成功");
	}else{
		LoginOrder(localStorage.username,sessionStorage.password,1,order,callback,datas);
	}
	}catch(err){
		showstateinfo(err+" reLogin","RefreshToken");
	}
}
//用户登录  used by electricroommonitor 
function login() {
	sessionStorage. islogin = false;
	var sname = document.getElementById('username').value;
	if ((sname == '') || (sname == null)) {
		layer.alert('请输入用户名称!',info_showtime);
		//showstateinfo("请输入用户名称");
	} else {
		var sps = document.getElementById('password').value;
		if ((sps == '') || (sps == null)) {
			layer.alert('密码为空，请输入密码',info_showtime);
			//showstateinfo("密码为空,请输入密码");
		} else {
			if ((sname != '') && (sps != '')) {
				//layer.alert(sname);
				localStorage.username = sname;
				sessionStorage.password = sps;
				LoginOrder(sname, sps,0);
			}
		}
	}
}
//退出登录 used by electricroommonitor
function logout(){
	//sessionStorage.SensorId=-1;
	//sessionStorage.nodeId=-1;
	//sessionStorage.nodeid=-1;
	sendorder("Logout",function(data){
		if (data){//.Error == null) {
			localStorage.username = "未登录";
			//sessionStorage.sps="1";//退出标志
			sessionStorage.islogin = false;
			top.location.href = "index.html";//使用top代替window，获取最顶层窗口
			init_var();
			return;
		}
	});
	localStorage.username = "未登录";
	sessionStorage.islogin = false;
	top.location.href = "index.html";//使用top代替window，获取最顶层窗口
	init_var();
}
//页面变量复位 use by electricroommonitoring 点击退出或关闭页面时执行此复位程序
function init_var(){
	sessionStorage.SensorId=-1;//标签编号
	sessionStorage.BinariesId=-1;//一次侧图形编号
	sessionStorage.SensorName="";//测量标签名称
	sessionStorage.dataId=0;//实时数据的编号
	//sessionStorage.sensors=[];
	sessionStorage.comperator_sensors=[];//参加对比的标签
	sessionStorage.nodeId=-1;//节点树的选择项
	sessionStorage.selNodeId="";//选中的节点
	sessionStorage.sel_id=-1;//标签树的选择项
	sessionStorage.pageindex=2;//登录后显示的首页
	//localStorage.setItem("realdata",null);
	sessionStorage.setItem("sel_datatypename",[]);
	delete sessionStorage.kssj;
	delete sessionStorage.jssj;
	delete sessionStorage.cxsj;
	window.speechSynthesis.cancel();
	sessionStorage.allscreen=false;
	localStorage.server_url=undefined;
}
//获取用户详细信息 used by electricroommonitor
function GetUserProfile() {
	if(window.parent.wsconnect){
		window.parent.wssend("GetProfile",JSON.parse("{}"));
	}else{
		sendorder("GetProfile",getprofile_bc);
	}
}
function getprofile_bc(data){
	//localStorage.errortime = 0;
	//sessionStorage.islogin = true;
	if(data){
		$("#up-yhbh").val(data.id);
		$("#up-yhmc").val(data.name);
		$("#up-yhmm").val(""); //data.Result.UserPass;
		$("#up-yhqx").val(data.roles);//UserLimit;
		$("#up-tel").val(data.tele);//UserLimit;
		$("#up-email").val(data.email);//UserLimit;
		$("#up-yhsm").val(data.display);//Description;
	}
}
//初始化信息汇总页面
function inittotalpage(){  // used by electricroommonitor
	if(sessionStorage.pageindex!=0){
		sessionStorage.pageindex=0;
		document.getElementById("iframe_main").src="infototal.html";
	}
}
// 初始化实时数据页面，根据不同站点、不同子系统来调用不同的页面 used by electricroommonitor 
function initrealdata(){
	if(sessionStorage.pageindex!=2){
		var pages=document.getElementById("iframe_main");
		//var data=$("#tree").treeview("getSelected");
		//if(pages.src.indexOf("/newrealdata.html")<=0){
			pages.src="newrealdata.html";
		//}
		sessionStorage.pageindex=2;
	}
}
function initotherdata(){
	if(sessionStorage.pageindex!=17){
		sessionStorage.pageindex=17;
		var ifm=$('#iframe_main');
		ifm.attr('src','realdata_iot.html');
	}
	updatapcnav(17);
}
//初始化机房监控子系统实时状态页面...used by electricroommonitor
function initrealstate(){
	if(sessionStorage.pageindex!=10){
		var pages=document.getElementById("iframe_main");
		//var data=$("#tree").treeview("getSelected");
		if(pages.src.indexOf("/realstate.html")<=0){
			pages.src="realstate.html";
		}
		sessionStorage.pageindex=10;
	}
}
//初始化机房监控历史状态 used by electricroommonitor//暂时没有用
function inithistorystate(){
	if(sessionStorage.pageindex!=11){
		var pages=document.getElementById("iframe_main");
		//var data=$("#tree").treeview("getSelected");
		if(pages.src.indexOf("/historystate.html")<=0){
			pages.src="historystate.html";
		}
		sessionStorage.pageindex=11;
	}
}
//网络连接心跳包  no used concent 
function sendbeat(){
	i++;
	var stime=new Date(getCurrentDate(2).replace(/-/,"/")).getTime();
	var etime=new Date(getCurrentDate(1).replace(/-/,"/")+" 17:30:00").getTime();
	showstateinfo((etime-stime)/1000,"sendbeat");
	if ((i % 60 == 0)&&(sessionStorage.islogin=="true")) {
		//sendbeat();
		getrealdatabynodeid(realdataid);
		//GetBinariesByType("NodeGraphic",sessionStorage.nodeId);
	}
	if((i % 300==0)&&(sessionStorage.islogin=="false")){
		LoginOrder(localStorage.username,sessionStorage.password,1);
	}
	if((i % 900==0)&&(sessionStorage.islogin=="true")){
		RefreshToken();
	}
}
//主页面显示用户名称  used by electricroommonitor 
function showusername(flag) {
	var yhname = document.getElementById('yhname');
	if(!yhname){
		yhname=parent.window.document.getElementById("yhname");
	}
	if((!flag)||(sessionStorage.islogin=="true"))//发生错误时显示“未登录”
		yhname.innerHTML = "<a href='javascript:void(0)' onclick='loaduserprofile()' style='color:white;text-decoration: none;'>" + localStorage.username + "</a>"
	else
		yhname.innerHTML="未登录"; //#屏蔽href=userprofile.html
	var yhout=document.getElementById('yhout');
	if(!yhout){
		yhout=parent.window.document.getElementById('yhout');
	}
	if (sessionStorage.islogin == "true") {
		yhout.innerHTML = "<a href='javascript:logout()' style='color:white;text-decoration: none;'>[退出]</a>";
		//document.getElementById("iframe_main").src="userprofile.html";
	} else {
		yhout.innerHTML = "<a href='index.html' style='color:white;text-decoration: none;'>[登录]</a>";
	}
}
//用户属性页面 used by ele
function loaduserprofile(){
	sessionStorage.pageindex=20;
	document.getElementById("iframe_main").src="userprofile.html";
}
//跳转到历史数据  used by electricroommonitor
function tohistory(sorid) {
	sessionStorage.SensorId = sorid;
	parent.window.document.getElementById('iframe_main').src = 'historydata.html';
}
//跳转到告警信息查询  used by electricroommonitor
function towarnlog(sorid) {
	flag_warning = 0;
	sessionStorage.SensorId = sorid;
	parent.window.document.getElementById('iframe_main').src = 'warnlog.html';
	//querywarnlog(0);
}
//显示或关闭浮动窗口 userd by ele
function showfudongdiv() {
	//document.getElementById("alert_info").innerHTML="告警：温度过高，数值：12345.876";
	//if (document.getElementById("KeFuDiv").style.display == "none") {
	//	document.getElementById("KeFuDiv").style.display = "block";
	//}
	document.getElementById("KeFuDiv").show;
}
function hidefudongdiv() {
	//if (document.getElementById("KeFuDiv").style.display == "block") {
	//	document.getElementById("KeFuDiv").style.display = "none";
	//}this is my program code 
	document.getElementById("KeFuDiv").hidden;
	//parent.window.document.getElementById('iframe_main').src='realwarning.html';
}
//获取全部的实时数据//
function getrealsbydataid() {
	var stationname = "",
	sensorname = "",
	alerttime = "",
	alertinfo = "",
	alertvalue = "",
	collectorid = -1;
	if (typeof(sessionStorage.dataId) == "undefined") {
		sessionStorage.dataId = 0;
	}
	var url = jfjk_base_config.baseurl + "GetRealsNew?dataId=" + sessionStorage.dataId;
	url = encodeURI(url);
	if ((sessionStorage.islogin == "true") && (sessionStorage.errortime <= 3)) {
		$.ajax({
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function(jqXHR, textStatus, errorThrown) {
				sessionStorage.errortime++;
				if (errorThrown == "Unauthorized") {
					showmsg(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取实时数据操作失败',info_showtime);
				} else {
					showmsg(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取实时数据操作失败',info_showtime);
				}
				if(sessionStorage.errortime>3){
					sessionStorage.islogin=false;
				}
			},
			success: function(data, status) {
				var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if (status == "success") {
					sessionStorage.errortime = 0;
					sessionStorage.islogin = true;
					if (data.Error == null) {
						var sensors = new Object(),
						collectors = new Object(),
						stations = new Object(),
						tmps = new Object(),
						vals = new Object(),
						errs = new Object();
						//温度值
						var datas = new Object();
						if (jQuery.isEmptyObject(data.Result.Datas)) {
							//Alert("数据为空");
							return;
						} else {
							//datas = data.Result.Datas;
						//}
						//if (!jQuery.isEmptyObject(datas.Tmp)) {
							tmps = data.Result.Datas;//.Tmp
							var tbody = document.getElementById('realdata-tbody');
							var trs = tbody.getElementsByTagName("tr");
							for (var i = 0; i < tmps.length; i++) {
								//刷新实时数据列表内容
								for (var j = 0; j < trs.length; j++) {
									if (trs[j].cells[0].childNodes[0].data == data.Result.Datas.Tmp[i].SensorId) {
										trs[j].cells[2].innerHTML = data.Result.Datas.Tmp[i].Time;
										trs[j].cells[3].innerHTML = data.Result.Datas.Tmp[i].Value;
										break;
									}
								}
								if (j >= trs.length) {
									var tr = document.createElement('tr');
									var tdid = document.createElement('td');
									var tdename = document.createElement('td');
									//var tdsalary=document.createElement('td');
									var tdage = document.createElement('td');
									var tddiscr = document.createElement('td');
									var tdhistory = document.createElement('td');
									var tdwarnlog = document.createElement('td'); {
										tdid.innerHTML = data.Result.Datas.Tmp[i].SensorId;
									}
									for (j = 0; j < data.Result.Sensors.Sensors.length; j++) {
										if (data.Result.Datas.Tmp[i].SensorId == data.Result.Sensors.Sensors[j].Id) {
											tdename.innerHTML = data.Result.Sensors.Sensors[j].Name;
											break;
										}
									}
									//tdename.innerHTML=data.Result[i].SensorName;//jsonObject[i].name;
									tdage.innerHTML = data.Result.Datas.Tmp[i].Time; //jsonObject[i].color;
									tddiscr.innerHTML = data.Result.Datas.Tmp[i].Value;
									tdhistory.setAttribute('backgroundColor', '#ffffff');
									tdhistory.setAttribute('onclick', 'tohistory(' + tdid.innerHTML + ')');
									tdhistory.innerHTML = "<button href='javascript:void(0)'>>></button>";
									tdwarnlog.setAttribute('onclick', 'towarnlog(' + tdid.innerHTML + ')');
									tdwarnlog.setAttribute('backgroundColor', '#ffffff');
									tdwarnlog.innerHTML = '<button href="javascript:void(0)">>></button>';
									tr.appendChild(tdid);
									tr.appendChild(tdename);
									tr.appendChild(tdage);
									tr.appendChild(tddiscr);
									tr.appendChild(tdhistory);
									tr.appendChild(tdwarnlog);
									if (i % 2 == 0) {
										tr.cells[0].style.backgroundColor = "#16b9c9";
										tr.cells[1].style.backgroundColor = "#16b9c9";
										tr.cells[2].style.backgroundColor = "#16b9c9";
										tr.cells[3].style.backgroundColor = "#16b9c9";
									} else {
										tr.cells[0].style.backgroundColor = "#FFFFFF";
										tr.cells[1].style.backgroundColor = "#FFFFFF";
										tr.cells[2].style.backgroundColor = "#FFFFFF";
										tr.cells[3].style.backgroundColor = "#FFFFFF";
									}
									//tdage.setAttribute('class','time');
									//tdid.setAttribute('class','sensorid');
									//tddiscr.setAttribute('class','tmpvalue');
									//tdename.setAttribute('class','sensorname');
									/**关关雎鸠在河之洲窈窕淑女君子好逑参差荇菜左右流之窈窕淑女寤寐求之求之不得寤寐思服悠哉游哉辗转反侧
									 * 
									 */
									var tbody = document.getElementById('realdata-tbody');
									tbody.appendChild(tr);
								}
							}
							if (sessionStorage.dataId < parseInt(tmps[tmps.length - 1].Id)) {
								sessionStorage.dataId = parseInt(tmps[tmps.length - 1].Id);
							}
						}
						//告警标签信息；
						if (!jQuery.isEmptyObject(datas.Err)) {
							errs = data.Result.Datas.Err;
							if (sessionStorage.dataId < parseInt(errs[errs.length - 1].Id)) {
								sessionStorage.dataId = parseInt(errs[errs.length - 1].Id);
							}
							var str_alert = "告警：";
							var tbody = document.getElementById("realwarningdata-tbody");
							if (tbody == null) {
								tbody = window.parent.document.getElementById("realwarningdata-tbody");
							}
							var rowNum = tbody.rows.length;
							var tr = document.createElement('tr');
							for (var i = 0; i < rowNum; i++) {
								tr = tbody.rows[0];
								tbody.removeChild(tr);
							}
							var gaojing = document.getElementById("alert_info");
							if (gaojing == null) {
								gaojing = parent.window.document.getElementById("alert_info");
							}
							var fdck = document.getElementById("KeFuDiv");
							if (fdck == null) {
								fdck = parent.window.document.getElementById("KeFuDiv");
							}
							for (var i = 0; i < errs.length; i++) {
								//告警清除
								if (jQuery.isEmptyObject(errs[i].Value)) {
									for (var j = 0; j < sensors.length; j++) {
										if (errs[i].SensorId == sensors[j].Id) {
											var adr = sensors[j].Addr;
											sensorname = sensors[j].Name;
											collectorid = sensors[j].CollectorId;
											for (var l = 0; l < collectors.length; l++) {
												if (collectorid == collectors[l].Id) {
													stationname = collectors[l].Name;
													var str_binding = collectors[l].Channel + "_" + adr;
													break;
												}
											}
											break;
										}
									}
									if (j >= sensors.length) {
										continue;
									}
									try {
										for (var k = 0; k < graphic.length; k++) {
											if (!graphic[k]) {
												continue;
											}
											var str = JSON.parse(graphic[k]);
											if (str._shape.Binding == str_binding) {
												if ((str._type == "Title") || (str._type == "Monitor")) {
													str._shape.IsError = false;
													graphic[k] = JSON.stringify(str);
												} else {
													str._shape.IsError = false;
													graphic[k] = JSON.stringify(str);
												}
											}
										}
									} catch(err) {
									}
									continue;
								}
								//有告警
								for (var j = 0; j < sensors.length; j++) {
									if (errs[i].SensorId == sensors[j].Id) {
										var adr = sensors[j].Addr;
										sensorname = sensors[j].Name;
										collectorid = sensors[j].CollectorId;
										for (var l = 0; l < collectors.length; l++) {
											if (collectorid == collectors[l].Id) {
												stationname = collectors[l].Name;
												var str_binding = collectors[l].Channel + "_" + adr;
												break;
											}
										}
										break;
									}
								}
								if (j >= sensors.length) {
									continue;
								}
								try {
									for (var k = 0; k < graphic.length; k++) {
										if (!graphic[k]) {
											continue;
										}
										var str = JSON.parse(graphic[k]);
										if (str._shape.Binding == str_binding) {
											if ((str._type == "Title") || (str._type == "Monitor")) {
												//str._shape.Text=errs[i].TmpValue;
												str._shape.IsError = true;
												graphic[k] = JSON.stringify(str);
											} else {
												str._shape.IsError = true;
												graphic[k] = JSON.stringify(str);
											}
										}
									}
								} catch(err) {
								}
								alerttime = errs[i].Time.substr(11);
								alertinfo = errs[i].Value;
								alertvalue = errs[i].TmpValue;	
								var speech = document.getElementById("chatData");
								if (speech == null) {
									speech = parent.window.document.getElementById("chatData");
								}
								if(alertvalue!==null){
								str_speech = "告警" + stationname + sensorname + alertinfo + "数值" + alertvalue;
								str_alert = str_alert + " " + alerttime + "  " + stationname + ": " + sensorname + " " + alertinfo + " 数值为:" + alertvalue;
								}else{
									str_speech = "告警" + stationname + sensorname + alertinfo ;
									str_alert = str_alert + " " + alerttime + "  " + stationname + ": " + sensorname + " " + alertinfo + " ";// + alertvalue;
								}
								gaojing.innerHTML = "<pre>" + str_alert + "</pre>";
								speech.innerHTML = str_speech;
								//fdck.style.display="block";
								//---实时告警列表---
								tr = document.createElement('tr');
								var tdid = document.createElement('td');
								var tdname = document.createElement('td');
								var tdvalue = document.createElement('td');
								var tdtime = document.createElement('td');
								var tddiscr = document.createElement('td');
								tdid.innerHTML = stationname;
								tdname.innerHTML = sensorname;
								tdvalue.innerHTML = alertvalue; //jsonObject[i].name;
								tdtime.innerHTML = alerttime; //jsonObject[i].color;
								tddiscr.innerHTML = alertinfo;
								tr.appendChild(tdid);
								tr.appendChild(tdname);
								tr.appendChild(tdtime);
								tr.appendChild(tdvalue);
								tr.appendChild(tddiscr);
								var tbody = document.getElementById("realwarningdata-tbody");
								if (tbody == null) {
									tbody = window.parent.document.getElementById("realwarningdata-tbody");
								}
								tbody.appendChild(tr);
								//--实时告警列表---
								//spack();
							}
							if (typeof(speech) != "undefined") {
								speech.click();
								fdck.style.display = "block";
								fdck.hide;
								fdck.show;
							} else {
								gaojing.innerText = "";
								fdck.style.display = "none";
								fdck.hide;
							}
						}
						if (sessionStorage.pageindex == 1) {
							drawmap(graphic);
							sessionStorage.contents = JSON.stringify(graphic);
						}
						if (sessionStorage.pageindex == 7) {
							initrealwarning();
						}
					} else {
						showmsg(data.Error,info_showtime);
					}
				}
			}
		});
	} else {
		//layer.alert("与后台服务器连接失败",info_showtime);//卤煮鸡、烤鱼、
		sessionStorage.islogin = false;
		//LoginOrder(localStorage.username,sessionStorage.password);
	}
}
/**获取站点信息列表。状态图、实时数据、历史数据、趋势图、告警查询、短信日志查询导航按钮
点击时执行必要的操作，更新左侧的站点或图形信息列表（如果已经是站点列表或图形列表怎不进行
切换操作，只更新右侧主框架内个目标页面。
*/
//load//////reuse  used by electricroommonitor 
function loadstations_historydata() {
	//updatapcnav(5);
	if(sessionStorage.pageindex!=3){
		sessionStorage.pageindex = 3;
		document.getElementById("iframe_main").src = 'historydata.html';
	}
}
function loadstations_chart() {////reuse  used by electricroommonitor 
	if(sessionStorage.pageindex!=4){
		sessionStorage.pageindex = 4;
		document.getElementById("iframe_main").src = 'chart.html';
	}
}
//reuse  used by electricroommonitor 
function loadstations_warnlog() {
	if(sessionStorage.pageindex!=5){
		//updatapcnav(8);
		sessionStorage.pageindex = 5;
		document.getElementById("iframe_main").src = 'warnlog.html';
	}
}
// 显示统计报表页面
function loadcollectionreport(){
	if(sessionStorage.pageindex!=16){
		updatapcnav(16);
		sessionStorage.pageindex = 16;
		document.getElementById("iframe_main").src = 'collectionreport.html';
	}
}
//显示新密码输入选项 used by ele
function showeditpassword() {
	$("#row-newpassword").css('display', "");
	//document.getElementById("up-yhmmqr").style.display = "inline";
	//document.getElementById("txt_postpassword").style.display = "inline";
	$("#txt_editpassword").css('display',"none");
}
//提交密码修改内容 used by ele
function postpassword() {
	//var yhbh=document.getElementById("up-yhbh").value;
	//var yhmc=document.getElementById("up-yhmc").value;
	var yhmm = $("#up-yhmm").val();
	var xmm = $("#up-yhmmqr").val();
	//var yhsm=document.getElementById("up-yhsm").value;
	if (yhmm == '') {
		layer.alert("请输入原始密码",info_showtime);
		showstateinfo("输入原始密码","postpassword");
		return;
	}
	if (xmm == '') {
		layer.alert("请输入新密码",info_showtime);
		showstateinfo("请输入新密码","postpassword");
		return;
	}
	$("#row-newpassword").css("display","none");
	//document.getElementById("up-yhmmqr").style.display = "none";
	$("#up-yhmmqr").val("");
	$("#up-yhmm").val("");
	//document.getElementById("txt_postpassword").style.display = "none";
	$("#txt_editpassword").css("display","inline");
	sendorder("ChangePass?pass=" + yhmm + "&newpass=" + xmm,function(data){
		if (data!= null) {
			showmsg("密码修改成功，请用新密码登录",info_showtime);
			//if (confirm("密码修改成功，请用新密码登录")) {  
			//}  
			showstateinfo("密码修改成功,请使用新密码登录","postpassword");
			logout();
		}
	})
}
//根据标签名称确定下拉列表框的选中项///////已用  used by electricroommonitor 
function setSelectOption(objid, sensor) {
	var sel = document.getElementById(objid);
	var options = sel.options;
	let opt_len=options.length;
	for (var i = 0; i < opt_len; i++) {
		if (options[i].value == sensor) {
			options[i].defaultSelected = true;
			options[i].selected = true;
			break;
		}
	}
	if(opt_len<=0){
		sessionStorage.SensorId=-1;
	}else if(i>=opt_len)
		sessionStorage.SensorId=options[0].value;
}
//可自动关闭提示框 used by electricroommonitor
function Alert(str, delay) {
	var ranid = rnd(1, 100);
	var msgw, msgh, bordercolor;
	msgw = 350; //提示窗口的宽度  
	msgh = 100; //提示窗口的高度  
	titleheight = 30 //提示窗口标题高度  
	bordercolor = "#963"; //提示窗口的边框颜色  
	titlecolor = "#99CCFF"; //提示窗口的标题颜色  
	var sWidth, sHeight;
	//获取当前窗口尺寸  
	sWidth = document.body.offsetWidth;
	sHeight = document.body.offsetHeight;
	//背景div  
	var bgObj = document.createElement("div");
	bgObj.setAttribute('id', 'alertbgDiv' + ranid);
	bgObj.style.position = "absolute";
	bgObj.style.top = "0";
	bgObj.style.background = "#E8E8E8";
	bgObj.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
	bgObj.style.opacity = "0.6";
	bgObj.style.left = "0";
	bgObj.style.width = sWidth + "px";
	bgObj.style.height = sHeight + "px";
	bgObj.style.zIndex = "10000";
	document.body.appendChild(bgObj);
	//创建提示窗口的div  
	var msgObj = document.createElement("div") ;
	msgObj.setAttribute("id", "alertmsgDiv" + ranid);
	msgObj.setAttribute("align", "center");
	msgObj.style.background = "white";
	msgObj.style.border = "1px solid " + bordercolor;
	msgObj.style.position = "absolute";
	msgObj.style.left = "50%";
	msgObj.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
	//窗口距离左侧和顶端的距离   
	msgObj.style.marginLeft = "-225px";
	//窗口被卷去的高+（屏幕可用工作区高/2）-150  
	msgObj.style.top = document.body.scrollTop + (window.screen.availHeight / 2) - 150 + "px";
	msgObj.style.width = msgw + "px";
	msgObj.style.height = msgh + "px";
	msgObj.style.textAlign = "center";
	msgObj.style.lineHeight = "25px";
	msgObj.style.zIndex = "10001";
	msgObj.setAttribute("onclick", "closewin(" + ranid + ")");//在提示框中任意位置点击则关闭提示框
	document.body.appendChild(msgObj);
	//提示信息标题  
	var title = document.createElement("h4");
	title.setAttribute("id", "alertmsgTitle");
	title.setAttribute("align", "center");
	title.style.margin = "0";
	title.style.padding = "3px";
	title.style.background = bordercolor;
	title.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
	title.style.opacity = "0.75";
	title.style.border = "1px solid " + bordercolor;
	title.style.height = "35px";
	title.style.font = "20px Verdana, Geneva, Arial, Helvetica, sans-serif";
	title.style.color = "white";
	title.innerHTML = "操作提示信息";
	document.getElementById("alertmsgDiv" + ranid).appendChild(title);
	//提示信息  
	var txt = document.createElement("p");
	txt.setAttribute("id", "msgTxt");
	txt.style.fontSize="18px";
	txt.style.margin = "16px 0";
	txt.innerHTML = str;
	document.getElementById("alertmsgDiv" + ranid).appendChild(txt);
	//设置关闭时间  
	if (typeof(delay) === "number") window.setTimeout("closewin(" + ranid + ")", delay);
}
//将系统的信息告警提示框直接转换成自定义提示框  
//window.alert = Alert;
//layer.alert=Alert;
//关闭指定id的提示框（窗口）。used by electricroommonitor
function closewin(ranid) {
	if(document.getElementById("alertbgDiv"+ranid)){//2020324
		document.body.removeChild(document.getElementById("alertbgDiv" + ranid));
		document.getElementById("alertmsgDiv" + ranid).removeChild(document.getElementById("alertmsgTitle"));
		document.body.removeChild(document.getElementById("alertmsgDiv" + ranid));
	}
}
//获取历史数据    used by electricroommonitor 
function gethistorydata(sensorid,folder,name,kssj, jssj) {//,aparent
	//if (sessionStorage.islogin == "true") {
		if (typeof(sensorid) != "undefined") {
			if(window.parent.wsconnect){
				var apara=new Object();
				apara.sensorId=parseInt(sensorid);
				apara.folder=folder;
				apara.name=name;
				apara.from=kssj;
				apara.to=jssj;
				window.parent.wssend("GetHistoriesBySensor",apara);
			}else{
				sendorder("GetHistoriesBySensor?sensorId=" + sensorid + "&folder="+folder+"&name="+name+"&from=" + kssj + "&to=" + jssj,function(data){
					if(!data){
						decodedatas(null);
						return;
					}
					if (!jQuery.isEmptyObject(data.datas)) {//Result.Datas
						localStorage.setItem("historydata",JSON.stringify(data.datas));
						decodedatas( data.datas);//[sensorid]
					} else {
						//showmsg("没有符合条件的历史数据");
						showstateinfo("没有符合条件的历史数据","gethistorydata");
						localStorage.setItem("historydata",null);
						decodedatas(null);
					}
				});
			}
		}
	//}
}
//获取历史数据    used by electricroommonitor 
function gethistorybynode(nodeid,folder,name,kssj, jssj) {//,aparent
	//if (sessionStorage.islogin == "true") {
		if (typeof(nodeid) != "undefined") {
			if(window.parent.wsconnect){
				var apara=new Object();
				apara.nodeid=parseInt(nodeid);
				apara.folder=folder;
				apara.name=name;
				apara.from=kssj;
				apara.to=jssj;
				window.parent.wssend("GetHistoriesByNode",apara);
			}else{
				sendorder("GetHistoriesByNode?nodeId=" + nodeid + "&folder="+folder+"&name="+name+"&from=" + kssj + "&to=" + jssj,function(data){
					if(!data){
						decodedatas(null,1);
						return;
					}
					if (!jQuery.isEmptyObject(data.datas)) {//Result.Datas
						//localStorage.setItem("historydata",JSON.stringify(data.datas));
						decodedatas( data.datas,1);//[sensorid]
					} else {
						//showmsg("没有符合条件的历史数据");
						showstateinfo("没有符合条件的历史数据","gethistorydatabynode");
						localStorage.setItem("historydata",null);
						decodedatas(null,1);
					}
				});
			}
		}
	//}
}
//获取历史告警数据    used by electricroommonitor 
function getmessagesbysensor(sensorid,folder,name,kssj, jssj) {//,aparent
	//if (sessionStorage.islogin == "true") {
		if (typeof(sensorid) != "undefined") {
			if(window.parent.wsconnect){
				var apara=new Object();
				apara.sensorId=parseInt(sensorid);
				apara.folder=folder;
				apara.name=name;
				apara.from=kssj;
				apara.to=jssj;
				window.parent.wssend("GetMessagesBySensor",apara);
			}else{
				sendorder("GetMessagesBySensor?sensorId=" + sensorid + "&folder="+folder+"&name="+name+"&from=" + kssj + "&to=" + jssj,function(data){
					if(!data){
						decodedatas(null);
						return;
					}
					if (!jQuery.isEmptyObject(data.datas)) {//Result.Datas
						//localStorage.setItem("historymes",JSON.stringify(data.datas));
						decodedatas( data.datas);//[sensorid]
					} else {
						showmsg("没有符合条件的历史数据");
						showstateinfo("没有符合条件的告警历史数据","getmessagesbysensor");
						//localStorage.setItem("historymes",null);
						decodedatas(null);
					}
				});
			}
		}
	//}
}
//获取历史告警数据根据节点编号：   used by electricroommonitor 
function getmessagesbynode(nodeid,folder,name,kssj, jssj) {//,aparent
	//if (sessionStorage.islogin == "true") {
		if (typeof(nodeid) != "undefined") {
			if(window.parent.wsconnect){
				var apara=new Object();
				apara.nodeId=parseInt(nodeid);
				apara.folder=folder;
				apara.name=name;
				apara.from=kssj;
				apara.to=jssj;
				window.parent.wssend("GetMessagesByNode",apara);
			}else{
				sendorder("GetMessagesByNode?nodeId=" + nodeid + "&folder="+folder+"&name="+name+"&from=" + kssj + "&to=" + jssj,function(data){
					if(!data){
						decodedatas(null);
						return;
					}
					if (!jQuery.isEmptyObject(data.datas)) {//Result.Datas
						//localStorage.setItem("historymes",JSON.stringify(data.datas));
						decodedatas( data.datas);//[sensorid]
					} else {
						showmsg("没有符合条件的历史数据");
						showstateinfo("没有符合条件的告警历史数据","getmessagesbynode");
						//localStorage.setItem("historymes",null);
						decodedatas(null);
					}
				});
			}
		}
	//}
}
//字符串转日期时间函数格式：yyyy-mm-dd hh:mm:ss
function strtodatetime(str) {
	var year = str.substring(0, 4);
	var month = str.substring(5, 7);
	var day = str.substring(8, 10);
	var hour = str.substring(11, 13);
	var minute = str.substring(14, 16);
	var sencond = str.substr(17);
	return new Date(year, month - 1, day, hour, minute, sencond);
}
//初始化绘图页面 used by electricroommontioring
function initdrawing() {
	if(sessionStorage.pageindex!=1){
		sessionStorage.pageindex = 1;
		document.getElementById("iframe_main").src = 'drawmap.html';
	}
}
//获取指定编号的图形属性信息，从而来绘制图形。user by electricroommontioring drawmap.html
function GetBinary(binariesid) { //user by electricroommontioring drawmap.html
	try{
	sessionStorage.pageindex = 1;
	if (typeof(binariesid) != "undefined") {
		if(window.parent.wsconnect){
			window.parent.wssend("GetNodeGraphics",JSON.parse('{"id":'+parseInt(binariesid)+'}'));
		}else{
			sendorder("GetNodeGraphics?id="+binariesid,getnodegraphics_bc)
		}
	}
	}catch(err){
		showstateinfo(err.message,"GetBinary");
	}
}
function getnodegraphics_bc(data){
	//localStorage.errortime = 0;
	//sessionStorage.islogin = true;
	if(jQuery.isEmptyObject(data)){//.Result
		//if (data.Result.Value == null) {
		//showmsg("没有符合条件的记录",info_showtime);
		showstateinfo("没有符合条件的记录","GetBinary");
		sessionStorage.contents = null;
		try {
			drawmap(JSON.parse(sessionStorage.contents),null,1);
		} catch(err) {
		}
		return;
	}
	//var allsensors=JSON.parse(localStorage.getItem("allsensors"));
	var obj_data=new Object();
	var contents = ($.base64.atob(data.value,true)).split("\r\n");//.Result
	//if(jQuery.hasOwnProperty(localStorage.realdata))
	var obj_rd=JSON.parse(localStorage.getItem("realdata"));
	var obj=[];
		contents.forEach(function(g){
			if ($.trim(g).length > 0) {
				g = JSON.parse(g);
				g.refresh=true;
				if (g && g._shape && g._shape.Binding && g._shape.Text) {
					//var channel=(g._shape.Binding).substring(0,g._shape.Binding.lastIndexOf('_'));
					//var datatype=(g._shape.Binding).substr(g._shape.Binding.lastIndexOf('_')+1);
					var datafolder='',dataname='',channel='',datatype='';
					if(g._shape.Binding.indexOf(":")!=-1){
						channel=(g._shape.Binding).substring(0,g._shape.Binding.indexOf(':'));
						datatype=(g._shape.Binding).substr(g._shape.Binding.indexOf(':')+1);
					}
					if(g._shape.Binding.indexOf("：")!=-1){
						channel=(g._shape.Binding).substring(0,g._shape.Binding.indexOf('：'));
						datatype=(g._shape.Binding).substr(g._shape.Binding.indexOf('：')+1);
					}
					if(datatype.lastIndexOf(concat_str)==-1){
						datafolder="Default";
						dataname=datatype;
					}else{
						var datafolder=datatyep.substring(0,datatype.lastIndexOf(concat_str));
						var dataname=datatype.substr(datatype.lastIndexOf(concat_str));
					}
					if(window.parent.allsensors)
					if(window.parent.allsensors[channel]){
						var sid=window.parent.allsensors[channel].id;
						if ((obj_rd)&&(obj_rd.length>0)) {
							let obj_rd_len=obj_rd.length;
							for(var loop=0;loop<obj_rd_len;loop++){
								//if(obj_rd[loop].sensorId==sid && obj_rd[loop].name.toLowerCase()==datatype.toLowerCase()){
								if(obj_rd[loop].sensorId==sid && obj_rd[loop].name.toLowerCase()==dataname.toLowerCase()
									&&(obj_rd[loop].folder.toLowerCase()==datafolder.toLowerCase())){
									obj_data = (obj_rd)[loop];////
									if(isNumber(obj_data.value)){
										g._shape.Text =(obj_data.value*1).toFixed(Number_of_decimal)
									}else{
										g._shape.Text =(obj_data.value)
									};//;// + " " + sensors[g._shape.Binding].Value.Unit ;
									if(obj_data.message){
										g._shape.isError=true;
									}else{
										g._shape.isError=false;
									}
									//obj_rd.splice(loop,1);//找到需要的数据，取出数据后删除，减少循环的次数。但是此操作可能使重复绑定的标签，
									//除第一个以外的其他图元没有数据可以更新，所以暂时屏蔽掉。
									break;
								}
							}
						}
					}
				}
				obj.push(JSON.stringify(g));
			}
		});
	sessionStorage.contents = JSON.stringify(obj);// 
	try {
		if(sessionStorage.scaler!=1)//将绘图比例设为0，否则可能比例会使用上次的数据造成混乱。数据更新与显示跟新的时间差。
			sessionStorage.scaler=0;
		drawmap(JSON.parse(sessionStorage.contents),null,1);
	} catch(err) {
	}
	sessionStorage.dataId = 0;
	//window.parent.getrealdatabynodeid(0);
}
//绘图函数 in used by electricroommonitoring
function drawmap(arr,ctx,isrefresh) {
	try{
		var mCanvasDiv=document.getElementById("mycanvasdiv");
		var mCanvas = document.getElementById("mycanvas");
		var mheadmap=document.getElementById("head_map");
		if (mCanvas == null) {
			mCanvas = iframe_main.document.getElementById("mycanvas");
		}
		if (mCanvasDiv == null) {
			mCanvasDiv = iframe_main.document.getElementById("mycanvasdiv");
		}
		if(mheadmap==null){
			mheadmap=iframe_main.document.getElementById("head_map");
		}
		//mCanvas.width = document.documentElement.clientWidth - 17;
		//mCanvas.height = document.documentElement.clientHeight;
		if(ctx==null || ctx==undefined)
			ctx = mCanvas.getContext("2d");
		var swidth = cwidth= document.documentElement.clientWidth ;
		var sheight = cheight=document.documentElement.clientHeight-mheadmap.clientHeight;
		mCanvasDiv.style.width= cwidth  + 'px';
		mCanvasDiv.style.height= cheight + 'px';
		//var background_color="#cccccc";
		//mCanvasDiv.style.backgroundColor = mCanvas.style.backgroundColor =background_color;
		if(arr==null){
			ctx.save();
			ctx.clearRect(0, 0, mCanvas.width, mCanvas.height);
			return;
		}
		let arr_len=arr.length;
		for (var i = 0; i < arr_len; i++) {
			if (!arr[i]) {
				continue;
			}
			try {
				var strs = JSON.parse(arr[i]);
			} catch(err) {
				return;
			}
			if ((strs.hasOwnProperty("_type")) && (strs._type == "Selection")) {
				if (strs.hasOwnProperty("_shape")&& (isrefresh)) {
					var str = strs._shape;
					var sx = parseFloat(str.StartPoint.substring(0, str.StartPoint.indexOf(",")));
					var sy = parseFloat(str.StartPoint.substr(str.StartPoint.indexOf(",") + 1));
					var ex = parseFloat(str.EndPoint.substring(0, str.EndPoint.indexOf(",")));
					var ey = parseFloat(str.EndPoint.substring(str.EndPoint.indexOf(",") + 1));
					mCanvasDiv.style.backgroundColor = mCanvas.style.backgroundColor = str.StrokeColor.replace(/\#../,"#");
					swidth=Math.ceil(ex+sx);
					sheight=Math.ceil(ey+sy);
					/*if (Math.ceil(ex + sx) > (document.documentElement.clientWidth - 17)) {
						mCanvas.width = Math.ceil(ex + sx);
					} else {
						mCanvas.width = document.documentElement.clientWidth - 17;
					}
					if (Math.ceil(ey + sy) > document.documentElement.clientHeight) {
						mCanvas.height = Math.ceil(ey + sy);
					} else {
						mCanvas.height = document.documentElement.clientHeight;
					}*/
					if((parseFloat(sessionStorage.scaler)<0.01 && parseInt(sessionStorage.map_module)!=1 )||sessionStorage.scaler=="undefined")//
					{
						sessionStorage.scaler = Math.min(cwidth / swidth,cheight / sheight) * 0.98;
					}
					swidth *= parseFloat(sessionStorage.scaler);
					sheight *= parseFloat(sessionStorage.scaler);
					mCanvas.width = swidth;
					mCanvas.height = sheight;
					mCanvas.style.width= swidth + 'px';
					mCanvas.style.height= sheight + 'px';
					//var ctx = mCanvas.getContext("2d");
					ctx.save();
					break;
				}
			} /*else {
				mCanvas.width = document.documentElement.clientWidth - 17;
				mCanvas.height = document.documentElement.clientHeight;//
			}*/
		}
		
		//ctx.clearRect(0, 0, mCanvas.width, mCanvas.height);
		var pfdp = new Object();
		var trans = new DOMMatrix().scale(parseFloat(sessionStorage.scaler),parseFloat(sessionStorage.scaler));
		for (var i = 1; i < arr_len; i++) {
			if (!arr[i]) {
				continue;
			}
			var strs = JSON.parse(arr[i]);
			if(strs.refresh || isrefresh){
				if (strs.hasOwnProperty("_type")) {
					pfdp.type = strs._type;
				}
				if (strs.hasOwnProperty("_matrix")) {
					pfdp._matrix = strs._matrix;
				}
				if (strs.hasOwnProperty("_shape")) {
					var str = strs._shape;
					//将shape的属性和值赋值给pfdp。
					for (var key in str) {
						pfdp[key] = str[key];
					}
				}
				ctx.setTransform(trans); //还原矩阵，没有此句，图形将在上一次变化的基础上进行变化。
				ctx.setLineDash([]);
				eval(pfdp.type)(ctx, pfdp);//类反射，pfdp.type对应各类图形名称去调用相应的绘图函数。移动至drawmap.js里。
				for (var key in pfdp) {
					delete pfdp[key];
				}
				strs.refresh=false;
				arr[i]=JSON.stringify(strs);
			}
		}
		sessionStorage.contents = JSON.stringify(arr);
		ctx.restore();
	}catch(err){
		showstateinfo(err.message,"drawmap");
	}
}
/*将数据表导出到Excel表格。共四个函数：
getExplorer（）；function method5(tableid)；function Cleanup() ； var tableToExcel = (function()；
在body中调用method5（tablename）；参数tablename位要导出的table的id属性值。
*/
var idTmr;
function getExplorer() {
	var explorer = window.navigator.userAgent;
	//ie  
	if (explorer.indexOf("MSIE") >= 0) {
		return 'ie';
	}
	//firefox  
	else if (explorer.indexOf("Firefox") >= 0) {
		return 'Firefox';
	}
	//Chrome  
	else if (explorer.indexOf("Chrome") >= 0) {
		return 'Chrome';
	}
	//Opera  
	else if (explorer.indexOf("Opera") >= 0) {
		return 'Opera';
	}
	//Safari  
	else if (explorer.indexOf("Safari") >= 0) {
		return 'Safari';
	}
}
function method5(tableid) {
	if (getExplorer() == 'ie') {
		var curTbl = document.getElementById(tableid);
		var oXL = new ActiveXObject("Excel.Application");
		var oWB = oXL.Workbooks.Add();
		var xlsheet = oWB.Worksheets(1);
		var sel = document.body.createTextRange();
		sel.moveToElementText(curTbl);
		sel.select();
		sel.execCommand("Copy");
		xlsheet.Paste();
		oXL.Visible = true;
		try {
			var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
		} catch(e) {
			print("Nested catch caught " + e);
		} finally {
			oWB.SaveAs(fname);
			oWB.Close(savechanges = false);
			oXL.Quit();
			oXL = null;
			idTmr = window.setInterval("Cleanup();", 1);
		}
	} else {
		tableToExcel(tableid);
	}
}
function Cleanup() {
	window.clearInterval(idTmr);
	CollectGarbage();
}
var tableToExcel = (function() {
	var uri = 'data:application/vnd.ms-excel;base64,',
	template = '<html><head><meta charset="UTF-8"></head><body><table  border="1">{table}</table></body></html>',
	base64 = function(s) {
		return window.btoa(unescape(encodeURIComponent(s)))
	},
	format = function(s, c) {
		return s.replace(/{(\w+)}/g,
		function(m, p) {
			return c[p];
		})
	}
	return function(table, name) {
		if (!table.nodeType) table = document.getElementById(table);
		var ctx = {
			worksheet: name || 'Worksheet',
			table: table.innerHTML
		}
		window.location.href = uri + base64(format(template, ctx))
	}
})()
/**导出到Excel完成*/
//形成树形结构列表
function showtreeview() {
	$("#navigation").treeview({
		//toggle: function() {
		//console.log("%s was toggled.", $(this).find(">span").text());
		//}
	});
}
//语音播报
function spack() {
	/*var wrapSpk=document.getElementById('wrapSpk');
	var spkAudio=document.getElementById('spkAudio');
	var spkText=document.getElementById('alert_info');
	wrapSpk.removeChild(spkAudio);
	var spk1='<audio id="spkAudio" sutoplay="autoplay">';
	var spk2='<source src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=6&text='+spkText.innerText+'" type="audio/mpeg">';
	var spk3='<embed height="0" width="0" src="">';
	var spk4='</audio>';
	wrapSpk.innerHTML=spk1+spk2+spk3+spk4;
	spkAudio=document.getElementById('spkAudio');
	spkAudio.play();*/
	var spkText = document.getElementById('chatData');
	if (spkText == null) {
		spkText = parent.window.document.getElementById('chatData');
	}
	var strText = spkText.innerHTML.trim();
	//1#方案，使用audio标签，监测到不支持音频自动播放，就弹出人为干预提示字符点击可以播放。
	/*$.ajax({
		crossDomain: true,
		type: "get",
		//dataType:Jsonp,
		url: jfjk_base_config.speechurl + "GetVoice?text=" + encodeURIComponent(strText),
		success: function(result) {
			var audio = $("#spkAudio")[0];
			if (audio == null) {
				audio = $("#spkAudio", window.parent.document);
			}
			audio.src = "data:audio/wav;base64," + result.Result;
			audio.load()
			let playPromise = audio.play()
			if (playPromise !== undefined) {
				playPromise.then(() => {
					audio.play()
				}).catch(()=> {
					document.getElementById("clickaudio").style.display="inline";
				})
			}
			//setInterval("toggleSound()",1);
			//audio.play();
		},
		failure: function(result) {
			layer.alert(result);
		}
	});*/
	//2#方案，使用iframe标签代替audio标签，直接播放，目前能用.
	//var url=jfjk_base_config.speechurl+"GetWav?text="+encodeURIComponent(strText);
	var audio=$("#spkAudio")[0];
	if (audio == null) {
		audio = $("#spkAudio", window.parent.document);
	}
	audio.src=url;
	/*//audio.load()
	let playPromise = audio.play()
	if (playPromise !== undefined) {
		playPromise.then(() => {
			audio.play()
		}).catch(()=> {
		
		})
	}
	audio.autoplay=true;// 
	audio.play();*/
}
/*var ij =0;
function sortt(className) {
	var listName=new Array();
	var listNameOld=new Array();
	var listTr=new Array();
	var listSort=new Array();
	var i=1;
	var b=false;
	//取得原来的<tr>,并清空<table>
	$("#realdata-tbody tr").each(function(){
		listTr.push($(this).html());
	});
	
	//得到要排列的列的元素，并在末尾追加此刻的顺序（从1开始）
	$(className).each(function(){
		listName.push($(this).text());
		listNameOld.push($(this).text());
		//i++;
	});
	//将要排序的元素排序
	//按元素排序
	listName.sort();
	//清空原来的table
	$("#realdata-tbody tr").empty();
	var ttable=document.getElementById('realtable');
	rowNum=ttable.rows.length;
	for (i=1;i<rowNum;i++)
	{
		 ttable.deleteRow(i);
		 rowNum=rowNum-1;
		 i=i-1;
	}
	var lastid=new Array();
	var hasid=false;
	//按新顺序将于原来的tr匹配并添加。
	for(var j=0;j<listName.length;j++){
		
		for(var i=0;i<listTr.length;i++){
		if(i%2==0){
			var str1='<td class="sensorid" style="background-color: rgb(22, 185, 201);">';
			
			var str4='<td class="'+className.substr(1)+'" style="background-color: rgb(22, 185, 201);">';
		}else{
			var str1='<td class="sensorid" style="background-color: rgb(255, 255, 255);">';
			var str4='<td class="'+className.substr(1)+'" style="background-color: rgb(255, 255, 255);">';
		}
		var str2=listTr[i].substring(listTr[i].indexOf(str4)+str4.length,listTr[i].indexOf('</',listTr[i].indexOf(str4)+str4.length));
		var ssid=listTr[i].substring(listTr[i].indexOf(str1)+str1.length,listTr[i].indexOf('</',listTr[i].indexOf(str1)+str1.length));
		if(listName[j]==str2){
		//if(listName[j]==listTr[i].substring(listTr[i].indexOf(className+'">'),listTr[i].indexOf('</',listTr[i].indexOf(className+'">')))){
			for(var k=0;k<lastid.length;k++){
				if(lastid[k]==ssid){
					hasid=true;
					break;
				}
			}
			if(hasid){
				hasid=false;
				continue;
			}
			$("#realdata-tbody").append("<tr>"+listTr[i]+"</tr>");
				lastid[k]=ssid;
			
			break;
		}
		//if(listName[j].substring(listName[j].length-listNameOld[j].length)!=listNameOld[j]){
		//b=true;
		}
	}
	if (ij % 2 == 0) {
		$(className).text('▲');
		ij++;
	} else {
		$(className).text('▼');
		ij++;
	}
	//setTimeout("moduletable('realdata-tbody')", 200)
}*/
function sortarray(arrs){
	//var arr=[];
	//arr=arrs;
	var compare = function (obj1, obj2) {
		var val1 = obj1.sensorId;
		var val2 = obj2.sensorId;
		if (val1 < val2) {
			return -1;
		} else if (val1 > val2) {
			return 1;
		} else {
			return 0;
		}            
	} 
	arrs.sort(compare);
}
//表格改变选中行颜色
function tableclick(tr){
    $(tr).siblings().css("background","");
    $(tr).css("background",color_table_cur);//区分选中行"#85e494"
}
/*//进度条
 * 显示圆圈加载进度条  used by electricroommonitor
 */
function ajaxLoadingShow() {
	$.ajax({
		beforeSend: function() {
			var xval = getBusyOverlay('viewport', {
				color: 'gray',
				opacity: 0.5,
				text: 'viewport: loading...',
				style: 'text-shadow: 0 0 3px black;font-weight:bold;font-size:16px;color:#FF00CC'
			},
			{
				color: '#ff0',
				size: 100,
				type: 'o'
			});
			if (xval) {
				xval.settext("正在处理中，请稍后......");
				$("#viewport").attr("style", "text-shadow: 0 0 3px black;font-weight:bold;font-size:16px;color:#FF00CC");
				$("#viewport").show();
			}
		}
	});
}
/*
 * 取消圆圈加载进度条  used by electricroommonitor
 */
function ajaxLoadingHidden() {
	$("#viewport").removeAttr("style");
	$("#viewport").hide();
}
function initrealwarning() {
	sessionStorage.pageindex = 7;
	//$("#realwarning-tbody tr").empty();
	var warningtab = window.parent.document.getElementById("realwarningdata-tbody");
	var trs = warningtab.getElementsByTagName("tr");
	var tbl = document.getElementById("realwarning-tbody");
	var trl = document.createElement('tr');
	if (tbl == null) {
		tbl = iframe_main.document.getElementById("realwarning-tbody");
	}
	var rowNum = tbl.rows.length;
	for (var i = 0; i < rowNum; i++) {
		tr = tbl.rows[0];
		tbl.removeChild(tr);
	}
	for (var i = 0; i < trs.length; i++) {
		tbl.appendChild($(trs[i].outerHTML)[0]);
	}
	var counter = document.getElementById("count_varning");
	if (counter == null) {
		counter = iframe_main.document.getElementById("count_varning");
	}
	counter.innerHTML = tbl.rows.length;
	moduletable('realwarning-tbody');
}
function initcontactus() {  //used by electricroommonitor 初始化联系我们
	updatapcnav(11);
	//保存页面现场，在点击浏览器的刷新按钮刷新时应用
	sessionStorage.framepage="ContactUs.html";
	sessionStorage.pageindex=300;
	$('#p1').html(jfjk_base_config.part1);
	$('#p2').html(jfjk_base_config.part2);
	$('#p3').html(jfjk_base_config.part3);
	$('#p4').html(jfjk_base_config.part4);
	$('#add').html(jfjk_base_config.company_address);
	$('#postcode').html(jfjk_base_config.post_code);
	$('#email1').html(jfjk_base_config.email1);
	$('#email2').html(jfjk_base_config.email2);
}
function initsysteminfo(){//used by electricroommonitor 初始化系统设置
	//保存页面现场，在点击浏览器刷新按钮刷新时应用
	sessionStorage.pageindex=7;//20200214
	updatapcnav(10);
	sessionStorage.framepage="systeminfo.html";
	$("#maxname1").height(parent.window.windowHeight-120);
	//$('#p1').html(fjk_base_config.app_name);
	$('#p2').html(jfjk_base_config.ver_id);
	$('#p3').html(jfjk_base_config.date);
	$("#p4").html(jfjk_base_config.copyright);
	//$('#add').html(jfjk_base_config.company);
}
//以下为新增函数
//获取实时数据  used by electricroommonitor mainpage.html realdata.html formatting
function getrealdatabynodeid(anodeid){
	
	if (typeof(anodeid)!="undefined"&&anodeid!==null) {
		if(typeof(wsconnect)=="undefined" || !wsconnect){
			sendorder("GetRealsNew?dataId=" + anodeid,function(data){
				realcall(data,anodeid);
			})
		}else{
			wssend("GetRealsNew",JSON.parse('{"dataId":'+parseInt(anodeid)+"}"))
		}
	}
}
function realcall(data,dataid){
	//localStorage.errortime = 0;
	//sessionStorage.islogin = true;
	//value0=0;value1=0;sname="";
		if(!data){return;}
		if (jQuery.isEmptyObject(data.datas)) {
			if(dataid==1)
				if (typeof(realdataid)=="undefined"){
					dataid=window.parent.realdataid;
				}else{
					dataid=realdataid;
				}
			if(!dataid || dataid<=0)//21.8.23 添加，否则真的没数据时可能保留以前的实时数据表而造成误解。只在非获取全部数据返回为空时才保持原来数据不进行更新。
				localStorage.setItem("realdata",null);//21.8.17修改，暂时去掉此语句，返回数据为空时保持原来的数据，观察对页面数据有无影响。
			if(typeof(decoderealdata)=="function")
				decoderealdata();
			showstateinfo("本次获取实时数据为空","getrealdatabynodeid");
			//return;
		}else{
			var obj_realdata=data.datas;
			if(!dataid || dataid<=0)
				localStorage.setItem("realdata",JSON.stringify(obj_realdata));
			if(typeof(decoderealdata)=="function"){
				decoderealdata(obj_realdata);
			}
			if(document.getElementById('iframe_main')!==null &&typeof((document.getElementById('iframe_main')).contentWindow.decoderealdata)=="function")
				document.getElementById('iframe_main').contentWindow.decoderealdata(obj_realdata);
		}
		if(typeof refreshData === "function"){
			refreshData();
		}else{
			if(sessionStorage.pageindex==2 || sessionStorage.pageindex==17|| sessionStorage.pageindex==1||sessionStorage.pageindex==21){
				if(typeof window.iframemain[0].contentWindow.refreshData =="function")
				document.getElementById('iframe_main').contentWindow.refreshData();
			}
		};
}
function sleep(numberMillis) {    
	var now = new Date();    
	var exitTime = now.getTime() + numberMillis;   
	while (true) { 
		now = new Date();       
		if (now.getTime() > exitTime) 
		return;
	} 
}
//将类型文字化 used by ele
function getname(key){
	if(key)
		key=key.toLowerCase();
	var allconfig=JSON.parse(localStorage.allConfigs);
	if(allconfig){
		let all_config_len=allconfig.length;
		for(var i=0;i<all_config_len;i++){
			if(key==allconfig[i].name.toLowerCase()){
				key=allconfig[i].desc;
				break;
			}
		}
	}
	if(key==null||key==''||key.trim()==''||key=="null"){//空、空字符、空格都按空对待，提示未分组。
		key="未定义";
	}/*else if(key=="temp"||key=="tmp"){
		key="温度";
	}else if(key=="pd"){
		key="局放";
	}else if(key=="yx"||key=="yaoxin"){
		key="遥信";
	}else if(key=="cwcj"){
		key="测温采集器";
	}else if(key=="shipinjiankong"||key=="视频监控"){
		key="视频监控";
	}*/
	return key;
}
//不同时间段的选择响应（obj对应的选项对象)
function seletime(obj){
	//var timedefine=document.getElementById("timedefine");//water proof bag 
	sessionStorage.timeindex=parseInt(obj);//$('input[name="timeselect"]:checked').val();//obj.value*1;
	if(obj*1==5){
		timedefine.style.display="none";
		showrealworning();
		return;
	}
	flashbutton(); //查询按钮闪烁
	var oneday=1000*60*60*24;
	//var today = new Date();
	var ckssj,cjssj;//ttime;
	document.getElementById("count_val").innerHTML="";
	switch(obj*1){
		case 0:
			sessionStorage.kssj = getCurrentDate(1) + " 00:00:00"; //"2012-09-03T08:00:00";//;
			sessionStorage.jssj = getCurrentDate(2) ;
			//gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj,sessionStorage.jssj);
			timedefine.style.display="none";
			//layer.alert("没有符合条件的记录",info_showtime); all //忿
			break;
		case 1:
			timedefine.style.display="none";
			ckssj=new Date((getCurrentDate(1)+" 00:00:00").replace(/-/g,"/"));
			var yesterdaystar=ckssj-oneday;
			sessionStorage.kssj=dateToString((yesterdaystar),2);
			cjssj=new Date((getCurrentDate(1)+" 23:59:59").replace(/-/g,"/"));
			var yesterdayend=cjssj-oneday;
			sessionStorage.jssj=dateToString((yesterdayend),2);
			//$("#warnlogdata-tbody tr").empty();
			//gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj,sessionStorage.jssj);
			//layer.alert("没有符合条件的记录",info_showtime);
			break;
		case 2:
			timedefine.style.display="none";
			ckssj=new Date((getCurrentDate(1)+" 00:00:00").replace(/-/g,"/"));
			sessionStorage.kssj=dateToString((ckssj.setDate(1)),2);
			sessionStorage.jssj=getCurrentDate(2);
			//gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj,sessionStorage.jssj);
			break;
		case 3:
			timedefine.style.display="none";	
			ckssj=new Date((getCurrentDate(1)+" 00:00:00").replace(/-/g,"/"));
			var lastMonthFirst = new Date(ckssj - oneday * ckssj.getDate());
			sessionStorage.kssj = dateToString((lastMonthFirst - oneday * (lastMonthFirst.getDate() - 1)),2);
			cjssj=new Date((getCurrentDate(1)+" 23:59:59").replace(/-/g,"/"));
			sessionStorage.jssj = dateToString((cjssj - oneday * cjssj.getDate()),2);
			//$("#warnlogdata-tbody tr").empty();
			//layer.alert("没有符合条件的记录",info_showtime); 
			//gethistorydata(sessionStorage.SensorId,catalog,dname,sessionStorage.kssj,sessionStorage.jssj);  
		break;
		case  4:
			if(timedefine.style.display=="none"){
				timedefine.style.display="inline";
			}
			//stoptimer(timer);
		break;
	}
}
//导航按钮选中指示标志//20200212 
function updatapcnav(obj){
	for(var i=1;i<18;i++){
		var nav=document.getElementById("nav"+i);
		if(nav==null){//如果为null。就获取父窗口下的元素。 
			nav=window.parent.document.getElementById("nav"+i);
		}
		if(nav){
			nav.style.color=""
			nav.style.backgroundColor="";
			if(i==obj){
				nav.style.backgroundColor="#c0c0c0";
				nav.style.color="#0000f0";
			}
		}
	}
	if(obj==7){
		//if((multiselect==undefined)||(multiselect==null)){ 
			window.parent.multiselect=true;
		//}else{
		//	multiselect=true;
		//}
	}else{
		//if((multiselect==undefined)||(multiselect==null)){
			window.parent.multiselect=false;
		//}else{
		//	multiselect=false;
		//}
	}
	//if(window.parent.tree2)
		window.parent.inittreeview_level2();
		window.parent.document.getElementById("tree").style.pointerEvents ="auto";
		switch(obj){//控制标签树形菜单是否显示。
		case 3:
		case 4:
		case 5:
		case 7:
		case 8:
		case 15:
		case 16:
		case 17:
			if(window.parent.tree2){
				window.parent.document.getElementById('tree_chi').style.display="block";
				window.parent.document.getElementById('tree').style.height='60%';
			}
			break;			
		default :
		window.parent.document.getElementById("tree_chi").style.display="none";
		window.parent.document.getElementById('tree').style.height='100%';
	}
	sessionStorage.framepage=window.parent.document.getElementById('iframe_main').src;
}
var sorter=false;
//数据表排序插件
(function($){
    //插件
    $.extend($,{
        //命名空间
		sortTable:{
            sort:function(tableId,Idx,adatatype){
				var table = document.getElementById(tableId);
                var tbody = table.tBodies[0];//tBodies[0]取表头thead，tBodies[1]取tbody
				var tr = tbody.rows;
				sessionStorage.realdata_index=Idx;
				if((tableId=="realtable")){//||(tableId="ohter_realtable")
					try{
						if(Idx>=hidden_cells){
							catalog=getCatalog(adatatype,Idx-hidden_cells);
							title_index=Idx;//获取排序的列表项下序号（位置)，用于获取对应项的数值
							isfirst=true;//更改排序项的同时更改显示项，重新获取数据刷新图表；
							var head=$("#tab_head")[0].rows[0].cells[Idx];
							head.style.color='blue';
							//btn_refresh_click();//刷新图表
							//return;
							//var jssj = getCurrentDate(2);
							//var yesterdaytime= (new Date(jssj))-(1000*60*60*24);
							//var kssj=dateToString((yesterdaytime),2);
							//kssj = (tr.cells[2].innerHTML).substring(0, 10) + " 00:00:00";//20200217  取当日的时间而不是当前时间
							//jssj = (tr.cells[2].innerHTML);
							//if(sessionStorage.realdata_index!=Idx){
								decoderealdata();//使用此函数在更改查看项目后可以实时刷新所有的图形数据，但将抵消排序操作；使用gethistorydata（）只刷新曲线和24小时极值，其他要等下一次自动刷新。
							//}
							
							//gethistorydata(sensor_Id,catalog,typename, kssj, jssj, 1);
							//refreshData();
						}
					}catch(err){

					}
				}
				if (tbody.sortCol == Idx){
					sorter=(!sorter);
				}else
				{sorter=false}
                var trValue = new Array();
				let tr_len=tr.length;
				let j=0;
				for (var i=0; i<tr_len; i++ ) {
					if(parseInt(jfjk_base_config.realdatashowmodle)){//只对在线标签进行排序和显示
						if(!tr[i].style.cssText|| tr[i].style.cssText.indexOf("display: none;")==-1){//display: none 之间必须加空格，否则不能正确匹配，虽然在复制时是display:none;
							//不能使用cssText=="",因为点击列表时会设置当前行的样式背景颜色从而不为空，将被此条件滤除。
							trValue[j]=tr[i];
							j++;
						}
					}else{
						trValue[i] = tr[i];  //
					}
                }
				if(sorter)
                 {
					//trValue.reverse(); //如果该列已经进行排序过了，则直接对其反序排列 
					trValue.sort(function(tr1, tr2){
                        var a=(tr1.cells[Idx].innerHTML).toString();
						if(!isNumber(a)){
							var value1 = tr1.cells[Idx].innerHTML;
							var value2 = tr2.cells[Idx].innerHTML;
							return value2.localeCompare(value1);
						}else{
							var value1 = parseFloat(tr1.cells[Idx].innerHTML);
							var value2 = parseFloat(tr2.cells[Idx].innerHTML);
							if(value1 && value2){
								if (value2 < value1) {
									return -1;
								} else if (value2 > value1) {
									return 1;
								} else {
									return 0;
								}
							}else{
								return -1;
							}
						}
                    });
                } else {
                    //trValue.sort(compareTrs(Idx));  //进行排序 
                    trValue.sort(function(tr1, tr2){
                        var a=(tr1.cells[Idx].innerHTML).toString();
						if(!isNumber(a)){
							var value1 = tr1.cells[Idx].innerHTML;
							var value2 = tr2.cells[Idx].innerHTML;
							return value1.localeCompare(value2);
						}else{
							var value1 = parseFloat(tr1.cells[Idx].innerHTML);
							var value2 = parseFloat(tr2.cells[Idx].innerHTML);
							if(value1 && value2){
								if (value1 < value2) {
									return -1;
								} else if (value1 > value2) {
									return 1;
								} else {
									return 0;
								}
							}else{
								return -1;
							}
						}
                    });
                }
                var fragment = document.createDocumentFragment();  //新建一个代码片段，用于保存排序后的结果
                for (var i=0; i<trValue.length; i++ ) {
					trValue[i].cells[0].innerHTML=i+1;
                    fragment.appendChild(trValue[i]);
				}
				tbody.clear;
                tbody.appendChild(fragment); //将排序的结果替换掉之前的值
                tbody.sortCol = Idx;
            }
        }
    });      
})(jQuery);
//导出表格到Excel。使用.js插件。
function exporttoexcel(tabid){
	$("#"+tabid).table2excel({
		exclude  : ".noExl",                                       //过滤位置的 css 类名
		filename : "Excel" + new Date().getTime() + ".xls",        //文件名称
		name: "Excel Document Name.xlsx",
		exclude_img: true,
		exclude_links: true,
		exclude_inputs: true,
	});
}
//通过配置名称获取配置分组catalog的值，后台数据源的数据结构：catalog改为type；
function getcatalog(aname){
	var acatalog="";
	if(aname=="" || aname==undefined || aname==null){
		acatalog="";
	}else
	if(configs){
		for(var p in configs){
			for(var l in configs[p].details){
				if(configs[p].details[l].name.toLowerCase()==aname.toLowerCase()){
					acatalog=configs[p].details[l].folder;//;//Catalog;
					return acatalog;
				}
			}
		}
	}
	return acatalog;
}
function showstateinfo(str,order){
	var timestr=getCurrentDate(2).substr(11);
	var stateinfo=document.getElementById("state_info");
	if(!stateinfo){
		stateinfo=parent.window.document.getElementById("state_info");
	}
	if(typeof stateinfo != "undefined" && stateinfo)
		stateinfo.innerHTML=timestr+": "+str+" / "+order;
	console.log(timestr+": "+order+" / "+str);
}
/**
 * @param {Object} json
 * @param {Object} type： 默认不传 ==>全部小写;传1 ==>全部大写;传2 ==>首字母大写
 * 将json的key值进行大小写转换
 */
function jsonKeysToCase(json,type){
	if(typeof json == 'object'){
		var tempJson = JSON.parse(JSON.stringify(json));
		toCase(tempJson);
		return tempJson;
	}else{
		return json;
	}
	function toCase(json){
		if(typeof json == 'object'){
			if(Array.isArray(json)){
				json.forEach(function(item){
					toCase(item);
				})
			}else{
				for (var key in json){
					var item = json[key];
					if(typeof item == 'object'){
						toCase(item);
					}
					delete(json[key]);
					switch (type){
						case 1:
							//key值全部大写
							json[key.toLocaleUpperCase()] = item;  
							break;
						case 2:
							//key值首字母大写，其余小写
							json[key.substring(0,1).toLocaleUpperCase() + key.substring(1).toLocaleLowerCase()] = item;  
							break;
						case 3://首字母小写，其他不变
							json[key.substring(0,1).toLocaleLowerCase() + key.substring(1)] = item;
							break;
						default:
							//默认key值全部小写
							json[key.toLocaleLowerCase()] = item;  
							break;
					}
				}
			}
		}
	}
}
/**与后台服务器的通信函数
 * 说明：参数order: 数据通信的命令字；
 * callback: 回调函数；
function sendorder(order,callback,datas){
	try{
	var url = jfjk_base_config.baseurl + order;
	url = encodeURI(url);
	if (sessionStorage.islogin == "true") {
		$.ajax({
			beforeSend: function (request) {
				request.setRequestHeader("Authorization", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function (jqXHR, textStatus, errorThrown) {
			try{
				ajaxLoadingHidden();
				if (errorThrown == "Unauthorized") {
					//Alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 数据获取失败',info_showtime);
					RefreshToken();
				} else if(jqXHR.hasOwnProperty("responseJSON")&&jqXHR.responseJSON==undefined){//0928修改，判断是否由此项
					layer.alert("服务器连接失败，请稍后重试",info_showtime);
					showstateinfo("服务器连接失败，请稍后重试",order);
				}else {
					layer.alert( jqXHR.responseText,info_showtime);
				}
				sessionStorage.errortime++;
				if(sessionStorage.errortime<3){
					//getNodes();//video.html mainpage.html function.js userprofile 
				}else if (sessionStorage.errortime<4){
						LoginOrder(localStorage.username,sessionStorage.password,1);
					}else{
					sessionStorage.islogin=false;
					sessionStorage.errortime=0;
					//localStorage.username="未登录";
					showusername(true);
				}
				callback(null);
			}catch(err){
				showstateinfo(err.message,"sendpostorder");
			}
			},
			success: function (data, status) {
			try{
				ajaxLoadingHidden();
				//var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if (status == "success") {
					sessionStorage.errortime = 0;
					if(sessionStorage.islogin==false){
						showusername();
						sessionStorage.islogin = true;
					}
					if (data.Error == null) {
						showstateinfo("命令操作成功",order);
						callback(data);//回调函数，将接收数据回传给回调函数处理。
						
					} else {
						layer.alert(data.Error,info_showtime);
						showstateinfo(data.Error,order);
						sessionStorage.islogin = ture;
						callback(null);
					}
				}else{//找不到数据时nocontent
					callback(null) ;//应该调用回调函数而不是使用return null
				}
			}catch(err){
				showstateinfo(err.message,"sendpostorder");
			}
			}
		});
	} else {
		layer.alert("用户未登录，您无权完成此次操作", info_showtime);
		showstateinfo("用户未登录，你无权完成此次操作",order);
		callback(null) ;
	}
	}catch(err){
		showstateinfo(err.message);
	}
}*/
/**与后台服务器的通信函数
 * 说明：参数order: 数据通信的命令字；
 * datas:命令所需携带的数据内容；
 * callback: 回调函数；
*/
function sendorder(order,callback,datas){
	try{
	var ordertype="GET";
	if(datas){
		ordertype="POST";
	}
	var url = localStorage.server_url + order;
	url = encodeURI(url);
	if (sessionStorage.islogin == "true") {
		$.ajax({
			beforeSend: function (request) {
				request.setRequestHeader("Authorization", sessionStorage.token);
			},
			url: url,
			type: ordertype,//'POST',
			dataType: "json",
			contentType: "application/json",
			data:JSON.stringify(datas),
			timeout: 10000,
			error: function (jqXHR, textStatus, errorThrown) {
			try{
				sessionStorage.errortime++;
				ajaxLoadingHidden();
				if (errorThrown == "Unauthorized") {
					//layer.alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 数据获取失败',info_showtime);
					RefreshToken(order,callback,datas);//此命令返回Bad Request（后台需处理） 於
					
				}else if(jqXHR.hasOwnProperty("responseJSON")&&jqXHR.responseJSON==undefined){//0928修改，判断是否由此项
					showmsg("服务器连接失败，请稍后重试",info_showtime);
					showstateinfo("服务器连接失败，请稍后重试",order);
				}	else{
					showstateinfo('数据获取失败',order);//showmsg(' 数据获取失败',info_showtime);
				}
				
				if(sessionStorage.errortime<3){
					//getNodes();//video.html mainpage.html function.js userprofile 
				}else if(sessionStorage.errortime<4){
						LoginOrder(localStorage.username,sessionStorage.password,1,order,callback,datas);
					}else{
					sessionStorage.islogin=false;
					//sessionStorage.errortime=0;
					//localStorage.username="未登录";
					showusername(true);
				}
				callback(null);
			}catch(err){
				showstateinfo(err.message,"sendpostorder");
			}
			},
			success: function (data, status,xml) {
			try{
				ajaxLoadingHidden();
				//var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if (status == "success") {
					showstateinfo(xml,"sendorder");
					sessionStorage.errortime = 0;
					if(sessionStorage.islogin==false){
						showusername();
						sessionStorage.islogin = true;
					}
					if (data.Error == null) {
						showstateinfo("命令操作成功",order);
						callback(data);//回调函数，将接收数据回传给回调函数处理。
						
					} else {
						//showmsg(data.Error,info_showtime);
						showstateinfo(data.Error,order);
						sessionStorage.islogin = ture;
						callback(null);
					}
				}else{//找不到数据时nocontent
					callback(null) ;//应该调用回调函数而不是使用return null
				}
			}catch(err){
				showstateinfo(err.message,"sendpostorder");
			}
			},
		});
	} else {
		//showmsg("用户未登录，您无权完成此次操作", info_showtime);
		showstateinfo("用户未登录，你无权完成此次操作",order);
		callback(null) ;
	}
	}catch(err){
		showstateinfo(err.message,order);
	}
}
//显示jQuery自定义消息对话框 暂时没用
function showmessage(mes){
	if(typeof dialog=="undefined"){
		parent.dialog.html(mes);
		parent.dialog.dialog('open');
	}else{
		dialog.html(mes);
		dialog.dialog('open');
	}
}
function blinklink(flashit){
	if(flashit.css('backgroundColor')=='rgb(0, 101, 105)'){  //注意：这里拿到的是rgb格式的
		flashit.css('backgroundColor','rgb(232, 83, 63)');
	}else{
		flashit.css('backgroundColor','rgba(0, 101, 105)');
	}
	return timer=setTimeout("blinklink(flashit)",500);
}
function flashbutton(){//使用各子页面的全局变换timer、flashit.各个页面定义自己的timer、flashit变量和元素。
	if(timer!=null)
		stoptimer(timer);
	timer=blinklink(flashit);
}
function stoptimer(timer){
	flashit.css('backgroundColor','rgba(0, 101, 105)');
	clearTimeout(timer);
}
function showdate(el){
	WdatePicker(el);
	flashbutton();
}
//------display control------
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
	}*/
	function changePage(){    // 转页
		curPage=parseInt(document.getElementById("changePage").value)-1;
		if (!/^[1-9]\d*$/.test(curPage)) {
			showmsg("请输入正整数",info_showtime);
			return ;
		}
		/*if (curPage > page) {
			showmsg("超出数据页面",info_showtime);
			return ;
		}
		direct = 0;
		displayPage();*/
		page.changePage(curPage);
	}
	function setPageSize(){    // 设置每页显示多少条记录
		pageSize = parseInt(document.getElementById("pageSize").value);    //每页显示的记录条数
		if (!/^[1-9]\d*$/.test(pageSize)) {
			showmsg("请输入正整数",info_showtime);
			return ;
		}
		/*//len =$table.rows.length;// - 1;
		page=len % pageSize==0 ? len/pageSize : Math.floor(len/pageSize)+1;//根据记录条数，计算页数
		curPage=1;        //当前页
		direct=0;        //方向
		firstPage();
		displayPage();*/
		page.setPageSize(pageSize);
		if(sessionStorage.pageindex==2){
			sessionStorage.pageSize=pageSize; 
			btn_refresh_click();
		}
	}	
/*function displayPage(){
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
	var theTable=$("table");// document.getElementById("warnlogdata-tbody");
	theTable.bind('paging',function(){  
		theTable.find('tbody tr').hide().slice(curPage*pageSize,(curPage+1)*pageSize).show();  
	});  
	for ( var i = 0; i<len; i++ ) {
		$table.rows[i].style.display = 'none';
	}
	for ( var i = begin; i<end; i++ ) {
		$table.rows[i].style.display = '';
	}
	$table.find("tr").hide();    // 首先，设置这行为隐藏
	$table.find("tr").each(function(i){    // 然后，通过条件判断决定本行是否恢复显示
		if((i>=begin && i<=end) )//显示begin<=x<=end的记录
			$(this).show();
	});
	}*/
//-----------------------display contral-----------------------------
// JavaScript Document
/**
* js分页类
* @param iAbsolute 每页显示记录数
* @param sTableId 分页表格属性ID值，为String
* @param sTBodyId 分页表格TBODY的属性ID值,为String,此项为要分页的主体内容
* @Version 1.0.0
* @author 辛现宝 2007-01-15 created
* var __variable__; private
* function __method__(){};private
*/
function Page(iAbsolute, sTableId, sTBodyId,sPageId) {
    this.absolute = parseInt(iAbsolute); //每页最大记录数
    this.tableId = sTableId;
    this.tBodyId = sTBodyId;
    this.rowCount = 0; //记录数
    this.pageCount = 0; //页数
    this.pageIndex = 0; //页索引
    this.__oTable__ = null; //表格引用
    this.__oTBody__ = null; //要分页内容
    this.__dataRows__ = 0; //记录行引用
    this.__oldTBody__ = null;
    this.pageId = sPageId;//显示当前页数的span的ID

    this.__init__(); //初始化;
   
};
/*
初始化
*/
Page.prototype.__init__ = function () {
    this.__oTable__ = document.getElementById(this.tableId); //获取table引用
    this.__oTBody__ = this.__oTable__.tBodies[this.tBodyId]; //获取tBody引用
    this.__pageInnerDiv__ = document.getElementById(this.pageId);
    if(!this.__oTBody__)
		return;
	this.__dataRows__ = this.__oTBody__.rows;
    this.rowCount = this.__dataRows__.length;
    try {
        this.absolute = (this.absolute <= 0) || (this.absolute > this.rowCount) ? this.rowCount : this.absolute;
        this.pageCount = parseInt(this.rowCount % this.absolute == 0
? this.rowCount / this.absolute : this.rowCount / this.absolute + 1);
    } catch (exception) { }

    this.__updateTableRows__();
};
/*
下一页
*/
Page.prototype.nextPage = function () {
    if (this.pageIndex + 1 < this.pageCount) {
        this.pageIndex += 1;
        this.__updateTableRows__();
    }
};
/*
上一页
*/
Page.prototype.prePage = function () {
    if (this.pageIndex >= 1) {
        this.pageIndex -= 1;
        this.__updateTableRows__();
    }
};
/*
首页
*/
Page.prototype.firstPage = function () {
    if (this.pageIndex != 0) {
        this.pageIndex = 0;
        this.__updateTableRows__();
    }
};
/*
尾页
*/
Page.prototype.lastPage = function () {
    if (this.pageIndex + 1 != this.pageCount) {
        this.pageIndex = this.pageCount - 1;
        this.__updateTableRows__();
    }
};
/*
页定位方法
*/
Page.prototype.aimPage = function (iPageIndex) {
    if (iPageIndex > this.pageCount - 1) {
        this.pageIndex = this.pageCount - 1;
    } else if (iPageIndex < 0) {
        this.pageIndex = 0;
    } else {
        this.pageIndex = iPageIndex;
    }
    this.__updateTableRows__();
};
/*
执行分页时，更新显示表格内容
*/
Page.prototype.__updateTableRows__ = function () {
    var iCurrentRowCount = this.absolute * this.pageIndex;
    var iMoreRow = this.absolute + iCurrentRowCount > this.rowCount ? this.absolute + iCurrentRowCount - this.rowCount : 0;
    var tempRows = this.__cloneRows__();
    //alert(tempRows === this.dataRows);
    //alert(this.dataRows.length);
    var removedTBody = this.__oTable__.removeChild(this.__oTBody__);
    var newTBody = document.createElement("TBODY");
    newTBody.setAttribute("id", this.tBodyId);
	/*for( var i=0;i<tempRows.length;i++){
		newTBody.appendChild(tempRows[i]);
	}
	this.__oTable__.appendChild(newTBody);
	$("#"+this.tableId+" tr").hide();    // 首先，设置这行为隐藏
	begin=iCurrentRowCount;
	end=this.absolute + iCurrentRowCount - iMoreRow;
	$("#"+this.tableId+" tr").each(function(i){    // 然后，通过条件判断决定本行是否恢复显示
		if((i>begin && i<=end) || i==0 )//显示begin<=x<=end的记录
			$(this).show();
	});*/
    for (var i = iCurrentRowCount; i < this.absolute + iCurrentRowCount - iMoreRow; i++) {
        newTBody.appendChild(tempRows[i]);
	}
	this.__oTable__.appendChild(newTBody);
    /*
    this.dataRows为this.oTBody的一个引用，
    移除this.oTBody那么this.dataRows引用将销失,
    code:this.dataRows = tempRows;恢复原始操作行集合.
    */
    this.__dataRows__ = tempRows;
    this.__oTBody__ = newTBody;
    //alert(this.dataRows.length);
    //alert(this.absolute+iCurrentRowCount);
    //alert("tempRows:"+tempRows.length);
	document.getElementById(this.pageId).innerHTML = "当前页：" + (this.pageIndex + 1);
	document.getElementById("btn0").innerHTML="当前 " +(this.pageIndex + 1) + "/" + this.pageCount + " 页    每页 ";        // 显示当前多少页
	document.getElementById("sjzl").innerHTML="数据总量 <span class='badge' style='font-size:18px'>" + this.rowCount + "";        // 显示数据量 数据表总量要减去告警类型统计项的标题行。
	document.getElementById("pageSize").value = this.absolute;
};
//设置每页最大行数;
Page.prototype.setPageSize= function(pagesize){
	this.absolute=parseInt(pagesize);
	//this.pageIndex=0;
	try {
        this.absolute = (this.absolute <= 0) || (this.absolute > this.rowCount) ? this.rowCount : this.absolute;
        this.pageCount = parseInt(this.rowCount % this.absolute == 0
? this.rowCount / this.absolute : this.rowCount / this.absolute + 1);
    } catch (exception) { }
    this.__updateTableRows__();
}
//跳转到指定页
Page.prototype.changePage=function(index){
	this.pageIndex=parseInt(index);
	this.__updateTableRows__();
}
/*
克隆原始操作行集合
*/
Page.prototype.__cloneRows__ = function () {
    var tempRows = [];
	let datarows_len=this.__dataRows__.length;
	for (var i = 0; i < datarows_len; i++) {
        /*
        code:this.dataRows[i].cloneNode(param), 
        param = 1 or true:复制以指定节点发展出去的所有节点,
        param = 0 or false:只有指定的节点和它的属性被复制.
        */
        tempRows[i] = this.__dataRows__[i].cloneNode(1);
    }
    return tempRows;
};
/* 
* 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒 
* 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00 
* 返回精度为：秒，分，小时，天 
*/
function GetDateDiff(startTime, endTime, diffType) { 
	//将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
	startTime = startTime.replace(/\-/g, "/"); 
	endTime = endTime.replace(/\-/g, "/"); 
	//将计算间隔类性字符转换为小写 
	diffType = diffType.toLowerCase(); 
	var sTime = new Date(startTime); //开始时间 
	var eTime = new Date(endTime); //结束时间 
	//作为除数的数字 
	var divNum = 1; 
	switch (diffType) { 
	case "second": 
		divNum = 1000; 
		break; 
	case "minute": 
		divNum = 1000 * 60; 
		break; 
	case "hour": 
		divNum = 1000 * 3600; 
		break; 
	case "day": 
		divNum = 1000 * 3600 * 24; 
		break; 
	default: 
	break; 
	} 
	return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum)); 
} 
//阻止事件冒泡
function stopPropagation(e) {  
	e = e || window.event;  
	if(e.stopPropagation) { //W3C阻止冒泡方法  
		e.stopPropagation();  
	} else {  
		e.cancelBubble = true; //IE阻止冒泡方法  
	}  
}
//判断是否为数值型字符串
function isNumber(val) {
	var regPos = /^\d+(\.\d+)?$/; //非负浮点数
	var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
	if(regPos.test(val) || regNeg.test(val)) {
		return true;
		} else {
		return false;
	}
}
//获取区间的随机整数   used by electricroommonitor 
function rnd(n, m) {
	var random = Math.floor(Math.random() * (m - n + 1) + n);
	return random;
}
function fake_click(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent(
        "click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
    );
    obj.dispatchEvent(ev);
}
//保存内容到本地文件
function download(name, data) {
    var urlObject = window.URL || window.webkitURL || window;

    var downloadData = new Blob([data]);

    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(downloadData);
    save_link.download = name;
    fake_click(save_link);
}

//websocket 测试
function sendstr(action,para){
	wscount++
	var str={
		"Guid":"websocketGuid"+wscount,
		"Action":"GetRealsNew",
		"Para":{
			"AccessToken":sessionStorage.accessToken
		}
	};
	if(action)
		str.Action=action;
	if(para)
		str.Para=para;
	if(typeof(wsconnect)!="undefined" || wsconnect)
		ws.send(JSON.stringify(str));
	//ws.send()
}
function closews(){
	if(ws)
		ws.close()
	//alert('连接已断开');
}
function openws(){
	var usews;
	if(localStorage.usews)
		usews=localStorage.usews
	else
		usews=jfjk_base_config.usews;
	if(!ws && (usews=="true"||usews==true))
		WebSocketTest();
}
function WebSocketTest() {
	if ("WebSocket" in window) {
		//alert("您的浏览器支持 WebSocket!",1000);
		// 打开一个 web socket ws://82.157.123.54:9010/ajaxchattest
		var ws_url=localStorage.server_url.replace("http","ws");
		ws = new WebSocket(ws_url+"ws");//ws://123.207.136.134:9010/ajaxchattest此在线测试地址可以正常连接和通信。192.168.10.250:805/ws
		ws.onopen = function (evt) {
			console.log("连接成功...");
			// Web Socket 已连接上，使用 send() 方法发送数据 encodeURIComponent
			var str={
				"Guid":"abcdefg",
				"Action":"BindAccessToken",
				"Para":{
					"AccessToken":sessionStorage.accessToken
				}
			}
			sessionStorage.wscount=0;
			ws.send(JSON.stringify(str));
		};
		ws.onmessage = function (evt) {//接收到信息时触发此事件，回调函数
			//var received_msg =decodeURIComponent(evt.data).substring(0,decodeURIComponent(evt.data).indexOf('['));// ;
			var obj_rec=JSON.parse(evt.data);
			if(obj_rec){
				var rec_datas=obj_rec.result.datas;
				if(obj_rec.error==null || obj_rec.error=="null")
				switch(obj_rec.action){
				case "BindAccessToken":
					//RefreshToken(null,function(data){});
					wsconnect=true;
					break;
				case "GetRealsNew":
					decoderealdata(rec_datas);
					if(obj_rec.guid.indexOf("websocketGuid")>=0)
						iframemain[0].contentWindow.realcall(obj_rec.result,1);
					break;
				case "GetReals" :
					decoderealdata(rec_datas);
					if(obj_rec.guid.indexOf("websocketGuid")>=0)
						iframemain[0].contentWindow.realcall(obj_rec.result,-1);/**/
					localStorage.setItem("realdata",JSON.stringify(rec_datas));
					if((sessionStorage.pageindex==2||sessionStorage.pageindex==17)&&
						(typeof iframemain[0].contentWindow.decoderealdata==="function"))
						iframemain[0].contentWindow.decoderealdata(rec_datas);
					break;
				case "GetHistoriesByNode":
					iframemain[0].contentWindow.decodedatas(rec_datas,1);
					break;
				case "GetHistoriesBySensor":
				case "GetHistoriesBySensors":
					
				case "GetMessagesByNode":
				case "GetMessagesBySensor":
				case "GetMessagesBySensors":
					iframemain[0].contentWindow.decodedatas(rec_datas);
					break;
				case "GetSensorsByNode":
					getsensorsbynode_bc(obj_rec.result);
					break;
				case "GetSensors":
					getsensors_bc(obj_rec.result);
					break;
				case "GetNodeGraphicsByNode":
					getbinaries_bc(obj_rec.result);
					break;
				case "GetNodes":
					getnodes_bc(obj_rec.result);
					break;
				case "GetNodeGraphics":
					iframemain[0].contentWindow.getnodegraphics_bc(obj_rec.result);
					break;
				case "GetProfile":
					if(sessionStorage.pageindex==20){
						iframemain[0].contentWindow.getprofile_bc(obj_rec.result)						
					}
					break;
				case "RefreshToken":
					refreshtoken_bc(obj_rec.result);
					break;
				}
			}
			console.log(rec_datas);
			//document.getElementById("rec_str").innerText=document.getElementById("rec_str").innerText+("发送的信息为"+decodeURIComponent(received_msg))+"\r\n";//.type+received_msg.size;
		};
		ws.onclose = function (evt) {//ws关闭时调用的函数
			// 关闭 websocket 
			//alert("连接已关闭...");hotter hottest best better good well ok great
			ws=null;
			wsconnect=false;
			console.log("连接已关闭...");
			if(sessionStorage.wscount>0 && sessionStorage.wscount<3){
				openws();
				sessionStorage.wscount=0;
			}
		};
		ws.onerror=function (evt){//连接出错时的处理函数
			sessionStorage.wscount++;
			console.log(evt.data);
			wsconnect=false;
		}
	}else {
		// 浏览器不支持 WebSocket
		alert("您的浏览器不支持 WebSocket!");
	}
}
/***
 * 后台服务器故障时的登录提示内容，信息提示框的样式，信息提示框添加手动关闭功能。避免出现空白提示框的边框而不能消除。
 * 
 * 连接异常时的报错信息，历史数据和实时数据没有返回值时的异常处理，对多次异常时的处理过程,主页面的登录用户名称和登录状态显示内容。
 * 系统网络连接的状态改变；系统每5-10分钟进行连接判断或重连，每15-30分钟进行一次安全验证码刷新操作，
 * 20201221 将sendorde的get和post两个方法函数合并，判断有无要传输的数据数组，来觉得是使用那种方式。
 * 同时添加在刷新安全认证吗后紧接着重新执行刚才的通信指令；添加一些变量的清除初始化工作； 黄芪神祗
 * 2021
 * 对所有循环操作进行必要的优化（添加break或删除已找到的元素或直接返回退出，以减少循环次数，优化运行效果）
 * 
 * 排序对数字字符串的判断，解决时间等字符串错误判断成数字的问题；解决首次今日状态图页面状态图由于显示比例未知而不显示的问题；
 * 告警列表添加按列标题排序功能；设备列表添加序号列，解决将标签编号显示成序号的问题。
 */
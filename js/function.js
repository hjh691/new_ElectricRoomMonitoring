var token = "1234567";//后台http认证码
sessionStorage.errortime=0;
sessionStorage.dataId = 0;
sessionStorage.sensors=[];
//sessionStorage.timeindex=0;
var maps=[];
var str_speech = "告警";//告警信息
if(jfjk_base_config.baseurl.indexOf("localhost")>-1){
	jfjk_base_config.baseurl=jfjk_base_config.baseurl.replace("localhost",window.location.hostname);
	jfjk_base_config.speechurl=jfjk_base_config.speechurl.replace("localhost",window.location.hostname);
}else if(jfjk_base_config.baseurl.indexOf("127.0.0.1")>-1){
	jfjk_base_config.baseurl=jfjk_base_config.baseurl.replace("127.0.0.1",window.location.hostname);
	jfjk_base_config.speechurl=jfjk_base_config.speechurl.replace("127.0.0.1",window.location.hostname);
}
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
//获取区间的随机整数   used by electricroommonitor 
function rnd(n, m) {
	var random = Math.floor(Math.random() * (m - n + 1) + n);
	return random;
}
//初始化登录页面： used by electricroommonitor 
function initlogin() {
	document.getElementById("login_pic").src = jfjk_base_config.login_src;
	document.getElementById("company_name").innerHTML = jfjk_base_config.app_name;
	document.getElementById("main").style.backgroundImage="url("+jfjk_base_config.bg_src+" no-repeat center top ;background-size:100%";
}
//判断用户名和密码输入是否符合语法  used by electricroommonitor 
function LoginOrder(name, ps) {
	var url = jfjk_base_config.baseurl + "Login?name=" + name + "&pass=" + ps;
	url = encodeURI(url);
	$.ajax({
		url: url,
		type: 'GET',
		beforeSend: function(request) {
			request.setRequestHeader("Token", token);
			sessionStorage.islogin = false;
		},
		dataType: 'json',
		timeout: 10000,
		error: function(data, status) {
			if (status == "timeout") {
				layer.alert("登录超时")
			} else {
				layer.alert("登录失败，请稍后重试");
				sessionStorage.islogin = false;
			}
			sessionStorage.errortime=0;

		},
		success: function(data, status) {
			var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
			if (status == "success") {

				if (data.Error == null) {
					sessionStorage.token = data.Result.Token;
					sessionStorage.username = name;
					sessionStorage.islogin = true;
					if (sessionStorage.errortime == 0) {
						window.location.href = "mainpage.html";
					} else {
						sessionStorage.errortime = 0;
						//sessionStorage.dataId = 0;
						//refreshpages();
					}
				} else {

					sessionStorage.islogin = false;
					window.location.href = "index.html";
					layer.alert("登录失败，" + data.Error + ",请确认输入信息正确，注意字母的大小写。");
				}
			}
		}
	});
}
//用户登录  used by electricroommonitor
function login() {
	var islogin = false;
	var sname = document.getElementById('username').value;
	if ((sname == '') || (sname == null)) {
		layer.alert('请输入用户名称!');
	} else {
		var sps = document.getElementById('password').value;
		if ((sps == '') || (sps == null)) {
			layer.alert('密码为空，请输入密码');
		} else {
			if ((sname != '') && (sps != '')) {
				//layer.alert(sname);
				sessionStorage.username = sname;
				sessionStorage.password = sps;
				LoginOrder(sname, sps);
			}
		}
	}

}
function quxiao() {
	document.getElementById('username').value = "";
	document.getElementById('password').value = "";
}
//退出登录 used by electricroommonitor
function logout() {
	sessionStorage.SensorId=-1;
	sessionStorage.nodeId=-1;
	sessionStorage.nodeid=-1;
	var url = jfjk_base_config.baseurl + "Logout";
	url = encodeURI(url);
	if (sessionStorage.islogin == "true") {
		$.ajax({
			beforeSend: function(request) {
				request.setRequestHeader("_token", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function(jqXHR, textStatus, errorThrown) {
				//layer.alert('退出登录操作失败');
				sessionStorage.islogin = false;
				sessionStorage.username = "未登录";
				window.location.href = "index.html";
				init_var();
			},
			success: function(data, status) {
				var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if (status == "success") {
					islogin = true;
					if (data.Error == null) {
						sessionStorage.username = "未登录";
						sessionStorage.islogin = false;
						window.location.href = "index.html";
					} else {
						sessionStorage.username = "未登录";
						sessionStorage.islogin = false;
						window.location.href = "index.html";
					}
				}
				init_var();
			}
		});
	} else {
		sessionStorage.username = "未登录";
		sessionStorage.islogin = false;
		window.location.href = "index.html";
		init_var();
	}
}
function init_var(){
	sessionStorage.SensorId=-1;
	sessionStorage.BinariesId=-1;
	sessionStorage.SensorName="";
	sessionStorage.dataId=0;
	sessionStorage.sensors=[];
	sessionStorage.nodeId=-1;
	sessionStorage.name="";
}
//获取用户详细信息 used by electricroommonitor
function GetUserProfile() {
	var url = jfjk_base_config.baseurl + "/GetProfile";
	url = encodeURI(url);
	if (sessionStorage.islogin == "true") {
		$.ajax({
			beforeSend: function(request) {
				request.setRequestHeader("_token", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function(jqXHR, textStatus, errorThrown) {
				layer.alert('获取用户详细信息操作失败');
				document.getElementById("up-yhmc").value = sessionStorage.username;
				sessionStorage.errortime++;
				if(sessionStorage.errortime>3){
					sessionStorage.islogin=false;
					sessionStorage.errortime=0;
				}
			},
			success: function(data, status) {
				var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if (status == "success") {
					sessionStorage.errortime = 0;
					sessionStorage.islogin = true;
					if (data.Error == null) {
						document.getElementById("up-yhbh").value = data.Result.Id;
						document.getElementById("up-yhmc").value = data.Result.Name;
						document.getElementById("up-yhmm").value = ""; //data.Result.UserPass;
						document.getElementById("up-yhqx").value = data.Result.Roles;//UserLimit;
						document.getElementById("up-tel").value = data.Result.Tele;//UserLimit;
						document.getElementById("up-email").value = data.Result.Email;//UserLimit;
						document.getElementById("up-yhsm").value = data.Result.Display;//Description;

					} else {
						layer.alert(data.Error);
						sessionStorage.islogin = ture;
					}
				}
			}
		});
	} else {
		Alert("用户未登录，您无权完成此次操作", 2000);
	}
}

//初始化page1的时间空间 used by electricroommonitor
function initpage1() {
	document.getElementById("kssj_chart").value =  getCurrentDate(1) + " 00:00:00";
	document.getElementById("jssj_chart").value =  getCurrentDate(1) + " 23:59:59";
	//drawchart()
}
//初始化信息汇总页面
function inittotalpage(){  // used by electricroommonitor
	sessionStorage.pageindex=0;
	document.getElementById("iframe_main").src="infototal.html";
}
// 初始化实时数据页面，根据不同站点、不同子系统来调用不同的页面 used by electricroommonitor 
function initrealdata(){
	var pages=document.getElementById("iframe_main");
	//var data=$("#tree").treeview("getSelected");
	if(pages.src.indexOf("/realdata.html")<=0){
		document.getElementById("iframe_main").src="realdata.html";
	}
	sessionStorage.pageindex=2;
	/*switch (data[0].text){
		case "行唐":
		case "测温":
			document.getElementById("iframe_main").src="realdata.html";
			break;
		case "局部放电":
		//case "行唐":
			document.getElementById("iframe_main").src="GaugeOfJufang.html";
			break;
		case "弧光保护":
		case "石家庄":
			document.getElementById("iframe_main").src="GaugeOfHuguang.html";
			break;
		case "视频监控":
			document.getElementById("iframe_main").src="javascript:void(0)";
			break;
		case "机房监控":
			document.getElementById("iframe_main").src="roommonitor.html";
			break;
		case "门禁":
			document.getElementById("iframe_main").src="guard.html";
			break;
		case "水浸":
			document.getElementById("iframe_main").src="flooding.html";
			break;
		case "灯光":
			document.getElementById("iframe_main").src="light.html";
			break;
		case "环境":
			document.getElementById("iframe_main").src="humiture.html";
			break;
		case "空调":
			document.getElementById("iframe_main").src="airconditioning.html";
			break;
		case "动力":
			document.getElementById("iframe_main").src="ups.html";
			break;
		case "烟感":
			document.getElementById("iframe_main").src="SmokeDetector.html";
			break;
		case "红外":
			document.getElementById("iframe_main").src="infrared.html";
			break;
	}*/
}

//网络连接心跳包 re_use used by electricroommonitor 
function sendbeat() {
	sessionStorage.jssj=getCurrentDate(2);
	var url = jfjk_base_config.baseurl; //+"GetGraphic?graphicId="+stationID;
	url = encodeURI(url);
	if ((sessionStorage.islogin == "true") && (sessionStorage.errortime <= 3)) {
		$.ajax({
			beforeSend: function(request) {
				request.setRequestHeader("_token", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function(){
				//sessionStorage.islogin=false;
				//Alert('获取指定编号的图形操作失败');
				sessionStorage.errortime++;
				if(sessionStorage.errortime>3){
					sessionStorage.islogin=false;
				}
			},
			success: function(data,status){
				sessionStorage.errortime=0;
				var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if(status=="success"){
					sessionStorage.islogin=true;
					if(data.Error==null){
						islogin=true;
					}else{
						layer.alert(data.Error);
					}
				}
			}
		});/**/
		//getrealsbydataid();
	} else {
		sessionStorage.islogin = false;
		Alert("与服务器连接失败", 2000);
		sessionStorage.errortime=0;
		LoginOrder(sessionStorage.username, sessionStorage.password);
	}
}
/*//index页面初始化
function initIndex() {
	showusername();
	document.getElementById('app_name').innerHTML = '<i>' + jfjk_base_config.app_name + "</i>";
	document.getElementById('company_log').src = jfjk_base_config.log_src;
	document.getElementById('company_info').href = jfjk_base_config.company_url;
	sessionStorage.kssj = getCurrentDate(1) + " 00:00:00"; //"2012-09-03T08:00:00";//;
	sessionStorage.jssj = getCurrentDate(2); //"2012-09-05T08:00:00";//
	//sessionStorage.pageindex = 1;
	//getgraphics();
	//document.getElementById("iframe_main").src = 'drawmap.html';
}*/
//主页面显示用户名称  used by electricroommonitor 
function showusername() {
	if (sessionStorage.islogin == "true") {
		var yhname = document.getElementById('yhname');
		yhname.innerHTML = "<a href='javascript:void(0)' onclick='loaduserprofile()' style='color:white;text-decoration: none;'>" + sessionStorage.username + "</a>"; //#屏蔽href=userprofile.html
		document.getElementById('yhout').innerHTML = "<a href='javascript:logout()' style='color:white;text-decoration: none;'>[退出]</a>";
		//document.getElementById("iframe_main").src="userprofile.html";
	} else {
		document.getElementById('yhout').innerHTML = "<a href='index.html' style='color:white;text-decoration: none;'>[登录]</a>";
	}
}
//用户属性页面
function loaduserprofile(){
	document.getElementById("iframe_main").src="userprofile.html";
}
//获取指定站点的实时数据 no_use
function getrealdatabystation(id) {
	sessionStorage.pageindex = 2;
	var count = 0,
	err_count = 0;
	if (typeof(sessionStorage.stationID) != "undefined") {
		var url = jfjk_base_config.baseurl + "GetRealsByStation?stationId=" + sessionStorage.stationID;
		url = encodeURI(url);
		if (sessionStorage.islogin == "true") {
			$.ajax({
				beforeSend: function(request) {
					request.setRequestHeader("_token", sessionStorage.token);
				},
				url: url,
				type: 'GET',
				dataType: 'json',
				timeout: 10000,
				error: function(jqXHR, textStatus, errorThrown) {
					sessionStorage.errortime++;
					if (errorThrown == "Unauthorized") {
						layer.alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取站实时数据操作失败');
					} else {
						layer.alert(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取站实时数据操作失败');
					}
				},
				success: function(data, status) {
					var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
					if (status == "success") {
						sessionStorage.errortime = 0;
						sessionStorage.islogin = true;
						if (data.Error == null) {
							if (jQuery.isEmptyObject(data.Result.Datas)) {
								if (id == 0) {
									//layer.alert("没有符合条件的记录",2000);
									layer.alert("没有符合条件的记录");
								}
								return;
							}
							if (data.Result.Datas.hasOwnProperty("Tmp")) {
								/**/
								var tbody = document.getElementById('realdata-tbody');
								var trs = tbody.getElementsByTagName("tr");
								//data.Result.Datas.Tmp.sort(data.Result.Datas.Tmp.SensorId);
								for (var i = 0; i < data.Result.Datas.Tmp.length; i++) {
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
										var tbody = document.getElementById('realdata-tbody');
										tbody.appendChild(tr);
									}
								}
								count = data.Result.Datas.Tmp.length;
								//parent.window.showfudongdiv();
							}
							if (data.Result.Datas.hasOwnProperty("Err")) {
								for (var i = 0; i < data.Result.Datas.Err.length; i++) {
									if (jQuery.isEmptyObject(data.Result.Datas.Err[i].Value)) {
										for (var j = 0; j < trs.length; j++) {
											if (trs[j].cells[0].childNodes[0].data == data.Result.Datas.Err[i].SensorId) {
												trs[j].cells[3].style.backgroundColor = trs[j].cells[2].style.backgroundColor;
												//err_count++;
												break;
											}
										}
										continue;
									}
									for (var j = 0; j < trs.length; j++) {
										if (trs[j].cells[0].childNodes[0].data == data.Result.Datas.Err[i].SensorId) {
											trs[j].cells[3].style.backgroundColor = "#FFFF00";
											err_count++;
											break;
										}
									}
								}
								//err_count=data.Result.Datas.Err.length;
							}
							document.getElementById('count_val').innerHTML = count + "条";
							//document.getElementById('normal_count').innerHTML=count-err_count+"条";
							document.getElementById('err_count').innerHTML = err_count + "条";
						} else {
							layer.alert(data.Error, 2000);
						}
					}
				}
			});
		} else {
			layer.alert("与服务器连接失败");
			//window.location.href="index.html";
		}
		document.getElementById('station_name').innerHTML = sessionStorage.stationName;
	}
}
//跳转到历史数据  used by electricroommonitor
function tohistory(sorid) {
	/*var tbody=document.getElementById('realdata-tbody');
		var trs = tbody.getElementsByTagName("tr");
		for(var j=0;j<trs.length;j++){
			if(trs[j].cells[0].childNodes[0].data==sorid){
				sessionStorage.SensorName=trs[j].cells[1].childNodes[0].data;
				break;
			}
		}*/
	sessionStorage.SensorId = sorid;
	parent.window.document.getElementById('iframe_main').src = 'historydata.html';
}
//跳转到告警信息查询  used by electricroommonitor
function towarnlog(sorid) {
	/*var tbody=document.getElementById('realdata-tbody');
		var trs = tbody.getElementsByTagName("tr");
		for(var j=0;j<trs.length;j++){
			if(trs[j].cells[0].childNodes[0].data==sorid){
				sessionStorage.SensorName=trs[j].cells[1].childNodes[0].data;
				setSelectOption("jcdd",sorid);
				break;
			}
		}*/
	flag_warning = 0;
	sessionStorage.SensorId = sorid;
	parent.window.document.getElementById('iframe_main').src = 'warnlog.html';
	//querywarnlog(0);
}
//显示或关闭浮动窗口 userd by ele
function showfudongdiv() {
	//document.getElementById("alert_info").innerHTML="告警：温度过高，数值：12345.876";
	if (document.getElementById("KeFuDiv").style.display == "none") {
		document.getElementById("KeFuDiv").style.display = "block";
	}
	document.getElementById("KeFuDiv").show;
}
function hidefudongdiv() {
	if (document.getElementById("KeFuDiv").style.display == "block") {
		document.getElementById("KeFuDiv").style.display = "none";
	}
	document.getElementById("KeFuDiv").show;
	//parent.window.document.getElementById('iframe_main').src='realwarning.html';
}
//获取全部的实时数据// used by electricroommonitoring
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
				request.setRequestHeader("_token", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function(jqXHR, textStatus, errorThrown) {
				sessionStorage.errortime++;
				if (errorThrown == "Unauthorized") {
					layer.alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取实时数据操作失败');
				} else {
					layer.alert(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取实时数据操作失败');
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
						/*var obj = data.Result,
						str_binding = '';
						var graphic = JSON.parse(sessionStorage.contents);
						if (jQuery.isEmptyObject(obj.Sensors)) {
							//Alert("数据为空");
							return;
						} else if (obj.hasOwnProperty("Sensors")) {
							sensors = obj.Sensors;
						} else {
							//Alert("数据为空");
							return;
						}
						if (jQuery.isEmptyObject(sensors.Stations)) {
							//Alert("数据为空");
							return;
						} else if (sensors.hasOwnProperty("Stations")) {
							stations = sensors.Stations;
							if (stations.length <= 0) {
								//Alert("数据为空");
								return;
							}
						}
						if (jQuery.isEmptyObject(sensors.Collectors)) {
							//Alert("数据为空");
							return;
						} else if (sensors.hasOwnProperty("Collectors")) {
							collectors = sensors.Collectors;
							if (collectors.length <= 0) {
								//Alert("数据为空");
								return;
							}
						}
						if (jQuery.isEmptyObject(sensors.Sensors)) {
							//Alert("数据为空");
							return;
						} else if (sensors.hasOwnProperty("Sensors")) {
							sensors = sensors.Sensors;
							if (sensors.length <= 0) {
								//Alert("数据为空");
								return;
							}
						}*/
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
								/*for (var j = 0; j < sensors.length; j++) {
									if (tmps[i].SensorId == sensors[j].Id) {
										var collectorid = sensors[j].CollectorId;
										var adr = sensors[j].Addr;
										for (var l = 0; l < collectors.length; l++) {
											if (collectors[l].Id == collectorid) {
												var str_binding = collectors[l].Channel + '_' + adr;
												break;
											}
										}
										break;
									}
								}
								if (j >= sensors.length) {
									continue;
								}*/
								//刷新图形对应数据值
								/*try {
									for (var k = 0; k < graphic.length; k++) {
										if (!graphic[k]) {
											continue;
										}
										var str = JSON.parse(graphic[k]);
										if (str._shape.Binding == str_binding) {
											if ((str._type == "Title") || (str._type == "Monitor")) {
												str._shape.Text = tmps[i].Value;
												graphic[k] = JSON.stringify(str);
											}
										}
									}
								} catch(err) {

								}*/
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
									var tbody = document.getElementById('realdata-tbody');
									tbody.appendChild(tr);
								}

							}
							/*if(sessionStorage.pageindex==1){
									drawmap(graphic);
									sessionStorage.contents=JSON.stringify(graphic);
								}*/
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
								if (i % 2 == 0) {
									tr.setAttribute('style', "background-color:#16b9c9");
								}
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
						layer.alert(data.Error);
					}
				}
			}
		});
	} else {
		//layer.alert("与后台服务器连接失败");
		sessionStorage.islogin = false;
		//LoginOrder(sessionStorage.username,sessionStorage.password);
	}

}
/**获取站点信息列表。状态图、实时数据、历史数据、趋势图、告警查询、短信日志查询导航按钮
	点击时执行必要的操作，更新左侧的站点或图形信息列表（如果已经是站点列表或图形列表怎不进行
	切换操作，只更新右侧主框架内个目标页面。
	loadstations_realdata（），点击实时数据时执行的操作
	*/
var first = 0;
function loadstations_realdata() {
	sessionStorage.pageindex = 2;
	var slistname = $("#head_list_name").text();
	if (slistname != "请选择站点:") {
		//initlist();
	}
	document.getElementById("iframe_main").src = 'realdata.html';
}
//load//////reuse  used by electricroommonitor 
function loadstations_historydata() {
	sessionStorage.pageindex = 3;
	//var slistname = $("#head_list_name").text();
	//if (slistname != "请选择站点:") {
		//initlist();
	//}
	document.getElementById("iframe_main").src = 'historydata.html';
}
function loadstations_chart() {////reuse  used by electricroommonitor 
	sessionStorage.pageindex = 4;
	//var slistname = $("#head_list_name").text();
	//if (slistname != "请选择站点:") {
		//initlist();
	//}
	document.getElementById("iframe_main").src = 'chart.html';
}
function loadstations_warnlog() {
	sessionStorage.pageindex = 5;
	//var slistname = $("#head_list_name").text();
	//if (slistname != "请选择站点:") {
		//initlist();
	//}
	document.getElementById("iframe_main").src = 'warnlog.html';
}
function loadstations_smslog() {
	sessionStorage.pageindex = 6;
	var slistname = $("#head_list_name").text();
	if (slistname != "请选择站点:") {
		initlist();
	}
	document.getElementById("iframe_main").src = 'smslog.html';
}
function initlist() {
	var slistname = $("#head_list_name").text();
	if (slistname != "请选择站点:") {
		$("#head_list_name").text("请选择站点:");
		$("#lab_stationid").text("站点编号");
		$("#lab_stationname").text("站点名称");
		$("#stationslist tr").empty();
		$("#stationslist tr").empty();
		document.getElementById("graphicslist").style.display = "none";
		document.getElementById("stationslist").style.display = "block";
		GetStations();
	}
	if (slistname != "请选择图形:") {
		$("#head_list_name").text("请选择图形:");
		$("#lab_stationid").text("图形编号");
		$("#lab_stationname").text("图形名称");
		//$("#graphicslist tr").empty();
		//$("#graphicslist tr").empty();
		document.getElementById("graphicslist").style.display = "block";
		document.getElementById("stationslist").style.display = "none";
		getgraphics();
	}
}
//获取站点列表
function GetStations() {
	var pt = 0;
	$("#graphicslist tr").empty();
	var url = jfjk_base_config.baseurl + "GetStations";
	url = encodeURI(url);
	if (sessionStorage.islogin == "true") {
		$.ajax({
			beforeSend: function(request) {
				request.setRequestHeader("_token", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function(jqXHR, textStatus, errorThrown) {
				sessionStorage.errortime++;
				if (errorThrown == "Unauthorized") {
					Alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取站点列表操作失败', 2000);
				} else {
					Alert(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取站点列表操作失败', 2000);
				}
			},
			success: function(data, status) {
				//var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if (status == "success") {
					sessionStorage.errortime = 0;
					sessionStorage.islogin = true;
					if (data.Error == null) {
						if (data.Result.Stations == null) {
							layer.alert("没有符合条件的记录");
							return;
						}
						if (data.Result.hasOwnProperty("Stations")) {
							var tb = document.getElementById('stationstable');
							var rowNum = tb.rows.length;
							for (i = 0; i < rowNum; i++) {
								tb.deleteRow(i);
								rowNum = rowNum - 1;
								i = i - 1;
							}
							var tbody = document.getElementById('stationslist');
							//var tree=document.getElementById('treeitem');
							for (var i = 0; i < data.Result.Stations.length; i++) { //data.Result.length
								let tr = document.createElement('tr');
								//tr.setAttribute("onclick", "c1(this)");
								tr.setAttribute("style", "margin-left:30px");
								var tdid = document.createElement('td');
								tdid.setAttribute("style", "width:50xp");
								tdid.setAttribute("style", "display:none");
								var tdename = document.createElement('td');
								tdename.setAttribute("style", "width:150px");
								var a = document.createElement('a');
								a.setAttribute('href', 'javascript:void(0)');
								a.setAttribute('style', 'color:#000');
								a.setAttribute('style', 'text-decoration: none');
								a.innerHTML = data.Result.Stations[i].Name;
								tdid.innerHTML = data.Result.Stations[i].Id;
								tdename.appendChild(a); //.innerHTML=data.Result.Stations[i].Name;//jsonObject[i].name;
								tr.appendChild(tdid);
								tr.appendChild(tdename);
								tbody.appendChild(tr);
								if (data.Result.Stations[i].Id == sessionStorage.stationID) {
									pt = i;
									first = -1;
								}
								let item = data.Result.Stations[i];
								$(tr).click(function(){
									c1(tr,item);
								})
								/*var li=document.createElement('li');
							var a=document.createElement('a');
							a.setAttribute('onclick','domenu('+data.Result.Stations[i].Id+')');
							a.innerHTML=data.Result.Stations[i].Name;
							li.appendChild(a);
							tree.appendChild(li);*/
							}
							var trs = tbody.getElementsByTagName("tr");
							trs[pt].onclick();
						}
					} else {
						layer.alert(data.Error);
					}
				}
			}
		});
	} else {
		layer.alert('与服务器连接失败');
	}
}
//显示新密码输入选项	
function showeditpassword() {
	document.getElementById("up-editpassword").style.display = "inline";
	document.getElementById("up-yhmmqr").style.display = "inline";
	document.getElementById("txt_postpassword").style.display = "inline";
}
//提交密码修改内容
function postpassword() {
	//var yhbh=document.getElementById("up-yhbh").value;
	//var yhmc=document.getElementById("up-yhmc").value;
	var yhmm = document.getElementById("up-yhmm").value;
	var xmm = document.getElementById("up-yhmmqr").value;
	//var yhsm=document.getElementById("up-yhsm").value;
	if (yhmm == '') {
		layer.alert("请输入原始密码");
		return;
	}
	if (xmm == '') {
		layer.alert("请输入新密码");
		return;
	}
	var url = jfjk_base_config.baseurl + "ChangePass?pass=" + yhmm + "&newpass=" + xmm;
	url = encodeURI(url);
	$.ajax({
		beforeSend: function(request) {
			request.setRequestHeader("_token", sessionStorage.token);
		},
		url: url,
		type: 'GET',
		dataType: 'json',
		timeout: 10000,
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.alert('密码修改操作失败');
		},
		success: function(data, status) {
			if (status == "success") {
				if (data.Error == null) {
					layer.alert("密码修改成功，请用新密码登录");
					window.location.href = "javascript:void(0)";
					top.location = "index.html";
					return;
				} else {
					layer.alert(data.Error);
				}
			}
		}
	});
}
//选中站点列表项时的获得站点的编号。
var selectedTr = null;
var issame = false;
function c1(obj) {
	//obj.style.backgroundColor = '#85e494'; //把点到的那一行变希望的颜色;
	
	$(obj).css("background","#85e494");
	$(obj).siblings().css("background","white");
	//if ((selectedTr != obj) && (selectedTr != null)) selectedTr.style.backgroundColor = 'white'; //removeAttribute("backgroundColor");
	//if (selectedTr == obj)
	//	selectedTr = null//加上此句，以控制点击变白，再点击反灰
	//else{
	selectedTr = obj;
	check();
	//}
}
/*得到选中行的第一列的值(站点变化）以及第二例的值（站点名称）
	如果所选编号与当前显示的变化一致，则不进行切换，也不对页面进行更新初始化。
	*/
function check() {
	if (selectedTr != null) {
		var slistname = $("#head_list_name").text();
		if ((slistname == "请选择站点:")) {
			if (sessionStorage.stationID !== selectedTr.cells[0].childNodes[0].data) {
				if (first != '-1') {
					sessionStorage.stationID = selectedTr.cells[0].childNodes[0].data;
					sessionStorage.stationName = selectedTr.cells[1].childNodes[0].childNodes[0].data;
				}
				if (typeof(sessionStorage.stationID) == "undefined") {
					sessionStorage.stationID = selectedTr.cells[0].childNodes[0].data;
					sessionStorage.stationName = selectedTr.cells[1].childNodes[0].childNodes[0].data;
				}
			} else {
				issame = true;
			}
		}
		if ((slistname == "请选择图形:")) {
			if (sessionStorage.graphicID !== selectedTr.cells[0].childNodes[0].data) {
				if (first != '-1') {
					sessionStorage.graphicID = selectedTr.cells[0].childNodes[0].data;
					sessionStorage.graphicName = selectedTr.cells[1].childNodes[0].childNodes[0].data;
				}
				if (typeof(sessionStorage.graphicID) == "undefined") {
					sessionStorage.graphicID = selectedTr.cells[0].childNodes[0].data;
					sessionStorage.graphicName = selectedTr.cells[1].childNodes[0].childNodes[0].data;
				}
			} else {
				issame = true;
			}
		}
		//document.getElementById("lab").innerHTML = str;
		if (!issame) {
			if (sessionStorage.pageindex == 3) {
				document.getElementById("iframe_main").src = 'historydata.html';
			} else if (sessionStorage.pageindex == 4) {
				document.getElementById("iframe_main").src = 'chart.html';
			} else if (sessionStorage.pageindex == 2) {
				document.getElementById("iframe_main").src = 'realdata.html';
			} else if (sessionStorage.pageindex == 1) {
				document.getElementById("iframe_main").src = 'drawmap.html';
			} else if (sessionStorage.pageindex == 5) {
				document.getElementById("iframe_main").src = 'warnlog.html';
			}
		} else {
			issame = false;
		}
		first++;
	} else {
		layer.alert("请选择一行");
	}
}
/*//初始化历史数据页面（在进入历史数据页面时触发）。
function inithistorydata() {
	sessionStorage.pageindex = 3;
	setSelectOption("jcdd", sessionStorage.SensorName);
	document.getElementById("kssj_history").value = sessionStorage.kssj;
	document.getElementById("jssj_history").value = sessionStorage.jssj;
	GetSensorsByStation();
}
//初始化历史数据图形显示页面（在进入趋势图页面时触发）。
function inithistorychart() {
	sessionStorage.pageindex = 4;
	GetSensorsByStation();
	document.getElementById("kssj_chart").value = sessionStorage.kssj;
	document.getElementById("jssj_chart").value = sessionStorage.jssj;
	
	var sel_sensor=document.getElementById("jcdd");
	for (var i = 0; i < sel_sensor.length; i++) {
		sel_sensor.removeChild(sel_sensor.options[0]);
		sel_sensor.remove(0);
		sel_sensor.options[0] = null;
	}
	var sensors=JSON.parse(localStorage.getItem("sensors"));
	for(var i=0;i<sensors.length;i++){
		var op=document.createElement("option");
		op.setAttribute("value",sensors[i].Id);
		op.innerHTML=sensors[i].Value.Name;
		sel_sensor.appendChild(op);
	}
	//drawchart()
}*/
//初始化告警信息查询页面（在进入告警信息页面时触发）。  used by electricroommonitor
function initwarnlog() {
	var parentid=-100,parentname="";
	var maps=[];
	sessionStorage.pageindex = 5;
	document.getElementById("kssj_warning").value = sessionStorage.kssj;
	document.getElementById("jssj_warning").value = sessionStorage.jssj;
	var sel_sensor=document.getElementById("jcdd");
	for (var i = 0; i < sel_sensor.length; i++) {
		sel_sensor.removeChild(sel_sensor.options[0]);
		sel_sensor.remove(0);
		sel_sensor.options[0] = null;
	}
	sensors=JSON.parse(localStorage.getItem("sensors"));
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
	sessionStorage.SensorId = sel_sensor.value;
	if(sessionStorage.SensorId=="")
		sessionStorage.SensorId=-1;
	//GetSensorsByStation();
	if((!sessionStorage.timeindex)||(typeof(sessionStorage.timeindex)=="undefined")){
		sessionStorage.timeindex=0;
	}
	$(":radio[name='timeselect'][value='"+sessionStorage.timeindex+"']").prop("checked","checked");
	seletime($(":radio[name='timeselect'][value='"+sessionStorage.timeindex+"']")[0]);
	if(sessionStorage.timeindex==4){
		querywarnlog();
	}
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
		//document.getElementById("result").innerHTML = "抱歉，你的浏览器不支持 Web Workers...";
		var t1 = window.setInterval("getrealdatabynodeid(-1);",60000);
	}
}
//初始化短信日志查询页面（在进入短信日志页面时触发）。
function initsmslog() {
	sessionStorage.pageindex = 6;
	document.getElementById("kssj_sms").value = sessionStorage.kssj;
	document.getElementById("jssj_sms").value = sessionStorage.jssj;
}
/*根据站点变化获取站内的所有标签列表，当前页面是趋势图、历史数据、
告警信息等几个页面时，对标签名称下拉列表框就那些初始化。

*/
function GetSensorsByStation() {
	if (sessionStorage.islogin == "true") {
		var url = jfjk_base_config.baseurl + "GetSensorsByStation?stationId=0" + sessionStorage.stationID;
		url = encodeURI(url);
		switch (sessionStorage.pageindex) {
		case "3":
			var sel = document.getElementById('jcdd');
			for (var i = 0; i < sel.length; i++) {
				sel.removeChild(sel.options[0]);
				sel.remove(0);
				sel.options[0] = null;
			}
			break;
		case "4":
			var sel = document.getElementById('jcdd');
			var sel2 = document.getElementById('jcdd2');
			var sel3 = document.getElementById('jcdd3');
			for (var i = 0; i < sel.length; i++) {
				sel.removeChild(sel.options[0]);
				sel.remove(0);
				sel.options[0] = null;
				sel2.removeChild(sel2.options[0]);
				sel2.remove(0);
				sel2.options[0] = null;
				sel3.removeChild(sel3.options[0]);
				sel3.remove(0);
				sel3.options[0] = null;
			}
			break;
		}
		$.ajax({
			beforeSend: function(request) {
				request.setRequestHeader("_token", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function(jqXHR, textStatus, errorThrown) {
				sessionStorage.errortime++;
				if (errorThrown == "Unauthorized") {
					Alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取指定站标签操作失败', 2000);
				} else {
					Alert(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取指定站标签操作失败', 2000);
				}
			},
			success: function(data, status) {
				//var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if (status == "success") {
					sessionStorage.errortime = 0;
					sessionStorage.islogin = true;
					if (data.Error == null) {
						if (!jQuery.isEmptyObject(data.Result.Sensors)) {
							//if(data.Result.hasOwnProperty('Sensors')){
							for (var i = 0; i < data.Result.Sensors.length; i++) { //data.Result.length
								var op = document.createElement('option');
								var op2 = document.createElement('option');
								var op3 = document.createElement('option');
								op.setAttribute("value", data.Result.Sensors[i].Id);
								op.innerHTML = data.Result.Sensors[i].Name;
								op2.setAttribute("value", data.Result.Sensors[i].Id);
								op2.innerHTML = data.Result.Sensors[i].Name;
								op3.setAttribute("value", data.Result.Sensors[i].Id);
								op3.innerHTML = data.Result.Sensors[i].Name;
								switch (sessionStorage.pageindex) {
								case '3':
									var sel = document.getElementById('jcdd');
									sel.appendChild(op);
									break;
								case '4':
									var sel = document.getElementById('jcdd');
									sel.appendChild(op);
									var sel2 = document.getElementById('jcdd2');
									sel2.appendChild(op2);
									var sel3 = document.getElementById('jcdd3');
									sel3.appendChild(op3);
									break;
								case '5':
									var sel = document.getElementById('jcdd');
									sel.appendChild(op);
									break;
								}
							}
							switch (sessionStorage.pageindex) {
							case '3':
								setSelectOption("jcdd", sessionStorage.SensorId);
								SensorName = sel.options[sel.selectedIndex].text;
								queryhistorydata(sessionStorage.kssj, sessionStorage.jssj);
								break;
							case '4':
								var sel = document.getElementById('jcdd');
								setSelectOption("jcdd", sessionStorage.firstid);
								sessionStorage.firstname = sel.options[sel.selectedIndex].text; //赋值
								var sel2 = document.getElementById('jcdd2');
								setSelectOption("jcdd2", sessionStorage.sencondid);
								sessionStorage.sencondname = sel.options[sel2.selectedIndex].text;
								var sel3 = document.getElementById('jcdd3');
								setSelectOption("jcdd3", sessionStorage.thirdid);
								sessionStorage.thirdname = sel.options[sel3.selectedIndex].text;
								//drawchart();
								break;
							case '5':
								setSelectOption("jcdd", sessionStorage.SensorId);
								sessionStorage.SensorName = sel.options[sel.selectedIndex].text;
								querywarnlog(flag_warning);
							}
						} else {
							Alert("没有符合条件的记录", 2000);
						}
					} else {
						layer.alert(data.Error);
					}
				}
			}
		});
	} else {
		layer.alert('与服务器连接断开');
	}
}
//根据标签名称确定下，拉列表框的选中项///////已用  used by electricroommonitor 
function setSelectOption(objid, sensor) {
	var sel = document.getElementById(objid);
	var options = sel.options;
	for (var i = 0; i < options.length; i++) {
		if (options[i].value == sensor) {
			options[i].defaultSelected = true;
			options[i].selected = true;
			break;
		}
	}
	if(options.length<=0){
		sessionStorage.SensorId=-1;
	}else if(i>=options.length)
		sessionStorage.SensorId=options[0].value;
	
}
//可自动关闭提示框
function Alert(str, delay) {
	var ranid = rnd(1, 100);
	var msgw, msgh, bordercolor;
	msgw = 350; //提示窗口的宽度  
	msgh = 80; //提示窗口的高度  
	titleheight = 25 //提示窗口标题高度  
	bordercolor = "#336699"; //提示窗口的边框颜色  
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
	msgObj.setAttribute("onclick", "closewin(" + ranid + ")");
	document.body.appendChild(msgObj);
	//提示信息标题  
	var title = document.createElement("h4");
	title.setAttribute("id", "alertmsgTitle");
	title.setAttribute("align", "left");
	title.style.margin = "0";
	title.style.padding = "3px";
	title.style.background = bordercolor;
	title.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
	title.style.opacity = "0.75";
	title.style.border = "1px solid " + bordercolor;
	title.style.height = "18px";
	title.style.font = "12px Verdana, Geneva, Arial, Helvetica, sans-serif";
	title.style.color = "white";
	title.innerHTML = "提示信息";
	document.getElementById("alertmsgDiv" + ranid).appendChild(title);
	//提示信息  
	var txt = document.createElement("p");
	txt.setAttribute("id", "msgTxt");
	txt.style.margin = "16px 0";
	txt.innerHTML = str;
	document.getElementById("alertmsgDiv" + ranid).appendChild(txt);
	//设置关闭时间  
	if (typeof(delay) === "number") window.setTimeout("closewin(" + ranid + ")", delay);
}
//将系统的信息告警提示框直接转换成自定义提示框  
window.alert = Alert;
//layer.alert=Alert;
//关闭指定id的提示框（窗口）。
function closewin(ranid) {
	document.body.removeChild(document.getElementById("alertbgDiv" + ranid));
	document.getElementById("alertmsgDiv" + ranid).removeChild(document.getElementById("alertmsgTitle"));
	document.body.removeChild(document.getElementById("alertmsgDiv" + ranid));
}
//获取历史数据    used by electricroommonitor 
function gethistorydata(sensorid,kssj, jssj,aparent) {
	if (sessionStorage.islogin == "true") {
		if (typeof(sensorid) != "undefined") {
			if((typeof(aparent)=="undefined")||(aparent!=1)){
				ajaxLoadingShow();
			}
			var url = jfjk_base_config.baseurl + "GetHistoriesBySensor?sensorId=" + sensorid + "&from=" + kssj + "&to=" + jssj;
			url = encodeURI(url);
			$.ajax({
				beforeSend: function(request) {
					request.setRequestHeader("_token", sessionStorage.token);
				},
				url: url,
				type: 'GET',
				dataType: 'json',
				timeout: 10000,
				error: function(jqXHR, textStatus, errorThrown) {
					sessionStorage.errortime++;
					ajaxLoadingHidden();
					//myChart.hideLoading();
					if (errorThrown == "Unauthorized") {
						layer.alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取历史数据操作失败');
					} else {
						layer.alert(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取历史数据操作失败');
					}
					if(sessionStorage.errortime>3){
						sessionStorage.islogin=false;
						sessionStorage.errortime=0;
					}
				},
				success: function(data, status) {
					//var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
					ajaxLoadingHidden();
					//myChart.hideLoading();
					if (status == "success") {
						sessionStorage.errortime = 0;
						sessionStorage.islogin = true;
						if (data.Error == null) {
							if (!jQuery.isEmptyObject(data.Result.Datas)) {
								if (!jQuery.isEmptyObject(data.Result.Datas[sensorid])) {
									//if(data.Result.Datas.hasOwnProperty("Tmp")){
										decodedatas( data.Result.Datas[sensorid]);
								} else {
									layer.alert("没有符合条件的记录",3000);
									decodedatas(null);
								}
							} else {
								layer.alert("没有符合条件的记录",2000);
								decodedatas(null);
							}
						} else {
							layer.alert(data.Error);
						}
					}
				}
			});
		}
	} else {
		layer.alert('与服务器连接失败');
	}
}
//告警信息查询按钮  used by electricroommonitor
function querywarnlog(num) {
	var sel=document.getElementById("jcdd");
	if(sel.options.length<=0){
		layer.alert("请选择要查询的测量点名称");
		return;
	}
	sessionStorage.SensorId = sel.value;//document.getElementById("jcdd")
	sessionStorage.SensorName = sel.options[document.getElementById("jcdd").selectedIndex].text;
	
	var kssj = document.getElementById("kssj_warning").value;
	if ((kssj == null) || (kssj == "") || (typeof(kssj) == "undefined")) {
		layer.alert("请指定开始时间");
		return;
	}
	sessionStorage.kssj = kssj;
	var jssj = document.getElementById("jssj_warning").value;
	if ((jssj == null) || (jssj == "") || (typeof(jssj) == "undefined")) {
		layer.alert("请指定截至时间");
		return;
	}
	sessionStorage.jssj = jssj;
	$("#warnlogdata-tbody tr").empty();
	if (num == 0) {
		gethistorydata(sessionStorage.SensorId,sessionStorage.kssj,sessionStorage.jssj);
	} else {
		gethistorydata(sessionStorage.SensorId,sessionStorage.kssj,sessionStorage.jssj);
	}
}
//获取告警信息列表  used by electricroommonitor
function GetWarnLog(mkssj, mjssj) {
	var count = 0;
	if (sessionStorage.islogin == "true") {
		ajaxLoadingShow();
		var url = jfjk_base_config.baseurl + "GetWarnLogsByStation?stationId=" + sessionStorage.stationID + "&from=" + mkssj + "&to=" + mjssj;
		url = encodeURI(url);
		$.ajax({
			beforeSend: function(request) {
				request.setRequestHeader("_token", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function(jqXHR, textStatus, errorThrown) {
				sessionStorage.errortime++;
				ajaxLoadingHidden();
				if (errorThrown == "Unauthorized") {
					Alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取告警信息操作失败', 2000);
				} else {
					Alert(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取告警信息操作失败', 2000);
				}
				if(sessionStorage.errortime>3){
					sessionStorage.islogin=false;
					sessionStorage.errortime=0;
				}
			},
			success: function(data, status) {
				//var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if (status == "success") {
					ajaxLoadingHidden();
					sessionStorage.errortime = 0;
					sessionStorage.islogin = true;
					if (data.Error == null) {
						if (jQuery.isEmptyObject(data.Result.Datas)) {
							layer.alert("没有符合条件的记录");
							return;
						}
						if (!jQuery.isEmptyObject(data.Result.Datas.Err)) {
							if (data.Result.Datas.hasOwnProperty("Err")) {
								for (var i = 0; i < data.Result.Datas.Err.length; i++) { //data.Result.length
									var tr = document.createElement('tr');
									if (i % 2 == 0) {
										tr.setAttribute('style', "background-color:#16b9c9");
									}
									var tdid = document.createElement('td');
									var tdname = document.createElement('td');
									var tdvalue = document.createElement('td');
									var tdtime = document.createElement('td');
									var tddiscr = document.createElement('td');
									tdid.innerHTML = data.Result.Datas.Err[i].SensorId;
									for (j = 0; j < data.Result.Sensors.Sensors.length; j++) {
										if (data.Result.Datas.Err[i].SensorId == data.Result.Sensors.Sensors[j].Id) {
											tdname.innerHTML = data.Result.Sensors.Sensors[j].Name;
											break;
										}
									}
									tdvalue.innerHTML = data.Result.Datas.Err[i].TmpValue; //jsonObject[i].name;
									tdtime.innerHTML = data.Result.Datas.Err[i].Time; //jsonObject[i].color;
									tddiscr.innerHTML = data.Result.Datas.Err[i].Value;
									tr.appendChild(tdid);
									tr.appendChild(tdname);
									tr.appendChild(tdtime);
									tr.appendChild(tdvalue);
									tr.appendChild(tddiscr);
									var tbody = document.getElementById("warnlogdata-tbody");
									tbody.appendChild(tr);
								}
								count = data.Result.Datas.Err.length;
								document.getElementById('count_val').innerHTML = count + "条";
							} else {
								layer.alert("没有符合条件的记录");
							}
						} else {
							layer.alert("没有符合条件的记录");
						}
					} else {
						layer.alert(data.Error);
					}
				}
			}
		});
	} else {
		layer.alert('与服务器连接失败');
	}
	document.getElementById('station_name').innerHTML = sessionStorage.stationName;

}
//获取单个标签的告警信息  used by electricroommonitor
//获取告警信息列表
function GetWarnLogBySensorId(mkssj, mjssj) {
	var count = 0;
	if (sessionStorage.islogin == "true") {
		//ajaxLoadingShow();
		//$('#indicatorContainer').radialIndicator();
		if ((typeof(sessionStorage.SensorId) == "undefined") || (sessionStorage.SensorId == null)) {
			var url = jfjk_base_config.baseurl + "GetWarnLogsByStation?stationId=" + sessionStorage.stationID + "&from=" + mkssj + "&to=" + mjssj;
		} else {
			var url = jfjk_base_config.baseurl + "GetWarnLogsBySensor?sensorId=" + sessionStorage.SensorId + "&from=" + mkssj + "&to=" + mjssj;
		}
		url = encodeURI(url);
		$.ajax({
			beforeSend: function(request) {
				request.setRequestHeader("_token", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function(jqXHR, textStatus, errorThrown) {
				sessionStorage.errortime++;
				ajaxLoadingHidden();
				if (errorThrown == "Unauthorized") {
					Alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取告警信息操作失败');
				} else {
					Alert(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取告警信息操作失败');
				}
				if(sessionStorage.errortime>3){
					sessionStorage.islogin=false;
					sessionStorage.errortime=0;
				}
			},
			success: function(data, status) {
				//var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if (status == "success") {
					ajaxLoadingHidden();
					sessionStorage.errortime = 0;
					sessionStorage.islogin = true;
					if (data.Error == null) {
						if (data.Result.Datas != null) {
							if (!jQuery.isEmptyObject(data.Result.Datas.Err)) {
								//if(data.Result.Datas.hasOwnProperty("Err")){
								for (var i = 0; i < data.Result.Datas.Err.length; i++) { //data.Result.length
									var tr = document.createElement('tr');
									if (i % 2 == 0) {
										tr.setAttribute('style', "background-color:#16b9c9");
									}
									var tdid = document.createElement('td');
									var tdname = document.createElement('td');
									var tdvalue = document.createElement('td');
									var tdtime = document.createElement('td');
									var tddiscr = document.createElement('td');
									tdid.innerHTML = data.Result.Datas.Err[i].SensorId;
									for (j = 0; j < data.Result.Sensors.Sensors.length; j++) {
										if (data.Result.Datas.Err[i].SensorId == data.Result.Sensors.Sensors[j].Id) {
											tdname.innerHTML = data.Result.Sensors.Sensors[j].Name;
											break;
										}
									}
									tdvalue.innerHTML = data.Result.Datas.Err[i].TmpValue; //jsonObject[i].name;
									tdtime.innerHTML = data.Result.Datas.Err[i].Time; //jsonObject[i].color;
									tddiscr.innerHTML = data.Result.Datas.Err[i].Value;
									tr.appendChild(tdid);
									tr.appendChild(tdname);
									tr.appendChild(tdtime);
									tr.appendChild(tdvalue);
									tr.appendChild(tddiscr);
									var tbody = document.getElementById("warnlogdata-tbody");
									tbody.appendChild(tr);
								}
								count = data.Result.Datas.Err.length;
								document.getElementById('count_val').innerHTML = count + "条";
							} else {
								window.layer.alert("没有符合条件的记录");
							}
						} else {
							window.layer.alert("没有符合条件的记录");
						}
					} else {
						layer.alert(data.Error);
					}
				}
			}
		});
	} else {
		layer.alert('与服务器连接失败');
	}
	document.getElementById('station_name').innerHTML = sessionStorage.stationName;
}

function querysmslog() {
	var kssj = document.getElementById("kssj_sms").value;
	if ((kssj == null) || (kssj == "") || (typeof(kssj) == "undefined")) {
		layer.alert("请指定开始时间");
		return;
	}
	var jssj = document.getElementById("jssj_sms").value;
	if ((jssj == null) || (jssj == "") || (typeof(jssj) == "undefined")) {
		layer.alert("请指定截至时间");
		return;
	}
	sessionStorage.kssj = kssj;
	sessionStorage.jssj = jssj;
	$("#smslog-tbody tr").empty();
	GetSmsLog(kssj, jssj);
}
//获取短信日志列表
function GetSmsLog(mkssj, mjssj) {
	var count = 0;
	if (sessionStorage.islogin == "true") {
		var url = jfjk_base_config.baseurl + "GetSmsLogsByStation?stationId=" + sessionStorage.stationID + "&from=" + mkssj + "&to=" + mjssj;
		url = encodeURI(url);
		$.ajax({
			beforeSend: function(request) {
				request.setRequestHeader("_token", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function(jqXHR, textStatus, errorThrown) {
				sessionStorage.errortime++;
				if (errorThrown == "Unauthorized") {
					Alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取日志操作失败', 2000);
				} else {
					Alert(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取日志操作失败', 2000);
				}
			},
			success: function(data, status) {
				//var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if (status == "success") {
					sessionStorage.islogin = true;
					if (data.Error == null) {
						sessionStorage.errortime = 0;
						if (!jQuery.isEmptyObject(data.Result.SmsLogs)) {
							if ((data.Result.hasOwnProperty("SmsLogs")) && (!jQuery.isEmptyObject(data.Result.SmsLogs))) {
								for (var i = 0; i < data.Result.SmsLogs.length; i++) { //data.Result.length
									var tr = document.createElement('tr');
									if (i % 2 == 0) {
										tr.setAttribute('style', "background-color:#16b9c9");
									}
									var tdid = document.createElement('td');
									var tdname = document.createElement('td');
									var tdphonenumber = document.createElement('td');
									var tdvalue = document.createElement('td');
									var tdtime = document.createElement('td');
									var tddiscr = document.createElement('td');
									tdid.innerHTML = data.Result.SmsLogs[i].Id;
									tdname.innerHTML = data.Result.SmsLogs[i].Person;
									tdphonenumber = data.Result.SmsLogs[i].Telephone;
									tdvalue.innerHTML = data.Result.SmsLogs[i].Message; //jsonObject[i].name;
									tdtime.innerHTML = data.Result.SmsLogs[i].Time; //jsonObject[i].color;
									tddiscr.innerHTML = data.Result.SmsLogs[i].Result;
									tr.appendChild(tdid);
									tr.appendChild(tdname);
									tr.appendChild(tdphonenumber);
									tr.appendChild(tdtime);
									tr.appendChild(tdvalue);
									tr.appendChild(tddiscr);
									var tbody = document.getElementById("smslog-tbody");
									tbody.appendChild(tr);
								}
								count = data.Result.SmsLogs.length;
								document.getElementById('count_val').innerHTML = count + "条";
							}
						} else {
							layer.alert("没有符合条件的记录");
						}

					} else {
						layer.alert(data.Error);
					}
				}
			}
		});
	} else {
		layer.alert('与服务器连接失败');
	}
	document.getElementById('station_name').innerHTML = sessionStorage.stationName;
}
//var datas=[];
//获取图表数据；
function getchartvalue(msensorid, kssj, jssj) {
	if (typeof(sessionStorage.SensorId) != "undefined") {
		//var url=jfjk_base_config.baseurl+"GetHistoriesBySensor?sensorId="+msensorid+"&from="+kssj+"&to="+jssj;
		var url = jfjk_base_config.baseurl + "GetHistoriesBySensor?sensorId=186&from=2012-09-03&to=2012-09-05";
		url = encodeURI(url);
		$.ajax({
			beforeSend: function(request) {
				request.setRequestHeader("_token", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function() {
				sessionStorage.errortime++;
				layer.alert('趋势图数据操作失败');
			},
			success: function(data, status) {
				var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if (status == "success") {
					sessionStorage.errortime = 0;
					sessionStorage.islogin = true;
					if (data.Error == null) {
						if (data.Result.Datas.hasOwnProperty("Tmp")) {
							for (var i = 0; i < data.Result.Datas.Tmp.length; i++) {
								if (data.Result.Datas.hasOwnProperty("Tmp")) pa.push(data.Result.Datas.Tmp[i].Value);
							}

						} else {
							layer.alert("没有符合条件的记录");
						}
					} else {
						layer.alert(data.Error);
					}
				}
			}
		});
	}
}
////  used by electricroommonitor 
function querychartvalue() {
	var kssj = document.getElementById("kssj_chart").value;
	if ((kssj == null) || (kssj == "") || (typeof(kssj) == "undefined")) {
		layer.alert("请指定开始时间");
		return;
	}
	var jssj = document.getElementById("jssj_chart").value;
	if ((jssj == null) || (jssj == "") || (typeof(jssj) == "undefined")) {
		layer.alert("请指定截至时间");
		return;
	}
	sessionStorage.kssj = kssj;
	sessionStorage.jssj = jssj;
	var first = document.getElementById("jcdd");
	if(first.options.length<=0){
		layer.alert("请选择要查询的测量点名称");
		return;
	}
	sessionStorage.SensorId=first.value;
	sessionStorage.SensorName = document.getElementById("jcdd").options[document.getElementById("jcdd").selectedIndex].text;
	var myChart = echarts.init(document.getElementById('main'));
	myChart.clear();
	//myChart.showLoading();
	gethistorydata(sessionStorage.SensorId,kssj,jssj);
	//drawchart();
	document.getElementById("timedefine").style.display="none";
}

//绘图变化趋势图   used by electricroommonitor 
function decodedatas(obj_chartdatas) {
	//var iserror = false,
	//err_info = "获取";
	//var isnull = false,
	var jiange="";
	//var stime=new Date(kssj).getTime();
	//var etime=new Date(jssj).getTime();
	//var senconds=etime-stime;
	var pa = [],pb = [],pc = [];
	var maxvalue=0,minvalue=0,maxval=0,minval=0;//avgvalue=0,ps=0,count=1,
	var lengenddata = [];
	var obj_chartdata=[];
	var seriess=[];

	var myChart = echarts.init(document.getElementById('main'));
	myChart.clear();
	if(obj_chartdatas.length<=0){
		return;
	}
	$("#comprate-tbody tr").empty();
	var tbody=document.getElementById("comprate-tbody");
	if(check_val.length>0){
		for(var i=0;i<check_val.length;i++){
			var sensorid=check_val[i];
			var series=new Object();
			series.name=check_name[i]
			lengenddata.push(check_name[i]);
			obj_chartdata=obj_chartdatas[sensorid];
			if(obj_chartdata){
				pb= new Array();
				maxvalue=minvalue=parseFloat(obj_chartdata[0].Value);
				for (var j = 0; j <obj_chartdata.length; j++) {
					pb.push([strtodatetime(obj_chartdata[j].Time), obj_chartdata[j].Value, j]);
					if(parseFloat(obj_chartdata[j].Value)>maxvalue){
						maxvalue=parseFloat(obj_chartdata[j].Value);
					}
					if(parseFloat(obj_chartdata[j].Value)<minvalue){
						minvalue=parseFloat(obj_chartdata[j].Value);
					}
					var tr=document.createElement("tr")
					var td_name=document.createElement("td");
					td_name.innerHTML=check_name[i];
					var td_time=document.createElement("td");
					td_time.innerHTML=obj_chartdata[j].Time;
					var td_value=document.createElement("td");
					td_value.innerHTML=obj_chartdata[j].Value;//.toFixed(2);
					var td_bz=document.createElement("td");
					tr.appendChild(td_name);
					tr.appendChild(td_time);
					tr.appendChild(td_value);
					tr.appendChild(td_bz);
					tbody.appendChild(tr);
				}
				if(i==0){
					maxval=maxvalue;
					minval=minvalue;
				}else{
					maxval=maxval>maxvalue?maxval:maxvalue;
					minval=minval<minvalue?minval:minvalue;
				}
			}
			series.type='line',
			series.showAllSymbol=true,
			series.symbolSize= 1,
			series.data= pb
			seriess.push(series);
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
	maxval=(maxval*1+(maxval-minval)*0.2).toFixed(Number_of_decimal);
	minval=(minval*1-(maxval-minval)*0.2).toFixed(Number_of_decimal);
	drawchart();
	//绘制图形线条
	function drawchart() {
		//var myChart = echarts.init(document.getElementById('main'));
		var option = {
			color: ['#ff8c00', '#FF0000','#00ff00',"#9400D3","#00BFFF","#4B0082","#20B2AA","#0000CD"," #FF4500 "],//
			backgroundColor: '#d0d0d0',

			title : {
						text : ' 变化趋势比对  ',
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
				show: true,
				start: 0
			},

			legend: {
				data: lengenddata,
				orient:"horizontal",//"vertical",忍得住孤独，耐得住寂寞，挺得住痛苦，顶得住压力，挡得住诱惑，经得起折腾，受得起打击，丢得起面子，担得起责任，提得起精神。
				x:'left',//多琢磨事少琢磨人，多向前看少往后看，多当面说少背后议，多换位思考少本位主义，多补台少拆台，多理解少指责，多揽过少争功。
        		y:'45',//多看多听多想多学习多行动 主动反馈、主动建议、主动协作、主动分项
				//color: 'white',//不抱怨父母无能，不抱怨父母啰嗦，不抱怨父母抱怨，不抱怨父母迟缓，不抱怨父母生病。
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
						width: 2
					},
					onZero:false
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
	}
}

function strtodatetime(str) {
	var year = str.substring(0, 4);
	var month = str.substring(5, 7);
	var day = str.substring(8, 10);
	var hour = str.substring(11, 13);
	var minute = str.substring(14, 16);
	var sencond = str.substr(17);
	return new Date(year, month - 1, day, hour, minute, sencond);
}
//初始化绘图页面
function initdrawing() {
	sessionStorage.pageindex = 1;
	//var slistname = $("#head_list_name").text();
	//if (slistname != "请选择图形:") {
	//	initlist();
	//}
	document.getElementById("iframe_main").src = 'drawmap.html';
	//$('#graphicslist tr:eq(1)').attr("checked", true);
}
//获取图形信息列表
function getgraphics() {
	var pt = 0;
	$("#graphicslist tr").empty();
	var url = jfjk_base_config.baseurl + "GetGraphics";
	url = encodeURI(url);
	if (sessionStorage.islogin == "true") {
		$.ajax({
			beforeSend: function(request) {
				request.setRequestHeader("_token", sessionStorage.token);
			},
			url: url,
			type: 'GET',
			dataType: 'json',
			timeout: 10000,
			error: function(jqXHR, textStatus, errorThrown) {
				sessionStorage.errortime++;
				if (errorThrown == "Unauthorized") {
					Alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取图形列表失败', 2000);
				} else {
					Alert(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取图形列表失败', 2000);
				}
			},
			success: function(data, status) {
				//var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
				if (status == "success") {
					sessionStorage.errortime = 0;
					sessionStorage.islogin = true;
					if (data.Error == null) {
						var tb = document.getElementById('stationstable');
						var rowNum = tb.rows.length;
						for (i = 0; i < rowNum; i++) {
							tb.deleteRow(i);
							rowNum = rowNum - 1;
							i = i - 1;
						}
						var tbody = document.getElementById('graphicslist');
						//var tree=document.getElementById('treeitem');
						if (data.Result.Graphics == null) {
							layer.alert("没有符合条件的记录");
							return;
						}
						for (var i = 0; i < data.Result.Graphics.length; i++) { //data.Result.length2 0 0 8 2 0 0 4 7 8 5 07
							var tr = document.createElement('tr');
							tr.setAttribute("onclick", "c1(this)");

							tr.setAttribute("style", "margin-top:5px");
							tr.setAttribute("style", "margin-left:30px ");
							var tdid = document.createElement('td');
							tdid.setAttribute("style", "width:50xp");
							tdid.setAttribute("style", "display:none");
							var tdename = document.createElement('td');
							var a = document.createElement('a');
							a.setAttribute('href', 'javascript:void(0)');
							a.setAttribute('style', 'color:#000');
							a.setAttribute('style', 'text-decoration: none');
							a.innerHTML = data.Result.Graphics[i].Name;
							tdename.setAttribute("style", "width:150px");
							tdid.innerHTML = data.Result.Graphics[i].Id;
							tdename.appendChild(a); //innerHTML=data.Result.Graphics[i].Name;//jsonObject[i].name;
							tr.appendChild(tdid);
							tr.appendChild(tdename);
							tbody.appendChild(tr);
							if (data.Result.Graphics[i].Id == sessionStorage.graphicID) {
								pt = i;
								first = -1;
							}
							/*
								var li=document.createElement('li');
								var a=document.createElement('a');
								a.setAttribute('onclick','domenu('+data.Result.Graphics[i].Id+')');
								a.innerHTML=data.Result.Graphics[i].Name;
								li.appendChild(a);
								tree.appendChild(li);*/
						}
						var trs = tbody.getElementsByTagName("tr");
						trs[pt].onclick();

						document.getElementById("iframe_main").src = 'drawmap.html'
					} else {
						layer.alert(data.Error);
					}
				}
			}
		});
	} else {
		layer.alert('与服务器连接失败');
	}
}
//获取指定编号的图形属性信息，从而来绘制图形。
function GetBinary(binariesid) {
	sessionStorage.pageindex = 1;
	if (typeof(binariesid) != "undefined") {
		var url = jfjk_base_config.baseurl + "GetBinary?id=" + binariesid;
		url = encodeURI(url);
		if (sessionStorage.islogin == 'true') {
			$.ajax({
				beforeSend: function(request) {
					request.setRequestHeader("_token", sessionStorage.token);
				},
				url: url,
				type: 'GET',
				dataType: 'json',
				timeout: 10000,
				error: function(jqXHR, textStatus, errorThrown) {
					sessionStorage.errortime++;
					if (errorThrown == "Unauthorized") {
						Alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取指定编号的图形操作失败');
					} else {
						Alert(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取指定编号的图形操作失败');
					}
				},
				success: function(data, status) {
					var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
					if (status == "success") {
						sessionStorage.errortime = 0;
						sessionStorage.islogin = true;
						if (data.Error == null) {
							if(jQuery.isEmptyObject(data.Result)){
							//if (data.Result.Value == null) {
								layer.alert("没有符合条件的记录");
								sessionStorage.contents = null;
								try {
									drawmap(JSON.parse(sessionStorage.contents));
								} catch(err) {

								}
								return;
							}
							//var allsensors=JSON.parse(localStorage.getItem("allsensors"));
							var obj_data=new Object();
							var contents = ($.base64.atob(data.Result.Value,true)).split("\r\n");
							//if(jQuery.hasOwnProperty(localStorage.realdata))
							var obj_rd=JSON.parse(localStorage.getItem("realdata"));
							var obj=[];
							if(obj_rd){
								contents.forEach(function(g){
									if ($.trim(g).length > 0) {
										g = JSON.parse(g);
										if (g && g._shape && g._shape.Binding && g._shape.Text) {
											if(window.parent.allsensors[g._shape.Binding]){
												var sid=window.parent.allsensors[g._shape.Binding].id;
												if (obj_rd.hasOwnProperty(sid)) {
			
													obj_data = (obj_rd)[sid];////
													g._shape.Text =(obj_data[0].Value*1).toFixed(Number_of_decimal);// + " " + sensors[g._shape.Binding].Value.Unit ;
													if(obj_data[0].Message){
														g._shape.IsError=true;
													}else{
														g._shape.isError=false;
													}
												}
										}
									}
										obj.push(JSON.stringify(g));
									}
								});
							}
							sessionStorage.contents = JSON.stringify(obj);
							try {
								drawmap(JSON.parse(sessionStorage.contents));
							} catch(err) {

							}
							sessionStorage.dataId = 0;
							getrealdatabynodeid(0);
						} else {
							layer.alert(data.Error);
						}
					}
				}
			});
		} else {
			layer.alert('与服务器连接失败');
		}
		//document.getElementById('head_map').innerHTML = "<pre><h2>" + sessionStorage.graphicName + " 状态图</h2></pre>";
	}
}
//绘图函数 in used by electricroommonitoring
function drawmap(arr) {
	var mCanvasDiv=document.getElementById("mycanvasdiv");
	var mCanvas = document.getElementById("mycanvas");
	var mheadmap=document.getElementById("head_map")
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
	var swidth = cwidth= document.documentElement.clientWidth ;
	var sheight = cheight=document.documentElement.clientHeight-mheadmap.clientHeight;;
	
	mCanvasDiv.style.width= cwidth  + 'px';
	mCanvasDiv.style.height= cheight + 'px';
	var background_color="#cccccc";
	mCanvasDiv.style.backgroundColor = mCanvas.style.backgroundColor =background_color;
	if(arr==null){
		var ctx = mCanvas.getContext("2d");
		ctx.save();
		ctx.clearRect(0, 0, mCanvas.width, mCanvas.height);
		return;
	}
	for (var i = 0; i < arr.length; i++) {
		if (!arr[i]) {
			continue;
		}
		try {
			var strs = JSON.parse(arr[i]);
		} catch(err) {
			return;
		}
		if ((strs.hasOwnProperty("_type")) && (strs._type == "Selection")) {
			if (strs.hasOwnProperty("_shape")) {
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
				break;
			}

		} /*else {
			mCanvas.width = document.documentElement.clientWidth - 17;
			mCanvas.height = document.documentElement.clientHeight;
		}*/
	}
	mCanvas.width = swidth;
	mCanvas.height = sheight;
	//长宽比例对比
	if(sessionStorage.map_module==0)
	{
		if(swidth > 0 && sheight > 0)
		{
			var tx = cwidth / swidth;
			var ty = cheight / sheight;
			var t = tx > ty ? ty : tx;
			cwidth = swidth * t;
			cheight = sheight * t;
		}
	}
	else
	{//原尺寸时width与style.width设置相同。
		cwidth = swidth;
		cheight = sheight;
	}
	mCanvas.style.width= cwidth  + 'px';
	mCanvas.style.height= cheight-15 + 'px';
	var ctx = mCanvas.getContext("2d");
	ctx.save();
	ctx.clearRect(0, 0, mCanvas.width, mCanvas.height);
	var pfdp = new Object();
	for (var i = 0; i < arr.length; i++) {
		if (!arr[i]) {
			continue;
		}
		var strs = JSON.parse(arr[i]);
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
		ctx.setTransform(1, 0, 0, 1, 0, 0); //还原矩阵，没有此句，图形将在上一次变化的基础上进行变化。
		ctx.setLineDash([]);
		eval(pfdp.type)(ctx, pfdp);//类反射，pfdp.type对应各类图形名称去调用相应的绘图函数。移动至drawmap.js里。

		for (var key in pfdp) {
			delete pfdp[key];
		}
	}
	ctx.restore();
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
		tableToExcel(tableid)
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
				
				})
			}
			//setInterval("toggleSound()",1);
			//audio.play();
		},

		failure: function(result) {
			layer.alert(result);
		}
	});*/
	var url=jfjk_base_config.speechurl+"GetWav?text="+encodeURIComponent(strText);
	var audio=$("#spkAudio")[0];
	if (audio == null) {
		audio = $("#spkAudio", window.parent.document);
	}
	audio.src=url;
	//audio.load()
	/*let playPromise = audio.play()
	if (playPromise !== undefined) {
		playPromise.then(() => {
			audio.play()
		}).catch(()=> {
		
		})
	}
	audio.autoplay=true;
	audio.play();*/
}

//如果是重新连接服务器或重新登录后，刷新当前页面
function refreshpages() {
	switch (sessionStorage.pageindex) {
	case "1":
		if (document.getElementById('graphicslist').getElementsByTagName("tr").length <= 0) {
			getgraphics();
		}
		GetGraphic();
		break;
	case "2":
		if (document.getElementById('stationslist').getElementsByTagName("tr").length <= 0) {
			GetStations();
		}
		//getrealdatabystation()
		loadstations_realdata();
		break;
	case "3":
		if (document.getElementById('stationslist').getElementsByTagName("tr").length <= 0) {
			GetStations();
		}
		gethistorydata();
		break;
	case "4":
		if (document.getElementById('stationslist').getElementsByTagName("tr").length <= 0) {
			GetStations();
		}
		querychartvalue();
		break;
	case "5":
		if (document.getElementById('stationslist').getElementsByTagName("tr").length <= 0) {
			GetStations();
		}
		break;
	case "6":
		if (document.getElementById('stationslist').getElementsByTagName("tr").length <= 0) {
			GetStations();
		}
		break;
	}
}
var ij =0;
function sortt(className) {
	/*var listName=new Array();
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
*/
	if (ij % 2 == 0) {
		$(className).text('▲');
		ij++;
	} else {
		$(className).text('▼');
		ij++;
	}
	setTimeout("moduletable('realdata-tbody')", 200)
}
function sortarray(arrs){
	var arr=[];
	arr=arrs;
	var compare = function (obj1, obj2) {
		var val1 = obj1.Value.Name;
		var val2 = obj2.Value.Name;
		if (val1 < val2) {
			return -1;
		} else if (val1 > val2) {
			return 1;
		} else {
			return 0;
		}            
	} 
	arr.sort(compare);
}
function moduletable(atableid) {  //used by electricroommonitor 
	var tbody = document.getElementById(atableid);
	if (tbody == null) {
		tbody = iframe_main.document.getElementById(atableid);
	}
	var trs = tbody.getElementsByTagName("tr");
	for (var i = 0; i < trs.length; i++) {
		if (i % 2 == 0) {
			//trs[i].style.backgroundColor = "#16b9c9";
			//trs[i].cells[1].style.backgroundColor = "#16b9c9";
			//trs[i].cells[2].style.backgroundColor = "#16b9c9";
			var cl1=trs[i].style.backgroundColor;
			if (cl1 != "rgb(255, 255, 0)") {
				trs[i].style.backgroundColor = "#16b9c9";
			}
			if (atableid == "realwarning-tbody") {
				trs[i].cells[4].style.backgroundColor = "#16b9c9";
			}		} else {
			//trs[i].style.backgroundColor = "#FFFFFF";
			//trs[i].cells[1].style.backgroundColor = "#FFFFFF";
			//trs[i].cells[2].style.backgroundColor = "#FFFFFF";
			var cl=trs[i].style.backgroundColor;
			if (cl!= "rgb(255, 255, 0)") {
				trs[i].style.backgroundColor = "#FFFFFF";
			}
			if (atableid == "realwarning-tbody") {
				trs[i].cells[4].style.backgroundColor = "#FFFFFF";
			}
		}
	}
}
//进度条
/*
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
//中文字符串：
function toUtf8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for (var i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}
//生成二维码  used by electricroommonitor 
function madecode(str) {
	var strurl = toUtf8(jfjk_base_config.serverurl); 
	$('#code').qrcode(strurl);
	$('#code1').qrcode(str);
}
//初始化客户端下载页面，根据字符串生成二维码   used by electricroommonitor 
function initmakecode() {
	var str = toUtf8(this.location.href.substr(0, this.location.href.lastIndexOf('/')) + jfjk_base_config.app_path_name); // "/res/SubstationTemperature.apk");
	//$("#a_code")[0].href = jfjk_base_config.strurl;
	$("#a_code")[0].innerHTML = jfjk_base_config.serverurl;
	$("#a_code1")[0].href = str;
	madecode(str);
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
function initcontactus() {  //used by electricroommonitor 
	document.getElementById('p1').innerHTML = jfjk_base_config.part1;
	document.getElementById('p2').innerHTML = jfjk_base_config.part2;
	document.getElementById('p3').innerHTML = jfjk_base_config.part3;
	document.getElementById('p4').innerHTML = jfjk_base_config.part4;
	document.getElementById('add').innerHTML = jfjk_base_config.company_address;
	document.getElementById('postcode').innerHTML = jfjk_base_config.post_code;
	document.getElementById('email1').innerHTML = jfjk_base_config.email1;
	document.getElementById('email2').innerHTML = jfjk_base_config.email2;
}
function initsysteminfo(){
	document.getElementById('p1').innerHTML = jfjk_base_config.app_name;
	document.getElementById('p2').innerHTML = jfjk_base_config.ver_id
	document.getElementById('p3').innerHTML = jfjk_base_config.date;
	document.getElementById("p4").innerHTML = jfjk_base_config.copyright;
	//document.getElementById('add').innerHTML = jfjk_base_config.company;
}
//获取实时数据  used by electricroommonitor
function getrealdatabynodeid(nodeid){
	sessionStorage.jssj=getCurrentDate(2);
	if (typeof(nodeid)!="undefined"&&nodeid!==null) {
		var url = jfjk_base_config.baseurl + "GetRealsNew?dataId=" + nodeid;
		url = encodeURI(url);
		{//while(sessionStorage.errortime<1)
		if (sessionStorage.islogin == "true") {
			$.ajax({
				beforeSend: function(request) {
					request.setRequestHeader("_token", sessionStorage.token);
				},
				url: url,
				type: 'GET',
				dataType: 'json',
				timeout: 10000,
				error: function(jqXHR, textStatus, errorThrown) {
					sessionStorage.errortime++;
					if (errorThrown == "Unauthorized") {
						value0=0;value1=0;sname="";
						refreshData();
						layer.alert(textStatus + ' :code' + jqXHR.status + '  未授权或授权已过期； 获取站实时数据操作失败');
						//sessionStorage.islogin = "false"
					} else {
						layer.alert(textStatus + ' :code' + jqXHR.status + '  ' + jqXHR.responseText + ' 获取站实时数据操作失败');
					}
					if(sessionStorage.errortime<3){
						//continue;
						//getrealdatabynodeid(nodeid)
					}else{
						sessionStorage.islogin=false;
						//sessionStorage.errortime=0;
						//getrealdatabynodeid(nodeid)
					}
				},
				success: function(data, status) {
					//var reg = new RegExp("(^|&)value1=([^&]*)(&|$)");
					if (status == "success") {
						sessionStorage.errortime = 0;
						sessionStorage.islogin = true;
						value0=0;value1=0;sname="";
						if (data.Error == null) {
							if (jQuery.isEmptyObject(data.Result.Datas)) {
								//if (id == 0) {
									//layer.alert("没有符合条件的记录",2000);
									layer.alert("没有符合条件的记录");
								//}
								localStorage.setItem("realdata",null);
								refreshData();
								return;
							}
							var obj_realdata=data.Result.Datas;
							localStorage.setItem("realdata",JSON.stringify(obj_realdata));
							decoderealdata(obj_realdata);
						} else {
							layer.alert(data.Error, 2000);
						}
					}
					//break;
				}
			});
		} else {
			layer.alert("与服务器连接失败");
			//sessionStorage.errortime=0;
			//break;
			//window.location.href="index.html";
		}
		//sleep(10000);
	 }
		//document.getElementById('station_name').innerHTML = sessionStorage.stationName;
	}
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
function getname(key){
	if(key)
		key=key.toLowerCase();
	if(key==null||key==''||key.trim()==''){//空、空字符、空格都按空对待，提示未分组。
		key="未分组";
	}else if(key=="temp"||key=="tmp"){
		key="温度";
	}else if(key=="pd"){
		key="局放";
	}else if(key=="yx"||key=="yaoxin"){
		key="遥信";
	}else if(key=="cwcj"){
		key="测温采集器";
	}else if(key=="shipinjiankong"||key=="视频监控"){
		key="视频监控";
	}
	return key;
}
function seletime(obj){
	var sel=document.getElementById("jcdd");
	if(sel.options.length<=0){
		layer.alert("请选择要查询的测量点名称",2000);
		return;
	}
	var oneday=1000*60*60*24;
	var today = new Date();
	var ckssj,cjssj,ttime;
	var timedefine=document.getElementById("timedefine");
	document.getElementById("count_val").innerHTML="";
	sessionStorage.timeindex=$('input[name="timeselect"]:checked').val();//obj.value*1;
	switch(obj.value*1){
		case 0:
			sessionStorage.kssj = getCurrentDate(1) + " 00:00:00"; //"2012-09-03T08:00:00";//;
			sessionStorage.jssj = getCurrentDate(2) ;
			gethistorydata(sessionStorage.SensorId,sessionStorage.kssj,sessionStorage.jssj);
			timedefine.style.display="none";
			//layer.alert("没有符合条件的记录",3000);
			break;
		case 1:
			timedefine.style.display="none";
			ckssj=new Date((getCurrentDate(1)+" 00:00:00").replace(/-/g,"/"));
			var yesterdaystar=ckssj-oneday;
			sessionStorage.kssj=dateToString(new Date(yesterdaystar),2);
			cjssj=new Date((getCurrentDate(1)+" 23:59:59").replace(/-/g,"/"));
			var yesterdayend=cjssj-oneday;
			sessionStorage.jssj=dateToString(new Date(yesterdayend),2);
			//$("#warnlogdata-tbody tr").empty();
			gethistorydata(sessionStorage.SensorId,sessionStorage.kssj,sessionStorage.jssj);
			//layer.alert("没有符合条件的记录",3000);
			break;
		case 2:
			timedefine.style.display="none";
			ckssj=new Date((getCurrentDate(1)+" 00:00:00").replace(/-/g,"/"));
			sessionStorage.kssj=dateToString(new Date(ckssj.setDate(1)),2);
			sessionStorage.jssj=getCurrentDate(2);
			gethistorydata(sessionStorage.SensorId,sessionStorage.kssj,sessionStorage.jssj);
			break;
		case 3:
			timedefine.style.display="none";	
			ckssj=new Date((getCurrentDate(1)+" 00:00:00").replace(/-/g,"/"));
			var lastMonthFirst = new Date(ckssj - oneday * ckssj.getDate());
			sessionStorage.kssj = dateToString(new Date(lastMonthFirst - oneday * (lastMonthFirst.getDate() - 1)),2);
			cjssj=new Date((getCurrentDate(1)+" 23:59:59").replace(/-/g,"/"));
			sessionStorage.jssj = dateToString(new Date(cjssj - oneday * cjssj.getDate()),2);
			//$("#warnlogdata-tbody tr").empty();
			//layer.alert("没有符合条件的记录",3000);
			gethistorydata(sessionStorage.SensorId,sessionStorage.kssj,sessionStorage.jssj);
		break;
		case  4:
			var timedefine=document.getElementById("timedefine");
			if(timedefine.style.display=="none"){
				timedefine.style.display="inline";
			}
			break;
		case 5:
			showrealworning();
			break;
	}
}

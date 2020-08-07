//初始化插件
// 全局保存当前选中窗口
var g_iWndIndex = 0; 
$(function(){
	updatapcnav(4);
	sessionStorage.framepage="preview.html";
	// 检查插件是否安装
    if(WebVideoCtrl.I_CheckPluginInstall()==-1){
        layer.alert("您还未安装过插件，请先安装视频插件webvideoctrl");
        return;
    }
    //初始化插件
    WebVideoCtrl.I_InitPlugin(800,550,{
        iWndowType: 2,
        cbSelWnd : function(xmldoc){
            g_iWndIndex=$(xmldoc).find("SelectWnd").eq(0).text();
            var selindex="您当前选择的窗口编号："+g_iWndIndex;
            showselindex(selindex);
        },
    });
    WebVideoCtrl.I_InsertOBJECTPlugin("divplugin");
    // 窗口事件绑定
	$(window).bind({
		resize: function () {
			var $Restart = $("#restartDiv");
			if ($Restart.length > 0) {
				var oSize = getWindowSize();
				$Restart.css({
					width: oSize.width + "px",
					height: oSize.height + "px"
				});
			}
		}
	});
	
    //初始化日期时间
    var szCurTime = dateFormat(new Date(), "yyyy-MM-dd");
    $("#starttime").val(szCurTime + " 00:00:00");
    $("#endtime").val(szCurTime + " 23:59:59");
});
// 显示操作信息
function showOPInfo(szInfo) {
	szInfo = "<div>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
	$("#opinfo").html(szInfo + $("#opinfo").html());
}
// 显示回调信息
function showselindex(szInfo) {
	szInfo = "<div>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
	$("#cbinfo").html(szInfo + $("#cbinfo").html());
}
// 格式化时间
function dateFormat(oDate, fmt) {
	var o = {
		"M+": oDate.getMonth() + 1, //月份
		"d+": oDate.getDate(), //日
		"h+": oDate.getHours(), //小时
		"m+": oDate.getMinutes(), //分
		"s+": oDate.getSeconds(), //秒
		"q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
		"S": oDate.getMilliseconds()//毫秒
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}
function clickLogin() {
    var szIP = $("#loginip").val(),
    szPort = $("#port").val(),
    szUsername = $("#username").val(),
    szPassword = $("#password").val();
    if((""==szIP)||(""==szPort)){return;}
    var iRet=WebVideoCtrl.I_Login(szIP,1,szPort,szUsername,szPassword,{
        success : function(xmldoc){
            showOPInfo(szIP+"登录成功");
            $("#ip").prepend("<option value='" + szIP + "'>" + szIP + "</option>");
			setTimeout(function () {
				$("#ip").val(szIP);
				getChannelInfo();
			}, 10);
        },
        error : function(xmldoc){
            showOPInfo(szIP + " 登录失败！");
        }
	});
	
}
// 退出
function clickLogout() {
	var szIP = $("#ip").val(),
		szInfo = "";
	if (szIP == "") {
		return;
	}
	var iRet = WebVideoCtrl.I_Logout(szIP);
	if (0 == iRet) {
		szInfo = "退出成功！";

		$("#ip option[value='" + szIP + "']").remove();
		getChannelInfo();
	} else {
		szInfo = "退出失败！";
	}
	showOPInfo(szIP + " " + szInfo);
}
// 获取通道
function getChannelInfo() {
	var szIP = $("#ip").val(),
        oSel = $("#channels").empty(),
        clist=$("#sz_list").empty(),
		nAnalogChannel = 0;
	if ("" == szIP) {
		return;
	}
	// 模拟通道
	WebVideoCtrl.I_GetAnalogChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			var oChannels = $(xmlDoc).find("VideoInputChannel");
			nAnalogChannel = oChannels.length;
			$.each(oChannels, function (i) {
				var id = parseInt($(this).find("id").eq(0).text(), 10),
					name = $(this).find("name").eq(0).text();
				if ("" == name) {
					name = "Camera " + (id < 9 ? "0" + id : id);
				}
                oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
			});
			showOPInfo(szIP + " 获取模拟通道成功！");
		},
		error: function () {
			showOPInfo(szIP + " 获取模拟通道失败！");
		}
	});
	// 数字通道
	WebVideoCtrl.I_GetDigitalChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
			$.each(oChannels, function (i) {
				var id = parseInt($(this).find("id").eq(0).text(), 10),
					name = $(this).find("name").eq(0).text(),
					online = $(this).find("online").eq(0).text();
				if ("false" == online) {// 过滤禁用的数字通道
					return true;
				}
				if ("" == name) {
					name = "IPCamera " + ((id - nAnalogChannel) < 9 ? "0" + (id - nAnalogChannel) : (id - nAnalogChannel));
				}
                oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
                var p = document.createElement("p");
                var lab=document.createElement("label");
                var input=document.createElement("input");
                input.setAttribute("type","radio");
                input.setAttribute("name","rdgroup")
                input.setAttribute("id",id);
                input.setAttribute("value",id);
                var spna=document.createElement("span");
                spna.innerHTML=name;
                lab.appendChild(input);
                lab.appendChild(spna);
                p.appendChild(lab);
                clist.append(p);
			});
			showOPInfo(szIP + " 获取数字通道成功！");
		},
		error: function () {
			showOPInfo(szIP + " 获取数字通道失败！");
		}
	});
	// 零通道
	WebVideoCtrl.I_GetZeroChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			var oChannels = $(xmlDoc).find("ZeroVideoChannel");			
			$.each(oChannels, function (i) {
				var id = parseInt($(this).find("id").eq(0).text(), 10),
					name = $(this).find("name").eq(0).text();
				if ("" == name) {
					name = "Zero Channel " + (id < 9 ? "0" + id : id);
				}
				if ("true" == $(this).find("enabled").eq(0).text()) {// 过滤禁用的零通道
					oSel.append("<option value='" + id + "' bZero='true'>" + name + "</option>");
				}
			});
			showOPInfo(szIP + " 获取零通道成功！");
		},
		error: function () {
			showOPInfo(szIP + " 获取零通道失败！");
		}
	});
}
// 开始预览
function clickStartRealPlay() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szIP = $("#ip").val(),
		iStreamType = parseInt($("#streamtype").val(), 10),
		iChannelID = parseInt($("#channels").val(), 10),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		szInfo = "";
	if ("" == szIP) {
		return;
	}
	if (oWndInfo != null) {// 已经在播放了，先停止
		WebVideoCtrl.I_Stop();
	}
	var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
		iStreamType: iStreamType,
		iChannelID: iChannelID,
		bZeroChannel: bZeroChannel
	});
	if (0 == iRet) {
		szInfo = "开始预览成功！";
	} else {
		szInfo = "开始预览失败！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// 停止预览
function clickStopRealPlay() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";
	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Stop();
		if (0 == iRet) {
			szInfo = "停止预览成功！";
		} else {
			szInfo = "停止预览失败！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}
// 窗口分割数
function changeWndNum(iType) {
	iType = parseInt(iType, 10);
	WebVideoCtrl.I_ChangeWndNum(iType);
}
// 搜索录像
var iSearchTimes = 0;
function clickRecordSearch(iType) {
	var szIP = $("#ip").val(),
		iChannelID = $("#channels").val(),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		szStartTime = $("#starttime").val(),
		szEndTime = $("#endtime").val();
	if ("" == szIP) {
		return;
	}
	if (bZeroChannel) {// 零通道不支持录像搜索
		return;
	}
	if (0 == iType) {// 首次搜索
		$("#searchlist").empty();
		iSearchTimes = 0;
	}
	WebVideoCtrl.I_RecordSearch(szIP, iChannelID, szStartTime, szEndTime, {
		iSearchPos: iSearchTimes * 40,
		success: function (xmlDoc) {
			if("MORE" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {				
				for(var i = 0, nLen = $(xmlDoc).find("searchMatchItem").length; i < nLen; i++) {
					var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
					if(szPlaybackURI.indexOf("name=") < 0) {
						break;
					}
					var szStartTime = $(xmlDoc).find("startTime").eq(i).text();
					var szEndTime = $(xmlDoc).find("endTime").eq(i).text();
					var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));
					var objTr = $("#searchlist").get(0).insertRow(-1);
					var objTd = objTr.insertCell(0);
					objTd.id = "downloadTd" + i;
					objTd.innerHTML = iSearchTimes * 40 + (i + 1);
					objTd = objTr.insertCell(1);
					objTd.width = "30%";
					objTd.innerHTML = szFileName;
					objTd = objTr.insertCell(2);
					objTd.width = "30%";
					objTd.innerHTML = (szStartTime.replace("T", " ")).replace("Z", "");
					objTd = objTr.insertCell(3);
					objTd.width = "30%";
					objTd.innerHTML = (szEndTime.replace("T", " ")).replace("Z", "");
					objTd = objTr.insertCell(4);
					objTd.width = "10%";
					objTd.innerHTML = "<a href='javascript:;' onclick='clickStartDownloadRecord(" + i + ");'>下载</a>";
					$("#downloadTd" + i).data("playbackURI", szPlaybackURI);
				}
				iSearchTimes++;
				clickRecordSearch(1);// 继续搜索
			} else if ("OK" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
				var iLength = $(xmlDoc).find("searchMatchItem").length;
				for(var i = 0; i < iLength; i++) {
					var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
					if(szPlaybackURI.indexOf("name=") < 0) {
						break;
					}
					var szStartTime = $(xmlDoc).find("startTime").eq(i).text();
					var szEndTime = $(xmlDoc).find("endTime").eq(i).text();
					var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));
					var objTr = $("#searchlist").get(0).insertRow(-1);
					var objTd = objTr.insertCell(0);
					objTd.id = "downloadTd" + i;
					objTd.innerHTML = iSearchTimes * 40 + (i + 1);
					objTd = objTr.insertCell(1);
					objTd.width = "30%";
					objTd.innerHTML = szFileName;
					objTd = objTr.insertCell(2);
					objTd.width = "30%";
					objTd.innerHTML = (szStartTime.replace("T", " ")).replace("Z", "");
					objTd = objTr.insertCell(3);
					objTd.width = "30%";
					objTd.innerHTML = (szEndTime.replace("T", " ")).replace("Z", "");
					objTd = objTr.insertCell(4);
					objTd.width = "10%";
					objTd.innerHTML = "<a href='javascript:;' onclick='clickStartDownloadRecord(" + i + ");'>下载</a>";
					$("#downloadTd" + i).data("playbackURI", szPlaybackURI);
				}
				showOPInfo(szIP + " 搜索录像文件成功！");
			} else if("NO MATCHES" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
				setTimeout(function() {
					showOPInfo(szIP + " 没有录像文件！");
				}, 50);
			}
		},
		error: function () {
			showOPInfo(szIP + " 搜索录像文件失败！");
		}
	});
}
// 开始回放
function clickStartPlayback() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szIP = $("#ip").val(),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		iChannelID = $("#channels").val(),
		szStartTime = $("#starttime").val(),
		szEndTime = $("#endtime").val(),
		szInfo = "",
		bChecked = $("#transstream").prop("checked"),
		iRet = -1;
	if ("" == szIP) {
		return;
	}
	if (bZeroChannel) {// 零通道不支持回放
		return;
	}
	if (oWndInfo != null) {// 已经在播放了，先停止
		WebVideoCtrl.I_Stop();
	}
	if (bChecked) {// 启用转码回放
		var oTransCodeParam = {
			TransFrameRate: "16",// 0：全帧率，5：1，6：2，7：4，8：6，9：8，10：10，11：12，12：16，14：15，15：18，13：20，16：22
			TransResolution: "2",// 255：Auto，3：4CIF，2：QCIF，1：CIF
			TransBitrate: "23"// 2：32K，3：48K，4：64K，5：80K，6：96K，7：128K，8：160K，9：192K，10：224K，11：256K，12：320K，13：384K，14：448K，15：512K，16：640K，17：768K，18：896K，19：1024K，20：1280K，21：1536K，22：1792K，23：2048K，24：3072K，25：4096K，26：8192K
		};
		iRet = WebVideoCtrl.I_StartPlayback(szIP, {
			iChannelID: iChannelID,
			szStartTime: szStartTime,
			szEndTime: szEndTime,
			oTransCodeParam: oTransCodeParam
		});
	} else {
		iRet = WebVideoCtrl.I_StartPlayback(szIP, {
			iChannelID: iChannelID,
			szStartTime: szStartTime,
			szEndTime: szEndTime
		});
	}
	if (0 == iRet) {
		szInfo = "开始回放成功！";
	} else {
		szInfo = "开始回放失败！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// 停止回放
function clickStopPlayback() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";
	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Stop();
		if (0 == iRet) {
			szInfo = "停止回放成功！";
		} else {
			szInfo = "停止回放失败！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 单帧
function clickFrame() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";
	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Frame();
		if (0 == iRet) {
			szInfo = "单帧播放成功！";
		} else {
			szInfo = "单帧播放失败！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 暂停
function clickPause() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";
	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Pause();
		if (0 == iRet) {
			szInfo = "暂停成功！";
		} else {
			szInfo = "暂停失败！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 恢复
function clickResume() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";
	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Resume();
		if (0 == iRet) {
			szInfo = "恢复成功！";
		} else {
			szInfo = "恢复失败！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 慢放，每点一次减慢一个等级，速度在1/8--8倍之间
function clickPlaySlow() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";
	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_PlaySlow();
		if (0 == iRet) {
			szInfo = "慢放成功！";
		} else {
			szInfo = "慢放失败！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 快放,每点一次加快一个等级，速度在1/8--8倍之间。
function clickPlayFast() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";
	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_PlayFast();
		if (0 == iRet) {
			szInfo = "快放成功！";
		} else {
			szInfo = "快放失败！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}
// 获取设备信息
function clickGetDeviceInfo() {
	var szIP = $("#ip").val();
	if ("" == szIP) {
		return;
	}
	WebVideoCtrl.I_GetDeviceInfo(szIP, {
		success: function (xmlDoc) {
			var arrStr = [];
			arrStr.push("设备名称：" + $(xmlDoc).find("deviceName").eq(0).text() + "\r\n");
			arrStr.push("设备ID：" + $(xmlDoc).find("deviceID").eq(0).text() + "\r\n");
			arrStr.push("型号：" + $(xmlDoc).find("model").eq(0).text() + "\r\n");
			arrStr.push("设备序列号：" + $(xmlDoc).find("serialNumber").eq(0).text() + "\r\n");
			arrStr.push("MAC地址：" + $(xmlDoc).find("macAddress").eq(0).text() + "\r\n");
			arrStr.push("主控版本：" + $(xmlDoc).find("firmwareVersion").eq(0).text() + " " + $(xmlDoc).find("firmwareReleasedDate").eq(0).text() + "\r\n");
			arrStr.push("编码版本：" + $(xmlDoc).find("encoderVersion").eq(0).text() + " " + $(xmlDoc).find("encoderReleasedDate").eq(0).text() + "\r\n");	
			showOPInfo(szIP + " 获取设备信息成功！");
			alert(arrStr.join(""));
		},
		error: function () {
			showOPInfo(szIP + " 获取设备信息失败！");
		}
	});
}
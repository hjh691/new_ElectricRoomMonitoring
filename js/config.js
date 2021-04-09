
//对web服务运行环境以及后台服务器地址、端口、变量等进行设置
var jfjk_base_config={};
// 1. 后台服务器地址：用引号括起来默认："http://localhost";"http://192.168.1.10";"http://www.bdjka.com"等。
//后台服务器地址列表：
var secc=-1;
var server_url_list=[
    "http://192.168.10.250:20000/",
    "http://192.168.10.67:20000/",
    "http://jka.f3322.net:20000/"
]
var list_pt=0;
if(localStorage.server_url!=null && localStorage.server_url!="undefined" && localStorage.server_url!=""){
    jfjk_base_config.baseurl=localStorage.server_url;
}else
{

//for(var i=0;i<server_url_list.length;i++){
    localStorage.server_url=jfjk_base_config.baseurl=server_url_list[list_pt];
    try{
        test_url(jfjk_base_config.baseurl);            
    }catch(err){
        showstateinfo(err.message);
    }
}
function test_url(url){
    url = encodeURI(url+"GetProfile");
    $.ajax({
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "sessionStorage.token");
        },
        url: url,
        type: 'GET',
        dataType: 'json',
        timeout: 5000,
        error: function (jqXHR, textStatus, errorThrown) {
            try{
                if (errorThrown == "Unauthorized") {
                    secc=0;
                }else{
                    
                    if (++(list_pt)<server_url_list.length){
                        //list_pt++;
                        localStorage.server_url=jfjk_base_config.baseurl=server_url_list[list_pt];
                        test_url(jfjk_base_config.baseurl);
                    }
                } 
            }catch(err){
                showstateinfo(err.message,"sendpostorder");
            }
        },
        success: function (data, status) {
            return secc=0;
        }
    });
    //
    return secc;
}
if(jfjk_base_config.baseurl.indexOf("localhost")>-1){
    jfjk_base_config.baseurl=jfjk_base_config.baseurl.replace("localhost",window.location.hostname);
    //jfjk_base_config.speechurl=jfjk_base_config.speechurl.replace("localhost",window.location.hostname);
}else if(jfjk_base_config.baseurl.indexOf("127.0.0.1")>-1){
    jfjk_base_config.baseurl=jfjk_base_config.baseurl.replace("127.0.0.1",window.location.hostname);
    //jfjk_base_config.speechurl=jfjk_base_config.speechurl.replace("127.0.0.1",window.location.hostname);
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
 //jfjk_base_config.baseurl=server_url_list[0];//调试时的局域网地址。
 //jfjk_base_config.baseurl="http://192.168.10.67:8020/";
 //jfjk_base_config.baseurl="http://localhost:20000/";//_api与服务器同机时实际运行时采用此地址，如果不是部署在同一台电脑中，则为服务器的实际地址,下同
 //jfjk_base_config.speechurl="http://192.168.10.250:20000/_speech/";//"http://192.168.10.67:88/_speech/";

 //服务器地址
//jfjk_base_config.serverurl="http://jka.f3322.net:20000/";
// 手机app存放目录和名称：要求在web的资源目录中，
 jfjk_base_config.app_path_name="/res/cloud.apk";
//sessionStorage.videourl='';
//界面用图片信息：
//登录页面图片：
// jfjk_base_config.login_src="res/login.png";
// 登录界面系统名称字体颜色：
jfjk_base_config.appname_font_color="#fff";
//登录界面底图
jfjk_base_config.bg_src="res/bj011.jpg"
//系统名称
 jfjk_base_config.app_name="智能变电站辅助系统综合监测云平台";
//版本号
 jfjk_base_config.ver_id="Ver 2.03.22";//1.3添加通用页面。
 //发布日期
 jfjk_base_config.date="2021-03-22"
//公司名称
 jfjk_base_config.company="保定金凯澳自动化设备有限公司";
 //版权时间
 jfjk_base_config.copyright="&copy 2022-12-31"
//公司log
 jfjk_base_config.log_src="res/jka_100.png";
//公司网站：
 jfjk_base_config.company_url="http://www.bdjka.com";
 //公司地址 格式：“地　　　址：保定市乐凯北大街3088号 电谷科技中心”
 jfjk_base_config.company_address="地　　　址：保定市乐凯北大街3088号 电谷科技中心";
 //邮政编码
 jfjk_base_config.post_code="邮　　　编：071051";
 //公司邮箱
 jfjk_base_config.email1="邮　　 箱1：bdjinkaiao@163.com";
 jfjk_base_config.email2="邮　　 箱2：bdjinkaiao@126.com";
 //联系方式
 jfjk_base_config.part1="办　公　室：0312-6783281";
 jfjk_base_config.part2="技术服务部：0312-6783283 安经理";
 jfjk_base_config.part3="生　产　部：0312-6783282 刘经理";
 jfjk_base_config.part4="市　场　部：13313227451 闫经理";
//各子系统的指定名称
 sysnames=['视频监控','测温','局部放电','局放','机房监控','辅助综合','开关柜','气象','微气象'];
//图形颜色
 colors=["#080","#d58930", "#28cfed", "#236be2", "#bd59d5", "#2fcea7", "#ee4a4b", "#0c9cef"];
 mcol=4;
 //保留小数位数
 Number_of_decimal=2;
 //树形目录等级数：
 Levels_of_treeview=3
 //告警统计标识
 warning_sign_low="越下限";
 warning_sign_hight="越上限";
 info_showtime=1500;
 jfjk_base_config.refreshtime=2;
 if(localStorage.refreshtime)
    jfjk_base_config.refreshtime=localStorage.refreshtime;
 color_table_cur="#adf7b8";//85e494
 color_table_even="#87CEFA";
////判断是否由设置的值，没有则取默认值，有则取配置值替代默认值；浏览器清除数据后配置值也被清除；
 if(localStorage.systemName)
    jfjk_base_config.app_name=localStorage.systemName;
if(localStorage.companyName)
    jfjk_base_config.company=localStorage.companyName;
if(localStorage.companyUrl)
    jfjk_base_config.company_url=localStorage.companyUrl;
if(localStorage.decimalNum)
    Number_of_decimal=localStorage.decimalNum*1;
if(localStorage.delayTime)
    info_showtime=localStorage.delayTime*1;
min_timeInterval=2;//单位分钟
max_timeInterval=3;
between_time=10;
speech_rate=1;
speech_pitch=1;
speed_scroll=3;
if(localStorage.speech_rate)
    speech_rate=localStorage.speech_rate;
if(localStorage.speech_pitch)
    speech_pitch=localStorage.speech_pitch;
if(localStorage.speed_scroll)
    speed_scroll=localStorage.speed_scroll;
if(localStorage.between_time)
    between_time=localStorage.between_time;
configOption={};
function initconfigOption(){
    configOption.optionname="";
    configOption.unit="";
    configOption.maxvalue=0;
    configOption.minvalue=0;
    configOption.childclassname="";
    configOption.folder="";
    configOption.type="";
    configOption.desc="";
}

//localStorage.showLeftMenu=false;//控制是否自动隐藏或显示左侧的节点树形菜单列表。
 /**un business
  * 1.2.2 节点树的节点字体颜色变化的问题，告警信息每次都显示的问题（同一节点有不同类型的数据和不一样的告警状态造成），节点目录自动折叠的问题；代码精简。
  * 
  * 
  * 
  * 
  * 
  */

//var sessionStorage.scaler=1;
var BinariesId=-1;
var mCanvas=document.getElementById("mycanvas");
var isDown = false;
var dx = 0, 
    dy = 0; // 鼠标按下位置的坐标
var offx = 0, offy = 0; //
var ctx = mCanvas.getContext("2d"); 
$(document).ready(function(){
    $.base64.utf8encode = true;
    if(!sessionStorage.map_module)
        sessionStorage.map_module=0;
    if(sessionStorage.map_module==1){
        mapmodule.innerText="自动缩放";
        if(!sessionStorage.scaler||sessionStorage.scaler=="undefined")
            sessionStorage.scaler = 1;
    }else{
        mapmodule.innerText="原尺寸显示";
        if(!sessionStorage.scaler ||sessionStorage.scaler=="undefined")
            sessionStorage.scaler = 0;
    }
    mCanvas.width=document.documentElement.clientWidth;
    mCanvas.height=document.documentElement.clientHeight-125;
    //GetGraphic();
    initpage();
    //refresh();
    if(typeof(Worker) !== "undefined") {//只在网络状态下可用，本地磁盘目录下不可用。
    if(typeof(w1) == "undefined") {
        w1 = new Worker("delay_worker.js");
    }
    var i=0;
    w1.onmessage = function(event) {
            //document.getElementById("result").innerHTML = event.data;
            //i++
            //if(i%10==0){
                refresh();
            //}
        };
    } else {
        var t1 = window.setInterval("refresh();",10000);
    }
    });
function initpage(){
    updatapcnav(2);
    sessionStorage.framepag="drawmap.html";
    window.parent.getrealdatabynodeid();
    $("#txlb").empty();
    var sel_sensor=document.getElementById("txlb");
    /*for (var i = 0; i < sel_sensor.options.length; i) {
        sel_sensor.removeChild(sel_sensor.options[0]);
        //sel_sensor.remove(0);
        //sel_sensor.options[0] = null;
    }*/
    if(sessionStorage.txid)
        BinariesId=sessionStorage.txid;
    binaries=JSON.parse(localStorage.getItem("binaries"));
    if(binaries!=null){
        for(var i=0;i<binaries.length;i++){
            var op=document.createElement("option");
            op.setAttribute("value",binaries[i].id);
            op.innerHTML=binaries[i].name;
            sel_sensor.appendChild(op);
        }
    }else{
        BinariesId=-1;
    }
    setSelectOption_txlb("txlb", BinariesId);
    if(binaries!=null&&BinariesId==-1){
        var opts=sel_sensor.getElementsByTagName("option");
        //opts[0].selected=true;
        BinariesId=opts[0].value;
        //GetBinary();
    }
    /*document.getElementById('txlb').addEventListener('change',function(){// zengqiangtizhi
        //var txlb= document.getElementById("txlb");
        sessionStorage.BinariesId=this.value;
        //alert("当前选项是:"+this.value);
        GetBinary();
        j++;
        },false);
        j=0;*/               //
    GetBinary(BinariesId);
    window.parent.closeloadlayer();
    //var isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    //if(isFullscreen)
        //sessionStorage.allscreen=false;
}
function setSelectOption_txlb(objid, sensor) {
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
        BinariesId=-1;
    }else if(i>=options.length){
        BinariesId=options[0].value;
        sessionStorage.txid=BinariesId;
    }
}
function refresh(){
    if(!checkFull())
    //if((!sessionStorage.allscreen) || ( sessionStorage.allscreen=="false")){
        $("#mapmodule1").text("全屏显示");
        //sessionStorage.allscreen=false;
    //}else{
    //    $("#mapmodule1").text("退出全屏");
//sessionStorage.allscreen=false;
    //}/**/
    var graphic = JSON.parse(sessionStorage.contents);
    if(graphic!=null){
    drawmap(graphic,ctx);
    }else{
        getbinary();
    }
}
function refreshbinary(){
    window.parent.GetBinariesByType("NodeGraphic",sessionStorage.nodeId);
}
function showmodule(){
    var mapmodule=document.getElementById("mapmodule");
    sessionStorage.scaler=1;
    if(mapmodule.innerText=="原尺寸显示"){
        sessionStorage.map_module=1;
        mapmodule.innerText="自动缩放";
    }else{
        sessionStorage.map_module=0;
        mapmodule.innerText="原尺寸显示";
        sessionStorage.scaler = 0.0;
    }
    refresh();
}
window.onresize=window.onscroll=refresh;
function decoderealdata(){
}
function getbinary(){
    var txlb= document.getElementById("txlb");
    BinariesId=txlb.value;
    sessionStorage.txid=BinariesId;//保存图形id
    if(sessionStorage.map_module==1){
        mapmodule.innerText="自动缩放";
        sessionStorage.scaler = 1;
    }else{
        mapmodule.innerText="原尺寸显示";
        sessionStorage.scaler = 0;
    }
    GetBinary(BinariesId);
}
/*//鼠标按下，将鼠标按下坐标保存在x,y中  
mCanvas.onmousedown = function(ev) {
    var e = ev || mCanvas.parentNode.parentNode.event;
    dx = e.clientX;
    dy = e.clientY;
    isDown = true;
    var standerx=mCanvas.parentNode.parentNode.scrollLeft;
    var standery=mCanvas.parentNode.parentNode.scrollTop;
    var arr=JSON.parse(sessionStorage.contents);
    for(var i = 0; i < arr.length; i++){
        ctx.beginPath();
        ctx.arc(arr[i].X, arr[i].Y, arr[i].R, 0, Math.PI*2);
        if(ctx.isPointInPath(dx, dx)){
            ctx.fillStyle = "red";
            ctx.fill();
        }
    }
    mCanvas.onmousemove = function(ev) {
        $("#posdiv").html("鼠标坐标，x="+ev.clientX+", y="+ev.clientY);
        if (isDown) {
            var e = ev || mCanvas.parentNode.parentNode.event;
            var mx = e.clientX;
            var my = e.clientY;
            offx = mx - dx;
            offy = my - dy;
            var cav=mCanvas.parentNode.parentNode;
            cav.scrollTo(standerx-offx,shashtandery-offy);
        }
    };
    //鼠标移开事件  
    mCanvas.onmouseup = function(ev) {
        isDown = false;
        var e = ev || window.event;
        refresh()        
        // 重置
        offx = 0;
        offy = 0;
        mCanvas.onmousemove = null;
        mCanvas.onmouseup = null;
    };
};*/
//鼠标滚轮事件，对图形进行缩放。
var mouseHandler = function(ev) {
    if (ev.type == "mousewheel") {
        if(sessionStorage.map_module==0){
            var e = (ev || window.event).originalEvent;
            var deltaY = e.wheelDelta;
            if(deltaY == 120) {
                sessionStorage.scaler=parseFloat(sessionStorage.scaler)+parseFloat(0.1);
            } else if(deltaY == -120) {
                sessionStorage.scaler=parseFloat(sessionStorage.scaler)-parseFloat(0.1);
                if(parseFloat(sessionStorage.scaler)<0.1)
                   sessionStorage.scaler=0.1;
            }
            refresh();
        }
    }
};
mCanvas.onclick=(function(){
    //标准的获取鼠标点击相对于canvas画布的坐标公式
    var x = event.pageX - mCanvas.getBoundingClientRect().left;
    var y = event.pageY - mCanvas.getBoundingClientRect().top;
    ctx.save();
    ctx.clearRect(0, 0, mCanvas.width, mCanvas.height);
    var pfdp = new Object();
    var trans = new DOMMatrix().scale(sessionStorage.scaler,sessionStorage.scaler);
    var arr=JSON.parse(sessionStorage.contents);
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
        ctx.setTransform(trans); //还原矩阵，没有此句，图形将在上一次变化的基础上进行变化。
        ctx.setLineDash([]);
        //var apath="path"+i;
        //apath=new Path2D();
        eval(pfdp.type)(ctx, pfdp);//类反射，pfdp.type对应各类图形名称去调用相应的绘图函数。移动至drawmap.js里。
        //var abc=ctx.getImageData(0,0,100,100);
        if(ctx.isPointInPath(x, y) ){
            ctx.strokeStyle = "red";
            ctx.stroke();
            if(!pfdp.Binding&&pfdp.Binding!=null&& pfdp.Binding!=""){
                var channel=(pfdp.Binding).substring(0,pfdp.Binding.indexOf(':'));
                //var datatype=(pfdp.Binding).substr(pfdp.Binding.indexOf(':')+1);
                if((window.parent.allsensors)&&(window.parent.allsensors[channel])){
                    sessionStorage.sensorId=parseInt(window.parent.allsensors[channel].id);
                    window.parent.iframemain.attr("src","detail.html");
                }else{
                    showmsg("没有绑定标签!");
                }
            }
        }
        for (var key in pfdp) {
            delete pfdp[key];
        }
    }
    ctx.restore();
    /*for(var i = 0; i < balls.length; i++){
        ctx.beginPath();
        ctx.setTransform(trans);
        ctx.arc(balls[i].X, balls[i].Y, balls[i].R, 0, Math.PI*2);
        if(ctx.isPointInPath(x, y)){
            ctx.fillStyle = "red";
            ctx.fill();
        }
    }*/
});
$(mCanvas).off().on({
    mousewheel : mouseHandler,
});/**/
function toggleFullScreen(e) {
    var old_module=sessionStorage.map_module;
    sessionStorage.map_module=1;//将图形比例设为1，这样可以显示最大限度的显示整张图。
    //mapmodule.innerText="自动缩放";
    var old_scaler=sessionStorage.scaler;
    sessionStorage.scaler=1;
    refresh();
    //e.innerHTML == '全屏显示' ? e.innerHTML = '退出全屏' : e.innerHTML = '全屏显示';
    var el = document.getElementById("mycanvas");// || e.target; //target兼容Firefox
    //if(sessionStorage.allscreen=="false")
    //    sessionStorage.allscreen=true
    //else
    //    sessionStorage.allscreen=false;
    window.parent.FullScreen(el);
    sessionStorage.scaler=parseFloat(old_scaler);//恢复原来的设置和比例
    sessionStorage.map_module=old_module;
    if(parseInt(sessionStorage.map_module)==1){
        mapmodule.innerText="自动缩放";
    }else{
        mapmodule.innerText="原尺寸显示";
    }
    /*btns.style.display = "none"
    var el = document.getElementById("mycanvas"); // 这里作者要让地图板块全屏，如果想所有网页全屏直接就写document.documentElement
    var rfs =
      el.requestFullScreen ||
      el.webkitRequestFullScreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullScreen;
    if (rfs) {
      rfs.call(el);
    } else if (typeof window.ActiveXObject !== "undefined") {
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript != null) {
        wscript.SendKeys("{F11}");
      }
    }*/
}
function checkFull() {
    var isFull =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement
    if (isFull === undefined) isFull = false
    return isFull
  }
/**
 * 修改页面的刷新方式后，出现：（在mainpage中，将每次都重新加载页面改为执行页面的初始化函数后）
 * 由于图形列表未删除干净，造成列表数据混乱。
 * 全屏显示和退出全屏的按钮标题显示不正确的问题。以及缩放图形而不是整个窗口。和鼠标移动图形功能。
 * 退出全屏显示后总是原始尺寸显示问题（改为原比例显示），由其他页面返回此页面时保持原比例缩放（默认初始化比例）
 */
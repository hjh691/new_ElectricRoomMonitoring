//var sessionStorage.scaler=1;
var BinariesId=-1;
var mCanvas=document.getElementById("mycanvas");
var isDown = false;
var isrefresh=false;
var dx = 0, 
    dy = 0; // 鼠标按下位置的坐标
var offx = 0, offy = 0; //
var ctx = mCanvas.getContext("2d");
var fcanvas=null;
//var mcanvas2=document.getElementById("mycanvas2");
$(document).ready(function(){
    fcanvas=new fabric.Canvas("mycanvas2") ;
    fcanvas.selection=false;
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
    });
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
            i++
            if(i%10==0){
                //refresh();
            }
        };
    } else {
        var t1 = window.setInterval("refresh();",10000);
    }
    });
function initpage(){
    updatapcnav(2);
    sessionStorage.framepage="drawmap.html";
    sessionStorage.pageindex=1;
    window.parent.realdataid=-1;
    window.parent.getrealdatabynodeid(window.parent.realdataid);
    $("#txlb").empty();
    var sel_sensor=document.getElementById("txlb");
    /*for (var i = 0; i < sel_sensor.options.length; i) {
        sel_sensor.removeChild(sel_sensor.options[0]);
        //sel_sensor.remove(0);
        //sel_sensor.options[0] = null;
    }*/
    if(sessionStorage.txid)
        BinariesId=sessionStorage.txid;
    try{
        var binaries=JSON.parse(localStorage.getItem("binaries"));
    }catch(err){
        
    }
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
    if(localStorage.txif==-1)
        GetBinary(BinariesId)
    else
        drawmap(JSON.parse(sessionStorage.contents),null,1);
    window.parent.closeloadlayer();
    fcanvas.on('mouse:dblclick',function(data){//鼠标双击事件，断路器、隔离开关进行开合状态转换
        if(data.target && data.target.type=='breaker'){
            if(!data.target.isclosed){
                data.target._objects[1].set("fill",'#880000');//fill=='#880000'
                data.target.isclosed=true;
            }else{
                data.target._objects[1].set('fill','#008000');
                data.target.isclosed=false;
            };
            fcanvas.renderAll();
        }
        if(data.target && data.target.type=='Isolator'){
            if(!data.target.isclosed){
                data.target._objects[0].path[5][0]='L';
                data.target._objects[0].path[5][1]= data.target.points['mleft']+data.target.points['r'];
                data.target._objects[0].path[5][2]= data.target.points['y1'];
                data.target.isclosed=true;
                data.target._objects[0].set('fill','#008000');
            }else{
                data.target._objects[0].path[5][0]='L';
                data.target._objects[0].path[5][1]= data.target.points['mright'];
                data.target._objects[0].path[5][2]= data.target.points['y2'];
                data.target.isclosed=false;
                data.target._objects[0].set('fill','#800000');
            }
            fcanvas.renderAll();
            //$("#myModal").modal();//显示模态对话框
        }
    });
    fcanvas.on('mouse:wheel', function(opt) {
        /*var delta = opt.e.deltaY;
        var zoom = fcanvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        fcanvas.setZoom(zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();*/
        if (opt.e.type == "wheel") {//鼠标滚轮事件响应；图形进行连续缩放
            if(sessionStorage.map_module==0){
                var e = (opt.e || window.event).originalEvent;
                var deltaY =  opt.e.deltaY;//e.wheelDelta;
                if(deltaY == 100) {
                    sessionStorage.scaler=parseFloat(sessionStorage.scaler)+parseFloat(0.1);
                    if(parseFloat(sessionStorage.scaler)>3)//最大3倍
                       sessionStorage.scaler=3;
                } else if(deltaY ==-100) {
                    sessionStorage.scaler=parseFloat(sessionStorage.scaler)-parseFloat(0.1);
                    if(parseFloat(sessionStorage.scaler)<0.5)//最小0.5倍
                       sessionStorage.scaler=0.5;
                }
                refresh(null,1);
            }
        }
      });
      /*fcanvas.on('mouse:over',function(data){
          console.log(data.target);//鼠标越过元素时
      });*/
      fcanvas.on('selection:created',function(data){
          //console.log(data);
          if(data.target.binding&&data.target.binding!=null && data.target.binding!="" && !data.target.group){
            var channel=data.target.binding.substring(0,data.target.binding.indexOf(':'));
            //var datatype=(pfdp.Binding).substr(pfdp.Binding.indexOf(':')+1);
            if((window.parent.allsensors)&&(window.parent.allsensors[channel])){
                sessionStorage.sensorId=parseInt(window.parent.allsensors[channel].id);//此处sensorId首字母小写
                window.parent.getrealdatabynodeid(-1);
                //window.parent.document.getElementById("tree").style.pointerEvents ="none";
                localStorage.txid=1;
                window.parent.iframemain.attr("src","detail.html");
            }else{
                //showmsg("没有绑定标签!");
                showstateinfo("此图元没有绑定标签信息","initdrawmap-canvas.onclick");
            }
        }
      });
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
function refreshData(){
    refresh();
}
function refresh(obj,isrefresh){
    if(!checkFull())
    //if((!sessionStorage.allscreen) || ( sessionStorage.allscreen=="false")){
        $("#mapmodule1").text("全屏显示");
        //sessionStorage.allscreen=false;
    //}else{
    //    $("#mapmodule1").text("退出全屏");
//sessionStorage.allscreen=false;
    //}/**/
    var graphic;
    if(!obj)
        graphic = JSON.parse(sessionStorage.getItem("contents"))
    else
        graphic=obj;
    if(!isrefresh)
        isrefresh=null
    else
        isrefresh=1;
    if(graphic!=null){
        drawmap(graphic,ctx,isrefresh);
    }else{
        //getbinary();
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
    refresh(null,1);
}
window.onresize=window.onscroll=refresh;
function decoderealdata(){
}
function getbinary(){
    window.parent.realdataid=-1;
    window.parent.getrealdatabynodeid(window.parent.realdataid);
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
    localStorage.txid=-1;
    GetBinary(BinariesId);
}
function setscaler(){

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
    };//
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
            refresh(null,1);
        }
    }
};
mCanvas.onclick=(function(){
    mCanvas= document.getElementById("mycanvas");
    var ctx = mCanvas.getContext("2d");
    //标准的获取鼠标点击相对于canvas画布的坐标公式
    var x = event.pageX - mCanvas.getBoundingClientRect().left;
    var y = event.pageY - mCanvas.getBoundingClientRect().top;
    //if(event.shiftKey!=1){
    //    mCanvas.width=mCanvas.width;//清除整个区域的方法1
        //ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);//恢复ctx的初始变换
        ctx.clearRect(0,0,mCanvas.width,mCanvas.height);//清除整个区域的方法二，需要setTransform(1,0,0,1,0,0)
    //}
    var pfdp = new Object();
    var trans = new DOMMatrix().scale(sessionStorage.scaler,sessionStorage.scaler);
    var arr=JSON.parse(sessionStorage.contents);
    var str=new Object();
    if(arr!=null)
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
            str = strs._shape;
            //将shape的属性和值赋值给pfdp。
            for (var key in str) {
                pfdp[key] = str[key];
            }
        }
        ctx.setTransform(trans); //还原矩阵，没有此句，图形将在上一次变化的基础上进行变化。
        ctx.setLineDash([]);
        //var apath="path"+i;
        //apath=new Path2D();
        eval(pfdp.type)(ctx, pfdp,fcanvas);//类反射，pfdp.type对应各类图形名称去调用相应的绘图函数。移动至drawmap.js里。
        //var abc=ctx.getImageData(0,0,100,100);
        if(ctx.isPointInPath(x, y) ){
            if(pfdp.isselect){
                str.isselect=false;
                pfdp.isselect=false;
            }else{
                ctx.strokeStyle = "red";
                ctx.stroke();
                str.isselect=true;
                pfdp.isselect=true;
            }
           
            if(pfdp.Binding&&pfdp.Binding!=null && pfdp.Binding!=""){
                var channel=(pfdp.Binding).substring(0,pfdp.Binding.indexOf(':'));
                //var datatype=(pfdp.Binding).substr(pfdp.Binding.indexOf(':')+1);
                if((window.parent.allsensors)&&(window.parent.allsensors[channel])){
                    sessionStorage.sensorId=parseInt(window.parent.allsensors[channel].id);//此处sensorId首字母小写
                    window.parent.getrealdatabynodeid(-1);
                    //window.parent.document.getElementById("tree").style.pointerEvents ="none";
                    localStorage.txid=1;
                    window.parent.iframemain.attr("src","detail.html");
                }else{
                    //showmsg("没有绑定标签!");
                    showstateinfo("此图元没有绑定标签信息","initdrawmap-canvas.onclick");
                }
            }
        }else{
            if(event.shiftKey!=1){
                str.isselect=false;
                pfdp.isselect=false;
            }
        }
        strs._shape=str;
        arr[i]=JSON.stringify(strs);
        for (var key in pfdp) {
            delete pfdp[key];
        }
    }
    sessionStorage.setItem("contents",JSON.stringify(arr));
    ctx.restore();
    refresh(null,1);
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
    refresh(null,1);
    //e.innerHTML == '全屏显示' ? e.innerHTML = '退出全屏' : e.innerHTML = '全屏显示';
    var el = document.getElementById("mycanvas2");// || e.target; //target兼容Firefox
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
function loadCanvasfromsvg(){
    fabric.loadSVGFromURL('res/save.svg', function(objects, options) {
    var obj = fabric.util.groupSVGElements(objects, options);
        fcanvas.add(obj).renderAll();
        /*// 先进行 组合成组
        const group1 = new fabric.Group(objects)
        // 把组合 add 进 card
        fcanvas.add(group1)
        // 把组合设置为选中
        fcanvas.setActiveObject(group1)
        // 把选中的组合 进行拆分组
        fcanvas.getActiveObject().toActiveSelection();
        // 把拆分开的每一个模块进行取消选中状态
        fcanvas.discardActiveObject()
        // 重新渲染
        fcanvas.renderAll()*/
    });
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
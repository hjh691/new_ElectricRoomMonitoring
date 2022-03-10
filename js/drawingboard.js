//变量设置：
//变量声明
//初始化画板
var canvas = new fabric.Canvas("c", {
  isDrawingMode: true,
  skipTargetFind: true,
  selectable: false,
  selection: false
});
canvas.custom_attribute_array = ["name","binding"];//自定义属性内容
window.canvas = canvas;
window.zoom = window.zoom ? window.zoom : 1;
  
var mouseFrom = {},
mouseTo = {},
paras={},
drawType = null,
canvasObjectIndex = 0,
textbox = null;
paras.a=1;paras.b=0;paras.c=0;paras.d=1;paras.e=0;paras.f=0;
var drawWidth = 2; //笔触宽度
var color = "#E34F51"; //画笔颜色
var drawingObject = null; //当前绘制对象
var moveCount = 1; //绘制移动计数器
var doDrawing = false; // 绘制状态
var fillcolor="#fff",strokecolor="#777",threephase=false;
var userAgent = navigator.userAgent;
console.log(userAgent);
var fabric_paras={};
function init_fabric_paras(){
  fabric_paras.fill="#fff";
  fabric_paras.stroke="#000";
  fabric_paras.backgroundcolor="#777";
  fabric_paras.strokeWidth=1;
  fabric_paras.fontSize=18;
  fabric_paras.fontFamily='Helvetica Neue, Helvetica, Arial, sans-serif';
  fabric_paras.fontWeight="normal";
  fabric_paras.fontStyle="normal";
  fabric_paras.left=1;
  fabric_paras.top=1;
  fabric_paras.scaleX=1;
  fabric_paras.scaleY=1;
  fabric_paras.angle=0;
  fabric_paras.flipX=false;
  fabric_paras.flipY=false;
}
init_fabric_paras();
$("#linewidth option[value='3']").attr("selected",true);
changelinewidth(3);
canvas.freeDrawingBrush.color = color; //设置自由绘颜色
canvas.freeDrawingBrush.width = drawWidth;
if(!sessionStorage.fabric_paras)
  sessionStorage.fabric_paras=JSON.stringify(fabric_paras)
else
  fabric_paras=JSON.parse(sessionStorage.fabric_paras);
/*if(!sessionStorage.strokecolor){
  sessionStorage.strokecolor="#000";
}
if(!sessionStorage.fillcolor){
  sessionStorage.fillcolor="#fff";
}
if(!sessionStorage.backgroudcolor){
  sessionStorage.backgroudcolor="#777";
}
if(!sessionStorage.linewidth){
  sessionStorage.linewidth=1;
}*/
$("#strokecolor").val(fabric_paras.stroke);
$("#strokecolor").attr("style","background-color:"+fabric_paras.stroke);
$("#fillcolor").val(fabric_paras.fill);
$("#fillcolor").attr("style","background-color:"+fabric_paras.fill);
$("#backgroundcolor").val(fabric_paras.backgroundcolor);
$("#backgroundcolor").attr("style","background-color:"+fabric_paras.backgroundcolor);
$("#fontsize").val(fabric_paras.fontSize);
$("#fontstyle").val(fabric_paras.fontStyle);
$("#fontstyle option[value="+fabric_paras.fontStyle+"]").attr("selected",true);
$("#fontfamily").val(fabric_paras.fontFamily.split(",")[0]);
$("#fontfamily option[value='"+fabric_paras.fontFamily.split(",")[0]+"']").attr("selected",true);
$("#fontweight").val(fabric_paras.fontWeight);
$("#fontweight option[value="+fabric_paras.fontWeight+"]").attr("selected",true);
//显示调色板
function showdialog(){    
  //$('#demo').hide();
  $('#picker').farbtastic('#color');
}
function changetools(){
  if(drawType=="text"){
    $("#fontsize").val(fabric_paras.fontSize);
    $("#fontstyle").val(fabric_paras.fontStyle);
    $("#fontstyle option[value="+fabric_paras.fontStyle+"]").attr("selected",true);
    $("#fontfamily").val(fabric_paras.fontFamily.split(",")[0]);
    $("#fontfamily option[value='"+fabric_paras.fontFamily.split(",")[0]+"']").attr("selected",true);
    $("#fontweight").val(fabric_paras.fontWeight);
    $("#fontweight option[value="+fabric_paras.fontWeight+"]").attr("selected",true);
  }
  if(drawType=="picture"){
    openpicturefile();
  }
}
function showstrokecolor(){
  $('#pickerstroke').farbtastic('#strokecolor');
  $('#pickerstroke').show();
}
function showfillcolor(){
  $('#pickerfill').farbtastic('#fillcolor');
  $('#pickerfill').show();
}
function showbackgroundcolor(){
  $('#pickerbackground').farbtastic('#backgroundcolor');
  $('#pickerbackground').show();
}
function setstrokecolor(){
  fabric_paras.stroke=$.farbtastic('#pickerstroke').color
  $("#strokecolor").val(fabric_paras.stroke);
  sessionStorage.fabric_paras=JSON.stringify(fabric_paras);
  $("#pickerstroke").hide();
  refreshmap("stroke");
}
function setfillcolor(){
  fabric_paras.fill=$.farbtastic('#pickerfill').color
  $("#fillcolor").val(fabric_paras.fill);
  sessionStorage.fabric_paras=JSON.stringify(fabric_paras);
  //$("#fillcolor").attr("style","background-color:"+fabric_paras.fill);
  $("#pickerfill").hide();
  refreshmap("fill");
}
function setbackgroundcolor(){
  fabric_paras.backgroundcolor=$.farbtastic('#pickerbackground').color
  $("#backgroundcolor").val(fabric_paras.backgroundcolor);
  sessionStorage.fabric_paras=JSON.stringify(fabric_paras);
  $("#pickerbackground").hide();
  canvas.setBackgroundColor(fabric_paras.backgroundcolor, canvas.renderAll.bind(canvas));
}
function changelinewidth(avalue){
  fabric_paras.strokeWidth=parseInt(avalue);
  sessionStorage.fabric_paras=JSON.stringify(fabric_paras);
  refreshmap("strokeWidth");
}
function changefontsize(asize){
  fabric_paras.fontSize=parseInt(asize);
  sessionStorage.fabric_paras=JSON.stringify(fabric_paras);
  refreshmap("fontSize");
}
function changefontfamily(afamily){
  fabric_paras.fontFamily=afamily;
  sessionStorage.fabric_paras=JSON.stringify(fabric_paras);
  refreshmap("fontFamily");
}
function changefontstyle(astyle){
  fabric_paras.fontStyle=astyle;
  sessionStorage.fabric_paras=JSON.stringify(fabric_paras);
  refreshmap("fontStyle");
}
function changefontweight(aweight){
  if(isNumber(aweight))
    fabric_paras.fontWeight=parseInt(aweight)
  else
    fabric_paras.fontWeight=aweight;
  sessionStorage.fabric_paras=JSON.stringify(fabric_paras);
  refreshmap("fontWeight");
}
function refreshmap(atype){
  var items=canvas.getActiveObject();
  if(items)
  if(items._objects){
    //多选
    switch(atype){
      case "left":
      case "top":
      case "scaleX":
      case "scaleY":
      case "angle":
      case "flipX":
      case "flipY":
        alert("请选择单个对象");
        return;
    }
    var etCount = items._objects.length;
    for (var etindex = 0; etindex < etCount; etindex++) {
      if(atype!="fill" || items._objects[etindex].fill!="#0000")
        items._objects[etindex].set(atype,fabric_paras[atype]);
    }
  }else{
    if(atype!="fill" || items._objects[etindex].fill!="#0000")
      items.set(atype,fabric_paras[atype]);
  }
  canvas.renderAll();
}
function changepaint(index){
  switch(index){
    case 1:
      fabric_paras.left=parseFloat($("#left").val());
      refreshmap("left");
      break;
    case 2:
      fabric_paras.top=parseFloat($("#top").val());
      refreshmap("top");
      break;
    case 3:
      fabric_paras.scaleX=parseFloat($("#scalex").val());
      refreshmap("scaleX");
      break;
    case 4:
      fabric_paras.scaleY=parseFloat($("#scaley").val());
      refreshmap("scaleY");
      break;/**/
    case 5:
      fabric_paras.angle=parseFloat($("#rote").val());
      refreshmap("angle");
      break;
    case 6:
      fabric_paras.flipX=$("#flipx").is(":checked");
      refreshmap("flipX");
      break;
    case 7:
      fabric_paras.flipY=$("#flipy").is(":checked");
      refreshmap("flipY");
      break;
  }
  drawing();
}
//(function () {
    //绑定画板事件
    canvas.on("mouse:down", function (options) {
      var xy = transformMouse(options.e.offsetX, options.e.offsetY);
      mouseFrom.x = xy.x;
      mouseFrom.y = xy.y;
      paras.sx=xy.x;
      paras.sy=xy.y;
      doDrawing = true;
    });
    canvas.on("mouse:up", function (options) {
      var xy = transformMouse(options.e.offsetX, options.e.offsetY);
      mouseTo.x = xy.x;
      mouseTo.y = xy.y;
      paras.ex=xy.x;
      paras.ey=xy.y;
      // drawing();
      drawingObject = null;
      moveCount = 1;
      doDrawing = false;
    });
    canvas.on("mouse:move", function (options) {
      if (moveCount % 2 && !doDrawing) {
        //减少绘制频率
        return;
      }
      moveCount++;
      var xy = transformMouse(options.e.offsetX, options.e.offsetY);
      mouseTo.x = xy.x;
      mouseTo.y = xy.y;
      paras.ex=xy.x;
      paras.ey=xy.y;
      if(drawType=="text" && moveCount>2)
        return;
      drawing();
    });
    canvas.on("selection:created", selectobject);
    canvas.on("selection:updated", selectobject);
    function selectobject(e){
      if(drawType=="remove"){
        if (e.target._objects) {
          //多选删除
          var etCount = e.target._objects.length;
          for (var etindex = 0; etindex < etCount; etindex++) {
            canvas.remove(e.target._objects[etindex]);
          }
        }
        {
          //单选删除
          canvas.remove(e.target);
        }
        canvas.discardActiveObject(); //清楚选中框
      }
      if(e.target._objects){
        $("#fontsize").val("");
        $("#fontstyle").val("");
        $("#fontstyle").index(-1);// .attr("selected",true);
        $("#fontfamily").val("");
        $("#fontfamily").index(-1);//.attr("selected",true);
        $("#fontweight").val("");
        $("#fontweight").index(-1);//.attr("selected",true);
        $("#left").val("");
        $("#top").val("");
        $("#scalex").val(1);
        $("#scaley").val(1);
        $("#rote").val(0);
        $("#flipx").attr("checked",false);
        $("#flipy").attr("checked",false);
      }else{
        $("#left").val(e.target.left);
        $("#top").val(e.target.top);
        $("#scalex").val(e.target.scaleX);
        $("#scaley").val(e.target.scaleY);
        $("#rote").val(e.target.angle);
        $("#flipx").attr("checked",e.target.flipX);
        $("#flipy").attr("checked",e.target.flipY);
        if(e.target.__proto__.type=="textbox" || e.target.__proto__.type=="text"){
          $("#fontsize").val(e.target.fontSize);
          $("#fontstyle").val(e.target.fontStyle);
          $("#fontstyle option[value="+e.target.fontStyle+"]").attr("selected",true);
          $("#fontfamily").val(fabric_paras.fontFamily.split(",")[0]);
          $("#fontfamily option[value='"+fabric_paras.fontFamily.split(",")[0]+"']").attr("selected",true);
          $("#fontweight").val(e.target.fontWeight);
          $("#fontweight option[value="+e.target.fontWeight+"]").attr("selected",true);
        }else{
          $("#fontsize").val("");
          $("#fontstyle").val("");
          $("#fontstyle").index(-1);// .attr("selected",true);
          $("#fontfamily").val("");
          $("#fontfamily").index(-1);//.attr("selected",true);
          $("#fontweight").val("");
          $("#fontweight").index(-1);//.attr("selected",true);
        }
      }
    }
    //坐标转换
    function transformMouse(mouseX, mouseY) {
      return { x: mouseX / window.zoom, y: mouseY / window.zoom };
    }
    //绑定工具事件
    jQuery("#tools-hul2")
      .find("li")
      .on("click", function () {
        //设置样式
        jQuery("#tools-hul2")
          .find("li>i")
          .each(function () {
            jQuery(this).attr("class", jQuery(this).attr("data-default"));
          });
        jQuery(this)
          .addClass("active")
          .siblings()//兄弟元素
          .removeClass("active");
        jQuery(this)
          .find("i")
          .attr(
            "class",
            jQuery(this)
              .find("i")
              .attr("class")
              .replace("black", "select")
          );
        drawType = jQuery(this).attr("data-type");
        canvas.isDrawingMode = false;
        if (textbox) {
          //退出文本编辑状态
          textbox.exitEditing();
          textbox = null;
        }
        if (drawType == "pen") {
          canvas.isDrawingMode = true;
        } else if (drawType == "remove"||drawType=="move") {
          canvas.selection = true;
          canvas.skipTargetFind = false;
          canvas.selectable = true;
        } else {
          canvas.skipTargetFind = true; //画板元素不能被选中
          canvas.selection = false; //画板不显示选中
        }
      });
  
    //绘画方法
    function drawing() {
      if (drawingObject) {
        canvas.remove(drawingObject);
      }
      var canvasObject = null;
      switch (drawType) {
        case "arrow": //箭头
          canvasObject = new fabric.Path(drawArrow(mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y, 30, 30), {
            stroke: fabric_paras.stroke,
            fill: "#0000",//sessionStorage.fillcolor,
            strokeWidth: fabric_paras.strokeWidth,//drawWidth
          });
          break;
        case "line": //直线
          canvasObject=drawline(paras);
          break;
        case "dottedline": //虚线
        var line_o=[]  
          canvasObject=dottedline(paras);
          break;
        case "circle": //正圆
          canvasObject=circle(paras);
          break;
        case "ellipse": //椭圆
          canvasObject=ellipse(paras);
          break;
        case "square": //TODO:正方形（后期完善）
          break;
        case "rectangle": //长方形
          /*var path =
            "M " +
            mouseFrom.x +
            " " +
            mouseFrom.y +
            " L " +
            mouseTo.x +
            " " +
            mouseFrom.y +
            " L " +
            mouseTo.x +
            " " +
            mouseTo.y +
            " L " +
            mouseFrom.x +
            " " +
            mouseTo.y +
            " L " +
            mouseFrom.x +
            " " +
            mouseFrom.y +
            " z";
          canvasObject = new fabric.Path(path, {//也可以使用fabric.Rect
            left: left,
            top: top,
            stroke: fabric_paras.stroke,
            strokeWidth: fabric_paras.strokeWidth,//drawWidth,
            fill: "#0000",
          });*/
          canvasObject=new fabric.Rect({
            left:mouseFrom.x,
            top: mouseFrom.y,
            width:mouseTo.x-mouseFrom.x,
            height:mouseTo.y-mouseFrom.y,
            stroke:fabric_paras.stroke,
            fill: "#0000",
            strokeWidth:fabric_paras.strokeWidth,
            originX:"left",
            originY:"top",
            strokeDashoffset:fabric_paras.strokeWidth,
            hasControls:true,
            type:'rect',
            lockMovementX: false, 
            lockMovementY: false,
          });
          break;
        case "rightangle": //直角三角形
          var path = "M " + mouseFrom.x + " " + mouseFrom.y + " L " + mouseFrom.x + " " + mouseTo.y + " L " + mouseTo.x + " " + mouseTo.y + " z";
          canvasObject = new fabric.Path(path, {
            left: left,
            top: top,
            stroke: fabric_paras.stroke,
            strokeWidth:fabric_paras.strokeWidth,// drawWidth,
            fill: fabric_paras.fill,
          });
          break;
        case "equilateral": //等边三角形
          var height = mouseTo.y - mouseFrom.y;
          canvasObject = new fabric.Triangle({
            top: mouseFrom.y,
            left: mouseFrom.x,
            width: Math.sqrt(Math.pow(height, 2) + Math.pow(height / 2.0, 2)),
            height: height,
            stroke: fabric_paras.stroke,
            strokeWidth: fabric_paras.strokeWidth,//drawWidth,
            fill: fabric_paras.fill,
          });
          break;
        case "isosceles":
          break;
        case "text":
          textbox = new fabric.IText("", {
            left: mouseFrom.x - 60,
            top: mouseFrom.y - 20,
            width: 150,
            fontSize: fabric_paras.fontSize,
            fontFamily:fabric_paras.fontFamily,
            fontStyle:fabric_paras.fontStyle,
            fontWeight:fabric_paras.fontWeight,
            borderColor: "#2c2c2c",
            fill: fabric_paras.fill,
            hasControls: false,
            binding: "5678",
          });
          //textbox.set("style",'{"binding":"6998"}');
          //textbox.set("style",'');
          canvas.add(textbox);
          textbox.enterEditing();
          textbox.hiddenTextarea.focus();
          break;
        case "remove":
          break;
        case "isolator":
          canvasObject=isolator(paras);
          break;
        case "breaker":
          canvasObject=breaker(paras);
          break;  
        case "ground":
          canvasObject=ground(paras);
          break;
        case "capacitor":
          canvasObject=capacitor(paras);
          break;
        case "outer":
          canvasObject=outer(paras);
          break;
        case "transformer":
          canvasObject=transformer(paras);
          break;
        case "warning":
          canvasObject=warning(paras);
          break;
        case "rectarea":
          canvasObject=rectarea(paras);
          break;
        case "ellipsearea":
          canvasObject=ellipsearea(paras);
          break;
        /*case "picture":
          importfromfile();
          break;*/
        default:
          break;
      }
      if (canvasObject) {
        // canvasObject.index = getCanvasObjectIndex();
        canvas.add(canvasObject); //.setActiveObject(canvasObject)
        drawingObject = canvasObject;
      }
    }
  
    //绘制箭头方法
    function drawArrow(fromX, fromY, toX, toY, theta, headlen) {
      theta = typeof theta != "undefined" ? theta : 30;
      headlen = typeof theta != "undefined" ? headlen : 10;
      // 计算各角度和对应的P2,P3坐标
      var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
      var arrowX = fromX - topX,
        arrowY = fromY - topY;
      var path = " M " + fromX + " " + fromY;
      path += " L " + toX + " " + toY;
      arrowX = toX + topX;
      arrowY = toY + topY;
      path += " M " + arrowX + " " + arrowY;
      path += " L " + toX + " " + toY;
      arrowX = toX + botX;
      arrowY = toY + botY;
      path += " L " + arrowX + " " + arrowY;
      return path;
    }
  
    //获取画板对象的下标 olimpic
    function getCanvasObjectIndex() {
      return canvasObjectIndex++;
    }
  //绘制直线
  function drawline(aparas){
    with(aparas){
      var line_o=[]  
      if(Math.abs(ex-sx)>Math.abs(ey-sy)){
        line_o=[sx, sy, ex, sy]; 
      }else{
        line_o=[sx, sy, sx, ey];
      }
      var line = new fabric.Line(line_o, {//画任意方向线，mouseTo.y替换后一个mouseFrom.y
        stroke: fabric_paras.stroke,
        strokeWidth: fabric_paras.strokeWidth,//drawWidth
      });
      fabric.util.addTransformToObject(line,[a,b,c,d,e,f]);
      return line;
    }
  }
  //绘制虚线
  function dottedline(aparas){
    with(aparas){
      var line_o=[]  
      if(Math.abs(ex-sx)>Math.abs(ey-sy)){
        line_o=[sx, sy, ex, sy]; 
      }else{
        line_o=[sx, sy, sx, ey];
      }
      var line = new fabric.Line(line_o, {//画任意方向线，mouseTo.y替换后一个mouseFrom.y
        strokeDashArray: [5, 5],
        stroke: fabric_paras.stroke,
        strokeWidth: fabric_paras.strokeWidth,//drawWidth
      });
      fabric.util.addTransformToObject(line,[a,b,c,d,e,f]);
      return line;
    }
  }
  //绘制圆
  function circle(aparas){
    with(aparas){
      var left = sx<ex?sx:ex,
        top = sy<ey?sy:ey;
      var radius = Math.sqrt((ex -sx) * (ex - sx) + (ey - sy) * (ey - sy)) / 2;
      var circle = new fabric.Circle({
        left: left,
        top: top,
        stroke: fabric_paras.stroke,
        fill: "#0000",//sessionStorage.fillcolor,
        radius: radius,
        strokeWidth: fabric_paras.strokeWidth,//drawWidth
      });
      return circle;
    }
  }
  //绘制椭圆
  function ellipse(aparas){
    with(aparas){
      var left = sx,
        top = sy;
      var radius = Math.sqrt((ex - left) * (ex - left) + (ey - top) * (ey - top)) / 2;
      var ellipse = new fabric.Ellipse({
        left: left,
        top: top,
        stroke: fabric_paras.stroke,
        fill: "#0000",//sessionStorage.fillcolor,
        originX: "center",
        originY: "center",
        rx: Math.abs(left - mouseTo.x),
        ry: Math.abs(top - mouseTo.y),
        strokeWidth: fabric_paras.strokeWidth,//drawWidth
      });

      return ellipse;
    }
  }
    //绘制断路器breaker
    function breaker(aparas){
      with(aparas){
        var mx = parseFloat(sx) + parseFloat((ex - sx) / 2);
        var y1 = parseFloat(sy) + parseFloat((ey - sy) / 6);
        var y2 = parseFloat(ey) - (parseFloat(ey - sy) / 6);
        var offset=fabric_paras.strokeWidth/2
        var fpath=new fabric.Path('M '+(mx+offset)+' '+(sy)+' L'+' '+ (mx+offset)+' '+ (y1)+
        '  M '+ (mx+offset)+' '+ (y2)+' L '+ (mx+offset)+' '+ (ey),{
          fill: fabric_paras.fill,
          stroke:fabric_paras.stroke,
          strokeWidth:fabric_paras.strokeWidth,
          originX:"right",
          originY:"bottom",
        });
        var frect=new fabric.Rect({
          left:sx,
          top:y1, 
          width:parseFloat(ex) - parseFloat(sx),
          height: y2 - y1,
          fill:fabric_paras.fill,
          stroke:fabric_paras.stroke,
          strokeWidth:fabric_paras.strokeWidth,
        });
        //sx=sx-offset;
        var breaker=new fabric.Group([fpath,frect],{
          left:sx,
          //hasControls:false,
          type:'breaker',
          isclosed:false,
          //lockMovementX: true, 
          //lockMovementY: true,
        });
        fabric.util.addTransformToObject(breaker,[a,b,c,d,e,f]);
        return breaker;
      }
    }
    function isolator(aparas){
      with(aparas){
        var mleft = sx < ex ? sx: ex; //左侧坐标
        var mright = sx < ex ? ex: sx; //右侧坐标
        var mtop = sy < ey ? sy: ey; //顶端坐标
        var mbottom = sy < ey ? ey: sy; //底边坐标
        var r = (parseFloat(mright) - parseFloat(mleft)) * 3 / 20;
        var y1 = parseFloat(mtop) + parseFloat((parseFloat(mbottom) - parseFloat(mtop)) / 6);
        var y2 = parseFloat(mtop) + parseFloat((parseFloat(mbottom) - parseFloat(mtop)) / 4);
        var y3 = parseFloat(mbottom) - parseFloat((parseFloat(mbottom) - parseFloat(mtop)) / 6);
        //var points=[];
        //points.mleft=mleft;points.mright=mright;points.mtop=mtop;points.mbottom=mbottom;
        //points.r=r;points.y1=y1;points.y2=y2;points.y3=y3;
  
        var offset=fabric_paras.strokeWidth/2
        //points.offset=offset;
        var fisloterpath1=new fabric.Path('M '+(mleft+offset)+' '+mtop+' '+'L '+(mleft+offset)+' '+(parseFloat(y1) - parseFloat(r))+
        ' M '+(mleft+offset)+' '+mbottom+' '+'L '+(mleft+offset)+' '+(parseFloat(y3) - parseFloat(r))+
        ' M '+(mleft+offset*2)+' '+y3+' '+'L '+mright+' '+y2,{
          stroke:fabric_paras.stroke,
          strokeWidth:fabric_paras.strokeWidth,
          fill:fabric_paras.fill,
          originX:"left",
          originY:"bottom",
        });
        var fisloterart1=new fabric.Circle({
          left:mleft-r,
          top:y1-r,
          radius:r,
          stroke:fabric_paras.stroke,
          strokeWidth:fabric_paras.strokeWidth,
        });
        
        var fisloterart2=new fabric.Circle({
          left:mleft-r,
          top:y3-r,
          radius:r,
          stroke:fabric_paras.stroke,
          strokeWidth:fabric_paras.strokeWidth,
        });
        
        var fislotergroup=new fabric.Group([fisloterpath1,fisloterart1,fisloterart2],{
          left:sx-r,
          //hasControls:false,
          type:'Isolator',
          originX:"left",
          originY:"bottom",
          isclosed:false,
          //points:points,
          //lockMovementX: true, 
          //lockMovementY: true,
        });
        fabric.util.addTransformToObject(fislotergroup,[a,b,c,d,e,f]);
        //fcanvas.add(fislotergroup);
        return fislotergroup;
      }
    }
    function ground(aparas){
      with(aparas){
        var mleft = sx < ex ? sx: ex; //左侧坐标
        var mright = sx < ex ? ex: sx; //右侧坐标
        var mtop = sy < ey ? sy: ey; //顶端坐标
        var mbottom = sy < ey ? ey: sy; //底边坐标
        var mwidth = mright - mleft,
          mheight = mbottom - mtop;
        var mx = mleft + mwidth / 2.0,
          y1 = mbottom - mheight / 3.0,
          y2 = mbottom - mheight / 6.0;
        
        var offset=fabric_paras.strokeWidth/2
        var fground=new fabric.Path('M '+(mx+offset)+' '+mtop+' L '+(mx+offset)+' '+y1+' M '+
          (mleft+offset)+' '+y1+' L '+(mright+offset)+' '+y1+' M '+
          (mleft+offset+mwidth/4.0)+' '+y2+' L '+(mright+offset-mwidth/4.0)+' '+y2+' M '+
          (mleft+offset+mwidth/8.0*3)+' '+mbottom+' L '+(mright+offset-mwidth/8.0*3)+' '+mbottom,{
          fill:fabric_paras.fill,
          strokeWidth:fabric_paras.strokeWidth,
          stroke:fabric_paras.stroke,
          //hasControls:false,	
          type:'ground',
          //lockMovementX: true, 
          //lockMovementY: true,
          } );
        fabric.util.addTransformToObject(fground,[a,b,c,d,e,f]);
        //fcanvas.add(fground);
        return fground;
      }
    }
    //绘制出线
    function outer(aparas){
      with(aparas){
        var mleft = sx < ex ? sx: ex; //左侧坐标
        //var mright = sx < ex ? ex: sx; //右侧坐标
        var mtop = sy < ey ? sy: ey; //顶端坐标
        var mbottom = sy < ey ? ey: sy; //底边坐标
        var mheight = mbottom - mtop;
        var mhead = mheight / 10.0;

        var offset=fabric_paras.strokeWidth/2;
        var fouter=new fabric.Path('M '+(mleft+offset)+' '+mbottom+' L '+(mleft-mhead+offset)+' '+(mbottom-mhead)+
        ' L '+(mleft+mhead+offset)+' '+(mbottom-mhead)+' z M '+(mleft+offset)+' '+(mbottom-mhead)+' L '+(mleft+offset)+' '+mtop,{
          stroke: fabric_paras.stroke,
          strokeWidth: fabric_paras.strokeWidth,
          //hasControls:false,
          type:'outer',
          //lockMovementX: true, 
          //lockMovementY: true,
        });
        fabric.util.addTransformToObject(fouter,[a,b,c,d,e,f]);
        //fcanvas.add(fouter);
        return fouter;
      }
    }
    //绘制变压器
    function transformer(aparas){
      with(aparas){
        var mleft = parseFloat(sx < ex ? sx: ex); //左侧坐标
        var mright = parseFloat(sx < ex ? ex: sx); //右侧坐标
        var mtop = parseFloat(sy < ey ? sy: ey); //顶端坐标
        var mbottom = parseFloat(sy < ey ? ey: sy); //底边坐标
        var r = (mright - mleft) / 2.0;
        var mx = mleft + r,
        r1 = mtop + r,
        r2 = mbottom - r;
        var x1 = mleft + ((mright) - (mleft)) / 3;
        var x2 = (mright) - ((mright) - (mleft)) / 3;
        var y11 = (mtop) + r / 2.0,
        y12 = (mtop) + r;
        var y21 = (mbottom) - r / 1 - r / 6,
        y23 = (mbottom) - r / 2,
        y22 = (y21 + y23) / 2 - r / 12;

        var fcircle1=new fabric.Circle({
          left: mx-r,
          top:r1-r,
          radius:r,
          fill:"#0000",
          stroke:fabric_paras.stroke,
          strokeWidth:fabric_paras.strokeWidth,
          hasControls:false,
        });
        var fcircle2=new fabric.Circle({
          left: mx-r,
          top:r2-r,
          radius:r,
          fill:"#0000",
          stroke:fabric_paras.stroke,
          strokeWidth:fabric_paras.strokeWidth,
          hasControls:false,
        });
        var fpath1=new fabric.Path('M '+mx+' '+y11+' L '+x1+' '+y12+' L '+x2+' '+y12+ ' z M '+
        x1+' '+y21+' L '+mx+' '+y22+' L '+x2+' '+y21+' M '+mx+' '+y22+' L '+mx+' '+y23,{
          stroke:fabric_paras.stroke,
          strokeWidth:fabric_paras.strokeWidth,
          fill:"#0000",
          hasControls:false,
        });
        var ftransformer=new fabric.Group([fcircle1,fcircle2,fpath1],{
          hasControls:true,
          type:'transformer',
          lockMovementX: false, 
          lockMovementY: false,
        });
        fabric.util.addTransformToObject(ftransformer,[a,b,c,d,e,f]);
        //fcanvas.add(ftransformer);
        return ftransformer;
      }
    }
    //绘制告警区域
    function warning(aparas){
      with(aparas){
        var mleft = sx < ex ? sx: ex; //左侧坐标
        var mright = sx < ex ? ex: sx; //右侧坐标
        var mtop = sy < ey ? sy: ey; //顶端坐标
        var mbottom = sy < ey ? ey: sy; //底边坐标
        var mwidth = mright - mleft,
        mheight = mbottom - mtop;
        var mx = mleft + mwidth / 2.0,
        x1 = mleft + mwidth / 4.0,
        x2 = mright - mwidth / 4.0;
        var y1 = mtop + mheight / 9.0 * 4,
        y2 = mbottom - mheight / 9.0 * 4;

        var offset=fabric_paras.strokeWidth/2;
        var fwarning=new fabric.Path('M '+(x2+offset)+' '+mtop+' L '+(mleft+offset)+' '+y2+' L '+(mx+offset)+' '+y2+' L '+
        (x1+offset)+' '+mbottom+' L '+(mright+offset)+' '+y1+' L '+(mx+offset)+' '+y1+' z',{
          stroke:"red",
          strokeWidth:fabric_paras.strokeWidth,
          fill:"yellow",
          hasControls:true,
          type:'warning',
          lockMovementX: false, 
          lockMovementY: false,
        });
        fabric.util.addTransformToObject(fwarning,[a,b,c,d,e,f]);
        //fcanvas.add(fwarning);
        return fwarning;
      }
    }
    //绘制矩形区域
    function rectarea(aparas){
      with(aparas){
        var frectarea=new fabric.Rect({
          left:sx,
          top:sy,
          width:parseFloat(ex) - parseFloat(sx),
          height:parseFloat(ey) - parseFloat(sy),
          stroke:fabric_paras.stroke,
          fill: fabric_paras.fill,
          strokeWidth:fabric_paras.strokeWidth,
          originX:"left",
          originY:"top",
          strokeDashoffset:fabric_paras.strokeWidth,
          hasControls:true,
          type:'rectarea',
          lockMovementX: false, 
          lockMovementY: false,
        })
        fabric.util.addTransformToObject(frectarea,[a,b,c,d,e,f]);
        //fcanvas.add(frectarea);
        return frectarea;
      }
    }
    //绘制椭圆形/圆形区域
    function ellipsearea(aparas){
      with(aparas){
        var ox = parseFloat(sx) + parseFloat((ex - sx) / 2),
        oy = parseFloat(sy) + parseFloat((ey - sy) / 2);
        var lx = Math.abs(sx - ex) / 2;
        var ly = Math.abs(sy - ey) / 2;

        var fellipsearea=new fabric.Ellipse({
          left:ox-lx,
          top:oy-ly,
          rx:lx,
          ry:ly,
          fill:fabric_paras.fill,
          stroke:fabric_paras.stroke,
          strokeWidth:fabric_paras.strokeWidth,
          type:'ellipsearea',
          //lockMovementX: true, 
          //lockMovementY: true,
        });
        fabric.util.addTransformToObject(fellipsearea,[a,b,c,d,e,f]);
        //fcanvas.add(fellipsearea);
        return fellipsearea;
      }
    }
    //绘制电容器
    function capacitor(aparas){
      with(aparas){
        var mleft = sx < ex ? sx: ex; //左侧坐标
        var mright = sx < ex ? ex: sx; //右侧坐标
        var mtop = sy < ey ? sy: ey; //顶端坐标
        var mbottom = sy < ey ? ey: sy; //底边坐标 
        var mwidth = mright - mleft,
        mheight = mbottom - mtop;
        var mx = mleft + mwidth / 2.0;
        var y1 = mtop + mheight / 3.0,
        y2 = mbottom - mheight / 3.0;

        var fcapacitor=null;
			  var offset=fabric_paras.strokeWidth/2;
        if(!threephase){
          fcapacitor=new fabric.Path('M '+(mx+offset)+' '+mtop+' L '+(mx+offset)+' '+y1+' M '+
          (mleft+offset)+' '+y1+' L '+(mright+offset)+' '+y1+' M '+(mleft+offset)+' '+y2+' L '+
          (mright+offset)+' '+y2+' M '+(mx+offset)+' '+y2+' L '+(mx+offset)+' '+mbottom,{
            stroke:fabric_paras.stroke,
            strokeWidth:fabric_paras.strokeWidth,
            hasControls:true,
            type:'capacitor',
            lockMovementX: false, 
            lockMovementY: false,
            Threephase:threephase,
          });
        }else{
          var per = mwidth / 8.0;
          var lxm = mleft + per;
          var lxr = mleft + per * 2;
          var mxl = mleft + per * 3;
          var mxr = mright - per * 3;
          var rxl = mright - per * 2;
          var rxm = mright - per;
          y1 += mheight / 12.0;
			    y2 -= mheight / 12.0;
          fcapacitor=new fabric.Path('M '+(mx+offset)+' '+mtop+' L '+(mx+offset)+' '+y1+' M '+
            (mxl+offset)+' '+y1+' L '+(mxr+offset)+' '+y1+' M '+(mxl+offset)+' '+y2+' L '+
            (mxr+offset)+' '+y2+' M '+(mx+offset)+' '+y2+' L '+(mx+offset)+' '+mbottom+
            'M '+(lxm+offset)+' '+mtop+' L '+(lxm+offset)+' '+y1+' M '+
            (mleft+offset)+' '+y1+' L '+(lxr+offset)+' '+y1+' M '+(mleft+offset)+' '+y2+' L '+
            (lxr+offset)+' '+y2+' M '+(lxm+offset)+' '+y2+' L '+(lxm+offset)+' '+mbottom+
            'M '+(rxm+offset)+' '+mtop+' L '+(rxm+offset)+' '+y1+' M '+
            (rxl+offset)+' '+y1+' L '+(mright+offset)+' '+y1+' M '+(rxl+offset)+' '+y2+' L '+
            (mright+offset)+' '+y2+' M '+(rxm+offset)+' '+y2+' L '+(rxm+offset)+' '+mbottom,{
              stroke:fabric_paras.stroke,
              strokeWidth:fabric_paras.strokeWidth,
              hasControls:true,
              type:'capacitor',
              lockMovementX: false, 
              lockMovementY: false,
              Threephase:threephase,
            });
        }
        fabric.util.addTransformToObject(fcapacitor,[a,b,c,d,e,f]);
        //fcanvas.add(fcapacitor);
        return fcapacitor;
      }
    }
  //绑定值设置
  function settextbinding(){
    var items=canvas.getActiveObject();
    if(items){
    if(items._objects){
      alert("请选择单个对象");
          return;
    }
    else{
      if(items.__proto__.type=="text" || items.__proto__.type=="textbox"){
        if($("#binding").val())  
        items.set("binding",$("#binding").val());
      canvas.renderAll();
      }
    }
  }
}


  

    function emport(){
      const dataURL = this.canvas.toDataURL({//导出成png图片
          width: this.canvas.width,
          height: this.canvas.height,
          left: 0,
          top: 0,
          format: 'png',
      });
      const link = document.createElement('a');//虚拟一个a元素，和link下载然后再删掉a元素。
      link.download = 'canvas.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
  function save(){
      var json =canvas.toSVG(['binding']);//JSON.stringify( canvas.toDatalessJSON(['binding']) );// 保存为json
      var blob = new Blob([json], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "save.svg");
  }
  function importfromfile(){
    $("#file").trigger("click");
  }
  function openpicturefile(){
    $("#picturefile").trigger("click");
  }
  function exit(){
    if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {
      window.location.href="about:blank";
      window.close();
    } else {
      window.opener = null;
      window.open("", "_self");
      window.close();
    }
  }
  //读取文件内容
  function upload(input) {  
    //支持chrome IE10  
    if (window.FileReader) {  
        var file = input.files[0];
        var filename=getObjectURL(file); //input.value值为细虚拟路径，不能得到文件内容。   
        var reader = new FileReader();  
        reader.onload = function(enent) {  
          //console.log(this.result)  ;
          loadCanvasfromsvg(file.name,this.result,filename);  
        }  
        reader.readAsText(file);  
    }   
    //支持IE 7 8 9 10  
    else if (typeof window.ActiveXObject != 'undefined'){  
        var xmlDoc;   
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");   
        xmlDoc.async = false;   
        xmlDoc.load(input.value);   
        loadCanvasfromsvg(xmlDoc.xml);   
    }   
    //支持FF  
    else if (document.implementation && document.implementation.createDocument) {   
        var xmlDoc;   
        xmlDoc = document.implementation.createDocument("", "", null);   
        xmlDoc.async = false;   
        xmlDoc.load(input.value);   
        console.log(xmlDoc.xml);  
    } else {   
        alert('error');   
    }   
}  
function uploadpicture(efile){
  var file = efile.files[0];
  if(!/image\/\w+/.test(file.type)){
    alert("请确保文件为图像类型");
    return false;
  }　　　　//选择的文件对象
  if (file) {
    var reader = new FileReader();　　　　//实例化
    reader.readAsDataURL(file);　　　　　　//加载
    reader.onload = function () {
      var re = this.result;
      //alert(file.name);    //'文件'file.name  '大小'file.size  '修改'file.lastModifiedDate     
      
      //$("#img").attr("src", re);　　//赋值img
      const image = new Image();
      image.src =re;
      image.onload = function(event) {
        // console.log(event, this);
        URL.revokeObjectURL(this.src);
          
        var imgInstance = new fabric.Image(image,{
          left:0,
          top:0,
          angle:0,
          opacity:1
        });
        //imgInstance.scaleX=imgInstance.scaleY=window.zoom;
        canvas.add(imgInstance);
        canvas.renderAll();
      }/*
        var imgElement = document.getElementById("img");
        var imgInstance = new fabric.Image(imgElement,{
          left:100,
          top:10,
          angle:30,
          opacity:0.85
        });
        canvas.add(imgInstance);
        canvas.renderAll();*/
    }
  }
}
function loadCanvasfromsvg(filename,txt_string,pathname){
  var ext_filename = filename.split(".")[1];
  var json =txt_string;//canvas.toSVG();//JSON.stringify( canvas.toDatalessJSON() );
  /*fabric.loadSVGFromURL('res/save.svg', function(objects, options) {//通过svg文件的url加载
  var obj = fabric.util.groupSVGElements(objects, options);
  canvas.add(obj).renderAll();
  });*/
  switch(ext_filename.toLowerCase()){
    case "json":
      canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function(o, object) {//加载JSON图形，JSON可以是json对象，也可以是josn字符串
          // `o` = json object //o是json 对象（单个）
          // `object` = fabric.Object instance //object 是根据o转换的fabric实例
          // ... do some stuff ...
          
      }
      //json可以是json对象，也可是json字符串。
      );
      break;
    case "svg":
      /*fabric.loadSVGFromURL(pathname, function(objects, options) {//通过svg文件的url加载
        var obj = fabric.util.groupSVGElements(objects, options);
        canvas.add(obj).renderAll();
        });*/
      fabric.loadSVGFromString(json, 
        /*function(objects, options) {
          var obj = fabric.util.groupSVGElements(objects, options);
          canvas.add(obj).renderAll();*/
        (objects) => {//通过svg字符串加载
          // 先进行 组合成组
          const group1 = new fabric.Group(objects)
          // 把组合 add 进 card
          canvas.add(group1)
          // 把组合设置为选中
          canvas.setActiveObject(group1)
          // 把选中的组合 进行拆分组
          canvas.getActiveObject().toActiveSelection();
          // 把拆分开的每一个模块进行取消选中状态
          canvas.discardActiveObject();
          // 重新渲染
          canvas.renderAll();
      });
      break;
    default:
      alert("文件类型不正确！\r 请选择SVG或JSON类型的文件.")
    }
}
//获取文件真实路径（也是映射路径，并非真实的文件路径）  
function getObjectURL(file) {undefined
    var url = null;
    // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已//
    if (window.createObjectURL != undefined) {   // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) {        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {  // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url;
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
  //})();
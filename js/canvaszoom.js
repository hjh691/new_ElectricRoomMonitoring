//配置
var config = function() {
    return {
      height: 1080, //默认画板高、宽
      width: 1920,
      canvasParentId: "canvasDiv",
      canvasId: "c"
    };
  };
  var ffff={"Black":"900","Bold":"700","ExtraBlack":"900","ExtraBold":"800","ExtraLight":"200","Light":"300","Medium":"500","Normal":"normal","SemiBold":"600","Thin":"100"};
  //初次设置画板
  (function() {
    setZoom(window.canvas);
  })();

  //设置缩放
  function setZoom(canvas) {
    var canvasDiv = jQuery("#" + config().canvasParentId);
    var zoom = 1;
    var eleHeight = canvasDiv.height(),
      eleWidth = canvasDiv.width(),
      cHeight = canvas.height,
      cWidth = canvas.width;
    var height = eleHeight > cHeight ? eleHeight : cHeight;
    var width = eleWidth > cWidth ? eleWidth : cWidth;
    if (width > height) {
      //横版
      width = eleWidth;
      height = eleHeight;
      zoom = width / config().width;
    } else {
      //竖版
      height = height * eleHeight / config().height * 0.8;
      zoom = height / config().height;
    }
    canvas.setZoom(zoom);
    canvas.setWidth(width);
    canvas.setHeight(height);
  
    window.zoom = zoom;
    canvas.renderAll();
  }
  
  //监听窗体变化
  window.onresize = function() {
    setZoom(window.canvas);
  };
  //测试功能  获取系统默认字体
  
  
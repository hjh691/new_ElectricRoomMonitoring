    //初始化历史数据图形显示页面（在进入趋势图页面时触发）。
    var check_val = [],check_name=[];
    var kssj,jssj;
    var sensors,configs,scatalog;
    var sel_str=[];
    var ch1,ch2,ch3,ch4;
    var cname,catalog;
    var isfound=false;
    var selectText="";
    var timer=null;
    var flashit=$("#chaxun");
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
    });
    inithistorychart();
    function inithistorychart() {
        try{
        updatapcnav(7);
        //selectText="";//重复赋值，造成与显示不符，从而造成选择与状态不符。
        //var el=$("[class $= 't']");jquery 选择器 结束、开始、包含、等于
        //保存页面现场，在点击浏览器的刷新按钮刷新时应用
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
        if(typeof sel_sensor=="undefined")//首次进入页面时有可能为undefined，转换成[],否则有可能报错。
            sel_sensor=[];
        var tree_obj=window.parent.$("#tree_chi");
        var obj_node=tree_obj.treeview("getSelected");
        if(obj_node.length>0)//判断有没有选中项
        {tree_obj.treeview("unselectNode",obj_node[0]);}//使选择项为不选中，为下一步选择所有未选择项准备//	$("#sel-sensorname").val("所选标签: "+tree_obj.treeview("getSelected")[0].text);
        var sensor=tree_obj.treeview("getUnselected");//选取未选中项
        if(sensor && sel_sensor){
            var nodeid;
            let sel_sersor_len=sel_sensor.length,sensors_len=sensor.length;
            for (var i =sel_sersor_len-1 ; i >=0; i--) {//使得最后选中的标签维最靠前面的标签，树形菜单定位到第一个被选中的标签位置；原来（正序）为最后一个
                for(var j=0;j<sensors_len;j++){
                    if(sel_sensor[i]==sensor[j].id){
                        //if(i==0)
                        nodeid=sensor[j].text;
                        tree_obj.treeview("selectNode",sensor[j].nodeId);
                        break;
                    }
                }
            }
            tree_obj.treeview("search",[nodeid+'', { ignoreCase: false, exactMatch: true }]);
        }
        //sensors=JSON.parse(localStorage.getItem("sensors"));//
        configs=JSON.parse(localStorage.Config);
        //appenddisplaytype();//重复执行次数太多（3次），故去掉此处的调用。
        //setSelectOption("jcdd", sessionStorage.SensorId);
        oneChoice();
        window.parent.closeloadlayer();
        }catch(err){
            showstateinfo(err.message,"chart/inithistorychart");
        }
    }
    //清楚分组列表列表内容，在系统节点切换时运行，避免多节点的类型叠加。
    function cleardisplaytype(){
        $("#display_type_chart").empty();
    }
    //添加类别分组选项
    function appenddisplaytype(element_id){
        try{
            sensors=JSON.parse(localStorage.getItem("sensors"));
            if(sensors){
                let sensors_len=sensors.length;
                for(var k=0;k<sensors_len;k++){
                    if(sensors[k].Value.id==element_id){
                        scatalog=sensors[k].Value.type;//catalog;//读取对应的Catalog项1
                        if(scatalog)
                            scatalog=scatalog.toLowerCase();
                        break;
                    }
                }
            }
            selectText="";
        if(sessionStorage.selectText){
            sel_str=sessionStorage.selectText.split(";");
        }else{
            sel_str=[];
        }
        let sel_str_len=sel_str.length;
        //$("#display_type_chart").empty();
        var temp=document.getElementById("display_type_chart");
        allconfigs=JSON.parse(localStorage.Config);
        if(allconfigs){
            for(var ac in allconfigs){//如果有，读取其所有配置项
                //if(allconfigs[ac].type.toLowerCase()==scatalog){
                scatalog=allconfigs[ac].name;
                var s_des=allconfigs[ac].details;//如果有，读取其所有配置项
                for(var p in s_des){
                    for(var i=0;i<temp.children.length;i++){//0721 edit 判断是否存在配置项，如果存在则跳过继续，不存在则添加;
                        if((temp.children[i].children[0].children[0].value.toLowerCase()==s_des[p].name.toLowerCase())
                            &&(temp.children[i].children[0].children[1].innerText==scatalog+concat_str+s_des[p].desc)
                            &&(temp.children[i].children[0].children[0].getAttribute("folder")==s_des[p].folder)){
                            isfound=true;
                            break;
                        }
                    }
                    if(isfound){
                        isfound=false;
                        for(var j=0;j<sel_str_len;j++){
                            if(temp.children[i].children[0].children[1].innerText==sel_str[j]){
                                temp.children[i].children[0].checked=true;
                                sel_str[j].setAttribute("data-is-select",true);
                                break;
                            }
                        }
                        continue;
                    }//0721 edit/**/
                    var li=document.createElement("li");
                    li.setAttribute("style","display:inline-block");
                    var lab=document.createElement("label");
                    //lab.setAttribute("style","margin-left:20px")
                    var ainput=document.createElement("input");
                    ainput.setAttribute("type","checkbox");
                    ainput.setAttribute("name","checkbox");
                    ainput.setAttribute("value",s_des[p].name);
                    ainput.setAttribute("folder",s_des[p].folder);
                    ainput.className="check_box";
                    var spn=document.createElement("span");
                    spn.innerHTML=scatalog+concat_str+s_des[p].desc;
                    for(var j=0;j<sel_str.length;j++){
                        if(sel_str[j]==scatalog+concat_str+s_des[p].desc){
                            ainput.setAttribute("checked",true);
                            //ainput.setAttribute("data-is-select",true);
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
            //}
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
        $("#select_text_chart").val(selectText);
        //document.getElementById("select_text_chart").value=selectText;
        showchartview(sel_str);
        }catch(err){
            showstateinfo(err.message,"chart/appenddisplaytype");
        }
    }
    //对比按钮
    function oneChoice(){
        try{
        stoptimer(timer);
        var obj = window.parent.$("#tree_chi").treeview("getSelected");
        $('#comprate-tbody').empty();
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
                            catalog=allobj[j].getAttribute("folder");//getcatalog(cname);
                            pt++;
                            gethistorybysensors(check_val,catalog,cname,pt,sel_str[i]);
                            break;
                        }
                    }
                }
            }else{
                if(allobj.length>0){//是否有类别分组内容配置项
                    showmsg("请选择要显示的类别分组内容!",info_showtime);
                    showstateinfo("请选择要显示的类别分组内容");
                }else{//没有配置项，传递空串，返回所有//20200520 add this function,need Verification; 
                    gethistorybysensors(check_val,"","",1,"");
                }
            }
        }else{
            //parent.dialog.html("请选择要对比的测量点名称!");//,info_showtime);
            //parent.dialog.dialog('open');
            showmsg("请选择要对比的测量点名称!")
            showstateinfo("请选择要对比的测量点名称!");
        }
        }catch(err){
            showstateinfo(err.message,"chart/buttonclick");
        }
    }
    //获取历史数据   
    function gethistorybysensors(arr_sensors,folder,aname,apt,atitle){
        /*var apara=new Object();
        apara.folder=folder;
        apara.name=aname;
        apara.from=kssj;
        apara.to=jssj;
        apara[""]=arr_sensors;
        window.parent.wssend("GetHistoriesBySensors",apara);*/
        sendorder("GetHistoriesBySensors?folder="+folder+"&name="+aname+"&from="+kssj+"&to="+jssj,function(data){
            if (data!= null) {//Result.
                if (!jQuery.isEmptyObject(data.datas)) {
                    //showstateinfo("");
                    decodedatas( data.datas,apt,atitle,aname);
                } else {
                    //showmsg("没有符合条件的 “"+atitle+"” 记录");
                    showstateinfo("没有符合条件的 "+atitle+" 记录");
                    decodedatas([],apt,atitle,aname);//
                }
            } else {
                decodedatas([],apt,atitle,aname);//
                //showmsg("没有符合条件的 “"+atitle+"” 记录",info_showtime);
                showstateinfo("没有符合条件的 "+atitle+" 记录");
            }
        },arr_sensors);/**/
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
    //var selected_val=$(this).val();//当次勾选的实际值
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
    ch1=document.getElementById("chart1");
    ch2=document.getElementById("chart2");
    ch3=document.getElementById("chart3");
    ch4=document.getElementById("chart4");
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
function decodedatas(obj_chartdatas,apt,atitle,aname) {
    try{
	var jiange="";
	var pa = [],pb = [],pc = [];
	var maxvalue=-1,minvalue=-1,maxval=-1,minval=-1;//avgvalue=0,ps=0,count=1,
	var lengenddata = [];
	var obj_chartdata=[];
	var seriess=[];
	var step=false;
	var myChart = echarts.init(document.getElementById('chart'+apt));
	myChart.clear();
    var tbody=document.getElementById("comprate-tbody");
    if(check_val.length>0){
        var title_tr=document.createElement("tr");
        var title_th=document.createElement("th");
        //title_tr.appendChild(title_th);
        //title_th=document.createElement("th");
        title_th.setAttribute('colspan','8');//setAttribute('colspan','4')"
        //title_th.setAttribute('style','text-align: center');
        title_th.innerHTML=atitle;
        title_tr.appendChild(title_th);
        tbody.appendChild(title_tr);
        /*let atr=creatTr();
        atr.cells[1].innerHTML="测量时间";
        for(i=0;i<check_name.length;i++){
            atr.cells[i+2].innerHTML=check_name[i];
        }
        tbody.appendChild(atr);*/
        for(var i=0;i<check_val.length;i++){
            var sensorid=check_val[i];
            var series=new Object();
            series.name=check_name[i];//+"["+sensorid+"]"
            eval("cld"+(i+1)).innerHTML=series.name;
            lengenddata.push(check_name[i]);//+"["+sensorid+"]"
            if(obj_chartdatas.length>0){
                obj_chartdata=obj_chartdatas;//[sensorid];
                if(obj_chartdata){
                    pb= new Array();
                    if(isNaN(parseFloat(obj_chartdata[0].value))){
                        obj_chartdata[0].value=-1;
                    }
                    maxvalue=minvalue=parseFloat(obj_chartdata[0].value);
                    for (var j = 0; j <obj_chartdata.length; j++) {
                        if(obj_chartdata[j].sensorId==sensorid){
                            let obj_data_j=obj_chartdata[j];
                            let name=atitle;//obj_data_j.name.toLowerCase();
                            if(isNaN(parseFloat(obj_data_j.value))){
                                obj_data_j.value=-1;
                            }
                            pb.push([Date.parse(obj_data_j.time),parseFloat((obj_data_j.value*1).toFixed(Number_of_decimal)), j]);
                            
                            if(parseFloat(obj_data_j.value)>maxvalue){
                                maxvalue=parseFloat(obj_data_j.value);
                            }
                            if(parseFloat(obj_data_j.value)<minvalue){
                                minvalue=parseFloat(obj_data_j.value);
                            }
                            if(i===0){
                                atr=creatTr();
                                atr.cells[0].innerHTML=atitle;//obj_data_j.name.toLowerCase();
                                atr.cells[1].innerHTML=dateToString(obj_data_j.time,2);//.replace(/T/g," ").substring(0,19);
                                atr.cells[2].innerHTML=(obj_data_j.value*1).toFixed(Number_of_decimal);
                                tbody.appendChild(atr);
                            }else{
                                let rows=tbody.rows;
                                let rows_len=rows.length;
                                for(k=0;k<rows_len;k++){
                                    let tname=rows[k].cells[0].outerText;
                                    if(tname==name && rows[k].cells[1]){
                                        let jiange=GetDateDiff(rows[k].cells[1].outerText,obj_data_j.time.replace(/T/g," ").substring(0,19),"minute");
                                        if(jiange<-1*min_timeInterval){
                                            atr=creatTr();
                                            atr.cells[0].innerHTML=atitle;//obj_data_j.name.toLowerCase();
                                            atr.cells[1].innerHTML=dateToString(obj_data_j.time,2);//.replace(/T/g," ").substring(0,19);
                                            atr.cells[i+2].innerHTML=(obj_data_j.value*1).toFixed(Number_of_decimal);
                                            tbody.insertBefore(atr,rows[k]);
                                            break;
                                        }else if(jiange<max_timeInterval){
                                            if((rows[k].cells[i+2].innerHTML!="")&&(rows[k].cells[i+2].innerHTML!=(obj_data_j.value*1).toFixed(Number_of_decimal))){
                                                continue;   
                                            }else{
                                                rows[k].cells[i+2].innerHTML=(obj_data_j.value*1).toFixed(Number_of_decimal);
                                            }
                                            break;
                                        } /*else if(jiange>2 && jiange<=max_timeInterval){
                                            atr=creatTr();
                                            atr.cells[0].innerHTML=obj_data_j.name.toLowerCase();
                                            atr.cells[1].innerHTML=dateToString(obj_data_j.time,2);//.replace(/T/g," ").substring(0,19);
                                            atr.cells[i+2].innerHTML=(obj_data_j.value*1).toFixed(Number_of_decimal);
                                            tbody.insertBefore(atr,rows[k+1]);
                                            break;
                                        }*/else{
                                            continue;
                                        }
                                    }else{
                                        continue;
                                    }
                                }
                                if(k>=rows_len){
                                    atr=creatTr();
                                    atr.cells[0].innerHTML=atitle;//obj_data_j.name.toLowerCase();
                                    atr.cells[1].innerHTML=dateToString(obj_data_j.time,2);
                                    atr.cells[i+2].innerHTML=(obj_data_j.value*1).toFixed(Number_of_decimal);
                                    tbody.appendChild(atr);
                                }
                            }
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
            }	
            series.type='line';
            series.step= step;
            series.showAllSymbol=true;
            series.symbolSize= 1;
            series.data= pb;
            series.smooth=true;
            series.smoothMonotone='x',
            //series.itemStyle= {normal: {areaStyle: {type: 'default'}}}; //线下区域 
            seriess.push(series);
        }
	}
	if(maxval==minval){
        maxval=1.5*maxval;
        minval=minval/2;
    }else if(maxval-minval<=1){
        var disvalue=(maxval-minval);
        maxval=(maxval*1+disvalue).toFixed(Number_of_decimal);
        minval=(minval*1-disvalue).toFixed(Number_of_decimal);
    }else{
        var disvalue=(maxval-minval);
        maxval=(maxval*1+disvalue*0.2).toFixed(Number_of_decimal);
        minval=(minval*1-disvalue*0.2).toFixed(Number_of_decimal);
    }
	drawchart();
	//绘制图形线条
	function drawchart() {
		//var myChart = echarts.init(document.getElementById('main'));
		var option = {
			color: ['#ff6c00', '#FF0000','#228B22',"#9400D3","#00BFFF","#3B30f2"],//,"#20B2AA","#0000CD"," #FF4500 "
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
						show: false,
					},
					dataView: {
                        show: true,
                        readOnly: false,
                        optionToContent: function (opt) {
                            /*//let axisData = opt.xAxis[0].data; //坐标数据
                            let table= '<table border="1" ><tbody>';
                            let tbody=$("#comprate-tbody").clone();
                            let rl=tbody[0].rows.length;yi
                            tbody[0].rows[0].cells[0].setAttribute("style","display:none");
                            if(!aname)//避免aname为空时造成函数操作错误。
                                aname="";
                            for(let i=2;i<rl;i++){
                                if(tbody[0].rows[i].cells[0].outerText!=aname.toLowerCase()){//屏蔽掉其他类型的数据，因为tbody是克隆的所有查询的数据列表.
                                    tbody[0].rows[i].setAttribute("style","display:none"); Iran Korea Sweden Canada New sealand
                                }
                            } 
                            table += tbody[0].innerHTML+'</tbody></table>';
                            return table;*/
                            var series = opt.series; //折线图数据
                            var tdHeads = '<td  >时间</td>'; //表头
                            var tdBodys = document.createElement('tbody'); //数据
                            series.forEach(function (item) {
                                //组装表头
                                tdHeads += '<td >'+item.name+'</td>';
                            });
                            var table ='<table border="1" style="text-align:center" ><tbody><tr>'+tdHeads+'</tr>';
                            for (var j = 0; j < series.length; j++) {
                                for (var i = 0, l = series[j].data.length; i < l; i++) {
                                    //组装表数据
                                    if(j==0){
                                        atr=creatTr();
                                        atr.cells[1].innerHTML=dateToString((series[j].data[i][0]),2);
                                        atr.cells[j+2].innerHTML=series[j].data[i][1].toFixed(Number_of_decimal);
                                        tdBodys.appendChild(atr);
                                    }else{
                                        var rows=tdBodys.rows;
                                        var len=rows.length;
                                        if(len!=0){
                                            for(var k=0;k<len;k++){
                                                var jiange=GetDateDiff(rows[k].cells[1].outerText,dateToString((series[j].data[i][0]),2),"minute");
                                                if(jiange<=-1*min_timeInterval){
                                                    atr=creatTr();
                                                    atr.cells[1].innerHTML=dateToString((series[j].data[i][0]),2);
                                                    atr.cells[j+2].innerHTML=series[j].data[i][1].toFixed(Number_of_decimal);
                                                    tdBodys.insertBefore(atr,rows[k]);
                                                    break;
                                                }else if(jiange<max_timeInterval){
                                                    if((rows[k].cells[j+2].innerHTML!=" ")&&(rows[k].cells[j+2].innerHTML!=series[j].data[i][1])){
                                                        continue;
                                                        atr=creatTr();
                                                        atr.cells[1].innerHTML=dateToString((series[j].data[i][0]),2);
                                                        atr.cells[j+2].innerHTML=series[j].data[i][1];
                                                        tdBodys.insertBefore(atr,rows[k+1]);
                                                    }else{
                                                        rows[k].cells[j+2].innerHTML=series[j].data[i][1].toFixed(Number_of_decimal);
                                                    }
                                                    break;
                                                }
                                            }
                                            if(k>=len){
                                                atr=creatTr();
                                                atr.cells[1].innerHTML=dateToString((series[j].data[i][0]),2);
                                                atr.cells[j+2].innerHTML=series[j].data[i][1].toFixed(Number_of_decimal);
                                                tdBodys.insertBefore(atr,rows[k]);
                                            }
                                        }else{
                                            atr=creatTr();
                                            atr.cells[1].innerHTML=dateToString((series[j].data[i][0]),2);
                                            atr.cells[j+2].innerHTML=series[j].data[i][1].toFixed(Number_of_decimal);
                                            tdBodys.insertBefore(atr,rows[k]);
                                        }
                                    }
                                }
                            }
                            table += tdBodys.innerHTML+'</tbody></table>';
                            return table;//
                        }
                    },
					magicType: {
						show: true,
						type: ['line'],
					},
					//, 'bar', 'stack', 'tiled'
					restore: {
						show: true,
					},
					saveAsImage: {
						show: true,
					},
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
				y2: 80,
			},
			xAxis: [{//x轴
				type: 'time',
				splitNumber: 10,
				axisLine: {
					lineStyle: {
						color: 'black',
						width: 2,
					},
					onZero:false,
				},
			}],
			yAxis: [{//Y轴
				type: 'value',
				axisLine: {
					lineStyle: {
						color: 'black',
						width: 2,
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
    }catch(err){
        showstateinfo(err.message,"chart/decodedatas");
    }
}
//创建新的报表数据行（所选类型总和在多两列（数据类型（隐藏用于区分数据分组的项）和时间）
function creatTr(){
    let atr=document.createElement("tr");
    for(var i=0;i<=check_val.length+1;i++){
        let atd=document.createElement("td");
        atd.innerHTML= " ";
        if(i===0)
            atd.setAttribute("style",'display:none');
        atr.appendChild(atd);
    }
    return atr;
}
/**
 * 对比配置项根据标签进行动态添加以及去除重复项功能，页面根据对比项目自动进行动态调整显示图形视窗的功能，
	编写树形菜单的双击响应程序（采用选中与释放之间的时间作为标准进行判断，小于一定时间视为双击，视频预览添加通道双击打开再次双击关闭功能
	0727添加显示控制配置项的页面记忆功能，在节点不变的情况下，切换页面时记忆上次的选择项并显示响应的图表视图。
	按钮样式
    1126 去掉二次菜单,多选的对比项在退出或关闭后清除选项。
    20201203 修改在没有数据返回时（返回为空或没有返回时）图形区域的显示已经对应标签的图例显示。 refridgerator 
    多选后提示，消除按钮的闪烁提醒。
    在没有选中参加对比的标签时的提示框自定义jQuery提示框形式，添加底色和动画效果.
    修改数据报表格式和方法。
    修改图形数据视图格式，去掉多余数据只显示本类型数据,其他列没有数据名称的问题，数据视图不显示。
    图形的数据视图列表的数据项有时放置位置不正确的问题；优化程序性能，用变量取代数组索引。
    类别分组刷新和点击显示提示错误
    类别分组的名称添加type指示以及修改加载模式，多选框有单列改为多列；图形极值差别很小时的上下极值设置；app 类别初始化，趋势对比图表的名称传递，搜索
    告警页的时间类型位置调整，在类别较多时显示完整
    非数字的项目取值（第二个数之后的错误）
 */
var arr_smokedetectors=[];
for(let i=0;i<3;i++){
    var obj_light=new Object();
    obj_light.id="smokedetectors"+i;
    obj_light.name=i+"# 设备";
    obj_light.state="正常";
    //obj_light.info="正常关闭"
    obj_light.class="normal";//"unenabled";
    obj_light.filename="res/on.png";
    arr_smokedetectors.push(obj_light);
}
var v_smokedetectors=new Vue({
    el:'#smoken_tbody',
    data:{
        smokedetectors:arr_smokedetectors,
    }
});
//改变状态，使用时需向服务器发送命令，成功返回后页面更改状态指示
function smoking_changestated(obj,eId){
    var em=document.getElementById("sf_"+eId);
    if(obj.src.indexOf("res/on.png")>=0){
        obj.src="res/off.png";
        if(em!=null){
            em.className="unenabled";
            em.innerHTML="关闭";
        }
    }else{
        obj.src="res/on.png";
        if(em!=null){
            em.className="normal";
            em.innerHTML="正常";
        }
    }
}
//复位，使用时需向服务器发送复位命令，返回状态后修改显示内容。
function smoking_reset(eId){
    var reset=document.getElementById("sf_"+eId);
    if(reset.innerHTML=="正常"){
        reset.innerHTML="告警";
        reset.className="unnormal";
    }else if(reset.innerHTML=="告警"){
        reset.innerHTML="正常";
        reset.className="normal";
    }
}/**
*/
//创建信息的遥控状态行（变化、名称、指示状态、运行状态、复位按钮、更多按钮。
/**
*/
/*function createline(id,name,state){
    var filename="'res/on.png'";
    var ediv=document.createElement("tr");
    ediv.className="bg";
    var epid=document.createElement("td");
    epid.className="lable";
    epid.innerHTML=id;
    ediv.appendChild(epid);
    var epname=document.createElement("td");
    epname.className="lable";
    epname.setAttribute("id","name_"+id);
    epname.innerHTML=name;//trav
    ediv.appendChild(epname);
    var epstate=document.createElement("td");
    if(state=="正常"){
        epstate.className="normal";
        filename="'res/on.png'"
    }else if(state=="告警"){
        epstate.className="unnormal";
        filename="'res/on.png'"
    }else if(state=="关闭"){
        epstate.className="unenabled";
        filename="'res/off.png'"
    }
    epstate.setAttribute("id","sf_"+id);
    epstate.innerHTML=state;
    ediv.appendChild(epstate);
    var eprun=document.createElement("td");
    eprun.className="set";
    eprun.innerHTML="<img src="+filename+" style='height:30px;vertical-align: middle;' onclick=\"smoking_changestated(this,'"+id+"')\"/>";
    ediv.appendChild(eprun);
    var epset=document.createElement("td");
    epset.className="set";
    epset.innerHTML="<button onclick=\"smoking_reset('"+id+"')\">设置/复位</button>"
    ediv.appendChild(epset);
    var epother=document.createElement("td");
    epother.className="set";
    //epother.innerHTML="<button onclick=\"smoking_other(this,'"+id+"')\">更多<b class='caret'></b></button>";
    epother.setAttribute('onclick', 'smoken_modal_details(this,"' + id + '")');
    //epother.setAttribute('backgroundColor', '#ffffff');
    epother.innerHTML = '<button data-toggle="modal" data-target="#guard_modal">更多<b class="caret"></b></button>';//采用模态对话框形式
    ediv.appendChild(epother);
    return ediv;
}
document.getElementById("smoken_tbody").appendChild(createline("smoking0103","name1","告警"));*/
//浮动窗口，某个遥控装置的详细信息
function smoking_other(obj,eid){
    document.getElementById("smoking_fudong").style.left=(obj.parentElement.parentElement.offsetParent.offsetLeft+obj.parentElement.parentElement.offsetWidth)+"px";
    document.getElementById("smoking_fudong").style.top=(obj.offsetParent.offsetParent.offsetTop+obj.offsetParent.offsetTop)+"px";
    document.getElementById("smoking_fudong").style.display="block";
    document.getElementById("smoking_bind_name").innerHTML= document.getElementById("name_"+eid).innerHTML;
    document.getElementById("smoking_bind_addr").innerHTML="1#控制柜";//运行时为实际安装地址
    document.getElementById("smoking_bind_view").innerHTML="abcefj";//详细信息
}
//关闭浮动信息框。
function smoking_hideself(obj){
    if((obj==null)||(typeof(obj)=="undefined")){
        obj=document.getElementById("smoking_fudong");
    }
    obj.style.display="none"
}
//更多信息
function smoken_modal_details(obj,eid){
    document.getElementById("modal_name").innerHTML= document.getElementById("name_"+eid).innerHTML;
    /*var detail=document.getElementById("modal_details");
    while(detail.hasChildNodes()) //当div下还存在子节点时 循环继续 卤
    { 
        detail.removeChild(detail.firstChild); 
    }
    for(var j=0;j<5;j++){
        var row=document.createElement("tr");
        //row.setAttribute("style","width:200px;text-align:left");
        var lableft=document.createElement("td");
        lableft.setAttribute("style","width:150px;text-align:left");
        lableft.innerHTML=[j]+" : ";
        row.appendChild(lableft);
        var labright=document.createElement("td");
        labright.setAttribute("style","width:150px;text-align:left");
        labright.innerHTML=[j]+"";
        row.appendChild(labright);
        detail.appendChild(row);
    }*/
    info_detail={};
    info_detail.名称=document.getElementById("name_"+eid).innerHTML;;
    info_detail.地点="smokedector02";
    info_detail.时间="smokedector03";
     if(v_infodetail){
        v_infodetail.info_details=info_detail;
        v_infodetail.update(1);
        /*document.getElementById("ul_detail").parentNode.removeChild(document.getElementById("ul_detail"))//删除实例本身 
        v_infodetail.destroy();
        document.getElementById("modal_details").appendChild(div_temp);//添加组件模板
        v_infodetail=null;
    }
    {
        v_infodetail=new Vue({
            el:"#modal_details",
            components:{
                extable:{template:'<ul id="ul_detail">\
                    <li v-for="(detail, key ,index) in info_details">{{index}}-{{key}}-{{detail}}</li>\
                </ul>',
                data:function(){
                    return {info_details:info_detail};
                },
                methods:{
                    destroy() {
                    //this.istempshow=false;
                    this.$destroy();
                    },
                },
                },
            },   
            /*data:{
                info_details:info_detail,
            }
            methods:{destroy() {
                //this.istempshow=false;
                this.$destroy();
                }
            },
        });*/
        
    } 
}
//改变状态，使用时需向服务器发送命令，成功返回后页面更改状态指示
function smoking_changestated(obj,eId){
    var em=document.getElementById("sf_"+eId);
    if(obj.src.indexOf("res/on.png")>=0){
        obj.src="res/off.png";
        if(em!=null){
            em.setAttribute("class","unenabled")
            em.innerHTML="关闭";
        }
    }else{
        obj.src="res/on.png";
        if(em!=null){
            em.setAttribute("class","normal");
            em.innerHTML="正常";
        }
    }
}
//复位，使用时需向服务器发送复位命令，返回状态后修改显示内容。
function smoking_reset(eId){
    var reset=document.getElementById("sf_"+eId);
    if(reset.innerHTML=="正常"){
        reset.innerHTML="告警";
        reset.setAttribute("class","unnormal")
    }else if(reset.innerHTML=="告警"){
        reset.innerHTML="正常";
        reset.setAttribute("class","normal");
    }
}/**
*/
//创建信息的遥控状态行（变化、名称、指示状态、运行状态、复位按钮、更多按钮。
/**travel trip tour journey outing voyage what who which when how where how long how many how much how far whose why whom 
*/
function createline(id,name,state){
    var filename="'res/on.png'";
    var ediv=document.createElement("div");
    ediv.setAttribute("class","bg");
    var epid=document.createElement("p");
    epid.setAttribute("class","lable");
    epid.innerHTML=id;
    ediv.appendChild(epid);
    var epname=document.createElement("p");
    epname.setAttribute("class","lable");
    epname.setAttribute("id","name_"+id);
    epname.innerHTML=name;trav
    ediv.appendChild(epname);
    var epstate=document.createElement("p");
    if(state=="正常"){
        epstate.setAttribute("class","normal");
        filename="'res/on.png'"
    }else if(state=="告警"){
        epstate.setAttribute("class","unnormal");
        filename="'res/on.png'"
    }else if(state=="关闭"){
        epstate.setAttribute("class","unenabled");
        filename="'res/off.png'"
    }
    epstate.setAttribute("id","sf_"+id);
    epstate.innerHTML=state;
    ediv.appendChild(epstate);
    var eprun=document.createElement("p");
    eprun.setAttribute("class","set");
    eprun.innerHTML="<img src="+filename+" style='height:30px;vertical-align: middle;' onclick=\"smoking_changestated(this,'"+id+"')\"/>";
    ediv.appendChild(eprun);
    var epset=document.createElement("p");
    epset.setAttribute("class","set");
    epset.innerHTML="<button onclick=\"smoking_reset('"+id+"')\">设置/复位</button>"
    ediv.appendChild(epset);
    var epother=document.createElement("p");
    epother.setAttribute("class","set");
    epother.innerHTML="<button onclick=\"smoking_other(this,'"+id+"')\">更多<b class='caret'></b></button>";
    ediv.appendChild(epother);
    return ediv;
}
document.getElementById("tab_smoken").appendChild(createline("smoking0103","name1","告警"));
//浮动窗口，某个遥控装置的详细信息
function smoking_other(obj,eid){
    document.getElementById("smoking_fudong").style.left=(obj.offsetLeft+obj.offsetWidth)+"px";
    document.getElementById("smoking_fudong").style.top=obj.offsetTop+"px";
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
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
function createline(id,name,state){
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
    epother.innerHTML="<button onclick=\"smoking_other(this,'"+id+"')\">更多<b class='caret'></b></button>";
    ediv.appendChild(epother);
    return ediv;
}
document.getElementById("smoken_tbody").appendChild(createline("smoking0103","name1","告警"));
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
function changestated(obj,eId){
    var em=document.getElementById(eId);
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
function reset(eId){
    var reset=document.getElementById(eId);
    if(reset.innerHTML=="正常"){
        reset.innerHTML="异常";
        reset.setAttribute("class","unnormal")
    }else if(reset.innerHTML=="异常"){
        reset.innerHTML="正常";
        reset.setAttribute("class","normal");
    }
}
function createline(id,name,state,run){
    var ediv=document.createElement("div");
    ediv.setAttribute("class","bg");
    var epid=document.createElement("p");
    epid.setAttribute("class","lable");
    epid.innerHTML=id;
    ediv.appendChild(epid);
    var epname=document.createElement("p");
    epname.setAttribute("class","lable");
    epname.innerHTML=name;
    ediv.appendChild(epname);
    var epstate=document.createElement("p");
    if(state=="正常"){
        epstate.setAttribute("class","normal");
    }else if(state=="异常"){
        epstate.setAttribute("class","unnormal");
    }else if(state=="关闭"){
        epstate.setAttribute("class","unenabled");
    }
    epstate.setAttribute("id","sf_"+id);
    epstate.innerHTML=state;
    ediv.appendChild(epstate);
    var eprun=document.createElement("p");
    eprun.setAttribute("class","set");
    if(run=="on"){
        eprun.innerHTML="<img src='res/on.png' style='height:30px;vertical-align: middle;' onclick=\"changestated(this,'"+epstate.id+"')\"/>";
    }
    ediv.appendChild(eprun);
    var epset=document.createElement("p");
    epset.setAttribute("class","set");
    epset.innerHTML="<button onclick=\"reset('"+epstate.id+"')\">设置/复位</button>"
    ediv.appendChild(epset);
    var epother=document.createElement("p");
    epother.setAttribute("class","set");
    epother.innerHTML="<button onclick=\"other()\">更多∨</button>";
    ediv.appendChild(epother);
    return ediv;
}
document.getElementById("main").appendChild(createline("flolddd1","name1","正常","on"));
function other(){}
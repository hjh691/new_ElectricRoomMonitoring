function changestated(obj,eId){
    var em=document.getElementById("sf_"+eId);
    if(obj.src.indexOf("res/close.png")>=0){
        obj.src="res/open.png";
        if(em!=null){
            em.setAttribute("class","normal")
            em.innerHTML="正常打开";
        }
    }else{
        obj.src="res/close.png";
        if(em!=null){
            em.setAttribute("class","normal");
            em.innerHTML="正常关闭";
        }
    }
}
/*function reset(eId){
    var reset=document.getElementById(eId);
    if(reset.innerHTML=="正常"){
        reset.innerHTML="异常";
        reset.setAttribute("class","unnormal")
    }else if(reset.innerHTML=="异常"){
        reset.innerHTML="正常";
        reset.setAttribute("class","normal");
    }
}*/
function createline(id,name,state,info){
    var filename="'res/close.png'";
    var ediv=document.createElement("div");
    ediv.setAttribute("class","bg");
    var epid=document.createElement("p");
    epid.setAttribute("class","lable");
    epid.setAttribute("id",id);
    epid.innerHTML=id;
    ediv.appendChild(epid);
    var epname=document.createElement("p");
    epname.setAttribute("class","lable");
    epname.setAttribute("id","name_"+id);
    epname.innerHTML=name;
    ediv.appendChild(epname);
    var epstate=document.createElement("p");
    if(state=="正常开启"){
        epstate.setAttribute("class","normal");
        filename="'res/open.png'";
    }else if(state=="正常关闭"){
        epstate.setAttribute("class","normal");
        filename="'res/close.png'";
    }else if(state=="告警"){
        epstate.setAttribute("class","unnormal");
        filename="'res/open.png'";
    }
    epstate.setAttribute("id","sf_"+id);
    epstate.innerHTML=state;
    ediv.appendChild(epstate);
    var epinfo=document.createElement("p");
    epinfo.setAttribute("class","lable");
    epinfo.setAttribute("id","info_"+id);
    epinfo.innerHTML=info
    ediv.appendChild(epinfo);
    var eprun=document.createElement("p");
    eprun.setAttribute("class","set");
    eprun.innerHTML="<img src="+filename+" style='height:30px;vertical-align: middle;' onclick=\"changestated(this,'"+id+"')\"/>";
    ediv.appendChild(eprun);
    var epother=document.createElement("p");
    epother.setAttribute("class","set");
    epother.innerHTML="<button onclick=\"other('"+id+"')\">更多∨</button>";
    ediv.appendChild(epother);
    return ediv;
}
document.getElementById("main").appendChild(createline("door3","name3","正常关闭","正常关闭"));
function other(eid){
    document.getElementById("fudong").style.display="block";
    document.getElementById("bind_name").innerHTML= document.getElementById("name_"+eid).innerHTML;
}
function hideself(obj){
    obj.style.display="none"
}
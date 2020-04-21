function guard_changestated(obj,eId){
    var em=document.getElementById("sf_"+eId);
    if(obj.src.indexOf("res/close.png")>=0){
        obj.src="res/open.png";
        if(em!=null){
            em.className="unenabled";
            em.innerHTML="关闭";
        }
        document.getElementById("info_"+eId).innerHTML="正常关闭";
    }else{
        obj.src="res/close.png";
        if(em!=null){
            em.className="normal";
            em.innerHTML="打开";
        }
        document.getElementById("info_"+eId).innerHTML="正常打开";
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
    ediv.className="bg";
    var epid=document.createElement("p");
    epid.className="lable";
    epid.setAttribute("id",id);
    epid.innerHTML=id;
    ediv.appendChild(epid);
    var epname=document.createElement("p");
    epname.className="lable";
    epname.setAttribute("id","name_"+id);
    epname.innerHTML=name;
    ediv.appendChild(epname);
    var epstate=document.createElement("p");
    if(state=="开启"){
        epstate.className="normal";
        filename="'res/open.png'";
    }else if(state=="关闭"){
        epstate.className="normal";
        filename="'res/close.png'";
    }else if(state=="告警"){
        epstate.className="unnormal";
        filename="'res/open.png'";
    }
    epstate.setAttribute("id","sf_"+id);
    epstate.innerHTML=state;
    ediv.appendChild(epstate);
    var epinfo=document.createElement("p");
    epinfo.className="lable";
    epinfo.setAttribute("id","info_"+id);
    epinfo.innerHTML=info
    ediv.appendChild(epinfo);
    var eprun=document.createElement("p");
    eprun.className="set";
    eprun.innerHTML="<img src="+filename+" style='height:30px;vertical-align: middle;' onclick=\"guard_changestated(this,'"+id+"')\" title='点击进行状态控制'/>";
    ediv.appendChild(eprun);
    var epother=document.createElement("p");
    epother.className="set";
    epother.innerHTML="<button onclick=\"guard_other(this,'"+id+"')\">更多<b class='caret'></b></button>";
    ediv.appendChild(epother);
    return ediv;
}
document.getElementById("tab_guard").appendChild(createline("door3","name3","关闭","正常关闭"));

function guard_other(obj,eid){
    document.getElementById("guard_fudong").style.left=(obj.offsetLeft+obj.offsetWidth)+"px";
    document.getElementById("guard_fudong").style.top=obj.offsetTop+"px";
    document.getElementById("guard_fudong").style.display="block";
    document.getElementById("guard_bind_name").innerHTML= document.getElementById("name_"+eid).innerHTML;
}
function guard_hideself(obj){
    obj.style.display="none"
}
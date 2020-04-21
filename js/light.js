function light_changestated(obj,eId){
    var em=document.getElementById("sf_"+eId);
    if(obj.src.indexOf("res/d3.png")>=0){
        obj.src="res/d9.png";
        if(em!=null){
            em.className="normal";
            em.innerHTML="点亮";
        }
        document.getElementById("info_"+eId).innerHTML="正常照明";
    }else{
        obj.src="res/d3.png";
        if(em!=null){
            em.className="unenabled";
            em.innerHTML="熄灭";
        }
        document.getElementById("info_"+eId).innerHTML="正常关闭";
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
    var filename="'res/d2.png'";
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
    if(state=="点亮"){
        epstate.className="normal";
        filename="'res/d9.png'";
    }else if(state=="熄灭"){
        epstate.className="unenabled";
        filename="'res/d3.png'";
    }else if(state=="故障"){
        epstate.className="unnormal";
        filename="'res/d2.png'";
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
    eprun.innerHTML="<img src="+filename+" style='height:30px;vertical-align: middle;' onclick=\"light_changestated(this,'"+id+"')\"/>";
    ediv.appendChild(eprun);
    var epother=document.createElement("p");
    epother.className="set";
    epother.innerHTML="<button onclick=\"light_other(this,'"+id+"')\">更多<b class='caret'></b></button>";
    ediv.appendChild(epother);
    return ediv;
}
for(var i=3;i<5;i++){
    document.getElementById("tab_light").appendChild(createline("l00"+i,"name"+i,"故障","无法点亮"));
}
function light_other(obj,eid){
    document.getElementById("light_fudong").style.left=(obj.offsetLeft+obj.offsetWidth)+"px";
    document.getElementById("light_fudong").style.top=obj.offsetTop+"px";
    document.getElementById("light_fudong").style.display="block";
    document.getElementById("light_bind_name").innerHTML= document.getElementById("name_"+eid).innerHTML;
}
function light_hideself(obj){
    obj.style.display="none"
}
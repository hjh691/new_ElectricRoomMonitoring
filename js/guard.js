function guard_changestated(obj,eId){
    var em=document.getElementById("sf_"+eId);
    if(obj.src.indexOf("res/close.png")>=0){
        obj.src="res/open.png";
        if(em!=null){
            em.className="unenabled";
            em.innerHTML="关门";
        }
        document.getElementById("info_"+eId).innerHTML="正常关闭";
    }else{
        obj.src="res/close.png";
        if(em!=null){
            em.className="normal";
            em.innerHTML="开门";
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
    var ediv=document.createElement("tr");
    ediv.className="bg";
    var epid=document.createElement("td");
    epid.className="lable";
    epid.setAttribute("id",id);
    epid.innerHTML=id;
    ediv.appendChild(epid);
    var epname=document.createElement("td");
    epname.className="lable";
    epname.setAttribute("id","name_"+id);
    epname.innerHTML=name;
    ediv.appendChild(epname);
    var epstate=document.createElement("td");
    if(state=="开门"){
        epstate.className="normal";
        filename="'res/open.png'";
    }else if(state=="关门"){
        epstate.className="normal";
        filename="'res/close.png'";
    }else if(state=="告警"){
        epstate.className="unnormal";
        filename="'res/open.png'";
    }
    epstate.setAttribute("id","sf_"+id);
    epstate.innerHTML=state;
    ediv.appendChild(epstate);
    var epinfo=document.createElement("td");
    epinfo.className="lable";
    epinfo.setAttribute("id","info_"+id);
    epinfo.innerHTML=info
    ediv.appendChild(epinfo);
    var eprun=document.createElement("td");
    eprun.className="set";
    eprun.innerHTML="<img src="+filename+" style='height:30px;vertical-align: middle;' onclick=\"guard_changestated(this,'"+id+"')\" title='点击进行状态控制'/>";
    ediv.appendChild(eprun);
    var epother=document.createElement("td");
    epother.className="set";
    //epother.innerHTML="<button onclick=\"guard_other(this,'"+id+"')\">更多<b class='caret'></b></button>";

    epother.setAttribute('onclick', 'guard_modal_details(this,"' + id + '")');
    //epother.setAttribute('backgroundColor', '#ffffff');
    epother.innerHTML = '<button data-toggle="modal" data-target="#guard_modal">更多<b class="caret"></b></button>';//采用模态对话框形式

    ediv.appendChild(epother);
    return ediv;
}
document.getElementById("guard_tbody").appendChild(createline("door3","name3","关门","正常关闭"));

function guard_other(obj,eid){
    document.getElementById("guard_fudong").style.left=(obj.parentElement.parentElement.offsetParent.offsetLeft+obj.parentElement.parentElement.offsetWidth)+"px";
    document.getElementById("guard_fudong").style.top=(obj.offsetParent.offsetParent.offsetTop+obj.offsetParent.offsetTop)+"px";
    document.getElementById("guard_fudong").style.display="block";
    document.getElementById("guard_bind_name").innerHTML= document.getElementById("name_"+eid).innerHTML;
}
function guard_modal_details(obj,eid){
    document.getElementById("modal_name").innerHTML= document.getElementById("name_"+eid).innerHTML;
    var detail=document.getElementById("modal_details");
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
    } 
}
function guard_hideself(obj){
    obj.style.display="none"
}
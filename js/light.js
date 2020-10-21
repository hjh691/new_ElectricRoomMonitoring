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
    var reset=document.getElementById(eId); //Petter john dinner lunch breakfast basketball football voliball tens tabletens
    if(reset.innerHTML=="正常"){
        reset.innerHTML="异常";
        reset.setAttribute("class","unnormal")
    }else if(reset.innerHTML=="异常"){//
        reset.innerHTML="正常";
        reset.setAttribute("class","normal");
    }
}*/
function createline(id,name,state,info){
    var filename="'res/d2.png'";
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
    var epinfo=document.createElement("td");
    epinfo.className="lable";
    epinfo.setAttribute("id","info_"+id);
    epinfo.innerHTML=info
    ediv.appendChild(epinfo);//introduce myself yourself herself himself ourselves life lives
    var eprun=document.createElement("td");
    eprun.className="set";
    eprun.innerHTML="<img src="+filename+" style='height:30px;vertical-align: middle;' onclick=\"light_changestated(this,'"+id+"')\"/>";
    ediv.appendChild(eprun);
    var epother=document.createElement("td");
    epother.className="set";
    //epother.innerHTML="<button onclick=\"light_other(this,'"+id+"')\">更多<b class='caret'></b></button>";
    epother.setAttribute('onclick', 'light_modal_details(this,"' + id + '")');
    //epother.setAttribute('backgroundColor', '#ffffff');
    epother.innerHTML = '<button data-toggle="modal" data-target="#guard_modal">更多<b class="caret"></b></button>';//采用模态对话框形式
    ediv.appendChild(epother);
    return ediv;
}
for(var i=3;i<5;i++){
    document.getElementById("light_tbody").appendChild(createline("l00"+i,"name"+i,"故障","无法点亮"));
}
function light_other(obj,eid){
    document.getElementById("light_fudong").style.left=(obj.parentElement.parentElement.offsetParent.offsetLeft+obj.parentElement.parentElement.offsetWidth)+"px";
    document.getElementById("light_fudong").style.top=(obj.offsetParent.offsetParent.offsetTop+obj.offsetParent.offsetTop)+"px";
    document.getElementById("light_fudong").style.display="block";
    document.getElementById("light_bind_name").innerHTML= document.getElementById("name_"+eid).innerHTML;
}
function light_hideself(obj){
    obj.style.display="none"
}
//更多信息
function light_modal_details(obj,eid){
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
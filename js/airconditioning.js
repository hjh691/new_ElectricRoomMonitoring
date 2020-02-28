//改变状态，使用时需向服务器发送命令，成功返回后页面更改状态指示
function changestated(obj,eId){
    document.getElementById(obj).innerHTML=eid;
}
//复位，使用时需向服务器发送复位命令，返回状态后修改显示内容。
function reset(eId){
    var obj=new Object();
    obj.t_set=60;
    obj.t_top=100;
    obj.t_bottom=-10;
    obj.s_set=50;
    obj.s_top=80;
    obj.s_bottom=5;
    obj.jrq1="正常";
    obj.jrq2="备用";
    obj.jsq="正常";
    obj.csq="待机";
    obj.fj="正常";
    obj.setjrq1="复位";
    obj.setjrq2="复位";
    obj.setjsq="恢复";
    obj.setcsq="正常";
    obj.setfj="设置";
    var name="state";
    for(var i=1;i<16;i++){
        obj[name+i]=i;
    }
    updataall(obj);
}
//创建信息的遥控状态行（变化、名称、指示状态、运行状态、复位按钮、更多按钮。
function updataall(obj){
    
    document.getElementById("t_set").innerHTML=obj.t_set;
    document.getElementById("t_top").innerHTML=obj.t_top;
    document.getElementById("t_bottom").innerHTML=obj.t_bottom;
    document.getElementById("s_set").innerHTML=obj.s_set;
    document.getElementById("s_top").innerHTML=obj.s_top;
    document.getElementById("s_bottom").innerHTML=obj.s_bottom;
    document.getElementById("jrq1").innerHTML=obj.jrq1;
    document.getElementById("jrq2").innerHTML=obj.jrq2;
    document.getElementById("jsq").innerHTML=obj.jsq;
    document.getElementById("csq").innerHTML=obj.csq;
    document.getElementById("fj").innerHTML=obj.fj;
    document.getElementById("setjrq1").innerHTML=obj.setjrq1;
    document.getElementById("setjrq2").innerHTML=obj.setjrq2;
    document.getElementById("setjsq").innerHTML=obj.setjsq;
    document.getElementById("setfj").innerHTML=obj.setfj;
    document.getElementById("state1").innerHTML=obj.state1;
    document.getElementById("state2").innerHTML=obj.state2;
    document.getElementById("state3").innerHTML=obj.state3;
    document.getElementById("state4").innerHTML=obj.state4;
    document.getElementById("state5").innerHTML=obj.state5;
    document.getElementById("state6").innerHTML=obj.state6;
    document.getElementById("state7").innerHTML=obj.state7;
    document.getElementById("state8").innerHTML=obj.state8;
    document.getElementById("state9").innerHTML=obj.state9;
    document.getElementById("state10").innerHTML=obj.state10;
    document.getElementById("state11").innerHTML=obj.state11;
    document.getElementById("state12").innerHTML=obj.state12;
    document.getElementById("state13").innerHTML=obj.state13;
    document.getElementById("state14").innerHTML=obj.state14;
    document.getElementById("state15").innerHTML=obj.state15;
}



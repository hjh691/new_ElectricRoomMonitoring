var t_set=document.getElementById("t_set");
var t_top=document.getElementById("t_top");
var t_bottom=document.getElementById("t_bottom");
var s_set=document.getElementById("s_set");
var s_top=document.getElementById("s_top");
var s_bottom=document.getElementById("s_bottom");
var jrq1=document.getElementById("jrq1");
var jrq2=document.getElementById("jrq2");
var jsq=document.getElementById("jsq");
var csq=document.getElementById("csq");
var fj=document.getElementById("fj");
var set_jrq1=document.getElementById("setjrq1");
var set_jrq2=document.getElementById("setjrq2");
var set_jsq=document.getElementById("setjsq");
var set_csq=document.getElementById("setcsq")
var set_fj=document.getElementById("setfj");
var state1=document.getElementById("state1");
var state2=document.getElementById("state2");
var state3=document.getElementById("state3");
var state4=document.getElementById("state4");
var state5=document.getElementById("state5");
var state6=document.getElementById("state6")
var state7=document.getElementById("state7");
var state8=document.getElementById("state8");
var state9=document.getElementById("state9");
var state10=document.getElementById("state10");
var state11=document.getElementById("state11");
var state12=document.getElementById("state12");
var state13=document.getElementById("state13");
var state14=document.getElementById("state14");
var state15=document.getElementById("state15");
init_airconditioning();
function init_airconditioning(){
    air_reset();
}

//改变状态，使用时需向服务器发送命令，成功返回后页面更改状态指示
function air_changestated(obj,eId){
    document.getElementById(obj).innerHTML=eid;
}
//复位，使用时需向服务器发送复位命令，返回状态后修改显示内容。
function air_reset(eId){
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
        obj[name+i]="正常";
    }
    updataall(obj);
}
//创建信息的遥控状态行（变化、名称、指示状态、运行状态、复位按钮、更多按钮。/**李子柒主流教育网红往后 */
function updataall(obj){
    t_set.innerHTML=obj.t_set;
    t_top.innerHTML=obj.t_top;
    t_bottom.innerHTML=obj.t_bottom;
    s_set.innerHTML=obj.s_set;
    s_top.innerHTML=obj.s_top;
    s_bottom.innerHTML=obj.s_bottom;
    jrq1.innerHTML=obj.jrq1;
    jrq2.innerHTML=obj.jrq2;
    jsq.innerHTML=obj.jsq;
    csq.innerHTML=obj.csq;
    fj.innerHTML=obj.fj;
    set_jrq1.text=obj.setjrq1;
    set_jrq2.text=obj.setjrq2;
    set_jsq.text=obj.setjsq;
    set_csq.text=obj.setcsq;
    set_fj.text=obj.setfj;
    state1.innerHTML=obj.state1;
    state2.innerHTML=obj.state2;
    state3.innerHTML=obj.state3;
    state4.innerHTML=obj.state4;
    state5.innerHTML=obj.state5;
    state6.innerHTML=obj.state6;
    state7.innerHTML=obj.state7;
    state8.innerHTML=obj.state8;
    state9.innerHTML=obj.state9;
    state10.innerHTML=obj.state10;
    state11.innerHTML=obj.state11;
    state12.innerHTML=obj.state12;
    state13.innerHTML=obj.state13;
    state14.innerHTML=obj.state14;
    state15.innerHTML=obj.state15;
}



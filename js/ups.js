var input_ua=document.getElementById("sd_a");
var input_ub=document.getElementById("sd_b");
var input_uc=document.getElementById("sd_c");
var input_f=document.getElementById("sd_pl");
var bat_state=document.getElementById("bat_state");
var bat_con=document.getElementById("bat_con");
var bat_u=document.getElementById("bat_val");
var bat_f=document.getElementById("bat_pl");
var pl_ua=document.getElementById("pl_a");
var pl_ub=document.getElementById("pl_b");
var pl_uc=document.getElementById("pl_c");
var pl_f=document.getElementById("pl_pl");
var output_ua=document.getElementById("dev_a");
var output_ub=document.getElementById("dev_b");
var output_uc=document.getElementById("dev_c");
var output_f=document.getElementById("dev_pl");
var ups_ua=document.getElementById("ups_a");
var ups_ub=document.getElementById("ups_b");
var ups_uc=document.getElementById("ups_c");
var ups_f=document.getElementById("ups_pl");
initups()
function initups(){
    input_ua.value="225.22";
    input_ub.value="220.22";
    input_uc.value="220.22";
    input_f.value="50";
    bat_state.value="正常";
    bat_con.value="220.22";
    bat_u.value="220.22";
    bat_f.value="0";
    pl_ua.value="220.22";
    pl_ub.value="220.22";
    pl_uc.value="220.22";
    pl_f.value="50";
    output_ua.value="220.22";
    output_ub.value="220.22";
    output_uc.value="220.22";
    output_f.value="50";
    ups_ua.value="220.22";
    ups_ub.value="220.22";
    ups_uc.value="220.22";
    ups_f.value="50";
    updata();
}
function creadiv(l,r,t){ //l是距左的距离,r是距顶的距离,t是要显示的文本内容
var dd=document.createElement("div");
    dd.style.position="absolute";
    dd.style.left=l+"%";
    dd.style.top=r+"%"
    dd.innerText=t;
    document.getElementById("div1").appendChild(dd);
}
function updata(){
    input_ua.value="222.22";
    input_ub.value="222.22";
    input_uc.value="222.22";
    input_f.value="50";
    bat_state.value="正常";
    bat_con.value="222.22";
    bat_u.value="222.22";
    bat_f.value="0";
    pl_ua.value="222.22";
    pl_ub.value="222.22";
    pl_uc.value="222.22";
    pl_f.value="50";
    output_ua.value="222.22";
    output_ub.value="222.22";
    output_uc.value="222.22";
    output_f.value="50";
    ups_ua.value="222.22";
    ups_ub.value="222.22";
    ups_uc.value="222.22";
    ups_f.value="50";
}
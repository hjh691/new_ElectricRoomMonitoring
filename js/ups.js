initups()
function initups(){
    
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
    var input_ua=document.getElementById("sd_a");
    input_ua.value="222.22";
    var input_ub=document.getElementById("sd_b");
    input_ub.value="222.22";
    var input_uc=document.getElementById("sd_c");
    input_uc.value="222.22";
    var input_f=document.getElementById("sd_pl");
    input_f.value="50";
    var bat_state=document.getElementById("bat_state");
    bat_state.value="222.22";
    var bat_con=document.getElementById("bat_con");
    bat_con.value="222.22";
    var bat_u=document.getElementById("bat_val");
    bat_u.value="222.22";
    var bat_f=document.getElementById("bat_pl");
    bat_f.value="0";
    var pl_ua=document.getElementById("pl_a");
    pl_ua.value="222.22";
    var pl_ub=document.getElementById("pl_b")
    pl_ub.value="222.22";
    var pl_uc=document.getElementById("pl_c");
    pl_uc.value="222.22";
    var pl_f=document.getElementById("pl_pl");
    pl_f.value="50";
    var output_ua=document.getElementById("dev_a");
    output_ua.value="222.22";
    var output_ub=document.getElementById("dev_b");
    output_ub.value="222.22";
    var output_uc=document.getElementById("dev_c");
    output_uc.value="222.22";
    var output_f=document.getElementById("dev_pl");
    output_f.value="50";
    var ups_ua=document.getElementById("ups_a");
    ups_ua.value="222.22";
    var ups_ub=document.getElementById("ups_b");
    ups_ub.value="222.22";
    var ups_uc=document.getElementById("ups_c");
    ups_uc.value="222.22";
    var ups_f=document.getElementById("ups_pl");
    ups_f.value="50";
}
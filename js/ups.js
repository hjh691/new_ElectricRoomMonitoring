function creadiv(l,r,t){ //l是距左的距离,r是距顶的距离,t是要显示的文本内容
var dd=document.createElement("div");
    dd.style.position="absolute";
    dd.style.left=l+"%";
    dd.style.top=r+"%"
    dd.innerText=t;
    document.getElementById("div1").appendChild(dd);
}
function updata(){
    document.getElementById("sd_a").value="222.22";
    document.getElementById("sd_b").value="222.22";
    document.getElementById("sd_c").value="222.22";
    document.getElementById("sd_pl").value="50";
    document.getElementById("bat_state").value="222.22";
    document.getElementById("bat_con").value="222.22";
    document.getElementById("bat_val").value="222.22";
    document.getElementById("bat_pl").value="49.99";
    document.getElementById("pl_a").value="222.22";
    document.getElementById("pl_b").value="222.22";
    document.getElementById("pl_c").value="222.22";
    document.getElementById("pl_pl").value="50";
    document.getElementById("dev_a").value="222.22";
    document.getElementById("dev_b").value="222.22";
    document.getElementById("dev_c").value="222.22";
    document.getElementById("dev_pl").value="50";
    document.getElementById("ups_a").value="222.22";
    document.getElementById("ups_b").value="222.22";
    document.getElementById("ups_c").value="222.22";
    document.getElementById("ups_pl").value="50";
}
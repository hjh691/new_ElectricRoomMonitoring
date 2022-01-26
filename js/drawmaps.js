/**绘制各种图形图元函数；开始
	*/

const { fabric, fabric } = require("./fabric");

//解析图形参数：//简简单单、家家户户、兢兢业业、空空荡荡、空空洞洞、坎坎坷坷、快快乐乐磕磕碰碰客客气气口口声声扣扣索索哭哭啼啼坑坑洼洼开开心心
function ecodeparafrompfdp(pfdp){
	var paras={};
	paras.sx = parseFloat(pfdp.StartPoint.substring(0, pfdp.StartPoint.indexOf(",")));
	paras.sy = parseFloat(pfdp.StartPoint.substr(pfdp.StartPoint.indexOf(",") + 1));
	paras.ex = parseFloat(pfdp.EndPoint.substring(0, pfdp.EndPoint.indexOf(",")));
	paras.ey = parseFloat(pfdp.EndPoint.substring(pfdp.EndPoint.indexOf(",") + 1));
	paras.a=1;paras.b=0;paras.c=0;paras.d=1;paras.e=0;paras.f=0;
	if (pfdp.hasOwnProperty("_matrix")) {
		var pt = pfdp._matrix.indexOf(",");
		paras.a = parseFloat(pfdp._matrix.substring(0, pt));
		paras.b = parseFloat(pfdp._matrix.substring(pt + 1, (pt = pfdp._matrix.indexOf(",", pt + 1))));
		paras.c = parseFloat(pfdp._matrix.substring(pt + 1, (pt = pfdp._matrix.indexOf(",", pt + 1))));
		paras.d = parseFloat(pfdp._matrix.substring(pt + 1, (pt = pfdp._matrix.indexOf(",", pt + 1))));
		paras.e = parseFloat(pfdp._matrix.substring(pt + 1, (pt = pfdp._matrix.indexOf(",", pt + 1))));
		paras.f = parseFloat(pfdp._matrix.substr(pt + 1));
	}
	if (pfdp.hasOwnProperty("isError") && (pfdp.isError == "true")) {
		paras.strokeStyle = pfdp.ErrorColor.replace("#FF","#");
	} else {
		paras.strokeStyle = pfdp.StrokeColor.replace("#FF","#");
	}
	paras.lineWidth = parseInt(pfdp.StrokeThinkness);
	return paras;
}
//绘制母线;//搂搂抱抱拉拉扯扯唠唠叨叨来来回回来来去去踉踉跄跄来来去去老老实实零零散散零零碎碎懒懒散散啰啰嗦嗦来来往往里里外外陆陆续续林林总总扭扭捏捏
function Baseline(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with (paras){
		ctx.strokeStyle=strokeStyle;
		ctx.lineWidth=lineWidth;
		ctx.transform(a,b,c,d,e,f);
		
		var path=new Path2D();
		//path.beginPath();//期期艾艾清清白白清清楚楚凄凄惨惨嘁嘁喳喳起起伏伏奇奇怪怪前前后后勤勤恳恳起起落落亲亲热热轻轻松松确确实实清清爽爽切切实实
		path.moveTo(sx, sy);//千千万万卿卿我我曲曲折折齐齐整整热热闹闹日日年年柔柔弱弱日日夜夜认认真真随随便便时时处处世世代代神神叨叨顺顺当当双双对对
		path.lineTo(ex, ey);//舒舒服服是是非非四四方方时时刻刻松松垮垮顺顺利利三三两两丝丝拉拉神神秘秘生生世世山山水水生生死死松松散散琐琐碎碎酸酸甜甜
		ctx.stroke(path);//斯斯文文上上下下说说笑笑实实在在坦坦荡荡坛坛罐罐挑挑拣拣条条框框痛痛快快拖拖拉拉偷偷摸摸甜甜蜜蜜体体面面太太平平
		ctx.beginPath();//吞吞吐吐踏踏实实推推搡搡团团圆圆堂堂正正稳稳当当文文静静唯唯诺诺歪歪扭扭完完全全弯弯曲曲弯弯绕绕畏畏缩缩完完整整
		ctx.lineWidth=1;//修修补补许许多多絮絮叨叨星星点点羞羞答答嘻嘻哈哈辛辛苦苦淅淅沥沥稀稀拉拉稀稀落落寻寻觅觅熙熙攘攘形形色色潇潇洒洒
		if(pfdp.isselect)//选中时的颜色为红色，未选择为透明黑//飘飘忽忽漂漂亮亮破破烂烂婆婆妈妈乒乒乓乓普普通通跑跑跳跳平平稳稳平平整整
			ctx.strokeStyle="red"//虚虚实实悉悉索索原原本本摇摇摆摆郁郁葱葱影影绰绰郁郁苍苍摇摇晃晃晕晕乎乎庸庸碌碌严严实实洋洋洒洒隐隐约约犹犹豫豫
		else//永永远远祖祖辈辈皱皱巴巴指指点点咋咋呼呼战战兢兢真真假假真真切切整整齐齐扎扎实实子子孙孙支支吾吾左左右右遮遮掩掩真真正正吱吱呀呀
			ctx.strokeStyle="#00000000";
		ctx.rect(sx-1,sy-1,(ex-sx+2),(ey-sy+2));
		ctx.stroke();
		if(fcanvas){
			var fbaseline=new fabric.Line([sx,sy,ex,ey],{
				stroke:pfdp.StrokeColor.replace("#FF","#"),
				strokeWidth:parseInt(pfdp.StrokeThinkness),
				fill:pfdp.StrokeColor.replace("#FF","#"),
				hasControls:false,
				originY:"bottom",
			});
			fabric.util.addTransformToObject(fbaseline,[a,b,c,d,e,f]);
			fcanvas.add(fbaseline);
			return fbaseline;
		}
	}
}
//绘制线；//腻腻歪歪年年岁岁明明白白磨磨蹭蹭密密丛丛懵懵懂懂迷迷瞪瞪满满当当满满登登迷迷糊糊模模糊糊马马虎虎磨磨唧唧忙忙碌碌朦朦胧胧密密麻麻
function Line(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.transform(a, b, c, d, e, f);
		ctx.lineWidth=lineWidth;
		ctx.strokeStyle=strokeStyle;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
		ctx.beginPath();		
		ctx.lineWidth=1;
		if(pfdp.isselect)//选中时的颜色为红色，未选择为透明黑
			ctx.strokeStyle="red"
		else
			ctx.strokeStyle="#00000000";
		ctx.rect(sx-1,sy-1,(ex-sx+2),(ey-sy+2));
		ctx.stroke();
		if(fcanvas){
			//var str="f"+"line";//模模糊糊
			var fline=new fabric.Line([sx,sy,ex,ey],{
				strokeWidth: lineWidth, //线宽//陆陆续续、林林总总、明明白白、磨磨蹭蹭、满满当当、懵懵懂懂、迷迷瞪瞪、迷迷糊糊、马马虎虎
				stroke: strokeStyle, //线的颜色//哭哭啼啼、坑坑洼洼、开开心心、拉拉扯扯、唠唠叨叨、来来回回、来来去去、冷冷清清、踉踉跄跄、来来往往、里里外外
				hasControls:false,
				//scaleX:sessionStorage.scaler,//简简单单、家家户户、空空洞洞、空空荡荡、坎坎坷坷、快快乐乐、磕磕碰碰、客客气气、口口声声、扣扣索索
				originY:"bottom",
			})
			fabric.util.addTransformToObject(fline,[a,b,c,d,e,f]);
			fcanvas.add(fline);
			return fline;
			//fabric.util.removeTransformFromObject(fline,[a,b,c,d,e,f]);
		}
	}
}	
//绘制椭圆形区域//哼哼唧唧、轰轰烈烈、和和美美、和和睦睦、和和气气、晃晃悠悠、慌慌张张、结结巴巴、进进出出、
function EllipseArea(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.transform(a, b, c, d, e, f);
		ctx.lineWidth=lineWidth;
		ctx.strokeStyle=strokeStyle;
		var ox = parseFloat(sx) + parseFloat((ex - sx) / 2),
		oy = parseFloat(sy) + parseFloat((ey - sy) / 2);
		var lx = Math.abs(sx - ex) / 2;
		var ly = Math.abs(sy - ey) / 2;
		
		if (pfdp.IsFill == true) {
			ctx.fillStyle = pfdp.FillColor;
		}
		
		Ellipse(ctx, ox, oy, lx, ly);
		if (pfdp.IsFill == true) {
			ctx.fill();
		} else {
			ctx.stroke();
		}
		if(pfdp.isselect){//选中状态，红色轮廓，未选择则不圈轮廓//干干净净、沟沟坎坎、鬼鬼祟祟、高高兴兴、工工整整、昏昏沉沉、花花草草、浩浩荡荡
			ctx.strokeStyle="red";
			ctx.strokeRect(sx,sy,ex-sx,ey-sy);
		}
		if(fcanvas){
			var fellipsearea=new fabric.Ellipse({
				left:ox-lx,
				top:oy-ly,
				rx:lx,
				ry:ly,
				fill:pfdp.IsFill?pfdp.FillColor:"#0000",
				stroke:strokeStyle,
				strokeWidth:lineWidth,
			});
			fabric.util.addTransformToObject(fellipsearea,[a,b,c,d,e,f]);
			fcanvas.add(fellipsearea);
			return fellipsearea;
		}
	}
}
//自定义绘制椭圆，x,y 圆心坐标，a横轴半径，b是Y轴半径。//浑浑噩噩、健健康康、急急忙忙、结结实实、唧唧歪歪、兢兢业业、叽叽喳喳、磕磕绊绊、磕磕巴巴
function Ellipse(context, x, y, a, b) {
	context.save();
	var r = (a > b) ? a: b;
	var ratioX = a / r;
	var ratioY = b / r;
	context.scale(ratioX, ratioY);
	context.beginPath();
	context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
	context.closePath();
	context.restore();
	//context.fill();
}
//绘制矩形区域//的的确确、打打杀杀、断断续续、大大小小、跌跌撞撞、端端正正、缝缝补补、疯疯癫癫、风风光光、风风火火、分分合合、古古怪怪
function RectArea(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.strokeStyle=strokeStyle;
		ctx.lineWidth=lineWidth;
		if (pfdp.IsFill == true) {
			ctx.fillStyle = pfdp.FillColor;
		}
		ctx.transform(a,b,c,d,e,f);
		ctx.beginPath();
		if (pfdp.IsFill == true) {
			ctx.rect(sx, sy, parseFloat(ex) - parseFloat(sx), parseFloat(ey) - parseFloat(sy));
			ctx.fill();
		} else {
			ctx.rect(sx, sy, parseFloat(ex) - parseFloat(sx), parseFloat(ey) - parseFloat(sy));
			ctx.stroke();
		}
		if(pfdp.isselect){//选中状态，红色轮廓，未选择则不圈轮廓//颤颤巍巍、躲躲藏藏、点点滴滴、大大方方、嘀嘀咕咕、大大咧咧、打打闹闹、
			ctx.strokeStyle="red";
			ctx.stroke();
		}
		if(fcanvas){
			var frectarea=new fabric.Rect({
				left:sx,
				top:sy,
				width:parseFloat(ex) - parseFloat(sx),
				height:parseFloat(ey) - parseFloat(sy),
				stroke:strokeStyle,
				fill: pfdp.IsFill?pfdp.FillColor:"#00000000",
				strokeWidth:lineWidth,
				originX:"left",
				originY:"top",
				strokeDashoffset:lineWidth,
				hasControls:false,
			})
			fabric.util.addTransformToObject(frectarea,[a,b,c,d,e,f]);
			fcanvas.add(frectarea);
			return frectarea;
		}
	}
}
//绘制虚线（跳线）；//渺渺茫茫勉勉强强冒冒失失慢慢吞吞慢慢腾腾慢慢悠悠毛毛躁躁迷迷怔怔平平安安蓬蓬勃勃平平常常拼拼凑凑平平淡淡跑跑颠颠平平凡凡瓶瓶罐罐
function JumpLine(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.strokeStyle=strokeStyle;
		ctx.lineWidth=lineWidth;
		ctx.transform(a, b, c, d, e, f);
		
		ctx.beginPath();
		ctx.setLineDash([10, 15]);
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
		ctx.beginPath();
		ctx.lineWidth=1;
		if(pfdp.isselect)//选中时的颜色为红色，未选择为透明黑
			ctx.strokeStyle="red"
		else
			ctx.strokeStyle="#00000000"
		ctx.rect(sx-1,sy-1,(ex-sx+2),(ey-sy+2));
		ctx.stroke();
		if(fcanvas){
			var fjumpline=new fabric.Line([sx,sy,ex,ey],{
				stroke:strokeStyle,
				strokeWidth:lineWidth,
				hasControls:false,
				strokeDashArray:[10,15],
				originY:'bottom',
			});
			fabric.util.addTransformToObject(fjumpline,[a,b,c,d,e,f]);
			fcanvas.add(fjumpline);
			return fjumpline;
		}
	}
}
//画断路器反反复复、洋洋洒洒、严严实实、唯唯诺诺、歪歪扭扭、跌跌撞撞、端端正正、兜兜转转、高高兴兴、吞吞吐吐、拖拖拉拉、林林总总、支支吾吾
//轰轰烈烈、花花绿绿、千千万万、卿卿我我、风风光光、风风火火、方方面面、分分秒秒、缝缝补补、疯疯癫癫、服服帖帖、沸沸扬扬、风风雨雨、纷纷扬扬、
//方方正正、安安静静、本本分分、白白净净、边边角角、爸爸妈妈、别别扭扭、白白嫩嫩、白白胖胖、蹦蹦跳跳、病病歪歪、病病殃殃、彻彻底底、层层叠叠
//重重叠叠、吹吹打打、吃吃喝喝、出出进进、吵吵闹闹、匆匆忙忙、缠缠绵绵、吵吵嚷嚷、从从容容、
function Breaker(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.strokeStyle=strokeStyle;
		ctx.lineWidth=lineWidth;
		ctx.transform(a, b, c, d, e, f);
		
		var mx = parseFloat(sx) + parseFloat((ex - sx) / 2);
		var y1 = parseFloat(sy) + parseFloat((ey - sy) / 6);
		var y2 = parseFloat(ey) - (parseFloat(ey - sy) / 6);
		ctx.beginPath();
		ctx.moveTo(mx, sy);
		ctx.lineTo(mx, y1);
		ctx.moveTo(mx, y2);
		ctx.lineTo(mx, ey);
		
		if (pfdp.IsClosed == true) {
			ctx.fillStyle = "red";
		} else {
			ctx.fillStyle = "green";
		}
		ctx.stroke();
		ctx.strokeRect(sx, y1, parseFloat(ex) - parseFloat(sx), y2 - y1);
		ctx.rect(sx, y1, parseFloat(ex) - parseFloat(sx), y2 - y1);
		ctx.fill();
		if(pfdp.isselect){//选中状态，红色轮廓，未选择则不圈轮廓
			ctx.strokeStyle="red";
			ctx.stroke();
		}
		if(fcanvas){
			var offset=lineWidth/2
			var fpath=new fabric.Path('M '+(mx+offset)+' '+(sy)+' L'+' '+ (mx+offset)+' '+ (y1)+
			'  M '+ (mx+offset)+' '+ (y2)+' L '+ (mx+offset)+' '+ (ey),{
				fill: pfdp.StrokeColor.replace("#FF","#"),
				stroke:pfdp.StrokeColor.replace("#FF","#"),
				strokeWidth:parseInt(pfdp.StrokeThinkness),
			});
			var frect=new fabric.Rect({
				left:sx,
				top:y1, 
				width:parseFloat(ex) - parseFloat(sx),
				height: y2 - y1,
				fill:ctx.fillStyle,
				stroke:pfdp.StrokeColor.replace("#FF","#"),
				strokeWidth:parseInt(pfdp.StrokeThinkness),
			});
			var fgroup=new fabric.Group([fpath,frect],{
				hasControls:false,
			});
			fabric.util.addTransformToObject(fgroup,[a,b,c,d,e,f]);
			fcanvas.add(fgroup);
			return fgroup;
		}
	}
}
//画开关（隔离）
function Isolator(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.strokeStyle=strokeStyle;
		ctx.lineWidth=lineWidth;
		ctx.transform(a, b, c, d, e, f);
		var mleft = sx < ex ? sx: ex; //左侧坐标
		var mright = sx < ex ? ex: sx; //右侧坐标
		var mtop = sy < ey ? sy: ey; //顶端坐标
		var mbottom = sy < ey ? ey: sy; //底边坐标
		var r = (parseFloat(mright) - parseFloat(mleft)) * 3 / 20;
		var y1 = parseFloat(mtop) + parseFloat((parseFloat(mbottom) - parseFloat(mtop)) / 6);
		var y2 = parseFloat(mtop) + parseFloat((parseFloat(mbottom) - parseFloat(mtop)) / 4);
		var y3 = parseFloat(mbottom) - parseFloat((parseFloat(mbottom) - parseFloat(mtop)) / 6);
		var path=new Path2D();
		ctx.beginPath();
		path.moveTo(mleft, mtop);
		path.lineTo(mleft, parseFloat(y1) - parseFloat(r));
		path.arc(mleft, y1, r, 0, Math.PI * 2, false);
		path.moveTo(mleft, mbottom);
		path.lineTo(mleft, parseFloat(y3) + parseFloat(r));
		path.arc(mleft, y3, r, 0, Math.PI * 2, false);
		path.moveTo((parseFloat(mleft) + r), y3);
		path.closePath();
		var endpoit={};
		if (pfdp.IsClosed == true) {
			path.lineTo((parseFloat(mleft) + r), y1);
			endpoit.x=parseFloat(mleft)+r;
			endpoit.y=y1;
		} else {
			path.lineTo(mright, y2);
			endpoit.x=parseFloat(mright);
			endpoit.y=y2;
		}
		ctx.stroke(path);
		ctx.rect(sx,sy,(ex-sx),(ey-sy));
		if(pfdp.isselect){//选中状态，红色轮廓，未选择则不圈轮廓
			ctx.strokeStyle="red";
			ctx.stroke();
		}
		if(fcanvas){
			var offset=lineWidth/2
			var fisloterpath1=new fabric.Path('M '+(mleft+offset)+' '+mtop+' '+'L '+(mleft+offset)+' '+(parseFloat(y1) - parseFloat(r)),{
				stroke:pfdp.StrokeColor.replace("#FF","#"),
				strokeWidth:parseInt(pfdp.StrokeThinkness),
				fill:pfdp.StrokeColor.replace("#FF","#"),
				
			});
			var fisloterart1=new fabric.Circle({
				left:mleft-r,
				top:y1-r,
				radius:r,
				stroke:pfdp.StrokeColor.replace("#FF","#"),
				strokeWidth:parseInt(pfdp.StrokeThinkness),
			});
			var fisloterpath2=new fabric.Path('M '+(mleft+offset)+' '+mbottom+' '+'L '+(mleft+offset)+' '+(parseFloat(y3) - parseFloat(r)),{
				stroke:pfdp.StrokeColor.replace("#FF","#"),
				strokeWidth:parseInt(pfdp.StrokeThinkness),
				fill:pfdp.StrokeColor.replace("#FF","#"),
			});
			var fisloterart2=new fabric.Circle({
				left:mleft-r,
				top:y3-r,
				radius:r,
				stroke:pfdp.StrokeColor.replace("#FF","#"),
				strokeWidth:parseInt(pfdp.StrokeThinkness),
			});
			var fisloterpath3=new fabric.Path('M '+(mleft+offset*2)+' '+y3+' '+'L '+endpoit.x+' '+endpoit.y,{
				stroke:pfdp.StrokeColor.replace("#FF","#"),
				strokeWidth:parseInt(pfdp.StrokeThinkness),
				fill:pfdp.StrokeColor.replace("#FF","#"),
			});
			var fislotergroup=new fabric.Group([fisloterpath1,fisloterart1,fisloterpath2,fisloterart2,fisloterpath3],{
				hasControls:false,
			});
			fabric.util.addTransformToObject(fislotergroup,[a,b,c,d,e,f]);
			fcanvas.add(fislotergroup);
			return fislotergroup;
		}
	}
}
//画变压器
function Transformer(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.strokeStyle=strokeStyle;
		ctx.lineWidth=lineWidth;
		ctx.transform(a, b, c, d, e, f);
		var mleft = parseFloat(sx < ex ? sx: ex); //左侧坐标
		var mright = parseFloat(sx < ex ? ex: sx); //右侧坐标
		var mtop = parseFloat(sy < ey ? sy: ey); //顶端坐标
		var mbottom = parseFloat(sy < ey ? ey: sy); //底边坐标
		var r = (mright - mleft) / 2.0;
		var mx = mleft + r,
		r1 = mtop + r,
		r2 = mbottom - r;
		var x1 = mleft + ((mright) - (mleft)) / 3;
		var x2 = (mright) - ((mright) - (mleft)) / 3;
		var y11 = (mtop) + r / 2.0,
		y12 = (mtop) + r;
		var y21 = (mbottom) - r / 1 - r / 6,
		y23 = (mbottom) - r / 2,
		y22 = (y21 + y23) / 2 - r / 12;
		ctx.beginPath();
		ctx.arc(mx, r1, r, 0, Math.PI * 2, false);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(mx, y11);
		ctx.lineTo(x1, y12);
		ctx.lineTo(x2, y12);
		ctx.closePath();
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(x1, y21);
		ctx.lineTo(mx, y22);
		ctx.lineTo(x2, y21);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(mx, y22);
		ctx.lineTo(mx, y23);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(mx, r2, r, 0, Math.PI * 2, false);
		ctx.stroke();
		ctx.rect(sx,sy,(ex-sx),(ey-sy));
		if(pfdp.isselect){//选中状态，红色轮廓，未选择则不圈轮廓
			ctx.strokeStyle="red";
			ctx.strokeRect(mleft,mtop,mright-mleft,mbottom-mtop);
		}
		if(fcanvas){
			var fcircle1=new fabric.Circle({
				left: mx-r,
				top:r1-r,
				radius:r,
				fill:"#0000",
				stroke:strokeStyle,
				strokeWidth:lineWidth,
				hasControls:false,
			});
			var fcircle2=new fabric.Circle({
				left: mx-r,
				top:r2-r,
				radius:r,
				fill:"#0000",
				stroke:strokeStyle,
				strokeWidth:lineWidth,
				hasControls:false,
			});
			var fpath1=new fabric.Path('M '+mx+' '+y11+' L '+x1+' '+y12+' L '+x2+' '+y12+ ' z M '+
			x1+' '+y21+' L '+mx+' '+y22+' L '+x2+' '+y21+' M '+mx+' '+y22+' L '+mx+' '+y23,{
				stroke:strokeStyle,
				strokeWidth:lineWidth,
				hasControls:false,
			});
			var ftransformer=new fabric.Group([fcircle1,fcircle2,fpath1],{
				hasControls:false,
			});
			fabric.util.addTransformToObject(ftransformer,[a,b,c,d,e,f]);
			fcanvas.add(ftransformer);
			return ftransformer;
		}
	}
}
//画根节点
function RootNode(ctx, pfdp,fcanvas) {
	Node(ctx, pfdp,fcanvas);
}
//监视器
function Monitor(ctx, pfdp,fcanvas) {
	DrawText(ctx, pfdp,fcanvas);
}
//标题
function Title(ctx, pfdp,fcanvas) {
	DrawText(ctx, pfdp,fcanvas);
}
//画接地
function Ground(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.transform(a, b, c, d, e, f);
		ctx.strokeStyle =strokeStyle;
		ctx.lineWidth = lineWidth;
		var mleft = sx < ex ? sx: ex; //左侧坐标
		var mright = sx < ex ? ex: sx; //右侧坐标
		var mtop = sy < ey ? sy: ey; //顶端坐标
		var mbottom = sy < ey ? ey: sy; //底边坐标
		var mwidth = mright - mleft,
			mheight = mbottom - mtop;
		var mx = mleft + mwidth / 2.0,
			y1 = mbottom - mheight / 3.0,
			y2 = mbottom - mheight / 6.0;
		ctx.beginPath();
		ctx.moveTo(mx, mtop);
		ctx.lineTo(mx, y1);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(mleft, y1);
		ctx.lineTo(mright, y1);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(mleft + mwidth / 4.0, y2);
		ctx.lineTo(mright - mwidth / 4.0, y2);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(mleft + mwidth / 8.0 * 3, mbottom);
		ctx.lineTo(mright - mwidth / 8.0 * 3, mbottom);
		ctx.stroke();
		ctx.beginPath();
		ctx.lineWidth=1;
		if(pfdp.isselect)//选中时的颜色为红色，未选择为透明黑
			ctx.strokeStyle="red"
		else
			ctx.strokeStyle="#00000000";
		ctx.rect(mleft-3,mtop-3,(mright-mleft+6),(mbottom-mtop+6));
		ctx.stroke();
		if(fcanvas){
			var offset=lineWidth/2
			var fground=new fabric.Path('M '+(mx+offset)+' '+mtop+' L '+(mx+offset)+' '+y1+' M '+
				(mleft+offset)+' '+y1+' L '+(mright+offset)+' '+y1+' M '+
				(mleft+offset+mwidth/4.0)+' '+y2+' L '+(mright+offset-mwidth/4.0)+' '+y2+' M '+
				(mleft+offset+mwidth/8.0*3)+' '+mbottom+' L '+(mright+offset-mwidth/8.0*3)+' '+mbottom,{
				fill:strokeStyle,
				strokeWidth:lineWidth,
				stroke:strokeStyle,
				hasControls:false,	
				} );
			fabric.util.addTransformToObject(fground,[a,b,c,d,e,f]);
			fcanvas.add(fground);
			return fground;
		}
	}
}
//画电容
function Capacitor(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.strokeStyle=strokeStyle;
		ctx.lineWidth=lineWidth;
		ctx.transform(a,b,c,d,e,f);
		var mleft = sx < ex ? sx: ex; //左侧坐标
		var mright = sx < ex ? ex: sx; //右侧坐标
		var mtop = sy < ey ? sy: ey; //顶端坐标
		var mbottom = sy < ey ? ey: sy; //底边坐标 
		var mwidth = mright - mleft,
		mheight = mbottom - mtop;
		var mx = mleft + mwidth / 2.0;
		var y1 = mtop + mheight / 3.0,
		y2 = mbottom - mheight / 3.0;
		if (pfdp.Threephase == true) {
			var per = mwidth / 8.0;
			var lxm = mleft + per;
			var lxr = mleft + per * 2;
			var mxl = mleft + per * 3;
			var mxr = mright - per * 3;
			var rxl = mright - per * 2;
			var rxm = mright - per;
			y1 += mheight / 12.0;
			y2 -= mheight / 12.0;
			ctx.beginPath();
			ctx.moveTo(mx, mtop);
			ctx.lineTo(mx, y1);
			ctx.moveTo(mxl, y1);
			ctx.lineTo(mxr, y1);
			ctx.moveTo(mxl, y2);
			ctx.lineTo(mxr, y2);
			ctx.moveTo(mx, y2);
			ctx.lineTo(mx, mbottom);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(lxm, mtop);
			ctx.lineTo(lxm, y1);
			ctx.moveTo(mleft, y1);
			ctx.lineTo(lxr, y1);
			ctx.moveTo(mleft, y2);
			ctx.lineTo(lxr, y2);
			ctx.moveTo(lxm, y2);
			ctx.lineTo(lxm, mbottom);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(rxm, mtop);
			ctx.lineTo(rxm, y1);
			ctx.moveTo(rxl, y1);
			ctx.lineTo(mright, y1);
			ctx.moveTo(rxl, y2);
			ctx.lineTo(mright, y2);
			ctx.moveTo(rxm, y2);
			ctx.lineTo(rxm, mbottom);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(lxm, mbottom);
			ctx.lineTo(rxm, mbottom);
			ctx.stroke();

		} else {
			ctx.beginPath();
			ctx.moveTo(mx, mtop);
			ctx.lineTo(mx, y1);
			ctx.moveTo(mleft, y1);
			ctx.lineTo(mright, y1);
			ctx.moveTo(mleft, y2);
			ctx.lineTo(mright, y2);
			ctx.moveTo(mx, y2);
			ctx.lineTo(mx, mbottom);
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.lineWidth=1;
		if(pfdp.isselect)//选中时的颜色为红色，未选择为透明黑
			ctx.strokeStyle="red"
		else
			ctx.strokeStyle="#0000";
		ctx.rect(mleft-3,mtop-3,(mright-mleft+6),(mbottom-mtop+6));
		ctx.strokeRect(mleft,mtop,(mright-mleft),(mbottom-mtop));
		if(fcanvas){
			var fcapacitor=null;
			var offset=lineWidth/2
			if (pfdp.Threephase == true) {
				fcapacitor=new fabric.Path('M '+(mx+offset)+' '+mtop+' L '+(mx+offset)+' '+y1+' M '+
				(mxl+offset)+' '+y1+' L '+(mxr+offset)+' '+y1+' M '+(mxl+offset)+' '+y2+' L '+
				(mxr+offset)+' '+y2+' M '+(mx+offset)+' '+y2+' L '+(mx+offset)+' '+mbottom+
				'M '+(lxm+offset)+' '+mtop+' L '+(lxm+offset)+' '+y1+' M '+
				(mleft+offset)+' '+y1+' L '+(lxr+offset)+' '+y1+' M '+(mleft+offset)+' '+y2+' L '+
				(lxr+offset)+' '+y2+' M '+(lxm+offset)+' '+y2+' L '+(lxm+offset)+' '+mbottom+
				'M '+(rxm+offset)+' '+mtop+' L '+(rxm+offset)+' '+y1+' M '+
				(rxl+offset)+' '+y1+' L '+(mright+offset)+' '+y1+' M '+(rxl+offset)+' '+y2+' L '+
				(mright+offset)+' '+y2+' M '+(rxm+offset)+' '+y2+' L '+(rxm+offset)+' '+mbottom,{
					stroke:strokeStyle,
					strokeWidth:lineWidth,
					hasControls:false,
				});
			}else{
				fcapacitor=new fabric.Path('M '+(mx+offset)+' '+mtop+' L '+(mx+offset)+' '+y1+' M '+
				(mleft+offset)+' '+y1+' L '+(mright+offset)+' '+y1+' M '+(mleft+offset)+' '+y2+' L '+
				(mright+offset)+' '+y2+' M '+(mx+offset)+' '+y2+' L '+(mx+offset)+' '+mbottom,{
					stroke:strokeStyle,
					strokeWidth:lineWidth,
					hasControls:false,
				});
			}
			fabric.util.addTransformToObject(fcapacitor,[a,b,c,d,e,f]);
			fcanvas.add(fcapacitor);
			return fcapacitor;
		}
	}
}
//画出线
function Outer(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.strokeStyle=strokeStyle;
		ctx.lineWidth=lineWidth;
		ctx.transform(a, b, c, d, e, f);
		
		var mleft = sx < ex ? sx: ex; //左侧坐标
		//var mright = sx < ex ? ex: sx; //右侧坐标
		var mtop = sy < ey ? sy: ey; //顶端坐标
		var mbottom = sy < ey ? ey: sy; //底边坐标
		var mheight = mbottom - mtop;
		var mhead = mheight / 10.0;
		ctx.beginPath();
		ctx.moveTo(mleft, mbottom);
		ctx.lineTo(mleft - mhead, mbottom - mhead);
		ctx.lineTo(mleft + mhead, mbottom - mhead);
		ctx.closePath();
		ctx.moveTo(mleft, mbottom - mhead);
		ctx.lineTo(mleft, mtop);
		//ctx.beginPath;
		ctx.stroke();
		if(pfdp.isselect){//选中时的颜色为红色，未选择为透明黑
			ctx.strokeStyle="red";
			ctx.stroke();
		}else{
			ctx.strokeStyle="#00000000";
		}
		ctx.rect(mleft-mhead,mtop,mhead*2,mbottom-mtop);
		if(fcanvas){
			var offset=lineWidth/2;
			var fouter=new fabric.Path('M '+(mleft+offset)+' '+mbottom+' L '+(mleft-mhead+offset)+' '+(mbottom-mhead)+
			' L '+(mleft+mhead+offset)+' '+(mbottom-mhead)+' z M '+(mleft+offset)+' '+(mbottom-mhead)+' L '+(mleft+offset)+' '+mtop,{
				stroke: strokeStyle,
				strokeWidth: lineWidth,
				hasControls:false,
			});
			fabric.util.addTransformToObject(fouter,[a,b,c,d,e,f]);
			fcanvas.add(fouter);
			return fouter;
		}
	}
}
//画告警图形
function Warning(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.lineWidth=lineWidth;
		ctx.transform(a, b, c, d, e, f);
		ctx.strokeStyle = "red"; //pfdp.StrokeColor;
		ctx.fillStyle = "yellow";
		var mleft = sx < ex ? sx: ex; //左侧坐标
		var mright = sx < ex ? ex: sx; //右侧坐标
		var mtop = sy < ey ? sy: ey; //顶端坐标
		var mbottom = sy < ey ? ey: sy; //底边坐标
		var mwidth = mright - mleft,
		mheight = mbottom - mtop;
		var mx = mleft + mwidth / 2.0,
		x1 = mleft + mwidth / 4.0,
		x2 = mright - mwidth / 4.0;
		var y1 = mtop + mheight / 9.0 * 4,
		y2 = mbottom - mheight / 9.0 * 4;
		ctx.beginPath();
		ctx.moveTo(x2, mtop);
		ctx.lineTo(mleft, y2);
		ctx.lineTo(mx, y2);
		ctx.lineTo(x1, mbottom);
		ctx.lineTo(mright, y1);
		ctx.lineTo(mx, y1);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		if(fcanvas){
			var offset=lineWidth/2;
			var fwarning=new fabric.Path('M '+(x2+offset)+' '+mtop+' L '+(mleft+offset)+' '+y2+' L '+(mx+offset)+' '+y2+' L '+
			(x1+offset)+' '+mbottom+' L '+(mright+offset)+' '+y1+' L '+(mx+offset)+' '+y1+' z',{
				stroke:"red",
				strokeWidth:lineWidth,
				fill:"yellow",
				hasControls:false,
			});
			fabric.util.addTransformToObject(fwarning,[a,b,c,d,e,f]);
			fcanvas.add(fwarning);
			return fwarning;
		}
	}
}
//画自定义区域
function Area(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.strokeStyle=strokeStyle;
		ctx.lineWidth=lineWidth;
		ctx.transform(a, b, c, d, e, f);
		var pt;
		var points = (pfdp.Points);
		var point = new Object();
		point.x = parseFloat(points[0].substring(0, (pt = points[0].indexOf(","))));
		point.y = parseFloat(points[0].substr(pt + 1));
		ctx.beginPath();
		ctx.moveTo(point.x, point.y);
		var offset=lineWidth/2;
		var pathstr='M '+(point.x+offset)+' '+point.y+' ';
		for (var i = 1; i < points.length; i++) {
			point.x = parseFloat(points[i].substring(0, (pt = points[i].indexOf(","))));
			point.y = parseFloat(points[i].substr(pt + 1));
			pathstr+='L '+(poit.x+offset)+' '+point.y+' ';
			ctx.lineTo(point.x, point.y);
		}
		ctx.closePath();
		ctx.stroke();
		if(fcanvas){
			var farea=new fabric.Path(pathstr+' z',{
				stroke:strokeStyle,
				strokeWidth:lineWidth,
				fill:'#0000',
				hasControls:false,
			});
			fabric.util.addTransformToObject(farea,[a,b,c,d,e,f]);
			fcanvas.add(farea);
			return farea;
		}
	}
}
//画节点
function Node(ctx, pfdp,fcanvas) {
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		ctx.strokeStyle=strokeStyle;
		ctx.lineWidth=lineWidth;
		ctx.transform(a, b, c, d, e, f);
		var r = parseFloat(pfdp.Size) / 2;

		if (pfdp.NodeType == "方形") {
			ctx.Rect(sx, sy, (ex - sx), (ey - sy));
		} else {
			ctx.beginPath();
			ctx.arc(sx + r, sy + r, r, 0, Math.PI * 2, false);
		}
		ctx.fill();
		ctx.beginPath();
		if(pfdp.isselect){
			ctx.strokeStyle="red";
		}else{
			ctx.strokeStyle="#00000000";
		}
		ctx.strokeRect(sx,sy,ex-sx,ey-sy);
		if(fcanvas){
			var	fnode=null;
			if(pfdp.NodeType=="方形"){
				fnode=new fabric.Rect({
					left:sx,
					top:sy,
					width:(ex-sx),
					height:(ey-sy),
					stroke:strokeStyle,
					strokeWidth:lineWidth,
					hasControls:false,
					fill:"#0000",
				});
			}else{
				fnode=new fabric.Circle({
					left:sx-r,
					top:sy-r,
					radius:r,
					stroke:strokeStyle,
					strokeWidth:lineWidth,
					fill:"#0000",
					hasControls:false,
				});
			}
			fabric.util.addTransformToObject(fnode,[a,b,c,d,e,f]);
			fcanvas.add(fnode);
			return fnode;
		}
	}
}
/**
	*绘制竖排文本（英语直接旋转，中文竖排）
	* @author zhangxinxu(.com)
	* @licence MIT
	* @description http://www.zhangxinxu.com/wordpress/?p=7362
	*/
CanvasRenderingContext2D.prototype.fillTextVertical = function(text, x, y) {
	var context = this;
	//var canvas = context.canvas;
	var arrText = text.split('');
	var arrWidth = arrText.map(function(letter) {
		return context.measureText(letter).width;
	});
	var align = context.textAlign;
	var baseline = context.textBaseline;
	if (align == 'left') {
		x = x + Math.max.apply(null, arrWidth) / 2;
	} else if (align == 'right') {
		x = x - Math.max.apply(null, arrWidth) / 2;
	}
	if (baseline == 'bottom' || baseline == 'alphabetic' || baseline == 'ideographic') {
		y = y - arrWidth[0] / 2;
	} else if (baseline == 'top' || baseline == 'hanging') {
		y = y + arrWidth[0] / 2;
	}
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	var trans = context.getTransform();
	// 开始逐字绘制
	arrText.forEach(function(letter, index) {
		// 旋转坐标系还原成初始态
		context.setTransform(trans);
		// 确定下一个字符的纵坐标位置
		var letterWidth = arrWidth[index];
		// 是否需要旋转判断
		var code = letter.charCodeAt(0);
		if (code <= 256) {
			context.translate(x, y);
			// 英文字符，旋转90°
			context.rotate(90 * Math.PI / 180);
			context.translate( - x, -y);
		} else if (index > 0 && text.charCodeAt(index - 1) < 256) {
			// y修正
			y = y + arrWidth[index - 1] / 2;
		}
		context.fillText(letter, x, y);
		// 确定下一个字符的纵坐标位置
		var letterWidth = arrWidth[index];
		y = y + letterWidth;
	});
	// 水平垂直对齐方式还原
	context.textAlign = align;
	context.textBaseline = baseline;
};
//绘制文本，必要时竖排。
function DrawText(ctx, pfdp,fcanvas) {
	var ffff={"Black":"900","Bold":"700","ExtraBlack":"900","ExtraBold":"800","ExtraLight":"200","Light":"300","Medium":"5500","Normal":"normal","SemiBold":"600","Thin":"100"}
	var paras=ecodeparafrompfdp(pfdp);
	with(paras){
		sy=sy+parseInt(pfdp.FontSize)
		ctx.transform(a, b, c, d, e, f);
		ctx.clearRect(sx-2,sy-parseFloat(pfdp.FontSize)-2,(ex-sx+4),(ey-sy+parseFloat(pfdp.FontSize)+4))
		if (pfdp.hasOwnProperty("isError") && (pfdp.isError == true)) {
			ctx.fillStyle = "#FFFF00";
		} else {
			ctx.fillStyle = pfdp.StrokeColor.replace("#FF","#");
		}
		ctx.lineWidth = pfdp.StrokeThinkness;
		var fontstr = '';
		if (pfdp.hasOwnProperty("FontStyle")) {
			fontstr = fontstr + pfdp.FontStyle + " ";
		}
		//ctx.textBaseline="ideographic";//top, hanging, middle, alphabetic, ideographic, bottom
		if (pfdp.hasOwnProperty("FontWeight")) {
			fontstr = fontstr + ffff[pfdp.FontWeight] + " ";
		}
		if (pfdp.hasOwnProperty("FontSize")) {
			fontstr = fontstr + pfdp.FontSize + "px ";
		}
		if (pfdp.hasOwnProperty("FontFamily")) {
			fontstr = fontstr + " " + pfdp.FontFamily;
		}
		ctx.font = fontstr;
		if (pfdp.Vertical == true) {
			ctx.fillTextVertical(pfdp.Text, sx, sy);
		} else {
			ctx.fillText(pfdp.Text, sx, sy);
		}
		if(fcanvas){
			if(pfdp.refresh==true){
				fcanvas.remove(window[(pfdp.Binding)]);//.setText(pfdp.Text);
				pfdp.refresh=false;
			}else{}
			if(pfdp.Binding==null || pfdp.Binding==undefined){
				pfdp.Binding="ftext";
			}
			window[(pfdp.Binding)]=new fabric.Text(pfdp.Text,{
				left:sx+lineWidth/2,
				top:sy-parseFloat(pfdp.FontSize)+lineWidth/2,
				fontFamily:pfdp.FontFamily,
				fontSize:parseInt(pfdp.FontSize),
				fill:pfdp.StrokeColor.replace("#FF","#"),
				fontStyle:pfdp.FontStyle,
				//strokeWidth:parseInt(pfdp.StrokeThinkness),
				//stroke:pfdp.StrokeColor.replace("#FF","#"),
				fontWeight:ffff[pfdp.FontWeight],
				binding:pfdp.Binding,
				hasControls:false,
				objectCaching: false,
			});
			fabric.util.addTransformToObject(window[(pfdp.Binding)],[a,b,c,d,e,f]);
			
			fcanvas.add(window[pfdp.Binding]);
		}
		//fcanvas.renderAll();
		
		ctx.beginPath();//开始一个新路径，用于保存绘制的区域，从而与鼠标所在位置进行对比匹配。
		ctx.lineWidth=1;
		if(pfdp.isselect)//选中时的颜色为红色，未选择为透明黑
			ctx.strokeStyle="red"
		else
			ctx.strokeStyle="#00000000"
		ctx.rect(sx-2,sy-parseFloat(pfdp.FontSize)-2,(ex-sx+4),(ey-sy+parseFloat(pfdp.FontSize)+4));
		ctx.stroke();
	}
}
function Selection(ctx, pfdp) {

}
function Picture(ctx,pfdp){
	var sx = parseFloat(pfdp.StartPoint.substring(0, pfdp.StartPoint.indexOf(",")));
	var sy = parseFloat(pfdp.StartPoint.substr(pfdp.StartPoint.indexOf(",") + 1));
	var ex = parseFloat(pfdp.EndPoint.substring(0, pfdp.EndPoint.indexOf(",")));
	var ey = parseFloat(pfdp.EndPoint.substring(pfdp.EndPoint.indexOf(",") + 1));
	var a=d=1;b=c=e=f=0;
	if (pfdp.hasOwnProperty("_matrix")) {
		var pt = pfdp._matrix.indexOf(",");
		var a = parseFloat(pfdp._matrix.substring(0, pt));
		var b = parseFloat(pfdp._matrix.substring(pt + 1, (pt = pfdp._matrix.indexOf(",", pt + 1))));
		var c = parseFloat(pfdp._matrix.substring(pt + 1, (pt = pfdp._matrix.indexOf(",", pt + 1))));
		var d = parseFloat(pfdp._matrix.substring(pt + 1, (pt = pfdp._matrix.indexOf(",", pt + 1))));
		var e = parseFloat(pfdp._matrix.substring(pt + 1, (pt = pfdp._matrix.indexOf(",", pt + 1))));
		var f = parseFloat(pfdp._matrix.substr(pt + 1));
		//ctx.transform(a, b, c, d, e, f);
	}
	var img=new Image();
	img.src="data:imgae/jpg;base64,"+pfdp.Datas;//有的教程说此语句放在onload之后，有待验证。
	img.onload=function(){//等到图像内容加载完成后再显示绘制。此时的ctx的属性已经改变，需重新设置transform。
		//setTimeout(drawpicture,1000);
		ctx.globalCompositeOperation="destination-over"; //"destination-atop";//
		ctx.transform(a, b, c, d, e, f);
		ctx.drawImage(img, sx,sy,(ex-sx),(ey-sy));
	}
	if(pfdp.isselect){//选中状态，红色轮廓，未选择则不圈轮廓
		ctx.strokeStyle="red";
		ctx.strokeRect(sx,sy,ex-sx,ey-sy);
	}
}
/** 图元绘制函数完成*/
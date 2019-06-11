	var tree = function() { 
	//一级导航点击事件 
	$('.nodeBox').on('click', function(event) {
		var _this = $(this);  
		var child = _this.parent().find('.nodechild_box');
		if (_this.attr('opened') == 'opened') {
			_this.parent().find('.childnode').hide();
			child.hide();  _this.attr('opened', '');
		}else{  
			_this.parent().find('.childnode').show();
			child.show();  _this.attr('opened', 'opened');
		};
	});
		//二级导航点击事件
	$('.nodechild_box').on('click', function(event) {
		var _this = $(this);
		var child = _this.parent().find('.gchild_box');
		if (_this.attr('opened') == 'opened') {
			child.hide();  _this.parent().find('.gchildnode').hide();
			_this.find('.add').attr('src', 'images/icon_add.png'); 
			_this.attr('opened', '');
		}else{
			child.show();
			_this.parent().find('.gchildnode').show();
			_this.find('.add').attr('src', 'images/icon_minus.png');
			_this.attr('opened', 'opened');
		};
	});
	//三级导航点击事件
	$('.gchild_box').on('click', function(event) {
		var _this = $(this);
		var child = _this.parent().find('.ggchild_box');
		if (_this.attr('opened') == 'opened') {
			child.hide();
			_this.find('.add').attr('src', 'images/icon_add.png');
			_this.attr('opened', '');
		}else{
			child.show();
			_this.find('.add').attr('src', 'images/icon_minus.png');
			_this.attr('opened', 'opened');
		};
	});
	//hover显示箭头及背景变化
	$('.nodeBox').mouseover(function(event) {
		$(this).addClass('tree_hover');
		$(this).find('.arrow').show();
	});
	$('.nodeBox').mouseout(function(event) {
		$(this).removeClass('tree_hover');
		$(this).find('.arrow').hide();
	});
	$('.nodechild_box').mouseover(function(event) {
		$(this).addClass('box_hover');
		$(this).find('.arrow').show();
	});
	$('.nodechild_box').mouseout(function(event) {
		$(this).removeClass('box_hover');
		$(this).find('.arrow').hide();
	});
	$('.gchild_box').mouseover(function(event) {
		$(this).addClass('box_hover');
		$(this).find('.arrow').show();
	});
	$('.gchild_box').mouseout(function(event) {
		$(this).removeClass('box_hover');
		$(this).find('.arrow').hide();
	});
	$('.ggchild_box').mouseover(function(event) {
		$(this).addClass('box_hover');
		$(this).find('.arrow').show();
	});
	$('.ggchild_box').mouseout(function(event) {
		$(this).removeClass('box_hover');
		$(this).find('.arrow').hide();
	});
	};
	//链接函数
	var tree_link = function() {
		var linkBox = $('[menurl]');
		linkBox.each(function(i, ele) {
			var _ele = $(ele);
			var key = _ele.attr('menurl');
			if(key != '/'){
				$(this).on('click',function(){
					$('#mainweb').attr('src', key);
					auto();
				})
			} 
		});
	};
	//获取登陆用户数据 
	var getData = function() {
		var cond = sessionStorage.cond;
		$.post("XXXX", {}, function(json) {
			console.log(json)
			if(json.code == 200){ 
				data = json.data;
				fillUserName(data);
				fillTree(data);
				var length = $('.nodeBox').length ;
				for (var i = 0;i < length;i++) {
				var iconId = data.icons[i].iconId;
				$('.nodeBox').eq(i+1).attr('menuid',i);
				$('.nodeBox').eq(i+1).find('img').attr('src','images/'+ data.icons[iconId-1].name +'');
				}
				//为每个菜单添加链接
				tree_link()
				}
			},
		function(xhr) {
			console.log(xhr)
		});
	}
	var fillTree = function(data){
		var tmplDom = $('#tree');
		tmplDom.parent().html(eking.template.getHtml(tmplDom.html(),data)); tree();
	}
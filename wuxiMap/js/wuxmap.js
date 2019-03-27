var myValue;

function initMap() {
	if(mapMode == 'weixing') {
		map = new BMap.Map("allmap", { mapType: BMAP_HYBRID_MAP }); // 创建Map实例
		setMap();
	} else {
		map = new BMap.Map("allmap"); // 创建Map实例
		setMap();
	}

}

function initQuanjing() {
	if(isJqSelected) {
		getViewsByJson();
	}
	if(isKfqSelected) {
		getKaifaquByJson();
	}
}

function setMap() {
	var point = new BMap.Point(120.202538, 31.340778); // 创建点坐标  
	map.centerAndZoom(point, 10); // 初始化地图，设置中心点坐标和地图级别
	map.enableScrollWheelZoom(); //允许滚轮
	map.enableDoubleClickZoom(); //允许双击放大

	map.addControl(new BMap.NavigationControl());
	map.setCurrentCity("无锡"); // 设置地图显示的城市 此项是必须设置的

	map.addEventListener('touchend', function(e) {
		var a = e.domEvent;
		var b = e.domEvent.srcElement;
		var c = b;
		if(isContains(b.outerHTML, "TextIconOverlay") || isContains(b.outerHTML, "juhe_kfq.png")) {
			map.zoomIn();
		}

	});

	var ac = new BMap.Autocomplete( //建立一个自动完成的对象
		{
			"input": "suggestId",
			"location": map
		});

	ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
		var str = "";
		var _value = e.fromitem.value;
		var value = "";
		if(e.fromitem.index > -1) {
			value = _value.province + _value.city + _value.district + _value.street + _value.business;
		}
		str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

		value = "";
		if(e.toitem.index > -1) {
			_value = e.toitem.value;
			value = _value.province + _value.city + _value.district + _value.street + _value.business;
		}
		str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;

	});

	ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
		var _value = e.item.value;
		myValue = _value.province + _value.city + _value.district + _value.street + _value.business;

		setPlace();
	});

	listXZQH_onTap();
	getBoundary();

}

function loadInit() {
	mui(".mui-icon-clear")[0].addEventListener('tap', function() {
		map.clearOverlays(); //清除地图覆盖物      
		getBoundary();
	});
	mui("#offCanvasWrapper")[0].addEventListener('tap', function() {
		$("#suggestId").blur();
	});

}

//加载景区
var viewsMarkers = [];
var viewMarkerClusterer = null;

function getViewsByJson() {
	viewsMarkers = [];
	viewMarkerClusterer = null;
	$.getJSON('wuxi.json', function(data) {
		for(var i = 0; i < data.wuxi.length; i++) {
			var name = data.wuxi[i].name;
			var url = data.wuxi[i].url;
			var point = new BMap.Point(data.wuxi[i].point.split(",")[0], data.wuxi[i].point.split(",")[1]);

			var icon = new BMap.Icon('img/viewMarker.png', new BMap.Size(24, 36), {
				anchor: new BMap.Size(16, 32),
			});
			var marker = new BMap.Marker(point, { icon: icon }); // 创建标注    
			marker.disableMassClear(); //不允许被清除
			//					var marker = new BMap.Marker(point);
			viewsMarkers.push(marker); //点聚合
			marker.name = data.wuxi[i].name;
			marker.url = data.wuxi[i].url;
			marker.image = data.wuxi[i].image;
			marker.addEventListener("click", function(e) {
				var p = e.target;
				var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
				//				var infoWindow = new BMap.InfoWindow("11",{offset: new BMap.Size(0, 10)});  // 创建信息窗口对象 
				//				map.openInfoWindow(infoWindow,point); //开启信息窗口
				var content =
					'<div style="position: relative; width: 240px; height: 100px;}">' +
					'<a href="view2.html?url=' + p.url + '">' +
					'<img style="width:240px;height:100px;" src="' + p.image + '"></img>' +
					'<span style="position:absolute;bottom:0;left:0;width:240px;height:18px;background: #000;opacity: 0.5;color:white;">查看全景--></span>' +
					'<a>' +
					'</div>' +
					'<div style="margin-top:5px;">' +
					'<div><input type="button" value="到这里去" style="width:240px;height:30px;" onclick="toPath(' + p.getPosition().lng + ',' + p.getPosition().lat + ',' + '\'' + p.name + '\'' + ')"></div>';
				'</div>';

				var searchInfoWindow = null;
				searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
					title: p.name, //标题
					width: 100, //宽度
					height: 140, //高度
					panel: "panel", //检索结果面板
					//offset: new BMap.Size(0, 0),
					enableAutoPan: true, //自动平移
					searchTypes: [
						//						BMAPLIB_TAB_TO_HERE //到这里去
					]
				});
				searchInfoWindow.open(point);
			});
		}
		//点聚合
		viewMarkerClusterer = new BMapLib.MarkerClusterer(map, { markers: viewsMarkers });

//		var myStyles = [{
//			url: 'img/juhe_jingqu.png', //图标路径
//			size: new BMap.Size(36, 36), //图标大小
//			textColor: 'white', //文字颜色
//			textSize: 14 //字体大小
//		}];
//		viewMarkerClusterer.setStyles(myStyles);

	});
}

//加载开发区
var kaifaquMarkers = [];
var kaifaquMarkerClusterer = null;

function getKaifaquByJson() {
	kaifaquMarkers = [];
	kaifaquMarkerClusterer = null;
	$.getJSON('wuxi.json', function(data) {
		for(var i = 0; i < data.kaifaqu.length; i++) {
			var name = data.kaifaqu[i].name;
			var url = data.kaifaqu[i].url;
			var point = new BMap.Point(data.kaifaqu[i].point.split(",")[0], data.kaifaqu[i].point.split(",")[1]);

			var icon = new BMap.Icon('img/kaifaquMarker.png', new BMap.Size(24, 36), {
				anchor: new BMap.Size(10, 32),
			});
			//					var marker = new BMap.Marker(point);        // 创建标注    
			var marker = new BMap.Marker(point, { icon: icon }); // 创建标注    
			marker.disableMassClear(); //不允许被清除
			kaifaquMarkers.push(marker); //点聚合
			marker.name = data.kaifaqu[i].name;
			marker.url = data.kaifaqu[i].url;
			marker.image = data.kaifaqu[i].image;
			marker.addEventListener("click", function(e) {
				var p = e.target;
				var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
				//				var infoWindow = new BMap.InfoWindow("11",{offset: new BMap.Size(0, 10)});  // 创建信息窗口对象 
				//				map.openInfoWindow(infoWindow,point); //开启信息窗口
				var content =
					'<div style="position: relative; width: 240px; height: 100px;}">' +
					'<a href="view2.html?url=' + p.url + '">' +
					'<img style="width:240px;height:100px;" src="' + p.image + '"></img>' +
					'<span style="position:absolute;bottom:0;left:0;width:240px;height:18px;background: #000;opacity: 0.5;color:white;">查看全景--></span>' +
					'<a>' +
					'</div>' +
					'<div style="margin-top:5px;">' +
					'<div><input type="button" value="到这里去" style="width:240px;height:30px;" onclick="toPath(' + p.getPosition().lng + ',' + p.getPosition().lat + ',' + '\'' + p.name + '\'' + ')"></div>';
				'</div>';

				var searchInfoWindow = null;
				searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
					title: p.name, //标题
					width: 100, //宽度
					height: 140, //高度
					panel: "panel", //检索结果面板
					//offset: new BMap.Size(0, 0),
					enableAutoPan: true, //自动平移
					searchTypes: [
						//						BMAPLIB_TAB_TO_HERE //到这里去
					]
				});
				searchInfoWindow.open(point);
			});
		}
		//点聚合
		kaifaquMarkerClusterer = new BMapLib.MarkerClusterer(map, { markers: kaifaquMarkers });

		var myStyles = [{
			url: 'img/juhe_kfq.png', //图标路径
			size: new BMap.Size(36, 36), //图标大小
			textColor: '#ED1C24', //文字颜色
			textSize: 14 //字体大小
		}];
		kaifaquMarkerClusterer.setStyles(myStyles);
	});
}

//行政区划
function getBoundary() {
	var bdary = new BMap.Boundary();
	bdary.get(xzqhBoundary, function(rs) { //获取行政区域
		map.clearOverlays(); //清除地图覆盖物   
		initQuanjing();
		var count = rs.boundaries.length; //行政区域的点有多少个
		if(count === 0) {
			alert('未能获取当前输入行政区域');
			return;
		}
		var pointArray = [];
		for(var i = 0; i < count; i++) {
			var ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, fillOpacity: 0.1, strokeColor: "#9E76B4", fillColor: "#00A550" }); //建立多边形覆盖物
			map.addOverlay(ply); //添加覆盖物
			pointArray = pointArray.concat(ply.getPath());
		}
	});
}

function G(id) {
	return document.getElementById(id);
}

function setPlace() {
	//map.clearOverlays(); //清除地图上所有覆盖物
	function myFun() {
		var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
		map.centerAndZoom(pp, 18);
		map.addOverlay(new BMap.Marker(pp)); //添加标注
	}
	var local = new BMap.LocalSearch(map, { //智能搜索
		onSearchComplete: myFun
	});
	local.search(myValue);
}

function listXZQH_onTap() {
	document.getElementById("xzqh").addEventListener('tap', function(event) {
		$('.select').toggleClass('open');
		event.stopPropagation();
	});
	document.getElementById("list_wx").addEventListener('tap', function() {
		var _this = $(this);
		$('.select p').text(_this.attr('data-value'));
		$('.select').toggleClass('open');
		_this.addClass('selected').siblings().removeClass('selected');
		$('.select').removeClass('open');
		map.centerAndZoom(new BMap.Point(120.090429, 31.499786), 9);
		xzqhBoundary = "无锡市";
		getBoundary();
	});
	document.getElementById("list_jy").addEventListener('tap', function() {
		var _this = $(this);
		$('.select p').text(_this.attr('data-value'));
		$('.select').toggleClass('open');
		_this.addClass('selected').siblings().removeClass('selected');
		$('.select').removeClass('open');
		map.centerAndZoom(new BMap.Point(120.328862, 31.808325), 11);
		xzqhBoundary = "无锡市江阴市";
		getBoundary();
	});
	document.getElementById("list_yx").addEventListener('tap', function() {
		var _this = $(this);
		$('.select p').text(_this.attr('data-value'));
		$('.select').toggleClass('open');
		_this.addClass('selected').siblings().removeClass('selected');
		$('.select').removeClass('open');
		map.centerAndZoom(new BMap.Point(119.779554, 31.365903), 10);
		xzqhBoundary = "无锡市宜兴市";
		getBoundary();
	});
	document.getElementById("list_xs").addEventListener('tap', function() {
		var _this = $(this);
		$('.select p').text(_this.attr('data-value'));
		$('.select').toggleClass('open');
		_this.addClass('selected').siblings().removeClass('selected');
		$('.select').removeClass('open');
		map.centerAndZoom(new BMap.Point(120.484326, 31.628), 11);
		xzqhBoundary = "无锡市锡山区";
		getBoundary();
	});
	document.getElementById("list_hs").addEventListener('tap', function() {
		var _this = $(this);
		$('.select p').text(_this.attr('data-value'));
		$('.select').toggleClass('open');
		_this.addClass('selected').siblings().removeClass('selected');
		$('.select').removeClass('open');
		map.centerAndZoom(new BMap.Point(120.212453, 31.666789), 11);
		xzqhBoundary = "无锡市惠山区";
		getBoundary();
	});
	document.getElementById("list_bh").addEventListener('tap', function() {
		var _this = $(this);
		$('.select p').text(_this.attr('data-value'));
		$('.select').toggleClass('open');
		_this.addClass('selected').siblings().removeClass('selected');
		$('.select').removeClass('open');
		map.centerAndZoom(new BMap.Point(120.23535, 31.404268), 11);
		xzqhBoundary = "无锡市滨湖区";
		getBoundary();
	});
	document.getElementById("list_lx").addEventListener('tap', function() {
		var _this = $(this);
		$('.select p').text(_this.attr('data-value'));
		$('.select').toggleClass('open');
		_this.addClass('selected').siblings().removeClass('selected');
		$('.select').removeClass('open');
		map.centerAndZoom(new BMap.Point(120.307215, 31.581626), 12);
		xzqhBoundary = "梁溪区";
		getBoundary();
	});
	document.getElementById("list_xw").addEventListener('tap', function() {
		var _this = $(this);
		$('.select p').text(_this.attr('data-value'));
		$('.select').toggleClass('open');
		_this.addClass('selected').siblings().removeClass('selected');
		$('.select').removeClass('open');
		map.centerAndZoom(new BMap.Point(120.422731, 31.537957), 12);
		xzqhBoundary = "无锡市新吴区";
		getBoundary();
	});
}

function toPath(lon, lat, name) {
	window.location = "path.html?lon=" + lon + "&lat=" + lat + "&name=" + name;
}

function isContains(str, substr) {
	return str.indexOf(substr) >= 0;
}
function initData() {
	tolon = getQueryString("lon");
	tolat = getQueryString("lat");
	doSearch("餐馆", 1000, 16);
	initTap();

}

function doSearch(type, distance, zoomSize) {
	var mPoint = new BMap.Point(tolon, tolat);
	map.enableScrollWheelZoom();
	map.centerAndZoom(mPoint, zoomSize);

	var local = new BMap.LocalSearch(map, { renderOptions: { map: map, autoViewport: false, panel: "r-result" } });
	local.searchNearby(type, mPoint, distance);

}

function getQueryString(paras) {
	var url = location.href;
	var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
	var paraObj = {}
	for(i = 0; j = paraString[i]; i++) {
		paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
	}
	var returnValue = paraObj[paras.toLowerCase()];
	if(typeof(returnValue) == "undefined") {} else {
		return returnValue;
	}
}

function initTap() {
	document.getElementById('canguan').addEventListener('tap', function() {
		$("div img").removeClass("imgSelect");
		$(this).addClass("imgSelect");
		map.clearOverlays(); //清除地图覆盖物   
		doSearch("餐馆", 1000, 16);
	});
	document.getElementById('jiudian').addEventListener('tap', function() {
		$("div img").removeClass("imgSelect");
		$(this).addClass("imgSelect");
		map.clearOverlays(); //清除地图覆盖物   
		doSearch("酒店", 1000, 16);
	});
	document.getElementById('jingdian').addEventListener('tap', function() {
		$("div img").removeClass("imgSelect");
		$(this).addClass("imgSelect");
		map.clearOverlays(); //清除地图覆盖物   
		doSearch("景点", 1000, 16);
	});
	document.getElementById('jiayou').addEventListener('tap', function() {
		$("div img").removeClass("imgSelect");
		$(this).addClass("imgSelect");
		map.clearOverlays(); //清除地图覆盖物   
		doSearch("加油站", 3000, 14);
	});
	document.getElementById('tingche').addEventListener('tap', function() {
		$("div img").removeClass("imgSelect");
		$(this).addClass("imgSelect");
		map.clearOverlays(); //清除地图覆盖物   
		doSearch("停车场", 1000, 16);
	});
}
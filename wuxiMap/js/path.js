var tolon;
var tolat;
var fromlon;
var fromlat;
var pathMode = "jiache";

function initData() {
	tolon = getQueryString("lon");
	tolat = getQueryString("lat");
	var name = decodeURIComponent(getQueryString("name"));
	document.getElementById("se-txt-end").value = name;

	
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

function pathCar() {
	$("#resultDiv").hide();
	var driving = new BMap.DrivingRoute(map, { renderOptions: { map: map, panel: "r-result", autoViewport: true } });
	var p1 = new BMap.Point(fromlon, fromlat);
	var p2 = new BMap.Point(tolon, tolat);
	driving.search(p1, p2);
	$("#resultDiv").show();
	document.getElementById("l-map").style.height="calc(100% - 300px)";
}

function pathBush() {
	$("#resultDiv").hide();
	var transit = new BMap.TransitRoute(map, {
		renderOptions: { map: map, panel: "r-result" }
	});
	var p1 = new BMap.Point(fromlon, fromlat);
	var p2 = new BMap.Point(tolon, tolat);
	transit.search(p1, p2);
	setTimeout(hasPath,2000);

}

function pathRun() {
	$("#resultDiv").hide();
	var walking = new BMap.WalkingRoute(map, { renderOptions: { map: map, panel: "r-result", autoViewport: true } });
	var p1 = new BMap.Point(fromlon, fromlat);
	var p2 = new BMap.Point(tolon, tolat);
	walking.search(p1, p2);
	$("#resultDiv").show();
}

function hasPath() {
	var content = $("#r-result").html(); 
	if(content == null || content.length == 0) {
		$("#resultDiv").hide();
		document.getElementById("l-map").style.height="calc(100% - 140px)";
	}else{
		$("#resultDiv").show();
		document.getElementById("l-map").style.height="calc(100% - 300px)";
	}
}



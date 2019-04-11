function showCoordinates (e) {
	      alert(e.latlng);
      }


var Startpt;
var Endpt;
//////////Implement map//////
var mymap = L.map('mapid', {
      contextmenu: true,
      contextmenuWidth: 140,
      contextmenuItems: [{
	    text: 'Show coordinates',
	    callback: showCoordinates,
	    index: 0
	},
	{
        separator: true,
        index: 1
    },
    {
	    text: 'Add as routing start point',
	    callback: getStartPt,
	    index: 1
	},
	{
	    text: 'Add as routing end point',
	    callback: getEndPt,
	    index: 1
	},
	{
        separator: true,
        index: 2
    }, {
	    text: 'Close this menu',
	    index: 2
	}]
    }).setView([-25.75395, 28.23053], 8); 

//Code for baselayers
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
googleSat.addTo(mymap);
var OpenStreetMap =	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data <a href="http://openstreetmap.org">OpenStreetMap</a> contributors', 
});
//OpenStreetMap.addTo(mymap);
var basemaps={
	"Street Map": OpenStreetMap,
	"Satellite Imagery": googleSat
};

//Code for the WFS layer
var owsrootUrl = 'http://41.185.93.71:8080/geoserver/safety/ows';
var defaultParameters = {
    service : 'WFS',
    version : '2.0',
    request : 'GetFeature',
    typeName : 'safety:incident',
    outputFormat : 'text/javascript',
    format_options : 'callback:getJson',
    SrsName : 'EPSG:4326'
};
/*
var geojsonMarkerOptions = {
    radius: feature.properties.accuracy,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};*/
var statID;
var myZoom = {
  start:  mymap.getZoom(),
  end: mymap.getZoom()
};
var actStatus, latestLat, latestLong;
var maxID;
var ID_arr=[];
var featureIDs=[];
var coordinates, latestC;
var parameters = L.Util.extend(defaultParameters);
var URL = owsrootUrl + L.Util.getParamString(parameters);
var WFSLayer;


//setTimeout(onLoadd,5000);
function onLoadd(){
	function toRefresh(){
		var ajax = $.ajax({
			url : URL,
			dataType : 'jsonp',
			jsonpCallback : 'getJson',
			success : function (response) {
				WFSLayer = L.geoJson(response, {
					
					pointToLayer: function (feature, latlng) {
						
					switch (feature.properties.status) {
					case 'Unattended': return L.circleMarker(latlng, {radius: 8,
						fillColor: "#FF0000",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8,});
					case 'attended': return L.circleMarker(latlng, {radius: 8,
						fillColor: "#00AF00",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8,});
					case 'inProgress': return L.circleMarker(latlng, {radius: 8,
						fillColor: "#FFA500",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8,});		 
			}},
						 
			
					onEachFeature: function (feature, layer) {
						popupOptions = {maxWidth: 200};
						//var timeE=feature.properties.time.substring(11, 19);
						//var hour= parseInt(timeE.substring(0,2))+2;
						//var rest= timeE.substing(3,5);
						//console.log("0"+hour+timeE);
						layer.bindPopup("Status: " + feature.properties.status + "<br>Time: " + feature.properties.time + "<br>Type: " + feature.properties.type,popupOptions);
						ID_arr.push(feature);				
				   }
				})
				.on('click', function(e){		
					actStatus = e.layer.feature.properties;
					statID=e.layer.feature.id;
					statID=parseInt(statID.substring(9));
					mymap.setView([e.layer.feature.geometry.coordinates[1],e.layer.feature.geometry.coordinates[0] ], 17);
				}).addTo(mymap);
			}
			
		});
	}
	setTimeout(function () {toRefresh();}, 300); 
	//setInterval(onLoadd, 30);
	
}

		
//////////add layer control///////////
L.control.layers(basemaps).addTo(mymap);
	
////////////add routing///////////
console.log(latestLat, latestLong);

var control = L.Routing.control({
	waypoints: [
        //L.latLng(57.74, 11.94),
        //L.latLng(57.6792, 11.949)
    ],
    collapsible: true,
    routeWhileDragging: true
}).addTo(mymap);

function getStartPt(e){
	Startpt = e.latlng;
	control.spliceWaypoints(0, 1, Startpt);
}
function getEndPt(e){
	Endpt = e.latlng;
	control.spliceWaypoints(control.getWaypoints().length - 1, 1, Endpt);
}


var stat;
function changeP (id){
	
	//console.log('id '+ id);
	if(id == 'SOS'){
		//console.log(actStatus.status);
		actStatus.status = 'inProgress';
		stat=actStatus.status;
		
	}
	if(id == 'attended'){
		//console.log(actStatus.status);
		actStatus.status = 'attended';
		stat=actStatus.status;
		
	}
	//console.log('after if: '+ actStatus.status);
	updStatus();
	WFSLayer.remove();
	
	var mytime= setTimeout(function (){onLoadd()}, 300);

	
}

function updStatus(){
		$.ajax({
		type: "POST",
		url: "updateStatus.php",
		data:{stat:stat, statID:statID},
		});  
				
	};


function showCoordinates (e) {
	      alert(e.latlng);
      }

function centerMap (e) {
	map.panTo(e.latlng);
}

function getProperties(){

}

//////////Implement map//////
var map = L.map('mapidEdit', {
      contextmenu: false,
      contextmenuWidth: 140,
      contextmenuItems: [{
	    text: 'Show coordinates',
	    callback: showCoordinates,
	    index: 0
	},
	{
	    text: 'Center map here',
	    callback: centerMap,
	    index: 0
	},
	{
        separator: true,
        index: 1
    }, {
	    text: 'Close this menu',
	    index: 1
	}]
    }).setView([-25.98161902, 28.21778458], 9);    

//Code for baselayers
var OpenStreetMap =	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHVxczA1IiwiYSI6ImNpdm50eGc5ejAwMHEyb2w0bXNuNHl1OWkifQ.sQNjZWZBjou3uIQmEWdRWw', {
    attribution: 'Map data <a href="http://openstreetmap.org">OpenStreetMap</a> contributors', 
});
OpenStreetMap.addTo(map);

googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//OpenStreetMap.addTo(mymap);
var basemaps={
	"Dark Map": OpenStreetMap,
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
  start:  map.getZoom(),
  end: map.getZoom()
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
					case 'Unattended': return L.circleMarker(latlng, {
						contextmenu: true,
						radius: 8,
						fillColor: "#FF0000",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 1,});
					case 'attended': return L.circleMarker(latlng, {radius: 8,
						contextmenu: true,
						fillColor: "#00AF00",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 1,});
					case 'inProgress': return L.circleMarker(latlng, {radius: 8,
						contextmenu: true,
						fillColor: "#FFA500",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 1,});		 
			}},
						 
			
					onEachFeature: function (feature, layer) {

						popupOptions = {maxWidth: 230};
						//var timeE=feature.properties.time.substring(11, 19);
						//var hour= parseInt(timeE.substring(0,2))+2;
						//var rest= timeE.substing(3,5);
						//console.log("0"+hour+timeE);
						title = "<center>INCIDENT INFORMATION <br></center>";
						Longitude = feature.geometry.coordinates[0];
						Latitude = feature.geometry.coordinates[1];
						var strLng = Longitude.toString();
						var strLat = Latitude.toString();
						var strCoords = strLat + " " + strLng;

						layer.bindPopup("<table><td>"+ title.bold().big() + "</td>" + "<table><tr><th>" + "Coordinates: " + "</th>" + "<th>" + strCoords.link("https://www.google.com/maps/search/"+ strCoords) + "</th> </tr>" + "<tr><th>" + "Status: " + "</th>" + "<th>" + feature.properties.status + "</th>" + "</tr><tr><th>" + "Time: " + "</th>" + "<th>" + feature.properties.time + "</th>" + "</tr><tr><th>" + "Type: " + "</th>" + "<th>" + feature.properties.type,popupOptions + "</th></tr></table>");
						ID_arr.push(feature);				
				   }
				})
				.on('click', function(e){		
					actStatus = e.layer.feature.properties;


					statID=e.layer.feature.id;
					statID=parseInt(statID.substring(9));
					console.log(statID);
					//mymap.setView([e.layer.feature.geometry.coordinates[1],e.layer.feature.geometry.coordinates[0] ], 17);
				}).on('contextmenu', function(e){		
					actStatus = e.layer.feature.properties;


					statID=e.layer.feature.id;
					statID=parseInt(statID.substring(9));
					console.log(statID);
					//mymap.setView([e.layer.feature.geometry.coordinates[1],e.layer.feature.geometry.coordinates[0] ], 17);
				}).addTo(map);
			}
			
		});
	}
	setTimeout(function () {toRefresh();}, 0); 
	//setInterval(onLoadd, 30);
	
}
//setInterval(onLoadd, 5000);
	
//////////add layer control///////////
L.control.layers(basemaps).addTo(map);
	
////////////change properties//////////
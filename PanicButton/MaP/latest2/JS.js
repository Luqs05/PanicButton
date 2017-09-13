
//////////Implement map//////
var mymap = L.map('mapid').setView([-25.75395, 28.23053], 17);

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
var owsrootUrl = 'http://url:8080/geoserver/Devgroup/ows';
var defaultParameters = {
    service : 'WFS',
    version : '2.0',
    request : 'GetFeature',
    typeName : 'Devgroup3:incident',
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
	setTimeout(function () {toRefresh();}, 1000); 
	//setInterval(onLoadd, 30);
	
}
//setInterval(onLoadd, 5000);

mymap.on('layeradd', function(e){
	for(var i=0; i<ID_arr.length; i++){
	
		featureIDs.push(parseInt(ID_arr[i].id.substring(9)));
		  
		maxID = Math.max(...featureIDs);
		if(featureIDs[i]=maxID){
			latestLat=ID_arr[i].geometry.coordinates[0];
			latestLong=ID_arr[i].geometry.coordinates[1];
			
			/*WFSLayer.pointToLayer( function (feature, latlng) {
				
				switch (feature.id) {
				case maxID: return L.circleMarker(latlng, {radius:16,
					fillColor: "#FF0000",
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8,});					 
			}	});
			*/
			}
		}
		
	//console.log(maxID+' '+latestLat+""+ latestLong);
	zooomToI();
	
	
});	
function zooomToI(){
	mymap.setView([latestLong, latestLat], 17);
}
		
//////////add layer control///////////
L.control.layers(basemaps).addTo(mymap);

/////////locate user///////////
var userLat, userLong;
 mymap.locate({setView: true, watch: false})
	.on('locationfound', function(e){
		console.log("found");
		userLat=e.latitude;
		userLong=e.longitude;
		mymap.setView([latestC], 15);
		var circle = L.circle([userLat, userLong], e.accuracy/2,{
                weight: 1,
                color: 'blue',
                fillColor: '#cacaca',
                fillOpacity: 0.4
            });
			mymap.addLayer(circle);
	})
	
////////////change properties///////////

var stat;
function changeP (id){
	
	console.log('id '+ id);
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
	console.log('after if: '+ actStatus.status);
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

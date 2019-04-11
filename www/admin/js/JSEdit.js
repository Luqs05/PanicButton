function showCoordinates (e) {
	      alert(e.latlng);
      }

function centerMap (e) {
	map.panTo(e.latlng);
}


//////////Implement map//////
var map = L.map('mapidEdit', {
      contextmenu: true,
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
    },
    {
	    text: 'Insert a point here',
	    callback: InsertPoint,
	    index: 1
	},
	{
	    text: 'Edit point',
	    callback: UpdatePoint,
	    index: 1
	},
	{
	    text: 'Delete point',
	    callback: DeletePoint,
	    index: 1
	},
	{
        separator: true,
        index: 2
    }, {
	    text: 'Close this menu',
	    index: 2
	}]
    }).setView([-25.98161902, 28.21778458], 8);   

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
var circleradius = 8;

//add two sidebar
var sidebar = L.control.sidebar('sidebarInsert', {
    position: 'right',
	
});
map.addControl(sidebar);

var sidebar2 = L.control.sidebar('sidebarUpd', {
    position: 'left',
	
});
map.addControl(sidebar2);

function pointToLayer (feature, latlng){
						
					switch (feature.properties.status) {
					case 'Unattended': return UnattendedLayer = L.circleMarker(latlng, {radius: circleradius,
						fillColor: "#FF0000",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 1,});
					case 'attended': return L.circleMarker(latlng, {radius: circleradius,
						fillColor: "#00AF00",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 1,});
					case 'inProgress': return L.circleMarker(latlng, {radius: circleradius,
						fillColor: "#FFA500",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 1,});		 
			}
		}

var table;

function onLoadd(){
	function toRefresh(){
		var ajax = $.ajax({
			url : URL,
			dataType : 'jsonp',
			crossDomain: true,
			jsonpCallback : 'getJson',
			success : function (response) {
				WFSLayer = L.geoJson(response, {
					
					pointToLayer: pointToLayer,
						 
			
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

						layer.bindPopup("<table><td>"+ title.bold().big() + "</td>" + "<table><tr><th>" + "ID: " + "</th>" + "<th>" + feature.id + "</th>" + "</tr><tr><th>" + "Coordinates: " + "</th>" + "<th>" + strCoords.link("https://www.google.com/maps/search/"+ strCoords) + "</th> </tr>" + "<tr><th>" + "Status: " + "</th>" + "<th>" + feature.properties.status + "</th>" + "</tr><tr><th>" + "Time: " + "</th>" + "<th>" + feature.properties.time + "</th>" + "</tr><tr><th>" + "Type: " + "</th>" + "<th>" + feature.properties.type,popupOptions + "</th></tr></table>");
						ID_arr.push(feature);		
				   }
				})
				.on('click', function(e){		
					statID=e.layer.feature.id;
					var stat = e.layer.feature.properties.status;
					var type = e.layer.feature.properties.type;
					//var coordtemp = e.layer.geometry.coordinates;
					statID=parseInt(statID.substring(9));
					console.log(e.layer.feature.geometry.coordinates);
					var tempco1 = e.layer.feature.geometry.coordinates;

					var longTemp = tempco1[0].toString();
					var latTemp = tempco1[1].toString();
					console.log(latTemp, longTemp);

					table.search(statID+ " " + stat + " " + type + " " + latTemp + " " + longTemp).draw();

					
					console.log(statID);
					//mymap.setView([e.layer.feature.geometry.coordinates[1],e.layer.feature.geometry.coordinates[0] ], 17);
				})
				.on('contextmenu', function(e){		
					statID=e.layer.feature.id;
					statID=parseInt(statID.substring(9));
					console.log(statID);
					//mymap.setView([e.layer.feature.geometry.coordinates[1],e.layer.feature.geometry.coordinates[0] ], 17);
				}).addTo(map);


				var responses = [];
				var featureId;
				var featureType;
				var featureLat;
				var featureLng;

				for (var i = 0; i < response.features.length; i++) {
				  var currentFeature = response.features[i];

				  
				  featureId = currentFeature.id;
				  featureId = featureId.replace(/\D/g,'');
				  featureType= currentFeature.properties.type;
				  featureTime = currentFeature.properties.time;
				  featureStatus = currentFeature.properties.status;
				  featureLat = currentFeature.geometry.coordinates[1];
				  featureLng = currentFeature.geometry.coordinates[0];

				  responses.push({ featureId: featureId, featureName : featureType, featureTime: featureTime, featureStatus: featureStatus, featureLat: featureLat, featureLng: featureLng });
				  
				}

				console.log(responses);

				table = $('#example').DataTable( {
				 	scrollY: 120,
				 	scrollX: false,
				 	paging: true,
				 	destroy: true,
			        data: responses,
			        "order": [[ 0, "desc" ]],
			        "columns": [
			            { "data" : "featureId" },
            			{ "data": "featureName" },
            			{ "data" : "featureTime" },
            			{ "data" : "featureStatus" },
            			{ "data" : "featureLat" },
            			{ "data" : "featureLng" }
			        ]
			    } );

				 $('#example tbody').on('click', 'tr', function () {
				 	data = table.row( this ).data();
			        console.log(data.featureId);

			        map.setView([data.featureLat,data.featureLng ], 14);
			    } );

			}
			

		});
	}
        setTimeout(function () {toRefresh();}, 0); 
		//setInterval(onLoadd, 30); 
	    ws.onmessage = function(msg) {
	    	$.notify("There has been a change to the table", { position:"top right" });

	    	var snd = new  Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
                  		snd.play();
	    	
	    	WFSLayer.remove();
	    	toRefresh();


	};
}	
//////////add layer control///////////
L.control.layers(basemaps).addTo(map);
	
////////////change properties//////////
function InsertPoint (e) {
	document.getElementById('lat').value = e.latlng.lat;
	document.getElementById('lng').value = e.latlng.lng;
	sidebar.show();
}

function UpdatePoint (e) {
	document.getElementById('StatID_').value = statID;
	console.log(statID);
	console.log(StatID_);

	sidebar2.show();
}

function DeletePoint (e) {
	console.log(statID);

	var confirmation = confirm("Confirm deletion of point: "+statID);
    if (confirmation == true) {
        $.ajax({
		type: "POST",
		url: "delete.php",
		data:{statID:statID},
		});
    }

}

function close(){
	sidebar.hide();
}

function close2(){
	sidebar2.hide();
}

document.getElementById("closeDiv").onclick = function(){close()};
document.getElementById("closeDiv2").onclick = function(){close2()};

$(document).ready(function(){
    $("#toggleTable").click(function(){
        $("#tableDivEdit").slideToggle();
    });
});

map.on('click', function(e){		
					table.search(" ").draw();
					//mymap.setView([e.layer.feature.geometry.coordinates[1],e.layer.feature.geometry.coordinates[0] ], 17);
				});

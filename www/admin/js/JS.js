
//////////Implement map//////
var mymap = L.map('mapid').setView([-25.98161902, 28.21778458], 9);  

L.easyButton( '<i class="material-icons">aspect_ratio</i>', function(){
  mymap.setView([-25.98161902, 28.21778458], 9);
}).addTo(mymap)


//Code for baselayers
var OpenStreetMap =	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHVxczA1IiwiYSI6ImNpdm50eGc5ejAwMHEyb2w0bXNuNHl1OWkifQ.sQNjZWZBjou3uIQmEWdRWw', {
    attribution: 'Map data <a href="http://openstreetmap.org">OpenStreetMap</a> contributors', 
});
OpenStreetMap.addTo(mymap);

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
var LiveList = [];
var circleradius = 8;
var UnattendedLayer;


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
				}).addTo(mymap);


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
				 	scrollY: '28vh',
				 	scrollX: true,
				 	paging: false,
                    "bInfo" : false,
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

			        mymap.setView([data.featureLat,data.featureLng ], 14);
			    } );

			}
			

		});
	}
        //$.notify("There has been a change to the table", "warn");
        ws.onmessage = toRefresh();

        
}


//Make the Unattended features stand out on hovering over lblCntForMnt
$(document).ready(function(){
    $("#lblCntForMnt").hover(function(){
    	WFSLayer.eachLayer( function(layer){
    	if (layer.feature.properties.status == "Unattended")
    		{
    			layer.setStyle({
    				radius: circleradius +4
    			}
    			)
    			
    		}
    	}
    		)
    }, function(){
    	WFSLayer.eachLayer( function(layer){
    	if (layer.feature.properties.status == "Unattended")
    		{
    			layer.setStyle({
    				radius: circleradius
    			}
    			)
    			
    		}
    	}
    		)
    }
    );
});

//Make the inProgress features stand out on hovering over lblCntProgress
$(document).ready(function(){
    $("#lblCntProgress").hover(function(){
    	WFSLayer.eachLayer( function(layer){
    	if (layer.feature.properties.status == "inProgress")
    		{
    			layer.setStyle({
    				radius: circleradius +4
    			}
    			)
    			
    		}
    	}
    		)
    }, function(){
    	WFSLayer.eachLayer( function(layer){
    	if (layer.feature.properties.status == "inProgress")
    		{
    			layer.setStyle({
    				radius: circleradius
    			}
    			)
    			
    		}
    	}
    		)
    }
    );
});

//Make the attended features stand out on hovering over lblCntAttended
$(document).ready(function(){
    $("#lblCntAttended").hover(function(){
    	WFSLayer.eachLayer( function(layer){
    	if (layer.feature.properties.status == "attended")
    		{
    			layer.setStyle({
    				radius: circleradius +4
    			}
    			)
    			
    		}
    	}
    		)
    }, function(){
    	WFSLayer.eachLayer( function(layer){
    	if (layer.feature.properties.status == "attended")
    		{
    			layer.setStyle({
    				radius: circleradius
    			}
    			)
    			
    		}
    	}
    		)
    }
    );
});

$(document).ready(function(){
    $("#lblTotCnt").hover(function(){
    	WFSLayer.eachLayer( function(layer){
    	
    			layer.setStyle({
    				radius: circleradius +4
    			}
    			)
    			
    		
    	}
    		)
    }, function(){
    	WFSLayer.eachLayer( function(layer){
    		
    			layer.setStyle({
    				radius: circleradius
    			}
    			)
    			
    		
    	}
    		)
    }
    );
});



$(document).ready(function(){
    $("#btnEnvir").hover(function(){
    	WFSLayer.eachLayer( function(layer){
    	if (layer.feature.properties.type == "Environmental Incident")
    		{
    			layer.setStyle({
    				radius: circleradius-4,
                    weight:18,
                    color:"#7E3838"
    			}
    			)
    			
    		}
    	}
    		)
    }, function(){
    	WFSLayer.eachLayer( function(layer){
    	if (layer.feature.properties.type == "Environmental Incident")
    		{
    			layer.setStyle({
    				radius: circleradius,
                    weight:1,
                    color:"#000",
    			}
    			)
    			
    		}
    	}
    		)
    }
    );
});


$(document).ready(function(){
    $("#btnMed").hover(function(){
        WFSLayer.eachLayer( function(layer){
        if (layer.feature.properties.type == "Medical Emergency")
            {
                layer.setStyle({
                    radius: circleradius-4,
                    weight:18,
                    color:"#7C7E38"
                }
                )
                
            }
        }
            )
    }, function(){
        WFSLayer.eachLayer( function(layer){
        if (layer.feature.properties.type == "Medical Emergency")
            {
                layer.setStyle({
                    radius: circleradius,
                    weight:1,
                    color:"#000",
                }
                )
                
            }
        }
            )
    }
    );
});

$(document).ready(function(){
    $("#btnCrime").hover(function(){
        WFSLayer.eachLayer( function(layer){
        if (layer.feature.properties.type == "Criminal Activity")
            {
                layer.setStyle({
                    radius: circleradius-4,
                    weight:18,
                    color:"#7e6538"
                }
                )
                
            }
        }
            )
    }, function(){
        WFSLayer.eachLayer( function(layer){
        if (layer.feature.properties.type == "Criminal Activity")
            {
                layer.setStyle({
                    radius: circleradius,
                    weight:1,
                    color:"#000",
                }
                )
                
            }
        }
            )
    }
    );
});

$(document).ready(function(){
    $("#btnNan").hover(function(){
        WFSLayer.eachLayer( function(layer){
        if (layer.feature.properties.type == "No type")
            {
                layer.setStyle({
                    radius: circleradius-4,
                    weight:18,
                    color:"#A19898"
                }
                )
                
            }
        }
            )
    }, function(){
        WFSLayer.eachLayer( function(layer){
        if (layer.feature.properties.type == "No type")
            {
                layer.setStyle({
                    radius: circleradius,
                    weight:1,
                    color:"#000",
                }
                )
                
            }
        }
            )
    }
    );
});


////table function to remove search from table
mymap.on('click', function(e){        
                    table.search(" ").draw();
                    //mymap.setView([e.layer.feature.geometry.coordinates[1],e.layer.feature.geometry.coordinates[0] ], 17);
                });
	
//////////add layer control///////////
L.control.layers(basemaps).addTo(mymap);
	
///////////////////////
var mytime= setTimeout(function (){onLoadd()}, 50);

	


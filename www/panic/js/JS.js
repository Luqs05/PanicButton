


function upd(){
var mymap = L.map('mapid');
var userLat, userLong;
 mymap.locate({setView: true, watch: true})
	.on('locationfound', function(e){
		console.log("found");
		userLat=e.latitude;
		userLong=e.longitude;
		console.log(userLat + "  ,"+ userLong);
		
	})
	

}
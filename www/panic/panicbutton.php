<?php 

	session_start();
	$host        = "host=41.185.93.71";
	$port        = "port=5432";
	$dbname      = "dbname=devgroup3";
	$credentials = "user=postgres password=Raeesah1";
	
	$db = pg_connect("$host $port $dbname $credentials");
	if($db){
		echo 'connected';
	}
		
		$varlat = pg_escape_string($_POST['lng']);
		$varlng = pg_escape_string($_POST['lat']);
		$varaccu = pg_escape_string($_POST['accu']);
	
		
		$query1 = "INSERT INTO incident(accuracy, geom) VALUES ($varaccu, ST_GeomFromText('POINT($varlat $varlng)', 4326))";
		$result = pg_query($query1);
	
?>
<?php
	session_start();
	session_start();
	$host        = "host=41.185.93.71";
	$port        = "port=5432";
	$dbname      = "dbname=devgroup3";
	$credentials = "user=postgres password=Raeesah1";
	$db = pg_connect("$host $port $dbname $credentials");

	$varlat = pg_escape_string($_POST['lat']);
	$varlng = pg_escape_string($_POST['lng']);
	$type_fie = pg_escape_string($_POST['type_fie']);
	$status_fie = pg_escape_string($_POST['status_fie']);


	$query1 = "INSERT INTO incident(type, status, geom) VALUES ('$type_fie', '$status_fie', ST_GeomFromText('POINT($varlng $varlat)', 4326))";
	//$query1 = "INSERT INTO hazards(ecplus_fie, fieldwor_8, fieldwor_9, geom) VALUES ('$ecplus_fie', '$varlat', '$varlng', ST_SetSrid(ST_MakePoint('$varlng', '$varlat'), 32735));
	$result = pg_query($query1);
  if (!$result) {
  		$errormessage = pg_last_error();
      echo $query1;
      exit();
  }
  printf ("These values were inserted into the database - %s %s %s", $ecplus_fie, $varlat, $varlng);
  pg_close();

	header("Location: edit.html");
	exit;

?>
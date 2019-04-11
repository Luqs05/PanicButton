<?php 

	session_start();
	$host        = "host=127.0.0.1";
	$port        = "port=5432";
	$dbname      = "dbname=devgroup3";
	$credentials = "user=postgres password=password";
	$db = pg_connect("$host $port $dbname $credentials");
	
	
	$varstatID2 = pg_escape_string($_POST['StatID_']);
	$type_fie2 = pg_escape_string($_POST['type_fie2']);
	$status_fie2 = pg_escape_string($_POST['status_fie2']);


	$query5 = "UPDATE public.incident SET status = '$status_fie2', type = '$type_fie2' WHERE id = '$varstatID2'";
	$result = pg_query($query5);
	echo $query5 + 'posted';
	
	exit;
	
?>

<?php 

	session_start();
	$host        = "host=127.0.0.1";
	$port        = "port=5432";
	$dbname      = "dbname=devgroup3";
	$credentials = "user=postgres password=password";
	$db = pg_connect("$host $port $dbname $credentials");
	
	
	$varstatID2 = pg_escape_string($_POST['statID']);

	echo $varstatID2;


	$query5 = "DELETE FROM public.incident WHERE id = '$varstatID2'";
	$result = pg_query($query5);
	//echo $query5 + 'posted';
	
	exit;
	
?>

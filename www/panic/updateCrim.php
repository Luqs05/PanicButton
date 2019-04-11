<?php 

	session_start();
	$host        = "host=127.0.0.1";
	$port        = "port=5432";
	$dbname      = "dbname=devgroup3";
	$credentials = "user=postgres password=password";
	$db = pg_connect("$host $port $dbname $credentials");
	if($db){
		echo 'connected';
	}
		
	$query2 = "UPDATE public.incident SET type = 'Criminal Activity' WHERE id = (SELECT max(id) from public.incident)";
	$result = pg_query($query2);
?>

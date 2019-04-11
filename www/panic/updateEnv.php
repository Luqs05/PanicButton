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
		
	$query3 = "UPDATE public.incident SET type = 'Environmental Incident' WHERE id = (SELECT max(id) from public.incident)";
	$result = pg_query($query3);
	
		
		
		/*
		if (!$result) {
  		$errormessage = pg_last_error();
		echo $query1;
		exit();
		}
		
		printf ("These values were inserted into the database - %s %s %s" $varlat, $varlng);
		pg_close();

		header("Location: index.html");
		exit;*/
	
		?>
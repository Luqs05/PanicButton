<?php 

	session_start();
	$host        = "host=url";
	$port        = "port=5432";
	$dbname      = "dbname=devgroup";
	$credentials = "user=devgroup password=1234";
	$db = pg_connect("$host $port $dbname $credentials");
	if($db){
		echo 'connected';
	}
		
	$query2 = "UPDATE public.incident SET type = 'Criminal Activity' WHERE id = (SELECT max(id) from public.incident)";
	$result = pg_query($query2);
	
		
		
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
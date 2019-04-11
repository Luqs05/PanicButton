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
		
	$varstatus = pg_escape_string($_POST['stat']);
	$varstatID = pg_escape_string($_POST['statID']);

	$query5 = "UPDATE public.incident SET status = '$varstatus' WHERE id = '$varstatID'";
	$result = pg_query($query5);
	echo $query5 + 'posted';
	
		
		
		/*
		if (!$result) {
  		$errormessage = pg_last_error();
		echo $query1;
		exit();
		}
		
		printf ("These values were inserted into the database - %s %s %s" $varlat, $varlng);
		pg_close();*/
		exit;
	
		?>
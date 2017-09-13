<?php 
session_start();
	
	$headers = "From: SafetyCircle \r\n"; 
	$headers .= "Reply-To: safetycircle@gmail.com \r\n"; 
	$headers .= "MIME-Version: 1.0 \r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1 \r\n";
	$message = '<html><body><h1>The Panic Button has been pushed </h1><p>Follow this link to find the responder </p><link>http:/TestMap.html</link></body></html>';
	mail('email','HELP!',$message,$headers);
	
	$host        = "host=address";
	$port        = "port=5432";
	$dbname      = "dbname=devgroup";
	$credentials = "user=devgroup password=11223344";
	$db = pg_connect("$host $port $dbname $credentials");
	if($db){
		echo 'connected';
	}
		
		$varlat = pg_escape_string($_POST['lng']);
		$varlng = pg_escape_string($_POST['lat']);
		$varaccu = pg_escape_string($_POST['accu']);
	
		
		$query1 = "INSERT INTO incident(accuracy, geom) VALUES ($varaccu, ST_GeomFromText('POINT($varlat $varlng)', 4326))";
		$result = pg_query($query1);
		
		
		
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
	
		?>

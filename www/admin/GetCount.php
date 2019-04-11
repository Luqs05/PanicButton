<?php 
	

	//////start connection
	session_start();
	$host        = "host=41.185.93.71";
	$port        = "port=5432";
	$dbname      = "dbname=devgroup3";
	$credentials = "user=postgres password=Raeesah1";
	$db = pg_connect("$host $port $dbname $credentials");

	//queries to find incident types
	$query5 = pg_query($db, "SELECT COUNT(*) AS CrimCnt  FROM incident WHERE incident.type = 'Criminal Activity'");
	$query6 = pg_query($db, "SELECT COUNT(*) AS MedCnt  FROM incident WHERE incident.type = 'Medical Emergency'");
	$query7 = pg_query($db, "SELECT COUNT(*) AS EnvCnt  FROM incident WHERE incident.type = 'Environmental Incident'");
	$query8 = pg_query($db, "SELECT COUNT(*) AS NanCnt  FROM incident WHERE incident.type = 'No type'");

	//queries to find incident status
	$query9 = pg_query($db, "SELECT COUNT(*) AS AttCnt  FROM incident WHERE incident.status = 'attended'");
	$query10 = pg_query($db, "SELECT COUNT(*) AS inProgCnt  FROM incident WHERE incident.status = 'inProgress'");
	$query11 = pg_query($db, "SELECT COUNT(*) AS UnAttCnt  FROM incident WHERE incident.status = 'Unattended'");
	
	$CrimCnt = 0;
	$EnvCnt = 0;
	$MedCnt =0;
	$NanCnt =0;
	
	$AttCnt =0;
	$inProgCnt=0;
	$UnAttCnt=0;


	//echo the result so that ajax may retrieve an array of data
	//output array [CrimCnt as 0], [MedCnt as 1], [EnvCnt as 2], [NanCnt as 3]
	if (!$query5) {
    	die("Error in SQL query: " . pg_last_error());
	}
	
	while ($row = pg_fetch_array($query5)) {
	    //echo "Count: " . $row[0] . "<br />";
	    //echo $row[0];
	    $CrimCnt = $row[0];
	}
	echo $CrimCnt.",";

	if (!$query6) {
    	die("Error in SQL query: " . pg_last_error());
	}
	
	while ($row = pg_fetch_array($query6)) {
	    //echo "Count: " . $row[0] . "<br />";
	    //echo $row[0];
	    $MedCnt = $row[0];
	}
	echo $MedCnt.",";

	if (!$query7) {
    	die("Error in SQL query: " . pg_last_error());
	}
	
	while ($row = pg_fetch_array($query7)) {
	    //echo "Count: " . $row[0] . "<br />";
	    //echo $row[0];
	    $EnvCnt = $row[0];
	}
	echo $EnvCnt.",";

	if (!$query8) {
    	die("Error in SQL query: " . pg_last_error());
	}
	
	while ($row = pg_fetch_array($query8)) {
	    //echo "Count: " . $row[0] . "<br />";
	    //echo $row[0];
	    $NanCnt = $row[0];
	}
	echo $NanCnt.",";

	//output array [CrimCnt as 0], [MedCnt as 1], [EnvCnt as 2], [NanCnt as 3]
	if (!$query9) {
    	die("Error in SQL query: " . pg_last_error());
	}
	
	while ($row = pg_fetch_array($query9)) {
	    //echo "Count: " . $row[0] . "<br />";
	    //echo $row[0];
	    $AttCnt = $row[0];
	}
	echo $AttCnt.",";

	if (!$query10) {
    	die("Error in SQL query: " . pg_last_error());
	}
	
	while ($row = pg_fetch_array($query10)) {
	    //echo "Count: " . $row[0] . "<br />";
	    //echo $row[0];
	    $inProgCnt = $row[0];
	}
	echo $inProgCnt.",";

	if (!$query11) {
    	die("Error in SQL query: " . pg_last_error());
	}
	
	while ($row = pg_fetch_array($query11)) {
	    //echo "Count: " . $row[0] . "<br />";
	    //echo $row[0];
	    $UnAttCnt = $row[0];
	}
	echo $UnAttCnt.",";

	$TotalCnt = $AttCnt + $inProgCnt + $UnAttCnt;
	echo $TotalCnt;

?>
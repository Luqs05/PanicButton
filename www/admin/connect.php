<?php 
session_start();
	
	$headers = "From: SafetyCircle \r\n"; 
	$headers .= "Reply-To: safetycircle@gmail.com \r\n"; 
	$headers .= "MIME-Version: 1.0 \r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1 \r\n";
	$message = '<html><body><h1>The Panic Button has been pushed </h1><p>Follow this link to find the responder </p><link>http://41.185.93.71/map/</link></body></html>';
	mail('luqmaanhassim1@gmail.com','HELP!',$message,$headers);


	if(@mail('luqmaanhassim1@gmail.com', $subject, $message, $headers))
{
  echo "Mail Sent Successfully";
}else{
  echo "Mail Not Sent";
}
		?>
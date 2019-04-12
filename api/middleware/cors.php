<?php
	function kill()	 {
		header('HTTP/1.1 403 Forbidden');
		exit();
	}

	header('Access-Control-Allow-Headers: GET, POST, Authorization');
	header('Access-Control-Allow-Origin: http://homepie.net');

	if($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
		header('HTTP/1.1 201 CORS');
		exit();
	}
?>

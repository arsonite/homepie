<?php
	function getSalt($json = FALSE) {
		$file = file_get_contents('../../data/salt.json');
		return $json ? $file : json_decode($file);
	}
	
	function getToken() {
		return json_decode(file_get_contents('../../data/privateKey.json'))->PRIVATE_KEY;
	}

	function verifyToken() {
		$token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
		if($token != getToken()) {
			kill();
		}
	}
?>

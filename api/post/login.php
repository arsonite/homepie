<?php
	include '../middleware/cors.php';
	include '../middleware/db.php';

	function kill() {
		header('HTTP/1.1 403 Forbidden', TRUE, 403);
		exit();
	}

	if($_SERVER['REQUEST_METHOD'] == 'GET' && realpath(__FILE__) == realpath($_SERVER['SCRIPT_FILENAME'])
		|| !array_key_exists('hash', $_POST)) {
		kill();
	}
	
	$name = "Burak";
	$select = $db->query('SELECT `password` FROM `users` WHERE `name` = "' . $name . '"');
	$data = $select->fetchAll();
	$password = $data[0]['password'];

	$hash = $_POST['hash'];

	if($password != $hash) {
		header('HTTP/1.1 400', TRUE, 400);
		exit();
	}

	$json = file_get_contents('../../data/privateKey.json');
	$obj = json_decode($json);
	print_r($obj->PRIVATE_KEY);
?>

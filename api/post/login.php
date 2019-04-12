<?php
	include '../middleware/auth.php';
	include '../middleware/cors.php';
	include '../middleware/db.php';

	if($_SERVER['REQUEST_METHOD'] == 'GET' ||
		realpath(__FILE__) != realpath($_SERVER['SCRIPT_FILENAME']) ||
		!array_key_exists('hash', $_POST)) {
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

	print_r(getToken());
?>

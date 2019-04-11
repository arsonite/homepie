<?php
	include '../middleware/cors.php';

	$json = file_get_contents('../../data/salt.json');
	print_r($json);
?>

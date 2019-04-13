<?php
	include '../middleware/auth.php';
	include '../middleware/cors.php';

	if($_SERVER['REQUEST_METHOD'] == 'POST' ||
		realpath(__FILE__) != realpath($_SERVER['SCRIPT_FILENAME'])) {
		kill();
	}
	
	verifyToken();
	print_r('OK');
?>

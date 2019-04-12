<?php
	include '../middleware/auth.php';
	include '../middleware/cors.php';

	print_r(getSalt(TRUE));
?>

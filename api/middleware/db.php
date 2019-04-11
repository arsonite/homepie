<?php
	$acc = json_decode(file_get_contents('../../data/db.json'));
	$OPTION = [PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8', PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];
	try {
		$db = new PDO('mysql:host=' . $acc->HOST . ';dbname=' . $acc->NAME, $acc->USER, $acc->PSWD, $OPTION);
	} catch (PDOException $e) {
		exit('PDO Error: ' . $e->getMessage());
	}
?>

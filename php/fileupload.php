<?php	
	/* Browser response logging */
	print_r($_FILES);

	$target = dirname(__DIR__, 2) . "/uploads/";
	$file = $_FILES['uploadfile'];

	if(!empty($file['name'])) {
		if(move_uploaded_file($file['tmp_name'], "uploads/".$file['name'])) {
			print_r("Success!");
		} else {
			print_r("Error");
		}
	}	
?>

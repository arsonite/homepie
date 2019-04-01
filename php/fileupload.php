<?php	
	/* Custom upload directory, root document directory with backwards tree depth of 2 */ 
	$target = dirname(__DIR__, 2) . "/uploads/";
	
	/* Accessing client induced inner array of global file array */
	$files = $_FILES['uploadfile'];

	/* Available extensions */
	$ext = array(
		"img" => array(
			"jpeg", "jpg", "png", "tiff"
		),
		"vid" => array(
			"mp4", "h246", "mov", "avi", "flv"
		),
		"sfx" => array(
			"wav", "mp3", "m4a"
		),
		"txt" => array(
			"txt", "java", "h", "c", "sh", "bash", "py", "js", "html", "css", "less", "jsx"
		)
	);

	/* Browser response logging */
	print_r($_FILES);

	/* Returns file if it exists */
	$file = !empty($files['name']) ? $files['name'] : null;
	if($file != null) {
		/* Determines the subdirectory by evaluation file extension */
		$subdir = array_key_exists(); 

		if($subdir != null) {
			if(move_uploaded_file($files['tmp_name'], $target.$file)) {
				print_r("Success!");
			} else {
				print_r("Error");
			}
		}	
	}	
?>

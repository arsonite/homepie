<?php	
	/* Fallback if .htaccess doesn't work
	 * Overwriting default php.ini settings in local scope during runtime
	 */
	print_r(ini_get("upload_max_filesize");
	ini_set("upload_max_filesize", "1G");

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
			$path = $target.$subdir.$file;
			if(move_uploaded_file($files['tmp_name'], $path)) {
				print_r("Success! File saved under ".$path);
			} else {
				print_r("Error. Upload couldn't succeed");
			}
		}	
	}	
?>

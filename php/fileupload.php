<?php	
	/* Fallback if .htaccess doesn't work
	 * Overwriting default php.ini settings in local scope during runtime
	 */
	ini_set("max_file_uploads", "100");
	ini_set("upload_max_filesize", "1G");
	ini_set("max_filesize", "1G");
	ini_set("post_max_size", "1G");	

	/* Custom upload directory, root document directory with backwards tree depth of 2 */ 
	$target = dirname(__DIR__, 2) . "/uploads/";
	
	/* Accessing client induced inner array of global file array */
	$files = $_FILES['uploadfile'];

	/* Available filetypes and extensions */
	$fileTypes = array(
		"image" => array("img" => array("jpeg", "jpg", "png", "tiff")),
		"video" => array("vid" => array("mp4", "h246", "mov", "avi", "flv")),
		"audio" => array("sfx" => array("wav", "mp3", "m4a")),
		"text" => array("txt" => array("txt"))
	);

	/* Browser response logging */
	print_r($files);

	/* Returns file if it exists */
	$fileName = !empty($files['name']) ? $files['name'] : null;
	if($fileName != null) {
		$originalType = explode('/', $files['type'])[0];
		$fileType = key($fileTypes[$originalType]) ?: null;
		$fileExt = strtolower(explode('.', $fileName)[1]);

		/* Determines the subdirectory by evaluation file extension */
		$subdir = in_array($fileExt, $fileTypes[$originalType][$fileType]) ? $fileType."/" : null;
 		var_dump($fileTypes[$originalType][$fileType]);
		var_dump($subdir);
	
		if($subdir != null) {
			$path = $target.$subdir.$fileName;
			if(move_uploaded_file($files['tmp_name'], $path)) {
				print_r("Success! File saved under ".$path);
			} else {
				print_r("Error. Upload couldn't succeed");
			}
		}	
	}	
?>

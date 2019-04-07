<?php
	header('Access-Control-Allow-Headers: GET');
	header('Access-Control-Allow-Origin: http://homepie.net');

	function recursiveTreeTraversal($src, $depth = 0, $hidden = false) {
		if($fp = @opendir($src)) {
			$filedata = array();
			$newDepth = $depth - 1;
			$src = rtrim($src, '/').'/';

			while(false !== ($file = readdir($fp))) {
				if(!trim($file, '.') OR ($hidden == FALSE && $file[0] == '.')) {
				    continue;
				}

				if(($depth < 1 OR $newDepth > 0) && @is_dir($src.$file)) {
				    $filedata[$file] = recursiveTreeTraversal($src.$file.'/', $newDepth, $hidden);
				} else {
				    $filedata[] = $file;
				}
			}
			closedir($fp);
			return $filedata;
		}
		return false;
	}

	$source = dirname(__DIR__, 2).'/tmp/';
	$files = recursiveTreeTraversal($source, 2);
	echo json_encode($files);
?>

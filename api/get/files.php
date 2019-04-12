<?php
	include '../middleware/auth.php';
	include '../middleware/cors.php';
	
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

	$token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);

	if($token != getToken()) {
		kill();
	}

	$source = dirname(__DIR__, 2).'/tmp/';
	$files = recursiveTreeTraversal($source, 2);
	print_r(json_encode($files));
?>

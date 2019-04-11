#!/bin/bash

compile() {
	replace="css"
	temp=$1
	echo ${temp//less/$replace} # Parse and replace the path of the .less file with the new .css file
}

compress() {
	css=$1
	flag=$2
	pre=`cat $css`
	empty=""
	post=${pre/"\s+"/$empty} # Not compressing spaces according to rules yet, fml :(

	echo $css

	$v && echo ... Applying compression on "$css"
	echo $post > $css
	$v && echo ... Finished compressing "$css"
	$v && echo Saved, the compiled and compressed .css under "$css"

	# Print the flag and append it to the beginning of the temporary through the pipeline
	echo $flag | cat - $css > temp && mv temp $css
	echo Done.
	echo
}

compileAndCompress() {
	v=([ "$2" = "-v" ]) # Conditional statement that determines if verbose flag is set on script
	flag="/*#C#*/" # Custom appendage flag
	
	$v && echo ... Processing "$line"
	css=$(compile $line)		
	if [ -a $css ]; then
		$v && echo ... File already exists
		content=`cat $css`
		if [[ $content == *$flag* ]]; then # Reads file and evaluates if compression flag was set
			$v && echo "Compression flag is already set. Aborting..."
			echo
			return	
		fi
		compress $css $flag
		return
	fi

	$v && echo ... Compiling "$line"
	lessc $line $css # Compile the given .less file with the lessc-cli
	$v && echo ... Finished compiling "$line"
	
	# CSS-compression 
	compress $css $flag
}

if [[ $2 == *".less"* ]]; then # Triggers only the vimscript-dependent auto-compile function
	compileAndCompress $1 $2
else
	find . -name "*.less" | while read line; do
		compileAndCompress $line $2
	done
fi

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
	post=$(echo $pre | sed -e 's/\s+/''/g')
	# "*" gets replaced by directories, generally a bash problem

	$v && echo ... Applying compression on "$css"
	echo $post > $css
	$v && echo ... Finished compressing "$css"
	$v && echo Saved, the compiled and compressed .css under "$css"

	# Print the flag and append it to the beginning of the temporary through the pipeline
	echo "$flag" | cat - $css > temp && mv temp $css
	echo Done.
	echo
}

compileAndCompress() {
	v=([ "$1" = "-v" ]) # Conditional statement that determines if verbose flag is set on script
	o=([ "$2" = "-o" ]) # Conditional statement that determines if override flag is set on script
	flag="/*#C#*/" # Custom appendage flag
	
	$v && echo ... Processing "$3"
	css=$(compile $3)		
	$o && rm $css && echo ... Overwritten file
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

	$v && echo ... Compiling "$3"
	lessc $3 $css # Compile the given .less file with the lessc-cli
	$v && echo ... Finished compiling "$3"
	
	# CSS-compression 
	compress $css $flag
}

if [[ $3 == *".less"* ]]; then # Triggers only the vimscript-dependent auto-compile function
	compileAndCompress $1 $2 $3
else
	find . -name "*.less" | while read line; do
		compileAndCompress $1 $2 $line
	done
fi

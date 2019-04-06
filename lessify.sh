#!/bin/bash

compile() {
	replace="css"
	temp=$1
	echo ${temp//less/$replace} # Parse and replace the path of the .less file with the new .css file
}

# Function that appends a custom flag to the beginning of the specified file
flagFile() {
	flag=$1
	file=$2	
	# Print the flag and append it to the beginning of the temporary through the pipeline
	echo $flag | cat - $file > temp && mv temp $file
}

# Function that compiles and compresses .less files
compileAndCompress() {
	v=([ "$1" = "-v" ]) # Conditional statement that determines if verbose flag is set on script
	flag="/*#C#*/" # Custom appendage flag
	
	$v && echo ... Processing "$line"
	css=$(compile $line)		
	if [ -a $css ]; then
		content=`cat $css`
		if [[ $content == *$flag* ]]; then # Reads file and evaluates if compression flag was set
			$v && echo "File exists and is already flagged. Aborting..."
			return
		fi
	fi

	$v && echo ... Compiling "$line"
	lessc $line $css # Compile the given .less file with the lessc-cli
	$v && echo ... Finished compiling "$line"

	$v && echo ... Applying compression on "$css"
	cleancss -o $css $css # Compress the .css file with the cleancss-cli
	$v && echo ... Finished compressing "$css"
	$v && echo Saved, the compiled and compressed .css under "$css"

	flagFile $flag $css
	$v && echo "... Applied flag " $flag " to " $css
}

if [[ $3 == *".less"* ]]; then # Triggers only the vimscript-dependent auto-compile function
	lessc $3 $(compile $3)
else
	find . -name "*.less" | while read line; do
		compileAndCompress $1
	done
fi

#!/bin/bash

# Implement algorith which flags already compressed and compiled files with this shell script with a /*#!c!#*/ flag to save processing power by skipping them

compileAndCompress() {
	v=$1
	
	[ $v = 1 ] && echo ... Processing "$line"
	replace="css"
	css=${line//less/$replace}
	[ $v = 1 ] && echo ... Compiling "$line"
	lessc $line $css
	[ $v = 1 ] && echo ... Finished compiling "$line"

	[ $v = 1 ] && echo ... Applying compression on "$css"
	cleancss -o $css $css
	[ $v = 1 ] && echo ... Finished compressing "$css"
	[ $v = 1 ] && echo Saved, the compiled and compressed .css under "$css"
}

find . -name "*.less" | while read line; do
	if [ "$1" = "-v" ]; then
		compileAndCompress 1
	else
		compileAndCompress 0
	fi
done

echo Exiting script.

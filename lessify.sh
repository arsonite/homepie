#!/bin/bash

#availableFlags=
#flags="$@"

if [ "$1" = "-v" ]; then
	find . -name "*.less" | while read line; do
		echo ... Processing "$line"
		replace="css"
		css=${line//less/$replace}

		echo ... Compiling "$line"
		lessc $line $css
		echo ... Finished compiling "$line"

		echo ... Applying compression on "$line"
		cleancss -o $css $css
		echo ... Finished compressing "$line"

		echo Saved compiled and compresse css under "$css"
	done
fi

echo Exiting script.

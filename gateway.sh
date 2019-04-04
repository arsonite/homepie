#!/bin/bash

bokeh=true
args=$@

echo $#

if [ "$#" -lt 1 ]; then
		
else
	while [[ bokeh ]]; do
		read -p "What do you want to do?"
	done
fi

echo Goodbye.

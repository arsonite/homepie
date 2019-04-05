#!/bin/bash

if [[ $3 == *".less"* ]]; then
	path=$3
	replace="css"
	lessc $path ${path/less/$replace}
fi

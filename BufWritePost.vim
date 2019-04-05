"Old
"autocmd BufWritePost * silent! execute '!/home/pi/Access/www/homepie.ddns.net/public/autoCompile.sh >/dev/null 2>&1 %:p' | redraw!

"Alternative
autocmd BufWritePost *.less silent! !/home/pi/Access/www/homepie.ddns.net/public/autoCompile.sh ">/dev/null" "2>&1" %:p

"Old and outdated
"autocmd BufWritePost * silent! execute '!/home/pi/Access/www/homepie.ddns.net/public/autoCompile.sh >/dev/null 2>&1 %:p' | redraw!

"Alternative
"       :event       :regex :silent-execution-flag :absolute path                               :supress verbose   :pass path
autocmd BufWritePost *.less silent! !/home/pi/Access/www/homepie.ddns.net/public/autoCompile.sh ">/dev/null" "2>&1" %:p

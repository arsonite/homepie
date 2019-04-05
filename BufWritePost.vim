":cmd 	:event	 :regx :supr  :exec     :path to shell script                                        :pass absolute path :redraw vim-panel
autocmd BufWritePost * silent! execute "!/home/pi/Access/www/homepie.ddns.net/public/autoCompile.sh >/dev/null 2>&1 %:p" | redraw!

"Old and outdated
"autocmd BufWritePost * silent! execute '!/home/pi/Access/www/homepie.ddns.net/public/autoCompile.sh >/dev/null 2>&1 %:p' | redraw!

"Alternative
	"# autocmd: auto-command 
	"# BufWritePost: event
	"# *.less: regex that matches only .less files
	"# silent!: flag to surpress debug messages
	"# 0: throwing off verbose
	"# %:p: pass absolute path
	"# >/dev/null 2>&1: pass off developer messages
autocmd BufWritePost *.less silent! execute "!/home/pi/Access/www/homepie.net/lessify.sh 0 %:p >> /dev/null 2>&1 &"

/* It makes more sense to catch unallowed extensions in the front-end, but for training purposes I do it on the backend */
//const ALLOWED_EXT = ['jpeg', 'jpg', 'png'];
/*const FILE_TYPES = {
	"image": "img",
	"video": "vid",
	"audio": "sfx",
	"text" : "txt"
}*/

const _ = undefined;

let files = [];
let uploadBuffer = _;
let uploadSize = 0;
let progress = 0;

function handleCompletion(e) {
	progress += uploadBuffer.size;
	getRessources();
	
}

function handleError(e) {
	alert("Upload failed");
}

function handleProgress(e) {
	let p = progress + e.loaded;
	//console.log((p / uploadSize) + "%");
}

/* Sacrificing runtime efficiency to enable logging and progress callback */
function postFiles() {	
	const URL = "http://homepie.ddns.net/php/fileupload.php";

	for(let f of files) {
		uploadBuffer = f;
	
		let xhr = new XMLHttpRequest(); // Creating AJAX-req
		xhr.open('POST', URL); // URL and req-type
		
		xhr.addEventListener("load", handleCompletion);
		xhr.addEventListener("Error", handleError);
		xhr.upload.addEventListener("progress", handleProgress);	

		let data = new FormData(); // FormData-object to handle formless file
		data.append('uploadfile', uploadBuffer);
		xhr.send(data);

		/* Response-Logging using Fetch-API */
		fetch(URL, {
			method: "POST",
			body: data,
		}).then(response => {
			console.log(response);
		})
	}
}

function handleDrop(e) {
	e.stopPropagation();
  	e.preventDefault();

	let fileList = e.dataTransfer.files;

	for(let f of fileList) {
		/* Listing all the files */
		uploadSize += f.size;
		files.push(f);
	}
	postFiles();
}

function handleDragOver(e) {
	e.stopPropagation();
	e.preventDefault();

	e.dataTransfer.dropEffect = 'copy';
}

function getRessources() {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://homepie.ddns.net/php/fileretrieval.php');
	xhr.send();

	xhr.addEventListener('load', function() {
		let tree = JSON.parse(this.response);
			
		let ressources = document.getElementById('ressources');
		ressources.innerHTML = "";
		Object.keys(tree).forEach(dir => {
			let drop = document.createElement('div');
			drop.id = dir;
			drop.className = 'drop';
			
			let label = document.createElement('span');
			label.className = 'label';
			label.innerHTML = drop.id;
			drop.appendChild(label);

			let content = document.createElement('div');
			content.className = 'content';		
			drop.appendChild(content);

			tree[dir].forEach(file => {
				let node = document.createElement('div');
				node.id = file;
				node.className = 'node';
				node.innerHTML = node.id;

				content.appendChild(node);
			});
			
			ressources.appendChild(drop);
		});
	});
}

document.addEventListener('DOMContentLoaded', function() {
	let dropzone = document.getElementById('dropzone');
	dropzone.addEventListener('drop', handleDrop);
	dropzone.addEventListener('dragover', handleDragOver);

	getRessources();
});

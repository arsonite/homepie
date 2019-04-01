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
}

function handleError(e) {
	alert("Upload failed");
}

function handleProgress(e) {
	let p = progress + e.loaded;
	console.log((p / uploadSize) + "%");
}

/* Sacrifinc runtime efficiency to enable logging and progress callback */
function upload() {	
	for(let f of files) {
		uploadBuffer = f;
	
		let xhr = new XMLHttpRequest(); // Creating AJAX-req
		xhr.open('POST', '../php/fileupload.php'); // URL and req-type
		
		xhr.addEventListener("load", handleCompletion);
		xhr.addEventListener("Error", handleError);
		xhr.upload.addEventListener("progress", handleProgress);	

		let data = new FormData(); // FormData-object to handle formless file
		data.append('uploadfile', uploadBuffer);
		xhr.send(data);

		/* Response-Logging using Fetch-API */
		fetch("../php/fileupload.php", {
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

	files = e.dataTransfer.files;

	let ul = document.createElement('ul');
	for(let f of files) {
		/* Listing all the files */
		let li = document.createElement('li');
		li.innerHTML = "<b>" + f.name + "</b>";
		li.innerHTML += " (" + f.type || "n/a";
		li.innerHTML += ") - " + f.size/1000 + " kb";	
		ul.appendChild(li);

		uploadSize += f.size;
	}
	ul.innerHTML += "Total upload size: " + uploadSize/1000 + " kb";
	document.getElementById('drop').appendChild(ul);

	upload();
}

function handleDragOver(e) {
	e.stopPropagation();
	e.preventDefault();

	e.dataTransfer.dropEffect = 'copy';
}

var drop = document.getElementById('drop');
drop.addEventListener('drop', handleDrop);
drop.addEventListener('dragover', handleDragOver);

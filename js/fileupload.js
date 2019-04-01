const ALLOWED_EXT = ['jpeg', 'jpg', 'png'];
const _ = undefined;

let files = [];
let uploadBuffer = _;

let uploadSize = 0;
let progress = 0;

function uploadCompleted(e) {
	progress += uploadBuffer.size;
}

function errorHandling(e) {
	alert("Upload failed");
}

function calculateProgress(e) {
	let p = progress + e.loaded;
	console.log((p / progress) + "%");
}

/* Sacrifinc runtime efficiency to enable logging and progress callback */
function upload() {	
	for(let f of files) {
		uploadSize += f.size;
		uploadBuffer = f;
	
		let xhr = new XMLHttpRequest(); // Creating AJAX-req
		xhr.open('POST', '../php/fileupload.php'); // URL and req-type
		
		xhr.upload.addEventListener("progress", calculateProgress);
		xhr.addEventListener("load", uploadCompleted);
		xhr.addEventListener("Error", errorHandling);

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

function dropEvent(e) {
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
	}
	ul.innerHTML += "Total upload size: " + uploadSize/1000 + " kb";
	document.getElementById('drop').appendChild(ul);

	upload();
}

function dragOver(e) {
	e.stopPropagation();
	e.preventDefault();

	e.dataTransfer.dropEffect = 'copy';
}

var drop = document.getElementById('drop');
drop.addEventListener('drop', dropEvent);
drop.addEventListener('dragover', dragOver);

import auth from '/auth.js';

const LOC = window.location;

//auth.setToken('accessToken');

const URL = LOC.protocol + '//api.' + LOC.hostname.replace('www\.', '') + '/';   
const GET_FILES = URL + 'fileretrieval.php';
const POST_FILE = URL + 'fileupload.php';

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
	alert('Upload failed');
}

function handleProgress(e) {
	let p = progress + e.loaded;
	//console.log((p / uploadSize) + "%");
}

/* Sacrificing runtime efficiency to enable logging and progress callback */
function postFiles() {	
	const POST = URL + 'fileupload.php';

	for(let f of files) {
		uploadBuffer = f;
	
		let xhr = new XMLHttpRequest(); // Creating AJAX-req
		xhr.open('POST', POST); // URL and req-type
		
		xhr.addEventListener('load', handleCompletion);
		xhr.addEventListener('Error', handleError);
		xhr.upload.addEventListener('progress', handleProgress);	

		let data = new FormData(); // FormData-object to handle formless file
		data.append('uploadfile', uploadBuffer);
		xhr.send(data);

		/* Response-Logging using Fetch-API */
		fetch(POST, {
			method: 'POST',
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
	const GET = URL + 'fileretrieval.php';

	let xhr = new XMLHttpRequest();
	xhr.open('GET', GET);
	xhr.send("Hello World");

	/* Response-Logging using Fetch-API */
	fetch(GET, {
		method: "GET"
	}).then(response => {
		console.log(response);
	})

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
			label.addEventListener('click', function(e) {
				const c = ' collapsed';
				let node = e.target.parentElement.childNodes[1];
				let className = node.className;
				node.className = className.includes(c) ? 'content' : className + c;
			});
			drop.appendChild(label);

			let content = document.createElement('div');
			content.className = 'content';		
			drop.appendChild(content);

			tree[dir].forEach(file => {
				let node = document.createElement('div');
				node.className = 'node';

				let fileName = document.createElement('p');
				fileName.className = 'fileName';
				fileName.innerHTML = file;
				node.appendChild(fileName);
			
				let img = document.createElement('img');
				img.src = URL + 'res/' + 'image' + '_symbol.svg'; 
				node.appendChild(img);
	
				let dataFrame = document.createElement('span');
				dataFrame.className = 'dataFrame';
				let collapser = document.createElement('p');
				collapser.className = 'collapser';
				collapser.innerHTML = 'V';
				node.appendChild(dataFrame);

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

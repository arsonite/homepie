function assembleNavigation() {
	const imgPath = '/res/icon/nav/';
	const data = ['FileManager', 'Profile', 'Settings', 'API', 'Lockkliye', 'Synthia'];
	
	let nav = document.createElement('nav');

	let box = document.createElement('div');
	box.className = 'box';
	nav.appendChild(box);

	data.forEach(sub => {
		let imageBox = document.createElement('div');
		imageBox.className = 'imageBox';
		box.appendChild(imageBox);
		
		let string = sub.toLowerCase();
		let a = document.createElement('a');
		a.id = string;
		a.className = 'image';
		a.href = '/' + string;
		let img = document.createElement('img');
		img.src = imgPath + string + '.svg';
		a.appendChild(img);
		imageBox.appendChild(a);

		let span = document.createElement('span');
		span.innerHTML = sub;
		imageBox.appendChild(span);
	});
	return nav;
}

let jwt = sessionStorage.getItem('token');
if(jwt !== null) {
	(async () => {
		let compare = await new Promise(resolve => {
			let xhr = new XMLHttpRequest();
			xhr.open('GET', 'http://api.homepie.net/get/verifyToken.php');
			xhr.setRequestHeader('Authorization', 'Bearer ' + jwt);
			xhr.onload = function(e) {
				resolve(xhr.response);
			};
			xhr.send();
		});
		if(compare === 'OK') {
			document.getElementById('root').innerHTML = '';	
			document.getElementById('root').appendChild(assembleNavigation());	
		}
	})()	
}

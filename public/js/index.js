import * as auth from './auth.mjs';

const MD5 = new Hashes.MD5;
const SHA256 = new Hashes.SHA256;
const SHA512 = new Hashes.SHA512;

document.addEventListener('DOMContentLoaded', function() {
	const url = window.location.protocol + '//api.' + window.location.hostname.replace('www\.', '') + '/';
	const get = url + 'get/salt.php';
	const post = url + 'post/login.php';
	
	(async () => {
		const res = await new Promise(resolve => {
			let xhr = new XMLHttpRequest();
			xhr.open('GET', get);
			xhr.onload = function(e) {
				resolve(xhr.response);
			};
			xhr.send();
		});			
		
		const config = JSON.parse(res);
		const entropy = 10000;
		const salt1 = config.SALT1;
		const salt2 = config.SALT2;

		let names = document.getElementsByClassName('name');
		for(let name of names) {
			name.addEventListener('click', function(e) {
				let user = {
					name: e.target.innerHTML,
					password: '',
					admin: 0,
					color: window.getComputedStyle(e.target.parentElement.children[0]).backgroundColor
				};

				let login = document.createElement('div');
				login.id = 'login';
				login.style.backgroundColor = user.color;

				let username = document.createElement('span');
				username.id = 'username';
				username.innerHTML = 'Profil: ' + user.name;
				login.appendChild(username);

				let passwordFrame = document.createElement('div');
				passwordFrame.id = 'passwordFrame';
				login.appendChild(passwordFrame);
				
				let password = document.createElement('input')
				password.id = 'password';
				password.type = 'password';
				passwordFrame.appendChild(password);

				let loginButton = document.createElement('button');
				loginButton.id = 'loginButton';
				loginButton.className = 'roundButton';
				loginButton.innerHTML = 'Anmelden';
				loginButton.addEventListener('click', function(e) {
					for(let i = 0; i < entropy; i++) {
						user.password = SHA512.hex_hmac(SHA256.hex_hmac(password.value, salt1), salt2);
					}
					(async () => {
						const token = await new Promise(resolve => {
							let xhr2 = new XMLHttpRequest();
							xhr2.open('POST', post);
							let data = new FormData(); // FormData-object to handle formless file
							data.append('hash', user.password);
							xhr2.onload = function(e) {
								resolve(xhr2.response);
							};
							xhr2.send(data);
						});
						if(token.length > 0) {
							setToken(token);
							console.log(sessionStorage);
						}
					})()	
				});
				passwordFrame.appendChild(loginButton);

				let modal = document.createElement('div');
				modal.id = 'modal';
				modal.addEventListener('click', function(e) {
					document.getElementById('root').removeChild(e.target.parentElement);
				});

				let loginFrame = document.createElement('div');
				loginFrame.id = 'loginFrame';
				loginFrame.appendChild(login);
				loginFrame.appendChild(modal);

				document.getElementById('root').appendChild(loginFrame);
			});
		}
	})()
});

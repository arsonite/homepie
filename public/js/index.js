document.addEventListener('DOMContentLoaded', function() {
	let names = document.getElementsByClassName('name');
	
	for(let name of names) {
		name.addEventListener('click', function(e) {
			let user = {
				name: e.target.innerHTML,
				password: '',
				admin: 0,
				color: window.getComputedStyle(e.target.parentElement.children[0]).backgroundColor
			};
			console.log(user);
	
					
		
			let login = document.createElement('div');
			login.id = 'login';
			login.style.backgroundColor = user.color;
			
			let username = document.createElement('span');
			username.id = 'username';
			username.innerHTML = 'Profil: ' + user.name; 
			login.appendChild(username);

			let passwordFrame = document.createElement

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
});

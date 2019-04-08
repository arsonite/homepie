document.addEventListener('DOMContentLoaded', function() {
	let profiles = document.getElementsByClassName('profile');
	
	for(let profile of profiles) {
		profile.addEventListener('click', function(e) {
			let user = {
				id: e.target.id
			};

			let login = document.createElement('div');
			login.id = 'login';

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

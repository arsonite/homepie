document.addEventListener('DOMContentLoaded', function() {
	const users = {
		'Burak': true,
		'Beyza': false,
		'Yasar': false,
	};

	let main = document.createElement('main');
	document.getElementById('root').appendChild(main);
	
	let box = document.createElement('box');
	box.className = 'box';
	main.appendChild(box);	

	Object.keys(users).forEach(user => {
		let profile = document.createElement('div');
		profile.id = user.toLowerCase();
		profile.className = 'profile';
		box.appendChild(profile);

		const admin = users[user];
		let cat = document.createElement('div');
		cat.id = admin ? 'admin' : 'user';
		cat.className = 'cat';
		cat.innerHTML = admin ? 'Admin' : 'User';
		profile.appendChild(cat);

		let name = document.createElement('div');
		name.className = 'name';
		name.innerHTML = user;
		profile.appendChild(name);
	});
});

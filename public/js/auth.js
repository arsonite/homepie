const key = 'token';

function authenticate(user, password) {
	const url = config.API_URL + config.AUTH;
	let login = new XMLHttpRequest();
	xhr.open('POST', );
}

function setToken(token) {
	sessionStorage.set(key, token);
}

function getToken() {
	return sessionStorage.getItem(key);
}

export default {
	authenticate,
	setToken,
	getToken
};

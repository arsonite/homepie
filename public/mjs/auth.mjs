const key = 'token';

function authenticate(user, password) {
}

function setToken(token) {
	sessionStorage.set(key, token);
}

function getToken() {
	return sessionStorage.getItem(key);
}

export {
	authenticate,
	setToken,
	getToken
};

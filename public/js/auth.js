import { config } from '../config.js';

const token = 'token';

function authenticate(user, password) {
	const url = config.API_URL + config.AUTH;
	console.log(url);
	let login = new XMLHttpRequest();
	xhr.open('POST', );
}

function setToken(jwt) {
	console.log(API_URL);
	sessionStorage.set(token, jwt);
}

function getToken() {
	return sessionStorage.getItem(token);
}

export default {
	authenticate,
	setToken,
	getToken
};

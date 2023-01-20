import axios from 'axios';
import { decode as base64_decode } from 'base-64';

import firebaseApp from './firebase';

const auth = firebaseApp.auth();

const schema = localStorage.getItem('database') || 'schema1';

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_ROUTE,
	headers: {
		'x-schema-connection': schema,
		'Content-Type': 'application/json'
	}
});

export const axiosAuthInstance = axios.create({
	baseURL: import.meta.env.VITE_API_ROUTE,
	headers: {
		'x-schema-connection': schema,
		'Content-Type': 'application/json'
	}
});

const requestNewAccessToken = async () => {
	const accessToken = (await auth.currentUser?.getIdToken(true)) ?? null;

	if (!accessToken) throw Error(`unable to request new access token`);

	localStorage.setItem('token', accessToken);

	return accessToken;
};

const checkAccessTokenIsExpired = accessToken => {
	const decodedJson = base64_decode(accessToken.split(`.`)[1]).toString();
	const { exp } = JSON.parse(decodedJson);

	return Date.now() >= exp * 1000;
};

axiosAuthInstance.interceptors.request.use(
	async config => {
		let accessToken = localStorage.getItem('token');
		let client = JSON.parse(JSON.parse(localStorage.getItem('client_id')));
		console.log(client);

		if (!accessToken || checkAccessTokenIsExpired(accessToken)) {
			try {
				accessToken = await requestNewAccessToken();
			} catch (e) {
				return config;
			}
		}

		const newConfig = {
			headers: {
				'x-schema-connection': schema
			},
			...config
		};

		newConfig.headers.Authorization = `Bearer ${accessToken}`;
		newConfig.baseURL = `${import.meta.env.VITE_API_ROUTE + client.schema}/`;

		return newConfig;
	},
	error => Promise.reject(error)
);

axiosInstance.interceptors.request.use(
	async config => {
		let accessToken = localStorage.getItem('token');

		if (!accessToken || checkAccessTokenIsExpired(accessToken)) {
			try {
				accessToken = await requestNewAccessToken();
			} catch (e) {
				return config;
			}
		}

		const newConfig = {
			headers: {
				'x-schema-connection': schema
			},
			...config
		};

		newConfig.headers.Authorization = `Bearer ${accessToken}`;

		return newConfig;
	},
	error => Promise.reject(error)
);

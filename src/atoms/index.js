import { atom } from 'recoil';

export const authState = atom({
	key: 'AUTHSTATE',
	default: {
		user: Object,
		userRole: Object,
		isAuthenticated: false
	}
});

export const populationState = atom({
	key: 'POPULATIONSTATE',
	default: {
		data: null,
		populationName: '',
		isLoading: false
	}
});

import { axiosInstance } from './axios';

const AdminService = {
	async getAllUser() {
		const { data } = await axiosInstance.get('/get-user');

		const $data = data;

		return $data;
	},
	async postCreateUser(payload) {
		const { data } = await axiosInstance.post('/create-user', payload);
		const $data = data;

		return $data;
	},
	async postUpdateUser(payload) {
		const { data } = await axiosInstance.post('/update-user', payload);
		const $data = data;

		return $data;
	},
	async postChangeUserPassword(payload) {
		const { data } = await axiosInstance.post('/change-password-user', payload);
		const $data = data;

		return $data;
	},
	async postDelUser(payload) {
		const { data } = await axiosInstance.post('/del-user', payload);
		const $data = data;

		return $data;
	}
};

export default AdminService;

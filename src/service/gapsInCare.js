import { axiosAuthInstance } from './axios';

const GapsInCare = {
	async list(page = 1, perPage = 50) {
		const { data } = await axiosAuthInstance.get(`gaps-in-care?page=${page}&perPage=${perPage}`);

		const $data = data.data;

		return $data;
	},
	async getId(tin, provider_id, chvmemnbr) {
		const { data } = await axiosAuthInstance.get(
			`gaps-in-care-list?tin=${tin}&provider_id=${provider_id}&chvmemnbr=${chvmemnbr}`
		);

		const $data = data.data;

		return $data;
	}
};

export default GapsInCare;

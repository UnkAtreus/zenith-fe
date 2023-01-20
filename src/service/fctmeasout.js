import { axiosAuthInstance } from './axios';

const FctmeasoutService = {
	async list(id, measure, page = 1, perPage = 50) {
		const { data } = await axiosAuthInstance.get(`fctmeasout?measure=${measure}&page=${page}&perPage=${perPage}`);

		const $data = data.data;

		return $data;
	}
};

export default FctmeasoutService;

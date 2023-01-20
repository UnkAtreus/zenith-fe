import { axiosAuthInstance } from './axios';

const RateSummaryService = {
	async list(id, page = 1, perPage = 50) {
		const { data } = await axiosAuthInstance.get(`/rate-summary?id=${id}&page=${page}&perPage=${perPage}`);

		const $data = data.data;

		return $data;
	}
};

export default RateSummaryService;

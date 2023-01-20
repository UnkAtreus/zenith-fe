import { axiosAuthInstance } from './axios';

const StatisticService = {
	async getStatic(id) {
		const { data } = await axiosAuthInstance.get(`/statistic?id=${id}`);

		const $data = data.data;

		return $data;
	}
};

export default StatisticService;

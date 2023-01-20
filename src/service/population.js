import { axiosAuthInstance } from './axios';

const PopulationService = {
	async list() {
		const { data } = await axiosAuthInstance.get('/population');

		const $data = data.data;

		return $data;
	}
};

export default PopulationService;

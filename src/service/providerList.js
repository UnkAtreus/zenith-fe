import { axiosAuthInstance } from './axios';

const ProviderList = {
	async list(page = 1, perPage = 50, npi = '') {
		const { data } = await axiosAuthInstance.get(`provider-list?page=${page}&perPage=${perPage}&npi=${npi}`);

		const $data = data.data;

		return $data;
	},
	async getMemberList(tin, provider_id, npi, measure, numtag, page = 1, perPage = 50) {
		const { data } = await axiosAuthInstance.get(
			`provider-member-list?tin=${tin}&provider_id=${provider_id}&npi=${npi}&measure=${measure}&numtag=${numtag}&page=${page}&perPage=${perPage}`
		);

		const $data = data.data;

		return $data;
	}
};

export default ProviderList;

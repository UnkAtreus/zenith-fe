import { axiosAuthInstance } from './axios';

const MemberDetailService = {
	async list(userId, type) {
		const { data } = await axiosAuthInstance.get(`member-detail?id=${userId}&type=${type}`);

		const $data = data.data;

		return $data;
	}
};

export default MemberDetailService;

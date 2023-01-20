export default function makeColumn(column) {
	return column.map(item => {
		return {
			title: item,
			dataIndex: item,
			key: item
		};
	});
}

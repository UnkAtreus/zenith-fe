export default function makeDropdown(dropdowns) {
	return dropdowns.map(item => {
		return {
			text: item,
			value: item
		};
	});
}

export function makeFilterList(data, key) {
	const filter = [];
	data.forEach(item => {
		if (item[key] != null) filter.push(item[key]);
	});
	return [...new Set(filter)];
}

export default function makeDropdown(dropdowns) {
	return dropdowns.map(item => {
		return {
			text: item,
			value: item
		};
	});
}

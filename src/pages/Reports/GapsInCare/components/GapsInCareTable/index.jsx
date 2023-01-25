import React, { useEffect, useState } from 'react';

import { Button, PageHeader, Breadcrumb, Table, Row, Statistic, Col, message } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import GapsInCare from '@/service/gapsInCare';
import RateSummaryService from '@/service/rateSummary';
import {
	MEASURE_ID,
	MEM_LAST,
	SUB_MEASURE,
	MEM_GENDER,
	MEM_First,
	PROVSPEC,
	PROVID_PROV,
	MEM_FULL_PROV
} from '@/store/table_column';
import makeDropdown from '@/utilities/makeDropdown';

function GapsInCareTable({ setStep, setGapsInCareRecord }) {
	const [data, setData] = useState([]);
	const [column, setColumn] = useState([]);
	const [explainableData, setExplainableData] = useState([]);
	const [explainableColumns, setExplainableColumns] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingExport, setIsLoadingExport] = useState(false);
	const [pagination, setPagination] = useState({
		total: 0,
		current: 1,
		perPage: 50
	});

	//const filter_meature1 = makeDropdown(MEM_GENDER);
	const filter_meature3 = makeDropdown(PROVSPEC);
	const filter1 = makeDropdown(PROVID_PROV);
	const filter2 = makeDropdown(MEM_FULL_PROV);

	const navigate = useNavigate();

	const haldleExport = async () => {
		setIsLoadingExport(true);
		const excel = new Excel();

		const { total, columns } = await GapsInCare.exportList();
		const totalPages = Math.ceil(total / 500.0);
		const texts = await Promise.all(
			Array(totalPages)
				.fill(0)
				.map(async (u, i) => {
					const { data } = await GapsInCare.exportList(i + 1, 500);
					return data;
				})
		);

		const data = [];
		texts.forEach((d, i) => {
			d.forEach(item => {
				data.push(item);
			});
		});

		console.log(`export step 1`);
		excel.addSheet('GapsInCare').addColumns(columns).addDataSource(data).saveAs('GapsInCare List.xlsx');
		console.log(`finish export`);
		setIsLoadingExport(false);
	};

	const fetchData = (page, perPage) => {
		setIsLoading(true);

		setPagination({ ...pagination, current: page, perPage });

		// GapsInCare.list(page, perPage)
		// 	.then(({ data, total }) => {
		// 		setData(data);
		// 		setPagination({
		// 			total,
		// 			current: page,
		// 			perPage
		// 		});
		// 	})
		// 	.finally(() => {
		// 		setIsLoading(false);
		// 	});
		setIsLoading(false);
	};

	async function fetchAllData() {
		setIsLoading(true);
		const { total } = await GapsInCare.list();
		const totalPages = Math.ceil(total / 1000.0);
		const texts = await Promise.all(
			Array(totalPages)
				.fill(0)
				.map(async (u, i) => {
					const { data } = await GapsInCare.list(i + 1, 1000);
					return data;
				})
		);

		const data = [];
		texts.forEach((d, i) => {
			d.forEach(item => {
				data.push(item);
			});
		});
		setData(data);
	}

	useEffect(() => {
		setIsLoading(true);
		fetchAllData();

		GapsInCare.list()
			.then(({ data, total, columns }) => {
				// console.log(data);
				setData(data);
				setPagination({
					total,
					current: 1,
					perPage: 50
				});
				const column = columns.map(col => {
					if (col.key === 'DATE_OF_BIRTH' || col.key === 'DOB') {
						return {
							...col,
							className: 'gaps-in-care-table-column',
							render: (text, record) => {
								if (text) {
									return <div>{dayjs(text).format('MMM DD,YYYY')}</div>;
								}
							}
						};
					}
					// firstname lastname
					if (col.key === 'PROV_FULLNAME') {
						return {
							...col,
							className: 'gaps-in-care-table-column',
							width: 110,
							filters: filter2,
							filterSearch: true,
							onFilter: (value, record) => {
								if (record.PROV_FULLNAME !== null)
									return record.PROV_FULLNAME.includes(value);
							},
							render: (text, record) => (
								<div
									key={text + record}
									onClick={() => setStep(1)}
									className="cursor-pointer text-blue-500"
								>
									{text}
								</div>
							)
							// render: (text, record) => <div className="font-normal">Doe</div>
						};
					}

					// if (
					// 	col.key === 'MEMBER_ID' ||
					// 	col.key === 'CHVMEMNBR' ||
					// 	col.key === 'CHVCLAIMID' ||
					// 	col.key === 'CHVPROVNBR' ||
					// 	col.key === 'PROVIDER_ID'
					// ) {
					// 	return {
					// 		...col,
					// 		className: 'gaps-in-care-table-column',
					// 		render: (text, record) => null
					// 	};
					// }

					if (col.key === 'PROV_ADDRESS') {
						return {
							...col,
							className: 'gaps-in-care-table-column'
							// width: 10
							// render: (text, record) => <div>1234</div>
						};
					}

					if (col.key === 'PROVSPEC') {
						return {
							...col,
							className: 'gaps-in-care-table-column',
							filters: filter_meature3,
							filterMode: 'tree',
							filterSearch: true,
							onFilter: (value, record) => {
								if (record.PROVSPEC !== null)
									return record.PROVSPEC.toString().includes(value);
							},
							render: (text, record) => (
								<div
									key={text + record}
									onClick={() => setStep(1)}
									className="cursor-pointer text-blue-500"
								>
									{text}
								</div>
							)
							// width: 10
							// render: (text, record) => <div>1234</div>
						};
					}

					if (col.key === 'PROVIDER_ID') {
						return {
							...col,
							className: 'gaps-in-care-table-column',
							// render: (text, record) => <div>1234</div>
							filters: filter1,
							filterSearch: true,
							onFilter: (value, record) => {
								if (record.PROVIDER_ID !== null)
									return record.PROVIDER_ID.includes(value);
							},
							render: (text, record) => (
								<div
									key={text + record}
									onClick={() => setStep(1)}
									className="cursor-pointer text-blue-500"
								>
									{text}
								</div>
							)
						};
					}

					return {
						...col,
						className: 'gaps-in-care-table-column'
						// width: 60
					};
				});
				setColumn(column);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);
	return (
		<div className="w-full flex-1 overflow-hidden rounded bg-white shadow-lg">
			<PageHeader
				title="Gaps In Care"
				onBack={() => navigate(`/`)}
				breadcrumb={
					<Breadcrumb>
						<Breadcrumb.Item>
							<a href="/">Dashboard</a>
						</Breadcrumb.Item>

						<Breadcrumb.Item>Gaps In Care</Breadcrumb.Item>
					</Breadcrumb>
				}
				extra={[
					<Button onClick={() => haldleExport()} key="1" type="primary" loading={isLoadingExport}>
						Export
					</Button>
				]}
			></PageHeader>
			<div className="px-6 pb-6">
				<div className=" py-4">
					<Table
						className="gaps-in-care"
						columns={column}
						dataSource={data}
						onChange={(pagination, filters, sorter, extra) => {
							setPagination({ ...pagination, total: extra.currentDataSource.length });
						}}
						scroll={{ x: 'max-content' }}
						tableLayout={'auto'}
						rowKey={record =>
							`${record.TIN}_${record.PROVIDER_ID}_${record.CHVMEMNBR}_${record.NPI}_${record.MEASURE}`
						}
						loading={isLoading}
						pagination={{
							total: pagination.total,
							onChange: (page, pageSize) => {
								fetchData(page, pageSize);
							},
							defaultPageSize: 50,
							position: ['topRight', 'bottomRight']
						}} //already update
						expandable={{
							onExpand: async (expand, record, index) => {
								const key_data = `${record.TIN}_${record.PROVIDER_ID}_${record.CHVMEMNBR}_${record.PROV_FULLNAME}_${record.PROV_ADDRESS}_${record.PROVSPEC}`;
								if (explainableData.findIndex(item => item[0] === key_data) < 0) {
									GapsInCare.getId(
										record.TIN,
										record.PROVIDER_ID,
										record.CHVMEMNBR,
										record.PROV_FULLNAME,
										record.PROVSPEC,
										record.PROV_ADDRESS
									).then(({ data, columns }) => {
										const input_key = [key_data, data];
										const column_key = [key_data, columns];
										setExplainableData([...explainableData, input_key]);
										setExplainableColumns([...explainableColumns, column_key]);
									});
								}
							},

							expandedRowRender: (record, index) => {
								const key_data = `${record.TIN}_${record.PROVIDER_ID}_${record.CHVMEMNBR}_${record.PROV_FULLNAME}_${record.PROV_ADDRESS}_${record.PROVSPEC}`;
								const data_index = explainableData.findIndex(item => item[0] === key_data);
								const column_index = explainableColumns.findIndex(item => item[0] === key_data);

								if (data_index > -1 && explainableColumns[column_index][1].length > 0) {
									return (
										<div className="flex " key={`expanded_${index}`}>
											<Table
												bordered
												rowKey={record => `${record.id}_expanded`}
												columns={explainableColumns[column_index][1]}
												dataSource={explainableData[data_index][1]}
												pagination={false}
												scroll={{ x: 'max-content' }}
												tableLayout={'auto'}
												size="small"
											/>
										</div>
									);
								} else {
									return (
										<div className="flex " key={`loading_${index}`}>
											No Data.
										</div>
									);
								}
							}
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default GapsInCareTable;

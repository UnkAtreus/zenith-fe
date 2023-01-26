import React, { useEffect, useState } from 'react';

import { Button, PageHeader, Breadcrumb, Table, Row, Statistic, Col } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import ProviderList from '@/service/providerList';
import { GAPS_IN_CARE, PROVID_PROV, MEM_FULL_PROV, MEASURE_PROV, MEASURE } from '@/store/table_column';
import makeColumn from '@/utilities/makeColumn';
import makeDropdown from '@/utilities/makeDropdown';

function ProviderListTable({ setStep, setProviderListRecord }) {
	const [data, setData] = useState([]);
	const [filterData, setFilterData] = useState([]);
	const [column, setColumn] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [pagination, setPagination] = useState({
		total: 0,
		current: 1,
		perPage: 50
	});

	const filter_1 = makeDropdown(PROVID_PROV);
	const filter_2 = makeDropdown(MEM_FULL_PROV);
	const filter_3 = makeDropdown(MEASURE_PROV);

	const navigate = useNavigate();

	const haldleExport = () => {
		const excel = new Excel();
		console.log(column);
		const columns = [
			{
				key: 'PROVIDER_ID',
				dataIndex: 'PROVIDER_ID',
				title: 'Provider ID',
				className: 'provider-list-table-column'
			},
			{
				key: 'FULLNAME',
				dataIndex: 'FULLNAME',
				title: 'Fullname',
				className: 'provider-list-table-column'
			},
			{
				key: 'SPEC',
				dataIndex: 'SPEC',
				title: 'Spec',
				className: 'provider-list-table-column'
			},
			{
				key: 'NPI',
				dataIndex: 'NPI',
				title: 'Npi',
				className: 'provider-list-table-column'
			},
			{
				key: 'TIN',
				dataIndex: 'TIN',
				title: 'Tin',
				className: 'provider-list-table-column'
			},
			{
				key: 'HEDIS_MEASURE',
				dataIndex: 'HEDIS_MEASURE',
				title: 'HEDIS Measure',
				className: 'provider-list-table-column'
			},
			{
				key: 'NUMTAG',
				dataIndex: 'NUMTAG',
				title: 'Numtag',
				className: 'provider-list-table-column'
			},
			{
				key: 'DEN',
				dataIndex: 'DEN',
				title: 'Den.',
				className: 'provider-list-table-column'
			},
			{
				key: 'NUM',
				dataIndex: 'NUM',
				title: 'Num.',
				className: 'provider-list-table-column'
			},
			{
				key: 'CURRENT_YEAR_RATE',
				dataIndex: 'CURRENT_YEAR_RATE',
				title: 'Current Year Rate',
				className: 'provider-list-table-column'
			}
		];
		excel.addSheet('providerList').addColumns(columns).addDataSource(filterData).saveAs('Provider List.xlsx');
	};

	const fetchData = (page, perPage) => {
		setIsLoading(true);
		setPagination({ ...pagination, current: page, perPage });

		// ProviderList.list(page, perPage)

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
		const { total } = await ProviderList.list();
		const totalPages = Math.ceil(total / 1000);
		const texts = await Promise.all(
			Array(totalPages)
				.fill(0)
				.map(async (u, i) => {
					const { data } = await ProviderList.list(i + 1, 1000);
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
		setFilterData(data);
	}

	useEffect(() => {
		setIsLoading(true);

		fetchAllData();

		ProviderList.list()
			.then(({ data, total, columns }) => {
				console.log(data);
				setData(data);
				setFilterData(data);
				setPagination({
					total,
					current: 1,
					perPage: 50
				});
				const column = columns.map(col => {
					if (col.key === 'HEDIS_MEASURE') {
						return {
							...col,
							className: 'provider-list-table-column',
							width: 360,
							filters: filter_3,
							filterSearch: true,
							onFilter: (value, record) => {
								if (record.HEDIS_MEASURE !== null)
									return record.HEDIS_MEASURE.toString().includes(value);
							},
							render: (text, record) => {
								if (MEASURE[record.MEASURE]) {
									return (
										<div
											key={text + record}
											onClick={() => setStep(1)}
											className="cursor-pointer text-blue-500"
										>
											{MEASURE[record.MEASURE]}
										</div>
									);
								} else {
									return (
										<div
											key={text + record}
											onClick={() => setStep(1)}
											className="cursor-pointer text-blue-500"
										>
											{record.MEASURE}
										</div>
									);
								}
							}
						};
					}

					if (col.key === 'DATE_OF_BIRTH') {
						return {
							...col,
							className: 'provider-list-table-column',
							render: (text, record) => {
								if (text) {
									return <div>{dayjs(text).format('MMM DD,YYYY')}</div>;
								}
							}
						};
					}

					if (col.key === 'NUMTAG') {
						return {
							...col,
							className: 'provider-list-table-column',
							render: (text, record) => {
								return <div>{text}</div>;
							}
						};
					}

					if (col.key === 'DEN') {
						return {
							...col,
							className: 'provider-list-table-column',
							title: 'Den.'
							// render: (text, record) => {
							// 	return <div>0</div>;
							// }
						};
					}
					if (col.key === 'NUM') {
						return {
							...col,
							className: 'provider-list-table-column',
							title: 'Num.'
							// render: (text, record) => {
							// 	return <div>0</div>;
							// }
						};
					}

					if (col.key === 'CURRENT_YEAR_RATE') {
						return {
							...col,
							className: 'provider-list-table-column',
							render: (text, record) => (
								<div key={text + record} className=" whitespace-nowrap">
									{((record.NUM / record.DEN) * 100).toFixed(1)} %
								</div>
							)
						};
					}
					if (col.key === 'SHORT_HEDIS_MEASURE') {
						return {
							...col,
							className: 'hidden'
						};
					}
					if (col.key === 'PRIOR_YEAR_RATE') {
						return {
							...col,
							className: 'provider-list-table-column',
							render: (text, record) => <div>0.0%</div>
							// <div key={text + record} className=" whitespace-nowrap">
							// 	{(text * 100).toFixed(1)} %
							// </div>
						};
					}
					if (col.key === 'GOAL') {
						return {
							...col,
							className: 'provider-list-table-column',
							render: (text, record) => (
								<div>0.0%</div>
								// <div key={text + record} className=" whitespace-nowrap">
								// 	{(text * 100).toFixed(1)} %
								// </div>
							)
						};
					}
					if (col.key === 'TO_REACH_GOAL') {
						return {
							...col,
							className: 'provider-list-table-column',
							render: (text, record) => (
								<div>0.0%</div>
								// <div key={text + record}>
								// 	{Math.ceil(
								// 		record.GOAL * (parseFloat(record.DENOMINATOR) - parseFloat(record.NUMERATOR))
								// 	) || 0}
								// </div>
							),
							title: 'To reach goal'
						};
					}

					if (col.key === 'PROVIDER_ID') {
						return {
							...col,
							className: 'provider-list-table-column',
							filters: filter_1,
							filterSearch: true,
							onFilter: (value, record) => record.PROVIDER_ID.includes(value),
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

					if (col.key === 'FULLNAME') {
						return {
							...col,
							className: 'provider-list-table-column',
							filters: filter_2,
							filterSearch: true,
							onFilter: (value, record) => record.FULLNAME.includes(value),
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
						className: 'provider-list-table-column'
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
				title="Provider List"
				onBack={() => navigate(`/`)}
				breadcrumb={
					<Breadcrumb>
						<Breadcrumb.Item>
							<a href="/">Dashboard</a>
						</Breadcrumb.Item>
						<Breadcrumb.Item>Provider List</Breadcrumb.Item>
					</Breadcrumb>
				}
				extra={[
					<Button onClick={() => haldleExport()} key="btn_1" type="primary">
						Export Provider Rate Sheet
					</Button>,
					<Button key={'btn_2'}>Export Provider Gaps List</Button>
				]}
			></PageHeader>
			<div className="px-6 pb-6">
				<div className=" py-4">
					<Table
						className="provider-list"
						columns={column}
						dataSource={data}
						onChange={(pagination, filters, sorter, extra) => {
							setFilterData(extra.currentDataSource);
							setPagination({ ...pagination, total: extra.currentDataSource.length });
						}}
						// scroll={{ x: 'max-content' }}
						rowKey={record =>
							`${record.TIN}_${record.PROVIDER_ID}_${record.NPI}_${record.MEASURE}_${record.NUMTAG}_${record.HEDIS_MEASURE}_${record.DATE_OF_BIRTH}_${record.DEN}_${record.NUM}`
						}
						onRow={(record, rowIndex) => {
							return {
								onClick: event => {
									console.log(record);
									setProviderListRecord(record);
								}
							};
						}}
						loading={isLoading}
						size="middle"
						pagination={{
							total: pagination.total,
							onChange: (page, pageSize) => {
								fetchData(page, pageSize);
							},
							defaultPageSize: 50,
							position: ['topRight', 'bottomRight']
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default ProviderListTable;

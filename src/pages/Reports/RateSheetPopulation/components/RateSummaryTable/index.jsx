/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useCallback, useEffect, useState } from 'react';

import { Button, PageHeader, Breadcrumb, Table, Row, Statistic, Col } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { useNavigate } from 'react-router-dom';

import RateSummaryService from '@/service/rateSummary';
import { MEASURE, MEASURE_ID, RATE_SUMMARY, SUB_MEASURE } from '@/store/table_column';
import makeDropdown, { makeFilterList } from '@/utilities/makeDropdown';

function RateSummaryTable({ setStep, setRateSummaryRecord }) {
	const [data, setData] = useState([]);
	const [column, setColumn] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [pagination, setPagination] = useState({
		total: 0,
		current: 1,
		perPage: 50
	});

	const navigate = useNavigate();

	const haldleExport = () => {
		const excel = new Excel();
		const columns = [
			{
				key: 'HEDIS_MEASURE',
				dataIndex: 'HEDIS_MEASURE',
				title: 'HEDIS measure',
				className: 'rate-summary-table-column'
			},
			{
				key: 'SHORT_HEDIS_MEASURE',
				dataIndex: 'SHORT_HEDIS_MEASURE',
				title: 'Short HEDIS measure',
				className: 'hidden'
			},
			{
				key: 'SUB_MEASURE',
				dataIndex: 'SUB_MEASURE',
				title: 'Sub measure',
				className: 'rate-summary-table-column'
			},
			{
				key: 'DENOMINATOR',
				dataIndex: 'DENOMINATOR',
				title: 'Den.',
				className: 'rate-summary-table-column'
			},
			{
				key: 'NUMERATOR',
				dataIndex: 'NUMERATOR',
				title: 'Num.',
				className: 'rate-summary-table-column'
			},
			{
				key: 'CURRENT_YEAR_RATE',
				dataIndex: 'CURRENT_YEAR_RATE',
				title: 'Current year rate',
				className: 'rate-summary-table-column'
			},
			{
				key: 'PRIOR_YEAR_RATE',
				dataIndex: 'PRIOR_YEAR_RATE',
				title: 'Prior year rate',
				className: 'rate-summary-table-column'
			},
			{
				key: 'GOAL',
				dataIndex: 'GOAL',
				title: 'Goal',
				className: 'rate-summary-table-column'
			},
			{
				key: 'COUNT_NEEDED_TO_REACH_GOAL',
				dataIndex: 'COUNT_NEEDED_TO_REACH_GOAL',
				title: 'To reach goal',
				className: 'rate-summary-table-column'
			}
		];
		excel.addSheet('Rate Summary').addColumns(columns).addDataSource(data).saveAs('Rate Summary.xlsx');
	};

	const fetchData = (page, perPage) => {
		setPagination({ ...pagination, current: page, perPage });
		// setIsLoading(true);
		// const popId = JSON.parse(localStorage.getItem('population')).DBLREP_MASTER_POP_ID;
		// if (popId) {
		// 	RateSummaryService.list(popId, page, perPage)
		// 		.then(({ data, total }) => {
		// 			setData(data);
		// 			setPagination({
		// 				total,
		// 				current: page,
		// 				perPage
		// 			});
		// 		})
		// 		.finally(() => {
		// 			setIsLoading(false);
		// 		});
		// }
	};

	async function fetchAllData() {
		setIsLoading(true);
		const popId = JSON.parse(localStorage.getItem('population')).DBLREP_MASTER_POP_ID;
		if (popId) {
			const { total } = await RateSummaryService.list(popId);
			const totalPages = Math.ceil(total / 1000.0);
			const texts = await Promise.all(
				Array(totalPages)
					.fill(0)
					.map(async (u, i) => {
						const { data } = await RateSummaryService.list(popId, i + 1, 1000);
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
	}

	useEffect(() => {
		setIsLoading(true);
		const popId = JSON.parse(localStorage.getItem('population')).DBLREP_MASTER_POP_ID;
		if (popId) {
			fetchAllData();
			RateSummaryService.list(popId)
				.then(({ data, columns, total }) => {
					setData(data);
					setPagination({
						total,
						current: 1,
						perPage: 50
					});
					const column = columns.map(col => {
						if (col.key === 'HEDIS_MEASURE') {
							return {
								...col,
								className: 'rate-summary-table-column',
								width: 360,
								filters: makeDropdown(makeFilterList(data, 'SHORT_HEDIS_MEASURE')),
								filterMode: 'tree',
								filterSearch: true,
								onFilter: (value, record) => record.SHORT_HEDIS_MEASURE.startsWith(value),
								sorter: (a, b) => {
									if (MEASURE[a.SHORT_HEDIS_MEASURE] && MEASURE[b.SHORT_HEDIS_MEASURE]) {
										return (
											MEASURE[a.SHORT_HEDIS_MEASURE].length -
											MEASURE[b.SHORT_HEDIS_MEASURE].length
										);
									} else {
										return a.SHORT_HEDIS_MEASURE.length - b.SHORT_HEDIS_MEASURE.length;
									}
								},
								render: (text, record) => (
									<div
										key={text + record}
										onClick={() => setStep(1)}
										className="cursor-pointer text-blue-500"
									>
										{MEASURE[record.SHORT_HEDIS_MEASURE]}
									</div>
								)
							};
						}

						// if (col.key === 'COUNT_NEEDED_TO_REACH_GOAL') {
						// 	return {
						// 		...col,
						// 		className: 'rate-summary-table-column',
						// 		title: 'To reach goal'
						// 	};
						// }

						if (col.key === 'DENOMINATOR') {
							return {
								...col,
								className: 'rate-summary-table-column',
								sorter: (a, b) => a[col.key] - b[col.key],
								title: 'Den.'
							};
						}
						if (col.key === 'NUMERATOR') {
							return {
								...col,
								className: 'rate-summary-table-column',
								sorter: (a, b) => a[col.key] - b[col.key],
								title: 'Num.'
							};
						}

						if (col.key === 'CURRENT_YEAR_RATE') {
							return {
								...col,
								className: 'rate-summary-table-column',
								sorter: (a, b) => a[col.key] - b[col.key],
								render: (text, record) => (
									<div key={text + record} className=" whitespace-nowrap">
										{(text * 100).toFixed(1)} %
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
								className: 'rate-summary-table-column',
								sorter: (a, b) => a[col.key] - b[col.key],
								render: (text, record) => (
									<div key={text + record} className=" whitespace-nowrap">
										{(text * 100).toFixed(1)} %
									</div>
								)
							};
						}
						if (col.key === 'GOAL') {
							return {
								...col,
								className: 'rate-summary-table-column',
								sorter: (a, b) => a[col.key] - b[col.key],
								render: (text, record) => (
									<div key={text + record} className=" whitespace-nowrap">
										{(text * 100).toFixed(1)} %
									</div>
								)
							};
						}
						if (col.key === 'COUNT_NEEDED_TO_REACH_GOAL') {
							return {
								...col,
								className: 'rate-summary-table-column',
								sorter: (a, b) =>
									Math.ceil(a.GOAL * (parseFloat(a.DENOMINATOR) - parseFloat(a.NUMERATOR))) -
										Math.ceil(b.GOAL * (parseFloat(b.DENOMINATOR) - parseFloat(b.NUMERATOR))) || 0,
								render: (text, record) => (
									<div key={text + record}>
										{Math.ceil(
											record.GOAL *
												(parseFloat(record.DENOMINATOR) - parseFloat(record.NUMERATOR))
										) || 0}
									</div>
								),
								title: 'To reach goal'
							};
						}

						if (col.key === 'SUB_MEASURE') {
							return {
								...col,
								className: 'rate-summary-table-column',
								filters: makeDropdown(makeFilterList(data, col.key)),
								filterSearch: true,
								sorter: (a, b) => {
									if (SUB_MEASURE[a[col.key]] && SUB_MEASURE[b[col.key]]) {
										return SUB_MEASURE[a[col.key]].length - SUB_MEASURE[b[col.key]].length;
									} else {
										return a[col.key].length - b[col.key].length;
									}
								},
								onFilter: (value, record) => {
									if (record[col.key]) return record[col.key].includes(value);
								},
								render: (text, record) => {
									return <div key={text + record}>{SUB_MEASURE[text] || text}</div>;
								}
							};
						}
						return {
							...col,
							className: 'rate-summary-table-column'
						};
					});
					setColumn(column);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, []);

	return (
		<div className="w-full flex-1 overflow-hidden rounded bg-white shadow-lg">
			<PageHeader
				title="Rate Summary"
				onBack={() => navigate(`/`)}
				breadcrumb={
					<Breadcrumb>
						<Breadcrumb.Item>
							<a href="/">Dashboard</a>
						</Breadcrumb.Item>
						<Breadcrumb.Item>
							{JSON.parse(localStorage.getItem('population')).CHVREP_POP_NAME}
						</Breadcrumb.Item>
					</Breadcrumb>
				}
				extra={[
					<Button
						key="1"
						type="primary"
						onClick={() => {
							haldleExport();
						}}
					>
						Export
					</Button>
				]}
			/>

			<div className="px-6 pb-6 ">
				<div className=" bg-white py-4">
					<Table
						rowKey={record => record.SUB_MEASURE + Math.random() * 1000000}
						columns={column}
						dataSource={data}
						onChange={(pagination, filters, sorter, extra) => {
							setPagination({ ...pagination, total: extra.currentDataSource.length });
						}}
						onRow={(record, rowIndex) => {
							return {
								onClick: event => {
									console.log(record);
									setRateSummaryRecord(record);
								}
							};
						}}
						loading={isLoading}
						pagination={{
							total: pagination.total,
							onChange: (page, pageSize) => {
								fetchData(page, pageSize);
							},
							defaultPageSize: 50,
							position: ['topRight', 'bottomRight']
						}} //already update++
					/>
				</div>
			</div>
		</div>
	);
}

export default RateSummaryTable;

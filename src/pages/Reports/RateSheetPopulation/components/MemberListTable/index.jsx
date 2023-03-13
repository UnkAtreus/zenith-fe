/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';

import { Button, PageHeader, Breadcrumb, Table, Row, Statistic, Col } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import dayjs from 'dayjs';

import FctmeasoutService from '@/service/fctmeasout';
import { GAPS_IN_CARE, SUB_MEASURE_FULL } from '@/store/table_column';
import makeColumn from '@/utilities/makeColumn';
import makeDropdown, { makeFilterList } from '@/utilities/makeDropdown';

function MemberListTable({ setStep, ratesummaryRecord, setMemberListRecord }) {
	const [data, setData] = useState([]);
	const [column, setColumn] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [pagination, setPagination] = useState({
		total: 0,
		current: 1,
		perPage: 50
	});

	const haldleExport = () => {
		const excel = new Excel();
		excel.addSheet('MemberList').addColumns(column).addDataSource(data).saveAs('Member List.xlsx');
	};

	const fetchData = (page, perPage) => {
		setIsLoading(true);
		const popId = JSON.parse(localStorage.getItem('population')).DBLREP_MASTER_POP_ID;
		console.log(ratesummaryRecord.SUB_MEASURE);
		const sub_measure = ratesummaryRecord.SUB_MEASURE.replaceAll('-', '_').replaceAll('+', '');
		console.log(sub_measure);
		if (popId) {
			FctmeasoutService.list(popId, sub_measure, page, perPage)

				.then(({ data, total }) => {
					setData(data);
					setPagination({
						total,
						current: page,
						perPage
					});
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	useEffect(() => {
		setIsLoading(true);
		const popId = JSON.parse(localStorage.getItem('population')).DBLREP_MASTER_POP_ID;

		if (popId) {
			console.log(ratesummaryRecord.SUB_MEASURE);
			const sub_measure = ratesummaryRecord.SUB_MEASURE.replaceAll('-', '_').replaceAll('+', '');
			console.log(sub_measure);
			FctmeasoutService.list(popId, sub_measure)
				.then(({ data, total, columns }) => {
					console.log(data);
					setData(data);
					setPagination({
						total,
						current: 1,
						perPage: 50
					});
					const column = columns.map(col => {
						if (col.key === 'DATE_OF_BIRTH') {
							return {
								...col,
								className: 'member-list-table-column',
								filters: makeDropdown(makeFilterList(data, col.key)),
								filterSearch: true,
								sorter: (a, b) => {
									if (a[col.key] && b[col.key]) {
										return dayjs(a[col.key]) - dayjs(b[col.key]);
									} else {
										return 0;
									}
								},
								onFilter: (value, record) => record[col.key].includes(value),
								render: (text, record) => {
									if (text) {
										return <div>{dayjs(text).format('MMM DD,YYYY')}</div>;
									}
								}
							};
						}
						if (col.key === 'MEMBER_NAME') {
							return {
								...col,
								filters: makeDropdown(makeFilterList(data, col.key)),
								filterSearch: true,
								sorter: (a, b) => a[col.key].length - b[col.key].length,
								onFilter: (value, record) => record[col.key].includes(value),
								className: 'member-list-table-column'
								// render: (text, record) => <div>John Doe</div>
							};
						}
						if (col.key === 'MEMBER_ID') {
							return {
								...col,
								filters: makeDropdown(makeFilterList(data, col.key)),
								filterSearch: true,
								sorter: (a, b) => a[col.key] - b[col.key],
								onFilter: (value, record) => record[col.key].includes(value),
								className: 'member-list-table-column'
								// render: (text, record) => <div>John Doe</div>
							};
						}
						// if (col.key === 'MEMBER_ID' || col.key === 'MEMBER_TELEPHONE') {
						// 	return {
						// 		...col,
						// 		className: 'member-list-table-column',
						// 		render: (text, record) => null
						// 	};
						// }
						return {
							...col,
							filters: makeDropdown(makeFilterList(data, col.key)),
							filterSearch: true,
							onFilter: (value, record) => {
								if (record[col.key]) return record[col.key].includes(value);
							},
							className: 'member-list-table-column'
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
				title="Member List"
				onBack={() => setStep(0)}
				breadcrumb={
					<Breadcrumb>
						<Breadcrumb.Item>
							<a href="/">Dashboard</a>
						</Breadcrumb.Item>
						<Breadcrumb.Item>
							<span
								className="cursor-pointer"
								onClick={() => {
									setStep(0);
								}}
							>
								{JSON.parse(localStorage.getItem('population')).CHVREP_POP_NAME}
							</span>
						</Breadcrumb.Item>
						<Breadcrumb.Item>Member List</Breadcrumb.Item>
					</Breadcrumb>
				}
				extra={[
					<Button onClick={() => haldleExport()} key="1" type="primary">
						Export
					</Button>
				]}
			>
				<Row>
					<Col span={3}>
						<Statistic
							title="HEDIS measure"
							value={ratesummaryRecord.SHORT_HEDIS_MEASURE}
							valueStyle={{ fontSize: '20px' }}
						/>
					</Col>
					<Col span={8}>
						<Statistic
							title="Measure"
							value={ratesummaryRecord.HEDIS_MEASURE}
							valueStyle={{ fontSize: '20px' }}
						/>
					</Col>
					<Col span={11}>
						<Statistic
							title="Sub measure"
							value={SUB_MEASURE_FULL[ratesummaryRecord.SUB_MEASURE]}
							valueStyle={{ fontSize: '20px' }}
						/>
					</Col>
				</Row>
			</PageHeader>
			<div className="px-6 pb-6">
				<div className=" py-4">
					<Table
						columns={column}
						dataSource={data}
						// scroll={{ x: 'max-content' }}
						rowKey={record => record.MEMBER_ID + Math.random() * 1000000}
						onRow={(record, rowIndex) => {
							return {
								onDoubleClick: event => {
									setMemberListRecord(record);
									setStep(2);
								}
							};
						}}
						loading={isLoading}
						pagination={{
							pageSize: 50,
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

export default MemberListTable;

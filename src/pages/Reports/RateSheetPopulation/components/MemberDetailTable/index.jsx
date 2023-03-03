/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';

import { Button, Divider, PageHeader, Breadcrumb, Table, Row, Statistic, Tabs, Descriptions, Col } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import dayjs from 'dayjs';

import MemberDetailService from '@/service/memberDetail';
import { FCTMEASOUT } from '@/store/table_column';
import makeColumn from '@/utilities/makeColumn';
import makeDropdown, { makeFilterList } from '@/utilities/makeDropdown';

function MemberDetailTable({ setStep, memberListRecord, ratesummaryRecord }) {
	const [data, setData] = useState([]);
	const [column, setColumn] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const { TabPane } = Tabs;

	let TABLE_KEY = 'claim';

	const fetchData = type => {
		setIsLoading(true);
		TABLE_KEY = type;
		const userId = memberListRecord.MEMBER_ID;
		if (userId) {
			MemberDetailService.list(userId, type ?? 'claim')
				.then(({ data, columns }) => {
					setData(data);
					const column = columns.map(col => {
						if (
							col.key === 'DTMSERVICE_DT' ||
							col.key === 'DTMFROMDT' ||
							col.key === 'DTMTHRUDT' ||
							col.key === 'DTMPRES_FILL_DT'
						) {
							return {
								...col,
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
						if (
							col.key === 'MEMBER_ID' ||
							col.key === 'CHVMEMNBR' ||
							col.key === 'CHVCLAIMID' ||
							col.key === 'CHVPROVNBR' ||
							col.key === 'CHVPHARMNPI' ||
							col.key === 'CHVPPROVNPI'
						) {
							return {
								...col,
								render: (text, record) => null
							};
						}
						if (col.key === 'DBLLINENBR') {
							return {
								...col,
								filters: makeDropdown(makeFilterList(data, col.key)),
								filterSearch: true,
								onFilter: (value, record) => {
									if (record[col.key]) return record[col.key].includes(value);
								},
								sorter: (a, b) => {
									if (a[col.key] && b[col.key]) {
										return a[col.key] - b[col.key];
									} else {
										return 0;
									}
								}
							};
						}
						return {
							...col,
							filters: makeDropdown(makeFilterList(data, col.key)),
							filterSearch: true,
							onFilter: (value, record) => {
								if (record[col.key]) return record[col.key].includes(value);
							}
						};
					});
					setColumn(column);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	const haldleExport = () => {
		const excel = new Excel();
		excel.addSheet('Member Detail').addColumns(column).addDataSource(data).saveAs('Member Detail.xlsx');
	};

	useEffect(() => {
		fetchData();
	}, []);
	return (
		<div className="w-full flex-1 overflow-hidden rounded bg-white shadow-lg">
			<PageHeader
				title="Member Details"
				onBack={() => setStep(1)}
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
						<Breadcrumb.Item>
							<span
								className="cursor-pointer"
								onClick={() => {
									setStep(1);
								}}
							>
								Member List
							</span>
						</Breadcrumb.Item>

						<Breadcrumb.Item>Member Details</Breadcrumb.Item>
					</Breadcrumb>
				}
				extra={[
					<Button onClick={() => haldleExport()} key="1" type="primary">
						Export
					</Button>
				]}
				footer={
					<Tabs defaultActiveKey="claim" size="small" type="card" onChange={type => fetchData(type)}>
						<TabPane tab="Claim" key="claim" />
						<TabPane tab="Lab" key="lab" />
						<TabPane tab="Rx" key="rx" />
						<TabPane tab="Supply" key="supply" />
					</Tabs>
				}
			>
				<Row>
					<Col span={3}>
						<Statistic title="HEDIS measure" value={ratesummaryRecord.SHORT_HEDIS_MEASURE} />
					</Col>
					<Col span={12}>
						<Statistic title="Measure" value={ratesummaryRecord.HEDIS_MEASURE} />
					</Col>
				</Row>
			</PageHeader>
			<div className="px-6 pb-6">
				<div className=" py-4">
					<Table
						rowKey={record =>
							`${TABLE_KEY}_${record.CHVMEMNBR}_${record.CHVCLAIMID}_${record.CHVPROVNBR}_${record.DBLLINENBR}`
						}
						columns={column}
						dataSource={data}
						scroll={{ x: 'max-content' }}
						loading={isLoading}
						pagination={{
							pageSize: 50,
							defaultPageSize: 50
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default MemberDetailTable;

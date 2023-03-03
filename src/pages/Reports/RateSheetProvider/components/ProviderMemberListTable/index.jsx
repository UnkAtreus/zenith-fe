import React, { useEffect, useState } from 'react';

import { Button, PageHeader, Breadcrumb, Table, Row, Statistic, Col } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import ProviderList from '@/service/providerList';
import { GAPS_IN_CARE } from '@/store/table_column';
import makeColumn from '@/utilities/makeColumn';
import makeDropdown, { makeFilterList } from '@/utilities/makeDropdown';

function ProviderMemberListTable({ setStep, setProviderMemberListRecord, providerListRecord }) {
	const [data, setData] = useState([]);
	const [column, setColumn] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [pagination, setPagination] = useState({
		total: 0,
		current: 1,
		perPage: 50
	});

	const tin = providerListRecord.TIN;
	const provider_id = providerListRecord.PROVIDER_ID;
	const npi = providerListRecord.NPI;
	const measure = providerListRecord.MEASURE;
	const numtag = providerListRecord.NUMTAG;

	const navigate = useNavigate();

	const haldleExport = () => {
		const excel = new Excel();
		excel.addSheet('providerMemberList').addColumns(column).addDataSource(data).saveAs('Provider Member List.xlsx');
	};

	const fetchData = (page, perPage) => {
		setIsLoading(true);

		ProviderList.getMemberList(tin, provider_id, npi, measure, numtag, page, perPage)

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
	};

	useEffect(() => {
		setIsLoading(true);

		ProviderList.getMemberList(tin, provider_id, npi, measure, numtag)
			.then(({ data, total, columns }) => {
				console.log(data);
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
							className: 'provider-list-table-column',
							filters: makeDropdown(makeFilterList(data, col.key)),
							filterSearch: true,
							sorter: (a, b) => a[col.key].length - b[col.key].length,
							onFilter: (value, record) => record[col.key].includes(value),
							render: (text, record) => {
								if (text) {
									return <div>{dayjs(text).format('MMM DD,YYYY')}</div>;
								}
							}
						};
					}
					if (col.key === 'CHVMEMNBR') {
						return {
							...col,
							className: 'provider-list-table-column',
							filters: makeDropdown(makeFilterList(data, col.key)),
							filterSearch: true,
							sorter: (a, b) => a[col.key] - b[col.key],
							onFilter: (value, record) => record[col.key].includes(value)
						};
					}
					if (col.key === 'FULLNAME') {
						return {
							...col,
							className: 'provider-list-table-column',
							filters: makeDropdown(makeFilterList(data, col.key)),
							filterSearch: true,
							sorter: (a, b) => a[col.key].length - b[col.key].length,
							onFilter: (value, record) => record[col.key].includes(value)
						};
					}

					if (col.key === 'COMPLIANT_STATUS') {
						return {
							...col,
							className: 'provider-list-table-column',
							filters: [
								{ text: 'Compliant', value: 1 },
								{ text: 'Not Compliant', value: null }
							],
							filterSearch: true,
							sorter: (a, b) => a.COMPLIANTSTATUS - b.COMPLIANTSTATUS,
							onFilter: (value, record) => record.COMPLIANTSTATUS === value,
							render: (text, record) => {
								console.log(text);
								if (record.COMPLIANTSTATUS === 1) {
									return <div>Compliant</div>;
								} else {
									return <div>Not Compliant</div>;
								}
							}
							// <div key={text + record}>
							// 	{Math.ceil(
							// 		record.GOAL * (parseFloat(record.DENOMINATOR) - parseFloat(record.NUMERATOR))
							// 	) || 0}
							// </div>}
						};
					}

					return {
						...col,
						filters: makeDropdown(makeFilterList(data, col.key)),
						filterSearch: true,
						onFilter: (value, record) => record[col.key].includes(value),
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
				title="Provider Member List"
				onBack={() => setStep(0)}
				breadcrumb={
					<Breadcrumb>
						<Breadcrumb.Item>
							<a href="/">Dashboard</a>
						</Breadcrumb.Item>
						<Breadcrumb.Item>Provider List</Breadcrumb.Item>
						<Breadcrumb.Item>Provider Member List</Breadcrumb.Item>
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
							value={providerListRecord.MEASURE}
							valueStyle={{ fontSize: '20px' }}
						/>
					</Col>
					<Col span={9}>
						<Statistic
							title="Measure"
							value={providerListRecord.HEDIS_MEASURE}
							valueStyle={{ fontSize: '20px' }}
						/>
					</Col>
					<Col span={3}>
						<Statistic
							title="Provider ID"
							formatter={value => <div>{value}</div>}
							value={providerListRecord.PROVIDER_ID}
							valueStyle={{ fontSize: '20px' }}
						/>
					</Col>
					<Col span={3}>
						<Statistic
							title="TIN"
							formatter={value => <div>{value}</div>}
							value={`${providerListRecord.TIN}`}
							valueStyle={{ fontSize: '20px' }}
						/>
					</Col>
					<Col span={3}>
						<Statistic
							title="NPI"
							formatter={value => <div>{value}</div>}
							value={providerListRecord.NPI}
							valueStyle={{ fontSize: '20px' }}
						/>
					</Col>
				</Row>
			</PageHeader>
			<div className="px-6 pb-6">
				<div className=" py-4">
					<Table
						className="provider-list"
						columns={column}
						dataSource={data}
						// scroll={{ x: 'max-content' }}
						rowKey={record => `${record.CHVMEMNBR}`}
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

export default ProviderMemberListTable;

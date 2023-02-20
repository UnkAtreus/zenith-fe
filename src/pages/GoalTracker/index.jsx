import React, { useContext, useEffect, useState } from 'react';

import { Column, Progress, Line } from '@ant-design/charts';
import { LoadingOutlined, TeamOutlined } from '@ant-design/icons';
import { Layout, Menu, Row, Col, Statistic, Divider, Select, Spin, Cascader } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../App';
import { PROJECTLIST } from '../Home';

import Logo from '@/assets/images/zenith-logo.png';
import StatisticService from '@/service/statistic';
import { ADMIN_MENUITEMS, MENUITEMS } from '@/store/menu_title';

function GoalTracker() {
	const [statistics, setStatistics] = useState({
		total_population: 0,
		male_population: 0,
		female_population: 0,
		spacial_population: 0,
		number_measure: 0,
		rate_bar_chart: [
			{
				HEDIS_MEASURE: '',
				SUB_MEASURE: '',
				CURRENT_YEAR_RATE: 0
			}
		]
	});
	const [loading, setLoading] = useState(false);
	const [selectMeasure, setSelectMeasure] = useState([]);
	const [selectListMeasure, setSelectListMeasure] = useState([]);
	const [selectOptions, setSelectOptions] = useState([]);
	const navigate = useNavigate();
	const Auth = useContext(AuthContext);

	const filter = (inputValue, path) =>
		path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

	useEffect(() => {
		let isLoading = false;
		const popId = JSON.parse(localStorage.getItem('population')).DBLREP_MASTER_POP_ID;
		(async () => {
			try {
				if (!isLoading) {
					setLoading(true);
					const ststic = await StatisticService.getStatic(popId);
					if (ststic.data !== null) {
						setStatistics(ststic.data);
						setSelectMeasure([
							ststic.data.rate_bar_chart[0].HEDIS_MEASURE,
							ststic.data.rate_bar_chart[0].SUB_MEASURE
						]);
						const options = [];
						ststic.data.rate_bar_chart.map(data => {
							if (
								options.find(o => {
									if (o.value === data.HEDIS_MEASURE) return true;
								})
							) {
								const index = options.findIndex((o, i) => {
									if (o.value === data.HEDIS_MEASURE) return true;
								});
								options[index].children.push({
									value: data.SUB_MEASURE,
									label: data.SUB_MEASURE
								});
							} else {
								options.push({
									value: data.HEDIS_MEASURE,
									label: data.HEDIS_MEASURE,
									children: [
										{
											value: data.SUB_MEASURE,
											label: data.SUB_MEASURE
										}
									]
								});
							}
						});
						setSelectOptions(options);

						setSelectListMeasure([
							{
								CURRENT_YEAR_RATE: 0,
								HEDIS_MEASURE: '10-2022'
							},
							{
								CURRENT_YEAR_RATE: ststic.data.rate_bar_chart[0].CURRENT_YEAR_RATE,
								HEDIS_MEASURE: '11-2022'
							}
						]);
					}
					setLoading(false);
				}
			} catch (error) {
				console.log(error);
			}
		})();
		return () => {
			isLoading = true;
		};
	}, []);

	const configLine = {
		data: selectListMeasure,
		padding: 'auto',
		xField: 'HEDIS_MEASURE',
		yField: 'CURRENT_YEAR_RATE',
		yAxis: {
			max: 100
		}
	};
	if (loading) {
		return (
			<div className="flex min-h-screen w-full items-center justify-center">
				<Spin
					indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
					tip={<div className="font-medium">Loading...</div>}
					className="space-y-3 text-blue-500"
				/>
			</div>
		);
	}

	return (
		<Layout>
			<Layout.Header className="fixed z-10 flex w-full items-center bg-white shadow">
				<div className="flex flex-1 items-center justify-between">
					<div className="flex cursor-pointer items-center space-x-4" onClick={() => navigate('/')}>
						<div className="relative flex h-14 w-14">
							<img src={Logo} alt="" />
						</div>
						<div className="flex items-center text-2xl">ZENITH</div>
					</div>

					<div className="flex flex-1 justify-end">
						<Menu
							mode="horizontal"
							defaultSelectedKeys={['goal-tracker']}
							className="flex-1 justify-end"
							items={Auth?.role?.includes('admin') ? ADMIN_MENUITEMS : MENUITEMS}
						/>
					</div>
				</div>
			</Layout.Header>
			<Layout.Content className="h-full min-h-screen bg-slate-50 px-4 pt-16">
				<div className="m-auto my-6 max-w-screen-xl">
					<section id="goalTracker-content">
						<Row gutter={[24, 24]}>
							<Col xl={6} sm={12}>
								<div className="h-full w-full  rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-300 p-7 shadow-lg">
									<Statistic
										title="Number of Measures that Meet the Goal"
										value={statistics.met_goal}
										loading={loading}
									/>
								</div>
							</Col>
							<Col xl={6} sm={12}>
								<div className="h-full w-full rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-300 p-7 shadow-lg">
									<Statistic
										title="High Priority Measures"
										value={50}
										className="flex flex-col justify-between"
										loading={loading}
									/>
								</div>
							</Col>
							<Col xl={4} sm={8}>
								<div className="h-full w-full   rounded-2xl bg-cyan-500 p-6 shadow-lg">
									<Statistic
										title="< 2% to reach goal"
										value={statistics.to_reach_goal_2}
										loading={loading}
									/>
									<Progress
										autoFit={false}
										height={24}
										color={['#0e7490', 'white']}
										percent={statistics.to_reach_goal_2 / statistics.number_measure}
									/>
								</div>
							</Col>
							<Col xl={4} sm={8}>
								<div className="h-full w-full  rounded-2xl bg-sky-500 p-6 shadow-lg">
									<Statistic
										title="2.1-5% to reach goal"
										value={statistics.to_reach_goal_2_5}
										loading={loading}
									/>
									<Progress
										autoFit={false}
										height={24}
										color={['#0369a1', 'white']}
										percent={statistics.to_reach_goal_2_5 / statistics.number_measure}
									/>
								</div>
							</Col>
							<Col xl={4} sm={8}>
								<div className="h-full w-full rounded-2xl bg-blue-500 p-6 shadow-lg">
									<Statistic
										title="> 5% to reach goal"
										value={statistics.to_reach_goal_5}
										loading={loading}
									/>
									<Progress
										autoFit={false}
										height={24}
										color={['#1d4ed8', 'white']}
										percent={statistics.to_reach_goal_5 / statistics.number_measure}
									/>
								</div>
							</Col>

							<Col xl={6} xs={24}>
								<div className="h-full w-full rounded-2xl bg-white px-6 py-10 shadow-lg">
									<div className="mb-4 text-xl font-medium">Recent Update</div>
									<div className=" space-y-2 overflow-auto">
										{PROJECTLIST.map(data => (
											<>
												<div
													onClick={() => {
														localStorage.setItem('database', data.database);
														window.location.reload();
													}}
													className={`flex cursor-pointer items-center space-x-3 rounded p-2 transition-all duration-200 hover:bg-slate-50 ${
														localStorage.getItem('database') === data.database &&
														'bg-slate-100 hover:bg-slate-100'
													}`}
												>
													<TeamOutlined style={{ fontSize: `32px` }} />

													<div className="overflow-hidden">
														<div className="overflow-hidden text-ellipsis whitespace-nowrap">
															{data.title}
														</div>
														<div className="text-gray-400">
															Last updated: {dayjs(data.date).format('MM/DD/YYYY')}
														</div>
													</div>
												</div>
												<Divider />
											</>
										))}
									</div>
								</div>
							</Col>
							<Col xl={18} xs={24}>
								<div className="w-full rounded-2xl bg-white p-6  shadow-lg">
									<div className="flex items-center space-x-4">
										<div className="mb-4 text-xl font-medium">Rate</div>
										<div className="mb-4">
											<Cascader
												options={selectOptions}
												defaultValue={selectMeasure}
												showSearch={{
													filter
												}}
												onChange={value => {
													setSelectMeasure(value);
													statistics.rate_bar_chart.map(data => {
														if (data.HEDIS_MEASURE === value[0]) {
															setSelectListMeasure([
																{
																	CURRENT_YEAR_RATE: 0,
																	HEDIS_MEASURE: '10-2022'
																},
																{
																	CURRENT_YEAR_RATE: data.CURRENT_YEAR_RATE,
																	HEDIS_MEASURE: '11-2022'
																}
															]);
														}
													});
												}}
												placeholder="Please select"
											/>
										</div>
									</div>
									<Line {...configLine} />
								</div>
							</Col>
						</Row>
					</section>
				</div>
			</Layout.Content>
			{/* <Layout.Footer></Layout.Footer> */}
		</Layout>
	);
}

export default GoalTracker;

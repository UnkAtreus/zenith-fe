/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { Pie } from '@ant-design/charts';
import { DownOutlined, LoadingOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import { Layout, Menu, Divider, Dropdown, Space, Button, Row, Col, Statistic, Spin } from 'antd';
import dayjs from 'dayjs';
import { signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../App';

import Logo from '@/assets/images/zenith-logo.png';
import firebaseApp from '@/service/firebase';
import PopulationService from '@/service/population';
import StatisticService from '@/service/statistic';
import { ADMIN_MENUITEMS, MENUITEMS } from '@/store/menu_title';
import { role } from '@/store/role';

const auth = getAuth(firebaseApp);

function Home() {
	// const [user, _loading] = useAuthState(auth);
	const Auth = useContext(AuthContext);

	const isAdmin = Auth?.role?.includes('admin') || false;

	const [populations, setPopulations] = useState({ populationName: '', populationList: [], dropdownPop: [] });
	const [statistics, setStatistics] = useState({
		total_population: 0,
		male_population: 0,
		female_population: 0,
		spacial_population: 0,
		number_measure: 0
	});
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		let isLoading = false;
		console.log(`AuthContexts`, Auth);
		(async () => {
			try {
				const population = JSON.parse(localStorage.getItem('population'));
				// console.log(JSON.parse(user.reloadUserInfo.customAttributes));
				if (!Auth && !population && !(Auth.role in role)) {
					navigate('/login');
				}
				if (!isLoading) {
					setLoading(true);
					const respond = await PopulationService.list();
					const column = [];
					respond.data.map(item => {
						column.push({ label: item.CHVREP_POP_NAME, key: item.CHVREP_POP_NAME });
					});
					const ststic = await StatisticService.getStatic(population.DBLREP_MASTER_POP_ID);
					console.log(`render`);
					setStatistics(
						ststic.data === null
							? {
									total_population: 0,
									male_population: 0,
									female_population: 0,
									spacial_population: 0,
									number_measure: 0
							  }
							: ststic.data
					);
					setPopulations({
						populationName: population.CHVREP_POP_NAME,
						populationList: respond.data,
						dropdownPop: column
					});
					setLoading(false);
				}
			} catch (error) {
				console.log(error);
				navigate('/login');
			}
		})();
		return () => {
			isLoading = true;
		};
	}, []);

	// if (_loading) {
	// 	return (
	// 		<div className="flex min-h-screen w-full items-center justify-center">
	// 			<Spin
	// 				indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
	// 				tip={<div className="font-medium">Loading...</div>}
	// 				className="space-y-3 text-blue-500"
	// 			/>
	// 		</div>
	// 	);
	// }
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
							defaultSelectedKeys={['dashboard']}
							className="flex-1 justify-end"
							items={isAdmin ? ADMIN_MENUITEMS : MENUITEMS}
						/>
					</div>
				</div>
			</Layout.Header>
			<Layout.Content className="h-full min-h-screen bg-slate-50 px-4 py-16">
				<div className="m-auto mt-6 max-w-screen-xl space-y-6">
					{/* <section className="Card">
						<div className=" flex overflow-hidden rounded-2xl bg-white p-6 shadow-lg">
							<div className="relative">
								<img src={Logo} alt="" />
							</div>
							<div className="flex flex-col">
								<div className="text-xl">ZENITH Healthcare</div>
								<div className="flex items-center">
									<UserOutlined />
									<div className="ml-2 text-base">John Doe</div>
								</div>
							</div>
						</div>
					</section> */}
					<section>
						<div className="flex w-full justify-between rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-6 shadow">
							<h1 className="mb-0 text-xl text-white">{populations.populationName}</h1>
							<div className="flex items-center space-x-4">
								<Dropdown
									overlay={
										<Menu
											onClick={e => {
												// localStorage.setItem('population', e.key);
												// setPopulation(e.key);

												populations.map(item => {
													if (item.CHVREP_POP_NAME === e.key) {
														localStorage.setItem('population', JSON.stringify(item));
														setPopulations(prev => ({
															...prev,
															populationName: e.key
														}));
													}
												});
											}}
											items={populations.dropdownPop}
										/>
									}
									trigger={['click']}
								>
									<Button>
										<Space>
											Select Population
											<DownOutlined />
										</Space>
									</Button>
								</Dropdown>
								<Button
									danger
									onClick={() => {
										localStorage.removeItem('token');
										localStorage.removeItem('population');
										signOut(auth);
										navigate('/login');
									}}
								>
									<Space>Logout</Space>
								</Button>
							</div>
						</div>
					</section>
					<section id="dashboard-content">
						<Row gutter={[24, 24]}>
							<Col span={8}>
								<div className="w-full  rounded-2xl bg-gradient-to-br from-sky-600 to-sky-400 px-6 py-10 shadow-lg">
									<Statistic
										title="Number of Measures that do not meet the Goal"
										value={statistics.not_met_goal}
										loading={loading}
									/>
								</div>
							</Col>

							<Col span={8}>
								<div className="w-full rounded-2xl bg-gradient-to-br from-teal-600 to-teal-400 px-6 py-10 shadow-lg">
									<Statistic
										title="Total Gaps In Care"
										value={statistics.total_population}
										loading={loading}
									/>
								</div>
							</Col>

							<Col span={8}>
								<div className="w-full rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-400 px-6 py-10 shadow-lg">
									<Statistic
										title="Number of Measures within 3% of Goal"
										value={statistics.within_3_goal}
										loading={loading}
									/>
								</div>
							</Col>

							<Col span={12}>
								<div className="h-full w-full rounded-2xl bg-white px-6 py-10 shadow-lg">
									<div className="mb-4 text-xl font-medium">Project List</div>
									<div className="h-full space-y-2 overflow-auto">
										<div key={`project-card`}>
											<div
												onClick={() => {
													localStorage.setItem('database', 'schema1');
													window.location.reload();
												}}
												className={`flex cursor-pointer items-center space-x-3 rounded p-2 transition-all duration-200 hover:bg-slate-50 ${
													localStorage.getItem('database') === 'schema1' &&
													'bg-slate-100 hover:bg-slate-100'
												}`}
											>
												<TeamOutlined style={{ fontSize: `32px` }} />

												<div className="overflow-hidden">
													<div className="overflow-hidden text-ellipsis whitespace-nowrap">
														ZENITHRUN - OCT2022
													</div>
													<div className="text-gray-400">Last updated: 09/30/2022</div>
												</div>
											</div>
											<Divider className="my-4" />
											<div
												onClick={() => {
													localStorage.setItem('database', 'schema2');
													window.location.reload();
												}}
												className={`flex cursor-pointer items-center space-x-3 rounded p-2 transition-all duration-200 hover:bg-slate-50 ${
													localStorage.getItem('database') === 'schema2' &&
													'bg-slate-100 hover:bg-slate-100'
												}`}
											>
												<TeamOutlined style={{ fontSize: `32px` }} />

												<div className="overflow-hidden">
													<div className="overflow-hidden text-ellipsis whitespace-nowrap">
														ZENITHRUN - SEP2022
													</div>
													<div className="text-gray-400">Last updated: 08/30/2022</div>
												</div>
											</div>
											<Divider className="my-4" />
										</div>
									</div>
								</div>
							</Col>
							<Col span={12}>
								<div className="h-fit w-full rounded-2xl bg-white px-6 py-10 shadow-lg">
									<div className="text-xl font-medium">Navigational Items</div>
									<div className="mb-4 text-xs font-medium">{populations.populationName}</div>
									<div className="space-y-4">
										<div
											onClick={() => navigate('/reports/rate-sheet-population')}
											className="w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-400 p-4 text-sm font-medium text-white transition-all duration-200 hover:bg-opacity-80"
										>
											Rate Sheet by Measure (Population)
										</div>
										<div
											onClick={() => navigate('/reports/rate-sheet-provider')}
											className="w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-400 p-4 text-sm font-medium text-white transition-all duration-200 hover:bg-opacity-80"
										>
											Rate Sheet by Provider
										</div>
										{Auth.schema !== 'cbh' && (
											<div
												onClick={() => navigate('/reports/gaps-in-care')}
												className="w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-400 p-4 text-sm font-medium text-white transition-all duration-200 hover:bg-opacity-80"
											>
												Gaps in Care
											</div>
										)}
									</div>
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

export default Home;

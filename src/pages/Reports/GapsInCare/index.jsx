import React, { useContext, useEffect, useState } from 'react';

import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../App';

import GapsInCareTable from './components/GapsInCareTable';

import Logo from '@/assets/images/zenith-logo.png';
import { ADMIN_MENUITEMS, MENUITEMS, menuRole } from '@/store/menu_title';
import { role } from '@/store/role';

function GapsInCare() {
	const [step, setStep] = useState(0);
	const [gapsInCareRecord, setGapsInCareRecord] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const Auth = useContext(AuthContext);

	useEffect(() => {
		const population = localStorage.getItem('population');

		if (!population) {
			// navigate('/login');
		}
		if (Auth.role === role.provider) {
			navigate('/');
		}
	}, []);
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
							items={menuRole(Auth?.role)}
						/>
					</div>
				</div>
			</Layout.Header>
			<Layout.Content className="h-full min-h-screen bg-slate-50 px-4 pt-16">
				<div className="m-auto mt-6 max-w-screen-xl space-y-6">
					<section>
						<div className="flex space-x-6">
							{step === 0 && (
								<GapsInCareTable setStep={setStep} setGapsInCareRecord={setGapsInCareRecord} />
							)}
						</div>
					</section>
				</div>
			</Layout.Content>
			{/* <Layout.Footer></Layout.Footer> */}
		</Layout>
	);
}

export default GapsInCare;

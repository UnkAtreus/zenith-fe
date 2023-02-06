import React, { useContext, useEffect, useState } from 'react';

import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../App';

import ProviderListTable from './components/ProviderListTable';
import ProviderMemberListTable from './components/ProviderMemberListTable';

import Logo from '@/assets/images/zenith-logo.png';
import { ADMIN_MENUITEMS, MENUITEMS, menuRole } from '@/store/menu_title';
import { role } from '@/store/role';

function RateSheetProvider() {
	const [step, setStep] = useState(0);
	const [providerListRecord, setProviderListRecord] = useState({});
	const [providerMemberListRecord, setProviderMemberListRecord] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const Auth = useContext(AuthContext);

	useEffect(() => {
		const population = localStorage.getItem('population');

		if (!population) {
			// navigate('/login');
		}
	}, []);
	return (
		<Layout>
			<Layout.Header className="fixed z-10 flex w-full items-center bg-white shadow">
				<div className="flex flex-1 items-center justify-between">
					<div
						className="flex cursor-pointer items-center space-x-4"
						onClick={() => {
							if (Auth.role === role.provider) {
								navigate('/reports/rate-sheet-provider');
							} else {
								navigate('/');
							}
						}}
					>
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
								<ProviderListTable setStep={setStep} setProviderListRecord={setProviderListRecord} />
							)}
							{step === 1 && (
								<ProviderMemberListTable
									setStep={setStep}
									setProviderMemberListRecord={setProviderMemberListRecord}
									providerListRecord={providerListRecord}
								/>
							)}
						</div>
					</section>
				</div>
			</Layout.Content>
			{/* <Layout.Footer></Layout.Footer> */}
		</Layout>
	);
}

export default RateSheetProvider;

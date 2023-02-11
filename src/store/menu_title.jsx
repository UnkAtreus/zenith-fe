import React from 'react';

import { signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

import { role } from './role';

import firebaseApp from '@/service/firebase';

const auth = getAuth(firebaseApp);

export function menuRole(roles) {
	const navigate = useNavigate();
	console.log(roles);
	switch (roles) {
		case role.admin:
			return ADMIN_MENUITEMS;
		case role.superadmin:
			return ADMIN_MENUITEMS;
		case role.provider:
			return [
				{
					label: [
						<Link to="/reports/rate-sheet-provider" key="dashboard">
							Provider List
						</Link>
					],
					key: 'dashboard'
				},
				{
					label: [
						<div
							onClick={() => {
								localStorage.removeItem('token');
								localStorage.removeItem('population');
								signOut(auth);
								navigate('/login');
							}}
							key="logout"
						>
							Logout
						</div>
					],
					key: 'logout'
				}
			];
		case role.clinic:
			return [
				{
					label: [
						<Link to="/reports/rate-sheet-provider" key="dashboard">
							Provider List
						</Link>
					],
					key: 'dashboard'
				},
				{
					label: [
						<div
							onClick={() => {
								localStorage.removeItem('token');
								localStorage.removeItem('population');
								signOut(auth);
								navigate('/login');
							}}
							key="logout"
						>
							Logout
						</div>
					],
					key: 'logout'
				}
			];
		default:
			return MENUITEMS;
	}
}

export const MENUITEMS = [
	{
		label: [
			<Link to="/" key="dashboard">
				Dashboard
			</Link>
		],
		key: 'dashboard'
	},
	// {
	// 	label: [
	// 		<Link to="/reports" key="reports">
	// 			Reports
	// 		</Link>
	// 	],
	// 	key: 'reports'
	// },
	// {
	// 	label: 'Population',
	// 	key: 'population',
	// 	children: [{ label: 'IHP of California MAPD', key: 'IHP_of_California_MAPD' }]
	// },
	{
		label: [
			<Link to="/goal-tracker" key="goal-tracker">
				Goal Tracker
			</Link>
		],
		key: 'goal-tracker'
	}
	// {
	// 	label: [
	// 		<Link to="/" key="gaps-in-care">
	// 			Gaps in Care
	// 		</Link>
	// 	],
	// 	key: 'gaps-in-care'
	// }
];
export const ADMIN_MENUITEMS = [
	{
		label: [
			<Link to="/" key="dashboard">
				Dashboard
			</Link>
		],
		key: 'dashboard'
	},
	// {
	// 	label: [
	// 		<Link to="/reports" key="reports">
	// 			Reports
	// 		</Link>
	// 	],
	// 	key: 'reports'
	// },
	// {
	// 	label: 'Population',
	// 	key: 'population',
	// 	children: [{ label: 'IHP of California MAPD', key: 'IHP_of_California_MAPD' }]
	// },
	{
		label: [
			<Link to="/goal-tracker" key="goal-tracker">
				Goal Tracker
			</Link>
		],
		key: 'goal-tracker'
	},
	{
		label: [
			<Link to="/manage-users" key="manage-users">
				Manage Users
			</Link>
		],
		key: 'manage-users'
	}
];

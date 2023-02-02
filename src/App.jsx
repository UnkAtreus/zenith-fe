import React, { createContext, useMemo } from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import GoalTracker from './pages/GoalTracker';
import ManageUsers from './pages/ManageUsers';
import GapsInCare from './pages/Reports/GapsInCare';
import RateSheetProvider from './pages/Reports/RateSheetProvider';
import firebaseApp from './service/firebase';
import { role } from './store/role';

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import RateSheetPopulation from '@/pages/Reports/RateSheetPopulation';

const auth = getAuth(firebaseApp);
export const AuthContext = createContext(null);

function App() {
	const [user, _loading] = useAuthState(auth);

	const contextValue = useMemo(() => {
		if (user?.reloadUserInfo?.customAttributes) {
			const customAttributes = JSON.parse(user.reloadUserInfo.customAttributes);
			if (customAttributes) {
				const role = customAttributes.role;
				const schema = customAttributes.schema;
				const displayName = user.reloadUserInfo.displayName;

				return {
					user,
					role,
					schema,
					displayName
				};
			}
		}
		return {
			user: null,
			role: null,
			schema: null,
			displayName: null
		};
	}, [user]);

	const ProtectedRoute = ({ children }) => {
		return children;
	};

	if (_loading) {
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
		<AuthContext.Provider value={contextValue}>
			<Router>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="/goal-tracker"
						element={
							<ProtectedRoute>
								<GoalTracker />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/reports/rate-sheet-population"
						element={
							<ProtectedRoute>
								<RateSheetPopulation />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/reports/rate-sheet-provider"
						element={
							<ProtectedRoute>
								<RateSheetProvider />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/reports/gaps-in-care"
						element={
							<ProtectedRoute>
								<GapsInCare />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/manage-users"
						element={
							<ProtectedRoute>
								<ManageUsers />
							</ProtectedRoute>
						}
					/>
					<Route
						index
						path="/"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route
						path="*"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</AuthContext.Provider>
	);
}

export default App;

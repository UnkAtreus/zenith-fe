import React from 'react';

import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';

import App from './App';
import './service/firebase.js';
import './index.css';

import 'antd/dist/antd.less';
import '@ant-design/flowchart/dist/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
		<RecoilRoot>
			<App />
		</RecoilRoot>
	</React.StrictMode>
);

import React, { useEffect, useContext, useState } from 'react';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Layout, Menu, Table, PageHeader, Breadcrumb, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../App';

import Logo from '@/assets/images/zenith-logo.png';
import AdminService from '@/service/admin';
import { ADMIN_MENUITEMS } from '@/store/menu_title';

function ManageUsers() {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);

	// console.log(Form.useWatch('role', form));

	const [form_edit] = Form.useForm();
	const [form_create] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();

	const Auth = useContext(AuthContext);
	const navigate = useNavigate();

	const showPropsConfirm = (uid, name) => {
		Modal.confirm({
			title: `Are you sure delete ${name}?`,
			icon: <ExclamationCircleFilled />,
			okText: 'Delete',
			okType: 'danger',
			cancelText: 'Cancle',
			onOk() {
				onDel(uid);
			}
		});
	};

	const columns = [
		{
			title: 'displayName',
			dataIndex: 'displayName',
			key: 'displayName'
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email'
		},
		{
			title: 'Role',
			dataIndex: 'role',
			key: 'role',
			render: (_, record) => <div>{record.customClaims.role}</div>
		},
		{
			title: 'Schema',
			dataIndex: 'schema',
			key: 'schema',
			render: (_, record) => <div>{record.customClaims.schema}</div>
		},
		{
			title: 'Created',
			dataIndex: 'creationTime',
			key: 'creationTime',
			render: (_, record) => <div>{record.metadata.creationTime}</div>
		},
		{
			title: 'Signed In',
			dataIndex: 'lastSignInTime',
			key: 'lastSignInTime',
			render: (_, record) => <div>{record.metadata.lastSignInTime}</div>
		},
		{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
			render: (_, record) => (
				<Space>
					<Button
						onClick={() => {
							form_edit.setFieldsValue({
								uid: record.uid,
								displayName: record.displayName,
								email: record.email,
								role: record.customClaims.role,
								schema: record.customClaims.schema
							});
							setIsEditOpen(true);
						}}
					>
						Edit
					</Button>

					<Button
						onClick={() => {
							showPropsConfirm(record.uid, record.displayName);
						}}
						danger
						disabled={record.uid === Auth.user.uid}
					>
						Delete
					</Button>
				</Space>
			)
		}
	];

	const showModal = () => {
		setIsModalOpen(true);
	};

	const onCreate = async values => {
		console.log(values);
		try {
			await AdminService.postCreateUser(values);
			message.success('Created user successfully');
			const usersData = await AdminService.getAllUser();
			setUsers(usersData.users);
		} catch (error) {
			message.error(error.response.data.message);
		}
		setIsModalOpen(false);
	};

	const onEdit = async values => {
		try {
			await AdminService.postUpdateUser(values);

			const usersData = await AdminService.getAllUser();
			setUsers(usersData.users);
			message.success('Created user successfully');
		} catch (error) {
			message.error(error.response.data.message);
		}
		setIsEditOpen(false);
		form_edit.resetFields();
	};

	const onDel = async values => {
		try {
			await AdminService.postDelUser({ uid: values });
			messageApi.open({
				type: 'success',
				content: 'Deleted user successfully'
			});

			const usersData = await AdminService.getAllUser();
			setUsers(usersData.users);
		} catch (error) {
			messageApi.open({
				type: 'error',
				content: error.response.data.message
			});
		}
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (!Auth || !Auth?.role?.includes('admin')) {
			navigate('/login');
		}
		setIsLoading(true);
		(async () => {
			try {
				const data = await AdminService.getAllUser();
				if (Auth.role === 'superadmin') {
					setUsers(data.users);
				} else if (Auth?.role?.includes('admin')) {
					const users = data.users.filter(data => {
						if (data.customClaims.schema === Auth.schema) {
							return data;
						}
					});
					setUsers(users);
				}
			} catch (error) {
				console.log(error);
			}
		})();

		setIsLoading(false);
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
							defaultSelectedKeys={['manage-users']}
							className="flex-1 justify-end"
							items={ADMIN_MENUITEMS}
						/>
					</div>
				</div>
			</Layout.Header>
			<Layout.Content className="h-full min-h-screen bg-slate-50 px-4 pt-16">
				{contextHolder}
				<div className="m-auto mt-6 max-w-screen-xl space-y-6">
					<section>
						<div className="flex space-x-6">
							<div className="w-full flex-1 overflow-hidden rounded bg-white shadow-lg">
								<PageHeader
									title="Manage Users"
									onBack={() => navigate(`/`)}
									breadcrumb={
										<Breadcrumb>
											<Breadcrumb.Item>
												<a href="/">Dashboard</a>
											</Breadcrumb.Item>

											<Breadcrumb.Item>Manage users</Breadcrumb.Item>
										</Breadcrumb>
									}
									extra={[
										<Button
											key="create-user"
											type="primary"
											onClick={() => {
												showModal();
											}}
										>
											Create user
										</Button>
									]}
								></PageHeader>
								<div className="px-6 pb-6">
									<div className=" py-4">
										<Table
											rowKey={record => record.uid}
											columns={columns}
											dataSource={users}
											loading={isLoading}
										/>
									</div>
								</div>
							</div>
						</div>
					</section>
					<Modal
						title="Create user"
						open={isModalOpen}
						okText="Create"
						cancelText="Cancel"
						onOk={() => {
							form_create.validateFields().then(values => {
								form_create.resetFields();
								onCreate(values);
							});
						}}
						onCancel={handleCancel}
					>
						<Form form={form_create} layout="vertical">
							<Form.Item
								name="role"
								label="Role"
								rules={[{ required: true, message: 'Role is required' }]}
							>
								<Select placeholder="Select role">
									<Select.Option value="user">User</Select.Option>
									<Select.Option value="provider">Provider user</Select.Option>
									<Select.Option value="admin">Admin</Select.Option>
								</Select>
							</Form.Item>

							{Auth.role === 'superadmin' && (
								<Form.Item
									name="schema"
									label="Schema"
									initialValue={Auth.schema}
									rules={[{ required: true, message: 'Schema is required' }]}
								>
									<Select placeholder="Select schema">
										<Select.Option value="san">SAN</Select.Option>
										<Select.Option value="cbh">CBH</Select.Option>
									</Select>
								</Form.Item>
							)}
							{Auth.role === 'admin' && (
								<Form.Item
									name="schema"
									label="Schema"
									initialValue={Auth.schema}
									rules={[{ required: true, message: 'Schema is required' }]}
								>
									<Select placeholder="Select schema" disabled>
										<Select.Option value="san">SAN</Select.Option>
										<Select.Option value="cbh">CBH</Select.Option>
									</Select>
								</Form.Item>
							)}
							{Form.useWatch('role', form_create) === 'provider' ? (
								<Form.Item
									name="displayName"
									label="Provider ID"
									rules={[
										{
											required: true,
											message: 'Please input provider ID'
										},
										{ pattern: '^[0-9]{1,10}$', message: 'Please input number less than 10 digit.' }
									]}
								>
									<Input />
								</Form.Item>
							) : (
								<Form.Item
									name="displayName"
									label="Display name"
									rules={[
										{
											required: true,
											message: 'Please input display name'
										}
									]}
								>
									<Input />
								</Form.Item>
							)}

							<Form.Item
								name="email"
								label="Email Address"
								rules={[
									{
										required: true,
										message: 'Please input email address'
									},
									{ type: 'email', message: 'Please enter a valid email address' }
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								name="password"
								label="Password"
								rules={[
									{
										required: true,
										message: 'Please input your password!'
									}
								]}
							>
								<Input.Password />
							</Form.Item>

							<Form.Item
								name="confirm"
								label="Confirm Password"
								dependencies={['password']}
								rules={[
									{
										required: true,
										message: 'Please confirm your password!'
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue('password') === value) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error('The two passwords that you entered do not match!')
											);
										}
									})
								]}
							>
								<Input.Password />
							</Form.Item>
						</Form>
					</Modal>

					<Modal
						title="Edit user"
						open={isEditOpen}
						okText="Submit"
						cancelText="Cancel"
						onOk={() => {
							form_edit.validateFields().then(values => {
								onEdit(values);
							});
						}}
						onCancel={() => setIsEditOpen(false)}
					>
						<Form form={form_edit} layout="vertical">
							<Form.Item
								name="uid"
								hidden
								rules={[
									{
										required: true
									}
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								name="role"
								label="Role"
								rules={[{ required: true, message: 'Role is required' }]}
							>
								<Select placeholder="Select role">
									<Select.Option value="user">User</Select.Option>
									<Select.Option value="provider">Provider User</Select.Option>
									<Select.Option value="admin">Admin</Select.Option>
								</Select>
							</Form.Item>
							{Auth.role === 'superadmin' && (
								<Form.Item
									name="schema"
									label="Schema"
									rules={[{ required: true, message: 'Schema is required' }]}
								>
									<Select placeholder="Select schema">
										<Select.Option value="san">SAN</Select.Option>
										<Select.Option value="cbh">CBH</Select.Option>
									</Select>
								</Form.Item>
							)}
							{Auth.role === 'admin' && (
								<Form.Item
									name="schema"
									label="Schema"
									rules={[{ required: true, message: 'Schema is required' }]}
								>
									<Select placeholder="Select schema" disabled>
										<Select.Option value="san">SAN</Select.Option>
										<Select.Option value="cbh">CBH</Select.Option>
									</Select>
								</Form.Item>
							)}
							{Form.useWatch('role', form_edit) === 'provider' ? (
								<Form.Item
									name="displayName"
									label="Provider ID"
									rules={[
										{
											required: true,
											message: 'Please input provider ID'
										},
										{ pattern: '^[0-9]{1,10}$', message: 'Please input number less than 10 digit.' }
									]}
								>
									<Input />
								</Form.Item>
							) : (
								<Form.Item
									name="displayName"
									label="Display name"
									rules={[
										{
											required: true,
											message: 'Please input display name'
										}
									]}
								>
									<Input />
								</Form.Item>
							)}

							<Form.Item
								name="email"
								label="Email Address"
								rules={[
									{
										required: true,
										message: 'Please input email address'
									},
									{ type: 'email', message: 'Please enter a valid email address' }
								]}
							>
								<Input />
							</Form.Item>

							{/* <Form.Item
								name="schema"
								label="Schema"
								rules={[{ required: true, message: 'Schema is required' }]}
							>
								<Select placeholder="Select schema">
									<Select.Option value="san">SAN</Select.Option>
									<Select.Option value="cbh">CBH</Select.Option>
								</Select>
							</Form.Item> */}
						</Form>
					</Modal>
				</div>
			</Layout.Content>
			{/* <Layout.Footer></Layout.Footer> */}
		</Layout>
	);
}

export default ManageUsers;

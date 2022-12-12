const routes = [
	{
		path: '/preapproved',
		component: () => import('@/layouts/Layout'),
		children: [
			{
				name: 'Home',
				path: '',
				meta: { requiresAuth: true },
				component: () => import('../views/Preapproved.vue'),
			},
		],
	},
];

export default routes;

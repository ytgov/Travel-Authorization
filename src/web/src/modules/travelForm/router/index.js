const routes = [
	{
		path: '/TravelRequest',
		component: () => import('@/layouts/BlankLayout'),
		children: [
			{
				name: 'TravelForm',
				path: '/TravelRequest/Request/:formId?',
				meta: { requiresAuth: true },
				component: () => import('../views/TravelForm.vue'),
			},
			{
				name: 'TravelFormReview',
				path: '/Request/:formId?/:manage?',
				meta: { requiresAuth: true },
				component: () => import('../views/TravelForm.vue'),
			},
			{
				name: 'TravelFormList',
				path: '/forms',
				meta: { requiresAuth: true },
				component: () => import('../views/FormList.vue'),
			},
			{
				name: 'TravelFormManagerList',
				path: '/managerView',
				meta: { requiresAuth: true },
				component: () => import('../views/TravelForm.vue'),
			},
		],
	},
];

export default routes;

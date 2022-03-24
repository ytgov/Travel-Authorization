import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../components/Home.vue';
import Dashboard from '../components/Dashboard.vue';
import NotFound from '../views/NotFound.vue';
import Form from '../components/Form';
import Login from '../views/Login';
import LoginComplete from '../views/LoginComplete';
import Profile from '../views/Profile';
import store from '../store';
import AdminUserForm from '../components/Administration/UserManagement/UserComponent/Form';
import TravelRequest from '../components/TravelRequest/TravelRequest';
import FormList from '../components/TravelRequest/FormList';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: Dashboard,
	},
	{
		path: '/form',
		name: 'Basic Form',
		component: Form,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/sign-in',
		name: 'Login',
		component: Login,
	},
	{
		path: '/login-complete',
		name: 'LoginComplete',
		component: LoginComplete,
	},
	{
		path: '/profile',
		name: 'Profile',
		component: Profile,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/admin/users/view/:id',
		name: 'AdminUserView',
		component: AdminUserForm,
	},
	{
		path: '/admin/users/edit/:id',
		name: 'AdminUserEdit',
		component: AdminUserForm,
	},
	{
		path: '*',
		name: 'Not Found',
		component: NotFound,
	},
	{
		path: '/TravelRequest/request',
		name: 'TravelRequest',
		component: TravelRequest,
	},
	{
		path: '/forms',
		name: 'TravelForms',
		component: FormList,
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

router.beforeEach(async (to, from, next) => {
	var requiresAuth = to.meta.requiresAuth || false;

	store.dispatch('setAppSidebar', to.path.startsWith('/sites/'));

	if (!requiresAuth) {
		return next();
	}

	await store.dispatch('checkAuthentication');
	var isAuthenticated = store.getters.isAuthenticated;

	if (requiresAuth && !isAuthenticated) {
		console.log("You aren't authenticatd, redirecting to sign-in");
		next('/sign-in');
		return;
	}

	return next();
});

export default router;

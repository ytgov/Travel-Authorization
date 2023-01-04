import * as config from './config';

export const LOGIN_URL = `${config.apiBaseUrl}/api/auth/login`;
export const AUTH_CHECK_URL = `${config.apiBaseUrl}/api/auth/isAuthenticated`;
export const LOGOUT_URL = `${config.apiBaseUrl}/api/auth/logout`;
export const PROFILE_URL = `${config.apiBaseUrl}/api/user/me`;

export const PLACE_URL = `${config.apiBaseUrl}/api/place`;
export const COMMUNITY_URL = `${config.apiBaseUrl}/api/community`;
export const STATIC_URL = `${config.apiBaseUrl}/api`;
export const YTPLACE_URL = `${config.apiBaseUrl}/api/ytplace`;

export const FORM_URL = `${config.apiBaseUrl}/api/form`;
export const MANAGER_URL = `${config.apiBaseUrl}/api/manager`;
export const DESTINATION_URL = `${config.apiBaseUrl}/api/lookup/destination`;
export const LOOKUP_URL = `${config.apiBaseUrl}/api/lookup`;
export const USERS_URL = `${config.apiBaseUrl}/api/user`;
export const PERM_URL = `${config.apiBaseUrl}/api/permissions`;
export const PREAPPROVED_URL = `${config.apiBaseUrl}/api/preapproved`;

export const HEALTH_URL = `${config.apiBaseUrl}/api/healthCheck`;

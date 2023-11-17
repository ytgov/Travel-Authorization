import * as config from "./config";

// TODO: refactor these into apis/xxx-api.js files
// The base url can be handled by the axios config.
export const LOGIN_URL = `${config.apiBaseUrl}/api/auth/login`;
export const AUTH_CHECK_URL = `${config.apiBaseUrl}/api/auth/isAuthenticated`;
export const PROFILE_URL = `${config.apiBaseUrl}/api/user/me`;

export const PLACE_URL = `${config.apiBaseUrl}/api/place`;
export const COMMUNITY_URL = `${config.apiBaseUrl}/api/community`;
export const STATIC_URL = `${config.apiBaseUrl}/api`;
export const YTPLACE_URL = `${config.apiBaseUrl}/api/ytplace`;

export const FORM_URL = `${config.apiBaseUrl}/api/form`;
export const LOOKUP_URL = `${config.apiBaseUrl}/api/lookup`;
export const USERS_URL = `${config.apiBaseUrl}/api/user`;
export const PREAPPROVED_URL = `${config.apiBaseUrl}/api/preapproved`;
export const TRAVEL_DESK_URL = `${config.apiBaseUrl}/api/traveldesk`;
export const TRAVEL_COM_URL = `${config.apiBaseUrl}/api/travCom`;
export const FLIGHT_RECONCILE_URL = `${config.apiBaseUrl}/api/reconcile`;

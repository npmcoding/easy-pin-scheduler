import config from '../config';

// Initialize once with app id
window.PDK.init({ appId: config.PINTEREST_APP_ID, cookie: true });

export const pinterestLogin = callback => window.PDK.login({ scope: 'read_public, write_public' }, callback);
export const pinterestLogout = () => window.PDK.logout();
export const isLoggedIn = () => !!window.PDK.getSession();
export const createPin = (data, callback) => window.PDK.request('/pins/', 'POST', data, callback);
export const fetchBoards = callback => window.PDK.me('boards', { fields: 'id,name' }, callback);
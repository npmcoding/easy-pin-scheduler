import config from '../config';

// Initialize once with app id
PDK.init({ appId: config.PINTEREST_APP_ID, cookie: true });

const pinterestLogin = callback => PDK.login({ scope: 'read_public, write_public' }, callback);
const pinterestLogout = () => PDK.logout();
const isConnected = () => !!PDK.getSession();
const createPin = (data, callback) => PDK.request('/pins/', 'POST', data, callback);
const myBoards = callback => PDK.me('boards', { fields: 'id,name' }, callback);

export default {
    pinterestLogin,
    pinterestLogout,
    isConnected,
    createPin,
    myBoards
};
import config from '../config';
import { ONEHOUR, ONEMINUTE } from "./constants";

// Initialize once with app id
window.PDK.init({ appId: config.PINTEREST_APP_ID, cookie: true });

// TODO: remove this limit checker when app is approved
const oneHourLimit = (message = '') => {
    const now = Date.now();
    const lastPinterestCall = localStorage.getItem("lastPinterestCall");
    const timeSinceLastCall = now - Number(lastPinterestCall);

    if (!lastPinterestCall || timeSinceLastCall > ONEHOUR) {
        localStorage.setItem("lastPinterestCall", now);
        return true;
    } else {
        const minutesLeft = Math.round((ONEHOUR - timeSinceLastCall) / ONEMINUTE);
        alert(`
        ${message} \n
        One hour API call limit has been reached.\n 
        Please wait another ${minutesLeft} minutes before trying again`);
    }
    return false;
}

export const pinterestLogin = callback => window.PDK.login({ scope: 'read_public, write_public' }, callback);
export const pinterestLogout = () => window.PDK.logout();
export const isLoggedIn = () => !!window.PDK.getSession();
export const getAccessToken = () => window.PDK.getSession().accessToken;
export const createPin = (data, callback) => {
    oneHourLimit('Pin creation unsuccessful') &&
        window.PDK.request('/pins/', 'POST', data, callback);
}
export const fetchBoards = (callback) => {
    oneHourLimit('Boards are not able to be refreshed') &&
        window.PDK.me('boards', { fields: 'id,name' }, callback);
}
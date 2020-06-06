import { atom } from 'recoil';
import { isLoggedIn } from '../libs/pinterestLib';

export const connectedState = atom({
    key: 'connectedState',
    default: isLoggedIn()
});

export const boardsState = atom({
    key: 'boardsState',
    default: null
});
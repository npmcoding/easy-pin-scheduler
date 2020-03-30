import React, { createContext } from 'react';

let boards = JSON.parse(localStorage.getItem('boards'));

const updateLocalBoards = boardList => {
    boards = boardList;
    localStorage.setItem('boards', JSON.stringify(boardList));
}

export const UserContextComponent = ({ children }) => {

    // const [userData, setUserData] = useState({
    //     username: 'test',
    //     access_token: 'testToken',
    //     first_name: 'testFirstName',
    //     boards: undefined
    // })



    return <UserContext.Provider value={{ boards, updateLocalBoards }}>
        {children}
    </UserContext.Provider>
}

export const UserContext = createContext({ boards, updateLocalBoards: () => { } })
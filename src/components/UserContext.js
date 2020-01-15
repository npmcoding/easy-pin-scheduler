import React, { useState, createContext } from 'react';

export const UserContextComponent = ({ children }) => {

    const [userData, setUserData] = useState({
        username: 'test',
        access_token: 'testToken',
        first_name: 'testFirstName',
        boards: undefined
    })

    return <UserContext.Provider value={{ userData, setUserData }}>
        {children}
    </UserContext.Provider>
}

export const UserContext = createContext({ userData: {}, setUserData: () => { } })
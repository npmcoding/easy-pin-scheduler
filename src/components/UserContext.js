import React, { useState, createContext, useEffect } from "react";
import { Auth } from "aws-amplify";

export const UserContextComponent = ({ children }) => {
  // const [userData, setUserData] = useState({
  //     username: 'test',
  //     access_token: 'testToken',
  //     first_name: 'testFirstName',
  // })
  const { getSession } = window.PDK;

  const [email, setEmail] = useState(null);

  const [isConnected, setIsConnected] = useState(!!getSession());

  useEffect(() => {
    const getUserEmail = async () => {
      await Auth.currentSession().then(
        (sesh) => sesh && setEmail(sesh.idToken.payload.email)
      );
    };
    getUserEmail();
  }, []);

  return (
    <UserContext.Provider
      value={{
        email,
        setEmail,
        isConnected,
        setIsConnected,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserContext = createContext({
  email: null,
  setEmail: () => {},
  isConnected: false,
  setIsConnected: () => {},
});

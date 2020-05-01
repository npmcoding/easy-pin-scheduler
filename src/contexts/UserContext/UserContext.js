import React, { useState, createContext, useEffect } from "react";
import { Auth } from "aws-amplify";
export const UserContextComponent = ({ children }) => {
  // const [userData, setUserData] = useState({
  //     username: 'test',
  //     access_token: 'testToken',
  //     first_name: 'testFirstName',
  // })
  const [email, setEmail] = useState(null);

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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserContext = createContext({
  email: null,
  setEmail: () => {},
});

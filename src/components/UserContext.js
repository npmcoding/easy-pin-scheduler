import React, { useState, createContext, useEffect } from "react";
import { Auth } from "aws-amplify";

export const UserContextComponent = ({ children }) => {
  // const [userData, setUserData] = useState({
  //     username: 'test',
  //     access_token: 'testToken',
  //     first_name: 'testFirstName',
  // })

  const [boards, setBoards] = useState([])

  const [email, setEmail] = useState(null);

  const updateLocalBoards = (boardList) => {
    setBoards(boardList);
    localStorage.setItem("boards", JSON.stringify(boardList));
  };

  useEffect(() => {
    setBoards(JSON.parse(localStorage.getItem("boards")) || [])
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
        boards,
        updateLocalBoards,
        email,
        setEmail,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserContext = createContext({
  boards: [],
  updateLocalBoards: () => {},
  email: null,
  setEmail: () => {},
});

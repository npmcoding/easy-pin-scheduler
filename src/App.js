import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import "./App.css";
import Routes from "./Routes";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import { emailState, authenticatedState } from "./atoms/userAtoms";
import { isLoggedIn, pinterestLogout } from "./libs/pinterestLib";
import { initUserPoolUser } from "./libs/awsLib";

const App = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const setEmail = useRecoilState(emailState)[1];
  const setIsAuthenticated = useRecoilState(authenticatedState)[1];

  useEffect(() => {
    Auth.currentSession()
      .then(
        ({
          idToken: {
            jwtToken,
            payload: { email },
          },
        }) => {
          setIsAuthenticated(true);
          setEmail(email);
          initUserPoolUser(jwtToken);
          setIsAuthenticating(false);
        }
      )
      .catch((e) => {
        if (isLoggedIn()) {
          pinterestLogout();
        }
        if (e !== "No current user") {
          alert(e);
        }
        setIsAuthenticating(false);
      });
  }, [setIsAuthenticated, setEmail]);

  return (
    !isAuthenticating && (
      <div className="App container">
        <NavigationBar />
        <Routes />
      </div>
    )
  );
};

export default withRouter(App);

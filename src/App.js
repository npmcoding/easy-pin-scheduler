import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import "./App.css";
import Routes from "./Routes";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import { authenticatedState } from "./atoms/userAtoms";

const App = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const setIsAuthenticated = useRecoilState(authenticatedState)[1];

  useEffect(() => {
    const onLoad = async () => {
      try {
        await Auth.currentSession();
        setIsAuthenticated(true);
      } catch (e) {
        if (e !== "No current user") {
          alert(e);
        }
      }
      setIsAuthenticating(false);
    };

    onLoad();
  }, [setIsAuthenticated]);

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

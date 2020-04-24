import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import "./App.css";
import config from "./config";
import Routes from "./Routes";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import { UserContextComponent } from "./components/UserContext";

const App = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setUserHasAuthenticated] = useState(false);

  useEffect(() => {
    window.PDK.init({ appId: config.PINTEREST_APP_ID, cookie: true });
  }, []);

  const onLoad = async () => {
    try {
      await Auth.currentSession();
      setUserHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    !isAuthenticating && (
      <UserContextComponent>
        <div className="App container">
          <NavigationBar
            isAuthenticated={isAuthenticated}
            setUserHasAuthenticated={setUserHasAuthenticated}
          />

          <Routes
            appProps={{
              isAuthenticated,
              setUserHasAuthenticated,
            }}
          />
        </div>
      </UserContextComponent>
    )
  );
};

export default withRouter(App);

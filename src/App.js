import React, { useState, useEffect } from 'react';
import { Link, withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./App.css";
import Routes from "./Routes";
import config from "./config";
import { UserContextComponent } from "./components/UserContext";

const App = ({ history }) => {

  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setUserHasAuthenticated] = useState(false);

  const scriptLoaded = () => window.PDK.init({ appId: config.PINTEREST_APP_ID, cookie: true });
  
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.pinterest.com/sdk/sdk.js";
    script.async = true;
    script.onload = () => scriptLoaded();
  
    document.body.appendChild(script);
  });

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      await Auth.currentSession();
      setUserHasAuthenticated(true);
    }
    catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    setIsAuthenticating(false);
  }

  const handleLogout = async () => {
    await Auth.signOut();
    setUserHasAuthenticated(false);
    history.push("/login");
  }

  return (
    !isAuthenticating &&
    <UserContextComponent>
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Easy Pin Scheduler</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/settings">
                    <NavItem>Settings</NavItem>
                  </LinkContainer>
                  <NavItem onClick={handleLogout}>Logout</NavItem>
                </>
              )
                : (
                  <>
                    <LinkContainer to="/signup">
                      <NavItem>Signup</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </>
                )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes appProps={{ isAuthenticated, setUserHasAuthenticated }} />
    </div>
    </UserContextComponent>
  );
}

export default withRouter(App);
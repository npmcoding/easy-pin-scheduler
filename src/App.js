import React, { useState, useEffect } from 'react';
import { Link, withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./App.css";
import Routes from "./Routes";

const App = ({history}) => {

  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setUserHasAuthenticated] = useState(false);

  //const [user, setUser] = useState(null);

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
            {isAuthenticated
              ? <NavItem onClick={handleLogout}>Logout</NavItem>
              : <>
                <LinkContainer to="/signup">
                  <NavItem>Signup</NavItem>
                </LinkContainer>
                <LinkContainer to="/login">
                  <NavItem>Login</NavItem>
                </LinkContainer>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes appProps={{ isAuthenticated, setUserHasAuthenticated }} />
    </div>
  );
}

export default withRouter(App);
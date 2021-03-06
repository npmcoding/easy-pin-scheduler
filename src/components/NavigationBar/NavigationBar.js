import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import { connectedState } from "../../atoms/pinterestAtoms";
import { emailState, authenticatedState } from "../../atoms/userAtoms";
import { pinterestLogout } from "../../libs/pinterestLib";
import "./NavigationBar.css";

const NavigationBar = () => {
  const history = useHistory();

  const [email, setEmail] = useRecoilState(emailState);
  const [isAuthenticated, setIsAuthenticated] = useRecoilState(
    authenticatedState
  );

  const [isConnected, setIsConnected] = useRecoilState(connectedState);

  const connectionStatus = isConnected ? "connected" : "disconnected";

  useEffect(() => {
    if (isAuthenticated) {
      Auth.currentSession()
        .then((sesh) => sesh && setEmail(sesh.idToken.payload.email))
        .catch((e) => console.warn(e));
    }
  }, [setEmail, isAuthenticated]);

  const handleLogout = () => {
    Auth.signOut().then(() => {
      setIsAuthenticated(false);
      setEmail(null);
      
      pinterestLogout();
      setIsConnected(false);

      history.push("/login");
    });
  };

  return (
    <Navbar fluid collapseOnSelect>
      <div className="NavigationBar">
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
                <LinkContainer to="/profile">
                  <NavItem>
                    <span className={`profile-email ${connectionStatus}`}>
                      {email}
                    </span>
                  </NavItem>
                  {/* 
          green dot for connected / red dot for not connected
              include pencil icon?
              */}
                </LinkContainer>
                <NavItem onClick={handleLogout}>Logout</NavItem>
              </>
            ) : (
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
      </div>
    </Navbar>
  );
};

export default NavigationBar;

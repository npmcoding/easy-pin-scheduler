import React, { useContext } from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import { UserContext } from "../../components/UserContext";
import "./NavigationBar.css";

const NavigationBar = ({
  isAuthenticated,
  setUserHasAuthenticated,
  history,
}) => {
  const { email, isConnected } = useContext(UserContext);

  const handleLogout = async () => {
    await Auth.signOut();
    setUserHasAuthenticated(false);
    history.push("/login");
  };

  const connectionStatus = isConnected ? "connected" : "disconnected";

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

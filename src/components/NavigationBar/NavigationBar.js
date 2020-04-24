import React, { useContext } from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";

const NavigationBar = ({
  isAuthenticated,
  setUserHasAuthenticated,
  history,
}) => {

  const handleLogout = async () => {
    await Auth.signOut();
    setUserHasAuthenticated(false);
    history.push("/login");
  };

  return (
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
              <LinkContainer to="/Profile">
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
    </Navbar>
  );
};

export default NavigationBar;

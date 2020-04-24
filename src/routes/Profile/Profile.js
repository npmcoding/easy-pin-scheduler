import React, { useContext } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, ControlLabel, FormGroup } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import "./Profile.css";
import { UserContext } from "../../components/UserContext";

const Profile = () => {
  const { login, logout } = window.PDK;

  const { isConnected, setIsConnected } = useContext(UserContext);

  const onConnectClick = () => {
    const scope = "read_public, write_public";
    login({ scope }, (accessToken) => {
      setIsConnected(!!accessToken);
    });
  };

  const onDisconnectClick = () => {
    logout();
    setIsConnected(false);
  };

  return (
    <div className="profile">
      <div className="pinterest-account">
        {isConnected ? (
          <>
            <p className="pinterest-connected">
              Your Pinterest account is connected!
            </p>
            <FormGroup>
              <ControlLabel>Disconnect your Pinterest account</ControlLabel>
              <Button className="pinterest-logout" onClick={onDisconnectClick}>
                Disconnect
              </Button>
            </FormGroup>
          </>
        ) : (
          <FormGroup>
            <ControlLabel>Connect your Pinterest account</ControlLabel>
            <Button className="pinterest-login" onClick={onConnectClick}>
              Connect
            </Button>
          </FormGroup>
        )}
      </div>
      <div>
        <LinkContainer to="/profile/password">
          <LoaderButton block bsSize="large" text="Change Password" />
        </LinkContainer>
      </div>
    </div>
  );
};

export default Profile;

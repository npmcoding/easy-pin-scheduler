import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, ControlLabel, FormGroup } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import "./Profile.css";
import { isConnected, pinterestLogin, pinterestLogout} from "../../libs/pinterestLib";

const Profile = () => {
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
              <Button className="pinterest-logout" onClick={pinterestLogout}>
                Disconnect
              </Button>
            </FormGroup>
          </>
        ) : (
          <FormGroup>
            <ControlLabel>Connect your Pinterest account</ControlLabel>
            <Button className="pinterest-login" onClick={pinterestLogin}>
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

import React, {useState} from "react";
import { Button, ControlLabel, FormGroup } from "react-bootstrap";

const Settings = () => {

    const { login, getSession, logout } = window.PDK;

    const [isConnected, setIsConnected] = useState(!!getSession());

    const onConnectClick = () => {
        const scope = "read_public, write_public"
        login({ scope }, (accessToken) => {
                setIsConnected(!!accessToken);
            })
    }

    const onDisconnectClick = () => {
        logout();
        setIsConnected(false);
    }

    return (

        <div className="settings">
            {isConnected ? (
                <FormGroup>
                    <ControlLabel>Disconnect your Pinterest account</ControlLabel>
                    <Button
                        className="pinterest-logout"
                        onClick={onDisconnectClick}>
                        Disconnect
                    </Button>
                </FormGroup>
                ) : (
                    <FormGroup>
                        <ControlLabel>Connect your Pinterest account</ControlLabel>
                        <Button
                            className="pinterest-login"
                            onClick={onConnectClick}>
                            Connect
                        </Button>
                    </FormGroup>
                )}
        </div>
    )
}

export default Settings;
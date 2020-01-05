import React from "react";
import { Button, ControlLabel, FormGroup } from "react-bootstrap";

const Settings = () => {

    const onClick = () => {
        const scope = "write_public,write_private,read_relationships,write_relationships"
        window.PDK.login({ scope }, (accessToken) => console.log(accessToken));
    }

    return (

        <div className="settings">
            <FormGroup>
                <ControlLabel>Log in to Pinterest</ControlLabel>
                <Button
                    className="pinterest-login"
                    onClick={onClick}>
                    Login
            </Button>
            </FormGroup>
            <FormGroup>
                <ControlLabel>Check yo self</ControlLabel>
                <Button
                    className="pinterest-check"
                    onClick={() => console.log(window.PDK.getSession())}>
                    Do it
            </Button>
            </FormGroup>
        </div>
    )
}

export default Settings;
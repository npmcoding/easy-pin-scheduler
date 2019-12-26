import React, { useState } from 'react';
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import './Login.css';

export default ({ setUserHasAuthenticated, history }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [{ email, password }, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    });

    const handleSubmit = async e => {
        e.preventDefault();

        setIsLoading(true);
        try {
            await Auth.signIn(email, password);
            setUserHasAuthenticated(true);
            history.push("/");
        } catch (err) {
            alert(err.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        autoFocus
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        id="password"
                        value={password}
                        onChange={handleFieldChange}
                        type="password"
                    />
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    isLoading={isLoading}
                    type="submit"
                > Login </LoaderButton>
            </form>
        </div>
    );
}
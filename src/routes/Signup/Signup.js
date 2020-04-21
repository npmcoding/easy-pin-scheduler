import React, { useState } from "react";
import {
    HelpBlock,
    FormGroup,
    FormControl,
    ControlLabel
} from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import "./Signup.css";

const Signup = ({ setUserHasAuthenticated, history }) => {
    const [{ email, password, confirmPassword, confirmationCode }, handleFieldChange] = useFormFields({
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: ""
    });
    const [newUser, setNewUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newUser = await Auth.signUp({
                username: email,
                password: password
            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch (e) {
            // breaks if user refreshes before confirmation
            // https://serverless-stack.com/chapters/signup-with-aws-cognito.html

            if (e.code === "UsernameExistsException") {
                handleUsernameExistsException();
            } else {
                alert(e.message);
                setIsLoading(false);
            }
        }
    }

    const handleUsernameExistsException = async () => {
        try {
            const newUser = await Auth.resendSignUp(email);
            setIsLoading(false);
            setNewUser(newUser);
        } catch (e) {
            alert(e.message);
            setIsLoading(false);
        }
    }

    const handleConfirmationSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await Auth.confirmSignUp(email, confirmationCode);
            await Auth.signIn(email, password);

            setUserHasAuthenticated(true);
            history.push("/");
        } catch (e) {
            alert(e.message);
            setIsLoading(false);
        }
    }

    const renderConfirmationForm = () => {
        return (
            <form onSubmit={handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        type="tel"
                        onChange={handleFieldChange}
                        value={confirmationCode}
                    />
                    <HelpBlock>Please check your email for the code.</HelpBlock>
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    isLoading={isLoading}
                >
                    Verify
                </LoaderButton>
            </form>
        );
    }

    const renderForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        value={email}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        type="password"
                        value={password}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="confirmPassword" bsSize="large">
                    <ControlLabel>Confirm Password</ControlLabel>
                    <FormControl
                        type="password"
                        onChange={handleFieldChange}
                        value={confirmPassword}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    isLoading={isLoading}
                >Signup</LoaderButton>
            </form>
        );
    }

    return (
        <div className="signup">
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );
}

export default Signup;
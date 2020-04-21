import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import {
    HelpBlock,
    FormGroup,
    Glyphicon,
    FormControl,
    ControlLabel
} from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import "./ResetPassword.css";

const ResetPassword = () => {
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);


    const handleSendCodeClick = async e => {
        e.preventDefault();

        setIsSendingCode(true);

        try {
            await Auth.forgotPassword(email);
            setCodeSent(true);
        } catch (err) {
            alert(err.message);
            setIsSendingCode(false);
        }
    };

    const handleConfirmClick = async e => {
        e.preventDefault();

        setIsConfirming(true);

        try {
            await Auth.forgotPasswordSubmit(email, code, password);
            setConfirmed(true);
        } catch (err) {
            alert(err.message);
            setIsConfirming(false);
        }
    };

    const renderRequestCodeForm = () => (
        <form onSubmit={handleSendCodeClick}>
            <FormGroup bsSize="large" controlId="email">
                <ControlLabel>Email</ControlLabel>
                <FormControl autoFocus type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </FormGroup>
            <LoaderButton block type="submit" bsSize="large" loadingText="Sending..." text="Send Confirmation" isLoading={isSendingCode} />
        </form>
    );

    const renderConfirmationForm = () => (
        <form onSubmit={handleConfirmClick}>
            <FormGroup bsSize="large" controlId="code">
                <ControlLabel>Confirmation Code</ControlLabel>
                <FormControl autoFocus type="tel" value={code} onChange={e => setCode(e.target.value)} />
                <HelpBlock>Please check your email ({email}) for the confirmation code.</HelpBlock>
            </FormGroup>
            <hr />
            <FormGroup bsSize="large" controlId="password">
                <ControlLabel>New Password</ControlLabel>
                <FormControl type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </FormGroup>
            <FormGroup bsSize="large" controlId="confirmPassword">
                <ControlLabel>Confirm Password</ControlLabel>
                <FormControl type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </FormGroup>
            <LoaderButton block type="submit" bsSize="large" text="Confirm" loadingText="Confirm..." isLoading={isConfirming} />
        </form>
    );

    const renderSuccessMessage = () => (
        <div className="success">
            <Glyphicon glyph="ok" />
            <p>Your password has been reset.</p>
            <p>
                <Link to="/login">Click here to login with your new credentials.</Link>
            </p>
        </div>
    );

    return (
        <div className="ResetPassword">
            {!codeSent ? renderRequestCodeForm()
                : !confirmed ? renderConfirmationForm() : renderSuccessMessage()}
        </div>
    )
}

export default ResetPassword;
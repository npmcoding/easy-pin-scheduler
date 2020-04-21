import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import "./ChangePassword.css";

const ChangePassword = ({ history }) => {
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [isChanging, setIsChanging] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangeClick = async e => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert("New password does not match confirmation");
            return;
        }
        
        setIsChanging(true);
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(currentUser, oldPassword, password);
            
            history.push("/settings");
        } catch (err) {
            alert(err.message);
            setIsChanging(false);
        }
    };

    return (
        <div className="ChangePassword">
        <form onSubmit={handleChangeClick}>
            <FormGroup bsSize="large" controlId="oldPassword">
                <ControlLabel>Old Password</ControlLabel>
                <FormControl type="password" onChange={e => setOldPassword(e.target.value)} value={oldPassword} />
            </FormGroup>
            <hr />
            <FormGroup bsSize="large" controlId="password">
                <ControlLabel>New Password</ControlLabel>
                <FormControl type="password" onChange={e => setPassword(e.target.value)} value={password} />
            </FormGroup>
            <FormGroup bsSize="large" controlId="confirmPassword">
                <ControlLabel>Confirm Password</ControlLabel>
                <FormControl type="password" onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} />
            </FormGroup>
            <LoaderButton block type="submit" bsSize="large" text="Change Password" loadingText="Changing..." isLoading={isChanging} />
        </form>
        </div>
    );
}

export default ChangePassword;
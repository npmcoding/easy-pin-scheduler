import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import { emailState, authenticatedState } from "../../atoms/userAtoms";
import { initUserPoolUser } from "../../libs/awsLib";
import "./Login.css";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setEmail = useRecoilState(emailState)[1];
  const setIsAuthenticated = useRecoilState(authenticatedState)[1];
  const [{ email, password }, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    Auth.signIn(email, password)
      .then(
        ({
          signInUserSession: {
            idToken: { jwtToken },
          },
        }) => {
          setIsAuthenticated(true);
          setEmail(email);
          initUserPoolUser(jwtToken);
        }
      )
      .catch((err) => {
        alert(err.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="login">
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
            value={password}
            onChange={handleFieldChange}
            type="password"
          />
        </FormGroup>
        <Link to="/login/reset">Forgot password?</Link>
        <LoaderButton block bsSize="large" isLoading={isLoading} type="submit">
          {" "}
          Login{" "}
        </LoaderButton>
      </form>
    </div>
  );
};

export default Login;

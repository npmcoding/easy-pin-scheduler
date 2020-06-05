import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authenticatedState } from "../atoms/userAtoms";

export const AppliedRoute = ({ component: C, ...rest }) => {
    return <Route {...rest} render={props => <C {...props} />} />
}

export const AuthenticatedRoute = ({ component: C, appProps, location, ...rest }) => {
    const [isAuthenticated] = useRecoilState(authenticatedState);

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated
                    ? <C {...props} />
                    : <Redirect
                        to={`/login?redirect=${location.pathname}${location.search}`}
                    />}
        />
    );
}

export const UnauthenticatedRoute = ({ component: C, ...rest }) => {
    const [isAuthenticated] = useRecoilState(authenticatedState);
    const redirect = querystring("redirect");
    return (
        <Route
            {...rest}
            render={props =>
                !isAuthenticated
                    ? <C {...props} />
                    : <Redirect
                        to={redirect === "" || redirect === null ? "/" : redirect}
                    />}
        />
    );
}

const querystring = (name, url = window.location.href) => {
    name = name.replace(/[[]]/g, "\\$&");

    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
    const results = regex.exec(url);

    if (!results) return null;

    if (!results[2]) return "";

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
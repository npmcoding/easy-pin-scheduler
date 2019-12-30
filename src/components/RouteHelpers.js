import React from "react";
import { Route, Redirect } from "react-router-dom";

export const AppliedRoute = ({ component: C, appProps, ...rest }) => {
    return <Route {...rest} render={props => <C {...props} {...appProps} />} />
}

export const AuthenticatedRoute = ({ component: ControlLabel, appProps, location, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                appProps.isAuthenticated
                    ? <C {...props} {...appProps} />
                    : <Redirect
                        to={`/login?redirect=${location.pathname}${location.search}`}
                    />}
        />
    );
}

export const UnauthenticatedRoute = ({ component: C, appProps, ...rest }) => {
    const redirect = querystring("redirect");
    return (
        <Route
            {...rest}
            render={props =>
                !appProps.isAuthenticated
                    ? <C {...props} {...appProps} />
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
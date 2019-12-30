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
    return (
        <Route
            {...rest}
            render={props =>
                !appProps.isAuthenticated
                    ? <C {...props} {...appProps} />
                    : <Redirect to="/" />}
        />
    );
}
import React from "react";
import { Route, Switch } from "react-router-dom";
import {AppliedRoute, AuthenticatedRoute, UnauthenticatedRoute } from "./components/RouteHelpers";
import Home from "./routes/Home/Home";
import Login from "./routes/Login/Login";
import Signup from "./routes/Signup/Signup";
import ResetPassword from "./routes/ResetPassword/ResetPassword";
import NewPin from "./routes/NewPin/NewPin";
import EditPin from "./routes/EditPin/EditPin";
import Profile from "./routes/Profile/Profile";
import ChangePassword from "./routes/ChangePassword/ChangePassword";
import NotFound from "./routes/NotFound/NotFound";

const Routes = ({ appProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} appProps={appProps} />
        <UnauthenticatedRoute path="/login" exact component={Login} appProps={appProps} />
        <UnauthenticatedRoute path="/signup" exact component={Signup} appProps={appProps} />
        <UnauthenticatedRoute path="/login/reset" exact component={ResetPassword} appProps={appProps} />
        <AuthenticatedRoute path="/pin-editor" exact component={NewPin} appProps={appProps} />
        <AuthenticatedRoute path="/pin-editor/:id" exact component={EditPin} appProps={appProps} />
        <AuthenticatedRoute path="/profile" exact component={Profile} appProps={appProps} />
        <AuthenticatedRoute path="/profile/password" exact component={ChangePassword} appProps={appProps} />
        { /* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
    </Switch>;

export default Routes;
import React from "react";
import { Route, Switch } from "react-router-dom";
import {AppliedRoute, AuthenticatedRoute, UnauthenticatedRoute } from "./components/RouteHelpers";
import Home from "./containers/Home/Home";
import Login from "./containers/Login/Login";
import Signup from "./containers/Signup/Signup";
import ResetPassword from "./containers/ResetPassword/ResetPassword";
import NewPin from "./containers/NewPin/NewPin";
import ScheduledPin from "./containers/ScheduledPin/ScheduledPin";
import Settings from "./containers/Settings/Settings";
import ChangePassword from "./containers/ChangePassword/ChangePassword";
import NotFound from "./containers/NotFound/NotFound";

const Routes = ({ appProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} appProps={appProps} />
        <UnauthenticatedRoute path="/login" exact component={Login} appProps={appProps} />
        <UnauthenticatedRoute path="/signup" exact component={Signup} appProps={appProps} />
        <UnauthenticatedRoute path="/login/reset" exact component={ResetPassword} appProps={appProps} />
        <AuthenticatedRoute path="/pins/new" exact component={NewPin} appProps={appProps} />
        <AuthenticatedRoute path="/scheduledPins/:id" exact component={ScheduledPin} appProps={appProps} />
        <AuthenticatedRoute path="/settings" exact component={Settings} appProps={appProps} />
        <AuthenticatedRoute path="/settings/password" exact component={ChangePassword} appProps={appProps} />
        { /* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
    </Switch>;

export default Routes;
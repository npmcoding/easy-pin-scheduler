import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home/Home";
import Login from "./containers/Login/Login";
import Signup from "./containers/Signup/Signup";
import NewPin from "./containers/NewPin/NewPin";
import ScheduledPin from "./containers/ScheduledPin/ScheduledPin";
import NotFound from "./containers/NotFound/NotFound";

const Routes = ({ appProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} appProps={appProps} />
        <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
        <AppliedRoute path="/signup" exact component={Signup} appProps={appProps} />
        <AppliedRoute path="/pins/new" exact component={NewPin} appProps={appProps} />
        <AppliedRoute path="/scheduledPins/:id" exact component={ScheduledPin} appProps={appProps} />
        { /* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
    </Switch>;

export default Routes;
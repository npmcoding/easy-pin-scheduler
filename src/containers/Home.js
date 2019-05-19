import React, { Component } from "react";
import "./Home.css";

export default class Home extends Component {
    render() {
        return (
            <div className="Home">
                <div className="lander">
                    <h1>Easy Pin Scheduler</h1>
                    <p>A simple Node app to schedule Pinterest pins </p>
                </div>
            </div>
        )
    }
}
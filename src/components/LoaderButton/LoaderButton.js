import React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import "./LoaderButton.css";

export default ({ isLoading, className = "", ...props }) => {
    return (
        <Button
            className={`LoaderButton ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
            {props.children}
        </Button>
    );
}
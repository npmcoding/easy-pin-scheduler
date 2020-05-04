import React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import "./LoaderButton.css";

const LoaderButton = ({
  isLoading,
  className = "",
  text = "",
  loadingText = "",
  ...props
}) => {
  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Glyphicon glyph="refresh" className="spinning" />
          {loadingText}
        </>
      ) : (
        text
      )}
      {props.children}
    </Button>
  );
};

export default LoaderButton;

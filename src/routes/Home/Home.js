import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API, Storage } from "aws-amplify";
import ScheduledPinListItem from "../../components/ScheduledPinListItem/ScheduledPinListItem";
import { connectedState } from "../../atoms/pinterestAtoms";
import { authenticatedState } from "../../atoms/userAtoms";
import { postPin } from "../../libs/epsLib";
import "./Home.css";

const Home = () => {
  const [scheduledPins, setScheduledPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected] = useRecoilState(connectedState);
  const [isAuthenticated] = useRecoilState(authenticatedState);

  useEffect(() => {
    if (!isAuthenticated) return;

    API.get("scheduledPins", "/scheduledPins")
      .then((pins) => {
        setScheduledPins(pins);
        fetchThumbnails(pins);
      })
      .catch((e) => alert(e));

    setIsLoading(false);
  }, [isAuthenticated]);

  const fetchThumbnails = (pins) => {
    Promise.all(
      pins.map((pin) => {
        if (!pin.imagePath) {
          return pin;
        }
        return Storage.vault.get(pin.imagePath).then((imageUrl) => {
          return {
            ...pin,
            imageUrl,
          };
        });
      })
    ).then((fetchedPins) => setScheduledPins(fetchedPins));
  };

  const handlePostPin = (data) => {
    postPin(data)
      .then((response) => {
        console.log(response);
        const postedPin = response.Attributes;
        return scheduledPins
          .filter((pin) => pin.scheduledPinId !== postedPin.scheduledPinId)
          .push(postedPin);
      })
      .then((newPinList) => {
        console.log(newPinList);
        setScheduledPins(newPinList)
      })
      .catch((e) => {
        alert(e);
        console.warn(e);
      });
  };

  const renderPinsList = () => {
    // console.log({ scheduledPins });
    return (
      <>
        <LinkContainer key="new" to={isConnected ? "/pins/new" : "/profile"}>
          <ListGroupItem>
            <h4>
              {isConnected ? (
                <>
                  <b>{"\uFF0B"}</b> Create a new scheduled pin
                </>
              ) : (
                <>Connect to your Pinterest account to create new pins</>
              )}
            </h4>
          </ListGroupItem>
        </LinkContainer>
        {scheduledPins.map((pin) =>
          ScheduledPinListItem({ ...pin, handlePostPin })
        )}
      </>
    );
  };

  const renderLander = () => (
    <div className="lander">
      <h1>Easy Pin Scheduler</h1>
      <p>A simple Node app to schedule Pinterest pins </p>
    </div>
  );

  const renderPins = () => (
    <div className="scheduledPins">
      <PageHeader>Your Scheduled Pins</PageHeader>
      <ListGroup>{!isLoading && renderPinsList()}</ListGroup>
    </div>
  );

  return (
    <div className="Home">
      {isAuthenticated ? renderPins() : renderLander()}
    </div>
  );
};

export default Home;

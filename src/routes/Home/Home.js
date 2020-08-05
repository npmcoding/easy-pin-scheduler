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
        if (!pin.uploadedImageName) {
          return pin;
        }
        return Storage.vault
          .get(pin.uploadedImageName)
          .then((uploadedImageURL) => {
            return {
              ...pin,
              uploadedImageURL,
            };
          });
      })
    ).then((fetchedPins) => setScheduledPins(fetchedPins));
  };

  const updatePin = (newPin) => {
    Storage.vault
      .get(newPin.uploadedImageName)
      .then((uploadedImageURL) =>
        scheduledPins
          .filter((pin) => pin.scheduledPinId !== newPin.scheduledPinId)
          .concat([{ ...newPin, uploadedImageURL }])
      )
      .then((newPinList) => setScheduledPins(newPinList))
      .catch((e) => console.warn(e));
  };

  const handlePostPin = (data) => {
    postPin(data)
      .then((newPin) => {
        console.log(newPin);
        if (newPin) {
          updatePin(newPin);
        }
      })
      .catch((e) => {
        const { status, data } = e.response;
        console.log(status, data);

        const message =
          status === 429
            ? `Too many requests to Pinterest. Last request on ${new Date(
                data.lastRequest
              ).toLocaleString()}`
            : data.message;

        switch (status) {
          case 400:
            console.warn(data.e || message);
            break;
          case 429:
            console.warn(message);
            break;
          default:
            console.warn(e, e.response);
        }
        alert(message);
        if (data.pin) {
          updatePin(data.pin);
        }
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
        {scheduledPins.map((pin) => (
          <ScheduledPinListItem
            key={pin.scheduledPinId}
            {...pin}
            handlePostPin={handlePostPin}
          />
        ))}
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

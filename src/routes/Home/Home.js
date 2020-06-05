import React, { useState, useEffect } from "react";
import {useRecoilState} from "recoil";
import { PageHeader, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import "./Home.css";
import { connectedState } from "../../atoms/pinterestAtoms";

const Home = ({ isAuthenticated }) => {
  const [scheduledPins, setScheduledPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected] = useRecoilState(connectedState);

  const fetchPins = () => API.get("scheduledPins", "/scheduledPins");

  useEffect(() => {
    const onLoad = async () => {
      if (!isAuthenticated) return;

      try {
        const fetchedPins = await fetchPins();
        setScheduledPins(fetchedPins);
      } catch (e) {
        alert(e);
      }

      setIsLoading(false);
    };

    onLoad();
  }, [isAuthenticated]);

  const PostPin = async (pin) => {
    // const data = {
    //   board: pin.board.id,
    //   note: pin.content,
    //   // image_url: "http://test.url",
    // };
    // fetch(
    //   `https://api.pinterest.com/v1/pins/?access_token=${pinterestAccessToken}&fields=id%2Cnote%2Curl`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   }
    // )
    //   .then((response) => console.log(response.json()))
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
    console.log(pin);
  };

  const renderPinsList = () => {
    // console.log({ scheduledPins });
    return [{}].concat(scheduledPins).map((pin, i) =>
      i !== 0 ? (
        <div key={pin.scheduledPinId} className="scheduled-pin-list-item">
          <LinkContainer
            className="scheduled-pin-edit-link"
            to={`/scheduledPins/${pin.scheduledPinId}`}
          >
            <ListGroupItem header={pin.content.trim().split("\n")[0]}>
              {`Created: ${new Date(pin.createdAt).toLocaleString()}`}
            </ListGroupItem>
          </LinkContainer>
          <Button
            className="schedule-pin-post-now-button"
            onClick={() => PostPin(pin)}
          >
            Post now
          </Button>
        </div>
      ) : (
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
      )
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

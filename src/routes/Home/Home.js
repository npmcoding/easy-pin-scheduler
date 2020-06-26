import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { PageHeader, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API, Storage } from "aws-amplify";
import { formatFilename, createShortURL } from "../../libs/awsLib";
// import { createPin } from "../../libs/pinterestLib";
import { connectedState } from "../../atoms/pinterestAtoms";
import { authenticatedState } from "../../atoms/userAtoms";
import "./Home.css";

const Home = () => {
  const [scheduledPins, setScheduledPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected] = useRecoilState(connectedState);
  const [isAuthenticated] = useRecoilState(authenticatedState);

  const fetchPins = () => API.get("scheduledPins", "/scheduledPins");

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchPins()
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
        if(!pin.imagePath) {
          return pin;
        }        
        return Storage.vault.get(pin.imagePath).then((image_url) => {
          return {
            ...pin,
            image_url,
          };
        });
      })
    ).then((fetchedPins) => setScheduledPins(fetchedPins));
  };

  const PostPin = ({ link, board, note, imagePath }) => {
    const data = {
      imagePath,
      link: link || "",
      board: board.id,
      note: note || "",
    };
    console.log(data);

    createShortURL(imagePath);
    // createPin(data, (response) => {
    //   console.log(response);
      /*
      update scheduled Pin with "posted" status, posted date 
      and response.data.url value so that the "Post" button 
      can be turned into "View" and the user is notified of 
      successful post. May need error handling here.
      */
    // });
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
        {scheduledPins.map((pin) => {
          return (
            <div key={pin.scheduledPinId} className="scheduled-pin-list-item">
              <LinkContainer
                className="scheduled-pin-edit-link"
                to={`/scheduledPins/${pin.scheduledPinId}`}
              >
                <ListGroupItem header={pin.note.trim().split("\n")[0]}>
                  {`Created: ${new Date(pin.createdAt).toLocaleString()}`}
                  {pin.image_url && (
                    <img
                      className="thumb"
                      src={pin.image_url}
                      alt={formatFilename(pin.imagePath)}
                    />
                  )}
                </ListGroupItem>
              </LinkContainer>
              <Button
                className="schedule-pin-post-now-button"
                onClick={() => PostPin(pin)}
              >
                Post now
              </Button>
            </div>
          );
        })}
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

import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import "./Home.css";

const Home = ({ isAuthenticated }) => {

    const [scheduledPins, setScheduledPins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
        }

        onLoad()
    }, [isAuthenticated]);

    const fetchPins = () => API.get("scheduledPins", "/scheduledPins");

    const renderPinsList = pins => {
        console.log(pins);
    return [{}].concat(pins).map((pin, i) => 
            i !== 0 ? (
                <LinkContainer key={pin.scheduledPinId} to={`/scheduledPins/${pin.scheduledPinId}`}>
                    <ListGroupItem header={pin.content.trim().split("\n")[0]}>
                        {"Created: " + new Date(pin.createdAt).toLocaleString()}
                    </ListGroupItem>
                </LinkContainer>
            ) : (
                    <LinkContainer key="new" to="/pins/new">
                        <ListGroupItem>
                            <h4>
                                <b>{"\uFF0B"}</b> Create a new scheduled pin
                    </h4>
                        </ListGroupItem>
                    </LinkContainer>
                )
        );
    };

    const renderLander = () => {
        return (
            <div className="lander">
                <h1>Easy Pin Scheduler</h1>
                <p>A simple Node app to schedule Pinterest pins </p>
            </div>
        );
    }

    const renderPins = () => {
        return (
            <div className="scheduledPins">
                <PageHeader>Your Scheduled Pins</PageHeader>
                <ListGroup>
                    {!isLoading && renderPinsList(scheduledPins)}
                </ListGroup>
            </div>
        )
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderPins() : renderLander()}
        </div>
    )
}

export default Home;
import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { ListGroupItem, Button } from "react-bootstrap";
import { createShortURL } from "../../libs/awsLib";
import { createPin } from "../../libs/pinterestLib";
import "./ScheduledPinListItem.css";

const ScheduledPinListItem = (pin) => {
  const PostPin = async ({ link, board, note, awsKey }) => {
    createShortURL(awsKey)
      .then((shortURL) => {
        // console.log(shortURL))
        if (shortURL) {
          const data = {
            image_url: shortURL,
            link: link || null,
            board: board.id,
            note: note || "",
          };
          //   console.log(data, awsKey);
          createPin(data, (response) => {
            console.log(response);
            /*
                update scheduled Pin with "posted" status, posted date 
                and response.data.url value so that the "Post" button 
                can be turned into "View" and the user is notified of 
                successful post. May need error handling here.
                */
          });
        }
      })
      .catch((e) => alert(e));
  };

  return (
    <div key={pin.scheduledPinId} className="scheduled-pin-list-item">
      <LinkContainer
        className="scheduled-pin-edit-link"
        to={`/scheduledPins/${pin.scheduledPinId}`}
      >
        <ListGroupItem header={pin.note.trim().split("\n")[0]}>
          {`Created: ${new Date(pin.createdAt).toLocaleString()}`}
          {pin.image_url && (
            <img className="thumb" src={pin.image_url} alt={pin.imagePath} />
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
};

export default ScheduledPinListItem;

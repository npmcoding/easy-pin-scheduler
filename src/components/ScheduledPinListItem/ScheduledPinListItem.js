import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { ListGroupItem, Button } from "react-bootstrap";
import { postPin } from "../../libs/epsLib";
// import { createPin } from "../../libs/pinterestLib";
import "./ScheduledPinListItem.css";

const ScheduledPinListItem = ({
  accessToken,
  scheduledPinId,
  createdAt,
  link,
  board,
  note,
  imagePath,
  imageUrl,
  awsKey,
}) => {
  const PostPin = async () => {
    // console.log({ scheduledPinId, createdAt, link, board, note, imagePath, imageUrl, awsKey });
    try {
      postPin({accessToken, awsKey, board, note, link});
      // console.log(data);
      /*
      update scheduled Pin with "posted" status, posted date 
      and response.data.url value so that the "Post" button 
      can be turned into "View" and the user is notified of 
      successful post. May need error handling here.
      */
    } catch (e) {
      alert(e);
      console.warn(e);
    }
  };

  return (
    <div key={scheduledPinId} className="scheduled-pin-list-item">
      <LinkContainer
        className="scheduled-pin-edit-link"
        to={`/scheduledPins/${scheduledPinId}`}
      >
        <ListGroupItem header={note.trim().split("\n")[0]}>
          {`Created: ${new Date(createdAt).toLocaleString()}`}
          {imageUrl && <img className="thumb" src={imageUrl} alt={imagePath} />}
        </ListGroupItem>
      </LinkContainer>
      <Button className="schedule-pin-post-now-button" onClick={PostPin}>
        Post now
      </Button>
    </div>
  );
};

export default ScheduledPinListItem;

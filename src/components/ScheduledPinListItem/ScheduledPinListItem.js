import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
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
  userId,
  updatedAt,
  scheduledPinStatus,
  statusMessage,
  handlePostPin,
  pinURL
}) => {
  const onPostPinClick = () => {
    handlePostPin({
      accessToken,
      awsKey,
      board,
      note,
      link,
      userId,
      scheduledPinId,
    });
  };

  const actionButton = () => {
    switch (scheduledPinStatus) {
      case 'posted':

        return (
          <a className="schedule-pin-view-pin-link" href={pinURL} target="_blank">
            View Pin &#8599;
          </a>
        )
      case 'pending':
      case 'tooManyRequests':
      case 'error':
        return (
          <Button className="schedule-pin-post-now-button" onClick={onPostPinClick}>
            Post Now
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div key={scheduledPinId} className="scheduled-pin-list-item">
      <Link
        className="scheduled-pin-edit-link"
        to={`/scheduledPins/${scheduledPinId}`}
      >
        <div className="scheduled-pin-container">
          <div className="scheduled-pin-body">
            <h4 className="scheduled-pin-header">
              {note.trim().split("\n")[0]}
            </h4>
            <div className="scheduled-pin-messages">
              <div
                className={`scheduled-pin-status-message ${scheduledPinStatus}`}
              >
                {statusMessage}
              </div>
              <div className="scheduled-pin-createdAt">
                {`Created: ${new Date(createdAt).toLocaleString()}`}
              </div>
              {updatedAt && (
                <div className="scheduled-pin-updatedAt">
                  {`Updated: ${new Date(updatedAt).toLocaleString()}`}
                </div>
              )}
            </div>
          </div>
          {imageUrl && <img className="thumb" src={imageUrl} alt={imagePath} />}
        </div>
      </Link>
      {actionButton()}
    </div>
  );
};

export default ScheduledPinListItem;

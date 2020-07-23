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
  pinURL,
  scheduledDate,
  postedDate,
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
      shouldReschedule: false,
    });
  };

  const ActionButton = () => {
    switch (scheduledPinStatus) {
      case "posted":
        return (
          <div className="scheduled-pin-view-pin-link">
            <a href={pinURL} target="_blank" rel="noopener noreferrer">
              View Pin &#8599;
            </a>
          </div>
        );
      case "draft": // but only if it's valid
      case "pending":
      case "tooManyRequests":
      case "error":
        return (
          <Button
            className="schedule-pin-post-now-button"
            onClick={onPostPinClick}
          >
            Post Now
          </Button>
        );
      default:
        return null;
    }
  };

  const LinkWrapper = ({ children }) =>
    scheduledPinStatus !== "posted" ? (
      <Link
        className="scheduled-pin-edit-link"
        to={`/scheduledPins/${scheduledPinId}`}
      >
        {children}
      </Link>
    ) : (
      children
    );

  const StatusMessage = () => {
    switch (scheduledPinStatus) {
      case "posted":
        return `${statusMessage} on ${new Date(postedDate).toLocaleString()}`;
      case "tooManyRequests":
      case "pending":
        return `${statusMessage}${
          scheduledDate
            ? ` for ${new Date(scheduledDate).toLocaleString()}`
            : ""
        }`;
      default:
        return statusMessage || "";
    }
  };

  return (
    <div key={scheduledPinId} className="scheduled-pin-list-item">
      <LinkWrapper>
        <div className="scheduled-pin-container">
          <div className="scheduled-pin-body">
            <h4 className="scheduled-pin-header">{note || "{ No title }"}</h4>
            <div className="scheduled-pin-messages">
              <div
                className={`scheduled-pin-status-message ${scheduledPinStatus}`}
              >
                <StatusMessage />
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
          {!scheduledPinStatus /* || invalid/incomplete */ && (
            <div className="scheduled-pin-action-placeholder" />
          )}
        </div>
      </LinkWrapper>
      <ActionButton />
    </div>
  );
};

export default ScheduledPinListItem;

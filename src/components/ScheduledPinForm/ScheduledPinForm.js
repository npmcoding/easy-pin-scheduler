import React, { useState } from "react";
import {
  FormGroup,
  FormControl,
  ControlLabel,
  DropdownButton,
  MenuItem,
  Button,
} from "react-bootstrap";
import { handleImageUpload } from "../../libs/awsLib";
import { useBoards } from "../../libs/boardsUtil";
import { validateForms } from "../../libs/validationsLib";
import LoaderButton from "../LoaderButton/LoaderButton";
import SchedulePicker from "../SchedulePicker/SchedulePicker";
import "./ScheduledPinForm.css";

const ScheduledPinForm = ({
  history,
  pin,
  updateFields,
  submitAction,
  DeleteButton = () => null,
}) => {
  const { note, link, uploadedImageName, board, imageURL, scheduledDate } = pin;

  const [linkValMessage, setLinkValMessage] = useState("");
  const [imageValMessage, setImageValMessage] = useState("");
  const [boardValMessage, setBoardValMessage] = useState("");
  const [scheduledDateValMessage, setScheduledDateValMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [boards, loadingBoards] = useBoards();

  const handleBoardChange = (b) => {
    if (boardValMessage) {
      setBoardValMessage("");
    }

    updateFields({ board: b });
  };

  const handleLinkTextChange = (value) => {
    if (linkValMessage) {
      setLinkValMessage("");
    }
    updateFields({ link: value });
  };

  const handleFileChange = (e) => {
    e.preventDefault();

    const currentFile = e.target.files[0];
    if (currentFile) {
      if (imageValMessage) {
        setImageValMessage("");
      }

      handleImageUpload(currentFile, uploadedImageName).then(
        ([newUploadedImageName, newUploadedImageURL]) =>
          updateFields({
            uploadedImageName: newUploadedImageName,
            imageURL: newUploadedImageURL || imageURL,
          })
      );
    }
  };

  const handleDateChange = (newDate) => {
    if (scheduledDateValMessage) {
      setScheduledDateValMessage("");
    }
    updateFields({
      scheduledDate: newDate,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submittedPin = {
      ...pin,
      imageURL: pin.uploadedImageName ? undefined : pin.imageURL,
      scheduledDate: pin.scheduledDate
        ? pin.scheduledDate.toISOString()
        : undefined,
    };

    const {
      isValid,
      linkMessage,
      imageMessage,
      boardMessage,
      dateMessage,
    } = validateForms(submittedPin);
    if (isValid) {
      if (!pin.scheduledDate) {
        alert(
          "You have not scheduled a date and time!\nYour content won't be pinned without further action!"
        );
      }

      submitAction(submittedPin)
        .then(() => history.push("/"))
        .catch((e) => {
          alert("There was a problem while saving pin");
          console.error(e);
          setIsLoading(false);
        });
    } else {
      setLinkValMessage(linkMessage);
      setImageValMessage(imageMessage);
      setBoardValMessage(boardMessage);
      setScheduledDateValMessage(dateMessage);
      setIsLoading(false);
    }
  };

  return (
    <form className="pin-editor" onSubmit={handleSubmit}>
      <FormGroup controlId="board">
        <ControlLabel>
          <span className="required-field" title="Pinterest Board - required">
            Board
          </span>
        </ControlLabel>
        <DropdownButton
          id="dropdown-basic-button"
          className={`board-dropdown${boardValMessage ? " error" : ""}`}
          title={board ? board.name : "Choose a board"}
          disabled={loadingBoards}
        >
          {boards.map((b) => (
            <MenuItem
              key={b.id}
              as="button"
              eventKey={b.id}
              onClick={() => handleBoardChange(b)}
            >
              {b.name}
            </MenuItem>
          ))}
        </DropdownButton>
        {boardValMessage && (
          <div className="board-validation-message invalid">
            {boardValMessage}
          </div>
        )}
      </FormGroup>
      <FormGroup controlId="note">
        <ControlLabel>Description</ControlLabel>
        <FormControl
          value={note}
          onChange={({ target: { value } }) => updateFields({ note: value })}
        />
      </FormGroup>
      <FormGroup controlId="link">
        <ControlLabel>Link URL</ControlLabel>
        <FormControl
          value={link}
          onChange={({ target: { value } }) => handleLinkTextChange(value)}
        />
        {linkValMessage && (
          <div className="link-validation-message invalid">
            {linkValMessage}
          </div>
        )}
      </FormGroup>
      <FormGroup>
        <ControlLabel>
          <span className="required-field" title="Image - required">
            Image
          </span>
        </ControlLabel>
        {imageURL && (
          <FormControl.Static>
            <a target="_blank" rel="noopener noreferrer" href={imageURL}>
              <img className="thumb" src={imageURL} alt={uploadedImageName} />
            </a>
          </FormControl.Static>
        )}
        <FormControl onChange={handleFileChange} type="file" />
        {imageValMessage && (
          <div className="image-validation-message invalid">
            {imageValMessage}
          </div>
        )}
      </FormGroup>
      <FormGroup>
        <div
          className={`schedule${scheduledDate ? "" : " unscheduled"}${
            scheduledDateValMessage ? " error" : ""
          }`}
        >
          <SchedulePicker
            scheduledDate={scheduledDate}
            handleDateChange={handleDateChange}
          />
          {scheduledDateValMessage && (
            <div className="scheduledDate-validation-message invalid">
              {scheduledDateValMessage}
            </div>
          )}
        </div>
      </FormGroup>
      <FormGroup className="action-buttons">
        <DeleteButton />
        <Button
          className="cancel-button"
          bsSize="large"
          onClick={() => history.goBack()}
        >
          Cancel
        </Button>
        <LoaderButton
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
        >
          Save
        </LoaderButton>
      </FormGroup>
    </form>
  );
};

export default ScheduledPinForm;

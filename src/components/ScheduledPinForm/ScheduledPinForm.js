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
import LoaderButton from "../LoaderButton/LoaderButton";
import SchedulePicker from "../SchedulePicker/SchedulePicker";
import "./ScheduledPinForm.css";

const ScheduledPinForm = ({
  history,
  pin,
  updateFields,
  submitAction,
  DeleteButton = null,
}) => {
  const {
    scheduledPinId,
    note,
    link,
    uploadedImageName,
    board,
    imageURL,
    scheduledDate,
  } = pin;

  const [isLoading, setIsLoading] = useState(false);

  const [boards, loadingBoards] = useBoards();

  const handleFileChange = (e) => {
    e.preventDefault();
    const currentFile = e.target.files[0];
    handleImageUpload(currentFile, uploadedImageName).then(
      ([newUploadedImageName, newUploadedImageURL]) =>
        updateFields({
          uploadedImageName: newUploadedImageName,
          imageURL: newUploadedImageURL || imageURL,
        })
    );
  };

  const handleDateChange = (newDate) => {
    updateFields({
      scheduledDate: newDate,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate here
    if (!board) {
      alert("Please choose a board");
      return;
    }

    setIsLoading(true);

    const submittedPin = {
      ...pin,
      imageURL: pin.uploadedImageName ? undefined : pin.imageURL,
      scheduledDate: pin.scheduledDate
        ? pin.scheduledDate.toISOString()
        : undefined,
    };

    submitAction(submittedPin)
      .then(() => history.push("/"))
      .catch((e) => {
        alert("There was a problem while saving pin");
        console.error(e);
        setIsLoading(false);
      });
  };

  return (
    <form className="pin-editor" onSubmit={handleSubmit}>
      <FormGroup controlId="board">
        <ControlLabel>Board</ControlLabel>
        {scheduledPinId ? (
          <FormControl readOnly defaultValue={board.name} />
        ) : (
          <DropdownButton
            id="dropdown-basic-button"
            title={board ? board.name : "Choose a board"}
            disabled={loadingBoards}
          >
            {boards.map((b) => (
              <MenuItem
                key={b.id}
                as="button"
                eventKey={b.id}
                onClick={() => updateFields({ board: b })}
              >
                {b.name}
              </MenuItem>
            ))}
          </DropdownButton>
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
          onChange={({ target: { value } }) => updateFields({ link: value })}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Image</ControlLabel>
        {imageURL && (
          <FormControl.Static>
            <a target="_blank" rel="noopener noreferrer" href={imageURL}>
              <img className="thumb" src={imageURL} alt={uploadedImageName} />
            </a>
          </FormControl.Static>
        )}
        <FormControl onChange={handleFileChange} type="file" />
      </FormGroup>
      <FormGroup>
        <SchedulePicker
          scheduledDate={scheduledDate}
          handleDateChange={handleDateChange}
        />
        {/* <div className="schedule">
          <ControlLabel>Schedule date</ControlLabel>
          <SchedulePicker
            readonly={scheduleIsReadonly}
            selectedDate={scheduledDate}
            handleDateChange={handleDateChange}
          />
          {scheduledDate && (
            <>
              <FormControl readOnly defaultValue={scheduledDate} />
              <Button className="unschedule-button" onClick={() => {}}>
                Cancel Schedule
              </Button>
            </>
          )}
          {scheduleIsReadonly && (
            <Button
              className="schedule-button"
              onClick={() => setScheduleIsReadonly(false)}
            >
              Reschedule it!
            </Button>
          )}
        </div> */}
      </FormGroup>
      <FormGroup className="action-buttons">
        {DeleteButton && <DeleteButton />}
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

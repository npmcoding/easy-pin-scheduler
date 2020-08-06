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
import SchedulePickerModal from "../SchedulePickerModal/SchedulePickerModal";
import "./ScheduledPinForm.css";

const ScheduledPinForm = ({ history, pin, updateFields, submitAction, DeleteButton = null }) => {
  
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
  const [modalShow, setModalShow] = useState(false);

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
      scheduledDate: newDate
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
        <div className="first-line">
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
        </div>
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
          <ControlLabel>Schedule date</ControlLabel>
          {/* Wrap picker in Modal and display date as readonly */}
          <>
            {scheduledDate && (
              <>
                <FormControl readOnly defaultValue={scheduledDate} />
                <Button className="unschedule-button" onClick={() => {}}>
                  Cancel Schedule
                </Button>
              </>
            )}
            <Button
              className="schedule-button"
              onClick={() => setModalShow(true)}
            >
              {scheduledDate ? "Reschedule" : "Schedule"} it!
            </Button>
          </>
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

        <SchedulePickerModal
          showModal={modalShow}
          onHide={() => setModalShow(false)}
          selectedDate={scheduledDate}
          handleDateChange={handleDateChange}
          >
          <Button
            className="cancel-button"
            bsSize="large"
            onClick={() =>  setModalShow(false)}
          >
            Cancel
          </Button>
          <LoaderButton
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            Save
          </LoaderButton>
          </SchedulePickerModal>
      </form>
  );
};

export default ScheduledPinForm;

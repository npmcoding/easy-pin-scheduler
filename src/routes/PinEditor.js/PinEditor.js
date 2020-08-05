import React, { useState, useEffect } from "react";
import {
  FormGroup,
  FormControl,
  ControlLabel,
  DropdownButton,
  MenuItem,
  Button,
} from "react-bootstrap";
import { API, Storage } from "aws-amplify";
import { usePinFields } from "../../libs/hooksLib";
import { createPin, savePin, deletePin } from "../../libs/epsLib";
import { handleImageUpload } from "../../libs/awsLib";
import { useBoards } from "../../libs/boardsUtil";
import { getAccessToken } from "../../libs/pinterestLib";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import SchedulePicker from "../../components/SchedulePicker/SchedulePicker";
import "./PinEditor.css";

const PinEditor = ({ match, history }) => {
  const [pin, updateFields] = usePinFields();
  const {
    scheduledPinId,
    note,
    link,
    uploadedImageName,
    board,
    imageURL,
    scheduledDate,
    eventRuleName,
  } = pin;

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [boards, loadingBoards] = useBoards();

  useEffect(() => {
    if (match.params.id) {
      API.get("scheduledPins", `/scheduledPins/${match.params.id}`)
        .then((p) => {
          if (p.uploadedImageName) {
            Storage.vault
              .get(p.uploadedImageName)
              .then((uploadedImageURL) =>
                updateFields({ ...p, imageURL: uploadedImageURL })
              );
          } else {
            updateFields(p);
          }
        })
        .catch((e) => {
          alert("There was a problem loading pin");
          console.error(e);
        });
    }
  }, [match.params.id]);

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
      scheduledDate: newDate ? newDate.toISOString() : undefined,
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

    const APICall = scheduledPinId
      ? savePin(pin, scheduledPinId)
      : createPin({ ...pin, accessToken: getAccessToken() });

    APICall()
      .then(() => history.push("/"))
      .catch((e) => {
        alert("There was a problem while saving pin");
        console.error(e);
        setIsLoading(false);
      });
  };

  const handleDelete = (e) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this scheduled pin?"
    );

    if (!confirmed) return;

    setIsDeleting(true);

    deletePin(uploadedImageName, scheduledPinId, eventRuleName)
      .then(() => history.push("/"))
      .catch((e) => {
        alert("There was a problem while deleting pin");
        console.error(e);
        setIsDeleting(false);
      });
  };

  return (
    <div className="pin-editor">
      <form onSubmit={handleSubmit}>
        <div className="first-line">
          <FormGroup controlId="board">
            <ControlLabel>Board</ControlLabel>
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
          </FormGroup>
          <FormGroup>
            <ControlLabel>Schedule date</ControlLabel>
            <div>
              <SchedulePicker
                selectedDate={scheduledDate}
                handleDateChange={handleDateChange}
              />
            </div>
          </FormGroup>
        </div>
        <FormGroup controlId="note">
          <ControlLabel>Description</ControlLabel>
          <FormControl value={note} onChange={({target: {value}}) => updateFields({note: value})} />
        </FormGroup>
        <FormGroup controlId="link">
          <ControlLabel>Link URL</ControlLabel>
          <FormControl value={link} onChange={({target: {value}}) => updateFields({link: value})} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Image</ControlLabel>
          {imageURL && (
            <FormControl.Static>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={imageURL}
              >
                <img
                  className="thumb"
                  src={imageURL}
                  alt={uploadedImageName}
                />
              </a>
            </FormControl.Static>
          )}
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <FormGroup className="action-buttons">
          <Button
            className="cancel-button"
            bsSize="large"
            onClick={() => history.goBack()}
          >
            Cancel
          </Button>
          <LoaderButton
            // block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
          >
            Create
          </LoaderButton>
        </FormGroup>
      </form>
    </div>
  );
};

export default PinEditor;

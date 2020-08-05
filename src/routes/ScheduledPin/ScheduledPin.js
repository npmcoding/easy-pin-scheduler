import React, { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { savePin, deletePin } from "../../libs/epsLib";
import { handleImageUpload } from "../../libs/awsLib";
import { FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import SchedulePicker from "../../components/SchedulePicker/SchedulePicker";
import "./ScheduledPin.css";

const ScheduledPin = ({ match, history }) => {
  const [pin, setPin] = useState(null);
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [uploadedImageURL, setUploadedImageURL] = useState("");
  const [selectedDate, handleDateChange] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    API.get("scheduledPins", `/scheduledPins/${match.params.id}`)
      .then((initialPin) => {
        setNote(initialPin.note || "");
        setLink(initialPin.link || "");
        handleDateChange(initialPin.scheduledDate || null)
        setPin(initialPin);

        if (initialPin.uploadedImageName) {
          setUploadedImageName(initialPin.uploadedImageName);
          Storage.vault
            .get(initialPin.uploadedImageName)
            .then(setUploadedImageURL);
        }
      })
      .catch((e) => {
        alert("There was a problem loading pin");
        console.error(e);
      });
  }, [match.params.id]);

  const handleFileChange = (e) => {
    e.preventDefault();
    const currentFile = e.target.files[0];
    handleImageUpload(currentFile, uploadedImageName).then(
      ([ newUploadedImageName, newUploadedImageURL ]) => {
        setUploadedImageName(newUploadedImageName);
        setUploadedImageURL(newUploadedImageURL || uploadedImageURL);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedPin = {
      ...pin,
      note,
      link,
      uploadedImageName,
      scheduledDate: selectedDate ? selectedDate.toISOString() : undefined,
    };

    savePin(updatedPin, match.params.id)
      .then(() => history.push("/"))
      .catch((e) => {
        alert('There was a problem while saving pin');
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

    deletePin(uploadedImageName, match.params.id, pin.eventRuleName)
      .then(() => history.push("/"))
      .catch((e) => {
        console.log(e);
        setIsDeleting(false);
      });
  };

  return (
    <div className="scheduledPin">
      {pin && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="board">
            <ControlLabel>Board</ControlLabel>
            <FormControl readOnly defaultValue={pin.board.name} />
          </FormGroup>
          <FormGroup controlId="note">
            <ControlLabel>Description</ControlLabel>
            <FormControl
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="link">
            <ControlLabel>Link URL</ControlLabel>
            <FormControl
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Image</ControlLabel>
            {uploadedImageURL && (
              <FormControl.Static>
                <a target="_blank" rel="noopener noreferrer" href={uploadedImageURL}>
                  <img className="thumb" src={uploadedImageURL} alt={uploadedImageName} />
                </a>
              </FormControl.Static>
            )}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Schedule date</ControlLabel>
            <div>
              <SchedulePicker
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
              />
            </div>
          </FormGroup>
          <FormGroup className="action-buttons">
            <LoaderButton
              //   block
              bsSize="large"
              bsStyle="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              {" "}
              Delete{" "}
            </LoaderButton>
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
              {" "}
              Save{" "}
            </LoaderButton>
          </FormGroup>
        </form>
      )}
    </div>
  );
};

export default ScheduledPin;

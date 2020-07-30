import React, { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import { savePin, deletePin } from "../../libs/epsLib";
import { handleImageUpload } from "../../libs/awsLib";
import "./ScheduledPin.css";

const ScheduledPin = ({ match, history }) => {
  const [pin, setPin] = useState(null);
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadPin = () =>
      API.get("scheduledPins", `/scheduledPins/${match.params.id}`);

    loadPin()
      .then((initialPin) => {
        setNote(initialPin.note || "");
        setLink(initialPin.link || "");
        setPin(initialPin);

        if (initialPin.imagePath) {
          setImagePath(initialPin.imagePath);
          Storage.vault
            .get(initialPin.imagePath)
            .then((fetchedimageURL) => setImageURL(fetchedimageURL));
        }
      })
      .catch((e) => alert(e));
  }, [match.params.id]);

  const handleFileChange = (e) => {
    e.preventDefault();
    const currentFile = e.target.files[0];
    handleImageUpload(currentFile, imagePath).then(
      ({ newImagePath, newImageURL }) => {
        setImagePath(newImagePath);
        setImageURL(newImageURL || imageURL);
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
      imagePath,
    };

    savePin(updatedPin, match.params.id)
      .then(() => history.push("/"))
      .catch((e) => {
        alert(e);
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

    deletePin(imagePath, match.params.id, pin.eventRuleName)
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
            {imageURL && (
              <FormControl.Static>
                <a target="_blank" rel="noopener noreferrer" href={imageURL}>
                  <img className="thumb" src={imageURL} alt={imagePath} />
                </a>
              </FormControl.Static>
            )}
            <FormControl onChange={handleFileChange} type="file" />
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

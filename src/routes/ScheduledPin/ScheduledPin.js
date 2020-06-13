import React, { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import { formatFilename, handleImageUpload } from "../../libs/awsLib";
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

    const onLoad = async () => {
      try {
        const initialPin = await loadPin();
        if (initialPin.imagePath) {
          setImagePath(initialPin.imagePath);
          setImageURL(await Storage.vault.get(initialPin.imagePath));
        }

        setNote(initialPin.note || "");
        setLink(initialPin.link || "");
        setPin(initialPin);
      } catch (e) {
        alert(e);
      }
    };

    onLoad();
  }, [match.params.id]);

  const handleFileChange = async (e) => {
    e.preventDefault();
    const currentFile = e.target.files[0];
    const { newImagePath, newImageURL } = await handleImageUpload(
      currentFile,
      imagePath
    );
    setImagePath(newImagePath);
    setImageURL(newImageURL || imageURL);
  };

  const savePin = (pin) => {
    return API.put("scheduledPins", `/scheduledPins/${match.params.id}`, {
      body: {
        ...pin,
        note,
        link,
        imagePath,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await savePin({
        ...pin,
        note,
        link,
        imagePath,
      });
      history.push("/");
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };

  const deletePin = () =>
    API.del("scheduledPins", `/scheduledPins/${match.params.id}`);

  const handleDelete = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this scheduled pin?"
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deletePin();
      history.push("/");
    } catch (e) {
      alert(e);
      setIsDeleting(false);
    }
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
                  <img
                    className="thumb"
                    src={imageURL}
                    alt={formatFilename(imagePath)}
                  />
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

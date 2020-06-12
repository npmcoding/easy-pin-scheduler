import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import config from "../../config";
import { s3Upload, s3Remove } from "../../libs/awsLib";
import "./ScheduledPin.css";

const ScheduledPin = ({ match, history }) => {
  const file = useRef(null);
  const [pin, setPin] = useState(null);
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadPin = () =>
      API.get("scheduledPins", `/scheduledPins/${match.params.id}`);

    const onLoad = async () => {
      try {
        const pin = await loadPin();
        const { note, link, imagePath } = pin;

        if (imagePath) {
          setImageUrl(await Storage.vault.get(imagePath));
        }

        setNote(note);
        setLink(link);
        setPin(pin);
      } catch (e) {
        alert(e);
      }
    };

    onLoad();
  }, [match.params.id]);

  const formatFilename = (str) => str.replace(/^\w+-/, "");

  const handleFileChange = (e) => (file.current = e.target.files[0]);

  const savePin = (pin) => {
    return API.put("scheduledPins", `/scheduledPins/${match.params.id}`, {
      body: pin,
    });
  };

  const handleSubmit = async (e) => {
    let imagePath;

    e.preventDefault();

    if (file.current && file.current.size > config.MAX_imagePath_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_imagePath_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        if (pin.imagePath) {
          //const key = `${pin.userId}/${pin.imagePath}`;
          await s3Remove(pin.imagePath);
        }

        imagePath = await s3Upload(file.current);
      }

      await savePin({
        note,
        link,
        imagePath: imagePath || pin.imagePath,
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
          {pin.imagePath && (
            <FormGroup>
              <ControlLabel>Image</ControlLabel>
              <FormControl.Static>
                <a target="_blank" rel="noopener noreferrer" href={imageUrl}>
                  {formatFilename(pin.imagePath)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!pin.imagePath && <ControlLabel>Image</ControlLabel>}
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

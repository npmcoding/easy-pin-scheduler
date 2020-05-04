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
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadPin = () =>
      API.get("scheduledPins", `/scheduledPins/${match.params.id}`);

    const onLoad = async () => {
      try {
        const pin = await loadPin();
        const { content, attachment } = pin;

        if (attachment) {
          pin.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
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
    let attachment;

    e.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        if (pin.attachment) {
          //const key = `${pin.userId}/${pin.attachment}`;
          await s3Remove(pin.attachment);
        }

        attachment = await s3Upload(file.current);
      }

      await savePin({
        content,
        attachment: attachment || pin.attachment,
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
          <FormGroup controlId="content">
            <ControlLabel>Caption</ControlLabel>
            <FormControl
              value={content}
              componentClass="textarea"
              onChange={(e) => setContent(e.target.value)}
            />
          </FormGroup>
          {pin.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={pin.attachmentURL}
                >
                  {formatFilename(pin.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!pin.attachment && <ControlLabel>Attachment</ControlLabel>}
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

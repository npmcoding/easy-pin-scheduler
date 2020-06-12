import React, { useRef, useState } from "react";
import {
  FormGroup,
  FormControl,
  ControlLabel,
  DropdownButton,
  MenuItem,
  Button,
} from "react-bootstrap";
import { API } from "aws-amplify";
import { s3Upload } from "../../libs/awsLib";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import config from "../../config";
import { useBoards } from "../../libs/boardsUtil";
import "./NewPin.css";

const NewPin = ({ history }) => {
  const file = useRef(null);
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boards, loadingBoards] = useBoards();

  const handleFileChange = (e) => (file.current = e.target.files[0]);

  const createPin = (scheduledPin) => {
    return API.post("scheduledPins", "/scheduledPins", {
      body: scheduledPin,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(file.current);

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    if (!selectedBoard) {
      alert("Please choose a board");
      return;
    }

    setIsLoading(true);

    try {
      const imagePath = file.current ? await s3Upload(file.current) : null;

      await createPin({ note, link, imagePath, board: selectedBoard });
      history.push("/");
    } catch (e) {
      console.log(e);
      alert(e);
      setIsLoading(false);
    }
  };

  return (
    <div className="newpin">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="board">
          <ControlLabel>Board</ControlLabel>
          <DropdownButton
            id="dropdown-basic-button"
            title={selectedBoard ? selectedBoard.name : "Choose a board"}
            disabled={loadingBoards}
          >
            {boards.map((b) => (
              <MenuItem
                key={b.id}
                as="button"
                eventKey={b.id}
                onClick={() => setSelectedBoard(b)}
              >
                {b.name}
              </MenuItem>
            ))}
          </DropdownButton>
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
        <FormGroup controlId="file">
          <ControlLabel>Image</ControlLabel>
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

export default NewPin;

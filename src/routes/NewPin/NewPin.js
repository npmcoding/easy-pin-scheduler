import React, { useState } from "react";
import {
  FormGroup,
  FormControl,
  ControlLabel,
  DropdownButton,
  MenuItem,
  Button,
} from "react-bootstrap";
import { createPin } from "../../libs/epsLib";
import { handleImageUpload } from "../../libs/awsLib";
import { useBoards } from "../../libs/boardsUtil";
import { getAccessToken } from "../../libs/pinterestLib";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import SchedulePicker from "../../components/SchedulePicker/SchedulePicker";
import "./NewPin.css";

const NewPin = ({ history }) => {
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [selectedDate, handleDateChange] = useState(null);
  const [boards, loadingBoards] = useBoards();

  const handleFileChange = async (e) => {
    e.preventDefault();
    const currentFile = e.target.files[0];
    if (currentFile) {
      const { newImagePath, newImageURL } = await handleImageUpload(
        currentFile,
        imagePath
      );
      setImagePath(newImagePath);
      setImageURL(newImageURL || imageURL);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBoard) {
      alert("Please choose a board");
      return;
    }

    setIsLoading(true);

    const pin = {
      accessToken: getAccessToken(),
      note,
      link,
      imagePath,
      board: selectedBoard,
    };
    createPin(pin)
      .then(() => history.push("/"))
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
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
          <FormControl value={note} onChange={(e) => setNote(e.target.value)} />
        </FormGroup>
        <FormGroup controlId="link">
          <ControlLabel>Link URL</ControlLabel>
          <FormControl value={link} onChange={(e) => setLink(e.target.value)} />
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
        <FormGroup>
          <ControlLabel>Schedule it</ControlLabel>
          <div>
            <SchedulePicker
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
            />
          </div>
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

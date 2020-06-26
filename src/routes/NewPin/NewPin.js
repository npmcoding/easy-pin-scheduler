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
import { formatFilename, handleImageUpload } from "../../libs/awsLib";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import { useBoards } from "../../libs/boardsUtil";
import { getAccessToken } from "../../libs/pinterestLib";
import "./NewPin.css";

const NewPin = ({ history }) => {
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [boards, loadingBoards] = useBoards();

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
      .then((success) => {
        if (success) {
          history.push("/");
        } else {
          alert("Pin creation unsuccessful");
        }
      })
      .catch((e) => {
        alert(e);
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

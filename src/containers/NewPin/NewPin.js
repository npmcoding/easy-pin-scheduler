import React, { useRef, useState, useEffect, useContext } from "react";
import { FormGroup, FormControl, ControlLabel, DropdownButton, Dropdown } from "react-bootstrap";
import { API } from "aws-amplify";
import { s3Upload } from "../../libs/awsLib";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import config from "../../config";
import {UserContext} from '../../components/UserContext';
import "./NewPin.css";


const NewPin = ({ history }) => {
    const file = useRef(null);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    //const [boards, setBoards] = useState([]);
    const [loadingBoards, setLoadingBoards] = useState(true);

    const {userData, setUserData} = useContext(UserContext);
    console.log(userData);

    useEffect(() => {
        const loadBoards = async () => {

            try {
                await window.PDK.me('boards', { fields: 'id,name' }, b => {
                    console.log(b);
                    if (b.error) {
                        alert('Could not fetch boards. Try again later');
                    }
                    else {
                        setUserData({...userData, boards: b.data})
                    }
                });
            } catch (e) {
                alert('board fetching error', e);
            }
            setLoadingBoards(false);
        }
        if(userData.boards === undefined) {
        // loadBoards()
        setUserData({...userData, boards:[{id: "574701671138706368", name: "Test"}]})
        }
    }, []);

    const handleFileChange = e => file.current = e.target.files[0];

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(file.current);

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`
            );
            return;
        }

        setIsLoading(true);

        try {
            const attachment = file.current
                ? await s3Upload(file.current)
                : null;

            await createPin({ content, attachment });
            history.push("/");
        } catch (e) {
            console.log(e);
            alert(e);
            setIsLoading(false);
        }
    }

    const createPin = scheduledPin => {
        return API.post("scheduledPins", "/scheduledPins", {
            body: scheduledPin
        });
    }

    return (
        <div className="newpin">
            <form onSubmit={handleSubmit}>
                <DropdownButton id="dropdown-basic-button" title="Choose a board" disabled={loadingBoards}>
                    {userData.boards && userData.boards.length && userData.boards.map(b => (
                        <Dropdown.Item
                            key={b.id}
                            as="button"
                            eventKey={b.id}
                            onClick={() => { }}>
                            {b.name}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
                <FormGroup controlId="content">
                    <ControlLabel>Caption</ControlLabel>
                    <FormControl
                        value={content}
                        componentClass="textarea"
                        onChange={e => setContent(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="file">
                    <ControlLabel>Attachment</ControlLabel>
                    <FormControl onChange={handleFileChange} type="file" />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    bsStyle="primary"
                    isLoading={isLoading}
                >
                    Create
                </LoaderButton>
            </form>
        </div>
    )
}

export default NewPin;
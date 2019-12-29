import React, { useRef, useState } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { API } from "aws-amplify";
import { s3Upload } from "../../libs/awsLib";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import config from "../../config";
import "./NewPin.css";


const NewPin = ({ history }) => {
    const file = useRef(null);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
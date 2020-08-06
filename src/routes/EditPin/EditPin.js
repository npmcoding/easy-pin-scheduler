import React, { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import ScheduledPinForm from "../../components/ScheduledPinForm/ScheduledPinForm";
import { usePinFields } from "../../libs/hooksLib";
import { savePin, deletePin } from "../../libs/epsLib";
import "./EditPin.css";

const EditPin = ({ match, history }) => {
  const [pin, updateFields] = usePinFields();
  const [isDeleting, setIsDeleting] = useState(false);

  const scheduledPinId = match.params.id;

  useEffect(() => {
    API.get("scheduledPins", `/scheduledPins/${scheduledPinId}`)
      .then((p) => {
        if (p.uploadedImageName) {
          Storage.vault
            .get(p.uploadedImageName)
            .then((uploadedImageURL) =>
              updateFields({ ...p, imageURL: uploadedImageURL })
            );
        } else {
          updateFields(p);
        }
      })
      .catch((e) => {
        alert("There was a problem loading pin");
        console.error(e);
      });
  }, [scheduledPinId, updateFields]);

  const submitAction = (updatedPin) => savePin(updatedPin, match.params.id);

  const handleDelete = (e) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this scheduled pin?"
    );

    if (!confirmed) return;

    setIsDeleting(true);

    deletePin(pin.uploadedImageName, match.params.id, pin.eventRuleName)
      .then(() => history.push("/"))
      .catch((e) => {
        console.log(e);
        setIsDeleting(false);
      });
  };

  const DeleteButton = () => (
    <LoaderButton
      bsSize="large"
      bsStyle="danger"
      onClick={handleDelete}
      isLoading={isDeleting}
    >
      {" "}
      Delete{" "}
    </LoaderButton>
  );

  return (
    <div className="scheduledPin">
      <ScheduledPinForm
        history={history}
        pin={pin}
        updateFields={updateFields}
        DeleteButton={DeleteButton}
        submitAction={submitAction}
      />
    </div>
  );
};

export default EditPin;

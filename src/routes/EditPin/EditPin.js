import React, { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import ScheduledPinForm from "../../components/ScheduledPinForm/ScheduledPinForm";
import { initialPinFormState } from "../../libs/constants";
import { savePin, deletePin } from "../../libs/epsLib";
import "./EditPin.css";

const EditPin = ({ match, history }) => {
  const [pin, setPin] = useState(initialPinFormState);

  const [isDeleting, setIsDeleting] = useState(false);

  const scheduledPinId = match.params.id;

  useEffect(() => {
    API.get("scheduledPins", `/scheduledPins/${scheduledPinId}`)
      .then((p) => {
        if (p.uploadedImageName) {
          Storage.vault
            .get(p.uploadedImageName)
            .then((uploadedImageURL) =>
            setPin({ ...p, imageURL: uploadedImageURL })
            );
        } else {
          setPin(p);
        }
      })
      .catch((e) => {
        alert("There was a problem loading pin");
        console.error(e);
      });
  }, [scheduledPinId]);

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
        updateFields={updatedFields => setPin({...pin, ...updatedFields})}
        DeleteButton={DeleteButton}
        submitAction={submitAction}
      />
    </div>
  );
};

export default EditPin;

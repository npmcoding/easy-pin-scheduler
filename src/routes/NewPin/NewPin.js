import React, { useState } from "react";
import ScheduledPinForm from "../../components/ScheduledPinForm/ScheduledPinForm";
import { createPin } from "../../libs/epsLib";
import { initialPinFormState } from "../../libs/constants";
import { getAccessToken } from "../../libs/pinterestLib";
import "./NewPin.css";

const NewPin = ({ history }) => {
  const [pin, setPin] = useState(initialPinFormState);

  const submitAction = (newPin) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      createPin({
        ...newPin,
        accessToken,
      });
    } else {
      history.push("/profile");
    }
  };

  return (
    <div className="newpin">
      <ScheduledPinForm
        history={history}
        pin={pin}
        updateFields={(updatedFields) => setPin({ ...pin, ...updatedFields })}
        submitAction={submitAction}
      />
    </div>
  );
};

export default NewPin;

import React from "react";
import ScheduledPinForm from "../../components/ScheduledPinForm/ScheduledPinForm";
import { createPin } from "../../libs/epsLib";
import { usePinFields } from "../../libs/hooksLib";
import { getAccessToken } from "../../libs/pinterestLib";
import "./NewPin.css";

const NewPin = ({ history }) => {
  const [pin, updateFields] = usePinFields();

  const submitAction = (newPin) =>
    createPin({
      ...newPin,
      accessToken: getAccessToken(),
    });

  return (
    <div className="newpin">
      <ScheduledPinForm
        history={history}
        pin={pin}
        updateFields={updateFields}
        submitAction={submitAction}
      />
    </div>
  );
};

export default NewPin;

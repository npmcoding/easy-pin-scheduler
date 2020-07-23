import React from "react";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "./SchedulePicker.css";

const SchedulePicker = ({ selectedDate, handleDateChange }) => {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DateTimePicker
        clearable
        variant="dialog"
        value={selectedDate}
        minDate={new Date(Date.now())}
        onChange={handleDateChange}
      />
    </MuiPickersUtilsProvider>
  );
};

export default SchedulePicker;

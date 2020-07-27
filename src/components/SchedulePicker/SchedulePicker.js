import React from "react";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import MomentUtils from "@date-io/moment";
import "./SchedulePicker.css";

const SchedulePicker = ({ selectedDate, handleDateChange }) => {
  const customTheme = createMuiTheme({
    overrides: {
      MuiSvgIcon: {
        root: {
          width: "1.75em",
          height: "1.75em",
        },
      },
      MuiTypography: {
        h3: {
          fontSize: "4rem",
        },
        h4: {
          fontSize: "3rem",
        },
        subtitle1: {
          fontSize: "1.5rem",
        },
        body1: {
          fontSize: "2rem",
          fontFamily: '"Open Sans", sans-serif',
          fontWeight: 500,
          lineHeight: 1,
        },
        body2: {
          fontSize: "1.5rem",
          fontFamily: '"Open Sans", sans-serif',
          fontWeight: 500,
        },
      },
      MuiPickersDay: {
        day: {
          width: "5em",
          height: "5em",
        },
      },
      MuiPickersCalendarHeader: {
        dayLabel: {
          fontSize: "1.25rem",
          width: "3em",
        },
      },
      MuiButton: {
        root: {
          fontSize: "1.5rem",
          fontWeight: 600,
        },
      },
      MuiInputBase: {
        input: {
          font: '16px "Open Sans", sans-serif',
          fontWeight: 600,
        },
      },
    },
  });
  return (
    <ThemeProvider theme={customTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DateTimePicker
          clearable
          className="date-time-picker"
          variant="dialog"
          value={selectedDate}
          minDate={new Date(Date.now())}
          onChange={handleDateChange}
        />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default SchedulePicker;

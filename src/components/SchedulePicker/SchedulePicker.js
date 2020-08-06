import React, { useState } from "react";
import { ControlLabel, Button } from "react-bootstrap";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import MomentUtils from "@date-io/moment";
import "./SchedulePicker.css";

const SchedulePicker = ({ scheduledDate, handleDateChange }) => {
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

  const [scheduleIsReadonly, setScheduleIsReadonly] = useState(!!scheduledDate);

  return (
    <ThemeProvider theme={customTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="schedule">
          <ControlLabel>Schedule date</ControlLabel>
          <DateTimePicker
            readOnly={scheduleIsReadonly}
            clearable
            className="date-time-picker"
            variant="dialog"
            value={scheduledDate}
            disablePast
            onChange={handleDateChange}
          />
          {scheduleIsReadonly && (
            <div className="schedule-action-buttons">
              <Button className="unschedule-button" onClick={() => handleDateChange(null)}>
                Cancel Schedule
              </Button>

              <Button
                className="schedule-button"
                onClick={() => setScheduleIsReadonly(false)}
              >
                Reschedule it!
              </Button>
            </div>
          )}
        </div>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default SchedulePicker;

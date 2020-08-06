import React from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import MomentUtils from "@date-io/moment";
import { Modal } from "react-bootstrap";
import "./SchedulePickerModal.css";

const SchedulePickerModal = ({
  showModal,
  onHide,
  selectedDate,
  handleDateChange,
  children,
}) => {
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
    <Modal size="lg" /* centered */ show={showModal} onHide={onHide}>
      <Modal.Body>
        <ThemeProvider theme={customTheme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDateTimePicker
              variant="inline"
              className="date-time-picker"
              value={selectedDate}
              disablePast
              onChange={handleDateChange}
            />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </Modal.Body>
      <Modal.Footer>{children}</Modal.Footer>
    </Modal>
  );
};

export default SchedulePickerModal;

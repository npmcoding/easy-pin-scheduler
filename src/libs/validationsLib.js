import moment from 'moment';
const validLinkRegEx = RegExp(
  `^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=%.]+$`,
  "ig"
);
export const validateForms = ({ board, uploadedImageName, imageURL, link, scheduledDate }) => {
  let formValidationState = {
    isValid: true,
    link: "",
    image: "",
    board: "",
    scheduledDate: "",
  };

  if (!board) {
    formValidationState = {
      ...formValidationState,
      isValid: false,
      board: "Please choose a board",
    };
  }

  if (!uploadedImageName && !imageURL) {
    formValidationState = {
      ...formValidationState,
      isValid: false,
      image: "Please include an image",
    };
  }

  if (link.length && !validLinkRegEx.test(link)) {
    formValidationState = {
      ...formValidationState,
      isValid: false,
      link: "Please enter a valid link",
    };
  }

  if (scheduledDate && moment(scheduledDate).isBefore()) {
    formValidationState = {
        ...formValidationState,
        isValid: false,
        scheduledDate: "Please choose a future date",
      };
  }

  return formValidationState;
};

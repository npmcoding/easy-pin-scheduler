import moment from "moment";
const validLinkRegEx = RegExp(
  `^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=%.]+$`,
  "ig"
);

export const validateForms = ({
  board,
  uploadedImageName,
  imageURL,
  link,
  scheduledDate,
}) => {
  const linkMessage =
    link.length && !validLinkRegEx.test(link)
      ? "Please enter a valid link"
      : "";
  const imageMessage =
    !uploadedImageName && !imageURL ? "Please include an image" : "";
  const boardMessage = !board ? "Please choose a board" : "";
  const dateMessage =
    scheduledDate && moment(scheduledDate).isBefore()
      ? "Please choose a future date"
      : "";

  const isValid = !(
    linkMessage.length ||
    imageMessage.length ||
    boardMessage.length ||
    dateMessage.length
  );
  return {
    isValid,
    linkMessage,
    imageMessage,
    boardMessage,
    dateMessage,
  };
};

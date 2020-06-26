import { API } from "aws-amplify";
import { s3Remove } from "./awsLib";

export const createPin = (scheduledPin) =>
  API.post("scheduledPins", "/scheduledPins", {
    body: scheduledPin,
  })
    .then(({ success }) => success)
    .catch((e) => alert(e));

export const savePin = (pin, id) =>
  API.put("scheduledPins", `/scheduledPins/${id}`, {
    body: pin,
  })
    .then(({ success }) => success)
    .catch((e) => alert(e));

export const deletePin = (imagePath, id) =>
  API.del("scheduledPins", `/scheduledPins/${id}`)
    .then(({ success }) => {
      if (success) {
        s3Remove(imagePath);
      }
      return success;
    })
    .catch((e) => alert(e));

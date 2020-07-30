import { API } from "aws-amplify";
import { s3Remove } from "./awsLib";

export const createPin = (scheduledPin) =>
  API.post("scheduledPins", "/scheduledPins", {
    body: scheduledPin,
  }).catch((e) => {
    alert("Pin creation unsuccessful");
    console.log(e);
  });

export const savePin = (pin, id) =>
  API.put("scheduledPins", `/scheduledPins/${id}`, {
    body: pin,
  }).catch((e) => {
    alert("Update unsuccessful");
    console.log(e);
  });

export const deletePin = (imagePath, id, eventRuleName = "") =>
  API.del("scheduledPins", `/scheduledPins/${id}`, {
    body: { eventRuleName },
  })
    .then(() => s3Remove(imagePath))
    .catch((e) => {
      alert("Delete unsuccessful");
      console.log(e);
    });

export const postPin = (scheduledPin) =>
  API.post("scheduledPins", "/postPin", {
    body: scheduledPin,
  });

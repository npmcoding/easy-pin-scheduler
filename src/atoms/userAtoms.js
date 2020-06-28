import { atom } from "recoil";

export const emailState = atom({
  key: "emailState",
  default: null,
});

export const authenticatedState = atom({
  key: "authenticatedState",
  default: false,
});

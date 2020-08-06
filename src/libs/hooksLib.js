import { useState } from "react";

export const useFormFields = (initialState) => {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    (event) => {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      });
    },
  ];
};

export const usePinFields = () => {
  const initialState = {
    note: "",
    link: "",
    uploadedImageName: "",
    board: null,
    imageURL: "",
    scheduledDate: null,
  };

  const [fields, setValues] = useState(initialState);

  return [
    fields,
    (updatedFields) =>
      setValues({
        ...fields,
        ...updatedFields,
      }),
  ];
};

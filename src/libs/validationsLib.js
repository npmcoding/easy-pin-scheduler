export const validateForms = ({board, uploadedImageName, imageURL}) => {
    const formValidationState = {
        isValid: false,
        link: "",
        image: "",
        board: "",
        scheduledDate: "",
    };

    if (!board) {
        formValidationState['board'] = 'Please choose a board';
    }

    if (!uploadedImageName || imageURL) {
        formValidationState['image'] = 'Please include an image';
    }

    return formValidationState;
};

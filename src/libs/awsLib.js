import Amplify, { Storage } from "aws-amplify";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { cognito, s3, apiGateway, MAX_ATTACHMENT_SIZE } from "../config";
const { IDENTITY_POOL_ID, REGION, USER_POOL_ID, APP_CLIENT_ID } = cognito;

export const initAWS = () => {
  Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: REGION,
      userPoolId: USER_POOL_ID,
      identityPoolId: IDENTITY_POOL_ID,
      userPoolWebClientId: APP_CLIENT_ID,
    },
    Storage: {
      region: s3.REGION,
      bucket: s3.BUCKET,
      identityPoolId: IDENTITY_POOL_ID,
    },
    API: {
      endpoints: [
        {
          name: "scheduledPins",
          endpoint: apiGateway.URL,
          region: apiGateway.REGION,
        },
      ],
    },
  });

  AWS.config.region = REGION;
};

export const initUserPoolUser = (jwtToken) => {
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
    Logins: {
      [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: jwtToken,
    },
  });
};

export const s3Upload = (file) => {
  // const filename = `${Date.now()}-${file.name}`;
  const ext = file.name.split(".").pop();
  const key = `${uuidv4()}.${ext}`;
  return Storage.vault
    .put(key, file, {
      contentType: file.type,
      metadata: {
        date: new Date(Date.now()).toLocaleString(),
        fileName: file.name,
      },
    })
    .then((stored) => stored.key)
    .catch((e) => {
      alert("Error uploading image");
      console.error(e);
    });
};

export const s3Remove = (key) => {
  Storage.vault.remove(key, { level: "private" }).catch((e) => console.log(e));
};

export const handleImageUpload = async (currentFile, existingImage) => {
  if (currentFile && currentFile.size > MAX_ATTACHMENT_SIZE) {
    alert(
      `Please pick a file smaller than ${MAX_ATTACHMENT_SIZE / 1000000} MB.`
    );
    return {
      newImage: existingImage,
      newImageURL: null,
    };
  }
  if (existingImage) {
    await s3Remove(existingImage);
  }
  const newImage = await s3Upload(currentFile);
  const newImageURL = newImage ? await Storage.vault.get(newImage) : null;

  return [newImage, newImageURL];
};


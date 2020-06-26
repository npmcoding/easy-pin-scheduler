import Amplify, { Storage, Auth } from "aws-amplify";
import { cognito, s3, apiGateway, MAX_ATTACHMENT_SIZE } from "../config";
const { IDENTITY_POOL_ID, REGION, USER_POOL_ID, APP_CLIENT_ID } = cognito;

export const s3Upload = async (file) => {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
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

  return stored.key;
};

export const s3Remove = async (key) => {
  try {
    await Storage.vault.remove(key, { level: "private" });
  } catch (e) {
    alert(e);
  }
};

export const formatFilename = (fileName) => fileName.replace(/^\w+-/, "");

export const handleImageUpload = async (currentFile, existingImagePath) => {
  if (currentFile && currentFile.size > MAX_ATTACHMENT_SIZE) {
    alert(
      `Please pick a file smaller than ${MAX_ATTACHMENT_SIZE / 1000000} MB.`
    );
    return {
      newImagePath: existingImagePath,
      newImageURL: null,
    };
  }
  if (existingImagePath) {
    await s3Remove(existingImagePath);
  }
  const newImagePath = await s3Upload(currentFile);
  const newImageURL = await Storage.vault.get(newImagePath);

  return {
    newImagePath,
    newImageURL,
  };
};

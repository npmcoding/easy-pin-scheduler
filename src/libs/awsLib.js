import { Storage } from "aws-amplify";
import config from "../config";

export const s3Upload = async (file) => {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
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
  if (currentFile && currentFile.size > config.MAX_ATTACHMENT_SIZE) {
    alert(
      `Please pick a file smaller than ${
        config.MAX_ATTACHMENT_SIZE / 1000000
      } MB.`
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

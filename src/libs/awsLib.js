import { Storage } from "aws-amplify";

export const s3Upload = async (file) => {
    const filename = `${Date.now()}-${file.name}`;

    const stored = await Storage.vault.put(filename, file, {
        contentType: file.type
    });

    return stored.key;
}

export const s3Remove = async (key) => {
    try {
        const result = await Storage.vault.remove(key, {level: 'private'});
        console.log(key);
        console.log(result);
    } catch (e) {
        alert(e);
    }
}
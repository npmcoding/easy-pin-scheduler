export const MAX_ATTACHMENT_SIZE = 5000000;
export const PINTEREST_APP_ID = "4988587254885678740";
export const s3 = {
    REGION: "us-east-2",
    BUCKET: "easy-pin-scheduler",
    IMG_BUCKET: "eps-images"
};
export const apiGateway = {
    REGION: "us-east-2",
    URL: "https://1w1s2iy56d.execute-api.us-east-2.amazonaws.com/dev"
};
export const cognito = {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_MngmmIPv7",
    APP_CLIENT_ID: "792hha7d95psgng6l5v7vqm2kt",
    IDENTITY_POOL_ID: "us-east-2:79595818-51ea-41b6-8002-f5a694266fee"
}

export default {
    MAX_ATTACHMENT_SIZE,
    PINTEREST_APP_ID,
    s3,
    apiGateway,
    cognito
};
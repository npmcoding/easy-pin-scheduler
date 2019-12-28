export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
        REGION: "us-east-2",
        BUCKET: "easy-pin-scheduler"
    },
    apiGateway: {
        REGION: "us-east-2",
        URL: "https://1w1s2iy56d.execute-api.us-east-2.amazonaws.com/dev"
    },
    cognito: {
        REGION: "us-east-2",
        USER_POOL_ID: "us-east-2_MngmmIPv7",
        APP_CLIENT_ID: "792hha7d95psgng6l5v7vqm2kt",
        IDENTITY_POOL_ID: "us-east-2:79595818-51ea-41b6-8002-f5a694266fee"
    }
};
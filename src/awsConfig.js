import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const cognito = new AWS.CognitoIdentityServiceProvider();
export const dynamoDb = new AWS.DynamoDB();
export const s3 = new AWS.S3();

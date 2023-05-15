import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const CognitoIdentityServiceProvider =
  AWS.CognitoIdentityServiceProvider;
export const DynamoDB = AWS.DynamoDB;
// export default AWS;

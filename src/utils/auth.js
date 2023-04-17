import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_1mfui3DzD",
  ClientId: "1v3tjg243iitu1oig6nv0v4ikk",
};

const userPool = new CognitoUserPool(poolData);

export function isAuthenticated() {
  return getCurrentUser() !== null;
}

export function signUp(email, password) {
  return new Promise((resolve, reject) => {
    const attributeList = [
      {
        Name: "email",
        Value: email,
      },
    ];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result.user);
    });
  });
}

export function confirmSignUp(email, code) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export function signIn(email, password) {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve({ name: "User", email: email });
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

export function signOut() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    currentUser.signOut();
  }
}

export function getCurrentUser() {
  return userPool.getCurrentUser();
}

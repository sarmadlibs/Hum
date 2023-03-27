const auth = {
  isAuthenticated: false,
  currentUser: null,

  signIn(email, password) {
    return new Promise((resolve) => {
      this.isAuthenticated = true;
      this.currentUser = { name: "User", email: email };
      setTimeout(() => resolve(), 100);
    });
  },

  signOut() {
    return new Promise((resolve) => {
      this.isAuthenticated = false;
      this.currentUser = null;
      setTimeout(() => resolve(), 100);
    });
  },
};

export function isAuthenticated() {
  return auth.isAuthenticated;
}

export function signIn(email, password, cb) {
  return auth.signIn(email, password, cb);
}

export function signOut(cb) {
  return auth.signOut(cb);
}

export function getCurrentUser() {
  return auth.currentUser;
}

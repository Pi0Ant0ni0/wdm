export const basePath ="http://localhost:8080/wdm";

export const environment = {
  authentication: {
    issuer: `${basePath}/auth/realms/kiranet`,
    silentRefreshRedirectUri: "/assets/authentication/silent-refresh.html",
    clientId: "frontend",
    responseType: "code",
    scope: "openid profile roles phone address",
    redirectUri: null,
    postLogoutRedirectUri: null,

  },
  production: false,
  //TODO modifica il path
  gateway: "http://127.0.0.1:8080/wm"
};

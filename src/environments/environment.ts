export const basePath ="http://localhost:8080/wdm";

export const environment = {
  keycloak: {
    // Url of the Identity Provider
    issuer: 'http://localhost:8080/realms/DWMonitor',

    // URL of the SPA to redirect the user to after login
    redirectUri: "http://localhost:4200",

    // The SPA's id.
    // The SPA is registerd with this id at the auth-serverß
    clientId: 'dwmonitor-client',

    responseType: 'code',
    // set the scope for the permissions the client should request
    // The first three are defined by OIDC.
    scope: 'openid profile email',
    // Remove the requirement of using Https to simplify the demo
    requireHttps: false,
    // at_hash is not present in JWT token
    showDebugInformation: true,
    disableAtHashCheck: true,
    post_logout_redirect_uri:"http://localhost:4200"
  },
  production: false,
  //TODO modifica il path
  gateway: "http://localhost:8081/unisannio/DWM/api",
  mqttHostName: "test.mosquitto.org",
  port: 8081,
  clean: true, // Retain session
  connectTimeout: 4000, // Timeout period
  reconnectPeriod: 4000, // Reconnect period
  clientId: 'mqttx_597046f4',
  path: ""
};

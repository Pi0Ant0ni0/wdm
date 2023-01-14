

export const environment = {
  keycloak: {
    // Url of the Identity Provider
    issuer: 'http://localhost:8080/realms/DWMonitor',

    // URL of the SPA to redirect the user to after login
    redirectUri: "https://localhost:4200",

    // The SPA's id.
    // The SPA is registerd with this id at the auth-serverß
    clientId: 'dwmonitor-client',

    responseType: 'code',
    // set the scope for the permissions the client should request
    // The first three are defined by OIDC.
    scope: 'openid profile email',
    requireHttps: false,
    // at_hash is not present in JWT token
    showDebugInformation: false,
    disableAtHashCheck: true,
    post_logout_redirect_uri:"https://localhost:4200",

  },
  production: false,
  gateway: "http://localhost:8081/unisannio/DWM/api",
  mqttHostName: "1b844a5adb904c9bbbb5728ffa398e9e.s2.eu.hivemq.cloud",
  port: 8884,
  clean: true, // Retain session
  connectTimeout: 4000, // Timeout period
  reconnectPeriod: 4000, // Reconnect period
  clientId: "MQTT_GUI",
  path: "mqtt",
  username: "username",
  password: "password"
};

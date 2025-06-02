// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  hostUrl: 'http://localhost:8080',

  get baseUrl() {
    return `${this.hostUrl}/api/soundArchive`;
  },

  get userBaseUrl() {
    return `${this.baseUrl}/user`;
  },

  get authBaseUrl() {
    return `${this.baseUrl}/auth`;
  },

  get trackBaseUrl() {
    return `${this.baseUrl}/track`;
  },

  get recordBaseUrl() {
    return `${this.baseUrl}/record`;
  },

  get artistBaseUrl() {
    return `${this.baseUrl}/artist`;
  },

  get genreBaseUrl() {
    return `${this.baseUrl}/genre`;
  },

  get mediumBaseUrl() {
    return `${this.baseUrl}/medium`;
  },

  get wishlistBaseUrl() {
    return `${this.baseUrl}/wishlist`;
  },

  get cartBaseUrl() {
    return `${this.baseUrl}/cart`;
  },

  get uploadBaseUrl() {
    return `${this.baseUrl}/upload`;
  },

  get imageBaseUrl() {
    return `${this.hostUrl}/uploads`;
  },

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

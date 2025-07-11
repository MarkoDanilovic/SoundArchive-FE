export const environment = {
  production: true,

  //hostUrl: 'http://api-gateway:8080',
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

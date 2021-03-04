export default {
  PORT: process.env.PORT || 13550,
  JWT: {
    ACCESS: process.env.ACCESSS || "aku_access",
    REFRESH: process.env.REFRESH || "aku_refresh",
  },
  DB: {
    URI: process.env.MONGODB_URI || "mongodb://localhost/gps",
  },
  CORS: {
    ORIGIN: "*",
  },
};

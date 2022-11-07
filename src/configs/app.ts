export default () => ({
  mongoUrl: process.env.MONGO_URL,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    accessTokenExpiryTime: process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME,
    refreshTokenExpiryTime: process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME
  }
});

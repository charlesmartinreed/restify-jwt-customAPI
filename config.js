// holds our environment variables

module.exports = {
  ENV: process.env.NODE_ENV | "development",
  PORT: process.env.PORT || 3000,
  URL: process.env.BASE_URL || "http://localhost:3000",
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb://charlie:abc123@ds229771.mlab.com:29771/customer_api",
  JWT_SECRET: process.env.JWT_SECRET || "pineapples"
};

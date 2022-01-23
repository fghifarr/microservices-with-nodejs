const USER_SERVICE_URL = process.env.USER_SERVICE_URL || `http://127.0.0.1:1998`;

const routes = [
  {
    url: "/users",
    auth: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 200,
    },
    proxy: {
      target: USER_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: {
        [`^/users`]: "",
      },
    },
  },
];

module.exports = routes;

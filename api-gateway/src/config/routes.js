const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT || 1998;
const USER_SERVICE_URL = `http://127.0.0.1:${USER_SERVICE_PORT}`;

const routes = [
  {
    url: "/users",
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

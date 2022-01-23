const redis = require("redis");

const redisManager = {
  middleware: async (req, res, next) => {
    let key = '/users' + (req.originalUrl || req.url);
    const redisClient = redis.createClient();
    redisClient.connect();
    const data = await redisClient.get(key);
    if (data) {
      const jsonData = await JSON.parse(data);
      res.setHeader("Content-Type", "application/json");
      res.send(jsonData);
      return;
    } else {
      res.sendFn = res.send;
      res.send = (body) => {
        if (res.statusCode == 200) redisClient.setEx(key, 300, JSON.stringify(body));
        res.sendFn(body);
      };
      next();
    }
  },
  userSync: async (user) => {
    let key = `/users/${user._id}`;
    const redisClient = redis.createClient();
    await redisClient.connect();
    await redisClient.setEx(key, 300, JSON.stringify(user));
  },
  removeUser: async (userId) => {
    const redisClient = redis.createClient();
    await redisClient.connect();
    redisClient.del(`/users/${userId}`);
  },
};

module.exports = redisManager;

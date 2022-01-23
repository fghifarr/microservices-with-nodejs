const redis = require("redis");
const REDIS_URL = process.env.REDIS_URL || 'http://127.0.0.1:6379';

//ToDo: Implement asynchronous indexing
const redisManager = {
  middleware: async (req, res, next) => {
    let key = '/users' + (req.originalUrl || req.url);
    const redisClient = redis.createClient({ url: process.env.REDIS_URL });
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
    const redisClient = redis.createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();
    await redisClient.setEx(key, 300, JSON.stringify(user));
  },
  removeUser: async (userId) => {
    const redisClient = redis.createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();
    await redisClient.del(`/users/${userId}`);
    await redisClient.del(`/users/`);
  },
};

module.exports = redisManager;

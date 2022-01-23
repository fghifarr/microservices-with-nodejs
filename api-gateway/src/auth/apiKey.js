const { apiKey } = require('../config/auth');
const router = require('express').Router();

router.use(async (req, res, next) => {
  if (apiKey !== req.headers.key) {
    res.status(401).send('Unauthorized!');
    return;
  }
  next();
});

module.exports = router;

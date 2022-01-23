const router = require('express').Router();

router.get('/', async (req, res) => {
  res.send('Welcome to the API Gateway!');
});

module.exports = router;

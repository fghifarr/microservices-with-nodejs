const router = require("express").Router();

router.get("/", async (req, res) => {
  res.send("Welcome to the User Service!");
});

module.exports = router;

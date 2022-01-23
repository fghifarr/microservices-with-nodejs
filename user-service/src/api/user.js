const router = require("express").Router(),
  User = require("../models/User"),
  mongoose = require("mongoose"),
  redisManager = require('../cache/redis-manager');

// Router-level middleware
/**
 * Populates user object from the given id.
 */
router.param("id", async (req, res, next, userId) => {
  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      res.sendStatus(404);
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
});

// Route handlers
/**
 * Lists the users
 */
router.get("/", redisManager.middleware, async (req, res, next) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

/**
 * Gets a user by id
 */
router.get("/:id", redisManager.middleware, async (req, res) => {
  res.json(req.user);
});

/**
 * Creates a user
 */
router.post("/", async (req, res, next) => {
  try {
    //check if username exist
    const total = await User.countDocuments({ username: req.body.username });
    if (total > 0) {
      res.status(400).send("Username already exists");
    }

    const userObj = {
      username: req.body.username,
      accountNumber: req.body.accountNumber,
      emailAddress: req.body.emailAddress,
      identityNumber: req.body.identityNumber,
    };
    const newUser = await new User(userObj).save();
    await redisManager.userSync(newUser);

    res.json(newUser);
  } catch (err) {
    next(err);
  }
});

/**
 * Updates a user
 */
router.put("/:id", async (req, res, next) => {
  try {
    const userObj = {
      username: req.body.username,
      accountNumber: req.body.accountNumber,
      emailAddress: req.body.emailAddress,
      identityNumber: req.body.identityNumber,
    };
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      userObj
    ).exec();
    await redisManager.userSync(updatedUser);

    res.json(userObj);
  } catch (err) {
    next(err);
  }
});

/**
 * Deletes a user
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id).exec();
    await redisManager.removeUser(req.user._id);

    res.status(200).send("Success!");
  } catch (err) {
    next(err);
  }
});

module.exports = router;

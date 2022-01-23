const ReqUser = require("../requests/ReqUser");

const router = require("express").Router(),
  User = require("../models/User"),
  mongoose = require("mongoose"),
  redisManager = require('../cache/redis-manager');

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

//ToDo: create its service to handle business logic
/**
 * Gets a user by id
 */
router.get("/:id", redisManager.middleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * Gets a user by account number
 */
router.get(
    "/acc-number/:accNumber",
    redisManager.middleware,
    async (req, res, next) => {
  try {
    const user = await User.findOne({ accountNumber: req.params.accNumber }).exec();
    if (!user) {
      res.sendStatus(404);
      return;
    }
    
    res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * Gets a user by identity number
 */
router.get(
    "/id-number/:idNumber", 
    redisManager.middleware, 
    async (req, res, next) => {
  try {
    const user = await User.findOne({ identityNumber: req.params.idNumber }).exec();
    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * Creates a user
 */
router.post("/", async (req, res, next) => {
  try {
    const reqUser = new ReqUser(req.body);
    reqUser.validate();

    //check on unique fields
    const totalUsername = await User.countDocuments({
      username: reqUser.username,
    });
    if (totalUsername > 0) {
      res.status(400).send("Username already exists");
    }
    const totalAccNo = await User.countDocuments({
      accountNumber: reqUser.accountNumber,
    });
    if (totalAccNo > 0) {
      res.status(400).send("Account number already exists");
    }
    const totalIdNo = await User.countDocuments({
      identityNumber: reqUser.identityNumber,
    });
    if (totalIdNo > 0) {
      res.status(400).send("Identity number already exists");
    }

    const userObj = {
      username: reqUser.username,
      accountNumber: reqUser.accountNumber,
      emailAddress: reqUser.emailAddress,
      identityNumber: reqUser.identityNumber,
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
    const reqUser = new ReqUser(req.body);
    reqUser.validate();

    const user = await User.findById(req.params.id).exec();
    if (!user) {
      res.sendStatus(404);
      return;
    }

    const userObj = {
      username: reqUser.username,
      accountNumber: reqUser.accountNumber,
      emailAddress: reqUser.emailAddress,
      identityNumber: reqUser.identityNumber,
    };
    const updatedUser = await User.findByIdAndUpdate(user._id, userObj).exec();
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
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      res.sendStatus(404);
      return;
    }

    await User.findByIdAndDelete(user._id).exec();
    await redisManager.removeUser(user._id);

    res.status(200).send("Success!");
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const mongoose = require('mongoose');

const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 16,
    unique: true,
  },
  accountNumber: {
    type: String,
    minLength: 5,
    maxLength: 7,
  },
  emailAddress: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is not valid!",
    ],
  },
  identityNumber: {
    type: String,
    minLength: 5,
    maxLength: 7,
  },
});

module.exports = mongoose.model('User', schema);

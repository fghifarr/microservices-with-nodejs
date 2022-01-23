const Joi = require("joi");

class ReqUser {
  constructor(request) {
    this.username = request.username;
    this.accountNumber = request.accountNumber;
    this.emailAddress = request.emailAddress;
    this.identityNumber = request.identityNumber;
  }

  validate() {
    const schema = Joi.object({
      username: Joi.string().required().min(3).max(16),
      accountNumber: Joi.string().required().min(5).max(7),
      emailAddress: Joi.string().required(),
      identityNumber: Joi.string().required().min(5).max(7),
    });

    const { error } = schema.validate(this);
    if (error instanceof Joi.ValidationError) {
      throw error;
    }

    return true;
  }
}

module.exports = ReqUser;

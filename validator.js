const joi = require("joi");

const validator = (schema) => (payload) => schema.validate(payload, {abortEarly: false});
const loginschema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  exports.validatelogin = validator(loginschema);
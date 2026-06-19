const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),

  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .required(),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .required(),

  password: Joi.string().required(),
});

const signupValidation = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      responseCode: "400",
      responseMessage: error.details[0].message,
    });
  }

  next();
};

const loginValidation = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      responseCode: "400",
      responseMessage: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  signupValidation,
  loginValidation,
};

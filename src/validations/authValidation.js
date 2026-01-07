import Joi from 'joi';

const passwordSchema = Joi.string().min(8).required();

export const registerUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: passwordSchema,
  }),
};

export const loginUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: passwordSchema,
  }),
};

export const requestResetEmailSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const resetPasswordSchema = {
  body: Joi.object({
    token: Joi.string().required(),
    password: passwordSchema,
  }),
};

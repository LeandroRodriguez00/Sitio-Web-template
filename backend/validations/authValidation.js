import Joi from 'joi';

export const registerValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'El nombre es obligatorio'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'El email es obligatorio',
    'string.email': 'El email debe ser válido'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'La contraseña es obligatoria',
    'string.min': 'La contraseña debe tener al menos 6 caracteres'
  })
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'El email es obligatorio',
    'string.email': 'El email debe ser válido'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'La contraseña es obligatoria'
  })
});

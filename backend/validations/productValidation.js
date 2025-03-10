import Joi from 'joi';

export const productValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'El nombre del producto es obligatorio'
  }),
  description: Joi.string().required().messages({
    'string.empty': 'La descripción es obligatoria'
  }),
  images: Joi.alternatives().try(
    // Caso 1: Un array de URLs válidas
    Joi.array().items(
      Joi.string().uri().messages({
        'string.uri': 'Cada imagen debe ser una URL válida'
      })
    ),
    // Caso 2: Un array de strings (nombres de archivos)
    Joi.array().items(Joi.string()),
    // Caso 3: Un solo string (por ejemplo, si se envía solo un nombre de archivo o una URL)
    Joi.string().allow('')
  )
    .optional()
    .messages({
      'array.base': 'Las imágenes deben estar en un arreglo o ser una cadena de texto'
    }),
  price: Joi.number().required().messages({
    'number.base': 'El precio debe ser un número',
    'any.required': 'El precio es obligatorio'
  }),
  category: Joi.string().required().messages({
    'string.empty': 'La categoría es obligatoria'
  }),
  available: Joi.boolean().optional()
});

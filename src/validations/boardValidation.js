import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(100).trim().strict().messages({
      'any.required': 'Title is required',
      'string.base': 'Title must be a string',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 100 characters'
    }),
    description: Joi.string().required().min(3).max(500).trim().strict()
  })

  try {
    // console.log('Validating request body:', req.body)
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    // console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error_message: new Error(error).message
    })
  }

}

export const boardValidation = {
  createNew
}

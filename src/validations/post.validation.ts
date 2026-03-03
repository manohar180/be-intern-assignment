import Joi from 'joi';

export const createPostSchema = Joi.object({
    content: Joi.string().required().min(1).max(5000).messages({
        'string.empty': 'Content cannot be empty',
        'string.min': 'Content must be at least 1 character long',
        'string.max': 'Content cannot exceed 5000 characters',
    }),
    userId: Joi.number().integer().positive().required().messages({
        'number.base': 'User ID must be a number',
        'number.integer': 'User ID must be an integer',
        'number.positive': 'User ID must be a positive number',
        'any.required': 'User ID is required',
    }),
});

export const updatePostSchema = Joi.object({
    content: Joi.string().min(1).max(5000).messages({
        'string.min': 'Content must be at least 1 character long',
        'string.max': 'Content cannot exceed 5000 characters',
    }),
})
.min(1)
.messages({
    'object.min': 'At least one field (content) must be provided for update',
})
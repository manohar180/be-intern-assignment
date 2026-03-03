import Joi from 'joi';

export const createLikeSchema = Joi.object({
    userId: Joi.number().integer().positive().required().messages({
        'number.base': 'User ID must be a number',
        'number.integer': 'User ID must be an integer',
        'number.positive': 'User ID must be a positive number',
        'any.required': 'User ID is required',
    }),
    postId: Joi.number().integer().positive().required().messages({
        'number.base': 'Post ID must be a number',
        'number.integer': 'Post ID must be an integer',
        'number.positive': 'Post ID must be a positive number',
        'any.required': 'Post ID is required',
    }),
});

export const updateLikeSchema = Joi.object({
    userId: Joi.number().integer().positive().messages({
        'number.base': 'User ID must be a number',
        'number.integer': 'User ID must be an integer',
        'number.positive': 'User ID must be a positive number',
    }),
    postId: Joi.number().integer().positive().messages({
        'number.base': 'Post ID must be a number',
        'number.integer': 'Post ID must be an integer',
        'number.positive': 'Post ID must be a positive number',
    }),
})
.min(1)
.messages({
    'object.min': 'At least one field (userId or postId) must be provided for update',
});
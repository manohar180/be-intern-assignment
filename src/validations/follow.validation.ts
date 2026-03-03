import Joi from 'joi';

export const createFollowSchema = Joi.object({
    followerId: Joi.number().integer().positive().required().messages({
        'number.base': 'Follower ID must be a number',
        'number.integer': 'Follower ID must be an integer',
        'number.positive': 'Follower ID must be a positive number',
        'any.required': 'Follower ID is required',
    }),
    followingId: Joi.number().integer().positive().required().messages({
        'number.base': 'Following ID must be a number',
        'number.integer': 'Following ID must be an integer',
        'number.positive': 'Following ID must be a positive number',
        'any.required': 'Following ID is required',
    }),
});

export const updateFollowSchema = Joi.object({
    followerId: Joi.number().integer().positive().messages({
        'number.base': 'Follower ID must be a number',
        'number.integer': 'Follower ID must be an integer',
        'number.positive': 'Follower ID must be a positive number',
    }),
    followingId: Joi.number().integer().positive().messages({
        'number.base': 'Following ID must be a number',
        'number.integer': 'Following ID must be an integer',
        'number.positive': 'Following ID must be a positive number',
    }),
})
.min(1)
.messages({
    'object.min': 'At least one field (followerId or followingId) must be provided for update',
});
import Joi from 'joi';

export const createHashtagSchema = Joi.object({
    name: Joi.string().required().min(1).max(255).pattern(/^[a-zA-Z0-9_]+$/).messages({
        'string.empty': 'Hashtag name cannot be empty',
        'string.min': 'Hashtag name must be at least 1 character long',
        'string.max': 'Hashtag name cannot exceed 255 characters',
        'string.pattern.base': 'Hashtag name can only contain letters, numbers, and underscores',
    }),
});

export const updateHashtagSchema = Joi.object({
    name: Joi.string().min(1).max(255).pattern(/^[a-zA-Z0-9_]+$/).messages({
        'string.min': 'Hashtag name must be at least 1 character long',
        'string.max': 'Hashtag name cannot exceed 255 characters',
        'string.pattern.base': 'Hashtag name can only contain letters, numbers, and underscores',
    }),
})
.min(1)
.messages({
    'object.min': 'At least one field (name) must be provided for update',
})
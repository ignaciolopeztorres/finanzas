/**
 * helpers for Express.js routes and error handling
 * File: utils/helpers/main.helpers.js
 */

const pick = (obj = {}, keys = []) =>
    keys.reduce((acc, k) => {
        if (obj && Object.prototype.hasOwnProperty.call(obj, k)) acc[k] = obj[k];
        return acc;
    }, {});

/**
 * Wrap async route handlers to forward errors to Express error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Standard JSON responder
 * options: { status=200, message='', data=null, meta=null }
 */
const sendResponse = (res, { status = 200, message = '', data = null, meta = null } = {}) => {
    const ok = status < 400;
    const payload = { status: ok ? 'success' : 'error', message };
    if (data !== null) payload.data = data;
    if (meta !== null) payload.meta = meta;
    return res.status(status).json(payload);
};

/**
 * Simple pagination parser from req.query
 */
const parsePagination = (req, { defaultPage = 1, defaultLimit = 25, maxLimit = 100 } = {}) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || defaultPage);
    let limit = Math.max(1, parseInt(req.query.limit, 10) || defaultLimit);
    limit = Math.min(limit, maxLimit);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

/**
 * Middleware to validate req.body against a Joi-like schema.
 * Accepts any schema object that exposes .validate(value, options) => { error, value }.
 * Example: validateBody(Joi.object({ name: Joi.string().required() }))
 */
const validateBody = (schema) => (req, res, next) => {
    if (!schema || typeof schema.validate !== 'function') return next();
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        const details = error.details ? error.details.map((d) => ({ path: d.path, message: d.message })) : [{ message: error.message }];
        const err = new Error('Validation error');
        err.status = 400;
        err.details = details;
        return next(err);
    }
    req.body = value;
    return next();
};

/**
 * 404 handler for unknown routes
 */
const notFoundHandler = (req, res) => {
    return sendResponse(res, { status: 404, message: 'Not Found' });
};

/**
 * Express error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    const message = err.message || (status === 500 ? 'Internal Server Error' : 'Error');
    const payload = {
        status: 'error',
        message,
    };
    if (err.details) payload.details = err.details;
    if (process.env.NODE_ENV !== 'production') {
        payload.stack = err.stack;
    }
    return res.status(status).json(payload);
};

module.exports = {
    asyncHandler,
    sendResponse,
    validateBody,
    parsePagination,
    pick,
    notFoundHandler,
    errorHandler,
};
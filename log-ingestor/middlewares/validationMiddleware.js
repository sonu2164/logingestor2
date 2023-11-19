// validationMiddleware.js
const { body } = require('express-validator');

const logValidationRules = () => {
    return [
        body('level').notEmpty(),
        body('message').notEmpty(),
        body('resourceId').notEmpty(),
        body('timestamp').isISO8601().toDate(),
        body('traceId').notEmpty(),
        body('spanId').notEmpty(),
        body('commit').notEmpty(),
        body('metadata.parentResourceId').notEmpty(),
    ];
};

module.exports = {
    logValidationRules,
};

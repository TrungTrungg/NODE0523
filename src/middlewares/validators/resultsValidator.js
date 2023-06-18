const { validationResult } = require('express-validator');

const resultsValidator = (req) => {
    let messages = [];
    if (!validationResult(req).isEmpty()) {
        const { errors } = validationResult(req);
        messages = errors;
    }
    return messages;
};

module.exports = {
    resultsValidator,
};

const Joi = require('joi');
const DeliveryStatuses = require('../configs/deliveryStatuses');

module.exports = Joi.object({
    status: Joi.string()
        .required().valid(...DeliveryStatuses.statuses)
});

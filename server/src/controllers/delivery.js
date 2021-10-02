const Db = require('../db');
const DeliveryStatuses = require('../configs/deliveryStatuses');

/**
 * Get delivery data by id
 * @public
 *
 * @param {string} id
 *
 * @returns {Promise}
 */
async function getOhmById(id) {
    return Db.getOhmById(id);
}

/**
 * Update delivery status by id
 * @public
 *
 * @param {object} delivery
 * @param {string} status
 *
 * @returns {Promise}
 */
async function updateOhmStatusById(delivery, status) {
    const data = {
        status,
        isUpdated: true
    }

    if (!_isAvailableStatusTransition(delivery.status, status)) {
        data.isUpdated = false;
        return data;
    }

    await Db.updateOhmStatusById(delivery.id, status);

    return data;
}

/**
 * Check if logic can set new status for delivery
 * @private
 *
 * @param {string} currentStatus
 * @param {string} newStatus
 *
 * @returns {Boolean}
 */
function _isAvailableStatusTransition(currentStatus, newStatus) {
    if (!currentStatus || !newStatus || !DeliveryStatuses.statusesTransitionFlow[currentStatus]) {
        return false;
    }
    return DeliveryStatuses.statusesTransitionFlow[currentStatus].includes(newStatus);
}

module.exports = { getOhmById, updateOhmStatusById }

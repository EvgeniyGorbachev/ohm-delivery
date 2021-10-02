const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');
const config = require('../db.config.json');

// configure database
const db = (async () => {
    const _db = await low(adapter);
    await _db.defaults(config).write();
    return _db;
})()

/**
 * Get delivery data by id
 * @public
 *
 * @param {string} id
 *
 * @returns {Promise}
 */
async function getOhmById(id) {
    const _db = await db;
    const ohm = _db.get('ohms')
        .find({ id })
        .value();

    return ohm;
}

/**
 * Update delivery status by id
 * @public
 *
 * @param {string} id
 * @param {string} status
 *
 * @returns {Promise}
 */
async function updateOhmStatusById(id, status) {
    const _db = await db;
    const ohm = _db.get('ohms')
        .find({ id })
        .assign({ status })
        .value();

    return ohm;
}

/**
 * Add new log
 * @public
 *
 * @param {string} type
 * @param {object} data
 *
 * @returns {Promise}
 */
async function addLog(type, data) {
    const _db = await db;
    return _db.get('logs')
        .push({ type, data, date: new Date() })
        .write();
}

/**
 * Get all logs
 * @public
 *
 * @returns {Promise}
 */
async function getLogs() {
    // TODO add filters by date, type, pagination etc.
    const _db = await db;
    return _db.get('logs');
}

module.exports = { getOhmById, updateOhmStatusById, addLog, getLogs }
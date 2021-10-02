module.exports = {
    statuses: ["CREATED", "PREPARING", "READY", "IN_DELIVERY", "DELIVERED", "REFUSED"],
    statusesTransitionFlow: {
        CREATED: ["PREPARING"],
        PREPARING: ["READY"],
        READY: ["IN_DELIVERY"],
        IN_DELIVERY: ["DELIVERED", "REFUSED"],
        IN_DELIVERY: ["DELIVERED", "REFUSED"],
    }
};
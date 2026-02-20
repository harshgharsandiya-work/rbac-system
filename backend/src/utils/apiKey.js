const crypto = require("crypto");

const API_KEY_PREFIX = "iam_";

function generateApiKey() {
    const random = crypto.randomBytes(32).toString("hex");
    return API_KEY_PREFIX + random;
}

function hashApiKey(key) {
    return crypto.createHash("sha256").update(key).digest("hex");
}

module.exports = {
    generateApiKey,
    hashApiKey,
};

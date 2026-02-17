const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const TOKEN_EXPIRY_MINUTES = 10;
const SALT_ROUNDS = 10;

function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

//create verification token
async function createVerificationToken(userId, type) {
    const rawToken = generateOTP();
    const tokenHash = await bcrypt.hash(rawToken, SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    await prisma.$transaction(async (tx) => {
        // delete existing tokens of same type
        await tx.verificationToken.deleteMany({
            where: {
                userId,
                type,
            },
        });

        await tx.verificationToken.create({
            data: {
                userId,
                type,
                tokenHash,
                expiresAt,
            },
        });
    });

    return rawToken;
}

//verify token
async function verifyToken(userId, type, inputToken) {
    const token = await prisma.verificationToken.findFirst({
        where: {
            userId,
            type,
        },
    });

    if (!token) throw new Error("Token not found");

    if (token.expiresAt < new Date()) {
        throw new Error("Token expired");
    }

    const isValid = await bcrypt.compare(inputToken, token.tokenHash);

    if (!isValid) throw new Error("Invalid token");

    //clear token
    await prisma.verificationToken.deleteMany({
        where: { userId, type },
    });

    return true;
}

module.exports = {
    createVerificationToken,
    verifyToken,
};

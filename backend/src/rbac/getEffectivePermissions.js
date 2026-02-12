const prisma = require("../config/prisma");

/**
 * Get effective roles + permissions for user in an org
 */
const getEffectivePermissions = async (userId, organisationId) => {
    const memberShips = await prisma.memberShip.findMany({
        where: {
            userId,
            organisationId,
        },
        include: {
            role: {
                include: {
                    rolePermissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            },
        },
    });

    if (!memberShips.length) {
        return {
            roles: [],
            permissions: [],
        };
    }

    const roles = memberShips.map((m) => m.role.name);

    // Multiple Role may has same set of permission
    // So use Set to avoid duplication of permission
    const permissionsSet = new Set();

    memberShips.forEach((membership) => {
        membership.role.rolePermissions.forEach((rp) => {
            permissionsSet.add(rp.permission.key);
        });
    });

    return {
        roles,
        permissions: Array.from(permissionsSet),
    };
};

module.exports = { getEffectivePermissions };

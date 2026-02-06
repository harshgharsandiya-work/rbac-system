const prisma = require("../config/prisma");

/**
 * LOGIC
 * Check if user has specific permission in an organisation
 *
 * "Can this user, in this organization, perform this action?"
 *
 * Data Flow:
 * User
 *  → Membership (userId + organisationId)
 *     → Role
 *        → RolePermission
 *            -> Permission.key
 */

/**
 * PARAMETERS
 * @param {string} userId - The ID of the user
 * @param {string} organisationId -  The ID of the organization
 * @param {string} permissionKey - The permission to check (e.g., 'project:create')
 * @returns {Promise<boolean>} - Returns true if the user has the permission, else false
 */

async function canAccess(userId, organisationId, permissionKey) {
    //Find user in organisation including roles + associated permissions
    const membership = await prisma.memberShip.findFirst({
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

    if (!membership) {
        return false;
    }

    return membership.role.rolePermissions.some(
        (rp) => rp.permission.key === permissionKey,
    );
}

module.exports = { canAccess };

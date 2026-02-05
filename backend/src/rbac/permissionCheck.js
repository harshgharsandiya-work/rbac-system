const prisma = require("../config/prisma");

async function hasPermission(userId, permissionKey) {
    // get role of user
    const roles = await prisma.userRole.findMany({
        where: { userId },
        select: { roleId: true },
    });

    if (roles.length === 0) return false;

    const roleIds = roles.map((r) => r.roleId);

    // check if any role has permission
    const permission = await prisma.rolePermission.findFirst({
        where: {
            roleId: {
                in: roleIds,
            },
            permission: {
                key: permissionKey,
            },
        },
        include: { permission: true },
    });

    return Boolean(permission);
}

module.exports = { hasPermission };

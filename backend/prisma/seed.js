const prisma = require("../src/config/prisma");

async function main() {
    const permissions = [
        "user:create",
        "user:read",
        "user:update",
        "user:delete",
    ];

    const permissionRecords = {};
    for (const key of permissions) {
        const permission = await prisma.permission.upsert({
            where: { key },
            update: {},
            create: { key },
        });

        permissionRecords[key] = permission;
    }

    const adminRole = await prisma.role.upsert({
        where: { name: "ADMIN" },
        update: {},
        create: { name: "ADMIN" },
    });

    const userRole = await prisma.role.upsert({
        where: { name: "USER" },
        update: {},
        create: { name: "USER" },
    });

    // ADMIN -> ALL PERMISSION
    for (const permission of Object.values(permissionRecords)) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: permission.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: permission.id,
            },
        });
    }

    // USER -> READ ONLY
    await prisma.rolePermission.upsert({
        where: {
            roleId_permissionId: {
                roleId: userRole.id,
                permissionId: permissionRecords["user:read"].id,
            },
        },
        update: {},
        create: {
            roleId: userRole.id,
            permissionId: permissionRecords["user:read"].id,
        },
    });

    // TEST USER
    const testUser = await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {},
        create: {
            email: "user@example.com",
            password: "user@123", // hashed pass
        },
    });

    // ASSIIGN USER ROLE
    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: testUser.id,
                roleId: userRole.id,
            },
        },
        update: {},
        create: {
            userId: testUser.id,
            roleId: userRole.id,
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

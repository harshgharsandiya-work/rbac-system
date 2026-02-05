const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");

const orgId = "f89da722-1b24-47d8-8c62-a971a50a01b4";

async function main() {
    //organisation
    const org = await prisma.organisation.upsert({
        where: {
            id: orgId,
        },
        update: {},
        create: {
            id: orgId,
            name: "Acme Inc",
        },
    });

    //user
    const hashedAdminPassword = await bcrypt.hash("admin@123", 10);
    const hashedUserPassword = await bcrypt.hash("user@123", 10);

    const adminUser = await prisma.user.upsert({
        where: {
            email: "admin@acme.com",
        },
        update: {},
        create: {
            email: "admin@acme.com",
            password: hashedAdminPassword,
        },
    });

    const normalUser = await prisma.user.upsert({
        where: {
            email: "user@acme.com",
        },
        update: {},
        create: {
            email: "user@acme.com",
            password: hashedUserPassword,
        },
    });

    //roles
    const adminRole = await prisma.role.upsert({
        where: {
            name_organisationId: {
                name: "ADMIN",
                organisationId: org.id,
            },
        },

        update: {},
        create: {
            name: "ADMIN",
            organisationId: org.id,
        },
    });

    const memberRole = await prisma.role.upsert({
        where: {
            name_organisationId: {
                name: "MEMBER",
                organisationId: org.id,
            },
        },
        update: {},
        create: {
            name: "MEMBER",
            organisationId: org.id,
        },
    });

    //permission
    const permissionsData = [
        { key: "user:create", organisationId: org.id },
        { key: "user:read", organisationId: org.id },
        { key: "project:create", organisationId: org.id },
        { key: "project:read", organisationId: org.id },
    ];

    const permissionRecords = {};

    for (const permission of permissionsData) {
        const record = await prisma.permission.upsert({
            where: {
                key_organisationId: {
                    key: permission.key,
                    organisationId: permission.organisationId,
                },
            },
            update: {},
            create: {
                key: permission.key,
                organisationId: permission.organisationId,
            },
        });

        permissionRecords[permission.key] = record;
    }

    const allPermissions = Object.values(permissionRecords);

    // role-permission
    //admin
    await Promise.all(
        allPermissions.map((permission) =>
            prisma.rolePermission.upsert({
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
            }),
        ),
    );

    //member
    const readPermissions = allPermissions.filter((p) =>
        p.key.endsWith(":read"),
    );

    await Promise.all(
        readPermissions.map((permission) =>
            prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: memberRole.id,
                        permissionId: permission.id,
                    },
                },
                update: {},
                create: {
                    roleId: memberRole.id,
                    permissionId: permission.id,
                },
            }),
        ),
    );

    // membership
    //admin
    await prisma.memberShip.upsert({
        where: {
            userId_organisationId_roleId: {
                userId: adminUser.id,
                organisationId: org.id,
                roleId: adminRole.id,
            },
        },
        update: {},
        create: {
            userId: adminUser.id,
            organisationId: org.id,
            roleId: adminRole.id,
        },
    });

    //member
    await prisma.memberShip.upsert({
        where: {
            userId_organisationId_roleId: {
                userId: normalUser.id,
                organisationId: org.id,
                roleId: memberRole.id,
            },
        },
        update: {},
        create: {
            userId: normalUser.id,
            organisationId: org.id,
            roleId: memberRole.id,
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

const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");
const { hashPassword } = require("../src/auth/password");

async function main() {
    // Sample organizations
    const organisationsData = [
        { id: "f89da722-1b24-47d8-8c62-a971a50a01b4", name: "Acme Inc" },
        { id: "a12b3456-7c89-4d01-2345-6789abcdef01", name: "Beta Corp" },
    ];

    const organisations = [];
    for (const orgData of organisationsData) {
        const org = await prisma.organisation.upsert({
            where: { id: orgData.id },
            update: {},
            create: {
                id: orgData.id,
                name: orgData.name,
            },
        });
        organisations.push(org);
    }

    // Sample users
    const usersData = [
        { email: "admin@acme.com", password: "admin@123" },
        { email: "user@acme.com", password: "user@123" },
        { email: "admin@beta.com", password: "admin@123" },
        { email: "user@beta.com", password: "user@123" },
    ];

    const users = [];
    for (const userData of usersData) {
        const hashedPassword = await hashPassword(userData.password);
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                email: userData.email,
                password: hashedPassword,
            },
        });
        users.push(user);
    }

    // Sample roles per org
    const rolesData = [
        { name: "ADMIN" },
        { name: "MEMBER" },
        { name: "GUEST" },
    ];

    const orgRolesMap = {};

    for (const org of organisations) {
        orgRolesMap[org.id] = {};
        for (const roleData of rolesData) {
            const role = await prisma.role.upsert({
                where: {
                    name_organisationId: {
                        name: roleData.name,
                        organisationId: org.id,
                    },
                },
                update: {},
                create: {
                    name: roleData.name,
                    organisationId: org.id,
                },
            });
            orgRolesMap[org.id][roleData.name] = role;
        }
    }

    // Sample permissions
    const permissionsData = [
        "user:create",
        "user:read",
        "project:create",
        "project:read",
        "project:update",
    ];

    const orgPermissionsMap = {};

    for (const org of organisations) {
        orgPermissionsMap[org.id] = {};
        for (const key of permissionsData) {
            const permission = await prisma.permission.upsert({
                where: {
                    key_organisationId: {
                        key,
                        organisationId: org.id,
                    },
                },
                update: {},
                create: {
                    key,
                    organisationId: org.id,
                },
            });
            orgPermissionsMap[org.id][key] = permission;
        }
    }

    // Assign permissions to roles
    for (const org of organisations) {
        const allPermissions = Object.values(orgPermissionsMap[org.id]);

        // ADMIN gets all permissions
        await Promise.all(
            allPermissions.map((permission) =>
                prisma.rolePermission.upsert({
                    where: {
                        roleId_permissionId: {
                            roleId: orgRolesMap[org.id]["ADMIN"].id,
                            permissionId: permission.id,
                        },
                    },
                    update: {},
                    create: {
                        roleId: orgRolesMap[org.id]["ADMIN"].id,
                        permissionId: permission.id,
                    },
                }),
            ),
        );

        // MEMBER gets read-only permissions
        const readPermissions = allPermissions.filter((p) =>
            p.key.endsWith(":read"),
        );

        await Promise.all(
            readPermissions.map((permission) =>
                prisma.rolePermission.upsert({
                    where: {
                        roleId_permissionId: {
                            roleId: orgRolesMap[org.id]["MEMBER"].id,
                            permissionId: permission.id,
                        },
                    },
                    update: {},
                    create: {
                        roleId: orgRolesMap[org.id]["MEMBER"].id,
                        permissionId: permission.id,
                    },
                }),
            ),
        );
    }

    // Memberships (users can have multiple roles in an org)
    const membershipsData = [
        {
            userEmail: "admin@acme.com",
            orgId: "f89da722-1b24-47d8-8c62-a971a50a01b4",
            roles: ["ADMIN", "MEMBER"],
        },
        {
            userEmail: "user@acme.com",
            orgId: "f89da722-1b24-47d8-8c62-a971a50a01b4",
            roles: ["MEMBER"],
        },
        {
            userEmail: "admin@beta.com",
            orgId: "a12b3456-7c89-4d01-2345-6789abcdef01",
            roles: ["ADMIN", "GUEST"],
        },
        {
            userEmail: "user@beta.com",
            orgId: "a12b3456-7c89-4d01-2345-6789abcdef01",
            roles: ["MEMBER", "GUEST"],
        },
    ];

    for (const membership of membershipsData) {
        const user = users.find((u) => u.email === membership.userEmail);
        const roles = membership.roles.map(
            (roleName) => orgRolesMap[membership.orgId][roleName],
        );

        for (const role of roles) {
            await prisma.memberShip.upsert({
                where: {
                    userId_organisationId_roleId: {
                        userId: user.id,
                        organisationId: membership.orgId,
                        roleId: role.id,
                    },
                },
                update: {},
                create: {
                    userId: user.id,
                    organisationId: membership.orgId,
                    roleId: role.id,
                },
            });
        }
    }

    console.log("✅ Seed complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

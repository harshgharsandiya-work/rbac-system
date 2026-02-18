//set of default permission
const defaultPermissions = [
    {
        key: "organisation:create",
        description: "Allows creating organisation",
    },
    {
        key: "organisation:read",
        description: "Allows viewing organisation",
    },
    {
        key: "organisation:update",
        description: "Allows updating organisation",
    },
    {
        key: "organisation:delete",
        description: "Allows deleting organisation",
    },
    {
        key: "user:create",
        description: "Allows creating new users in the organisation",
    },
    {
        key: "user:read",
        description: "Allows viewing users in the organisation",
    },
    {
        key: "user:update",
        description: "Allows updating user information",
    },
    {
        key: "user:delete",
        description: "Allows deleting users",
    },
    {
        key: "role:create",
        description: "Allows creating new roles",
    },
    {
        key: "role:read",
        description: "Allows viewing roles",
    },
    {
        key: "role:update",
        description: "Allows updating roles",
    },
    {
        key: "role:delete",
        description: "Allows deleting roles",
    },
    {
        key: "permission:create",
        description: "Allows creating permissions",
    },
    {
        key: "permission:read",
        description: "Allows viewing permissions",
    },
    {
        key: "permission:update",
        description: "Allows updating permissions",
    },
    {
        key: "permission:delete",
        description: "Allows deleting permissions",
    },
];

module.exports = { defaultPermissions };

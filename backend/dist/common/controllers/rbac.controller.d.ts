import { RBACService } from '../services/rbac.service';
export declare class RBACController {
    private rbacService;
    constructor(rbacService: RBACService);
    getAllRoles(): Promise<({
        _count: {
            userRoles: number;
        };
        permissions: ({
            permission: {
                category: string;
                id: string;
                createdAt: Date;
                isActive: boolean;
                action: string;
                name: string;
                updatedAt: Date;
                scope: string | null;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                displayName: string;
                description: string | null;
                createdBy: string | null;
                resource: string;
                isSystemPerm: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            expiresAt: Date | null;
            updatedAt: Date;
            roleId: string;
            effect: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            permissionId: string;
            grantedBy: string | null;
            grantedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        displayName: string;
        description: string | null;
        parentId: string | null;
        isSystemRole: boolean;
        priority: number;
        createdBy: string | null;
    })[]>;
    getRoleById(id: string): Promise<{
        userRoles: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            expiresAt: Date | null;
            userId: string;
            updatedAt: Date;
            roleId: string;
            effect: string;
            scope: string | null;
            assignedBy: string | null;
            assignedAt: Date;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        permissions: ({
            permission: {
                category: string;
                id: string;
                createdAt: Date;
                isActive: boolean;
                action: string;
                name: string;
                updatedAt: Date;
                scope: string | null;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                displayName: string;
                description: string | null;
                createdBy: string | null;
                resource: string;
                isSystemPerm: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            expiresAt: Date | null;
            updatedAt: Date;
            roleId: string;
            effect: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            permissionId: string;
            grantedBy: string | null;
            grantedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        displayName: string;
        description: string | null;
        parentId: string | null;
        isSystemRole: boolean;
        priority: number;
        createdBy: string | null;
    }>;
    getAllPermissions(): Promise<Record<string, {
        category: string;
        id: string;
        createdAt: Date;
        isActive: boolean;
        action: string;
        name: string;
        updatedAt: Date;
        scope: string | null;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        displayName: string;
        description: string | null;
        createdBy: string | null;
        resource: string;
        isSystemPerm: boolean;
    }[]>>;
    getUserRoles(userId: string): Promise<any[]>;
    getUserPermissions(userId: string): Promise<any[]>;
    getMyPermissions(req: any): Promise<any[]>;
    getMyRoles(req: any): Promise<any[]>;
    assignRoleToUser(userId: string, body: {
        roleId: string;
        expiresAt?: string;
    }, req: any): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        role: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            displayName: string;
            description: string | null;
            parentId: string | null;
            isSystemRole: boolean;
            priority: number;
            createdBy: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        expiresAt: Date | null;
        userId: string;
        updatedAt: Date;
        roleId: string;
        effect: string;
        scope: string | null;
        assignedBy: string | null;
        assignedAt: Date;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    removeRoleFromUser(userId: string, roleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUsersByRole(roleId: string): Promise<({
        user: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        expiresAt: Date | null;
        userId: string;
        updatedAt: Date;
        roleId: string;
        effect: string;
        scope: string | null;
        assignedBy: string | null;
        assignedAt: Date;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    checkPermission(body: {
        userId: string;
        resource: string;
        action: string;
        scope?: string;
    }): Promise<{
        hasPermission: boolean;
    }>;
}

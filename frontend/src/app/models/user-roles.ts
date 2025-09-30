export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin', 
  RESTAURANT_OWNER = 'RestaurantOwner'
}

export interface UserWithRole {
  id: string;
  userName: string;
  email: string;
  role: UserRole;
  imagePath?: string;
}

export class RolePermissions {
  static canAccessBrowse(role: UserRole): boolean {
    return role === UserRole.USER || role === UserRole.ADMIN;
  }

  static canAccessRestaurantPage(role: UserRole): boolean {
    return role === UserRole.USER || role === UserRole.ADMIN;
  }

  static canAccessDashboard(role: UserRole): boolean {
    return role === UserRole.RESTAURANT_OWNER || role === UserRole.ADMIN;
  }

  static canAccessUserFeatures(role: UserRole): boolean {
    return role === UserRole.USER || role === UserRole.ADMIN;
  }

  static isAdmin(role: UserRole): boolean {
    return role === UserRole.ADMIN;
  }

  static isRestaurantOwner(role: UserRole): boolean {
    return role === UserRole.RESTAURANT_OWNER;
  }

  static isUser(role: UserRole): boolean {
    return role === UserRole.USER;
  }
}
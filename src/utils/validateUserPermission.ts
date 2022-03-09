type User = {
  permissions: string[]
  roles: string[]
}

type validateUserPermissionProps = {
  permissions?: string[]
  roles?: string[]
  user: User
}

export function validateUserPermission({
  permissions,
  roles,
  user,
}: validateUserPermissionProps) {
  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.every(permission =>
      user.permissions.includes(permission),
    )

    if (!hasAllPermissions) {
      return false
    }
  }

  if (roles?.length > 0) {
    const hasAllRoles = roles.some(role => user.permissions.includes(role))

    if (!hasAllRoles) {
      return false
    }
  }

  return true
}

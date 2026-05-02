export function getDashboardPath(role) {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'business_owner') return '/business/dashboard'
  return '/dashboard'
}

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  const userRole = authService.getUserRole();
  const expectedRoles: string[] = route.data['roles'];

  // السماح بالمرور إذا كانت الشاشة مطابقة للصلاحية المطلوبة
  if (!expectedRoles || (userRole && expectedRoles.includes(userRole))) {
    return true;
  }

  // إعادة التوجيه لـ Landing Page في حالة محاولة فتح شاشة غير مسموحة
  router.navigate(['/landingpage']);
  return false;
};
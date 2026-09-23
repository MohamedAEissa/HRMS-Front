import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) {} // 1. حقن الـ Router للتوجيه

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // استخدام اسم المفتاح الخاص بك 'eToken'
    const token = localStorage.getItem('eToken');

    if (token) {
      request = request.clone({ 
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 2. تمرير الطلب ومراقبة الـ Response لو رجع 401 Unauthorized
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // مسح الـ Token المنتهي وإعادة التوجيه للـ Login مباشرة
          localStorage.removeItem('eToken');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  let route = request.url;
  if (!route.startsWith('/')) {
    route = `/${route}`;
  }

  const requestCopy = request.clone({ url: `${environment.apiUrl}/${route}` });
  return next(requestCopy);
};

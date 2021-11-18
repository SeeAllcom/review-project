import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class GraphCmsHeadersInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('graphcms')) {
      req = req.clone({
        withCredentials: false,
        headers: req.headers.delete('Authorization'),
      });
    }
    return next.handle(req);
  }
}

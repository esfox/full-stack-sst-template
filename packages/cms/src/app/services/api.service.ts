import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const jsonContentType = { 'Content-Type': 'application/json' };

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  basePath = '';

  private getUrl = (path: string) => {
    const _basePath = this.basePath.startsWith('/') ? this.basePath.substring(1) : this.basePath;
    let fullPath = _basePath;
    if (path !== '/') {
      fullPath += `/${path.startsWith('/') ? path.substring(1) : path}`;
    }

    return new URL(fullPath, this.baseUrl).toString();
  };

  async get<T = unknown>(path: string) {
    const response = await fetch(this.getUrl(path));
    return response.json() as T;
  }

  async post<T = unknown>(path: string, data: unknown) {
    const response = await fetch(this.getUrl(path), {
      method: 'POST',
      headers: {
        ...jsonContentType,
      },
      body: JSON.stringify(data),
    });

    return response.json() as T;
  }

  async patch<T = unknown>(path: string, data: unknown) {
    const response = await fetch(this.getUrl(path), {
      method: 'PATCH',
      headers: {
        ...jsonContentType,
      },
      body: JSON.stringify(data),
    });

    return response.json() as T;
  }
}

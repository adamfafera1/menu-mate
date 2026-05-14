import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly defaultUserImage = 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png';
  private readonly defaultItemImage = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500';

  getImageUrl(path: string | undefined, fallback?: string): string {
    const defaultImage = fallback ?? this.defaultItemImage;
    if (!path) return defaultImage;
    if (path.startsWith('http')) return path;
    const serverUrl = API_CONFIG.baseUrl.replace('/api', '');
    return `${serverUrl}${path}`;
  }

  getUserImageUrl(path: string | undefined): string {
    return this.getImageUrl(path, this.defaultUserImage);
  }
}

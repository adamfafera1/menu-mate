import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private http: HttpClient) { }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const p = Math.PI / 180;
    const x = (lng2 - lng1) * p * Math.cos((lat1 + lat2) / 2 * p);
    const y = (lat2 - lat1) * p;
    return Math.sqrt(x * x + y * y) * 6371;
  }


  isWithinRadius(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number },
    radiusKm: number
  ): boolean {
    if (point1.lat == null || point1.lng == null || point2.lat == null || point2.lng == null) {
      return false;
    }
    return this.calculateDistance(point1.lat, point1.lng, point2.lat, point2.lng) <= radiusKm;
  }


  searchLocations(query: string): Observable<any[]> {
    const trimmedQuery = query?.trim();
    if (!trimmedQuery || trimmedQuery.length < 2) {
      return of([]);
    }
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmedQuery)}&format=json&limit=5&addressdetails=1`;
    return this.http.get<any[]>(url, { headers: { 'Accept-Language': 'en' } }).pipe(
      map(results => {
        const seen = new Set<string>();
        return results
          .map(r => ({
            label: this.formatAddress(r.address) || r.display_name,
            lat: +r.lat,
            lng: +r.lon,
          }))
          .filter(s => {
            const key = s.label.split(',')[0].trim().toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
      })
    );
  }


  private formatAddress(address: any): string {
    const road = address?.road || address?.pedestrian || address?.path || address?.footway;
    const number = address?.house_number;
    const city = address?.city || address?.town || address?.village || address?.municipality || address?.county;
    const parts: string[] = [];
    if (road) parts.push(number ? `${road} ${number}` : road);
    if (city) parts.push(city);
    return parts.join(', ');
  }
}

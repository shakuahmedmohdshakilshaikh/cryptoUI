import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  getCoins(
  currency: string,
  pageNumber: number,
  pageSize: number,
  searchText: string,
  sortBy: string,
  sortOrder: string
) : Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}crypto/get-coins?Currency=${currency}&PageNumber=${pageNumber}&PageSize=${pageSize}&SearchText=${searchText}&SortBy=${sortBy}&SortOrder=${sortOrder}`
  );
}

buycoin(data : any): Observable<any>{
  return this.http.post<any>(`${this.apiUrl}portfolio/buy`, data);
}

addToFavorites(data: any): Observable<any>{
  return this.http.post<any>(`${this.apiUrl}userfavourite`, data);
}
getFavourites(userId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}userfavourite/${userId}`);
}

  removeFavorite(fid : number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}userfavourite/${fid}`);
  }
}

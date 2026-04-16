import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {

  private readonly apiUrl = environment.apiUrl ;

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
  fetchCoins(userId : number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}dashboard?userId=${userId}`);
  }



}

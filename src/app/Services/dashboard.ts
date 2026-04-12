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

  getCoins(currency: any, pageNumber: number, pageSize: number, searchText: string, sortBy: string, sortOrder: string,): Observable<any> {
    let params = new HttpParams()
      .set('Currency', currency)
      .set('PageNumber', pageNumber)
      .set('PageSize', pageSize);

    if (searchText && searchText.trim() !== '') {
      params = params.set('SearchText', searchText);
    }

    if (sortBy && sortBy.trim() !== '') {
      params = params.set('SortBy', sortBy);
    }

    if (sortOrder && sortOrder.trim() !== '') {
      params = params.set('SortOrder', sortOrder);
    }

    return this.http.get<any>(`${this.apiUrl}/crypto/get-coins`, { params });
  }

  fetchCoins(userId : number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/dashboard?userId=${userId}`);
  }



}

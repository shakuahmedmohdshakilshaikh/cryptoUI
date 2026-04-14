import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionServices {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTransactions(userId: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}transaction/wallet/${userId}`);
  }
}

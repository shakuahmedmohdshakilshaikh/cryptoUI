import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletService {

  private apiurl = environment.apiUrl;

  constructor(private http: HttpClient) { } 

  createOrder(data: any): Observable<any>{
    return this.http.post<any>(`${this.apiurl}wallet/create-order`,data);
  }

  verifyPayment(data : any) : Observable<any>{
    return this.http.post<any>(`${this.apiurl}wallet/verify-payment`,data);
}

   deductBalance(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiurl}wallet/deduct-balance`, data);
  }

   getBalance(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiurl}wallet/balance/${userId}`);
  }

  getTransactions(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiurl}portfolio/transactions/${userId}`);
  }

  buycoin(data:any) : Observable<any>{
    return this.http.post<any>(`${this.apiurl}portfolio/buy`, data);
  }

  sellCoins(data:any):Observable<any>{
    return this.http.post(`${this.apiurl}portfolio/sell`,data);
  }
}

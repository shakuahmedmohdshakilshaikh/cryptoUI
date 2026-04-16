import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileServices {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient){}

  getUserById(userId : any) : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}user/${userId}`);
  }
  
  updateById(userid: any, data:any) : Observable<any>{
    return this.http.put<any>(`${this.apiUrl}user/${userid}`,data);
  }

  deleteById(userId : any) : Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}user/${userId}`)
  }
}

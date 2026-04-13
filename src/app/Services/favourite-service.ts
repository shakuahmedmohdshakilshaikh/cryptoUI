import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  getFavourites(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}userfavourite/${userId}`);
  }
  
    removeFavorite(fid : number): Observable<any>{
      return this.http.delete<any>(`${this.apiUrl}userfavourite/${fid}`);
    }

}

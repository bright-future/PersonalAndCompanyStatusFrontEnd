import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserDetails } from '../../configFiles/UserDetails';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})

export class UserDetailService {
  private url = '';

  constructor( private http: HttpClient) { }

  sendUserDetails(userDetail: UserDetails): Observable<any> {
    return this.http.post(this.url, userDetail, httpOptions);//.catch(this.handleError);
  }

  handleError(): void{
    console.log("Error sending user details");
  }
}

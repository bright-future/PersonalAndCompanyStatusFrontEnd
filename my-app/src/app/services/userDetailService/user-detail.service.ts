import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserDetails } from '../../configFiles/UserDetails';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  private url = '';

  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor( private http: HttpClient,
               private UserDetailService: UserDetailService) { }

  updateUserDetails(userDetail: UserDetails): Observables<UserDetails> {
    return this.http.post(this.url, userDetail, httpOptions).pipe(
      tap((userDetail: UserDetails) => this.log(`added user w/ id=${userDetail.email}`)),
      catchError(this.handleError<UserDetails>('updateUserDetails'))
    );
  }

}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserDetails } from '../../configFiles/UserDetails';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  private url = '';
  constructor( private http: HttpClient,
               private messageService: MessageService) { }

  getUserDetails(): Observables<UserDetails[]> {
    return this.http.post<UserDetails>(this.url);
  }

}

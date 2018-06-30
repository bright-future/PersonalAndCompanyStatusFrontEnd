import { Injectable } from '@angular/core';
import { CompaniesListOfGivenRange } from '../configFiles/CompaniesListOfGivenRange';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class UserComparisonService {
  private url = 'http://192.168.173.56:8092/hackathon/getCompaniesListOfGivenRange';
  constructor(private http: HttpClient) { }

  getCompaniesListOfGivenRange(companies: CompaniesListOfGivenRange): Observable<any> {
    return this.http.post(this.url, companies, httpOptions);
  }

  handleError(): void{
    console.log("Error in sending request");
  }

  // extractData(res: Response): void{
    // console.log(res.json());
  // }
}

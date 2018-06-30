import { Injectable } from '@angular/core';
import { CompaniesListOfGivenRange } from '../configFiles/CompaniesListOfGivenRange';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
// import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded',
                              'Access-Control-Allow-Origin':'*'})
};

@Injectable({
  providedIn: 'root'
})


export class UserComparisonService {
  private url = 'http://192.168.173.56:8092/hackathon/getCompaniesListOfGivenRange';
  constructor(private http: HttpClient) { }

  getCompaniesListOfGivenRange(companies: CompaniesListOfGivenRange): Observable<any> {
    let body = new FormData();

    body.append('college', "118");
    body.append('branch', "12");
    body.append('startBatch', "2000");
    body.append('endBatch', "2013");

    console.log("sending request",body,this.url,httpOptions);
    return this.http.post(this.url, body)
    map((res: Response) => res.setHeader('Access-Control-Allow-Origin','http://192.168.173.56:8092  '))
    .catch((error:any)=> Observable.throw(error.json().error||"server error"))
    .subscribe();
    // .map((response: Response) => {
    //     console.log("response",response);
    //     return response;
    //   });

  }
  extractData(res:any){
    console.log("requested");
    console.log(res);
    console.log(res.body());
    return res;
  }
  handleError(res:any): void{
    console.log("Error in sending request");
  }

  // extractData(res: Response): void{
    // console.log(res.json());
  // }
}

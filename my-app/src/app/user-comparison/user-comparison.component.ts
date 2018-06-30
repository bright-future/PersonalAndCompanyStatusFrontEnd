import { Component, OnInit } from '@angular/core';
import { UserComparisonService } from '../services/user-comparison.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CompaniesListOfGivenRange } from '../configFiles/CompaniesListOfGivenRange';

@Component({
  selector: 'app-user-comparison',
  templateUrl: './user-comparison.component.html',
  styleUrls: ['./user-comparison.component.css']
})
export class UserComparisonComponent implements OnInit {

  private request: CompaniesListOfGivenRange;

  constructor(private userComparisonService: UserComparisonService) { }

  ngOnInit() {
    this.request = new CompaniesListOfGivenRange();
    this.request.college="118";
    this.request.branch = "12";
    this.request.startBatch = "2000";
    this.request.endBatch = "2013";
    this.getData(this.request);
  }

  getData(request: CompaniesListOfGivenRange): void{
    this.userComparisonService.getCompaniesListOfGivenRange(request);
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public personalSection: boolean;
  public companySection: boolean;
  constructor() { }

  ngOnInit() {
    this.companySection = false;
    this.personalSection = false;
  }
  onClickexamineYourself(){
    this.companySection = false;
    this.personalSection = true;
  }
  onClickexamineCompany(){
    this.companySection = true;
    this.personalSection = false;
  }
}

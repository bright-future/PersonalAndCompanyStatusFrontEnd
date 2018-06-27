import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.css']
})
export class SelectCompanyComponent implements OnInit {
  companies=[
    {id:1,name:"Adobe"},
    {id:2,name:"Amazon"},
    {id:3,name:"Share Chart"},
    {id:4,name:"Walmart"},
    {id:5,name:"FlipKart"}
  ];
  constructor() { }

  ngOnInit() {
    this.companies=[
      {id:1,name:"Adobe"},
      {id:2,name:"Amazon"},
      {id:3,name:"Share Chart"},
      {id:4,name:"Walmart"},
      {id:5,name:"FlipKart"}
    ]
  }

}

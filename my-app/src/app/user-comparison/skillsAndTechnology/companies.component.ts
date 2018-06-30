import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  private chartData;
  private chartOption;
  constructor() {
    this.chartOption={
                    range:[0,100],
                    color:['maroon','red','orange','yellow','lime','green','cyan','blue','purple','magenta'],
                    // color:['red','steelblue','yellow'],  //If you give it then it overwrites the default color
                    showTable:false,
                    name:['Amazon','Flipkart','Walmart','ShareChart','InfoEdge','Gsachs','dshaw','MMT','TCS','cognizant'],
                    textformat:'%',// If % view is undesired remove this property
                    linelabeling:false, // If false the data labeling is done with in the multidonut or it is done outseide the donut
                    height:360, // height of chart
    }
  }

  ngOnInit() {
    this.chartData ={
      series:[[33,25,17,5,5,5,4,3,2,1]]
    }
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-salary', 
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit {
  private chartOption1;
  private chartData1;
  private chartName1;
  constructor(){
    this.chartName1='Bar Charts',
            this.chartOption1={
                type:'bar',
                range:[0,100],
                // color:['red','steelblue','yellow'],  //If you give it then it overwrites the default color

                // color:['red','steelblue','yellow'],  //If you give it then it overwrites the default color
                name:['min','avg','max'],
                xname:'Year',
                yname:'Salaries of Your Alumini',
                height:400, // height of chart
                xgrid:true,// show y grids
                ygrid:true,
                showBarData:false,// In true mode the labeling on the bar is permenent
                showTable:false,// to switch to table mode
                // limit:25,
                labelXInterpolation:function(i){// either remove this property or define it if i=null then the following index of x value wont be shown

                                if(i%1==0)
                                {
                                    return 'abc';
                                }
                                else{
                                    return null;
                                }
                        }
            }
  }
  ngOnInit(){
    this.chartData1={
                svgWidth:1000,
                svgHeight:400,
                labels:[2001,2002,2003,2004,2005,2006,2007],
                // series:[[10,20,50,10,10,45],[10,30,40,44,32,45],[10,20,50,11,22,33],[11,56,45,67,89,23],[10,20,50,11,22,33],[11,56,45,67,89,23]]
                series:[[10,20,50,10,10,45],[10,30,40,44,32,45],[10,30,40,44,32,45]]
    }
  }

}

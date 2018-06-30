import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-your-current-status',
  templateUrl: './your-current-status.component.html',
  styleUrls: ['./your-current-status.component.css']
})
export class YourCurrentStatusComponent implements OnInit {
  private chartData;
  private chartOption;
  constructor() {
    this.chartOption={
                    height:350,
                    labeling:true,// to on off the labelling of gauge
                    colorconfig:[
                            {percentage:40,div:3,color1:'#e8e2ca',color2:'#3e6c0a'},
                            {percentage:40,div:2,color1:'#ffbf00',color2:'#ff8000'},
                            {percentage:20,div:2,color1:'#ff4000',color2:'#ff0000'},
                    ],
                    dataRange:{min:0,max:100},
    }
  }

  ngOnInit() {
    this.chartData = 86.6;
  }

}

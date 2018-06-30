import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skillscomparison-component',
  templateUrl: './skillscomparison-component.component.html',
  styleUrls: ['./skillscomparison-component.component.css']
})
export class SkillscomparisonComponentComponent implements OnInit {

  private chartData;
  private chartOption;
  constructor() { 
	  this.chartOption={
	                    range:[0,100],
	                    color:['maroon','red','orange','yellow','lime','green','cyan','blue','purple','magenta'],
	                    showTable:false,
	                    name:['Manager','Software Engineer','Vice President','Manager - II','Manager - I','General Manager','MTS - I','MTS - II','MTS - III','Quality Assurance Engineer'],
	                    textformat:'%',
	                    linelabeling:false, 
	                    height:360, 
	    }
  }

  ngOnInit() {
   this.chartData ={
      series:[[27,31,17,8,2,1,8,3,2,1]]
    }
  }

}

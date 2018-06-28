import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit {
  @Input() data;
  @Input() options;

  private drawGraph:boolean;
  //scales
  private myDegree2RadScale;
  private myData2RadScale;
  private Rad2myDataScale;
  private Rad2myDegreeScale;

  // svg elements

  private svgContainer;
  private random:any;
  private svgWidth;
  private svgHeight;
  private ChartWidth;
  private ChartHeight;
  // private pointer;

  //common variables
  private radius;
  private liveData;
  private textsize;
  private allow;
  private margin;
  private largepadding;
  private smallpadding;

  // definations
  private definations={
      arcDefination:null,
      pieDefination:null,
      lineDefination:null
  }
  constructor() {
    var temp=Date.now();
    this.random='gauge_id'+temp+Math.floor(Math.random()*100);
  }
  ngOnInit() {
  }
  ngAfterViewInit(){
      this.update(this,false);
      this.allow=true;
      this.allow=true;
  }
  ngOnChanges(){
      if(this.allow){
          if(this.data==undefined)// when ever chart data undefined remove svg's children and redraw
          {
              this.removeSvgChildren()
              this.update(this,false);// false because  drawing empty graph,false redraws the graph
              this.drawGraph=true;// first time after the chartdata is not undefined we have to redraw it
          }
          else{
              if(this.drawGraph)
              {
                  this.removeSvgChildren()
                  this.update(this,false);
                  this.drawGraph=false;
              }
              else{
                  this.update(this,true);
              }
          }
      }
  }
  listenWindow(){
      var self=this;
      // window.addEventListener("resize", function(){self.update(self)});
      self.update(self,true);
  }
  update(self,update){

      self.init(update);
      self.createGauge(update);
      self.pointer(update);
  }

  init(update)
  {
      var self=this;
      d3.select('#'+this.random)
          .style('height',this.options.height+'px');

      this.svgHeight=parseInt(d3.select('#'+this.random).style('height') );

      this.svgWidth=parseInt(d3.select('#'+this.random).style('width') );

      this.margin = {top: 40, right: 40, bottom: 60, left: 40},
      this.ChartWidth=this.svgWidth-this.margin.left-this.margin.right;
      this.ChartHeight=this.svgHeight-this.margin.top-this.margin.bottom;




      //initializing scale
      this.myDegree2RadScale = d3.scaleLinear().domain([-90, 90]).range([ -Math.PI/2 ,  Math.PI/2 ]);// linearly scaled number to pie
      this.myData2RadScale = d3.scaleLinear().domain([self.options.dataRange.min,self.options.dataRange.max]).range([ -Math.PI/2 ,  Math.PI/2 ]);
      this.Rad2myDataScale = d3.scaleLinear().domain([ -Math.PI/2 ,  Math.PI/2 ]).range([self.options.dataRange.min,self.options.dataRange.max]);
      this.Rad2myDegreeScale=  d3.scaleLinear().domain([-Math.PI/2 ,  Math.PI/2 ]).range([-90,90]);


      //colors


      // definations
      this.definations.pieDefination=d3.pie()
                                      .sort(null)
                                      .value(function(d,i){
                                          return d;
                                      })
                                      .startAngle(-Math.PI/2)
                                      .endAngle(Math.PI/2);
      this.definations.arcDefination=d3.arc()// arc created to create normal arc no color
                                      .innerRadius(self.radius/2)
                                      .outerRadius(self.radius)
                                      .startAngle(function(d, i) {
                                      // return (d.startAngle)/2-Math.PI/2;
                                      return (d.startAngle);
                                      })
                                      .endAngle(function(d, i) {
                                          var ratio = d.data * (i+1);// we get angle from pie but its for full circle so mathematical calculation is done
                                          // return (d.endAngle)/2-Math.PI/2;
                                          return (d.endAngle)
                                      });
      this.definations.lineDefination=d3.line()
                                          .x(function(d) { return d.x; })
                                          .y(function(d) { return d.y; });

      // global text size
      this.textsize=12;


      // variables
      var largepadding= (Math.min(this.ChartWidth,this.ChartHeight)/10);
      var smallpadding=largepadding/2;
      self.radius=(Math.min(this.ChartWidth/2,this.ChartHeight) );

      //defining svg
      if(!update){
      self.svgContainer=d3.select('#'+self.random)
                              // .attr('class','graph')
                              .append('svg:svg')
                              .attr('id','svg'+self.random)
                              .attr('width',self.svgWidth)
                              .attr('height',self.svgHeight)
                              .append('g')
                              .attr('transform','translate('+self.margin.left+','+self.margin.top+')');
          //  self.svgContainer.append('g')//for legend purpose
          //              .attr('class','tempclass');

      }
      else{
          self.svgContainer=d3.select('#svg'+self.random)
                              .attr('width',self.svgWidth)
                              .attr('height',self.svgHeight);
      }


  }
  createGauge(update){
      var self=this,arcs,arcpath,labels,textArea;
      var tickData=[];// this variable is responsible for divisions in donut
      var tickcnt=[];// responsible to give the relevant data to getcolor function
      for(let temp of this.options.colorconfig)
      {
          for (var i=0;i<temp.div;i++)
          {
              tickData.push(temp.percentage/(100*temp.div) );
          }
          if(tickcnt.length==0)
              tickcnt.push(temp.div);
          else
              tickcnt.push(temp.div+tickcnt[tickcnt.length-1]);
      }
      if(!update)
      {
         arcs = self.svgContainer.append('g')// bringing arcs to center
                              .attr('class', 'arc');
         self.svgContainer.append('g')
                              .attr('class','pointer');

         self.svgContainer.append('g')
                              .attr('class','liveDataArea')
                              .attr('transform', "translate("+self.ChartWidth/2+","+(self.ChartHeight+self.margin.top)+")" );
         textArea=self.svgContainer.select('.liveDataArea')
                              .append('text');
      }
      else{
          arcs=self.svgContainer.select('.arc');
          self.svgContainer.select('.liveDataArea')
                                  .attr('transform', "translate("+self.ChartWidth/2+","+(self.ChartHeight+self.margin.top)+")" );
          textArea=self.svgContainer.select('.liveDataArea')
                                      .select('text');
      }
      arcs.attr('transform', "translate("+self.ChartWidth/2+","+self.ChartHeight+")" );
      // arc section
      if(!update)
      {
          arcpath= arcs.selectAll('path')
          .data(self.definations.pieDefination(tickData) )
                  .enter()
                  .append('path')
      }
      else{
          arcpath=arcs.selectAll('path')
      }
      arcpath.attr('fill', function(d, i) {
                  var index=0;
                  while(i+1>tickcnt[index])
                  {
                      index++;
                  }
                  var arcColorFn=self.getColor(self.options.colorconfig[index].color1,self.options.colorconfig[index].color2);
                  if(index==0)
                      {

                          return arcColorFn(i/self.options.colorconfig[index].div);
                      }
                  else{
                          return arcColorFn((i-tickcnt[index-1])/self.options.colorconfig[index].div);
                  }
      })
      .attr('d', self.definations.arcDefination);


      //labelling section
      if(!update)
      {
          console.log(self.ChartWidth/2,self.ChartHeight);
          labels=self.svgContainer.append('g')
                                  .attr('class', 'label')
                                  .attr('transform', "translate("+self.ChartWidth/2+","+self.ChartHeight+")" )
                                  .selectAll('text')
                                  .data(self.definations.pieDefination(tickData) )
                                  .enter().append('text');
      }
      else{
          labels=self.svgContainer.select('.label')
                                  .attr('transform', "translate("+self.ChartWidth/2+","+self.ChartHeight+")" )
                                  .selectAll('text')
                                  .data(self.definations.pieDefination(tickData) );
      }
      labels.text(function(d,i){

                      var format=d3.format('.1f');
                          return Math.floor(format(self.Rad2myDataScale((d.startAngle))) );///2-Math.PI/2
                  })
                  .attr('transform',function(d,i){
                      var temp=self.Rad2myDegreeScale(d.startAngle);
                      temp=temp//check appropiate variable

                      return 'rotate('+temp+') translate(0,'+(-self.radius-10)+')';
                  })
                  .attr("fill",'white')
                  .attr('text-anchor','middle')
                  .attr('opacity',function(){
                      if(self.options.labeling)
                          return 1;
                      else
                          return 0;
                  })
                  .style("font-size",self.textsize+'px');
      labels=self.svgContainer.select('.label');
      if(!update){

                  labels
                      .append('text')// to put max range
                      .attr('class','maxdata')
                      .attr('text-anchor','middle')
                      .attr('opacity',function(){
                          if(self.options.labeling)
                              return 1;
                          else
                              return 0;
                      })
                      .attr('transform',function(d,i){
                          var temp=self.Rad2myDegreeScale(Math.PI/2);
                          // temp=temp-self.smallpadding/2;//check appropiate variable

                          return 'rotate('+temp+') translate(0,'+(-self.radius-10)+')';
                      })
                      .text(function(d){
                          var format=d3.format('.1f');
                          return Math.floor(format(self.Rad2myDataScale(Math.PI/2) ) );
                      })
                      .attr("fill",'white')
                      .attr("font-size",self.textsize+'px');
      }
      else{
          labels.select('.maxdata')
                  .attr('transform',function(d,i){
                                  var temp=self.Rad2myDegreeScale(Math.PI/2);

                                  return 'rotate('+temp+') translate(0,'+(-self.radius-10)+')';
                  })
                  .attr('opacity',function(){
                      if(self.options.labeling)
                          return 1;
                      else
                          return 0;
                  })
                  .text(function(d){
                      var format=d3.format('.1f');
                      return Math.floor(format(self.Rad2myDataScale(Math.PI/2) ) );
                  });

      }
      //live data ie live text area

      textArea.text(function(){
          var format=d3.format('.1f');
          return format(self.data);
      })
              .attr('fill','white')
              .attr('text-anchor','middle');

  }
  pointer(update){

      var self=this,pointercircle,livedatabox;
      if(self.data==undefined)
      {
          self.data=self.options.dataRange.min;
      }
      var pointerdata=[
                          {"x":0,"y":-2*self.radius/3},{"x":2,"y":-2*self.radius/3},{"x":6,"y":self.radius/8},{"x":-6,"y":self.radius/8},{"x":-2,"y":-2*self.radius/3},{"x":0,"y":-2*self.radius/3}
                      ] ;
      var pointerClass=self.svgContainer.select('.pointer')
                                          .attr('transform', "translate("+self.ChartWidth/2+","+self.ChartHeight+")" );

      if(!update)
      {
          pointerClass.append('g')
                      .attr('class','livedatabox')//moving box
                      .append('text')
                      .attr('y',-self.radius-30)
                      .text(self.data)
                      .attr('fill','white')
                      .attr('transform','rotate(-90)');

          pointerClass.append('path')
                  .attr('d',self.definations.lineDefination(pointerdata) )
                  .attr('stroke','black')
                  .attr("stroke-width", 1)
                  .attr('fill','grey')
                  .attr('transform', 'rotate('+(-90 )+') ' );

          pointercircle=pointerClass.append('circle')
                                  .attr('r',self.radius/10)
                                  .attr('class','circle')
                                  .style('stroke','green')
                                  .style('stroke-width','2px')
                                  .style('fill','green');




      }
      else{
          var angle = self.Rad2myDegreeScale(self.myData2RadScale(self.data) );

          if(angle>self.Rad2myDegreeScale(Math.PI/2 ))
          {
              angle= self.Rad2myDegreeScale(self.myData2RadScale(Math.PI/2) )
          }
          if(angle<self.Rad2myDegreeScale(self.myData2RadScale(-Math.PI/2 ) ))
          {
              angle= self.Rad2myDegreeScale(self.myData2RadScale(-Math.PI/2) )
          }
          pointerClass.select('.livedatabox')
                      .select('text')
                      .attr('y',-self.radius-30)
                      .transition()
                      .duration(750)
                      .text(function(){
                          var format=d3.format('.1f');
                          return format(self.data);
                      })
                      .attr('transform','rotate('+(angle)+')' );//translate('+(-self.radius-30)+','+(0) +')
          pointerClass.select('path')
                  .attr('d',self.definations.lineDefination(pointerdata) )
                  .attr('stroke','black')
                  .attr("stroke-width", 1)
                  .attr('fill','grey')
                  .transition()
                  .duration(750)
                  .ease(d3.easeLinear)
                  .attr('transform', 'rotate(' +angle +') ' );
          pointercircle=pointerClass.select('.circle')
                       .attr('r',self.radius/10);
      }

  }
  removeSvgChildren(){
      d3.select('#'+this.random).select('svg').selectAll('g').remove();
  }
  getColor(color1,color2)
  {
      return d3.interpolateHsl(d3.rgb(color1),d3.rgb(color2));//takes input between [0-1] gives color
  }

}

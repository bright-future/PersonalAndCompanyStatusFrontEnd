import { Component, OnInit,AfterViewInit,OnDestroy,Input } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent implements OnInit {
    @Input() chartData;
    @Input() options;
    @Input() redraw;

    private drawGraph:boolean;

    //svg global varibles
    private random:any;
    private svgWidth;
    private svgHeight;
    private largepadding;
    private smallpadding;
    private margin:any;
    private ChartWidth;
    private ChartHeight;
    private barMeasurments;
    private textLengths={
        legend:[],
        computedData:[],
    };
    //scales
    private myYdataScale;
    private myYdataScale1;
    private myXdataScale;
    private myXordinalScale;
    private myOpacityScale;
    //defination
    private defination;
    //svg elements
    private svgContainer;
    private areas;
    private line;
    private barGroup;
    private allow=false;
    private textsize;
    private lineEnabled=[];

    //colors
    private color=[];
  constructor() {
    var temp=Date.now();// to create a unique id
        this.random='linegraph_id'+temp+ Math.floor(Math.random()*100);
        this.defination={
            lineDefination:null,
            areaDefination:null,
        }
        this.drawGraph=true;
   }

  ngOnInit() {
  }
  ngAfterViewInit(){// runs when the dom is initialized
            this.update(this,false);
            // this.listenWindow();
            this.allow=true;
  }
  ngOnDestroy(){
  }
  init(update){
        //initializing common variables
        if(this.chartData==undefined)
        {
            this.chartData={
                labels:[],
                series:[]
            }

        }
        // console.log('printing data ',this.options,' ',this.chartData,' ',this.chartData.labels.length,' ',this.chartData.series,' ',this.chartData.series.length);
        d3.select('#'+this.random)
            .style('height',this.options.height+'px');

        this.svgHeight=parseInt(d3.select('#'+this.random).style('height') );

        this.svgWidth=parseInt(d3.select('#'+this.random).style('width') );

        // this.svgHeight-=40;
        this.svgWidth-=44;

        this.svgHeight=Math.max(80,this.svgHeight);
        // console.log('got the height and width of parent ',this.svgHeight,this.svgWidth);

        this.margin = {top: 20, right: 50, bottom: 40, left: 50},
        this.ChartWidth=this.svgWidth-this.margin.left-this.margin.right;
        this.ChartHeight=this.svgHeight-this.margin.top-this.margin.bottom;
        this.barMeasurments={
            barGroupWidth:this.ChartWidth/(this.chartData.labels.length+1),// +2 will be added     function is used to handle cases when data doesnt reach
            barWidth:null
        }

        this.barMeasurments.barWidth=this.barMeasurments.barGroupWidth/(this.chartData.series.length+1);

        // console.log(this.margin,this.barMeasurments,this.chartData.labels,this.chartData.labels.length,this.ChartWidth);


        //initializing scale
        if(this.options.type=='bar'||this.options.type=='Bar'|| this.options.type=='linebar')
            this.myXdataScale=d3.scaleLinear().domain([0,this.labelLength()+1]).range([0,this.ChartWidth]);
        else
            this.myXdataScale=d3.scaleLinear().domain([0,this.labelLength()-1]).range([0,this.ChartWidth]);

        var minmax=[0,0];
        if(this.chartData&& this.chartData.series)
            minmax=this.getMinMax(this.chartData.series);
        this.myYdataScale=d3.scaleLinear().domain( [ Math.min(this.options.range[0],minmax[0] ),Math.max(this.options.range[1],minmax[1]+20) ]).range([this.ChartHeight,0]);
        //for linebar
        if(this.options.type=='linebar')
            this.myYdataScale1=d3.scaleLinear().domain( [ Math.min(this.options.range1[0],minmax[0] ),Math.max(this.options.range1[1],minmax[1]+20) ]).range([this.ChartHeight,0]);


        //colors
        if(this.options.color)
            this.color=this.options.color;
        else
            this.color=['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'];

        // definations
        var self=this;
        this.defination.lineDefination=d3.line()
                                            .curve(d3.curveMonotoneX)
                                            .x(function(d,i){
                                                // console.log('line defination ',d,i);
                                                if(self.options.type=='Line'||self.options.type=='line')
                                                    return  self.myXdataScale(i);
                                                else
                                                    return self.myXdataScale(i+1);

                                            })
                                            .y(function(d){
                                                return  self.myYdataScale(d);
                                            });
        this.defination.areaDefination=d3.area()
                    .curve(d3.curveMonotoneX)
                    .x(function(d,i){
                        if(self.options.type=='Line'||self.options.type=='line')
                            return  self.myXdataScale(i);
                        else
                            return self.myXdataScale(i+1);
                    })
                    .y0(this.ChartHeight)//lower most value
                    .y1(function(d){
                        return  self.myYdataScale(d);//present value
                    });
        // global text size
        this.textsize=14;
        //defining svg
        if(!update){
        self.svgContainer=d3.select('#'+self.random)
                                // .attr('class','graph')
                                .select('svg')
                                .attr('id','svg'+self.random)
                                .attr('width',self.svgWidth)
                                .attr('height',self.svgHeight)
                                .append('g')
                                .attr('transform','translate('+self.margin.left+','+self.margin.top+')');
             self.svgContainer.append('g')
                         .attr('class','tempclass');
        }
        else{
            self.svgContainer=d3.select('#svg'+self.random)
                                .attr('width',self.svgWidth)
                                .attr('height',self.svgHeight);
        }
        self.svgContainer.select('.tempclass')
                        .selectAll('text')
                        .data(self.options.name)
                        .enter()
                        .append('text')
                        .attr('font-size',self.textsize+'px')
                        .text(function(d){return d})
                        .each(function(d,i) {
                        var thisWidth = this.getComputedTextLength()
                        self.textLengths.legend.push(thisWidth)
                        this.remove() // remove them just after displaying them
                    })
        // if(self.chartData==undefined)
        // {
        //     self.chartData={
        //         labels:[1,2,3,4,5],
        //         series:[]
        //     }

        // }
    }
    createGraph(update){
        var self=this,drawGraph,focus,hoverLine;
        if(!update)
        {
            self.svgContainer.append('g')
                                  .attr('class','bar-chart');
            self.svgContainer.append('g')
                             .attr('class','legends');
            self.svgContainer.append('g')
                        .attr('class','mathline')
            //drawGraph has 4 groups focus,hoverline,areaGraph,lineGraph

            drawGraph=self.svgContainer.append('g')
                                        .attr('class','graph')
                                        .attr('width',self.ChartWidth)
                                        .attr('height',self.ChartHeight)
            hoverLine=drawGraph.append('g')
                     .attr('class','hover-line')
                     .append('line')
                     .attr('opacity',1e-6);
            focus=drawGraph.append('g')
                            .attr('class','focus');

        }
        //  area and line only when options specify lines focus defined outside because may be used for bar
        if(self.options.type=='line'||self.options.type=='Line'||self.options.type=='linebar'){
            var lineChartData,lineColors;
            if(self.options.type=='line'||self.options.type=='Line')
            {
               lineChartData=self.chartData.series;
               lineColors=self.color;
            }
            else{
                lineChartData=[];
                lineColors=[];
                // lineChartData.push(0);
                for(let i in self.chartData.series)
                {
                    if(self.options.types[i]=='line')
                        {
                            lineChartData.push(self.chartData.series[i]);
                            lineColors.push(self.color[i]);
                        }
                }
            }
                if(!update){
                    focus.selectAll("circle")
                            .data(lineChartData)//self.chartData.series
                            .enter()
                            .append('circle')
                            .attr("r", 5)
                            .attr('fill',function(d,i){
                                return lineColors[i];
                            })
                            .attr('opacity',1e-6);

                    focus.selectAll('text')
                        .data(lineChartData)
                        .enter()
                        .append('text')
                        .attr('font-size',self.textsize+'px')
                        .attr('fill','black');

                //---------------------------------------Area------------------------------------------------------------------

                     self.areas=drawGraph.append('g')
                                        .attr('class','areaGraph')
                                        .selectAll('path')
                                        .data(lineChartData)//self.chartData.series
                                        .enter().append('path')
                                        .attr('class','area')
                                        .attr('opacity',function(d,i){
                                            return 0.2;
                                        })
                                        .attr('fill',function(d,i){
                                            if(self.options.area)
                                                return lineColors[i];//self.color[i]
                                            else
                                                return 'transparent';
                                        })
                            .attr('d',self.defination.areaDefination)
                            .on('mousemove',function(){

                                    self.mouseMoveEvent(self,this,hoverLine,focus,lineChartData,lineColors);

                            })
                            .on('mouseout',function(){
                                hoverLine.style('opacity',1e-6);
                                d3.select('#table'+self.random)
                                    .select('table').style('opacity',1e-6);
                                focus.selectAll("circle")
                                    .style('opacity',1e-6);
                                focus.selectAll('text')
                                    .style('opacity',1e-6);
                            })
                            .on('mouseleave',function(){
                                hoverLine.style('opacity',1e-6);
                                d3.select('#table'+self.random)
                                    .select('table').style('opacity',1e-6);
                                focus.selectAll("circle")
                                    .style('opacity',1e-6);
                                focus.selectAll('text')
                                    .style('opacity',1e-6);
                            });


                    self.line=drawGraph.append('g')
                                        .attr('class','lineGraph')
                                        .selectAll('path')
                                        .data(lineChartData)//self.chartData.series
                                        .enter().append('path')
                                        .attr('class','line')
                                        .attr('fill','none')
                                        .style('stroke',function(d,i){
                                                    return lineColors[i];
                                        })
                                        .attr('stroke-width','1px')
                                        .attr('d',self.defination.lineDefination);

                }

            else{
                focus=self.svgContainer.select(".focus");
                hoverLine=self.svgContainer.select(".hover-line")
                                            .select("line");
                focus.selectAll("circle")
                        .data(lineChartData)//self.chartData.series
                        .attr("r", 5)
                        .attr('fill',function(d,i){
                            return lineColors[i];
                        })
                        .attr('opacity',1e-6);

                focus.selectAll('text')
                    .data(lineChartData)
                    .attr('font-size',self.textsize+'px')
                    .attr('fill','black');

                self.areas.on("mousemove",function(){
                        self.mouseMoveEvent(self,this,hoverLine,focus,lineChartData,lineColors);
                });

                self.line
                    .data(lineChartData)//self.chartData.series
                    // .transition()
                    // .duration(750)
                    .attr('d',self.defination.lineDefination );
                self.areas
                        .data(lineChartData)
                        // .transition()
                        // .duration(750)
                        .attr('d',self.defination.areaDefination);
             }
        }
        if(self.options.type=='bar'||self.options.type=='Bar'||self.options.type=='linebar'){
            var barChartData,barColors=[];
            if(!update){
                // console.log('here',self.barMeasurments);
                // self.svgContainer.append('g')
                //                   .attr('class','bar-chart');
                self.barGroup=self.svgContainer.select('.bar-chart')
                                          .selectAll('.barGroup')
                                          .data(self.chartData.labels)
                                          .enter()
                                          .append('g')
                                          .attr('class','barGroup')
                                          .attr('transform',function(d,i){
                                              return 'translate('+(self.myXdataScale(i+1)-self.barMeasurments.barGroupWidth/2+self.barMeasurments.barWidth/2)+','+0+')';
                                          });

                var bar=self.barGroup.selectAll('g')
                                  .data(function(d,j){
                                    //   console.log('rect  ',d,j);
                                      var data=[];
                                        if(self.options.type=='linebar')
                                        {
                                            for(let i in self.chartData.series)
                                                {
                                                    if(self.options.types[i]=='bar')
                                                        {
                                                            data.push({val:self.chartData.series[i][j],index:i,groupno:j });
                                                            barColors.push(self.color[i]);
                                                        }
                                                }
                                        }
                                        else{
                                            for(let i in self.chartData.series)
                                                {
                                                    data.push({val:self.chartData.series[i][j],index:i,groupno:j });//3 data of 3 line at particular index
                                                    barColors.push(self.color[i]);
                                                }
                                        }
                                    //   console.log(data);
                                      return data;
                                  })
                                  .enter()
                                  .append('g')
                                //   .attr('id',function(d,j){
                                //         return 'bar'+d.groupno+''+d.index;
                                //   })
                                  .attr('class',function(d,j){
                                        return 'bar';
                                  });
                                //   .attr('opacity',0.7);
                            bar.append('rect');
                            bar.select('rect')
                                .attr('opacity',0.7);
                            bar.append('text')
                                .attr('opacity',function(d,i){
                                    if(self.options.showBarData)
                                        return 1;
                                    else
                                        return 1e-6;
                                })

            }
            else{
                self.barGroup=self.svgContainer.select('.bar-chart')
                                          .selectAll('.barGroup')
                                          .data(self.chartData.labels)
                                          .attr('transform',function(d,i){
                                              return 'translate('+(self.myXdataScale(i+1)-self.barMeasurments.barGroupWidth/2+self.barMeasurments.barWidth/2)+','+0+')';
                                          });
                var bar=self.barGroup.selectAll('g')
                                .data(function(d,j){
                                    //   console.log('rect  ',d,j);
                                      var data=[];
                                      if(self.options.type=='linebar')
                                        {
                                            for(let i in self.chartData.series)
                                                {
                                                    if(self.options.types[i]=='bar')
                                                        {
                                                            data.push({val:self.chartData.series[i][j],index:i,groupno:j });
                                                            barColors.push(self.color[i]);
                                                        }
                                                }
                                        }
                                        else{
                                                for(let i in self.chartData.series)
                                                {
                                                    data.push({val:self.chartData.series[i][j],index:i,groupno:j });//3 data of 3 line at particular index
                                                    barColors.push(self.color[i]);
                                                }
                                        }
                                    //   console.log(data);
                                      return data;
                                  })


            }
            //  bar.transition()
            bar.select('rect')
                    .transition()
                    .delay(500)
                    .attr('x',function(d,i){
                        return i*self.barMeasurments.barWidth;
                    })
                    .attr('y',function(d,i){
                        if(self.options.type=='bar'||self.options.type=='Bar')
                            return self.myYdataScale(d.val);
                        else
                            return self.myYdataScale1(d.val);
                    })
                    .attr('width',function(d,i){
                        return self.barMeasurments.barWidth;
                    })
                    .attr('height',function(d,i){
                        return self.ChartHeight-self.myYdataScale(d.val);
                    })
                    .attr('fill',function(d,i){
                        return barColors[i]}//self.color[i]
                        )
                    .attr('id',function(d,j){
                        return 'bar'+d.groupno+''+d.index;
                    })

                    self.activateBarevent(bar);



            bar.select('text')
                .transition()
                .delay(500)
                .attr('id',function(d,j){
                        return 'barData'+d.groupno+''+d.index;
                    })
                .attr('text-anchor','middle')
                .attr('x',function(d,i){
                        return i*self.barMeasurments.barWidth+self.barMeasurments.barWidth/2;
                    })
                .attr('y',function(d,i){
                    return self.myYdataScale(d.val);
                })
                .attr('fill',function(d,i){return 'black'})
                .text(function(d,i){
                    return (d.val);
                })


        }


    // d3.select('#graphDraw').on('resize', self.redrawTexts(self));

    // window.addEventListener("resize", function(){self.update(self)});

}
listenWindow(){
    var self=this;
    self.update(self,true)
    // window.addEventListener("resize", function(){self.update(self,true)});
}
update(self,update){// update =false means drawing the graph
    // console.log('window called');
    self.init(update);
    self.createGraph(update);
    self.XAxis(update);
    self.YAxis(update);
    if(self.options&&self.options.type=='linebar')
        {
            self.YAxis1(update);
        }
    self.legendutility(update);
    if(self.options.statistics=='true'||self.options.statistics==undefined)
        {
            self.mathLine(update);
        }

}

//---------------------------------utilities---------------------------------------------------
    labelLength(){
        if(this.chartData&&this.chartData.labels)
        {
            return this.chartData.labels.length;
        }
        else{
            return this.options.limit;
        }
    }
    seriesLength(){
        if(this.chartData&&this.chartData.series)
        {
            return this.chartData.series.length;
        }
        else{
            return 0;
        }
    }
     getMinMax(arr){
         var maxi=1e-6,mini=1e6;
        for(let i in arr)
        {
            for(let j in arr[i])
            {
                maxi=Math.max(maxi,parseInt(arr[i][j]) );
                mini=Math.min(mini,parseInt(arr[i][j]) );
            }
        }
        return [mini,maxi];
    }
     XAxis(update){

         var self=this;
         var ordinalDomain;
         ordinalDomain=[];
         for(let i=0;i<self.chartData.labels.length;i++)
         {
             ordinalDomain.push(self.myXdataScale(i));
         }
         self.myXordinalScale=d3.scaleOrdinal().domain(self.chartData.labels).range(ordinalDomain);
         if(!update){
          self.svgContainer.append('g')
                                .attr('class', 'x-axis')
                                .attr('transform', 'translate(0,' + self.ChartHeight + ')')
         }
                                // .call(self.myXdataScale);
        if(self.options.type=='line'||self.options.type=='Line'){
         var xaxis=self.svgContainer.select('.x-axis')
                                    .attr('transform','translate('+(0)+','+(self.ChartHeight)+')');
                            if(self.chartData.labels.length){// condition so that undefined transformation doesnt happens while ther is undefined data
                                    xaxis
                                    .call(d3.axisBottom(self.myXordinalScale)
                                    .ticks(self.chartData.labels.length)
                                    .tickSize(-self.ChartHeight) )
                            // .attr('font-color','black')
                                    .attr('font-size',self.textsize+'px');
                        }
                xaxis.selectAll('line')
                    .data(self.chartData.labels)
                    .attr('y2',function(d,i){
                            if(self.options.labelXInterpolation)
                                {
                                    //  for(let i in self.chartData.labels)

                                                // console.log("interpolate ", self.options.labelXInterpolation(i) );
                                                if(self.options.labelXInterpolation(i)==null)
                                                    return 0;
                                                else
                                                    return -self.ChartHeight;

                                            // return -self.lineChartHeight
                                }
                                if(self.options.xgrid)
                                    return -self.ChartHeight;
                                else
                                    return 0;
                    })
                    .attr('fill','#aaa')
                    .attr('stroke','#aaa')
                    .attr('opacity',0.4);

                xaxis.selectAll('text')
                    .data(self.chartData.labels)
                    .style('text-anchor',function(d,i){
                        console.log(d);
                            if(self.options.xaxisTextTilt)
                                return 'end';
                            else
                                return 'middle';
                        })
                    .attr('transform',function(){
                        if(self.options.xaxisTextTilt)
                        {
                            return 'rotate('+self.options.xaxisTextTilt+')';
                        }
                            return 'rotate(0)';
                    })
                    // .transition()
                    // .duration(750)
                    .attr('fill',function(d,i){
                        if(self.options.labelXInterpolation)
                        {

                            if(self.options.labelXInterpolation(i)==null)
                                return 'transparent';
                            else
                                return 'black';

                        }

                        return 'black';
                    });
                    console.log(self.chartData.labels,'   ',self.options);
                    if(self.options.xaxisTextTilt){
                        xaxis.select('text')
                        .attr('text-anchor','start');
                    }

        }
        else if(self.options.type=='bar'||self.options.type=='Bar'||self.options.type=='linebar'){
            ordinalDomain=[];
             var labels=[];
            for(let i=0;i<self.chartData.labels.length+2;i++)
            {
                ordinalDomain.push(self.myXdataScale(i));
                if(i==0||i==self.chartData.labels.length+1)
                {
                    labels.push('');
                }
                else
                    labels.push(self.chartData.labels[i-1]);
            }

            self.myXordinalScale=d3.scaleOrdinal().domain(labels).range(ordinalDomain);
            var xaxis=self.svgContainer.select('.x-axis')
                                    .attr('transform','translate('+(0)+','+(self.ChartHeight)+')')
                                    .call(d3.axisBottom(self.myXordinalScale)
                                    .ticks(self.chartData.labels.length+2)
                                    .tickSize(-self.ChartHeight) )
                            // .attr('font-color','black')
                            .attr('font-size',self.textsize+'px');


                xaxis.selectAll('line')
                    .data(labels)
                    // .transition()
                    // .duration(750)
                    .attr('y2',function(d,i){
                            if(self.options.labelXInterpolation)
                                {
                                    //  for(let i in self.chartData.labels)

                                                // console.log("interpolate ", self.options.labelXInterpolation(i) );
                                                if(self.options.labelXInterpolation(i)==null)
                                                    return 0;
                                                else
                                                    return -self.ChartHeight;

                                            // return -self.lineChartHeight
                                }
                                if(self.options.xgrid)
                                    return -self.ChartHeight;
                                else
                                    return 0;
                    })
                    .attr('fill','#aaa')
                    .attr('stroke','#aaa')
                    .attr('opacity',0.4);

                // xaxis.select('text')
                //     .attr('text-anchor','start');

                xaxis.selectAll('text')
                    .data(labels)
                    // .transition()
                    // .duration(750)
                    .style('text-anchor',function(){
                            if(self.options.xaxisTextTilt)
                                return 'end';
                            else
                                return 'middle';
                        })
                    .attr('transform',function(){
                        if(self.options.xaxisTextTilt)
                        {
                            // console.log('tilting',self.options);
                            return 'rotate('+self.options.xaxisTextTilt+')';// for bar and linebar
                        }
                            return 'rotate(0)';
                    })
                    .attr('fill',function(d,i){
                        if(self.options.labelXInterpolation)
                                {

                                                if(self.options.labelXInterpolation(i)==null)
                                                    return 'transparent';
                                                else
                                                    return 'black';
                                            // return -self.lineChartHeight
                                }

                                return 'black';
                    });

        }
        if(self.options.xname && !update){
            xaxis.append('text')
                .attr('class','x-label')
                .text(self.options.xname)
                .attr('fill','black')
                .attr('transform','translate('+(self.ChartWidth/2)+' , '+(self.margin.bottom)+')' );
        }
        else if(self.options.xname){
             xaxis.select('.x-label')
                .attr('transform','translate('+(self.ChartWidth/2)+' , '+(self.margin.bottom)+')' );
        }
    }
    YAxis(update){

        var self=this;

        if(!update){
            self.svgContainer.append('g')
                                .attr('class','y-axis');

        }
        var yaxis=self.svgContainer.select('.y-axis')
                            // .attr('transform','translate('+self.margin.left +' , '+self.margin.top+')' )
                            .call(d3.axisLeft(self.myYdataScale )
                            .tickSize(-self.ChartWidth) )
                            .attr('font-size',self.textsize+'px');
        yaxis.selectAll('line')
             .attr('x2',function(){
                 if(self.options.ygrid)
                    return self.ChartWidth;
                 else
                    return 0;
             })
        yaxis.selectAll('text')
            .attr('fill','black');
        if(self.options.yname && !update){
            yaxis.append('text')
                .attr('class','y-label')
                .text(self.options.yname)
                .attr('fill','black')
                .attr("text-anchor", "middle")
                .attr('transform','rotate('+-90+') translate('+(-self.ChartHeight/2)+','+(-self.margin.left+self.textsize)+') ');
        }
        else if(self.options.yname){
             yaxis.select('.y-label')
                //    .transition()
                //    .duration(750)
                  .attr('transform','rotate('+-90+') translate('+(-self.ChartHeight/2)+','+(-self.margin.left+self.textsize)+') ');
        }
        yaxis.selectAll('line')
            // .transition()
            //  .duration(750)
            .attr('fill','#aaa')
            .attr('stroke','#aaa')
            .attr('opacity',0.4);
    }
    YAxis1(update){

        var self=this;

        if(!update){
            self.svgContainer.append('g')
                                .attr('class','y-axis1')


        }
        var yaxis1=self.svgContainer.select('.y-axis1')
                                    .attr('transform','translate('+(self.ChartWidth)+','+(0)+')')
                                    // .attr('x',(self.ChartWidth) )
                            // .attr('transform','translate('+self.margin.left +' , '+self.margin.top+')' )
                            .call(d3.axisRight(self.myYdataScale1 )
                            .tickSize(-self.ChartWidth) )
                            .attr('font-size',self.textsize+'px');
        yaxis1.selectAll('line')
             .attr('x2',function(){
                 if(self.options.ygrid)
                    return -self.ChartWidth;
                 else
                    return 0;
             })
        yaxis1.selectAll('text')
            .attr('fill','black');
        if(self.options.yname1 && !update){
            yaxis1.append('text')
                .attr('class','y-label')
                .text(self.options.yname1)
                .attr('fill','black')
                .attr("text-anchor", "middle")
                .attr('transform','rotate('+-90+') translate('+(-self.ChartHeight/2)+','+(self.margin.right/2+self.textsize)+') ');
        }
        else if(self.options.yname1){
             yaxis1.select('.y-label')
                //    .transition()
                //    .duration(750)
                  .attr('transform','rotate('+-90+') translate('+(-self.ChartHeight/2)+','+(self.margin.right/2+self.textsize)+') ');
        }
        yaxis1.selectAll('line')
            // .transition()
            //  .duration(750)
            .attr('fill','#aaa')
            .attr('stroke','#aaa')
            .attr('opacity',0.4);
    }
    activateBarevent(bar){
        var self=this;
            bar.on('mousemove',function(d,i){
                            self.svgContainer.select('#bar'+d.groupno+''+d.index)
                                             .attr('opacity',function(d,i){
                                                 if(self.lineEnabled[d.index])
                                                    return 1;
                                                else
                                                    return 1e-6;
                                             });
                            self.svgContainer.select('#barData'+d.groupno+''+d.index)
                                             .attr('opacity',function(d,i){
                                                 if(self.lineEnabled[d.index])
                                                    return 1;
                                                 else
                                                    return 1e-6;
                                             });

                        })
                            .on('mouseout',function(d,i){
                                self.svgContainer.select('#bar'+d.groupno+''+d.index)// for bar
                                                .attr('opacity',function(d,i){
                                                    if(self.lineEnabled[d.index])
                                                        return 0.7;
                                                    else
                                                        return 1e-6;
                                                });
                                self.svgContainer.select('#barData'+d.groupno+''+d.index)// for bar data aka text
                                                .attr('opacity',function(d,i){
                                                    if(self.lineEnabled[d.index]&&self.options.showBarData)
                                                        return 1;
                                                    else
                                                        return 1e-6;
                                                });

                            })
    }
    removeSvgChildren(){
        d3.select('#'+this.random).select('svg').selectAll('g').remove();
    }

    mathLine(update){
        var self=this;
        var avg,median,mode,mathline,datalines,dataline,datalinevalue,indicatorline,ycoardinates;
        var textlength=[];
        avg=[];
        ycoardinates=[];
        mathline=self.svgContainer.select('.mathline');
        if(!update)
        {
            datalines=mathline.selectAll('.dataline')
                        .data(self.chartData.series)
                         .enter()
                         .append('g')
                         .attr('class','dataline');

             dataline=datalines.append('line');
             datalinevalue=datalines.append('text');
             indicatorline=datalines.append('line').attr('class','indicatorline');
        }
        else{
             datalines=mathline.selectAll('.dataline')
                        .data(self.chartData.series);

             dataline=datalines.select('line');
             datalinevalue=datalines.select('text');
              indicatorline=datalines.select('.indicatorline');

        }
                    dataline
                        .transition()
                        .duration(750)
                         .attr('x1',0)
                         .attr('x2',self.ChartWidth)
                         .attr('y1',function(d,i){
                                avg.push(0);// push last value as zero
                                for(let ii of d)
                                {
                                    avg[i]+=parseInt(ii);
                                }
                                avg[i]/=d.length;
                                // console.log('math line ',d,i,avg);
                                ycoardinates.push( {val:self.myYdataScale(avg[i]),index:i} );
                                return self.myYdataScale(avg[i]);
                            })
                        .attr('y2',function(d,i){

                                return self.myYdataScale(avg[i]);
                            })
                        .attr('stroke',function(d,i){return self.color[i]})
                        .style('stroke-dasharray',('3,3') );
                    ycoardinates.sort(function(a,b){
                        return a.val-b.val;
                    })
                    // console.log("ycoardinates",ycoardinates);
                    for(let j in ycoardinates)
                    {
                        if(parseInt(j)>0)
                        {
                            if(ycoardinates[j].val-ycoardinates[parseInt(j)-1].val<20)
                            {
                                ycoardinates[j].val=ycoardinates[parseInt(j)-1].val+20;
                            }
                        }
                    }
                    datalinevalue.transition()
                        .duration(750)
                        .text(function(d,i){
                                textlength.push((d3.min(self.chartData.series[i]) ).toString().length+(d3.max(self.chartData.series[i])).toString().length+(Math.floor(avg[i]) ).toString().length);
                                return (d3.min(self.chartData.series[i])+' , '+(Math.floor(avg[i]))+' , '+d3.max(self.chartData.series[i]));
                                })
                        .attr('fill','black')
                        .attr('font-size',self.textsize+'px')
                        .attr('transform',function(d,i){
                            var val;
                            for(let j of ycoardinates)
                            {
                                if(j.index==i)
                                {
                                    val=j.val;
                                    break;
                                }
                            }

                        return 'translate('+(self.ChartWidth-(textlength[i]+4)*(self.textsize/2))+','+(val)+')';//avg[i]
                    });

                    indicatorline.transition()
                         .duration(750)
                         .attr('x1',function(d,i){

                             return (self.ChartWidth-(textlength[i]+self.textsize)*(self.textsize/2));
                            } )
                         .attr('x2',function(d,i){
                             return (self.ChartWidth-(textlength[i]+4)*(self.textsize/2))
                            } )
                         .attr('y1',function(d,i){
                                return self.myYdataScale(avg[i]);
                            })
                        .attr('y2',function(d,i){
                                var val;
                                for(let j of ycoardinates)
                                {
                                    if(j.index==i)
                                    {
                                        val=j.val;
                                        break;
                                    }
                                }
                                return val;
                            })
                        .attr('stroke',function(d,i){return self.color[i]})
                        .style('stroke-dasharray',('3,3') );
    }

    legendutility(update){
        var self=this,legend,legendbox,legendtext;

        var legendslength=[],total=0;
        for(let i in self.options.name)
            {
                legendslength.push(self.textLengths.legend[i]+5);// 5 extra length for padding purpose
                total+=legendslength[i];
                legendslength[i]=total;
                self.lineEnabled.push(true);
            }
            // console.log( self.textLengths.legend);
            self.textLengths.legend=[];
        self.svgContainer.select('.legends')
                         .attr('transform','translate('+((self.ChartWidth-total-15*legendslength.length ))+','+(-self.margin.top)+')');//15  because the rectangle is 10X10 so 5 padding
        if(!update){
            legend = self.svgContainer.select('.legends')
                                        .selectAll('.legend')
                                        .data(self.chartData.series)
                                        .enter()
                                        .append('g')
                                        .attr('class', 'legend')
                                        .attr('transform',function(d,i){
                                            if(i==0)
                                                return 'translate('+(0)+','+(0)+')';
                                            return 'translate('+(legendslength[i-1]+15*i )+','+(0)+')';
                                        });
                                        // .attr('transform','translate('+(self.ChartWidth-total*self.textsize)+','+(-5)+')');
            legendbox=legend.append('rect')

            legendtext=legend.append('text')

        }
        else{
            legend = self.svgContainer
                                        .selectAll('.legend')
                                        .data(self.chartData.series)
                                        .attr('transform',function(d,i){
                                            if(i==0)
                                                return 'translate('+(0)+','+(0)+')';

                                            return 'translate('+(legendslength[i-1]+15*i )+','+(0)+')';
                                        });
            legendbox=legend.select('rect');
            legendtext=legend.select('text');

        }

            legendbox
                    .attr('width', '10px')
                    .attr('height', '10px')
                    .style('fill', function(d,i){
                                        return self.color[i];
                                    })
                                    .style('stroke',function(d,i){
                                        // console.log('rect',d);
                                        return self.color[i];
                                    })
                                    // .attr('transform',function(d,i){
                                    //     if(i==0)
                                    //         return 'translate('+0+','+0+')';
                                    //    return 'translate('+legendslength[i-1]*self.textsize+','+0+')';
                                    //     // return 'translate('+self.smallpadding*i+','+0+')'
                                    // })
                                    .on('click',function(d,i){
                                        self.lineEnabled[i]= !self.lineEnabled[i];
                                        var lineData=[];

                                        // if(self.options.type=='linebar')
                                        if(self.options.type=='line'||self.options.type=='Line'||self.options.type=='linebar')
                                        {
                                            if(self.options.type=='line'||self.options.type=='Line')
                                            {
                                                lineData=self.lineEnabled;
                                            }
                                            else{
                                                for(i in self.options.types)
                                                {
                                                    if(self.options.types[i]=='line')
                                                        lineData.push(self.lineEnabled[i])
                                                }
                                            }
                                            if(self.line){
                                                self.line
                                                        .data(lineData)//self.lineEnabled
                                                        .attr('opacity',function(d,i){
                                                            if(d)
                                                                return 1;
                                                            else
                                                                return 1e-6;
                                                        })
                                            }
                                        }
                                        if(self.options.area)
                                        {
                                            if(self.areas){
                                                self.areas
                                                        .data(lineData)//self.lineEnabled
                                                        .attr('opacity',function(d,i){
                                                            if(d)
                                                                return 0.2;
                                                            else
                                                                return 1e-6;
                                                        })
                                            }
                                        }
                                        if(self.barGroup){
                                            var bar=self.barGroup.selectAll('g')
                                                                .data(function(d,j){
                                                                    //   console.log('rect  ',d,j);
                                                                    var data=[];
                                                                    for(let i in self.chartData.series)
                                                                    {
                                                                        if(self.options.type=='bar')
                                                                            data.push({val:self.chartData.series[i][j],index:i,groupno:j });//3 data of 3 line at particular index
                                                                        else if(self.options.type=='linebar')
                                                                        {
                                                                            if(self.options.types[i]=='bar')
                                                                                data.push({val:self.chartData.series[i][j],index:i,groupno:j });//3 data of 3 line at particular index
                                                                        }
                                                                    }
                                                                    //   console.log(data);
                                                                    return data;
                                                                });
                                            bar.select('rect')
                                                    .attr('opacity',function(d,i){
                                                        if(self.lineEnabled[d.index] )
                                                            return 0.7;
                                                        else
                                                            return 1e-6;
                                            })
                                            self.activateBarevent(bar);
                                            bar.select('text')
                                                    .attr('opacity',function(d,i){
                                                        if(self.lineEnabled[d.index] && self.options.showBarData)
                                                            return 1;
                                                        else
                                                            return 1e-6;
                                            })
                                        }
                                        var datalines=self.svgContainer.selectAll('.dataline')
                                        datalines
                                        .data(self.lineEnabled)
                                                .attr('opacity',function(d,i){
                                                        if(d)
                                                            return 1;
                                                        else
                                                            return 1e-6;
                                                    })
                                    });

            legendtext
                             .text(function(d,i){
                                 return self.options.name[i];
                             })
                             .attr('font-size',self.textsize+'px')
                             .attr('fill','black')
                             .attr('transform',function(d,i){
                                //   if(i==0)
                                            return 'translate('+15+','+10+')'
                                    //    return 'translate('+(legendslength[i-1]*self.textsize+14)+','+10+')'
                                        // return 'translate('+((self.smallpadding*i)+14)+','+'10'+')'
                                    });
            // legendbox.enter().appen
    }
    mouseMoveEvent(self,selfEvent,hoverLine,focus,lineChartData,lineColors){
        var coardinates=d3.mouse(selfEvent);
                                // var absolueXCoordinate=d3.event.clientX;//gets absolute coordinate
                                // var svgX=svg1.getBoundingClientRect().width;//  coordianate[0]/1000=need/svgX 1000 because svg width
                                // if(self.options.type=='line'||self.options.type=='Line'){

        hoverLine.attr('x1',coardinates[0])
                .attr('y1',0)
                .attr('x2',coardinates[0])
                .attr('y2',self.ChartHeight+self.margin.bottom/2)
                .attr('stroke','black')
                .style("opacity", 0.6)
                .attr('stroke-width','1px');
        hoverLine.select("line")
                 .style("opacity",0.6);

        //---------------------------------------------------------------------circle highlighter--------------------------------------------------------------------------------------------

        focus.selectAll('circle')
                    .data(lineChartData)//self.chartData.series
                    .attr('transform',function(d,i){
                        var temp=self.myXdataScale.invert(coardinates[0]) ;
                        if(temp-Math.floor(temp)<0.5)
                        {
                            temp=Math.floor(temp);
                        }
                        else{
                            temp=Math.ceil(temp);
                        }
                        if(self.options.type=='linebar')
                            return 'translate('+self.myXdataScale(temp ) +','+self.myYdataScale(lineChartData[i][temp-1])+')';//self.chartData.series[i][temp]
                return 'translate('+self.myXdataScale(temp ) +','+self.myYdataScale(lineChartData[i][temp])+')';//self.chartData.series[i][temp]
            }).style('opacity',1);

        // data given to focus
        var fakedata=[];
            for(let i in lineChartData)// self.chartData.series  // making array of array of data going to table
            {
                var temp=self.myXdataScale.invert(coardinates[0]) ;
                        if(temp-Math.floor(temp)<0.5)
                        {
                            temp=Math.floor(temp);
                        }
                        else{
                            temp=Math.ceil(temp);
                        }
                if(self.options.type=='linebar')
                    fakedata.push([lineColors[i],lineChartData[i][temp-1]  ] )
                else
                    fakedata.push([lineColors[i],lineChartData[i][temp]  ] )
            }

        focus.selectAll('text')
            .data(fakedata)
            .text(function(d,i){
                return d[1];
            })
            // .attr('fill','black')
            .attr('transform',function(d,i){
                var temp=self.myXdataScale.invert(coardinates[0]) ;
                        if(temp-Math.floor(temp)<0.5)
                        {
                            temp=Math.floor(temp);
                        }
                        else{
                            temp=Math.ceil(temp);
                        }
                if(self.options.type=='linebar')
                    return 'translate('+(self.myXdataScale(temp)+9 ) +','+(self.myYdataScale(lineChartData[i][temp-1] )+3 )+')';//self.chartData.series[i][temp]
                return 'translate('+(self.myXdataScale(temp)+9 ) +','+(self.myYdataScale(lineChartData[i][temp] )+3 )+')';//self.chartData.series[i][temp]
            }).style('opacity',1);
    }
}

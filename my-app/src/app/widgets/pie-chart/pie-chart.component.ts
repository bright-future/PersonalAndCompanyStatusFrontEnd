import { Component, OnInit,AfterViewInit,OnDestroy,Input } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
    @Input() data;
    @Input() chartData;
    @Input() options;
    private drawGraph:boolean;
    private prevShowTableValue:boolean;

    //svg global varibles
    private random:any;
    private svgWidth;
    private svgHeight;
    private parentindex;
    private total;
    private margin:any;
    private ChartWidth;
    private ChartHeight;
    private multiDonutMeasurements={
        outerRadius:null,
        innerRadius:null,
        donutWidth:null,
        labelWidth:null
    };
    private textLengths={
        legend:[],
        computedData:[],
    };
    // private update=false;
    //scales
    private myDegree2RadScale;
    private myData2RadScale;

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

    constructor(){
        var temp=Date.now();// to create a unique id
        this.random='multiDonut_id'+temp+Math.floor(Math.random()*100000);
        this.defination={
            pieDefination:null,
            arcDefination:null,
            linefunction:null
        }
        this.drawGraph=true;

    }
    ngOnInit(){
        //     this.color=['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf']


    }

    ngAfterViewInit(){

            this.update(this,false);
            // this.listenWindow();
            this.allow=true;
    }
    ngOnChanges(){
        if(this.allow){
            if(this.options.showTable)
            {
                
                d3.select('#'+this.random).select('#table').style('z-index',8);
                this.removeSvgChildren();
                this.drawGraph=true;
            }
            else if(this.chartData==undefined)// when ever chart data undefined remove svg's children and redraw
            {
                d3.select('#'+this.random).select('#table').style('z-index',-1);
                this.removeSvgChildren()
                this.update(this,false);// false because  drawing empty graph,false redraws the graph
                this.drawGraph=true;// first time after the chartdata is not undefined we have to redraw it
            }
            else{
                    d3.select('#'+this.random).select('#table').style('z-index',-1);
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
            if(this.options.takeImage)
            {
                this.drawImage();
            }
        }

    }
    ngOnDestroy(){
        var self=this;
        window.removeEventListener("resize", function(){self.update(self,true)});
    }
    init(update){
        if(this.chartData==undefined)
        {
            this.chartData={
                series:[]
            }

        }
        //initializing common variables
        d3.select('#'+this.random)
            .style('height',this.options.height+'px');

        this.svgHeight=parseInt(d3.select('#'+this.random).style('height') );

        this.svgWidth=parseInt(d3.select('#'+this.random).style('width') );

        this.margin = {top: 20, right: 20, bottom: 20, left: 20},
        this.ChartWidth=this.svgWidth-this.margin.left-this.margin.right;
        this.ChartHeight=this.svgHeight-this.margin.top-this.margin.bottom;

        //initializing multi donut measurements
        this.multiDonutMeasurements.outerRadius=Math.min(this.ChartHeight/2,this.ChartWidth/2);
        this.multiDonutMeasurements.innerRadius=this.multiDonutMeasurements.outerRadius/(1+this.chartData.series.length);
        this.multiDonutMeasurements.donutWidth=(this.multiDonutMeasurements.outerRadius-this.multiDonutMeasurements.innerRadius)/this.chartData.series.length;
        if(this.chartData.series.length)
            this.multiDonutMeasurements.labelWidth=(this.ChartWidth-2*this.multiDonutMeasurements.outerRadius)/(this.chartData.series[0].length+2)
        else
            this.multiDonutMeasurements.labelWidth=0;

        //initializing scale
        this.myDegree2RadScale = d3.scaleLinear().domain([0, 360]).range([ 0 ,  2*Math.PI ]);// linearly scaled number to pie
        this.myData2RadScale = d3.scaleLinear().domain([this.options.range[0],this.options.range[1] ]).range([ 0 ,  2*Math.PI ]);

        // this.key=function(d,i){return i};

        //colors
        if(this.options.color)
            this.color=this.options.color;
        else
            this.color=['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'];

        // definations
        var self=this;
        this.defination.arcDefination=d3.arc()// arc created to create normal arc no color
                .innerRadius(function(d,i,j,k){
                    if(self.chartData.series.length==0)
                        return 0;
                    return self.multiDonutMeasurements.innerRadius+self.multiDonutMeasurements.donutWidth*(Math.floor(self.parentindex/self.chartData.series[0].length));
                })
                .outerRadius(function(d,i,j){
                    if(self.chartData.series.length==0)
                        return 0
                    return self.multiDonutMeasurements.innerRadius+self.multiDonutMeasurements.donutWidth*(Math.floor(self.parentindex/self.chartData.series[0].length)+1);
                })
                .startAngle(function(d, i) {
                    self.parentindex++;
                    return (d.startAngle);

			    })
                .endAngle(function(d, i) {
                    return (d.endAngle)
                });
        this.defination.pie=d3.pie()
                .sort(null)
                .value(function(d,i){

                    return d;
                });
        this.defination.linefunction= d3.line()
                                        .x(function(d) { return d.x; })
                                        .y(function(d) { return d.y; });
        // global text size
        this.textsize=14;
        // total of each series
        this.total=[];

        for(let i in this.chartData.series)
        {
            var temp=0;
            for(let j in this.chartData.series[i] )
            {
                temp+=parseInt(this.chartData.series[i][j]);
            }
            this.total.push(temp);
        }
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
             self.svgContainer.append('g')//for legend purpose
                         .attr('class','tempclass');

        }
        else{
            self.svgContainer=d3.select('#svg'+self.random)
                                .attr('width',self.svgWidth)
                                .attr('height',self.svgHeight);
        }

        self.svgContainer.select('.tempclass')// temp class to calculate length of text
                        .selectAll('text')
                        .data(self.options.name)
                        .enter()
                        .append('text')
                        .attr('font-size',self.textsize+'px')
                        .text(function(d){return d})
                        .each(function(d,i) {
                        var thisWidth = this.getComputedTextLength();
                        self.textLengths.legend.push(thisWidth)
                        this.remove() // remove them just after displaying them
                    })

    }
    createDonut(update){
        var self=this,drawGraph,donuts,donut,donutdata,pieindex=-1,donutPath,donutindicator;

        if(!update)
        {

            drawGraph=self.svgContainer.append('g')
                                  .attr('class','multidonut')
                                  .attr('transform', "translate("+self.ChartWidth/2+","+self.ChartHeight/2+")" );
            self.svgContainer.append('g')
                             .attr('class','legends');

            donuts=drawGraph.selectAll('.donuts')
                            .data(self.chartData.series)
                            .enter()
                            .append('g')
                            .attr('class','donuts');
        }
        else{

            drawGraph=self.svgContainer.select('.multidonut')
                                        .attr('transform', "translate("+self.ChartWidth/2+","+self.ChartHeight/2+")" );
            donuts=drawGraph.selectAll('.donuts')
                            .data(self.chartData.series);
        }

            pieindex=-1;

            if(!update){
            donut=donuts.selectAll('g')
                        .data(function(d,i){

                            return (self.defination.pie(d) )
                        })
                        .enter()
                         .append('g')
                         .attr('id',function(d,i){
                            if(i==0)
                                {
                                    // console.log(a,i);
                                    pieindex++;
                                }
                            return 'section'+pieindex+''+i;
                        })
                        .attr('class',function(d,i){
                            return 'section';
                        });
            }
            else{
                 donut=donuts.selectAll('g')
                        .data(function(d,i){
                            return (self.defination.pie(d) );
                        });
            }

             pieindex=-1;
            self.parentindex=0;// this 2 variables are defined continuously because no such parameter which gives index of parent
            if(!update){
                 donutPath=donut
                        .append('path');
            }
            else{
                donutPath=donut.select('path');
            }
            pieindex=-1;
            self.parentindex=0;
            donutPath
                        .attr("fill", function(d, i) {
                            return self.color[i%self.color.length];
                        })
                        .attr('stroke','black')
                        .attr('stroke-width','1px')
                        .attr('opacity',0.8)
                        .attr('d',self.defination.arcDefination)
                        .on('mousemove',function(d,i){
                            d3.select(this).attr('opacity',1)

                        })
                        .on('mouseout',function(d,i){
                            d3.select(this).attr('opacity',0.8);
                        });

            pieindex=-1;
            self.parentindex=0;
            if(!update){
                    donutdata=donut.append('text');
            }
            else{
                    donutdata=donut.select('text');
            }

                donutdata
                .text(function(d,i){
                    if(i==0)
                    {
                        pieindex++;
                    }
                    if(self.options.textformat==undefined)
                    return d.value;
                else
                    {
                        var temp=(d.value/self.total[pieindex] )*100;
                        if(temp-Math.floor(temp) <0.5)
                            temp=Math.floor(temp);
                        else
                            temp=Math.ceil(temp);
                        return temp+'%';
                    }
                });

            pieindex=-1;
            self.parentindex=0;
                donutdata
                .attr('text-anchor','middle')
                .attr('fill',function(d,i){
                    if(!self.options.linelabeling)
                        return 'white';
                    else
                        return self.color[i%self.color.length];
                })
                    .attr('transform',function(d,i){
                        if(i==0)
                        {
                            pieindex++;
                        }

                        var temp=self.svgContainer.select('#section'+pieindex+''+i).select('path');
                        var centroid=self.defination.arcDefination.centroid(temp.datum());


                        if(!self.options.linelabeling)
                            return 'translate('+centroid+')';
                        else
                        {
                            return 'translate('+(self.multiDonutMeasurements.outerRadius+self.multiDonutMeasurements.labelWidth*(pieindex+1) )*(self.midAngle(d) < Math.PI ? 1:-1)+','+centroid[1]+')';
                        }

                    });
                pieindex=-1;
                self.parentindex=0;
                if(!update)
                {
                    donutindicator=donut.append('line');
                }
                else{
                    donutindicator=donut.select('line')
                }
                donutindicator
                             .attr('x1',function(d,i){
                                    if(i==0)
                                    {
                                        pieindex++;
                                    }
                                var temp=self.svgContainer.select('#section'+pieindex+''+i).select('path');
                                 var centroid=self.defination.arcDefination.centroid(temp.datum());

                                 return centroid[0];
                             });
                pieindex=-1;
                self.parentindex=0;
                donutindicator
                            .attr('x2',function(d,i){
                                if(i==0)
                                {
                                    pieindex++;
                                }
                            var temp=self.svgContainer.select('#section'+pieindex+''+i).select('path');
                                var centroid=self.defination.arcDefination.centroid(temp.datum());

                                return (self.multiDonutMeasurements.outerRadius+self.multiDonutMeasurements.labelWidth*(pieindex+1) )*(self.midAngle(d) < Math.PI ? 1:-1);
                            //  return centroid[0];
                            });
                pieindex=-1;
                self.parentindex=0;
                donutindicator
                            .attr('y1',function(d,i){
                                if(i==0)
                                {
                                    pieindex++;
                                }
                                var temp=self.svgContainer.select('#section'+pieindex+''+i).select('path');
                                    var centroid=self.defination.arcDefination.centroid(temp.datum());

                                return centroid[1];
                            })
            pieindex=-1;
            self.parentindex=0;
            donutindicator
                            .attr('y2',function(d,i){
                                    if(i==0)
                                    {
                                        pieindex++;
                                    }
                                var temp=self.svgContainer.select('#section'+pieindex+''+i).select('path');
                                var centroid=self.defination.arcDefination.centroid(temp.datum());

                                return centroid[1];
                            })
                            .attr('opacity',function(d,i){
                                if(self.options.linelabeling)
                                    return 0.5;
                                else
                                    return 1e-6;
                            })
                            .attr('stroke','white');

}

    midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }

    listenWindow(){
        var self=this;
        self.update(self,true);
        // window.addEventListener("resize", function(){console.log('executed'),self.update(self,true)});
    }
    update(self,update){

        self.init(update);
        self.createDonut(update);
        self.legendutility(update);

    }
    removeSvgChildren(){

        d3.select('#'+this.random).select('svg').selectAll('g').remove();
    }
    drawImage(){

    }
    // drawImage(){
    //     var svg=document.getElementById('svg'+this.random)
    //     console.log('svg'+this.random);
    //     var svgData = new XMLSerializer().serializeToString( svg );
    //     console.log('svgData ',svgData);
    //     //var canvas = document.createElement( "canvas" );
    //     var canvas = <HTMLCanvasElement>document.getElementById('asdfghcc');;
    //     canvas.width=this.svgWidth;
    //     canvas.height=this.svgHeight;
    //     var ctx=canvas.getContext('2d');
    //     // var img=document.createElement('img');
    //     var img=document.getElementById('asdfgh');

    //     img.setAttribute( "src", "data:image/svg+xml;base64," + btoa( svgData ) );
    //     ctx.drawImage( <HTMLImageElement>img, 0,0,this.svgWidth, this.svgHeight );

    //     var imgsrc="data:image/svg+xml;base64," + btoa( svgData );

    //     // var link=d3.select('#'+this.random).select('a');
    //     var link=d3.select('#'+this.random).select('a');
    //     console.log(link,' canvas  ',canvas.toDataURL('image/png' ) );
    //     link.attr('href',canvas.toDataURL('image/png' ) )
    //     link.attr('target','_blank');

    //     console.log('link ',link);
    //     // link.attr('download', 'svg'+this.random+'.png');
    //     link.attr('download', imgsrc);
    //     // link.click();
    // }

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
                         .attr('transform',function(d,i){
                             var value=(self.ChartWidth-total-15*legendslength.length),lineNumber=1;
                             while(value<0)
                             {
                                value+=self.ChartWidth;
                                lineNumber++;
                             }
                            //  var line= -self.margin.top;
                            //  var index;
                            //  if(value<0)
                            //  {
                            //      for(let i=legendslength.length-1;i>=0;i--)
                            //      {
                            //          if(legendslength[i]+value>0)
                            //          {
                            //             index=i;
                            //             break;
                            //          }
                            //      }
                            //  }
                            // return 'translate('+((value ))+','+(-self.margin.top*lineNumber)+')' } );//15  because the rectangle is 10X10 so 5 padding
                             return 'translate('+(Math.max(self.ChartWidth-total-15*legendslength.length,0 ) )+','+(-self.margin.top)+')' } );//15  because the rectangle is 10X10 so 5 padding
        if(!update){
            legend = self.svgContainer.select('.legends')
                                        .selectAll('.legend')
                                        .data(self.options.name)
                                        .enter()
                                        .append('g')
                                        .attr('class', 'legend')
                                        .attr('transform',function(d,i){
                                            if(i==0)
                                                return 'translate('+(0)+','+(0)+')';
                                            // var index=0;
                                            // var value=legendslength[i-1]+15*i;
                                            // if(value>self.ChartWidth)
                                            // {
                                            //     while(legendslength[i-1]+15*i>self.ChartWidth)
                                            //     {
                                            //         value = legendslength[i-1]+15*i -self.ChartWidth;
                                            //         index++;
                                            //     }
                                            // }
                                            // return 'translate('+(value )+','+(-self.margin.top*index)+')';
                                            return 'translate('+(legendslength[i-1]+15*i )+','+(0)+')';
                                        });
                                        // .attr('transform','translate('+(self.ChartWidth-total*self.textsize)+','+(-5)+')');
            legendbox=legend.append('rect')

            legendtext=legend.append('text')

        }
        else{
            legend = self.svgContainer
                        .selectAll('.legend')
                        .data(self.options.name)
                        .attr('transform',function(d,i){
                            if(i==0)
                                return 'translate('+(0)+','+(0)+')';
                            // var index=0;
                            //                 var value=legendslength[i-1]+15*i;
                            //                 if(value>self.ChartWidth)
                            //                 {
                            //                     while(legendslength[i-1]+15*i>self.ChartWidth)
                            //                     {
                            //                         value = legendslength[i-1]+15*i -self.ChartWidth;
                            //                         index++;
                            //                     }
                            //                 }
                            //                 return 'translate('+(value )+','+(-self.margin.top*index)+')';
                                            // return 'translate('+(legendslength[i-1]+15*i )+','+(0)+')';
                            return 'translate('+(legendslength[i-1]+15*i )+','+(0)+')';
                        });
            legendbox=legend.select('rect');
            legendtext=legend.select('text');

        }

            legendbox
                    .attr('width', '10px')
                    .attr('height', '10px')
                    .style('fill', function(d,i){
                                        return self.color[i%self.color.length];
                                    })
                                    .style('stroke',function(d,i){
                                        // console.log('rect',d);
                                        return self.color[i%self.color.length];
                                    });

            legendtext
                    .text(function(d,i){
                        return self.options.name[i];
                    })
                    .attr('font-size',self.textsize+'px')
                    .attr('fill','white')
                    .attr('transform',function(d,i){
                                return 'translate('+15+','+10+')'
                        });
            // legendbox.enter().appen
    }

}

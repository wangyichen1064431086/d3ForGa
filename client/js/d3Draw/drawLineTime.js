//import {dateParse1} from '../dataManipu/timeManipu.js';
//import dateNumManipu from '../dataManipu/dateNumManipu.js';


class DrawLineTime {

  constructor(data,lineXPro,lineYPro,container) {
    /**
     * @param data:type Obj,处理好了的data(date的type就是date,数据的type为Num)
     * @param lineXPro: type String,想要在x轴表达的值在data中的属性名，Eg：'date'
     * @param lineYPro: type Array[Obj],想要绘出线条的y轴值相关属性，在data中的属性名, Eg:[
    *     { 
            yPro:'clickFromRecommends',
            strokeColor:'blue',
            strokeWidth:'2'
          }, 
          {
            yPro:'clickFromRelatives',
            strokeColor:'red',
            strokeWidth:'2'
          }
        ]
     * @param container:type String,一个d3 Selector，Eg:'.chart'
    */
    this.margin = {};
    this.width = 0;
    this.height = 0;
    this.setSize();
    //console.log(this.margin);
    this.chart;

    const yPros = lineYPro.map(x => {
      return x['yPro'];
    });
    //console.log(`yPros:${yPros}`);
    const scale = this.scaleFunc(data, lineXPro, yPros);//得到scale.x,scale.y
    const axis = this.axisFunc(scale.x, scale.y);//得到axis.xAxis,axis.yAxis

    /*
      const lineClickFromRecommends = this.lineFunc(date, clickFromRecommends);
      const lineClickFromRelatives = this.lineFunc(date, clickFromRelatives);
    */

    this.drawChart(container,this.margin,this.width,this.height);
    this.drawAxis(this.chart, axis.xAxis, axis.yAxis);

    for(let i = 0, len = lineYPro.length; i < len; i++) {
      const onelineYPro = lineYPro[i];
      //console.log(`onelineYPro:${JSON.stringify(onelineYPro)}`);
      const line = this.lineFunc(lineXPro, onelineYPro.yPro, scale.x, scale.y);
      this.drawPath(this.chart, data, line, onelineYPro.strokeColor, onelineYPro.strokeWidth);
      //drawPath(chart,data,line,strokeColor,strokeWidth)
    }


  }

  setSize() {
    this.margin= {
      top:20,
      right: 30,
      bottom: 30,
      left:40
    };
    this.width = 800 - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;
  }


  scaleFunc(data,lineXPro,yPros) {
     //生成x、y轴的scale函数:x、y
    /**
     * @param
     * @param
     * @param yPros
     */
    console.log(d3.extent(data, d => {
      console.log(`lineXpro:${lineXPro}`);
      console.log(`d[lineXPro]:${d[lineXPro]}`);
      return d[lineXPro];
    }));
    const x = d3.scaleTime()
        .rangeRound([0,this.width])
        .domain(d3.extent(data, d => d[lineXPro]));

    const y = d3.scaleLinear()
        .rangeRound([this.height,0])
        .domain([0,d3.max(data, (d) => {
          const yProsValue = [];
          for(const prop in d) {
            if(yPros.indexOf(prop)>=0) {
              yProsValue.push(d[prop]);
            }
          }
          console.log(`yProsValue:${yProsValue}`);
          return d3.max(yProsValue);
        })]);

     return {
       x,
       y
     }
  }

  
  axisFunc (x,y) {
    //x、y轴的axis函数：xAxis、yAxis
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
    return {
      xAxis,
      yAxis
    }
  }


  //折线绘制函数:lineClickFromRecommends等4个
  lineFunc(xProp, yProp,scalex,scaley) {
    /**
     * @param xProp：Type time, 作为x轴的数据属性，eg:date
     * @param yProp: Type number,作为y轴的数据属性，eg:clickFromRecommends
     */
    console.log(`xProp:${xProp}`);
    console.log(`yProp:${yProp}`);
     const line = d3.line()
      .x(d => scalex(d[xProp]))
      .y(d => scaley(d[yProp]));

     return line; 
  }
 
  //绘制绘图区域
  drawChart(container, margin, width, height) {
    this.chart = d3.select(container)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")  
        .attr("transform", "translate("+margin.left+","+margin.top+")");
  }

  //绘制x轴、y轴
  drawAxis(chart, xAxis, yAxis) {
    chart.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + this.height + ")")
    .call(xAxis.ticks(d3.timeDay.every(5)));
    
    chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  }

  //绘制折线
  drawPath(chart,data,line,strokeColor,strokeWidth) {
    /**
     * @param chart
     * @param data
     * @param line
     * @param strokeColor:Type String, 线条颜色，Eg:'steelblue'
     * @param strokeWidth:Type Stirng, 线条粗细，Eg:'2'
     */
    chart.append('path')
      .datum(data)
      .attr('d', line)
      .attr('fill','none')
      .attr('stroke',strokeColor)
      .attr('storke-linejoin','round')
      .attr('stroke-width',strokeWidth);
  }

  /*
  static init() {
    let gaData = JSON.parse(document.getElementById('query-output').value);
    console.info(`gaData: ${gaData}`);

    dateNumManipu(gaData, dateParse1);
    console.info(`gaData: ${gaData}`);

    const d3Els = new Array();
    d3Els.push(new DrawLineTime(
      gaData,
      'date',
      [
         { 
            yPro:'clickFromRecommends',
            strokeColor:'blue',
            strokeWidth:'2'
          }, 
          {
            yPro:'clickFromRelatives',
            strokeColor:'red',
            strokeWidth:'2'
          }
      ],
      '#clickDatasLines'));
      return d3Els;
  }
  */
  
}


export default DrawLineTime;
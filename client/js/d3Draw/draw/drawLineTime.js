
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
    this.chart;

    const yPros = lineYPro.map(x => {
      return x['yPro'];
    });
    const scale = this.scaleFunc(data, lineXPro, yPros);//得到scale.x,scale.y
    const axis = this.axisFunc(scale.x, scale.y);//得到axis.xAxis,axis.yAxis

    this.drawChart(container,this.margin,this.width,this.height);
    this.drawAxis(this.chart, axis.xAxis, axis.yAxis);

    for(let i = 0, len = lineYPro.length; i < len; i++) {
      const onelineYPro = lineYPro[i];
      const line = this.lineFunc(lineXPro, onelineYPro.yPro, scale.x, scale.y);
      this.drawPath(this.chart, data, line, onelineYPro.strokeColor, onelineYPro.strokeWidth);
    }
  }

  setSize() {
    this.margin = {
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


  lineFunc(xProp, yProp,scalex,scaley) {
    /**
     * @dest: 折线绘制函数:lineClickFromRecommends等4个
     * @param xProp：Type time, 作为x轴的数据属性，eg:date
     * @param yProp: Type number,作为y轴的数据属性，eg:clickFromRecommends
     */
     const line = d3.line()
      .x(d => scalex(d[xProp]))
      .y(d => scaley(d[yProp]));

     return line; 
  }


  drawChart(container, margin, width, height) {
    /**
     * @dest: 绘制绘图区域
     */
    this.chart = d3.select(container)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")  
        .attr("transform", "translate("+margin.left+","+margin.top+")");
  }


  drawAxis(chart, xAxis, yAxis) {
    /**
     * @dest:绘制x轴、y轴
     */
    chart.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + this.height + ")")
    .call(xAxis.ticks(d3.timeDay.every(5)));
    
    chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  }


  drawPath(chart,data,line,strokeColor,strokeWidth) {
    /**
     * @dest:绘制折线
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

  
  static init(data) {
  
    new DrawLineTime(
        data,
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
        '#clickDatasLines'
    );
    new DrawLineTime(
        data,
        'date',
        [
          { 
              yPro:'inViewFromRecommends',
              strokeColor:'blue',
              strokeWidth:'2'
            }, 
            {
              yPro:'inViewFromRelatives',
              strokeColor:'red',
              strokeWidth:'2'
            }
        ],
        '#inViewDatasLines'
    );
    new DrawLineTime(
        data,
        'date',
        [
          { 
              yPro:'clickInviewRateFromRecommends',
              strokeColor:'blue',
              strokeWidth:'2'
            }, 
            {
              yPro:'clickInviewRateFromRelatives',
              strokeColor:'red',
              strokeWidth:'2'
            }
        ],
        '#rateDatasLines'
    );
  }
  
}


export default DrawLineTime;
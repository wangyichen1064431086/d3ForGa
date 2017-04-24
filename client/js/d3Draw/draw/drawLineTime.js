
class DrawLineTime {

  constructor(data, lineXPro, lineYPro, axisTextOption, container) {
    /**
     * @param data:type Obj,处理好了的data(date的type就是date,数据的type为Num)
     * @param lineXPro: type String,想要在x轴表达的值在data中的属性名，Eg：'date'
     * @param lineYPro: type Array[Obj],想要绘出线条的y轴值相关属性, Eg:
       [
          { 
            yPro:'clickFromRecommends',//y轴数据在data中的属性名
            strokeColor:'blue',//绘出的线条的颜色
            strokeWidth:'2'//绘出的线条的宽度
          }, 
          {
            yPro:'clickFromRelatives',
            strokeColor:'red',
            strokeWidth:'2'
          }
       ]
     * @param axisTextOption: Type Array[Obj]，关于添加的文字的相关属性，Eg:
       {
         xText:{
            width:,
            height:,
            content:
         },
         yText:{
            width:,
            height:,
            content
         }
       }
     * @param container:type String,一个d3 Selector，Eg:'.chart'
    */

    this.setSize();

    const yPros = lineYPro.map(x => {
      //得到y轴数据在data中的属性名组成的数组，Eg:['clickFromRecommends','clickFromRelatives',...]
      return x['yPro'];
    });
    const scale = this.scaleFunc(data, lineXPro, yPros);//得到scale.x,scale.y
    const axis = this.axisFunc(scale.x, scale.y);//得到axis.xAxis,axis.yAxis

    this.drawChart(container);
    this.drawAxis(this.chart, axis.xAxis, axis.yAxis);

    for(let i = 0, len = lineYPro.length; i < len; i++) {
      const onelineYPro = lineYPro[i];
      const line = this.lineFunc(lineXPro, onelineYPro.yPro, scale.x, scale.y);
      this.drawPath(this.chart, data, line, onelineYPro.strokeColor, onelineYPro.strokeWidth);
    }
    this.drawAxisText(this.chart, axisTextOption);
  }

  setSize() {
    /**
     * @use: produce the properties this.margin、this.width、this.height
     * @return: nothing
     */
    this.margin = {
      top:20,
      right: 30,
      bottom: 60,
      left:80
    };
    this.width = 800 - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;
  }


  scaleFunc(data, lineXPro, yPros) {
    /**
     * @dest: 生成x、y轴的scale函数:x、y
     * @param data:Type Array，就是作为数据材料的data，即constructor的参数data
     * @param lineXPro:Type String, 就是构造函数中的lineXPro,即想要在x轴表达的值在data中的属性名，Eg：'date'
     * @param yPros:Type Array, y轴数据（想要绘制的）在data中的属性名组成的数组，Eg:['clickFromRecommends','clickFromRelatives',...]
     * @return:Type Obj ,with two properties:x,y
     */
    const x = d3.scaleTime()
        .rangeRound([0, this.width])
        .domain(d3.extent(data, d => d[lineXPro]));

    const y = d3.scaleLinear()
        .rangeRound([this.height, 0])
        .domain([0, d3.max(data, (d) => {
          //先找到单个datum中想要绘制的属性们中的最大值(a)，再找到所有data的想绘制属性的最大值(a)的最大值(b)。

          const yProsValue = [];//存放单个datum中位于yPros中的属性名，目的是为了找出这些属性中所有data中的最大值
          for(const prop in d) {
            if(yPros.indexOf(prop)>=0) {
              yProsValue.push(d[prop]);
            }
          }
          return d3.max(yProsValue);
        })]);

     return {
       x,
       y
     }
  }

  
  axisFunc (x,y) {
    /**
     * @dest: 生成x、y轴的axis函数：xAxis、yAxis
     * @param x: Type scale func, x轴scale函数:x, Eg：scale.x
     * @param y: Type scale func, y轴scale函数:y, Eg: scale.y
     * @return: Type Obj, with two properties: xAxis, yAxis
    */
    
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
    return {
      xAxis,
      yAxis
    }
  }


  lineFunc(xProp, yProp,scalex,scaley) {
    /**
     * @dest: 生成折线绘制函数:lineClickFromRecommends等4个
     * @param xProp：Type time, 作为x轴的数据的属性名，eg:date
     * @param yProp: Type number,作为y轴的数据的属性名，eg:clickFromRecommends
     * @return: Type func line,即生成的折线绘制函数line
     */
     const line = d3.line()
      .x(d => scalex(d[xProp]))
      .y(d => scaley(d[yProp]));

     return line; 
  }


  drawChart(container) {
    /**
     * @dest: 绘制绘图区域, 生成this.chart
     * @param container: Type String,即constractor的参数container，即一个d3 Selector，Eg:'.chart'
     * @return: nothing
    */
    this.chart = d3.select(container)
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")  
        .attr("transform", "translate("+this.margin.left+","+this.margin.top+")")
        .classed('chart', true);
  }


  drawAxis(chart, xAxis, yAxis) {
    /**
     * @dest:绘制x轴、y轴
     * @param chart:Type d3 Selection, 要绘制x轴/y轴的基础元素
     * @param xAxis:Type d3Obj xAxis
     * @param yAxis:Type d3Obj yAxis
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
     * @param chart:d3 Selection, Eg：this.chart
     * @param data:Type Array，就是作为数据材料的data，即constructor的参数data
     * @param line:Type d3fun:line
     * @param strokeColor:Type String, 线条颜色，Eg:'steelblue'
     * @param strokeWidth:Type Stirng, 线条粗细，Eg:'2'
    */
    chart.append('path')
      .datum(data)
      .attr('d', line)
      .style('fill','none')
      .style('stroke',strokeColor)
      .style('storke-linejoin','round')
      .style('stroke-width',strokeWidth);
  }

  drawAxisText(chart, axisTextOption) {
    /**
     * @dest: add some text to the chart
     * @param chart:Type d3 Selection, 要绘制x轴/y轴的基础元素,Eg: this.chart
     * @param option: Type Object, contains the value of attributes of the text
     * //@param option.x: Type String(Number with Quots) or Number, x attribute of text
     * //@param option.y: Type String(Number with Quots) or Number, y attribute of text
     * //@param option.with: Type  String(Number with Quots) or Number, width attribute of text
     * //@param option.height: Type  String(Number with Quots) or Number, height attribute of text
     * @param option.content:Type String, the innerHTML of text
     * @return nothing
    */
    if(axisTextOption.xText) {
      const xText = axisTextOption.xText;
      chart.append('text')
      .attr('width', xText.width)
      .attr('height', xText.height)
      .attr('transform', `translate(${this.width-xText.width}, ${this.height+40})`)
      .html(xText.content)
      .classed('axis-text', true);
    }

    if(axisTextOption.yText) {
      const yText = axisTextOption.yText;
      chart.append('text')
        .attr('width', yText.width)
        .attr('height', yText.height)
        .attr('transform', `translate(${-yText.height-40}, ${yText.width+5}) rotate(-90) `)
        .html(yText.content)
        .classed('axis-text', true);
    }
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
        {
          xText:{
              width: 100,
              height: 20,
              content:'Date'
          },
          yText:{
              width: 150,
              height: 20,
              content: 'Click Events'
          }
        },
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
        {
          xText:{
              width: 100,
              height: 20,
              content:'Date'
          },
          yText:{
              width: 150,
              height: 20,
              content: 'Inview Events'
          }
        },
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
        {
          xText:{
              width: 100,
              height: 20,
              content:'Date'
          },
          yText:{
              width: 200,
              height: 20,
              content: 'Click Events/Inview Events'
          }
        },
        '#rateDatasLines'
    );
  }
  
}


export default DrawLineTime;

class DrawLineTime {

  constructor(data, xPro, yPro, axisTextOption, container) {
    /**
     * @param data:type Obj,处理好了的data(date的type就是date,数据的type为Num)
     * @param xPro: type Obj,data中想要在x轴表达的字段的相关信息,Eg：
         {
           name:'date',//字段属性名
         }
     * @param yPro: type Array[Obj],data中想要在y轴表达的字段的相关信息, Eg:
       [
          { 
            name:'clickFromRecommends',//字段属性名
            color:'blue',//绘出的线条和圆点的颜色
            strokeWidth:'2'//绘出的线条的宽度
            circleR:3//绘出的数据圆点的半径
          }, 
          {
            name:'clickFromRelatives',
            color:'red',
            strokeWidth:'2',
            circleR:3
          }
       ]
     * @param axisTextOption: Type Array[Obj]，关于添加的文字的相关属性，Eg:
       {
         xText:{
            width:200,//Type Number,文字块宽度
            height:20,//Type Number,文字块高度
            content:'Date',//Type String,文字内容字符串
         },
         yText:{
            width:,
            height:,
            content
         }
       }
     * @param container:type String,一个d3 Selector，Eg:'.chart'
    */

    this.setSize();//得到this.margin, this.width, this.height
    this.data = data;
    this.axisTextOption = axisTextOption;

    const xProName = xPro.name;
    const yProNames = yPro.map(item => {
      //得到y轴数据在data中的属性名组成的数组，Eg:['clickFromRecommends','clickFromRelatives',...]
      return item['name'];
    });
    const scale = this.scaleFunc(xProName, yProNames);//得到scale.x,scale.y
    this.scale = scale;//需要在多个方法上多次复用的变量，以类的属性的形式传入，而非以方法参数形式传入

    const axis = this.axisFunc();//得到axis.xAxis,axis.yAxis,QUEST：直接在方法中得到this.属性，还是返回值在constructor里面赋给this.属性
    this.axis = axis;

    const transition = this.transitionFunc();
    this.transition = transition;

    this.drawChart(container);//产生this.chart

    this.drawAxis();

    for(let i = 0, len = yPro.length; i < len; i++) {
      const onelineYPro = yPro[i];
      const yProName = onelineYPro.name;
      const color = onelineYPro.color;
      const strokeWidth = onelineYPro.strokeWidth;
      const circleR= onelineYPro.circleR;
      const line = this.lineFunc(xProName, yProName);
      this.drawPath(line, color, strokeWidth);
      const circles = this.drawCircleOfPath(xProName, yProName, color, circleR);
      this.addDataTagTrigger(circles, xProName, yProName);
    }
    this.drawAxisText();
  }

  setSize() {
    /**
     * @dest: produce the properties this.margin、this.width、this.height
     * @return: nothing
     */
    this.margin = {
      top:20,
      right: 80,
      bottom: 60,
      left:80
    };
    this.width = 1000 - this.margin.left - this.margin.right,
    this.height = 300 - this.margin.top - this.margin.bottom;
  }


  scaleFunc(xProName, yProNames) {
    /**
     * @dest: 生成x、y轴的scale函数:x、y
     * @rely data:Type Array，就是作为数据材料的data，即constructor的参数data
     * @param xProName:Type String, 就是构造函数中的lineXPro,即想要在x轴表达的值在data中的属性名，Eg：'date'
     * @param yProNames:Type Array, y轴数据（想要绘制的）在data中的属性名组成的数组，Eg:['clickFromRecommends','clickFromRelatives',...]
     * @return:Type Obj ,with two properties:x,y
     */
    const x = d3.scaleTime()
        .rangeRound([0, this.width])
        .domain(d3.extent(this.data, d => d[xProName]));

    const y = d3.scaleLinear()
        .rangeRound([this.height, 0])
        .domain([0, d3.max(this.data, (d) => {
          //先找到单个datum中想要绘制的属性们中的最大值(a)，再找到所有data的想绘制属性的最大值(a)的最大值(b)。

          const yProsValue = [];//存放单个datum中位于yPros中的属性名，目的是为了找出这些属性中所有data中的最大值
          for(const prop in d) {
            if(yProNames.indexOf(prop)>=0) {
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

  
  axisFunc () {
    /**
     * @dest: 生成x、y轴的axis函数：xAxis、yAxis
     * @rely:this.scale
     * @return: Type Obj, with two properties: xAxis, yAxis
    */
    
    const xAxis = d3.axisBottom(this.scale.x);
    const yAxis = d3.axisLeft(this.scale.y);
    return {
      xAxis,
      yAxis
    }
  }


  lineFunc(xPropName, yPropName) {
    /**
     * @dest: 生成折线绘制函数:lineClickFromRecommends等4个
     * @rely: this.scale.x, this.scale.y
     * @param xProp：Type time, 作为x轴的数据的属性名，eg:date
     * @param yProp: Type number,作为y轴的数据的属性名，eg:clickFromRecommends
     * @return: Type func line,即生成的折线绘制函数line
     */
     const line = d3.line()
      .x(d => this.scale.x(d[xPropName]))
      .y(d => this.scale.y(d[yPropName]));

     return line; 
  }


  transitionFunc() {
    const t = d3.transition()
        .duration(2000)//设置过渡的持续时间，单位ms
        .ease(d3.easeCubic);//设置过渡的缓动函数，也可以是d3.easeCubic(默认)
    return t;
  }

  drawChart(container) {
    /**
     * @dest: 绘制绘图区域, 生成this.chart
     * @param container: Type String,即constractor的参数container，即一个d3 Selector，Eg:'.chart'
     * @return: nothing,但是得到了this.chart
    */
    this.chart = d3.select(container)
        .html(null)
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")  
        .attr("transform", "translate("+this.margin.left+","+this.margin.top+")")
        .classed('chart', true);
  }


  drawAxis() {
    /**
     * @dest:绘制x轴、y轴
     * @rely this.chart:Type d3 Selection, 要绘制x轴/y轴的基础元素
     * @rely this.axis.xAxis:Type d3Obj xAxis
     * @rely this.axis.yAxis:Type d3Obj yAxis
     */
    this.chart.append("g")
      .attr("class","x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.axis.xAxis.ticks(d3.timeDay));
      //.call(this.axis.xAxis.ticks(d3.timeDay.every(5)));
    
    this.chart.append("g")
      .attr("class", "y axis")
      .call(this.axis.yAxis);
  }


  drawPath(line,strokeColor,strokeWidth) {
    /**
     * @dest:绘制折线
     * @rely this.chart:d3 Selection, Eg：this.chart
     * @rely this.data:Type Array，就是作为数据材料的data，即constructor的参数data
     * @param line:Type d3fun:line
     * @param strokeColor:Type String, 线条颜色，Eg:'steelblue'
     * @param strokeWidth:Type Stirng, 线条粗细，Eg:'2'
    */

    this.chart.append('path')
      .datum(this.data)
      .attr('d', line)
     
      .style('fill','none')
      .style('storke-linejoin','round')
      .style('stroke',strokeColor)
      .style('stroke-width',0)
      .transition(this.transition)//一前一后两种状态之间的过渡
      .style('stroke-width',strokeWidth); 
  }

  drawCircleOfPath(xProName, yProName, color, r) {
    /**
     * @dest: 绘制折线上的圆点
     * @param xProp：Type time, 作为x轴的数据的属性名，eg:date
     * @param yProp: Type number,作为y轴的数据的属性名，eg:clickFromRecommends
     * @param color
     * @param r
     * @return circles: Type d3 selections
    */
    const circles = this.chart.append('g')
      .selectAll("circle")
      .data(this.data)
    .enter().append("circle")

    circles.attr("cx", d => this.scale.x(d[xProName]))
      .attr("cy", d => this.scale.y(d[yProName]))
      .style('fill', color)
      .attr("r",0)
      .transition(this.transition)
      .attr("r",r);
    
    return circles;
  }

  addDataTagTrigger(circles, xProName, yProName) {
    /**
     * @dest:为折线上转折处的圆点添加触发数据信息标签的事件
     * @param circles: Type d3 selections
     * @param xProName
     * @param yProName
     */

      /*
      const triggerBlock = this.chart.append('rect')
                .classed('triggerBlock',true)
                .attr('height',50)
                .attr('width',200)
                .style('stroke','gray')
                .style('fill','#ddd')
                .style('display','none');
      */
      const triggerText =  this.chart.append('text')
            .classed('triggerText',true)
            //.style('stroke','green')
            .style('display','none');
   
      circles.on('mouseover', function(d, i, nodes) {
        
        //MARK:nodes[i]既不是文档对象模型的HTMLElement、也不是d3模型的d3.selection
        console.log(d3.mouse(nodes[i]));
        const coordinates = d3.mouse(nodes[i]);//获取对应点相对于container的坐标

        const datumInfo = `${yProName}:${d[yProName]}`;
        
        triggerText.attr('transform', `translate(${coordinates[0]-80},${coordinates[1]+25})`)
            .html(datumInfo)
            .style('display','block');
        
        /*
         triggerBlock.attr('transform', `translate(${coordinates[0]},${coordinates[1]})`)
           .style('display','block');
        */
      });

      circles.on('mouseout', function(d, i, nodes) {
        //triggerBlock.style('display','none');
        triggerText.style('display','none');
      })
  }

  drawAxisText() {
    /**
     * @dest: add some text to the chart
     * @rely this.chart:Type d3 Selection, 要绘制x轴/y轴的基础元素,Eg: this.chart
     * @rely this.axisTextOption: Type Object, contains the value of attributes of the text
     * @return nothing
    */
    if(!this.axisTextOption){
      return;
    }
    if(this.axisTextOption.xText) {
      const xText = this.axisTextOption.xText;
      this.chart.append('text')
      .attr('width', xText.width)
      .attr('height', xText.height)
      .attr('transform', `translate(${this.width-xText.width}, ${this.height+40})`)
      .html(xText.content)
      .classed('axis-text', true);
    }

    if(this.axisTextOption.yText) {
      const yText = this.axisTextOption.yText;
      this.chart.append('text')
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
        {
          name:'date'
        },
        [
          { 
              name:'clickFromRecommends',
              color:'blue',
              strokeWidth:'2',
              circleR:3
            }, 
            {
              name:'clickFromRelatives',
              color:'red',
              strokeWidth:'2',
              circleR:3
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
        {
          name:'date'
        },
        [
          { 
              name:'inViewFromRecommends',
              color:'blue',
              strokeWidth:2,
              circleR:3
            }, 
            {
              name:'inViewFromRelatives',
              color:'red',
              strokeWidth:2,
              circleR:3
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
        {
          name:'date'
        },
        [
          { 
              name:'clickInviewRateFromRecommends',
              color:'blue',
              strokeWidth: 2 ,
              circleR:3
            }, 
            {
              name:'clickInviewRateFromRelatives',
              color:'red',
              strokeWidth: 2,
              circleR:3
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

  static drawDoubleClickRequest(data) {
    new DrawLineTime(
        data,
        {
          name:'date'
        },
        [
          { 
              name:'successRequestRate',
              color:'blue',
              strokeWidth: 2 ,
              circleR:3
            }
            /*, 
              {
                name:'failRequestRate',
                color:'red',
                strokeWidth: 2,
                circleR:3
              }
            */
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
              content: 'Rate'
          }
        },
        '#rateDatasLines'
    );
  }
  
}


export default DrawLineTime;
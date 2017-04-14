function drawFromData (data,container) {
  /**
   * @param data:type Obj,处理好了的data(date的type就是date,数据的type为Num)
   * @param container:type String,一个d3 Selector，Eg:'.chart'
   */
  const margin = {
    top:20,
    right: 30,
    bottom: 30,
    left:40
  },
  width = 800 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  //x、y轴的scale函数:x、y
  const x = d3.scaleTime()
      .rangeRound([0,width])
      .domain(d3.extent(data, d => d.date));

  const y = d3.scaleLinear()
      .rangeRound([height,0])
      .domain([0,d3.max(data, (d) => {
        return d3.max(
          d3.values(d).filter(
            (x) => {
              return typeof x === 'number'
            }
        )
        );
      })]);

  
 
  //x、y轴的axis函数：xAxis、yAxis
  const xAxis = d3.axisBottom(x);

  const yAxis = d3.axisLeft(y);

  //折线绘制函数:lineClickFromRecommends等4个
  const lineClickFromRecommends = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.clickFromRecommends)); 

  const lineClickFromRelatives = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.clickFromRelatives));

  const lineInViewFromRecommends = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.inViewFromRecommends));

  const lineInViewFromRelatives = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.inViewFromRelatives));

  //绘制绘图区域
  const chart = d3.select(container)
      .attr("width",width + margin.left + margin.right)
      .attr("height",height + margin.top + margin.bottom)
    .append("g")  
      .attr("transform", "translate("+margin.left+","+margin.top+")");


  //绘制x轴、y轴
  chart.append("g")
  .attr("class","x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis.ticks(d3.timeDay));
  
  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  //绘制4条折线
  chart.append('path')
    .datum(data)
    .attr('d', lineClickFromRecommends)
    .attr('fill','none')
    .attr('stroke','steelblue')
    .attr('storke-linejoin','round')
    .attr('stroke-width','2');
  
  chart.append('path')
    .datum(data)
    .attr('d', lineClickFromRelatives)
    .attr('fill','none')
    .attr('stroke','red')
    .attr('storke-linejoin','round')
    .attr('stroke-width','2');

  chart.append('path')
    .datum(data)
    .attr('d', lineInViewFromRecommends)
    .attr('fill','none')
    .attr('stroke','green')
    .attr('storke-linejoin','round')
    .attr('stroke-width','2');

  chart.append('path')
    .datum(data)
    .attr('d', lineInViewFromRelatives)
    .attr('fill','none')
    .attr('stroke','pink')
    .attr('storke-linejoin','round')
    .attr('stroke-width','2');
  
}


export default drawFromData;
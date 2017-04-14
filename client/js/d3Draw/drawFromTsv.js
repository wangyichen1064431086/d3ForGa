const margin = {
  top:20,
  right: 30,
  bottom: 30,
  left:40
},
width = 800 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

/** 3.x版的写法
 * var x = d3.scale.ordinal()
    .rangeRoundPoints([0, width],1.0);
 */
/** 4.x版的写法
 * const x = d3.scalePoint()
    .rangeRound([0, width])
    .padding(1.0);
 */
//改为scaleTime:
const x = d3.scaleTime()
    .rangeRound([0,width]);

/** 3.x版写法
 * var y = d3.scale.linear()
    .range([height,0]);
 */
const y = d3.scaleLinear()
    .rangeRound([height,0]);


/** 3.x版写法：
 * var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
 */
const xAxis = d3.axisBottom(x);




/** 3.x版写法
 * var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
 */
const yAxis = d3.axisLeft(y);


/** 3.x版本写法：
   * var line = d3.svg.line()//4.0中直接是d3.line()
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.clickFromRecommends);
      });
   */
const line = d3.line()//4.0中直接是d3.line()
    .x(d => x(d.date))
    .y(d => y(d.clickFromRecommends)); 

const chart = d3.select(".chart")
    .attr("width",width + margin.left + margin.right)
    .attr("height",height + margin.top + margin.bottom)
  .append("g")  
    .attr("transform", "translate("+margin.left+","+margin.top+")");


function drawFromTsv (tsvFile,container,typefunc) {//tsvFile可以为'dataForDraw/storyRecommendData.tsv',typefunc可以为type,container可以为chart
  d3.tsv(tsvFile, typefunc, (error,data) => {
    //在4.x版中d3.tsv属于d3-request

    x.domain(d3.extent(data, d => d.date));//d.date必须是数值或time，timeParse后得到的是time，而timeFormat后得到的是string
    y.domain([0,d3.max(data, (d) => {
      return d.clickFromRecommends;
    })]);
  
    
    container.append("g")
      .attr("class","x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis.ticks(d3.timeDay));
    
    container.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    container.append('path')
      .datum(data)
      .attr('d', line)
      .attr('fill','none')
      .attr('stroke','steelblue')
      .attr('storke-linejoin','round')
      .attr('stroke-width','2');
  });
}

function type(d) {
  const parse = d3.timeParse('%m%d');
  //const format = d3.timeFormat('%m-%d');
  d.date = parse(d.date);
  d.clickFromRecommends = +d.clickFromRecommends;
  return d;
}
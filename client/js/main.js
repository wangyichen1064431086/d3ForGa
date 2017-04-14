import {dateParse1} from './dataManipu/timeManipu.js';
import dateNumManipu from './dataManipu/dateNumManipu.js';
import drawFromData from './d3Draw/drawFromData.js';
import DrawLineTime from './d3Draw/drawLineTime.js';

document.getElementById('startDraw').addEventListener("click",function() {
  let gaData = JSON.parse(document.getElementById('query-output').value);
  console.info(`gaData: ${gaData}`);

  dateNumManipu(gaData, dateParse1);
  console.info(`gaData: ${gaData}`);

  drawFromData(gaData, '#allLines');

  new DrawLineTime(
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
      '#clickDatasLines'
  );
}, false);




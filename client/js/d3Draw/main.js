//import {dateParse1} from '../dataManipu/timeManipu.js';
//import dateNumManipu from '../dataManipu/dateNumManipu.js';
import {dateParse1} from './dataManipuForDraw/timeManipu.js';
import dateNumManipu from './dataManipuForDraw/dateNumManipu.js';
import {dataAdd_RateOf2Pro} from './dataManipuForDraw/dataAddCompuPro.js';
import drawFromData from './draw/drawFromData.js';
import DrawLineTime from './draw/drawLineTime.js';

let gaData = JSON.parse(document.getElementById('query-output').value);

dateNumManipu(gaData, dateParse1);
//drawFromData(gaData, '#allLines');

dataAdd_RateOf2Pro(gaData,'clickFromRecommends','inViewFromRecommends','clickInviewRateFromRecommends');

dataAdd_RateOf2Pro(gaData,'clickFromRelatives','inViewFromRelatives','clickInviewRateFromRelatives');

function clickToDraw() {
  document.getElementById('startDraw').addEventListener("click",function() {
  
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
    new DrawLineTime(
        gaData,
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
        gaData,
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
  }, 

false);
}

export default clickToDraw;


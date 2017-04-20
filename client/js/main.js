import {dateParse1} from './dataManipu/timeManipu.js';
import dateNumManipu from './dataManipu/dateNumManipu.js';
import {dataAdd_RateOf2Pro} from './dataManipu/dataAddCompuPro.js';
import drawFromData from './d3Draw/drawFromData.js';
import DrawLineTime from './d3Draw/drawLineTime.js';
//import queryReports from './getGaData/getGaData.js';
//document.querySelector('.g-signin2').setAttribute('data-onsuccess','queryReports');

  document.getElementById('startDraw').addEventListener("click",function() {

  let gaData = JSON.parse(document.getElementById('query-output').value);
  console.info(`gaData: ${gaData}`);

  dateNumManipu(gaData, dateParse1);
  console.info(`gaData: ${gaData}`);


  drawFromData(gaData, '#allLines');

  dataAdd_RateOf2Pro(gaData,'clickFromRecommends','inViewFromRecommends','clickInviewRateFromRecommends');

  dataAdd_RateOf2Pro(gaData,'clickFromRelatives','inViewFromRelatives','clickInviewRateFromRelatives');
  
  //用于得到数据后端进行t test:
  const rateFromRecommends = [];
  const rateFromRelatives = [];

  for(let i = 0, len = gaData.length; i < len; i++) {
    const oneGaData = gaData[i];
    rateFromRecommends.push(oneGaData.clickInviewRateFromRecommends);
    rateFromRelatives.push(oneGaData.clickInviewRateFromRecommends);
  }

  console.log(`rateFromRecommends:${rateFromRecommends}`);
  console.log(`rateFromRelatives:${rateFromRelatives}`);
  //console.log(`gaData[0]['date']:${gaData[0]['date']}`);
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




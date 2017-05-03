import {dateParse1} from './dataManipuForDraw/timeManipu.js';
import dateNumManipu from './dataManipuForDraw/dateNumManipu.js';
import {dataAdd_RateOf2Pro} from './dataManipuForDraw/dataAddCompuPro.js';
//import drawFromData from './draw/drawFromData.js';
import DrawLineTime from './draw/drawLineTime.js';


function clickToDraw() {
 
  document.getElementById('startDraw').addEventListener("click", function() {
    let gaData = JSON.parse(document.getElementById('query-output').value);
    if (typeof gaData !== 'object') {
      console.log(`No right gaData`);
      return;
    }
    dateNumManipu(gaData, dateParse1);
    //drawFromData(gaData, '#allLines');

    /*
    dataAdd_RateOf2Pro(gaData,'clickFromRecommends','inViewFromRecommends','clickInviewRateFromRecommends');

    dataAdd_RateOf2Pro(gaData,'clickFromRelatives','inViewFromRelatives','clickInviewRateFromRelatives');
    */
    dataAdd_RateOf2Pro(gaData,'success','request','successRequestRate');
    dataAdd_RateOf2Pro(gaData,'fail','request','failRequestRate');
    console.log(gaData);
    //DrawLineTime.init(gaData);//Class中的静态方法也是可以传参数的//
    DrawLineTime.drawDoubleClickRequest(gaData);
  }, 

  false);
}

export default clickToDraw;


import {dateParse1} from './dataManipuForDraw/timeManipu.js';
import dateNumManipu from './dataManipuForDraw/dateNumManipu.js';
import {dataAdd_RateOf2Pro} from './dataManipuForDraw/dataAddCompuPro.js';
import DrawLineTime from './draw/drawLineTime.js';


function draw(gaData) {
   /**
    * @param gaData:Type Array, 已经完全处理好了的ga数据
    */
    if (typeof gaData !== 'object') {
      console.log(`No right gaData`);
      return;
    }
    dateNumManipu(gaData, dateParse1);

    /*
    dataAdd_RateOf2Pro(gaData,'clickFromRecommends','inViewFromRecommends','clickInviewRateFromRecommends');

    dataAdd_RateOf2Pro(gaData,'clickFromRelatives','inViewFromRelatives','clickInviewRateFromRelatives');
    */
    dataAdd_RateOf2Pro(gaData,'success','request','successRequestRate');
    dataAdd_RateOf2Pro(gaData,'fail','request','failRequestRate');
    //DrawLineTime.init(gaData);//Class中的静态方法也是可以传参数的//
    DrawLineTime.drawDoubleClickRequest(gaData);
}

/*
function clickToDraw() {
 
  document.getElementById('startDraw').addEventListener("click", 
  draw, 
  false);
}
*/
export default draw;


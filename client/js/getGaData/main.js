// 在reportRequests文件夹下创建一个新的reportRequests文件（Eg:inStoryRecommends）,该文件export default reportRequests。这里引入该文件中的reportRequests
//import reportRequests from './reportRequests/inStoryRecommends.js';//a
import reportRequests from './reportRequests/doubleClickRequests';
import dataManipuForShow from './dataManipuForShow/main.js';
import draw from '../d3Draw/main.js';

function getGaData() {
  /**
   * @usage: Query the API and print the results to the page.
  */
  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    body: {
      reportRequests
    }
  }).then(displayResults, console.error.bind(console));
}

function displayResults(response) {
  /**
   * @usage: display the raw data, deal the raw data, and display the  dealed data
   * @param response: the response of gapi request
  */

  /// 在response-rawdata区域展示raw data：response.result
  //document.getElementById('response-rawdata').value = JSON.stringify(response.result);
  
  /// 处理每个reports，得到每个reports的数据集
  const pickupOneReportData = dataManipuForShow.pickupOneReportData;
  /* Eg:(a)
    const dataForClickFromRecommends = pickupOneReportData(response,0,2,'date',0,'clickFromRecommends');
    const dataForClickFromRelatives =  pickupOneReportData(response,1,2,'date',0, 'clickFromRelatives');
    const dataForInviewFromRecommends =  pickupOneReportData(response,2,3,'date',0,'inViewFromRecommends');
    const dataForInviewFromRelatives =  pickupOneReportData(response,3,3,'date',0,'inViewFromRelatives');  
  */
  const dataForRequset = pickupOneReportData(response,0,0,'date',0,'request');
  const dataForSuccess =  pickupOneReportData(response,1,0,'date',0, 'success');
  const dataForFail =  pickupOneReportData(response,2,0,'date',0,'fail');

  /// 合并每个reports的数据集，得到最终结果数据集
  const mergeData = dataManipuForShow.mergeData;
  const mergedResult = mergeData(
    [
      dataForRequset,
      dataForSuccess,
      dataForFail
    ],
    'date'
  ); 
  /* Eg:(a)
    const mergedResult = mergeData(
      [
        dataForClickFromRecommends,
        dataForClickFromRelatives,
        dataForInviewFromRecommends,
        dataForInviewFromRelatives
      ],
      'date'
    ); 
  */

  /// 展示结果数据集
  const formattedResult = JSON.stringify(mergedResult);
  //document.getElementById('query-output').value = formattedResult; 
  console.log(mergedResult);
  /// 绘制数据chart
  draw(mergedResult);
}


export default getGaData;
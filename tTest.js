const ttest = require('ttest');
const jsdom = require('jsdom');

/*
jsdom.env(
  "./.tmp/index.html",
  //["http://code.jquery.com/jquery.js"],
  *
  function(err,window) {
    let gaData = window.JSON.parse(window.document.getElementById('query-output').value);

  const dateParse1 = d3.timeParse('%Y%m%d');

    function dateNumManipu(data,dateManipu) {
      /**
       * @param:data, type JSON String, Eg:gaData其中有一个字段为date要转换为日期，其他字段要转换为数字
       * @param:dateManipu:type Func, timeparse func, Eg:dateParse1,which is from timeManipu.js
       

      for(let i = 0, len = data.length; i < len; i++) {
        for(let prop in data[i]) {
          //console.log(`prop:${prop}`);
          if (prop === 'date') {
            data[i][prop] = dateManipu(data[i][prop]);
          } else {
            data[i][prop] = +(data[i][prop]);
            //console.log(`data[${i}][${prop}]:${data[i][prop]}`);
          }
        }
      }
    }

    function dataAdd_RateOf2Pro (data,pro1,pro2,newRatePro) {
      for(let i = 0, len = data.length; i < len; i++) {

        if(typeof data[i][pro1] !== 'number') {
          data[i][pro1] = +data[i][pro1];
        }
        if(typeof data[i][pro2] !== 'number') {
          data[i][pro2] = +data[i][pro2];
        }
        data[i][newRatePro] = data[i][pro1]/data[i][pro2];
        console.log(`data[${i}][${newRatePro}]:${data[i][newRatePro]}`);
      
      }
    }

  dateNumManipu(gaData, dateParse1);

  dataAdd_RateOf2Pro(gaData,'clickFromRecommends','inViewFromRecommends','clickInviewRateFromRecommends');

  dataAdd_RateOf2Pro(gaData,'clickFromRelatives','inViewFromRelatives','clickInviewRateFromRelatives');

  const rateFromRecommends = [];
  const rateFromRelatives = [];

  for(const i = 0, len = gaData.length; i < len; i++) {
    const oneGaData = gaData[i];
    rateFromRecommends.push(oneGaData.clickInviewRateFromRecommends);
    rateFromRelatives.push(oneGaData.push(oneGaData.clickInviewRateFromRecommends));
  }
*/
  const rateFromRecommends = [0.01171766375483042,0.010789659834707784,0.011832134882821428,0.0134301542147028,0.013968792682422085,0.014268872338036602,0.010672743350792463,0.010990767499552441,0.009987056539389303,0.017605980131798957,0.0166326232856726,0.012743289538079284,0.012029718738657323,0.012405814749980973,0.009330004446116489,0.00932733945420143,0.00974794157544402,0.010806701798720043,0.012291801445191285,0.01377805335673965,0.01822388403381616,0.015577127493278308,0.013968215795907733,0.014071898606944858,0.01483932956122558,0.014965772904693721,0.011316376617581437,0.012628572894311584,0.010781563393327158,0.009028210644843463,0.00956443065787773,0.01416153359046687,0.011386927806877705];
  const rateFromRelatives = [0.01171766375483042,0.010789659834707784,0.011832134882821428,0.0134301542147028,0.013968792682422085,0.014268872338036602,0.010672743350792463,0.010990767499552441,0.009987056539389303,0.017605980131798957,0.0166326232856726,0.012743289538079284,0.012029718738657323,0.012405814749980973,0.009330004446116489,0.00932733945420143,0.00974794157544402,0.010806701798720043,0.012291801445191285,0.01377805335673965,0.01822388403381616,0.015577127493278308,0.013968215795907733,0.014071898606944858,0.01483932956122558,0.014965772904693721,0.011316376617581437,0.012628572894311584,0.010781563393327158,0.009028210644843463,0.00956443065787773,0.01416153359046687,0.011386927806877705];
  const ttestResult = ttest(rateFromRecommends, rateFromRelatives);

  console.log(ttestResult.valid());
  console.log(ttestResult.testValue());
  console.log(ttestResult.pValue());  
  /*}
)
*/


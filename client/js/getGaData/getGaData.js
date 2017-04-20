 // Replace with your view ID.
  const VIEW_ID = '10995661';
  const dataRange1 =  [//该字段至少有一个有效条目,默认为{"startDate": "7daysAgo", "endDate": "yesterday"}
    {
      startDate: '2017-03-15',//'2017-04-01',
      endDate: '2017-04-16',//'2017-04-01'
    }
  ];
  const dataRange2 = [
    {
      startDate:'2017-03-20',
      endDate:'2017-04-19'
    }
  ];
  // Query the API and print the results to the page.
  function queryReports() {
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          /**构建reportRequests对象。
           * batchGet 方法最多接受五个 ReportRequest 对象。
           * 所有请求都应该有相同的 dateRange、viewId、segments、samplingLevel 和 cohortGroup。
          */
        
          {/// 1.得到(Event Category)In Story Recommend  (EventAction)002click_fromRecommends|002click_fromRelatives
            viewId: VIEW_ID,//有效数据视图ID
            /*
            dateRanges: [//该字段至少有一个有效条目,默认为{"startDate": "7daysAgo", "endDate": "yesterday"}
              {
                startDate: '2017-03-15',//'2017-04-01',
                endDate: '2017-04-16',//'2017-04-01'
              }
            ],
            */
            dateRanges:dataRange1,
            metrics: [//该字段中至少有一个有效条目
              {
                expression: 'ga:totalEvents'
              }
            ],
            dimensions:[
              {
                name:'ga:eventCategory'
              },
              {
                name:'ga:eventAction'
              },
              {
                name:'ga:date'
              }
            ],
            dimensionFilterClauses:[
              {
                filters: [ 
                  {
                    dimensionName: 'ga:eventCategory',
                    operator: 'EXACT',//	The value should match the match expression entirely(完全匹配expressions)
                    expressions: ['In Story Recommend'],
                    caseSensitive:true//是否区分大小写？默认为false
                  },  
                ]
              },
            ]
           
          },
          {/// 2.得到(Event Category)story (Event Action)In view (Event Label)from_recommends|from_relatives
            viewId: VIEW_ID,//有效数据视图ID
            dateRanges:dataRange1,
            metrics: [//一系列定量测定方法，每个request中至少有一个测定方法，最多有10个测定方法
              {
                expression: 'ga:totalEvents',//测定方法的表达式
                //alias:'',//an alternate name for the expression.
                formattingType:'INTEGER'//Specifies how the metric expression should be formatted
              }
            ],
            dimensions:[//就是每个数据的属性，每个数据最多可以有7个属性（即7个dimensions）
              {
                name:'ga:eventCategory'
              },
              {
                name:'ga:eventAction'
              },
              {
                name:'ga:eventLabel'
              },
              {
                name:'ga:date'
              }
            ],
            dimensionFilterClauses:[//用于过滤dimension的数组，项目之间的逻辑是AND
              {
                operator:'OR',//指明怎样组合filters,默认就是'OR',可为'OR'或'AND'
                filters:[//一组过滤器，根据上述operator的值来决定怎样组合
                  {
                    dimensionName:'ga:eventCategory',//待过滤的dimension名称
                    operator:'EXACT',//指明怎样将dimensinoName和expression匹配，默认是REGEXP(即正则匹配)，'EXACT'是完全相等
                    expressions:'story',//Strings or regular expression to match against. Only the first value of the list is used for comparison unless the operator is IN_LIST(为数组或字符串或正则。只有当operator为'IN_LIST'时，整个数组才有用；operator如果不为'IN_LIST',那么只有数组的第一项有用)
                  }
                ]
              },
              {
                 filters:[
                   {
                      dimensionName:'ga:eventAction',
                      operator:'EXACT',
                      expressions:'In View',
                    }
                  ]
              },
              {
                filters:[
                  {
                    dimensionName:'ga:eventLabel',
                    operator:'IN_LIST',
                    expressions:['from_recommends','from_relatives'],
                  }
                ]
              }
            ]
           
          }
          /*
          {
            viewId: VIEW_ID,//有效数据视图ID
            dateRanges:dataRange2,
            metrics: [//该字段中至少有一个有效条目
              {
                expression: 'ga:totalEvents'
              }
            ],
            dimensions:[
              {
                name:'ga:eventCategory'
              },
              {
                name:'ga:eventAction'
              },
              {
                name:'ga:date'
              }
            ],
            dimensionFilterClauses:[
              {//1.得到(Event Category)In Story Recommend  (EventAction)002click_fromRecommends|002click_fromRelatives
                operator:'AND',
                filters: [ 
                  {
                    dimensionName: 'ga:eventCategory',
                    operator: 'EXACT',//	The value should match the match expression entirely(完全匹配expressions)
                    expressions: ['Story Recommend'],
                    caseSensitive:true//是否区分大小写？默认为false
                  }, 
                  {
                    dimensionName: 'ga:eventAction',
                    operator: 'EXACT',//	The value should match the match expression entirely(完全匹配expressions)
                    expressions: ['Seen-002'],
                    caseSensitive:true//是否区分大小写？默认为false
                  } 
                ]
              },
            ]
           
          }
          */
        ]
      }
    }).then(displayResults, console.error.bind(console));
  }

  function displayResults(response) {
    /*
      var gaData = {
        dates:[],
        clickFromRecommends:[],
        clickFromRelatives:[],
        inViewFromRecommends:[],
        inViewFromRelatives:[]
      };
    */
    document.getElementById('response-rawdata').value = JSON.stringify(response.result);
    /*
    var gaData = [];
    var inViewData = response.result.reports[0].data.rows;
    var dates = [];
    for (i = 0, len = inViewData.length;i<len; i++) { //循环30次
      var gaDatum = {
        date:'',
        inViewFromRecommends:'',
      };
      gaDatum.date = inViewData[i].dimensions[2];
      gaDatum.inViewFromRecommends = inViewData[i].metrics[0].values[0];
      gaData.push(gaDatum);
    }
    document.getElementById('query-output').value = JSON.stringify(gaData);
    */
    
    const gaData = [];
    const clickData = response.result.reports[0].data.rows;
    const inViewData = response.result.reports[1].data.rows;
    
    //得到日期数组
    const dates = [];
    for (let i = 0, len = clickData.length;i<len; i++) { //循环24次
      var date = clickData[i].dimensions[2];
      if(dates.indexOf(date) < 0) {
        dates.push(date);//最终dates长度为12
      }
    }

    //根据日期数组得到每个日期的数据对象
    for(let i = 0,len = dates.length;i<len;i++) {//循环12次
      
      const gaDatum = {
        date:'',
        clickFromRecommends:'',
        clickFromRelatives:'',
        inViewFromRecommends:'',
        inViewFromRelatives:''
      };
      gaDatum.date = dates[i];


      for(let j = 0, l = clickData.length; j < l; j++ ) { //循环24次
        const clickDatum = clickData[j];
          /** clickDatum长这样：
              {
                  "dimensions": [
                    "In Story Recommend",
                    "Click-002from_recommends",
                    "20170401"
                  ],
                  "metrics": [
                    {
                      "values": [
                        "1052"
                      ]
                    }
                  ]
              }
          */
        if(clickDatum.dimensions[2] === dates[i]) {
          const clickValue = clickDatum.metrics[0].values[0];
          if(clickDatum.dimensions[1] === 'Click-002from_recommends') {
            gaDatum.clickFromRecommends = clickValue;
          } else if(clickDatum.dimensions[1] === 'Click-002from_relatives') {
            gaDatum.clickFromRelatives = clickValue;
          }
        }
      }
     
      for (let j = 0,l = inViewData.length; j < l; j++) { //循环24次
          const inViewDatum = inViewData[j];
          /** inViewDatum长这样：
              {
                "dimensions": [
                  "story",
                  "In View",
                  "from_recommends",
                  "20170401"
                ],
                "metrics": [
                  {
                    "values": [
                      "97347"
                    ]
                  }
                ]
              }
          **/
          if(inViewDatum.dimensions[3] === dates[i]) {
            var inViewValue = inViewDatum.metrics[0].values[0];
            if(inViewDatum.dimensions[2] === 'from_recommends') {
              gaDatum.inViewFromRecommends = inViewValue;
            } else if(inViewDatum.dimensions[2] === 'from_relatives') {
              gaDatum.inViewFromRelatives = inViewValue;
            }
          }
      }  

      if(gaDatum.date && gaDatum.clickFromRecommends && gaDatum.clickFromRelatives && gaDatum.inViewFromRecommends && gaDatum.inViewFromRelatives) {
        gaData.push(gaDatum);
      }
    }

    console.log(gaData);
    const formattedJson = JSON.stringify(gaData);
    document.getElementById('query-output').value = formattedJson; 
  }

  function dealResponse(rawData,rawFields,dealedFields) {
    /**
     * @param rawData:Type Array, Eg:response.result.reports[0].data.rows
     * @param usefulFields: Type Array,Eg：[dimensions[2], metrics[0].values[0]]
     * @param dealedFileds: Type Array, Eg: ['date','inViewFromRecommends']
     */
    const dealedData = [];
  
    if(rawFields.length== dealedFields.length) {
      console.log(`The rawFields.length is not equal to dealedFields.length`);
      return dealedData;//[]
    }
    for (const i = 0; i < rawData.len; i++) { 
      const dealedDatum = {};
      const rawDatum = rawData[i];
      for(const [index,elem] of rawFields) {
        dealedDatum[dealedFields[index]] = rawDatum.elem;
      }
      dealedData.push(dealedDatum);
    }
    return dealedData;
  }


 
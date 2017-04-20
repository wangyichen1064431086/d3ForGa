const got = require('got');
//FTChinese Google Analytics相关信息：
/**
 * Tracking ID:'UA-1608715-1'
 * CLIENT_ID： '166811704494-d8tthgqdg7fs56ou745c8br1cp2a4gqi.apps.googleusercontent.com'（从[Google API Console(Google API控制台)](https://console.developers.google.com/apis/dashboard?project=rising-study-162207&duration=P2D)获取）
 */
got(
  'https://analyticsreporting.googleapis.com/v4/reports:batchGet',
  {
      body: {
        reportRequests: [
          /**构建reportRequests对象。
           * batchGet 方法最多接受五个 ReportRequest 对象。
           * 所有请求都应该有相同的 dateRange、viewId、segments、samplingLevel 和 cohortGroup。
           */
          {
            viewId: '10995661',//有效数据视图ID
            dateRanges: [//该字段至少有一个有效条目,默认为{"startDate": "7daysAgo", "endDate": "yesterday"}
              {
                startDate: '2017-03-15',//'2017-04-01',
                endDate: '2017-04-16',//'2017-04-01'
              }
            ],
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
            viewId: '10995661',//有效数据视图ID
            dateRanges: [//每个Request至多可以有两个dateRange,该字段至少有一个,默认为{"startDate": "7daysAgo", "endDate": "yesterday"}
              {
                startDate: '2017-03-15',
                endDate: '2017-04-16'
              }
            ],
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
        ]
      }
  }
).then(response => {
  console.log(response.body);
}).catch(error => {
  console.log(error.response.body);
});

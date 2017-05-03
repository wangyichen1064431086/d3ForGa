const VIEW_ID = '10995661';

const dataRange1 = [//该字段至少有一个有效条目,默认为{"startDate": "7daysAgo", "endDate": "yesterday"}
  {
    startDate: '7daysAgo',//'2017-04-01',
    endDate: 'yesterday',//'2017-04-01'
  }
];

const reportRequests =  [
  /**构建reportRequests对象。
   * batchGet 方法最多接受五个 ReportRequest 对象。
   * 所有请求都应该有相同的 dateRange、viewId、segments、samplingLevel 和 cohortGroup。
  */

  {/// 1.得到(Event Category)In Story Recommend  (EventAction)002click_fromRecommends
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
      /*
      {
        name:'ga:eventCategory'
      },
      {
        name:'ga:eventAction'
      },
      */
      {
        name:'ga:date'
      }
    ],
    dimensionFilterClauses:[
      {
        operator:'AND',
        filters: [ 
          {
            dimensionName: 'ga:eventCategory',
            operator: 'REGEXP',//	The value should match the match expression entirely(完全匹配expressions)
            expressions: ['\\([0-6]+\\)$'],
            caseSensitive:true//是否区分大小写？默认为false
          }, 
          {
            dimensionName:'ga:eventAction',
            operator:'EXACT',
            expressions:['Request'],
            caseSensitive:true
          } 
        ]
      },
    ]
  },
  {/// 2.得到(Event Category)In Story Recommend  (EventAction)002click_fromRelatives
    viewId: VIEW_ID,
    dateRanges:dataRange1,
    metrics: [
      {
        expression: 'ga:totalEvents'
      }
    ],
    dimensions:[
      /*
      {
        name:'ga:eventCategory'
      },
      {
        name:'ga:eventAction'
      },
      */
      {
        name:'ga:date'
      }
    ],
    dimensionFilterClauses:[
      {
        operator:'AND',
        filters: [ 
          {
            dimensionName: 'ga:eventCategory',
            operator: 'REGEXP',//	The value should match the match expression entirely(完全匹配expressions)
            expressions: ['\\([0-6]+\\)$'],
            caseSensitive:true//是否区分大小写？默认为false
          }, 
          {
            dimensionName:'ga:eventAction',
            operator:'BEGINS_WITH',
            expressions:['Success'],
            caseSensitive:true
          } 
        ]
      },
    ]
  },
  {/// 3.得到(Event Category)story (Event Action)In view (Event Label)from_recommends
    viewId: VIEW_ID,//有效数据视图ID
    dateRanges:dataRange1,
    metrics: [
      {
        expression: 'ga:totalEvents',
        formattingType:'INTEGER'
      }
    ],
    dimensions:[
      /*
      {
        name:'ga:eventCategory'
      },
      {
        name:'ga:eventAction'
      },
      */
      {
        name:'ga:date'
      }
    ],
    dimensionFilterClauses:[//用于过滤dimension的数组，项目之间的逻辑是AND
      {
        operator:'AND',//指明怎样组合filters,默认就是'OR',可为'OR'或'AND'
        filters:[//一组过滤器，根据上述operator的值来决定怎样组合
          {
            dimensionName:'ga:eventCategory',
            operator:'REGEXP',
            expressions:'\\([0-6]+\\)$',
            caseSensitive:true
          },
          {
            dimensionName:'ga:eventAction',
            operator:'EXACT',
            expressions:'Fail',
            caseSensitive:true
          }
        ]
      }
    ]
  }
];

export default reportRequests;
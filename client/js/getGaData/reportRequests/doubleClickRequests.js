const VIEW_ID = '10995661';

const dataRange1 = [
  {
    startDate: '2017-04-07',
    endDate: '2017-05-07',
  }
];

const reportRequests = 
 [

  {
    viewId: VIEW_ID,

    dateRanges:dataRange1,
    metrics: [
      {
        expression: 'ga:totalEvents'
      }
    ],
    dimensions:[
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
            operator: 'REGEXP',
            expressions: ['\\([0-6]+\\)$'],
            caseSensitive:true
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
  {
    viewId: VIEW_ID,
    dateRanges:dataRange1,
    metrics: [
      {
        expression: 'ga:totalEvents'
      }
    ],
    dimensions:[
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
            operator: 'REGEXP',
            expressions: ['\\([0-6]+\\)$'],
            caseSensitive:true
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
  {
    viewId: VIEW_ID,
    dateRanges:dataRange1,
    metrics: [
      {
        expression: 'ga:totalEvents',
        formattingType:'INTEGER'
      }
    ],
    dimensions:[
      {
        name:'ga:date'
      }
    ],
    dimensionFilterClauses:[
      {
        operator:'AND',
        filters:[
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
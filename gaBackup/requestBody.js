{
  reportRequests: [

    {
      viewId: '10995661',
      dateRanges: [
        {
          startDate: '2017-03-15',
          endDate: '2017-04-16'
        }
      ],
      metrics: [
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
              operator: 'EXACT',
              expressions: ['In Story Recommend'],
              caseSensitive:true
            },  
          ]
        },
      ]
      
    },
    {
      viewId: '10995661',
      dateRanges: [
        {
          startDate: '2017-03-15',
          endDate: '2017-04-16'
        }
      ],
      metrics: [
        {
          expression: 'ga:totalEvents',
          formattingType:'INTEGER'
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
          name:'ga:eventLabel'
        },
        {
          name:'ga:date'
        }
      ],
      dimensionFilterClauses:[
        {
          operator:'OR',
          filters:[
            {
              dimensionName:'ga:eventCategory',
              operator:'EXACT',
              expressions:'story'
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
  
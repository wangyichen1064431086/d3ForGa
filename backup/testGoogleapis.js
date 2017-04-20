const google = require('googleapis');
const got = require('got');
/*1. Create a service client */
const analyticsreporting = google.analyticsreporting('v4');


/*2. Authorizing and authenticating */
/**2.1 Generating an authentication URL
 **/
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  /*以下信息来自https://console.developers.google.com/apis/credentials/oauthclient/166811704494-d8tthgqdg7fs56ou745c8br1cp2a4gqi.apps.googleusercontent.com?project=rising-study-162207*/
  '166811704494-d8tthgqdg7fs56ou745c8br1cp2a4gqi.apps.googleusercontent.com',//YOUR_CLIENT_ID,
  'lVbWlTyLJB-Jd8t9V8tm2Uu-',//YOUR_CLIENT_SECRET,
  'http://localhost:8080/oauth2callback'//YOUR_REDIRECT_URL
);//oauth2Client就相当于简单模式中的API key

const scopes = [
  'https://www.googleapis.com/auth/analytics.readonly'
];

const url = oauth2Client.generateAuthUrl({
  //'online' (default) or 'offline' (gets refresh_toke)
  access_type:'online',

  // If you only need one scope you can pass it as a string
  scope:scopes
});
console.log('url:'+url);
/**2.2 Retrieve authorization code（获取授权代码）**/
//Once a user has given permissions on the consent page, Google will redirect the page to the redirect URL you have provided with a code query parameter.(一旦用户在同意页面上给予允许，Google就会重定向到你设置的redirect URL，并在其后加上一个代码查询参数)
//最终这个URL长的类似这样:https://developers.google.com/oauthplayground/?code=4/LAqlGCRvR3Pqr8gPxodSDV4rKX4351DaAuBXJuHxVY0#
const code = (window.location.search.substr(1).split('='))[1];

/**2.3 Retrieve access token（获取访问令牌）**/
const accessToken = '';
const refreshToken = '';
oauth2Client.getToken(code, function (err, tokens) {
  // Now tokens contains an access_token and an optional refresh_token. Save them.
  
  if (!err) {
    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;
    oauth2Client.setCredentials(tokens);
    console.log(tokens);
  } else {
    console.log(err);
  }
});

/**2.4 Setting global or service-level auth**/
// set auth as a global 
google.options({
  auth: oauth2Client
});
console.log(oauth2Client);

// Setting a service-level auth option
/** 
  const analyticsreporting = google.analyticsreporting({
    version:'v4',
    auth: oauth2Client
  });
*/

/**2.5 Making authenticated requests(发起认证请求）**/
// Retrieve tokens via token exchange explained above or set them:

oauth2Client.setCredentials({
  access_token:accessToken,
  refresh_token:refreshToken,
  expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7)//失效时间，Optional,单位ms
});

analyticsreporting.reports.batchGet(
  {//Parameters for request
    //auth:oauth2Client,
    resource:{// request body
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
  },
  function(err, res) {//The callback that handles the response
    if(!err) {
      console.log(res);
    } else{
      console.log(err);
    }
  }
)


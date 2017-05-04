import {draw, resultData} from './d3Draw/main.js';

document.getElementById('query-output').value = JSON.stringify(resultData);

draw();

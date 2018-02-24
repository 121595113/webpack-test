require('../css/app.css');
require('../css/test.scss');

console.log($.fn);

// 图片
let img1 = document.createElement('img');
img1.src = require('../images/small.png');
document.body.appendChild(img1);

let img2 = document.createElement('img');
img2.src = require('../images/big.png');
document.body.appendChild(img2);

var index = require('../data/data_index.js')

// 主页二手获得新数据
function getData2(){
  return index.index;
}


// 更新数据
function getNext(){
  return index.index;
}


module.exports.getData2 = getData2;
module.exports.getNext = getNext;
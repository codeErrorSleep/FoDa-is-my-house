
// 商品信息
var index = require('../data/data_index.js')
// 用户信息
var allUsers=require('../data/user_data.js')
// 主页二手获得新数据
function getData2(){
  return index.index;
}


// 更新数据
function getNext(){
  return index.index;
}

// 获取详细的商品信息
function getPostData(post_id){
  // console.log(post_id)
  // console.log(index.index.data)
  // 跨类型对比
  var postData=index.index.data.find(s => s.post_id ==post_id)
  return postData;
}

// 获取详细的用户信息
function getUserData(user_id){
  var userData=allUsers.userData.data.find(s => s.user_id ==user_id)
  // console.log(userData)
  return userData
}

module.exports.getData2 = getData2;
module.exports.getNext = getNext;
module.exports.getPostData = getPostData;
module.exports.getUserData = getUserData;

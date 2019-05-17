
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
function getGoodsData(goods_id){
  console.log(goods_id)
  console.log(index.index.data)

  
  var goodsData=index.index.data.find(s => s.goods_id ==goods_id);
  console.log(goodsData)
  return goodsData;
}

// 获取详细的用户信息
function getUserData(user_id){
  var userData={}
  userData=allUsers.userData.data.find(function (x) {
    return x.user_id===user_id
})
  return userData
}

module.exports.getData2 = getData2;
module.exports.getNext = getNext;
module.exports.getGoodsData = getGoodsData;
module.exports.getUserData = getUserData;

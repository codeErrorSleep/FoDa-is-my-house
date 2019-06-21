
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

//在云数据库上查找数据(查找10条)
function nextLoad(database, that, limit) {
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 500
  })
  const db = wx.cloud.database()
  //查询所有用户的闲置二手信息
  db.collection(database)
    .where({
      "_openid": db.RegExp({
        regexp: limit,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })})
    .orderBy('date', 'desc')
    .skip(that.data.nextPage)
    .limit(10) // 限制返回数量为 10 条
    .get({
      //成功读取写入数据
      success: res => {
        that.setData({
          //feed: JSON.stringify(res.data, null, 2)
          //feed:res.data
          feed: that.data.feed.concat(res.data),
          nextPage: that.data.nextPage + 10
        })
        console.log('[数据库] [查询记录] 成功: ', that.data.feed)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
  wx.showToast({
    title: '加载成功',
    icon: 'success',
    duration: 1000
  })
}

module.exports.getData2 = getData2;
module.exports.getNext = getNext;
module.exports.getPostData = getPostData;
module.exports.getUserData = getUserData;
module.exports.nextLoad = nextLoad;
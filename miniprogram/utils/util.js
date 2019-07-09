var app = getApp()


// 获取用户是否已经注册
function getUserInCloud(openid){
  const db = wx.cloud.database()
  db.collection('users').where({
    _openid: openid,
  })
  .get({
    success: function(res) {
      // res.data 是包含以上定义的两条记录的数组
      // 读取第一个数据(后期修改用户上传只能上传一次,修改)
      app.globalData.userCloudData=res.data[0]
      console.log(app.globalData.userCloudData)

    }
  })
}

// 判断是否为注册用户
function isRegistered(){
  // 判断当前用户是否为以注册用户
  if(!app.globalData.userCloudData.approve){
  wx.navigateTo({
    url: '../../Mine/registered/registered?show=true'
  })
  } 
  else{
    return true
  }

}





//在云数据库上查找数据(查找10条)
function dbLoad(database, that, limit) {
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 500
  })
  var tempFeed = that.data.feed
  var tempNextPage = that.data.nextPage 
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
          feed: tempFeed.concat(res.data),
          nextPage: tempNextPage + 10
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


// 传入日期变转换为  "yyyy-mm-dd" 形式
function getDate(date){
  var dateY = date.getFullYear() + '-';
  var dateM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var dateD = date.getDate() + ' ';
  date=dateY+dateM+dateD;
  return date
}






// // 将时间戳转换为 具体时间 yyyy-mm-dd hh:mm
// function getDeadLine(date){
//   var date = new Date(date);
//   Y = date.getFullYear() + '-';
//   M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
//   D = date.getDate() + ' ';
//   h = date.getHours() + ':';
//   m = date.getMinutes();
//   date=Y+M+D+h+m
//   return date
// }

module.exports.getDate = getDate;
module.exports.dbLoad = dbLoad;
module.exports.getUserInCloud = getUserInCloud;
module.exports.isRegistered=isRegistered;
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

      // 判断 如果是未注册并且未填写信息的用户,将approve设置为0
      if(res.data.length==0){
        app.globalData.userCloudData={}
        app.globalData.userCloudData.approve="0"
        app.globalData.userCloudData._openid=openid
        console.log(app.globalData.userCloudData._openid  )
        console.log(app.globalData.userCloudData.approve)
      }
      else{
        app.globalData.userCloudData=res.data[0]
        console.log(app.globalData.userCloudData)
      }

    }
  })
}

// 判断是否为注册用户
function isRegistered(){
  // 判断当前用户是否为以注册用户
  // if(!app.globalData.userCloudData.approve){
    // Object.keys(app.globalData.userCloudData.approve)
  if(app.globalData.userCloudData.approve==="0"){
    wx.redirectTo({
      url: '../../Mine/registered/registered?show=true'
    })
  }
  else if(!app.globalData.userCloudData.approve){
    wx.redirectTo({
      url: '../../Mine/userInfo/userInfo?show=true'
    })
  }
  else{
    return true
  }

}

//在云数据库上查找所有数据
function allLoad(that) {
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 500
  })
  var tempFeed = that.data.feed
  var tempNextPage = that.data.nextPage
  const db = wx.cloud.database()
  //查询所有用户的闲置二手信息
  db.collection(that.data.database)
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

//在云数据库上查找指定用户数据(查找10条)
function userLoad(that) {
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 500
  })
  var tempFeed = that.data.feed
  var tempNextPage = that.data.nextPage 
  const db = wx.cloud.database()
  //查询所有用户的闲置二手信息
  db.collection(that.data.database)
    .where({
      "_openid": that.data.user_openid
      })
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

//在云数据库上查找用户接收数据(查找10条)
function accLoad(that) {
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 500
  })
  var tempFeed = that.data.feed
  var tempNextPage = that.data.nextPage
  const db = wx.cloud.database()
  //查询所有用户的闲置二手信息
  db.collection(that.data.database)
    .where({
      "accepter_openid": that.data.user_openid
    })
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



//统计数据库未接单数量
function countUnAcc(that, limit){
  const db = wx.cloud.database()
  const _ = db.command
  db.collection(that.data.database).where({
    accepter_openid: _.eq(''),
    _openid: db.RegExp({
      regexp: limit,
      options: 'i',
    })
  }).count({
    success: function(res) {
      that.setData({
        count: res.total
      })
    }
  })
}

// 判断读取是否已接单的数据
function accUnAccLoad(that,limit){
  if (that.data.count >= that.data.feed.length){
    this.unAccItem(that,limit)
  }
  if(that.data.count <= that.data.feed.length){
    this.accItem(that,limit)
  }
}


//读取数据库未接单的数据
function unAccItem(that,limit){
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    })
    var tempFeed=that.data.feed
    var tempNextPage = that.data.nextPage
    const db = wx.cloud.database()
    const _ = db.command
  db.collection(that.data.database).where({
      accepter_openid: _.eq(''),
      _openid: db.RegExp({
        regexp: limit,
        options: 'i',
      })
    })
    .orderBy('date', 'desc')
    .skip(that.data.nextPage)
    .get({
      success: function(res) {
        that.setData({
          feed: tempFeed.concat(res.data),
          nextPage: tempNextPage + 10
        })
        console.log('[数据库] [查询记录] 成功 feed: ', that.data.feed)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    wx.showToast({
      title: '加载成功',
      icon: 'success',
      duration: 1000
    })
}

//读取数据库已接单的数据
function accItem(that,limit){
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    })
    var tempaccFeed=that.data.accFeed
    var tempNextPage1 = that.data.nextPage1
    const db = wx.cloud.database()
    const _ = db.command
  db.collection(that.data.database).where({
      accepter_openid: _.neq(''),
      _openid: db.RegExp({
        regexp: limit,
        options: 'i',
      })
    })
    .orderBy('date', 'desc')
    .skip(that.data.nextPage1)
    .limit(10)
    .get({
      success: function(res) {
        that.setData({
          accFeed: tempaccFeed.concat(res.data),
          nextPage1: tempNextPage1 + 10
        })
        console.log('[数据库] [查询记录] 成功 accFeed: ', that.data.accFeed)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    wx.showToast({
      title: '加载成功',
      icon: 'success',
      duration: 1000
    })
}


// 查找发现的帖子(分开 寻物 与 找队友)
function discoverLoad(type, that) {
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 500
  })
  var tempFeed = that.data.feed
  var tempNextPage = that.data.nextPage
  const db = wx.cloud.database()
  //查询所有用户的闲置二手信息
  db.collection("discover")
    .where({
      "_openid": that.data.user_openid,
      "type": type,
    })
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


module.exports.discoverLoad = discoverLoad;
module.exports.getDate = getDate;
module.exports.allLoad = allLoad;
module.exports.userLoad = userLoad;
module.exports.accLoad = accLoad;
module.exports.getUserInCloud = getUserInCloud;
module.exports.isRegistered=isRegistered;
module.exports.countUnAcc=countUnAcc;
module.exports.unAccItem=unAccItem;
module.exports.accItem=accItem;
module.exports.accUnAccLoad=accUnAccLoad;
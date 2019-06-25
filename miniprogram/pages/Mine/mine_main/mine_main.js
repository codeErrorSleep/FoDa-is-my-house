const app = getApp()

Page({
  data: {
    // 判断是否为管理员
    admin:"false",

    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    // 判断是否显示管理员页面
    if(app.globalData.userCloudData.admin){
      this.setData({
        admin:true
      })
    }


    // 判断获取用户的基本信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 跳转到注册页面
  registered:function(e){
    wx.navigateTo({
      url:"../registered/registered"
    })

  },

  // 跳转管理员页面
  administrator:function(e){
    wx.navigateTo({
      url:"../../Admin/admin_main/admin_main"
    })

  },


})

const app = getApp()

Page({
  data: {
    // 判断是否为管理员
    admin: false,
    userData:[],
  },

  onLoad: function () {
    // 判断是否显示管理员页面
    if(app.globalData.userCloudData.admin){
      this.setData({
        admin:true
      })
    }
    this.setData({
      userData:app.globalData.userCloudData
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

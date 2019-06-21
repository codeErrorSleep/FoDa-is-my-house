Page({

  // 跳转到注册页面
  adminSH: function (e) {
    wx.navigateTo({
      url: "../secondHand/secondHand"
    })

  },

  // 跳转管理员页面
  adminUA: function (e) {
    wx.navigateTo({
      url: "../user/user"
    })

  },
  


})
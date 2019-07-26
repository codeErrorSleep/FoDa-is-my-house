var util = require('../../../utils/util.js')
const app = getApp()

Page({
  data: {
    // 判断是否为管理员
    admin: false,
    userData:[],
    //头像列表
    swiperList: [],
    openid:"",
  },

  onLoad: function () {
    // this.uploadUser()
    // 判断是否显示管理员页面
    if(app.globalData.userCloudData.admin){
      this.setData({
        admin:true
      })
    }
    this.setData({
      swiperList: app.globalData.swiperList,
      userData:app.globalData.userCloudData
    })


  },

  onShow: function (options) {
    // this.uploadUser()
    // 判断是否显示管理员页面
    if (app.globalData.userCloudData.admin) {
      this.setData({
        admin: true
      })
    }
    this.setData({
      swiperList: app.globalData.swiperList,
      userData: app.globalData.userCloudData
    })

    //获取用户的openid并设置为全局变量
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('callFunction test result: ', res)
        this.setData({
          openid: res.result.openid
        })
        util.getUserInCloud(this.data.openid);
      }
    })
  },

  


  //跳转到个人信息页面
  userInfo:function() {
    wx.navigateTo({
      url: "../userInfo/userInfo"
    })
  },

  // 跳转到注册页面
  registered:function(){
    wx.navigateTo({
      url:"../registered/registered"
    })

  },

  // 跳转我的页面
  showMyGoods:function(e){
    console.log(e.currentTarget.id)
    if(e.currentTarget.id=="2"){
      wx.navigateTo({
        // url:"../../News/myGoods/myGoods?tab_id=" +e.currentTarget.id
        url:"../../News/myDiscover/myDiscover?tab_id=" +e.currentTarget.id
      })
    }else if(e.currentTarget.id=="1"){
      wx.navigateTo({
        // url:"../../News/myGoods/myGoods?tab_id=" +e.currentTarget.id
        url:"../../News/myExpress/myExpress?tab_id=" +e.currentTarget.id
      })
    }else if(e.currentTarget.id=="0"){
      wx.navigateTo({
        // url:"../../News/myGoods/myGoods?tab_id=" +e.currentTarget.id
        url:"../../News/myGoods/myGoods?tab_id=" +e.currentTarget.id
      })
    }
  },


  // 跳转管理员页面
  administrator:function(){
    wx.navigateTo({
      url:"../../Admin/admin_main/admin_main"
    })

  },

  //检查用户是否已经注册
  checkUser:function(){
    console.log(this.data.userData)
    if (this.data.userData != "") {
      this.userInfo()
    }else {
      this.registered()
    }
  },

  uploadUser: function () {
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'uploadUser',
      },
      success: res => {
        console.warn('[云函数] [openapi] uploadUser 调用成功：', res)
        wx.showModal({
          title: '发送成功',
          content: '成功发送信息',
          showCancel: false,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [openapi] uploadUser 调用失败：', err)
      }
    })
  },
})

var util = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户提交注册的数量
    userNum: 0
  },


  onShow: function (options) {
    this.userCount()
  },



  userCount: function (e) {
    var that = this
    const db = wx.cloud.database()
    db.collection('users').where({
      "al_approve": false
    }).count().then(res => {
      console.log(res)
      console.log(res.total)
      that.setData({
        userNum: res.total
      })
    })
  },

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



  // 发送注册模板消息
  sendRegistered: function (e) {
    var id = e.detail.target.id
    var approve = ""
    if (id == "1") {
      var approve = "认证成功"
    }
    else if (id == "2") {
      var approve = "认证不成功"
    }

    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendRegisteredMessage',
        approve: approve,
        user_openid: app.globalData.userCloudData._openid
      },
      success: res => {
        console.warn('[云函数] [openapi] subscribeMessage.send 调用成功：', res)
      },
      fail: err => {
        console.error('[云函数] [openapi] subscribeMessage.send 调用失败：', err)
      }
    })
  },


  // 发送快递模板消息
  sendExpress: function (e) {
    var id = e.detail.target.id
    if (id == "3") {
      var orders = "代收成功"
      // var orders = "求助成功"

    } else if (id == "4") {
      var orders = "代收失败"
    }

    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendExpressTemplate',
        orders: orders,
        user_openid: app.globalData.userCloudData._openid
      },
      success: res => {
        console.warn('[云函数] [openapi] subscribeMessage.send 调用成功：', res)
      },
      fail: err => {
        console.error('[云函数] [openapi] subscribeMessage.send 调用失败：', err)
      }
    })
  },



  // 发送求助模板消息
  sendRecourse: function (e) {
    var id = e.detail.target.id
    if (id == "5") {
      var orders = "求助成功"
      // var orders = "求助成功"

    } else if (id == "6") {
      var orders = "求助失败"
    }

    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendRecourseTemplate',
        orders: orders,
        user_openid: app.globalData.userCloudData._openid
      },
      success: res => {
        console.warn('[云函数] [openapi] subscribeMessage.send 调用成功：', res)
      },
      fail: err => {
        console.error('[云函数] [openapi] subscribeMessage.send 调用失败：', err)
      }
    })
  },





  // 测试任何东西
  testDing: function (e) {
    wx.requestSubscribeMessage({
      // 依次为注册,快递,帮帮这三个订阅消息
      tmplIds: ['5PHcG60eH76swsvB351m8G6SENp1IKQceZqivYQkUA4',
                'l3MDM8SSqxszV1FJ-TY-LxJTKo5m0Djf--ZVXrWLbzA',
                'ILE1bwSQDi7ctxacKh7yYhgBuh7esx6xfr68OKOhTCs'
    ],
      success (res) {
        console.log("订阅成功")
      },
      fail(err) {
        //失败
        console.error(err);
        }
    })
  },

})
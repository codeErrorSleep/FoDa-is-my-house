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


  // 跳转管理员页面
  formSubmit: function (e) {
    var that = this
    var formId = e.detail.formId
    var id = e.detail.target.id
    console.log(id)
    console.log("上传数据")
    const db = wx.cloud.database()
    db.collection("users").doc(app.globalData.userCloudData._id).update({
      data: {
        "formId": formId,
      },
      success: function (res) {
        //成功上传后提示信息
        console.log("上传成功")
        app.globalData.userCloudData.formId = formId
        console.log(app.globalData.userCloudData.formId)
        if (id == "1" || id == "2") {
          that.sendRegistered(id)
        } else {
          that.sendExpress(id)
        }

      }
    })
  },


  // 发送注册模板消息
  sendRegistered: function (id) {
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
        action: 'sendTemplateMessage',
        formId: app.globalData.userCloudData.formId,
        approve: approve,
        user_openid: app.globalData.userCloudData._openid
      },
      success: res => {
        console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
      },
      fail: err => {
        console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
      }
    })
  },


  // 发送快递模板消息
  sendExpress: function (id) {
    if (id == "3") {
      var orders = "快递代收成功"
      // var orders = "求助成功"

    } else if (id == "4") {
      var orders = "快递代收失败"
    }

    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendExpressTemplate',
        // action: 'sendRecourseTemplate',

        formId: app.globalData.userCloudData.formId,
        orders: orders,
        user_openid: app.globalData.userCloudData._openid
      },
      success: res => {
        console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
      },
      fail: err => {
        console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
      }
    })
  },




  // 测试任何东西
  testAnything: function (e) {

  },

})
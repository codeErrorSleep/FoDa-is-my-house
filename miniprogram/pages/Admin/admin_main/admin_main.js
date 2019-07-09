var util = require('../../../utils/util.js')
const app = getApp()

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
  

  // 跳转管理员页面
  formSubmit: function (e) {
    var formId=e.detail.formId
    console.log("上传数据")
    const db = wx.cloud.database()
    db.collection("users").doc(app.globalData.userCloudData._id).update({
      data: {
        "formId":formId,
      },
      success: function (res) {
        //成功上传后提示信息
        console.log("上传成功")
        app.globalData.userCloudData.formId=formId
        console.log(app.globalData.userCloudData.formId)
      }
    })
  },
  

  // 发送注册模板消息
  sendRegistered: function (res) {
    var approve=""
    if(res.target.id == 1){
      var approve="认证成功"
    }
    else if(res.target.id == 2){
      var approve="认证不成功"
    }

    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendTemplateMessage',
        formId: app.globalData.userCloudData.formId,
        // wechat_id:"sfeesfe",
        // user_openid:"gdsrgr"
        approve:approve,
        user_openid:app.globalData.userCloudData._openid
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
  sendExpress: function (res) {
    if(res.target.id == 3){
      var orders="快递代收成功"
    }else if(res.target.id == 4){
      var orders="快递代收失败"
    }

    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendExpressTemplate',
        formId: app.globalData.userCloudData.formId,
        orders:orders,
        user_openid:app.globalData.userCloudData._openid
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
    wx.cloud.callFunction({
      name:'updataExpress',
      data:{
        express_id:"f1006ad85d1dd4ab00bda96764f958ba",
        receiver_wechat_id:"sfeefse",
        receiver_phone:"123145432",
      },success:function(res){
      console.log("修改成功"+ res)
      },fail:function(res){
      console.log(res)
      }
      })

  },

})
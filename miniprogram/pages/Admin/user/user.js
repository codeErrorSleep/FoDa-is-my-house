var util = require('../../../utils/util.js')
var app = getApp()
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //获取的二手物品数据
    feed: [],
    //下拉继续读取数据
    nextPage: 0,
    //用户id openid
    openid: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    // 改变选项卡的值
    console.log(options.tab_id)
    that.setData({
      currentData: options.tab_id,
      openid: app.globalData.openid
    })
    //调用获取用户信息数据
    this.nextLoad();
  },



  // 拖到最下面更新数据
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    // setTimeout(function(){wx.hideNavigationBarLoading();that.nextLoad();}, 1000);
    that.nextLoad();
    console.log("lower")
  },

  // 在云数据库上查找数据(查找10条)
  nextLoad: function () {
    var that = this;
    util.nextLoad('users', that, ".");
  },

  // 通过用户信息验证
  updateUser: function (e) {
    const idx = e.target.dataset.idx
    //获得用户记录id 不是oppenid
    var user_id = this.data.feed[idx]._id
    var user_openid=this.data.feed[idx]._openid
    var users_Name = this.data.feed[idx].name
    var formId=this.data.feed[idx].formId

    // 更新数据库 用户消息
    wx.showModal({
      title: '认证通过',
      content: users_Name,
      success(res) {
        // 通过用户验证
        const db = wx.cloud.database()
        db.collection('users').doc(user_id).update({
          // 更新数据    已验证用户   用户通过
          data: {
            approve:"Ture",
            al_approve:"Ture"
          },
          success: res => {
            console.log(res)
            wx.showToast({
              title: '验证成功',
              icon: 'success',
              duration: 1000
            })
          },
          fail: err => {
            icon: 'none',
            console.error('[数据库] [更新记录] 失败：', err)
          }
        })
      }
    })

    // 调用模板消息发送消息
    this.sendTemplate("Ture",user_openid,formId)

  },

  // 发送模板消息
  sendTemplate:function(approve,user_openid,formId){
    console.log(user_openid)
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendTemplateMessage',
        formId: formId,
        approve:approve,
        user_openid:user_openid
      },
      success: res => {
        console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
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
        console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
      }
    })
  },

  //不通过用户验证
  removeUser: function (e) {
    const idx = e.target.dataset.idx
    //获得帖子id
    var user_id = this.data.feed[idx]._id
    var users_Name = this.data.feed[idx].name
    wx.showModal({
      title: '认证不通过',
      content: users_Name,
      success(res) {
        // 通过用户验证
        const db = wx.cloud.database()
        db.collection('users').doc(user_id).update({
          // 更新数据    已验证用户   用户不通过
          data: {
            approve:"False",
            al_approve:"Ture"
          },
          success: res => {
            console.log(res)
            wx.showToast({
              title: '验证不通过',
              icon: 'success',
              duration: 1000
            })
          },
          fail: err => {
            icon: 'none',
            console.error('[数据库] [更新记录] 失败：', err)
          }
        })
      }
    })
    // 调用模板消息发送消息
    this.sendTemplate("False",user_openid,formId)

  },




})
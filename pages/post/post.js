// pages/post/post.js
var util = require('../../utils/util.js')
var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: "",
    post_id: "",
    post_data: {},
    user_data: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user_id: options.user_id,
      post_id: options.post_id
    })
    this.getData()


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //使用本地 fake 数据实现刷新效果
  getData: function () {
    // console.log(this.data.user_id)
    console.log(this.data.post_id)
    // 调用util中的函数获取数据
    var post_data = util.getPostData(this.data.post_id)
    var user_data = util.getUserData(this.data.user_id)

    console.log(post_data)
    console.log(user_data)
    this.setData({
      post_data: post_data,
      user_data: user_data
    })
  },

  showConnect: function (e) {
    // 判断微信定系手机
    var promptTitle=""
    var content=""
    if(e.currentTarget.id==="wechatButton"){
      promptTitle="卖家微信"
      content=this.data.user_data.wechat_id
    }
    else{
      promptTitle="卖家手机号码"
      content=(this.data.user_data.phone_num).toString()
    }

    console.log(promptTitle)
    console.log(content)
    wx.showModal({
      title: promptTitle,
      content: content,
      confirmText:"复制",
      success: function (res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: content,
            success: function (res) {
              wx.showToast({
                title: '复制成功',
              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  copyText:function(connectWay){
    var that = this;
    wx.setClipboardData({
      data: that.data,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  }


})
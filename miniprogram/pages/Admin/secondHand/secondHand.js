// pages/myGoods/myGoods.js

var util = require('../../../utils/util.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //获取的二手物品数据
    feed: [],
    feed_length: 0,
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
    //调用获取二手商品数据
    this.nextLoad();
  },

  // 完成选项卡的跳转
  // bindchange: function (e) {
  //   const that = this;
  //   that.setData({
  //     currentData: e.detail.current
  //   })

  // },

  // 分析选项卡是否正确
  // checkCurrent: function (e) {
  //   const that = this;
  //   if (that.data.currentData === e.target.dataset.current) {
  //     return false;
  //   } else {
  //     that.setData({
  //       currentData: e.target.dataset.current
  //     })
  //   }
  // },


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
    util.nextLoad('post', that, ".");
  },

  //跳转到点击页面
  jumpToPost: function (e) {
    var id = e.currentTarget.id
    console.log(e.currentTarget.id)
    console.log(this.data.feed[id])
    var post_data = JSON.stringify(this.data.feed[id])
    wx.navigateTo({
      // url: '../posttest/posttest?post_data=' + post_data
      url: '../contact/contact?post_data=' + post_data

    })
  },

  //点击删除帖子
  removeImage: function (e) {
    const idx = e.target.dataset.idx
    //获得帖子id
    var post_id = this.data.feed[idx]._id
    var goods_Name = this.data.feed[idx].title
    wx.showModal({
      title: '删除物品',
      content: goods_Name,
      success(res) {
        //用户点击删除就删除帖子
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection('post').doc(post_id).remove({
            //删除成功显示提示
            success: function (res) {
              console.log("删除成功")
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
            }
          })
        }
      }
    })
  },



})
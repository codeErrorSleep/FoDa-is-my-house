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
    openid: "",
    //读取的数据库
    database: 'post',

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
    this.allLoad();
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
    // setTimeout(function(){wx.hideNavigationBarLoading();that.allLoad();}, 1000);
    that.allLoad();
    console.log("lower")
  },

  // 在云数据库上查找数据(查找10条)
  allLoad: function () {
    var that = this;
    util.allLoad(that);
  },

  //跳转到点击页面
  jumpToPost: function (e) {
    var id = e.currentTarget.id
    console.log(e.currentTarget.id)
    console.log(this.data.feed[id])
    var post_data = JSON.stringify(this.data.feed[id])
    wx.navigateTo({
      // url: '../posttest/posttest?post_data=' + post_data
      url: '../../Index/contact/contact?post_data=' + post_data
    })
  },


  // 删除云上的图片
  removeImage: function (post_imgs) {
    console.log(post_imgs)
    // 不删除默认图片
    if(post_imgs[0]!="cloud://yf-ab2989.7966-yf-ab2989-1258230310/没有实物图.png"){
      wx.cloud.deleteFile({
        fileList: post_imgs
      }).then(res => {
        console.log(res.fileList)
      }).catch(error => {
      })
      console.log("成功删除图片")
    }

  },




  //点击删除帖子
  removePost: function (e) {
    var idx = e.target.dataset.idx
    //获得帖子id
    var post_id = this.data.feed[idx]._id
    var goods_Name = this.data.feed[idx].title
    var post_imgs=this.data.feed[idx].imgs
    var that=this
    wx.showModal({
      title: '删除物品',
      content: goods_Name,
      success(res) {
        //用户点击删除就删除帖子
        if (res.confirm) {
          // 删除云上的帖子的图片
          that.removeImage(post_imgs)
          // 调用云函数删除数据库中的数据
          wx.cloud.callFunction({
            name: 'deletePost',
            data: {
              post_id: post_id,
              database:"post",
            }, success: function (res) {
              console.log("删除成功")
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
            }, fail: function (res) {
              console.log(res)
            }
          })



        }
      }
    })
  },



})
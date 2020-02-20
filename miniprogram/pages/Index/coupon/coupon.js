// pages/Index/coupon/coupon.js
var util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //窗口宽度
    windowWidth: 0,
    // 优惠券列表
    feed: [],
    // 页数
    nextPage: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: wx.getSystemInfoSync().windowWidth,
    })

    this.allLoad()

  },


  // 跳转到公众号文章
  jumpToPublic:function(e){
    var id = e.currentTarget.id
    // console.log(id)

    // 判断用户的注册类型
    util.isRegistered()


  },




  // 读取数据库中所有优惠券信息
  allLoad: function () {
    var that = this;
    const db = wx.cloud.database()
    db.collection('coupon')
      .orderBy('date', 'desc')
      .skip(that.data.nextPage)
      .get({
        //成功读取写入数据
        success: res => {
          that.setData({
            feed: this.data.feed.concat(res.data),
            nextPage: this.data.nextPage + 10
          })
          console.log('[数据库] [查询记录] 成功: ', that.data.feed)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      });
    console.log(this.data.feed)


  },

  showCooperationPhoto: function () {
    var images = ["cloud://yf-ab2989.7966-yf-ab2989-1258230310/没有实物图.png"]
    wx.previewImage({
      current: images[0],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })


  }
})
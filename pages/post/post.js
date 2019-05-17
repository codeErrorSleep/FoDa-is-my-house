// pages/post/post.js
var util = require('../../utils/util.js')
var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id:"",
    goods_id:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user_id:options.user_id,
      goods_id:options.goods_id
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
  getData: function(){
    // console.log(this.data.user_id)
    console.log(this.data.goods_id)

    var goods_data=util.getGoodsData(this.data.goods_id)
    // var user_data=util.getUserData(this.data.user_id)

    console.log(goods_data)
    // console.log(user_data)


  },
})
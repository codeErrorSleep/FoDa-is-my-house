var util = require('../../../utils/util.js')
const app = getApp()

// miniprogram/pages/Index/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //搜索关键词
    keyword: "",
    //闲置数据库
    database: "post",
    //数据库数据
    feed: [],
    //下拉更新数据库数据个数
    nextPage: 0,
    //我的页面
    searchPage: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  // 记录搜索关键词
  inputKeyword: function (e) {
    var data = e.detail.value;
    this.setData({
      keyword: data,
    })
  },

  //通过关键词搜索闲置商品
  searchByKeyword: function() {
    this.setData({
      feed: [],
      nextPage: 0,
    })
    if (this.data.keyword == '') {
      this.setData({
        keyword: '.',
      })
    }
    var that = this
    util.searchLoad(that)
  },

  // 拖到最下面更新数据
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    util.searchLoad(that);
    console.log("lower");
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

})
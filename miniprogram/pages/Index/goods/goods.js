var util = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    feed: [],
    feed_length: 2,
    //下拉继续读取数据
    nextPage:0
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
      currentData: options.tab_id
    })
    //调用应用实例的方法获取全局数据
    this.nextLoad();

  },
  //完成选项卡的跳转
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })

  },
  //分析选项卡是否正确
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
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
  nextLoad: function(){
    var that=this;
    util.nextLoad('post',that, ".");
  },

    //跳转到点击页面
    jumpToPost: function(e){
      var id=e.currentTarget.id
      console.log(e.currentTarget.id)
      console.log(this.data.feed[id])
      var post_data=JSON.stringify(this.data.feed[id])
      wx.navigateTo({
        // url: '../posttest/posttest?post_data=' + post_data
        url: '../contact/contact?post_data=' + post_data
      
      })
    },



})
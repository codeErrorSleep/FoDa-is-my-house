var util = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //闲置分类导航栏
    categories: ["我的发布", "我的接单"],
    //主导航栏下标
    currentIndex: 0,
    //分类导航栏下标
    currentData: 0,
    //所要读取的数据库
    database: 'express',
    //数据库数量
    count: "",
    //数据库数据
    feed: [],
    accFeed: [],
    //下拉更新数据库数据个数
    nextPage: 0,
    nextPage1: 0,
    //我的页面
    myPage: true,
    // 可用屏幕高度
    windowHeight:0,
    //用户openid
    user_openid: "",

  },

  //页面加载时读取数据库
  onLoad: function (options) {
    // 计算屏幕可用高度
    try {
      const res = wx.getSystemInfoSync()
      console.log(res.windowHeight)
      this.setData({
        windowHeight:0.8*res.windowHeight-10
      })
    } catch (e) {}
    this.setData({
      user_openid: app.globalData.userCloudData._openid,
    })
    // 根据电机查找数据库
    this.navbarTab();
  },

  onShow:function(res){
  },

  //点击更新主导航栏下标
  navbarTab: function (e) {
    if (e) {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      });
    }
    var that = this;
    that.setData({
      feed: [],
      count: 0,
      nextPage1: 0,
      database: 'express',
      currentData: 0,
    })
    this.dbLoad();
  },

  //点击更新主导航栏下标
  categoriesTab: function (e) {
    this.setData({
      // currentIndex: e.currentTarget.dataset.index
      currentData: e.currentTarget.dataset.index
    })
    console.log(this.data.currentData)

  },

  //更新副导航栏下标
  // 我的快递没可以滑动
  categoriesChange: function (e) {
    let current = e.detail.current;
    let source = e.detail.source
    console.log("ffffffffffffffffff")
    //console.log(source);
    // 这里的source是判断是否是手指触摸 触发的事件
    if (source === 'touch') {
      this.setData({
        currentData: current
      })
      console.log(this.data.currentData)
      // 判断如果为寻物和找队友则更改搜索的数据库
    }
  },




  // 拖到最下面更新数据
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    // setTimeout(function(){wx.hideNavigationBarLoading();that.dbLoad();}, 1000);
    that.dbLoad();
    console.log("lower")
  },

  // 调用util.js中读取数据库函数
  dbLoad: function () {
    var that = this;
    if (that.data.currentIndex==1){
      util.experssLoad(that, '.');
    }else{
      console.log('ask:', that.data.database);
      util.dbLoad(that.data.database, that, '.');
    }
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

  //快递跳转到点击页面
  jumpToExpress: function(e) {
    var id = e.currentTarget.id
    var express_data = JSON.stringify(this.data.feed[id])
    wx.navigateTo({
      url: '../../Index/contact_express/contact_express?express_data=' + express_data
    })
  },

  //快递跳转到点击页面
  jumpToExpress1: function(e) {
    var id = e.currentTarget.id
    var express_data = JSON.stringify(this.data.accFeed[id])
    wx.navigateTo({
      url: '../../Index/contact_express/contact_express?express_data=' + express_data
    })
  },

  

})
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
    //数据库待接单数量
    count: 0,

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
    // 根据点击查找数据库
    this.categoriesTab();
  },

  onShow:function(res){
  },

  //点击更新主导航栏下标
  categoriesTab: function (e) {
    if (e) {
      this.setData({
        currentData: e.currentTarget.dataset.index
      });
    }
    var that = this;
    that.setData({
      feed: [],
      accFeed: [],
      nextPage: 0,
      nextPage1: 0,
      count: 0,
      database: 'express',
    })
    console.log(this.data.currentData)
    this.userLoad();
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
    // setTimeout(function(){wx.hideNavigationBarLoading();that.userLoad();}, 1000);
    that.userLoad();
    console.log("lower")
  },

  // 调用util.js中读取数据库函数
  userLoad: function () {
    var that = this;
    if (that.data.currentData==0){
      util.countUnAcc(that, that.data.user_openid);
      util.accUnAccLoad(that, that.data.user_openid);
    }else{
      util.accLoad(that);

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

  //删除商品
  deleteExpress: function (e) {
    var id = e.currentTarget.id
    //获得帖子id
    var express_id = this.data.feed[id]._id
    wx.showModal({
      title: '删除快递',
      success(res) {
        //用户点击删除就删除帖子
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection('express').doc(express_id).remove({
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
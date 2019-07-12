var util = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //主导航栏
    navbar: ["闲置", "快递", "发现"],
    //闲置分类导航栏
    categories: ["全部", "电器类", "学习类", "衣物类", "生活类", "其它"],
    //主导航栏下标
    currentIndex: 0,
    //分类导航栏下标
    currentData: 0,
    //所要读取的数据库
    database: 'post',
    //数据库数量
    count: "",
    //数据库数据
    feed: [],
    feed1: [],
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
    this.setData({
      currentIndex: options.tab_id,
      user_openid: app.globalData.userCloudData._openid,
    })
    var that = this
    util.countNoAccExpress(that);
    this.navbarTab();
  },

  onShow:function(res){
    try {
      const res = wx.getSystemInfoSync()
      console.log(res.windowHeight)
      this.setData({
        windowHeight:0.8*res.windowHeight-10
      })
    } catch (e) {
      // Do something when catch error
    }
    console.log(this.data.windowHeight)

  },

  //点击更新主导航栏下标
  navbarTab: function (e) {
    if (e) {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      });
    }
    var that = this;
    if (that.data.currentIndex == 0) {
      that.setData({
        feed: [],
        nextPage: 0,
        categories: ["全部", "电器类", "学习类", "衣物类", "生活类", "其它"],
        database: 'post',
        currentData: 0,
      })
    } else if (that.data.currentIndex == 1) {
      that.setData({
        feed: [],
        feed1: [],
        count: 0,
        nextPage: 0,
        nextPage1: 0,
        categories: ["我的发布", "我的接单"],
        database: 'express',
        currentData: 0,
      })
    } else if (that.data.currentIndex == 2) {
      that.setData({
        feed: [],
        nextPage: 0,
        categories: ["全部", "求助", "寻物", "找队友"],
        database: 'discover',
        currentData: 0,
      })
    };
    this.dbLoad();
  },

  //点击更新闲置分类导航栏下标
  categoriesTab: function (e) {
    this.setData({
      currentData: e.currentTarget.dataset.index
    })
  },

  //滑动更新闲置分类导航栏下标
  categoriesChange: function (e) {
    this.setData({
      currentData: e.detail.current
    })
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
      util.countNoAccExpress(that);
      util.noAccExpress(that, app.globalData.userCloudData._openid);
      util.accExpress(that, app.globalData.userCloudData._openid);
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

  //删除商品
  deleteGood: function(e) {
    var id = e.currentTarget.id
    //获得帖子id
    var post_id = this.data.feed[id]._id
    var goods_name = this.data.feed[id].title
    wx.showModal({
      title: '删除物品',
      content: goods_name,
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





  //删除快递
  deleteExpress: function(e) {
    var id = e.currentTarget.id
    //获得帖子id
    var express_id = this.data.feed[id]._id
    var deadline_date = this.data.feed[id].deadline_date

    console.log(express_id)
    console.log(deadline_date)

    wx.showModal({
      title: '删除快递信息',
      content:"是否删除 "+deadline_date+" 的快递信息",
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

  //删除发现
  deleteDiscover: function(e) {
    var id = e.currentTarget.id
    //获得帖子id
    var discover_id = this.data.feed[id]._id
    var discover_name = this.data.feed[id].title

    console.log(discover_id)
    console.log(discover_name)

    wx.showModal({
      title: '删除发现',
      content:"是否删除标题为"+discover_name+" 的发现",
      success(res) {
        //用户点击删除就删除帖子
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection('discover').doc(discover_id).remove({
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
    var express_data = JSON.stringify(this.data.feed1[id])
    wx.navigateTo({
      url: '../../Index/contact_express/contact_express?express_data=' + express_data
    })
  },

  

})
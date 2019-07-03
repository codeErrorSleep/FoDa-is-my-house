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
    //数据库数据
    feed: [],
    //下拉更新数据库数据个数
    nextPage: 0,
    //我的页面
    myPage: true,
  },

  //页面加载时读取数据库
  onLoad: function (options) {
    this.setData({
      currentIndex: options.tab_id,
    })
    this.navbarTab();
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
        nextPage: 0,
        categories: ["全部", "电器类", "学习类", "衣物类", "生活类", "其它"],
        database: 'post',
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
    console.log('ask:', that.data.database);
    util.dbLoad(that.data.database, that, app.globalData.userCloudData._openid);
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
    var goods_Name = this.data.feed[id].title
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

  //删除发现
  deleteDiscover: function(e) {
    var id = e.currentTarget.id
    //获得帖子id
    var discover_id = this.data.feed[id]._id
    var discover_Name = this.data.feed[id].title
    wx.showModal({
      title: '删除发现',
      content: discover_Name,
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
  }

})
var util = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //主导航栏
    navbar: ["求助", "寻物", "找队友"],
    // 现在所在的navbar
    navbarNow:"",
    //闲置分类导航栏
    categories: ["我的发布", "我的接单"],
    //主导航栏下标
    currentIndex: 0,
    //分类导航栏下标
    currentData: 0,
    //所要读取的数据库
    database: 'recourse',
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
    this.setData({
      user_openid: app.globalData.userCloudData._openid,
    })
    var that = this
    // 根据电机查找数据库
    this.navbarTab();
  },

  onShow:function(res){
    // 计算屏幕可用高度
    try {
      const res = wx.getSystemInfoSync()
      console.log(res.windowHeight)
      this.setData({
        windowHeight:0.8*res.windowHeight-10
      })
    } catch (e) {}

  },

  //点击更新主导航栏下标
  navbarTab: function (e) {
    var that = this;
    if (e) {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      });
    }

    this.setData({
      navbarNow:this.data.navbar[this.data.currentIndex]
    })
    console.log(this.data.navbarNow)

    // if (this.data.currentIndex != "0") {
    //   this.discoverType()
    // }
    // 根据所选tab更改查找的数据库
    this.discoverType()


    // if (that.data.currentIndex == 0) {
    //   that.setData({
    //     feed: [],
    //     nextPage: 0,
    //     categories: ["我的发布", "我的接单"],
    //     database: 'recourse',
    //     currentData: 0,
    //   })
    // } else if (that.data.currentIndex == 1) {
    //   that.setData({
    //     feed: [],
    //     accFeed: [],
    //     count: 0,
    //     nextPage: 0,
    //     nextPage1: 0,
    //     categories: [],
    //     database: 'discover',
    //     currentData: 0,
    //   })
    // } else if (that.data.currentIndex == 2) {
    //   that.setData({
    //     feed: [],
    //     nextPage: 0,
    //     categories: [],
    //     database: "discover",
    //     currentData: 0,
    //   })
    // };
    // this.dbLoad();
  },

  //滑动更新主导航栏下标
  categoriesTab: function (e) {
    this.setData({
      // currentIndex: e.currentTarget.dataset.index
      currentData: e.currentTarget.dataset.index
    })
    console.log(this.data.currentData)

    // 判断如果为寻物和找队友则更改搜索的数据库
    if (this.data.currentIndex == "2") {
      // 根据所选tab更改查找的数据库
      this.discoverType()
    }
  },

  //更新副导航栏下标
  categoriesChange: function (e) {
    let current = e.detail.current;
    let source = e.detail.source
    //console.log(source);
    // 这里的source是判断是否是手指触摸 触发的事件
    if (source === 'touch') {
      this.setData({
        currentData: current
      })
      console.log(this.data.currentData)
      // 判断如果为寻物和找队友则更改搜索的数据库
        // 根据所选tab更改查找的数据库
        this.discoverType()
    }
  },


  // 判断发现 的分类(求助 寻物 找队友)
  discoverType: function () {
    this.setData({
      feed: [],
      nextPage: 0,
      categories: [],
      database: "discover",

    })
    if (this.data.currentIndex == "0") {
      this.setData({
        database: "recourse",
        categories: ["我的发布", "我的接单"],
      })
      this.dbLoad();
    } else if (this.data.currentIndex == "1") {
      util.discoverLoad("寻物", this);

    }
    else {
      util.discoverLoad("找队友", this);
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
    var discover_id = this.data.feed[id]._id
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
  deletePost: function(e) {
    var id = e.currentTarget.id
    //获得帖子id
    var post_id = this.data.feed[id]._id
    var post_name = this.data.feed[id].title

    var database="recourse"
    if(this.data.feed[id].type!="求助"){
      database="discover"
    }

    console.log(post_id)
    console.log(post_name)

    wx.showModal({
      title: '删除发现',
      content:"是否删除标题为"+post_name+" 的发现",
      success(res) {
        //用户点击删除就删除帖子
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection(database).doc(post_id).remove({
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
    var express_data = JSON.stringify(this.data.accFeed[id])
    wx.navigateTo({
      url: '../../Index/contact_express/contact_express?express_data=' + express_data
    })
  },

  

})
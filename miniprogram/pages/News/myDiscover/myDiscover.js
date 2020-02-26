var util = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //主导航栏
    categories: ["求助", "寻物", "找队友"],
    //闲置分类导航栏
    categories1: ["我的发布", "我的接单"],
    //分类导航栏下标
    currentData: 0,
    currentData1: 0,
    //所要读取的数据库
    database: 'recourse',
    //数据库数量
    count: "",
    //数据库数据
    feed: [],
    //下拉更新数据库数据个数
    nextPage: 0,
    //我的页面
    myPage: true,
    //用户openid
    user_openid: "",
  },

  //页面加载时读取数据库
  onLoad: function (options) {
    this.setData({
      user_openid: app.globalData.userCloudData._openid,
    })
    // 根据点击查找数据库
    this.categoriesTab();
  },

  //滑动更新主导航栏下标
  categoriesTab: function (e) {
    if (e) {
      this.setData({
        currentData: e.currentTarget.dataset.index
      });
    }
    var that = this;
    that.setData({
      feed: [],
      nextPage: 0,
      count: 0,
    })
    console.log(this.data.currentData)
    this.discoverType();
  },

  //滑动更新主导航栏下标
  categories1Tab: function (e) {
    if (e) {
      this.setData({
        currentData1: e.currentTarget.dataset.index
      });
    }
    var that = this;
    that.setData({
      feed: [],
      nextPage: 0,
      count: 0,
    })
    console.log(this.data.currentData1)
    this.discoverType();
  },

  //更新副导航栏下标
  categoriesChange: function (e) {
    var that = this;
    that.setData({
      feed: [],
      nextPage: 0,
      count: 0,
    })
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
    var that = this;
    if (this.data.currentData == 0) {
      this.setData({
        database: "recourse",
        categories1: ["我的发布", "我的接单"],
      })
      if (this.data.currentData1 == 0) {
        util.onlyLoad(that);
      }else {
        util.accLoad(that);
      }
    } else if (this.data.currentData == 1) {
      this.setData({
        database: "discover",
        categories1: "",
      })
      util.discoverLoad("寻物", that);
    }else {
      this.setData({
        database: "discover",
        categories1: "",
      })
      util.discoverLoad("找队友", that);
    }
  },


  // 拖到最下面更新数据
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    // setTimeout(function(){wx.hideNavigationBarLoading();that.userLoad();}, 1000);
    that.discoverType();
    console.log("lower")
  },

  //跳转到点击页面
  jumpToPost: function (e) {
    var id = e.currentTarget.id
    console.log(e.currentTarget.id)
    console.log(this.data.feed[id])
    var post_data = JSON.stringify(this.data.feed[id])

    if (this.data.feed[id].type == "求助") {
      wx.navigateTo({
        // url: '../posttest/posttest?post_data=' + post_data
        url: '../../Index/contact_recourse/contact_recourse?post_data=' + post_data
      })
    } else {
      wx.navigateTo({
        // url: '../posttest/posttest?post_data=' + post_data
        url: '../../Index/contact/contact?post_data=' + post_data
      })
    }
  },



  //删除发现
  deletePost: function(e) {
    var that=this
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
              that.setData({
                count: 0,
                feed: [],
                nextPage: 0,
              })
              that.discoverType();
            }
          })
        }
      }
    })
  },



})
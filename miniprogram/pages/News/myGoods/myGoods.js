var util = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //闲置分类导航栏
    categories: ["全部", "电器类", "学习类", "衣物类", "生活类", "其它"],
    //分类导航栏下标
    currentData: 0,
    //所要读取的数据库
    database: 'post',
    //数据库数量
    count: "",
    //数据库数据
    feed: [],
    //下拉更新数据库数据个数
    nextPage: 0,
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
    console.log(res)
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
    if (e) {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      });
    }
    var that = this;
    that.setData({
      feed: [],
      nextPage: 0,
      categories: ["全部", "电器类", "学习类", "衣物类", "生活类", "其它"],
      currentData: 0,
    })

    this.userLoad();
  },

  //滑动更新主导航栏下标
  categoriesTab: function (e) {
    this.setData({
      // currentIndex: e.currentTarget.dataset.index
      currentData: e.currentTarget.dataset.index
    })
    console.log(this.data.currentData)
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
    if (that.data.currentIndex==1){
      util.accUnAccLoad(that, '.');
    }else{
      console.log('ask:', that.data.database);
      util.userLoad(that);
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

  //删除发现
  deletePost: function(e) {
    var id = e.currentTarget.id
    //获得帖子id
    var post_id = this.data.feed[id]._id
    var post_name = this.data.feed[id].title

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

})